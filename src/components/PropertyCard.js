import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/data";

const typeLabels = {
  venta: { label: "Venta", className: "bg-[#003e3c] text-white" },
  alquiler: { label: "Alquiler", className: "bg-[#e35336] text-white" },
};

export default function PropertyCard({ property }) {
  const { id, title, location, price, type, bedrooms, bathrooms, area, image } = property;
  const badge = typeLabels[type];

  return (
    <Link
      href={`/propiedades/${id}`}
      className="group flex flex-col rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow duration-300 focus-visible:outline-2 focus-visible:outline-[#e35336]"
    >
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span
          className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide ${badge.className}`}
        >
          {badge.label}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <p className="text-xs font-medium text-[#e35336] uppercase tracking-wide mb-1">
          {location}
        </p>
        <h3
          className="text-lg font-bold text-[#003e3c] leading-snug mb-3 line-clamp-2"
          style={{ fontFamily: "var(--font-raleway), sans-serif" }}
        >
          {title}
        </h3>

        <div className="mt-auto">
          <div className="flex items-center gap-4 text-sm text-[#6b7280] mb-4">
            <span className="flex items-center gap-1">
              <BedIcon />
              {bedrooms} hab.
            </span>
            <span className="flex items-center gap-1">
              <BathIcon />
              {bathrooms} baño{bathrooms > 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1">
              <AreaIcon />
              {area} m²
            </span>
          </div>
          <p className="text-xl font-bold text-[#003e3c]">{formatPrice(price, type)}</p>
        </div>
      </div>
    </Link>
  );
}

function BedIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9V19M22 9V19M2 14H22M2 9C2 9 4 7 12 7C20 7 22 9 22 9" />
      <rect x="6" y="9" width="4" height="3" rx="1" />
    </svg>
  );
}

function BathIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6L9 2C9 2 9 2 10 2H14C15 2 15 2 15 3V6" />
      <path d="M3 12H21V18C21 19.1 20.1 20 19 20H5C3.9 20 3 19.1 3 18V12Z" />
      <path d="M3 12C3 10 4 9 6 9H9" />
    </svg>
  );
}

function AreaIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9H21M9 3V21" />
    </svg>
  );
}
