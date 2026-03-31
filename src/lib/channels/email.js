/**
 * Parse incoming email from SendGrid Inbound Parse.
 * SendGrid sends form-data with fields like: from, to, subject, text, html, etc.
 */
export function parseSendGridEmail(formData) {
  const from = formData.get("from") || "";
  const subject = formData.get("subject") || "";
  const text = formData.get("text") || "";
  const html = formData.get("html") || "";

  // Extract email and name from "Name <email@example.com>" format
  const emailMatch = from.match(/<([^>]+)>/);
  const email = emailMatch ? emailMatch[1] : from.trim();
  const nombre = emailMatch
    ? from.replace(/<[^>]+>/, "").trim()
    : email.split("@")[0];

  return {
    from: email,
    nombre,
    subject,
    contenido: text || stripHtml(html) || subject,
    metadata: {
      originalFrom: from,
      subject,
      to: formData.get("to"),
      hasAttachments: !!formData.get("attachments"),
    },
  };
}

function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 5000);
}
