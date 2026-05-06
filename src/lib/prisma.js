import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis;
const MISSING_DB_ERROR =
  "Missing database connection string. Set DATABASE_URL or provide a compatible Vercel Postgres variable.";

function firstNonEmpty(...values) {
  return values.find((value) => typeof value === "string" && value.length > 0);
}

function getConfiguredDatabaseUrl() {
  const vercelManagedUrl = firstNonEmpty(
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.POSTGRES_DATABASE_URL_UNPOOLED,
    process.env.POSTGRES_URL,
    process.env.POSTGRES_DATABASE_URL,
    process.env.POSTGRES_PRISMA_URL
  );

  const genericUrl = firstNonEmpty(
    process.env.DATABASE_URL,
    process.env.DIRECT_URL
  );

  // On Vercel, prefer the Storage integration URLs over any older manual
  // DATABASE_URL that may still exist on the project.
  if (process.env.VERCEL) {
    return vercelManagedUrl ?? genericUrl;
  }

  return genericUrl ?? vercelManagedUrl;
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
