import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serializeLeadForAdmin } from "@/lib/leads/admin";
import { updateLeadSchema } from "@/lib/validations";

/**
 * GET /api/leads/[id] — Get a single lead with messages (admin only).
 */
export async function GET(_request, { params }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        mensajes: { orderBy: { createdAt: "asc" } },
        agente: { select: { id: true, nombre: true, email: true } },
      },
    });

    if (!lead) {
      return Response.json({ error: "Lead no encontrado" }, { status: 404 });
    }

    return Response.json(serializeLeadForAdmin(lead));
  } catch (error) {
    console.error("[GET /api/leads/[id]]", error);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/leads/[id] — Update lead status or assignment (admin only).
 */
export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;

    const body = await request.json();
    const result = updateLeadSchema.safeParse(body);
    if (!result.success) {
      return Response.json(
        { error: "Datos no válidos", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "Lead no encontrado" }, { status: 404 });
    }

    const lead = await prisma.lead.update({
      where: { id },
      data: result.data,
    });

    return Response.json(lead);
  } catch (error) {
    console.error("[PATCH /api/leads/[id]]", error);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/leads/[id] — GDPR: right to be forgotten (ADMIN only).
 */
export async function DELETE(_request, { params }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: "No autorizado" }, { status: 401 });
    }
    if (session.user.role !== "ADMIN") {
      return Response.json({ error: "Acceso denegado" }, { status: 403 });
    }

    const { id } = await params;

    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "Lead no encontrado" }, { status: 404 });
    }

    // Cascade delete: messages are deleted via onDelete: Cascade in schema
    await prisma.lead.delete({ where: { id } });

    return Response.json({ success: true, message: "Lead eliminado (RGPD)" });
  } catch (error) {
    console.error("[DELETE /api/leads/[id]]", error);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
