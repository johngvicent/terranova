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

export function buildLeadReplyEmail({ subject, message }) {
  const text = message.trim();
  const htmlBody = formatEmailBody(text);

  return {
    text,
    html: `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:24px;background:#f3ede6;font-family:Georgia, 'Times New Roman', serif;color:#2f2a26;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;margin:0 auto;border-collapse:collapse;">
      <tr>
        <td style="padding:0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#fffdf9;border:1px solid #ded4c9;border-radius:24px;overflow:hidden;">
            <tr>
              <td style="padding:28px 32px 20px;background:linear-gradient(135deg,#0b3b3b 0%,#27564f 100%);color:#f7f1e8;">
                <div style="font-size:11px;letter-spacing:0.24em;text-transform:uppercase;opacity:0.78;">Terranova</div>
                <h1 style="margin:14px 0 0;font-size:28px;line-height:1.2;font-weight:600;">${escapeHtml(subject)}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                ${htmlBody}
                <div style="margin-top:28px;padding-top:20px;border-top:1px solid #e9dfd4;font-size:13px;line-height:1.6;color:#6d645c;">
                  Has recibido este correo porque solicitaste información a Terranova.
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
  };
}

export async function sendOutboundEmail({ to, subject, text, html }) {
  const apiKey = process.env.SENDGRID_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    throw new Error("EMAIL_DELIVERY_NOT_CONFIGURED");
  }

  const content = [
    {
      type: "text/plain",
      value: text,
    },
  ];

  if (html) {
    content.push({
      type: "text/html",
      value: html,
    });
  }

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [{ email: to }],
          subject,
        },
      ],
      from: {
        email: from,
        name: "Terranova",
      },
      reply_to: {
        email: from,
        name: "Terranova",
      },
      content,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`SENDGRID_DELIVERY_FAILED: ${response.status} ${detail}`);
  }
}

function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 5000);
}

function formatEmailBody(text) {
  return escapeHtml(text)
    .split(/\n{2,}/)
    .map(
      (paragraph) =>
        `<p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:#3f3833;">${paragraph.replace(/\n/g, "<br />")}</p>`
    )
    .join("");
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
