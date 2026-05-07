import { prisma } from "@/lib/prisma";

const TREND_DAYS = 7;
const TREND_WEEKS = 6;

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfWeek(date) {
  const next = startOfDay(date);
  const day = next.getDay();
  const diff = day === 0 ? 6 : day - 1;
  next.setDate(next.getDate() - diff);
  return next;
}

function toDayKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function formatWeekdayLabel(date) {
  return new Intl.DateTimeFormat("es-ES", { weekday: "short" })
    .format(date)
    .replace(/\./g, "")
    .replace(/^\w/, (char) => char.toUpperCase());
}

function formatDateLabel(date) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
  })
    .format(date)
    .replace(/\./g, "");
}

function buildCountMap(leads, bucketDate) {
  return leads.reduce((counts, lead) => {
    const dayKey = toDayKey(bucketDate(lead.createdAt));
    counts.set(dayKey, (counts.get(dayKey) ?? 0) + 1);
    return counts;
  }, new Map());
}

function buildTemporalSeries({
  startDate,
  periods,
  stepDays,
  counts,
  labelFormatter,
  dateLabelFormatter,
}) {
  return Array.from({ length: periods }, (_, index) => {
    const date = addDays(startDate, index * stepDays);
    const key = toDayKey(date);

    return {
      key,
      label: labelFormatter(date),
      dateLabel: dateLabelFormatter(date),
      value: counts.get(key) ?? 0,
    };
  });
}

export async function getLeadStats() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);
  const trendStart = new Date(todayStart);
  trendStart.setDate(trendStart.getDate() - (TREND_DAYS - 1));
  const currentWeekStart = startOfWeek(todayStart);
  const weeklyTrendStart = addDays(currentWeekStart, -7 * (TREND_WEEKS - 1));

  const [
    totalLeads,
    leadsHoy,
    leadsSemana,
    porEstado,
    porUrgencia,
    porCanal,
    recentLeads,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.lead.count({ where: { createdAt: { gte: weekStart } } }),
    prisma.lead.groupBy({ by: ["estado"], _count: true }),
    prisma.lead.groupBy({ by: ["urgencia"], _count: true }),
    prisma.lead.groupBy({ by: ["canal"], _count: true }),
    prisma.lead.findMany({
      where: { createdAt: { gte: weeklyTrendStart } },
      select: { createdAt: true },
    }),
  ]);

  const dailyTrend = buildTemporalSeries({
    startDate: trendStart,
    periods: TREND_DAYS,
    stepDays: 1,
    counts: buildCountMap(
      recentLeads.filter((lead) => lead.createdAt >= trendStart),
      startOfDay
    ),
    labelFormatter: formatWeekdayLabel,
    dateLabelFormatter: formatDateLabel,
  });

  const weeklyTrend = buildTemporalSeries({
    startDate: weeklyTrendStart,
    periods: TREND_WEEKS,
    stepDays: 7,
    counts: buildCountMap(recentLeads, startOfWeek),
    labelFormatter: formatDateLabel,
    dateLabelFormatter: formatDateLabel,
  });

  const hasRecentDailyVolume = dailyTrend.some((item) => item.value > 0);
  const evolucionTemporal = {
    granularity: hasRecentDailyVolume ? "day" : "week",
    items: hasRecentDailyVolume ? dailyTrend : weeklyTrend,
  };

  const cerradosGanados = porEstado.find(
    (state) => state.estado === "CERRADO_GANADO"
  )?._count ?? 0;
  const cerradosTotal =
    (porEstado.find((state) => state.estado === "CERRADO_GANADO")?._count ?? 0) +
    (porEstado.find((state) => state.estado === "CERRADO_PERDIDO")?._count ?? 0);

  return {
    totalLeads,
    leadsHoy,
    leadsSemana,
    tasaConversion:
      cerradosTotal > 0
        ? Math.round((cerradosGanados / cerradosTotal) * 100)
        : 0,
    porEstado: Object.fromEntries(
      porEstado.map((state) => [state.estado, state._count])
    ),
    porUrgencia: Object.fromEntries(
      porUrgencia.map((urgency) => [urgency.urgencia ?? "SIN_CLASIFICAR", urgency._count])
    ),
    porCanal: Object.fromEntries(
      porCanal.map((channel) => [channel.canal, channel._count])
    ),
    evolucionTemporal,
  };
}