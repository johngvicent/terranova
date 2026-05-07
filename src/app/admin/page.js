import Link from "next/link";
import { getLeadStats } from "@/lib/leads/stats";

const BRAND_COLORS = {
  primary: "#003e3c",
  primaryDark: "#002929",
  primaryLight: "#015251",
  accent: "#e35336",
  accentSoft: "#f0c1b6",
  surface: "#f8f5f2",
  surfaceStrong: "#dbe9e8",
  line: "#d3dfde",
};

const STATE_ORDER = [
  "NUEVO",
  "CONTACTADO",
  "EN_PROGRESO",
  "CERRADO_GANADO",
  "CERRADO_PERDIDO",
];

const URGENCY_ORDER = ["ALTA", "MEDIA", "BAJA", "SIN_CLASIFICAR"];
const CHANNEL_ORDER = ["WEB", "WHATSAPP", "EMAIL"];

const STATE_LABELS = {
  NUEVO: "Nuevo",
  CONTACTADO: "Contactado",
  EN_PROGRESO: "En progreso",
  CERRADO_GANADO: "Cerrado ganado",
  CERRADO_PERDIDO: "Cerrado perdido",
};

const URGENCY_LABELS = {
  ALTA: "Alta",
  MEDIA: "Media",
  BAJA: "Baja",
  SIN_CLASIFICAR: "Sin clasificar",
};

const CHANNEL_LABELS = {
  WEB: "Web",
  WHATSAPP: "WhatsApp",
  EMAIL: "Email",
};

const STATE_COLORS = {
  NUEVO: BRAND_COLORS.primary,
  CONTACTADO: BRAND_COLORS.primaryLight,
  EN_PROGRESO: "#2c7370",
  CERRADO_GANADO: BRAND_COLORS.accent,
  CERRADO_PERDIDO: BRAND_COLORS.surfaceStrong,
};

const URGENCY_COLORS = {
  ALTA: BRAND_COLORS.accent,
  MEDIA: "#d87a61",
  BAJA: BRAND_COLORS.primaryLight,
  SIN_CLASIFICAR: BRAND_COLORS.surfaceStrong,
};

const CHANNEL_COLORS = {
  WEB: BRAND_COLORS.primary,
  WHATSAPP: BRAND_COLORS.accent,
  EMAIL: BRAND_COLORS.primaryLight,
};

async function getStats() {
  try {
    return await getLeadStats();
  } catch {
    return null;
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats();
  const stateItems = buildAnalyticsItems(
    stats?.porEstado,
    STATE_ORDER,
    STATE_LABELS,
    STATE_COLORS
  );
  const urgencyItems = buildAnalyticsItems(
    stats?.porUrgencia,
    URGENCY_ORDER,
    URGENCY_LABELS,
    URGENCY_COLORS
  );
  const channelItems = buildAnalyticsItems(
    stats?.porCanal,
    CHANNEL_ORDER,
    CHANNEL_LABELS,
    CHANNEL_COLORS
  );
  const trend = stats?.evolucionTemporal ?? { granularity: "day", items: [] };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-heading font-bold text-text">Dashboard</h1>
        <p className="mt-2 max-w-2xl text-sm text-text-muted">
          Lectura rápida del pipeline comercial con foco en volumen, prioridad y
          origen de los leads.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          label="Leads Hoy"
          value={stats?.leadsHoy ?? "—"}
          color="bg-accent"
        />
        <KPICard
          label="Leads Esta Semana"
          value={stats?.leadsSemana ?? "—"}
          color="bg-primary"
        />
        <KPICard
          label="Total Leads"
          value={stats?.totalLeads ?? "—"}
          color="bg-primary-light"
        />
        <KPICard
          label="Tasa Conversión"
          value={stats?.tasaConversion != null ? `${stats.tasaConversion}%` : "—"}
          color="bg-green-600"
        />
      </div>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-primary/60">
              Analytics visuales
            </p>
            <h2 className="mt-2 text-xl font-heading font-bold text-text">
              Cuatro lecturas rápidas del pipeline
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-text-muted">
            Estados, urgencia, canales y evolución reciente se convierten en
            gráficos compactos para detectar saturación, prioridad y origen sin
            salir del dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <StatusAnalyticsCard items={stateItems} />
          <UrgencyAnalyticsCard items={urgencyItems} />
          <ChannelAnalyticsCard items={channelItems} />
        </div>

        <TimeSeriesAnalyticsCard trend={trend} />
      </section>

      {/* Quick actions */}
      <div className="flex gap-4">
        <Link
          href="/admin/leads"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          Ver todos los leads →
        </Link>
      </div>
    </div>
  );
}

function KPICard({ label, value, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-3 h-3 rounded-full ${color}`} />
        <span className="text-sm text-text-muted">{label}</span>
      </div>
      <p className="text-3xl font-heading font-bold text-text">{value}</p>
    </div>
  );
}

function AnalyticsCard({ eyebrow, title, summary, footer, children }) {
  return (
    <article className="relative overflow-hidden rounded-[28px] border border-primary/10 bg-white p-6 shadow-sm">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(0,62,60,0.03), transparent 54%), radial-gradient(circle at top right, rgba(227,83,54,0.12), transparent 34%)",
        }}
      />

      <div className="relative">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-primary/60">
              {eyebrow}
            </p>
            <h3 className="mt-2 text-lg font-heading font-bold text-text">
              {title}
            </h3>
          </div>
          {summary ? (
            <span className="rounded-full border border-primary/10 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              {summary}
            </span>
          ) : null}
        </div>

        {children}

        {footer ? (
          <p className="mt-5 text-sm leading-relaxed text-text-muted">
            {footer}
          </p>
        ) : null}
      </div>
    </article>
  );
}

function EmptyAnalyticsCard({ eyebrow, title, message }) {
  return (
    <AnalyticsCard eyebrow={eyebrow} title={title}>
      <div className="rounded-2xl border border-dashed border-primary/15 bg-surface px-4 py-10 text-center text-sm text-text-muted">
        {message}
      </div>
    </AnalyticsCard>
  );
}

function StatusAnalyticsCard({ items }) {
  if (!items.length) {
    return (
      <EmptyAnalyticsCard
        eyebrow="Pipeline"
        title="Embudo operativo"
        message="Todavía no hay estados suficientes para dibujar el pipeline."
      />
    );
  }

  const total = sumItems(items);
  const topItem = getTopItem(items);
  const segments = buildRingSegments(items, 42);

  return (
    <AnalyticsCard
      eyebrow="Pipeline"
      title="Embudo operativo"
      summary={`${formatPercent(topItem.share)} del total`}
      footer={`${topItem.label} concentra el mayor volumen del pipeline con ${topItem.value} leads activos.`}
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-[168px,1fr] sm:items-center">
        <div className="relative mx-auto h-40 w-40">
          <svg viewBox="0 0 120 120" className="h-full w-full">
            <circle
              cx="60"
              cy="60"
              r="42"
              fill="none"
              stroke={BRAND_COLORS.surfaceStrong}
              strokeWidth="14"
            />
            {segments.map((segment) => (
              <circle
                key={segment.key}
                cx="60"
                cy="60"
                r="42"
                fill="none"
                stroke={segment.color}
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={`${segment.dash} ${segment.circumference}`}
                strokeDashoffset={-segment.offset}
                transform="rotate(-90 60 60)"
              />
            ))}
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-semibold uppercase tracking-[0.26em] text-primary/60">
              Leads
            </span>
            <span className="text-3xl font-heading font-bold text-primary">
              {total}
            </span>
            <span className="text-xs text-text-muted">en pipeline</span>
          </div>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.key}
              className="grid grid-cols-[auto,minmax(0,1fr),auto] items-center gap-3 rounded-2xl bg-surface px-3 py-2"
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-text">
                  {item.label}
                </p>
                <p className="text-xs text-text-muted">
                  {formatPercent(item.share)} del flujo
                </p>
              </div>
              <span className="text-sm font-heading font-bold text-primary">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AnalyticsCard>
  );
}

function UrgencyAnalyticsCard({ items }) {
  if (!items.length) {
    return (
      <EmptyAnalyticsCard
        eyebrow="Urgencia"
        title="Presión de atención"
        message="Aún no hay urgencias clasificadas para mostrar presión comercial."
      />
    );
  }

  const topItem = getTopItem(items);
  const priorityCount = items
    .filter((item) => item.key === "ALTA" || item.key === "MEDIA")
    .reduce((total, item) => total + item.value, 0);

  return (
    <AnalyticsCard
      eyebrow="Urgencia"
      title="Presión de atención"
      summary={`${priorityCount} prioritarios`}
      footer={`${topItem.label} es la urgencia dominante y representa ${formatPercent(topItem.share)} del total clasificado.`}
    >
      <div className="rounded-2xl border border-primary/10 bg-surface p-5">
        <div className="flex h-4 overflow-hidden rounded-full bg-white">
          {items.map((item) => (
            <div
              key={item.key}
              className="h-full"
              style={{
                width: `${item.share * 100}%`,
                backgroundColor: item.color,
              }}
            />
          ))}
        </div>

        <div className="mt-5 space-y-4">
          {items.map((item) => (
            <div
              key={item.key}
              className="grid grid-cols-[minmax(0,1fr),auto] items-center gap-4"
            >
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-semibold text-text">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-xs font-medium uppercase tracking-[0.16em] text-text-muted">
                    {formatPercent(item.share)}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max(item.share * 100, 8)}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>

              <span className="text-lg font-heading font-bold text-primary">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AnalyticsCard>
  );
}

function ChannelAnalyticsCard({ items }) {
  if (!items.length) {
    return (
      <EmptyAnalyticsCard
        eyebrow="Canal"
        title="Origen de entrada"
        message="No hay canales con actividad suficiente para dibujar la captación."
      />
    );
  }

  const topItem = getTopItem(items);
  const chartHeight = 108;
  const chartTop = 16;
  const baseline = chartTop + chartHeight;
  const barWidth = 38;
  const gap = items.length > 1 ? 22 : 0;
  const svgWidth = 24 + items.length * barWidth + (items.length - 1) * gap + 24;
  const maxValue = Math.max(...items.map((item) => item.value), 1);

  return (
    <AnalyticsCard
      eyebrow="Canal"
      title="Origen de entrada"
      summary={`${formatPercent(topItem.share)} del total`}
      footer={`${topItem.label} es el principal canal de captación con ${topItem.value} leads registrados.`}
    >
      <div className="rounded-2xl border border-primary/10 bg-surface px-4 py-5">
        <svg viewBox={`0 0 ${svgWidth} 168`} className="h-56 w-full">
          <line
            x1="12"
            y1={baseline}
            x2={svgWidth - 12}
            y2={baseline}
            stroke={BRAND_COLORS.line}
            strokeWidth="2"
          />

          {items.map((item, index) => {
            const x = 24 + index * (barWidth + gap);
            const height = Math.max((item.value / maxValue) * chartHeight, 8);
            const y = baseline - height;

            return (
              <g key={item.key}>
                <rect
                  x={x}
                  y={chartTop}
                  width={barWidth}
                  height={chartHeight}
                  rx="14"
                  fill="#ffffff"
                />
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={height}
                  rx="14"
                  fill={item.color}
                />
                <text
                  x={x + barWidth / 2}
                  y={Math.max(y - 8, 12)}
                  textAnchor="middle"
                  fill={BRAND_COLORS.primary}
                  fontSize="14"
                  fontWeight="700"
                >
                  {item.value}
                </text>
                <text
                  x={x + barWidth / 2}
                  y={baseline + 24}
                  textAnchor="middle"
                  fill={BRAND_COLORS.primaryDark}
                  fontSize="12"
                  fontWeight="600"
                >
                  {item.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </AnalyticsCard>
  );
}

function TimeSeriesAnalyticsCard({ trend }) {
  const { granularity = "day", items = [] } = trend ?? {};
  const hasVolume = items.some((item) => item.value > 0);
  const periodLabel = granularity === "day" ? "7 días" : "6 semanas";
  const periodText =
    granularity === "day"
      ? "Leads en los últimos 7 días"
      : "Leads en las últimas 6 semanas";
  const latestLabel = granularity === "day" ? "Hoy" : "Esta semana";
  const title = granularity === "day" ? "Evolución diaria" : "Ritmo semanal";

  if (!items.length || !hasVolume) {
    return (
      <EmptyAnalyticsCard
        eyebrow="Tendencia"
        title={title}
        message="Aún no hay actividad suficiente para dibujar la evolución semanal."
      />
    );
  }

  const recentTotal = sumItems(items);
  const latest = items[items.length - 1];
  const peak = getTopItem(items);
  const chartWidth = 640;
  const chartHeight = 220;
  const chartTop = 28;
  const chartBottom = 54;
  const chartLeft = 24;
  const chartRight = 24;
  const innerHeight = chartHeight - chartTop - chartBottom;
  const innerWidth = chartWidth - chartLeft - chartRight;
  const maxValue = Math.max(...items.map((item) => item.value), 1);
  const points = items.map((item, index) => {
    const step = items.length > 1 ? innerWidth / (items.length - 1) : 0;
    const x = chartLeft + step * index;
    const y = chartTop + innerHeight - (item.value / maxValue) * innerHeight;

    return { ...item, x, y };
  });
  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartTop + innerHeight} L ${points[0].x} ${chartTop + innerHeight} Z`;
  const guideValues = [...new Set([maxValue, Math.max(Math.round(maxValue / 2), 1), 0])]
    .sort((a, b) => b - a);

  return (
    <AnalyticsCard
      eyebrow="Tendencia"
      title={title}
      summary={`${recentTotal} en ${periodLabel}`}
      footer={
        granularity === "day"
          ? `Pico de captación el ${peak.dateLabel} con ${peak.value} leads. Hoy se registran ${latest.value}.`
          : `Pico de captación en la semana del ${peak.dateLabel} con ${peak.value} leads. Esta semana van ${latest.value}.`
      }
    >
      <div className="rounded-2xl border border-primary/10 bg-surface px-4 py-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-3xl font-heading font-bold text-primary">
              {recentTotal}
            </p>
            <p className="text-xs uppercase tracking-[0.18em] text-text-muted">
              {periodText}
            </p>
          </div>

          <div className="rounded-2xl bg-white/90 px-4 py-3 text-left shadow-sm sm:text-right">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/60">
              {latestLabel}
            </p>
            <p className="text-2xl font-heading font-bold text-accent">
              {latest.value}
            </p>
            <p className="text-xs text-text-muted">
              {granularity === "day" ? latest.label : latest.dateLabel}
            </p>
          </div>
        </div>

        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-64 w-full">
          <defs>
            <linearGradient id="leadTrendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={BRAND_COLORS.accent} stopOpacity="0.26" />
              <stop offset="100%" stopColor={BRAND_COLORS.primary} stopOpacity="0.04" />
            </linearGradient>
            <linearGradient id="leadTrendStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={BRAND_COLORS.primaryLight} />
              <stop offset="100%" stopColor={BRAND_COLORS.accent} />
            </linearGradient>
          </defs>

          {guideValues.map((value) => {
            const y = chartTop + innerHeight - (value / maxValue) * innerHeight;

            return (
              <g key={value}>
                <line
                  x1={chartLeft}
                  y1={y}
                  x2={chartWidth - chartRight}
                  y2={y}
                  stroke={BRAND_COLORS.line}
                  strokeDasharray="4 8"
                />
                <text
                  x={chartLeft}
                  y={y - 8}
                  fill={BRAND_COLORS.primaryDark}
                  fontSize="11"
                  fontWeight="600"
                >
                  {value}
                </text>
              </g>
            );
          })}

          <path d={areaPath} fill="url(#leadTrendFill)" />
          <path
            d={linePath}
            fill="none"
            stroke="url(#leadTrendStroke)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {points.map((point) => (
            <g key={point.key}>
              <circle
                cx={point.x}
                cy={point.y}
                r="5.5"
                fill="#ffffff"
                stroke={point.key === peak.key ? BRAND_COLORS.accent : BRAND_COLORS.primary}
                strokeWidth="3"
              />
              <text
                x={point.x}
                y={chartHeight - 16}
                textAnchor="middle"
                fill={BRAND_COLORS.primaryDark}
                fontSize="12"
                fontWeight="600"
              >
                {point.label}
              </text>
            </g>
          ))}

          <text
            x={peak.x}
            y={Math.max(peak.y - 14, 14)}
            textAnchor="middle"
            fill={BRAND_COLORS.accent}
            fontSize="13"
            fontWeight="700"
          >
            {peak.value}
          </text>

          {latest.key !== peak.key ? (
            <text
              x={latest.x}
              y={Math.max(latest.y - 14, 14)}
              textAnchor="middle"
              fill={BRAND_COLORS.primary}
              fontSize="13"
              fontWeight="700"
            >
              {latest.value}
            </text>
          ) : null}
        </svg>
      </div>
    </AnalyticsCard>
  );
}

function buildAnalyticsItems(data, preferredOrder, labels, colors) {
  const source = data ?? {};
  const keys = [...new Set([...preferredOrder, ...Object.keys(source)])];
  const items = keys
    .map((key) => ({
      key,
      label: labels[key] ?? formatLabel(key),
      value: Number(source[key] ?? 0),
      color: colors[key] ?? BRAND_COLORS.primaryLight,
    }))
    .filter((item) => item.value > 0);

  const total = items.reduce((sum, item) => sum + item.value, 0);

  return items.map((item) => ({
    ...item,
    share: total > 0 ? item.value / total : 0,
  }));
}

function buildRingSegments(items, radius) {
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return items.map((item) => {
    const dash = item.share * circumference;
    const segment = {
      ...item,
      dash,
      offset,
      circumference,
    };

    offset += dash;
    return segment;
  });
}

function getTopItem(items) {
  return [...items].sort((a, b) => b.value - a.value)[0];
}

function sumItems(items) {
  return items.reduce((sum, item) => sum + item.value, 0);
}

function formatPercent(value) {
  return `${Math.round(value * 100)}%`;
}

function formatLabel(value) {
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
