import { prisma } from "@/lib/prisma";

/**
 * GET /api/leads/stats — Dashboard KPIs.
 */
export async function GET() {
  try {
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
      (s) => s.estado === "CERRADO_GANADO"
    )?._count ?? 0;
    const cerradosTotal =
      (porEstado.find((s) => s.estado === "CERRADO_GANADO")?._count ?? 0) +
      (porEstado.find((s) => s.estado === "CERRADO_PERDIDO")?._count ?? 0);

    return Response.json({
      totalLeads,
      leadsHoy,
      leadsSemana,
      tasaConversion:
        cerradosTotal > 0
          ? Math.round((cerradosGanados / cerradosTotal) * 100)
          : 0,
      porEstado: Object.fromEntries(
        porEstado.map((s) => [s.estado, s._count])
      ),
      porUrgencia: Object.fromEntries(
        porUrgencia.map((u) => [u.urgencia ?? "SIN_CLASIFICAR", u._count])
      ),
      porCanal: Object.fromEntries(
        porCanal.map((c) => [c.canal, c._count])
      ),
    });
  } catch (error) {
    console.error("[GET /api/leads/stats]", error);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
