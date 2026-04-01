import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis;

function getDirectUrl() {
  const raw = process.env.DATABASE_URL;
  if (!raw.startsWith("prisma+postgres://")) return raw;
  const url = new URL(raw);
  const payload = JSON.parse(
    Buffer.from(url.searchParams.get("api_key"), "base64").toString()
  );
  return payload.databaseUrl;
}

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: getDirectUrl() });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
