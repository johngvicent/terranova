import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";

export const metadata = {
  title: "Nosotros",
  description:
    "Conoce la historia, el equipo y los valores de Terranova, tu inmobiliaria especializada en destinos naturales de España.",
};

const values = [
  {
    icon: <LeafIcon />,
    title: "Naturaleza",
    description:
      "Creemos que vivir en armonía con el entorno natural transforma la calidad de vida. Seleccionamos propiedades que respetan y potencian su ecosistema.",
  },
  {
    icon: <ShieldIcon />,
    title: "Confianza",
    description:
      "Transparencia total en cada operación. Sin letra pequeña, sin sorpresas. Trabajamos para que tu proceso de compra o alquiler sea claro y seguro.",
  },
  {
    icon: <StarIcon />,
    title: "Exclusividad",
    description:
      "Acceso a propiedades únicas que no encontrarás en ningún otro portal. Una cartera cuidadosamente seleccionada para clientes que buscan algo especial.",
  },
];

const team = [
  {
    name: "John Vicent",
    role: "Fundador & Director",
    img: "https://johnvicent.es/john-about.jpg",
  },
  {
    name: "Carla Ruiz",
    role: "Directora Comercial",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  },
  {
    name: "Marta Fernández",
    role: "Asesora — Baleares",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
  },
  {
    name: "Javier Sola",
    role: "Asesor — Costa Atlántica",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
  },
];

export default function NosotrosPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-72 md:h-96 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=1600&q=80"
          alt="Paisaje natural de España"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#003e3c]/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1
            className="text-4xl sm:text-5xl font-extrabold text-white mb-4"
            style={{ fontFamily: "var(--font-raleway), sans-serif" }}
          >
            Nosotros
          </h1>
          <p className="text-white/80 text-lg max-w-xl">
            Conectamos personas con los rincones naturales más extraordinarios de España
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <SectionHeading
                title="Nuestra historia"
                subtitle="Más de una década ayudando a encontrar el hogar perfecto en la naturaleza."
              />
              <div className="mt-6 space-y-4 text-[#6b7280] leading-relaxed">
                <p>
                  Terranova nació en 2014 de la mano de Elena Martínez, una apasionada del
                  turismo rural y la arquitectura sostenible. Frustrada por la dificultad de
                  encontrar propiedades auténticas en entornos naturales a través de los
                  portales inmobiliarios convencionales, decidió crear una agencia diferente.
                </p>
                <p>
                  Hoy, con un equipo de 12 asesores especializados distribuidos por todo el
                  territorio español, gestionamos más de 150 propiedades en 12 destinos
                  naturales de primer nivel: desde las costas atlánticas de Asturias y
                  Cantabria hasta las playas mediterráneas de Baleares, pasando por los
                  valles de los Pirineos y las cumbres de Sierra Nevada.
                </p>
                <p>
                  Nuestra filosofía es simple: cada cliente merece una atención personalizada
                  y un proceso de compra o alquiler completamente transparente.
                </p>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/people/work.jpg"
                alt="Equipo Terranova trabajando"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#f8f5f2] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Nuestros valores"
            subtitle="Los principios que guían cada decisión que tomamos."
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {values.map(({ icon, title, description }) => (
              <div key={title} className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-center mb-5">
                  <div className="w-14 h-14 rounded-full bg-[#003e3c]/10 flex items-center justify-center text-[#003e3c]">
                    {icon}
                  </div>
                </div>
                <h3
                  className="text-xl font-bold text-[#003e3c] mb-3"
                  style={{ fontFamily: "var(--font-raleway), sans-serif" }}
                >
                  {title}
                </h3>
                <p className="text-[#6b7280] text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Nuestro equipo"
            subtitle="Personas apasionadas por la naturaleza y comprometidas con tu satisfacción."
            centered
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mt-12">
            {team.map(({ name, role, img }) => (
              <div key={name} className="text-center group">
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4 shadow-md">
                  <Image
                    src={img}
                    alt={name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <p
                  className="font-bold text-[#003e3c]"
                  style={{ fontFamily: "var(--font-raleway), sans-serif" }}
                >
                  {name}
                </p>
                <p className="text-sm text-[#6b7280]">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#003e3c] py-16 text-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h2
            className="text-3xl font-extrabold text-white mb-4"
            style={{ fontFamily: "var(--font-raleway), sans-serif" }}
          >
            ¿Hablamos?
          </h2>
          <p className="text-white/70 mb-8">
            Si tienes alguna pregunta o quieres empezar la búsqueda de tu propiedad, estamos aquí.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#e35336] hover:bg-[#c44729] text-white font-semibold transition-colors"
          >
            Contactar con el equipo
          </Link>
        </div>
      </section>
    </>
  );
}

function LeafIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
