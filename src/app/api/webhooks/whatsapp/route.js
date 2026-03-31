import {
  parseWhatsAppMessage,
  verifyWhatsAppSignature,
} from "@/lib/channels/whatsapp";
import { upsertLead } from "@/lib/leads/deduplication";
import { classifyLead } from "@/lib/ai/classifier";
import { encrypt } from "@/lib/crypto";
import { webhookLimiter } from "@/lib/ratelimit";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/webhooks/whatsapp — Webhook verification (Meta challenge).
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (
    mode === "subscribe" &&
    token === process.env.WHATSAPP_VERIFY_TOKEN
  ) {
    return new Response(challenge, { status: 200 });
  }

  return Response.json({ error: "Forbidden" }, { status: 403 });
}

/**
 * POST /api/webhooks/whatsapp — Receive WhatsApp messages.
 */
export async function POST(request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    if (!webhookLimiter.check(ip)) {
      return Response.json({ error: "Too many requests" }, { status: 429 });
    }

    // Read raw body for signature verification
    const rawBody = await request.text();
    const signature = request.headers.get("x-hub-signature-256");

    // Verify signature
    const isValid = await verifyWhatsAppSignature(rawBody, signature);
    if (!isValid) {
      console.warn("[WhatsApp Webhook] Invalid signature");
      return Response.json({ error: "Invalid signature" }, { status: 401 });
    }

    const body = JSON.parse(rawBody);

    // Parse the WhatsApp message
    const parsed = parseWhatsAppMessage(body);
    if (!parsed) {
      // No message in payload (could be status update)
      return Response.json({ status: "ok" });
    }

    // Deduplicate: find or create lead
    const phoneEncrypted = encrypt(parsed.from);
    const { lead } = await upsertLead({
      nombre: parsed.nombre,
      telefono: phoneEncrypted,
      mensaje: parsed.contenido,
      canal: "WHATSAPP",
      metadata: parsed.metadata,
    });

    // Classify with AI
    try {
      const classification = await classifyLead({
        mensaje: parsed.contenido,
        canal: "whatsapp",
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
      console.error("[WhatsApp AI Classification]", err);
    }

    return Response.json({ status: "ok" });
  } catch (error) {
    console.error("[POST /api/webhooks/whatsapp]", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
