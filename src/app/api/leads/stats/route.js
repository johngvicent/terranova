import { auth } from "@/lib/auth";
import { getLeadStats } from "@/lib/leads/stats";

/**
 * GET /api/leads/stats — Dashboard KPIs (admin only).
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: "No autorizado" }, { status: 401 });
    }

    return Response.json(await getLeadStats());
  } catch (error) {
    console.error("[GET /api/leads/stats]", error);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
