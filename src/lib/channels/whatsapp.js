/**
 * Parse incoming WhatsApp webhook payload from Meta Business API.
 *
 * Meta sends a nested structure:
 * { object: "whatsapp_business_account", entry: [{ changes: [{ value: { messages: [...] } }] }] }
 */
export function parseWhatsAppMessage(body) {
  const entry = body?.entry?.[0];
  const change = entry?.changes?.[0];
  const value = change?.value;

  if (!value?.messages?.length) {
    return null;
  }

  const message = value.messages[0];
  const contact = value.contacts?.[0];

  return {
    messageId: message.id,
    from: message.from, // Phone number in international format (no +)
    nombre: contact?.profile?.name || "WhatsApp User",
    tipo: message.type, // text, image, document, etc.
    contenido:
      message.type === "text"
        ? message.text?.body
        : `[${message.type}] ${JSON.stringify(message[message.type] || {})}`,
    timestamp: message.timestamp,
    metadata: {
      phoneNumberId: value.metadata?.phone_number_id,
      displayPhoneNumber: value.metadata?.display_phone_number,
      originalMessage: message,
    },
  };
}

/**
 * Verify the webhook signature from Meta.
 * The X-Hub-Signature-256 header contains: sha256=<hex digest>
 */
export async function verifyWhatsAppSignature(body, signature) {
  const secret = process.env.WHATSAPP_APP_SECRET;
  if (!secret) {
    console.warn("[WhatsApp] No WHATSAPP_APP_SECRET set, skipping verification");
    return true;
  }

  if (!signature) return false;

  const { createHmac } = await import("node:crypto");
  const expectedSignature =
    "sha256=" +
    createHmac("sha256", secret).update(body, "utf8").digest("hex");

  // Constant-time comparison
  const { timingSafeEqual } = await import("node:crypto");
  try {
    return timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}
