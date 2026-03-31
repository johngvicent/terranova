import OpenAI from "openai";
import {
  RESPONDER_SYSTEM_PROMPT,
  buildResponderUserPrompt,
} from "./prompts.js";

let _openai;
function getOpenAI() {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
}

/**
 * Generate a personalized auto-response for a classified lead.
 *
 * @param {{ nombre: string, mensaje: string, clasificacion: object, propiedadesSugeridas?: Array }} input
 * @returns {Promise<string|null>} Response text, or null if spam (don't respond).
 */
export async function generateAutoResponse({
  nombre,
  mensaje,
  clasificacion,
  propiedadesSugeridas,
}) {
  // Don't respond to spam
  if (clasificacion.intencion === "SPAM") {
    return null;
  }

  // If no API key, return a template response
  if (!process.env.OPENAI_API_KEY) {
    console.warn("[generateAutoResponse] No OPENAI_API_KEY set, using template");
    return getTemplateResponse(nombre, clasificacion);
  }

  const completion = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.7,
    max_tokens: 500,
    messages: [
      { role: "system", content: RESPONDER_SYSTEM_PROMPT },
      {
        role: "user",
        content: buildResponderUserPrompt({
          nombre,
          mensaje,
          clasificacion,
          propiedadesSugeridas,
        }),
      },
    ],
  });

  const response = completion.choices[0]?.message?.content?.trim();
  if (!response || response === "null") {
    return null;
  }

  return response;
}

function getTemplateResponse(nombre, clasificacion) {
  const name = nombre || "cliente";

  if (clasificacion.urgencia === "ALTA") {
    return `Estimado/a ${name},\n\nGracias por contactar con Terranova. Hemos recibido tu consulta y, dada su importancia, un agente de nuestro equipo se pondrá en contacto contigo en menos de 1 hora.\n\nMientras tanto, puedes explorar nuestro catálogo en terranova.es/propiedades.\n\nUn saludo,\nEquipo Terranova`;
  }

  if (clasificacion.urgencia === "MEDIA") {
    return `Estimado/a ${name},\n\nGracias por contactar con Terranova. Hemos recibido tu consulta y nuestro equipo la revisará en las próximas 24 horas.\n\nTe invitamos a explorar nuestro catálogo en terranova.es/propiedades.\n\nUn saludo,\nEquipo Terranova`;
  }

  return `Estimado/a ${name},\n\nGracias por tu interés en Terranova. Te recomendamos explorar nuestro catálogo de propiedades en terranova.es/propiedades para encontrar lo que mejor se adapte a tus necesidades.\n\nSi necesitas asistencia personalizada, no dudes en contactarnos.\n\nUn saludo,\nEquipo Terranova`;
}
