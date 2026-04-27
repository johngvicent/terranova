"use client";

import { useState } from "react";
import PropertyCard from "@/components/PropertyCard";

const filters = [
  { value: "todos", label: "Todos" },
  { value: "venta", label: "En venta" },
  { value: "alquiler", label: "En alquiler" },
];

export default function PropertyListings({ properties }) {
  const [active, setActive] = useState("todos");
  const filteredProperties =
    active === "todos"
      ? properties
      : properties.filter((property) => property.type === active);

  const counts = {
    todos: properties.length,
    venta: properties.filter((property) => property.type === "venta").length,
    alquiler: properties.filter((property) => property.type === "alquiler").length,
  };

  return (
    <>
      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-10">
        {filters.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setActive(value)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-200 cursor-pointer ${
              active === value
                ? "bg-[#003e3c] text-white"
                : "bg-white border border-[#003e3c]/20 text-[#003e3c] hover:border-[#003e3c]"
            }`}
          >
            {label}
            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${active === value ? "bg-white/20 text-white" : "bg-[#f8f5f2] text-[#6b7280]"}`}>
              {counts[value]}
            </span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <p className="text-center text-[#6b7280] py-20">
          No hay propiedades disponibles en esta categoría.
        </p>
      )}
    </>
  );
}
