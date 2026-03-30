import Image from "next/image";
import Link from "next/link";
import { getFeaturedProperties } from "@/lib/data";
import PropertyCard from "@/components/PropertyCard";
import SectionHeading from "@/components/SectionHeading";

export default function HomePage() {
  const featured = getFeaturedProperties();

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&q=80"
          alt="Paisaje natural de España"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#003e3c]/70 via-[#003e3c]/50 to-[#003e3c]/80" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center text-white">
          <p className="text-[#e35336] font-semibold text-sm sm:text-base uppercase tracking-widest mb-4">
            Inmobiliaria de naturaleza
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6"
            style={{ fontFamily: "var(--font-raleway), sans-serif" }}
          >
            Encuentra tu refugio
            <br />
            <span className="text-[#e35336]">en la naturaleza</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10">
            Propiedades exclusivas de venta y alquiler en los destinos turísticos
            naturales más espectaculares de España.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/propiedades"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#e35336] hover:bg-[#c44729] text-white text-base font-semibold transition-colors duration-200"
            >
              Ver propiedades
              <ArrowRightIcon />
            </Link>
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-white text-white hover:bg-white hover:text-[#003e3c] text-base font-semibold transition-colors duration-200"
            >
              Contactar
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 text-xs animate-bounce">
          <span>Descubrir</span>
          <ChevronDownIcon />
        </div>
      </section>

      {/* ── Stats band ───────────────────────────────────────── */}
      <section className="bg-[#f8f5f2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "+150", label: "Propiedades" },
              { value: "12", label: "Destinos naturales" },
              { value: "+500", label: "Clientes felices" },
              { value: "10", label: "Años de experiencia" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p
                  className="text-3xl sm:text-4xl font-extrabold text-[#e35336]"
                  style={{ fontFamily: "var(--font-raleway), sans-serif" }}
                >
                  {value}
                </p>
                <p className="text-sm sm:text-base text-[#6b7280] mt-1">{label}</p>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Featured properties ──────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
            <SectionHeading
              title="Propiedades destacadas"
              subtitle="Una selección de los mejores rincones naturales de España esperándote."
            />
            <Link
              href="/propiedades"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#e35336] hover:gap-3 transition-all"
            >
              Ver todas <ArrowRightIcon />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* ── About preview ────────────────────────────────────── */}
      <section className="bg-[#f8f5f2] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80"
                alt="Equipo Terranova"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div>
              <SectionHeading
                title="Tu hogar en la naturaleza"
                subtitle="Llevamos más de 10 años conectando a personas con propiedades únicas en los parajes naturales más exclusivos de España."
              />
              <p className="mt-6 text-[#6b7280] leading-relaxed">
                En Terranova entendemos que una propiedad no es solo un lugar para vivir:
                es un modo de vida. Nuestro equipo de expertos locales trabaja para encontrar
                el equilibrio perfecto entre confort, sostenibilidad y conexión con el entorno natural.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Destinos en toda la geografía española",
                  "Asesoramiento personalizado y transparente",
                  "Gestión integral de compra, venta y alquiler",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[#1a1a1a]">
                    <CheckIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/nosotros"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full border-2 border-[#003e3c] text-[#003e3c] hover:bg-[#003e3c] hover:text-white text-sm font-semibold transition-colors duration-200"
              >
                Conoce más sobre nosotros <ArrowRightIcon />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Destinations strip ───────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Nuestros destinos"
            subtitle="Desde el Cantábrico hasta el Mediterráneo, te llevamos a los rincones más bellos de España."
            centered
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-12">
            {[
              { name: "Costa Brava", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
              { name: "Mallorca", img: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=400&q=80" },
              { name: "Asturias", img: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80" },
              { name: "Sierra Nevada", img: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&q=80" },
              { name: "Ibiza", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80" },
              { name: "Pirineos", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80" },
            ].map(({ name, img }) => (
              <Link key={name} href="/propiedades" className="group relative h-40 rounded-2xl overflow-hidden block focus-visible:outline-2 focus-visible:outline-[#e35336]">
                <Image
                  src={img}
                  alt={name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-white text-xs font-semibold">{name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ───────────────────────────────────────── */}
      <section className="bg-[#e35336] py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center text-white">
          <h2
            className="text-3xl sm:text-4xl font-extrabold mb-4"
            style={{ fontFamily: "var(--font-raleway), sans-serif" }}
          >
            ¿Listo para descubrir tu próximo hogar?
          </h2>
          <p className="text-lg text-white/85 mb-8 max-w-xl mx-auto">
            Nuestro equipo está disponible para ayudarte a encontrar la propiedad
            perfecta. Contáctanos y empieza tu aventura.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/propiedades"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-[#e35336] hover:bg-[#f8f5f2] text-base font-semibold transition-colors duration-200"
            >
              Explorar propiedades
            </Link>
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-white text-white hover:bg-white/10 text-base font-semibold transition-colors duration-200"
            >
              Hablar con un asesor
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0 text-[#e35336] mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
