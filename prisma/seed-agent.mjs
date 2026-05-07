/**
 * Seed script: crea las cuentas de admin y demo o actualiza su contraseña.
 *
 * Uso local (base de datos de desarrollo):
 *   node --experimental-strip-types prisma/seed-agent.mjs
 *
 * Uso contra la base de datos de Vercel/producción:
 *   DATABASE_URL="postgres://..." node --experimental-strip-types prisma/seed-agent.mjs
 *
 * Variables de entorno opcionales para personalizar las cuentas:
 *   ADMIN_EMAIL     (default: admin1@terranova.es)
 *   ADMIN_PASSWORD  (default: qwerty1234)
 *   DEMO_EMAIL      (default: agente1@terranova.es)
 *   DEMO_PASSWORD   (default: qwerty1234)
 */

import "dotenv/config";
import { createHash } from "node:crypto";
import { PrismaClient } from "../src/generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

// ─── Resolución de la URL de conexión ────────────────────────────────────────

function getDirectConnectionString() {
  const raw =
    process.env.DATABASE_URL ??
    process.env.DIRECT_URL ??
    process.env.POSTGRES_URL_NON_POOLING ??
    process.env.POSTGRES_PRISMA_URL ??
    process.env.POSTGRES_URL;

  if (!raw) {
    throw new Error(
      "No se encontró una cadena de conexión a la base de datos.\n" +
        "Configura DATABASE_URL o DIRECT_URL en el entorno o en el fichero .env."
    );
  }

  // El formato prisma+postgres:// codifica la URL real dentro del api_key
  if (!raw.startsWith("prisma+postgres://")) return raw;

  const url = new URL(raw);
  const apiKey = url.searchParams.get("api_key");
  if (!apiKey)
    throw new Error("URL prisma+postgres inválida: falta el parámetro api_key.");

  const payload = JSON.parse(Buffer.from(apiKey, "base64").toString());
  if (!payload?.databaseUrl)
    throw new Error(
      "URL prisma+postgres inválida: no se puede extraer databaseUrl del api_key."
    );

  return payload.databaseUrl;
}

function hashPassword(password) {
  return createHash("sha256").update(password).digest("hex");
}

// ─── Definición de cuentas ───────────────────────────────────────────────────

const USERS = [
  {
    nombre: "Admin",
    email: process.env.ADMIN_EMAIL ?? "admin1@terranova.es",
    password: process.env.ADMIN_PASSWORD ?? "qwerty1234",
    rol: "ADMIN",
    activo: true,
  },
  {
    nombre: "Agente Demo",
    email: process.env.DEMO_EMAIL ?? "agente1@terranova.es",
    password: process.env.DEMO_PASSWORD ?? "qwerty1234",
    rol: "AGENTE",
    activo: true,
  },
];

// ─── Ejecución ────────────────────────────────────────────────────────────────

const adapter = new PrismaPg({ connectionString: getDirectConnectionString() });
const prisma = new PrismaClient({ adapter });

try {
  console.log("Sembrando usuarios en la base de datos...\n");
  const summary = [];

  for (const { password, ...data } of USERS) {
    const existing = await prisma.agent.findUnique({
      where: { email: data.email },
      select: { id: true },
    });

    const account = await prisma.agent.upsert({
      where: { email: data.email },
      create: { ...data, passwordHash: hashPassword(password) },
      update: { passwordHash: hashPassword(password) },
    });

    const accion = existing ? "contraseña actualizada" : "creado";
    console.log(`✓ ${accion}: ${account.email} (${account.rol})`);
    summary.push({ email: data.email, password, rol: data.rol, accion });
  }

  console.log("\n─── Credenciales ──────────────────────────────────────");
  for (const { email, password, rol, accion } of summary) {
    console.log(`  ${rol.padEnd(6)}  ${email}  /  ${password}  [${accion}]`);
  }
  console.log("───────────────────────────────────────────────────────\n");
} finally {
  await prisma.$disconnect();
}
