import "server-only";

import { hasDatabaseConfig, prisma } from "@/lib/prisma";
import { properties as propertyCatalog } from "@/lib/data";

const catalogSlugs = propertyCatalog.map((property) => property.id);

const dbTypeByClientType = {
  venta: "VENTA",
  alquiler: "ALQUILER",
};

const clientTypeByDbType = {
  VENTA: "venta",
  ALQUILER: "alquiler",
};

function toClientProperty(property) {
  if (!property) return null;

  return {
    ...property,
    recordId: property.id,
    id: property.slug,
    type: clientTypeByDbType[property.type] ?? property.type?.toLowerCase?.(),
  };
}

function getStaticCatalogProperties() {
  return propertyCatalog.map((property) => ({
    ...property,
    recordId: property.id,
    isListed: true,
  }));
}

function getStaticPropertyBySlug(slug) {
  return getStaticCatalogProperties().find((property) => property.id === slug) ?? null;
}

function isDatabaseConnectionError(error) {
  if (!error || typeof error !== "object") {
    return false;
  }

  if (error.code === "P1001" || error.code === "P1017") {
    return true;
  }

  const messages = [
    error.message,
    error.meta?.driverAdapterError?.message,
    error.meta?.driverAdapterError?.cause?.message,
    error.cause?.message,
  ].filter((value) => typeof value === "string");

  return messages.some((message) =>
    [
      "Connection terminated unexpectedly",
      "Can't reach database server",
      "DatabaseNotReachable",
      "ECONNREFUSED",
      "ECONNRESET",
      "ENOTFOUND",
      "terminating connection",
    ].some((fragment) => message.includes(fragment))
  );
}

async function withStaticCatalogFallback(operation, fallback) {
  try {
    return await operation();
  } catch (error) {
    if (!isDatabaseConnectionError(error)) {
      throw error;
    }

    console.error("[properties] Falling back to static catalog", error);
    return fallback();
  }
}

async function ensurePropertyCatalogSeeded() {
  const existingCatalogProperties = await prisma.property.findMany({
    where: { slug: { in: catalogSlugs } },
    select: { slug: true },
  });

  if (existingCatalogProperties.length === catalogSlugs.length) {
    return;
  }

  await prisma.property.createMany({
    data: propertyCatalog.map((property) => ({
      slug: property.id,
      title: property.title,
      location: property.location,
      region: property.region,
      description: property.description,
      price: property.price,
      type: dbTypeByClientType[property.type],
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      image: property.image,
      isListed: true,
      featured: property.featured,
      tags: property.tags,
    })),
    skipDuplicates: true,
  });
}

export async function getFeaturedProperties() {
  if (!hasDatabaseConfig()) {
    return getStaticCatalogProperties().filter((property) => property.featured);
  }

  return withStaticCatalogFallback(
    async () => {
      await ensurePropertyCatalogSeeded();

      const properties = await prisma.property.findMany({
        where: {
          isListed: true,
          featured: true,
        },
        orderBy: [{ updatedAt: "desc" }, { title: "asc" }],
      });

      return properties.map(toClientProperty);
    },
    () => getStaticCatalogProperties().filter((property) => property.featured)
  );
}

export async function getListedProperties() {
  if (!hasDatabaseConfig()) {
    return getStaticCatalogProperties();
  }

  return withStaticCatalogFallback(
    async () => {
      await ensurePropertyCatalogSeeded();

      const properties = await prisma.property.findMany({
        where: { isListed: true },
        orderBy: [{ featured: "desc" }, { updatedAt: "desc" }, { title: "asc" }],
      });

      return properties.map(toClientProperty);
    },
    () => getStaticCatalogProperties()
  );
}

export async function getCatalogProperties() {
  if (!hasDatabaseConfig()) {
    return getStaticCatalogProperties();
  }

  return withStaticCatalogFallback(
    async () => {
      await ensurePropertyCatalogSeeded();

      const properties = await prisma.property.findMany({
        orderBy: [{ isListed: "desc" }, { featured: "desc" }, { title: "asc" }],
      });

      return properties.map(toClientProperty);
    },
    () => getStaticCatalogProperties()
  );
}

export async function getPropertyBySlug(slug, { includeUnlisted = false } = {}) {
  if (!hasDatabaseConfig()) {
    const property = getStaticPropertyBySlug(slug);

    if (!property) {
      return null;
    }

    if (!includeUnlisted && property.isListed === false) {
      return null;
    }

    return property;
  }

  return withStaticCatalogFallback(
    async () => {
      await ensurePropertyCatalogSeeded();

      const property = await prisma.property.findUnique({
        where: { slug },
      });

      if (!property) {
        return null;
      }

      if (!includeUnlisted && !property.isListed) {
        return null;
      }

      return toClientProperty(property);
    },
    () => {
      const property = getStaticPropertyBySlug(slug);

      if (!property) {
        return null;
      }

      if (!includeUnlisted && property.isListed === false) {
        return null;
      }

      return property;
    }
  );
}