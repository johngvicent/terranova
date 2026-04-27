import { auth } from "@/lib/auth";
import { buildLeadReplyEmail, sendOutboundEmail } from "@/lib/channels/email";
import { getLeadContactInfo, serializeLeadForAdmin } from "@/lib/leads/admin";
import { prisma } from "@/lib/prisma";
import { sendLeadReplySchema } from "@/lib/validations";

export async function POST(request, { params }) {
  try {
    const session = await auth();

    if (!session?.user) {
      return Response.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const result = sendLeadReplySchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        { error: "Datos no válidos", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const existingLead = await prisma.lead.findUnique({
      where: { id },
      include: {
        mensajes: { orderBy: { createdAt: "asc" } },
        agente: { select: { id: true, nombre: true, email: true } },
      },
    });

    if (!existingLead) {
      return Response.json({ error: "Lead no encontrado" }, { status: 404 });
    }

    const { email } = getLeadContactInfo(existingLead);

    if (!email) {
      return Response.json(
        { error: "Este lead no tiene un email disponible para responder." },
        { status: 400 }
      );
    }

    const emailContent = buildLeadReplyEmail({
      subject: result.data.subject,
      message: result.data.mensaje,
    });

    await sendOutboundEmail({
      to: email,
      subject: result.data.subject,
      text: emailContent.text,
      html: emailContent.html,
    });

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: {
        ...(existingLead.estado === "NUEVO" ? { estado: "CONTACTADO" } : {}),
        mensajes: {
          create: {
            contenido: result.data.mensaje,
            canal: "EMAIL",
            direccion: "OUTBOUND",
            metadata: {
              subject: result.data.subject,
              to: email,
              sentBy: {
                id: session.user.id ?? null,
                name: session.user.name ?? null,
                email: session.user.email ?? null,
              },
            },
          },
        },
      },
      include: {
        mensajes: { orderBy: { createdAt: "asc" } },
        agente: { select: { id: true, nombre: true, email: true } },
      },
    });

    return Response.json(serializeLeadForAdmin(updatedLead));
  } catch (error) {
    console.error("[POST /api/leads/[id]/reply]", error);
    return Response.json(
      {
        error:
          error.message === "EMAIL_DELIVERY_NOT_CONFIGURED"
            ? "Configura SENDGRID_API_KEY y EMAIL_FROM para enviar respuestas por correo."
            : "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}