import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis;
const MISSING_DB_ERROR =
  "Missing database connection string. Set DATABASE_URL or provide a compatible Vercel Postgres variable.";

function getConfiguredDatabaseUrl() {
  return (
    process.env.DATABASE_URL ??
    process.env.DIRECT_URL ??
    process.env.POSTGRES_PRISMA_URL ??
    process.env.POSTGRES_URL_NON_POOLING ??
    process.env.POSTGRES_URL
  );
}

export function hasDatabaseConfig() {
  return Boolean(getConfiguredDatabaseUrl());
}

function getDatabaseUrl() {
  const raw = getConfiguredDatabaseUrl();

  if (!raw) {
    throw new Error(MISSING_DB_ERROR);
  }

  return raw;
}

function getDirectUrl() {
  const raw = getDatabaseUrl();
  if (!raw.startsWith("prisma+postgres://")) return raw;

  const url = new URL(raw);
  const apiKey = url.searchParams.get("api_key");

  if (!apiKey) {
    throw new Error(
      "Invalid prisma+postgres connection string. Expected an api_key query param."
    );
  }

  const payload = JSON.parse(
    Buffer.from(apiKey, "base64").toString()
  );

  if (!payload?.databaseUrl) {
    throw new Error(
      "Invalid prisma+postgres connection string. Unable to extract databaseUrl from api_key payload."
    );
  }

  return payload.databaseUrl;
}

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: getDirectUrl() });
  return new PrismaClient({ adapter });
}

function createMissingPrismaClientProxy() {
  return new Proxy(
    {},
    {
      get() {
        throw new Error(MISSING_DB_ERROR);
      },
    }
  );
}

export const prisma =
  globalForPrisma.prisma ??
  (hasDatabaseConfig()
    ? createPrismaClient()
    : createMissingPrismaClientProxy());

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
