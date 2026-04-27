import triageRules from "./triage-rules.json" with { type: "json" };

const currencyFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const normalizedRules = {
  intentKeywords: Object.fromEntries(
    Object.entries(triageRules.intentKeywords).map(([intent, keywords]) => [
      intent,
      keywords.map(normalizeText),
    ])
  ),
  urgencySignals: Object.fromEntries(
    Object.entries(triageRules.urgencySignals).map(([level, keywords]) => [
      level,
      keywords.map(normalizeText),
    ])
  ),
  propertySignals: triageRules.propertySignals.map(normalizeText),
  zones: triageRules.zones.map((zone) => ({
    name: zone.name,
    aliases: [zone.name, ...(zone.aliases ?? [])].map(normalizeText),
  })),
};

export function classifyLeadLocally({ mensaje, fallbackIntencion }) {
  const message = typeof mensaje === "string" ? mensaje.trim() : "";
  const normalizedMessage = normalizeText(message);
  const presupuesto = extractBudget(message);
  const zona = extractZone(normalizedMessage);
  const habitaciones = extractBedrooms(normalizedMessage);
  const propertySignalCount = countKeywordMatches(
    normalizedMessage,
    normalizedRules.propertySignals
  );

  const intencion = detectIntention(normalizedMessage, fallbackIntencion);
  const urgencia = detectUrgency({
    normalizedMessage,
    presupuesto,
    zona,
    propertySignalCount,
    intencion,
  });
  const score = calculateScore({
    intencion,
    urgencia,
    presupuesto,
    zona,
    propertySignalCount,
  });
  const resumen = buildSummary({
    intencion,
    urgencia,
    presupuesto,
    zona,
    habitaciones,
    score,
    message,
  });

  return {
    intencion,
    urgencia,
    score,
    presupuesto,
    zona,
    resumen,
  };
}

function detectIntention(normalizedMessage, fallbackIntencion) {
  const scores = Object.fromEntries(
    Object.entries(normalizedRules.intentKeywords).map(([intent, keywords]) => [
      intent,
      countKeywordMatches(normalizedMessage, keywords),
    ])
  );

  if (scores.SPAM > 0) {
    return "SPAM";
  }

  const ranked = Object.entries(scores)
    .filter(([intent]) => intent !== "SPAM")
    .sort((left, right) => right[1] - left[1]);

  if (ranked[0]?.[1] > 0) {
    return ranked[0][0];
  }

  return fallbackIntencion || "INFORMACION";
}

function detectUrgency({
  normalizedMessage,
  presupuesto,
  zona,
  propertySignalCount,
  intencion,
}) {
  if (intencion === "SPAM") {
    return "BAJA";
  }

  const highSignals = countKeywordMatches(
    normalizedMessage,
    normalizedRules.urgencySignals.ALTA
  );
  const mediumSignals = countKeywordMatches(
    normalizedMessage,
    normalizedRules.urgencySignals.MEDIA
  );
  const lowSignals = countKeywordMatches(
    normalizedMessage,
    normalizedRules.urgencySignals.BAJA
  );
  const leadSignals =
    Number(Boolean(presupuesto)) +
    Number(Boolean(zona)) +
    Number(propertySignalCount > 0);

  if (highSignals > 0) {
    return "ALTA";
  }

  if (lowSignals > 0 && mediumSignals === 0) {
    return "BAJA";
  }

  if (mediumSignals > 0 || leadSignals >= 2) {
    return "MEDIA";
  }

  return intencion === "INFORMACION" ? "BAJA" : "MEDIA";
}

function calculateScore({
  intencion,
  urgencia,
  presupuesto,
  zona,
  propertySignalCount,
}) {
  if (intencion === "SPAM") {
    return 0;
  }

  const { scoreWeights } = triageRules;
  let score =
    intencion === "INFORMACION"
      ? scoreWeights.informationalIntent
      : scoreWeights.transactionIntent;

  if (presupuesto) {
    score += scoreWeights.budget;
  }

  if (zona) {
    score += scoreWeights.zone;
  }

  if (urgencia === "ALTA") {
    score += scoreWeights.highUrgencyTimeline;
  } else if (urgencia === "MEDIA") {
    score += scoreWeights.mediumUrgencyTimeline;
  }

  if (propertySignalCount > 0) {
    score += scoreWeights.propertyDetails;
  }

  if (intencion === "INFORMACION" && !presupuesto && !zona) {
    score = Math.min(score, 22);
  }

  return Math.max(0, Math.min(100, score));
}

function buildSummary({
  intencion,
  urgencia,
  presupuesto,
  zona,
  habitaciones,
  score,
  message,
}) {
  const pieces = [triageRules.summaryLabels[intencion] || "Consulta recibida"];

  if (zona) {
    pieces.push(`en ${zona}`);
  }

  if (presupuesto) {
    pieces.push(`con presupuesto aproximado de ${currencyFormatter.format(presupuesto)}`);
  }

  if (habitaciones) {
    pieces.push(`y búsqueda de ${habitaciones} habitaciones`);
  }

  let summary = pieces.join(" ");

  if (urgencia === "ALTA") {
    summary += ". Muestra urgencia alta y voluntad de avanzar pronto.";
  } else if (urgencia === "MEDIA") {
    summary += ". Presenta señales claras de interés y requiere seguimiento comercial.";
  } else if (intencion === "INFORMACION") {
    summary += ". Consulta inicial sin suficientes datos para priorización alta.";
  }

  if (summary.length < 40) {
    summary = message.slice(0, 200);
  }

  return `${summary} Score estimado: ${score}/100.`.slice(0, 500);
}

function extractZone(normalizedMessage) {
  for (const zone of normalizedRules.zones) {
    if (zone.aliases.some((alias) => normalizedMessage.includes(alias))) {
      return zone.name;
    }
  }

  return null;
}

function extractBedrooms(normalizedMessage) {
  const match = normalizedMessage.match(/(\d+)\s*(habitaciones?|hab|dormitorios?)/);
  return match ? Number.parseInt(match[1], 10) : null;
}

function extractBudget(message) {
  const normalizedMessage = normalizeText(message);
  const euroMatch = normalizedMessage.match(
    /(\d{1,3}(?:[.\s]\d{3})+|\d+)\s*(?:€|eur|euros?)/
  );

  if (euroMatch) {
    return Number.parseInt(euroMatch[1].replace(/[.\s]/g, ""), 10);
  }

  const shortMatch = normalizedMessage.match(/(\d+(?:[.,]\d+)?)\s*k\b/);
  if (shortMatch) {
    return Math.round(
      Number.parseFloat(shortMatch[1].replace(",", ".")) * 1000
    );
  }

  const thousandMatch = normalizedMessage.match(/(\d+(?:[.,]\d+)?)\s*mil\b/);
  if (thousandMatch) {
    return Math.round(
      Number.parseFloat(thousandMatch[1].replace(",", ".")) * 1000
    );
  }

  return null;
}

function countKeywordMatches(normalizedMessage, keywords) {
  return keywords.reduce(
    (count, keyword) => count + Number(normalizedMessage.includes(keyword)),
    0
  );
}

function normalizeText(value) {
  return (value || "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}