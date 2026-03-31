import { prisma } from "@/lib/prisma";
import { createLeadSchema } from "@/lib/validations";
import { formLimiter, apiLimiter } from "@/lib/ratelimit";
import { classifyLead } from "@/lib/ai/classifier";
import { encrypt } from "@/lib/crypto";

/**
 * POST /api/leads — Create a new lead from the web contact form.
 */
export async function POST(request) {
  try {
    // Rate limit by IP
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    if (!formLimiter.check(ip)) {
      return Response.json(
        { error: "Demasiadas solicitudes. Inténtalo en unos minutos." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validate input with Zod
    const result = createLeadSchema.safeParse(body);
    if (!result.success) {
      return Response.json(
        { error: "Datos no válidos", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { nombre, apellidos, email, telefono, interes, mensaje } =
      result.data;

    // Map form "interes" to our Intention enum
    const intentionMap = {
      compra: "COMPRA",
      alquiler: "ALQUILER",
      vender: "VENTA",
      info: "INFORMACION",
      reserva: "COMPRA",
    };

    // Create lead in DB
    const lead = await prisma.lead.create({
      data: {
        nombre,
        apellidos: apellidos || null,
        email: email ? encrypt(email) : null,
        telefono: telefono ? encrypt(telefono) : null,
        canal: "WEB",
        estado: "NUEVO",
        mensajes: {
          create: {
            contenido: mensaje,
            canal: "WEB",
            direccion: "INBOUND",
            metadata: { interes, emailPlain: email || null },
          },
        },
      },
      include: { mensajes: true },
    });

    // AI classification (async, non-blocking for the response)
    classifyAndUpdate(lead.id, mensaje, interes).catch((err) =>
      console.error("[AI Classification Error]", err)
    );

    return Response.json(
      {
        success: true,
        message: "¡Mensaje recibido! Nos pondremos en contacto contigo pronto.",
        leadId: lead.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/leads]", error);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/leads — List leads (admin only, to be protected later).
 */
export async function GET(request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    if (!apiLimiter.check(ip)) {
      return Response.json(
        { error: "Demasiadas solicitudes" },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const estado = searchParams.get("estado");
    const urgencia = searchParams.get("urgencia");
    const canal = searchParams.get("canal");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10))
    );

    const where = {};
    if (estado) where.estado = estado;
    if (urgencia) where.urgencia = urgencia;
    if (canal) where.canal = canal;

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          agente: { select: { id: true, nombre: true } },
          _count: { select: { mensajes: true } },
        },
      }),
      prisma.lead.count({ where }),
    ]);

    return Response.json({
      leads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET /api/leads]", error);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// ─── Helper: classify with AI and update lead ───────────

async function classifyAndUpdate(leadId, mensaje, interes) {
  try {
    const classification = await classifyLead({ mensaje, interes });

    await prisma.lead.update({
      where: { id: leadId },
      data: {
        intencion: classification.intencion,
        urgencia: classification.urgencia,
        score: classification.score,
        resumenIA: classification.resumen,
      },
    });
  } catch (err) {
    console.error("[classifyAndUpdate]", err);
  }
}
