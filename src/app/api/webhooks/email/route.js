import { parseSendGridEmail } from "@/lib/channels/email";
import { upsertLead } from "@/lib/leads/deduplication";
import { classifyLead } from "@/lib/ai/classifier";
import { encrypt } from "@/lib/crypto";
import { webhookLimiter } from "@/lib/ratelimit";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/webhooks/email — Receive inbound emails from SendGrid Inbound Parse.
 * SendGrid sends multipart/form-data.
 */
export async function POST(request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    if (!webhookLimiter.check(ip)) {
      return Response.json({ error: "Too many requests" }, { status: 429 });
    }

    const formData = await request.formData();
    const parsed = parseSendGridEmail(formData);

    if (!parsed.contenido) {
      return Response.json({ status: "ok", message: "Empty email" });
    }

    // Deduplicate: find or create lead
    const emailEncrypted = encrypt(parsed.from);
    const { lead } = await upsertLead({
      nombre: parsed.nombre,
      email: emailEncrypted,
      mensaje: parsed.contenido,
      canal: "EMAIL",
      metadata: parsed.metadata,
    });

    // Classify with AI
    try {
      const classification = await classifyLead({
        mensaje: parsed.contenido,
        canal: "email",
      });

      await prisma.lead.update({
        where: { id: lead.id },
        data: {
          intencion: classification.intencion,
          urgencia: classification.urgencia,
          score: classification.score,
          resumenIA: classification.resumen,
        },
      });
    } catch (err) {
      console.error("[Email AI Classification]", err);
    }

    return Response.json({ status: "ok" });
  } catch (error) {
    console.error("[POST /api/webhooks/email]", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
