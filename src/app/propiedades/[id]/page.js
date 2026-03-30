import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPropertyById, properties, formatPrice } from "@/lib/data";

export async function generateStaticParams() {
  return properties.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const property = getPropertyById(id);
  if (!property) return {};
  return {
    title: property.title,
    description: property.description.slice(0, 155),
  };
}

export default async function PropertyDetailPage({ params }) {
  const { id } = await params;
  const property = getPropertyById(id);
  if (!property) notFound();

  const {
    title, location, region, description, price, type, bedrooms, bathrooms, area, image, tags,
  } = property;

  const badge = type === "venta"
    ? { label: "En venta", className: "bg-[#003e3c] text-white" }
    : { label: "En alquiler", className: "bg-[#e35336] text-white" };

  return (
    <>
      {/* Hero image */}
      <section className="relative h-[50vh] md:h-[60vh] min-h-[320px] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-8 max-w-7xl mx-auto">
          <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-3 ${badge.className}`}>
            {badge.label}
          </span>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight max-w-3xl"
            style={{ fontFamily: "var(--font-raleway), sans-serif" }}
          >
            {title}
          </h1>
          <p className="text-white/80 mt-2 flex items-center gap-2">
            <PinIcon /> {location}, {region}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-[#f8f5f2] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="text-xs text-[#6b7280] mb-8 flex items-center gap-2">
            <Link href="/" className="hover:text-[#e35336] transition-colors">Inicio</Link>
            <span>/</span>
            <Link href="/propiedades" className="hover:text-[#e35336] transition-colors">Propiedades</Link>
            <span>/</span>
            <span className="text-[#1a1a1a] font-medium truncate">{title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Price + features */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <p
                  className="text-3xl font-extrabold text-[#003e3c]"
                  style={{ fontFamily: "var(--font-raleway), sans-serif" }}
                >
                  {formatPrice(price, type)}
                </p>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <FeatureTile icon={<BedIcon />} value={`${bedrooms}`} label="Habitaciones" />
                  <FeatureTile icon={<BathIcon />} value={`${bathrooms}`} label={bathrooms > 1 ? "Baños" : "Baño"} />
                  <FeatureTile icon={<AreaIcon />} value={`${area} m²`} label="Superficie" />
                </div>
              </div>

              {/* Description */}
              <div>
                <h2
                  className="text-2xl font-bold text-[#003e3c] mb-4"
                  style={{ fontFamily: "var(--font-raleway), sans-serif" }}
                >
                  Descripción
                </h2>
                <p className="text-[#6b7280] leading-relaxed text-base">{description}</p>
              </div>

              {/* Tags */}
              {tags?.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-[#003e3c] mb-4" style={{ fontFamily: "var(--font-raleway), sans-serif" }}>
                    Características
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span key={tag} className="px-4 py-2 rounded-full border border-[#003e3c]/20 text-sm text-[#003e3c] font-medium bg-white">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar CTA */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                <h3
                  className="text-xl font-bold text-[#003e3c] mb-2"
                  style={{ fontFamily: "var(--font-raleway), sans-serif" }}
                >
                  ¿Te interesa?
                </h3>
                <p className="text-sm text-[#6b7280] mb-6">
                  Nuestro equipo puede organizar una visita o resolver todas tus dudas.
                </p>
                <Link
                  href={`/contacto?propiedad=${id}`}
                  className="block w-full text-center py-3.5 rounded-full bg-[#e35336] hover:bg-[#c44729] text-white font-semibold transition-colors mb-3"
                >
                  Solicitar información
                </Link>
                <a
                  href={`https://wa.me/34600000000?text=${encodeURIComponent(`Hola, me interesa la propiedad "${title}" en ${location}. ¿Podríais darme más información?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full border-2 border-[#003e3c] text-[#003e3c] hover:bg-[#003e3c] hover:text-white font-semibold transition-colors text-sm"
                >
                  <WhatsAppIcon />
                  Consultar por WhatsApp
                </a>

                <div className="mt-6 pt-6 border-t border-gray-100 space-y-2 text-sm text-[#6b7280]">
                  <p className="flex items-center gap-2">
                    <EmailIcon />
                    <a href="mailto:terrainfo@terranova.es" className="hover:text-[#e35336] transition-colors">
                      terrainfo@terranova.es
                    </a>
                  </p>
                  <p className="text-xs text-gray-400">Respuesta en menos de 24 h</p>
                </div>
              </div>
            </div>
          </div>

          {/* Back link */}
          <div className="mt-12">
            <Link
              href="/propiedades"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#003e3c] hover:text-[#e35336] transition-colors"
            >
              <ArrowLeftIcon /> Volver a propiedades
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function FeatureTile({ icon, value, label }) {
  return (
    <div className="flex flex-col items-center text-center gap-2">
      <div className="text-[#e35336]">{icon}</div>
      <p className="text-xl font-bold text-[#003e3c]">{value}</p>
      <p className="text-xs text-[#6b7280]">{label}</p>
    </div>
  );
}

function PinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function BedIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9V19M22 9V19M2 14H22M2 9C2 9 4 7 12 7C20 7 22 9 22 9" />
      <rect x="6" y="9" width="4" height="3" rx="1" />
    </svg>
  );
}

function BathIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6L9 2C9 2 9 2 10 2H14C15 2 15 2 15 3V6" />
      <path d="M3 12H21V18C21 19.1 20.1 20 19 20H5C3.9 20 3 19.1 3 18V12Z" />
      <path d="M3 12C3 10 4 9 6 9H9" />
    </svg>
  );
}

function AreaIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9H21M9 3V21" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}
