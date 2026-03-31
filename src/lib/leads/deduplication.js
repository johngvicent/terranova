import { prisma } from "@/lib/prisma";

/**
 * Find an existing lead by email or phone to avoid duplicates.
 * If found, returns the existing lead. Otherwise returns null.
 *
 * @param {{ email?: string, telefono?: string }} params
 * @returns {Promise<object|null>}
 */
export async function findExistingLead({ email, telefono }) {
  if (!email && !telefono) return null;

  // Search by email first (more reliable identifier)
  if (email) {
    const byEmail = await prisma.lead.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });
    if (byEmail) return byEmail;
  }

  // Then by phone
  if (telefono) {
    const byPhone = await prisma.lead.findFirst({
      where: { telefono },
      orderBy: { createdAt: "desc" },
    });
    if (byPhone) return byPhone;
  }

  return null;
}

/**
 * Create a new lead or add a message to an existing one.
 *
 * @param {{ nombre: string, email?: string, telefono?: string, mensaje: string, canal: string, metadata?: object }} params
 * @returns {Promise<{ lead: object, isNew: boolean }>}
 */
export async function upsertLead({
  nombre,
  email,
  telefono,
  mensaje,
  canal,
  metadata,
}) {
  const existing = await findExistingLead({ email, telefono });

  if (existing) {
    // Add message to existing lead
    await prisma.message.create({
      data: {
        leadId: existing.id,
        contenido: mensaje,
        canal,
        direccion: "INBOUND",
        metadata,
      },
    });

    // Reset status to NUEVO if it was closed and they're contacting again
    if (
      existing.estado === "CERRADO_GANADO" ||
      existing.estado === "CERRADO_PERDIDO"
    ) {
      await prisma.lead.update({
        where: { id: existing.id },
        data: { estado: "NUEVO", updatedAt: new Date() },
      });
    }

    const lead = await prisma.lead.findUnique({
      where: { id: existing.id },
      include: { mensajes: true },
    });

    return { lead, isNew: false };
  }

  // Create new lead with first message
  const lead = await prisma.lead.create({
    data: {
      nombre,
      email: email || null,
      telefono: telefono || null,
      canal,
      estado: "NUEVO",
      mensajes: {
        create: {
          contenido: mensaje,
          canal,
          direccion: "INBOUND",
          metadata,
        },
      },
    },
    include: { mensajes: true },
  });

  return { lead, isNew: true };
}
