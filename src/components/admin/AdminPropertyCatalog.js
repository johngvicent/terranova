"use client";

import { startTransition, useState } from "react";
import { formatPrice } from "@/lib/data";

function sortProperties(properties) {
  return properties.toSorted((left, right) => {
    if (left.isListed !== right.isListed) {
      return left.isListed ? -1 : 1;
    }

    if (left.featured !== right.featured) {
      return left.featured ? -1 : 1;
    }

    return left.title.localeCompare(right.title, "es");
  });
}

export default function AdminPropertyCatalog({ initialProperties }) {
  const [properties, setProperties] = useState(() => sortProperties(initialProperties));
  const [pendingId, setPendingId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const listedCount = properties.filter((property) => property.isListed).length;
  const offMarketCount = properties.length - listedCount;
  const ventaCount = properties.filter((property) => property.type === "venta").length;
  const alquilerCount = properties.filter((property) => property.type === "alquiler").length;

  async function handleToggle(property) {
    const nextIsListed = !property.isListed;

    setPendingId(property.recordId);
    setErrorMsg("");

    try {
      const response = await fetch(`/api/properties/${property.recordId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isListed: nextIsListed }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "No se pudo actualizar la propiedad");
      }

      startTransition(() => {
        setProperties((currentProperties) =>
          sortProperties(
            currentProperties.map((currentProperty) =>
              currentProperty.recordId === property.recordId
                ? { ...currentProperty, isListed: nextIsListed }
                : currentProperty
            )
          )
        );
      });
    } catch (error) {
      setErrorMsg(error.message || "No se pudo actualizar la propiedad");
    } finally {
      setPendingId("");
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text">
            Catálogo de propiedades
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-text-muted">
            Desde aquí controlas qué propiedades aparecen en la web pública.
            Usa <strong className="text-text">-</strong> para retirarlas del mercado y
            <strong className="text-text"> +</strong> para volver a publicarlas.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="En mercado" value={listedCount} tone="text-emerald-700 bg-emerald-50 border-emerald-200" />
          <StatCard label="Fuera de mercado" value={offMarketCount} tone="text-slate-700 bg-slate-50 border-slate-200" />
          <StatCard label="Venta" value={ventaCount} tone="text-[#003e3c] bg-[#003e3c]/5 border-[#003e3c]/15" />
          <StatCard label="Alquiler" value={alquilerCount} tone="text-[#e35336] bg-[#e35336]/5 border-[#e35336]/15" />
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {errorMsg}
        </div>
      )}

      <div className="grid gap-4">
        {properties.map((property) => {
          const isPending = pendingId === property.recordId;

          return (
            <article
              key={property.recordId}
              className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                        property.type === "venta"
                          ? "bg-[#003e3c] text-white"
                          : "bg-[#e35336] text-white"
                      }`}
                    >
                      {property.type === "venta" ? "Venta" : "Alquiler"}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        property.isListed
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {property.isListed ? "En mercado" : "Fuera de mercado"}
                    </span>
                    {property.featured && (
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                        Destacada
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <h2 className="truncate text-xl font-heading font-bold text-text">
                        {property.title}
                      </h2>
                      <p className="mt-1 text-sm text-text-muted">
                        {property.location}, {property.region}
                      </p>
                    </div>

                    <p className="text-lg font-bold text-text">
                      {formatPrice(property.price, property.type)}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-text-muted">
                    <span>{property.bedrooms} hab.</span>
                    <span>{property.bathrooms} baños</span>
                    <span>{property.area} m²</span>
                    <span className="truncate">/{property.id}</span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3 self-start xl:self-center">
                  <a
                    href={`/propiedades/${property.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-text transition-colors hover:border-[#003e3c] hover:text-[#003e3c]"
                  >
                    Ver ficha
                  </a>

                  <button
                    type="button"
                    onClick={() => handleToggle(property)}
                    disabled={isPending}
                    className={`inline-flex min-w-[180px] items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                      property.isListed
                        ? "bg-slate-900 text-white hover:bg-slate-700"
                        : "bg-emerald-600 text-white hover:bg-emerald-500"
                    }`}
                  >
                    {isPending
                      ? "Guardando..."
                      : property.isListed
                        ? "- Quitar del mercado"
                        : "+ Añadir al mercado"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ label, value, tone }) {
  return (
    <div className={`rounded-2xl border px-4 py-3 ${tone}`}>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-80">{label}</p>
      <p className="mt-2 text-2xl font-heading font-bold">{value}</p>
    </div>
  );
}