import { z } from "zod";

// ─── Lead from web form ─────────────────────────────────

export const createLeadSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(100, "Máximo 100 caracteres")
    .trim(),
  apellidos: z
    .string()
    .max(100, "Máximo 100 caracteres")
    .trim()
    .optional()
    .default(""),
  email: z
    .string()
    .email("Correo electrónico no válido")
    .max(255)
    .trim()
    .optional()
    .default(""),
  telefono: z
    .string()
    .max(20, "Máximo 20 caracteres")
    .trim()
    .optional()
    .default(""),
  interes: z
    .enum(["compra", "alquiler", "vender", "info", "reserva", ""])
    .optional()
    .default(""),
  mensaje: z
    .string()
    .min(1, "El mensaje es obligatorio")
    .max(5000, "Máximo 5000 caracteres")
    .trim(),
  privacidad: z.literal(true, {
    errorMap: () => ({ message: "Debes aceptar la política de privacidad" }),
  }),
});

// ─── Lead status update (admin) ─────────────────────────

export const updateLeadSchema = z.object({
  estado: z
    .enum([
      "NUEVO",
      "CONTACTADO",
      "EN_PROGRESO",
      "CERRADO_GANADO",
      "CERRADO_PERDIDO",
    ])
    .optional(),
  agenteId: z.string().cuid().optional().nullable(),
});
