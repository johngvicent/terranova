import OpenAI from "openai";
import {
  CLASSIFIER_SYSTEM_PROMPT,
  buildClassifierUserPrompt,
} from "./prompts.js";
import { classifyLeadLocally } from "./local-classifier.js";

let _openai;
function getOpenAI() {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
}

/**
 * Classify a lead message using GPT-4o-mini.
 *
 * @param {{ mensaje: string, interes?: string, canal?: string }} input
 * @returns {Promise<{ intencion: string, urgencia: string, score: number, presupuesto: number|null, zona: string|null, resumen: string }>}
 */
export async function classifyLead({ mensaje, interes, canal }) {
  const triageMode = getTriageMode();
  const fallbackIntencion = mapInteresToIntencion(interes);

  if (triageMode === "local") {
    return classifyLeadLocally({ mensaje, fallbackIntencion, canal });
  }

  if (!process.env.OPENAI_API_KEY) {
    console.warn("[classifyLead] No OPENAI_API_KEY set, using local rules");
    return classifyLeadLocally({ mensaje, fallbackIntencion, canal });
  }

  try {
    return await classifyLeadWithOpenAI({ mensaje, interes, canal });
  } catch (error) {
    if (triageMode === "openai") {
      throw error;
    }

    console.warn(
      "[classifyLead] OpenAI classification failed, using local rules",
      error
    );
    return classifyLeadLocally({ mensaje, fallbackIntencion, canal });
  }
}

async function classifyLeadWithOpenAI({ mensaje, interes, canal }) {
  const completion = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.1,
    max_tokens: 300,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: CLASSIFIER_SYSTEM_PROMPT },
      {
        role: "user",
        content: buildClassifierUserPrompt({ mensaje, interes, canal }),
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("Empty response from OpenAI classifier");
  }

  const parsed = JSON.parse(raw);

  // Validate and normalize the response
  const validIntenciones = [
    "COMPRA",
    "ALQUILER",
    "VENTA",
    "INFORMACION",
    "SPAM",
  ];
  const validUrgencias = ["ALTA", "MEDIA", "BAJA"];

  return {
    intencion: validIntenciones.includes(parsed.intencion)
      ? parsed.intencion
      : "INFORMACION",
    urgencia: validUrgencias.includes(parsed.urgencia)
      ? parsed.urgencia
      : "MEDIA",
    score: Math.min(100, Math.max(0, parseInt(parsed.score, 10) || 50)),
    presupuesto: parsed.presupuesto ?? null,
    zona: parsed.zona ?? null,
    resumen: (parsed.resumen || mensaje.slice(0, 200)).slice(0, 500),
  };
}

function getTriageMode() {
  const mode = process.env.TRIAGE_MODE?.toLowerCase();
  return ["auto", "local", "openai"].includes(mode) ? mode : "auto";
}

function mapInteresToIntencion(interes) {
  const map = {
    compra: "COMPRA",
    alquiler: "ALQUILER",
    vender: "VENTA",
    info: "INFORMACION",
    reserva: "COMPRA",
  };
  return map[interes] || "INFORMACION";
}
