import { prisma } from "@/lib/prisma";

export async function getLeadStats() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);

  const [
    totalLeads,
    leadsHoy,
    leadsSemana,
    porEstado,
    porUrgencia,
    porCanal,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.lead.count({ where: { createdAt: { gte: weekStart } } }),
    prisma.lead.groupBy({ by: ["estado"], _count: true }),
    prisma.lead.groupBy({ by: ["urgencia"], _count: true }),
    prisma.lead.groupBy({ by: ["canal"], _count: true }),
  ]);

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
  };
}