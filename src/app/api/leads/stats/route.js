import { getLeadStats } from "@/lib/leads/stats";

/**
 * GET /api/leads/stats — Dashboard KPIs.
 */
export async function GET() {
  try {
    return Response.json(await getLeadStats());
  } catch (error) {
    console.error("[GET /api/leads/stats]", error);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
