import SectionHeading from "@/components/SectionHeading";
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contacto",
  description:
    "Contacta con Terranova por WhatsApp, correo electrónico o a través de nuestro formulario. Estamos aquí para ayudarte a encontrar tu propiedad ideal.",
};

const contactInfo = [
  {
    icon: <EmailIcon />,
    title: "Correo electrónico",
    value: "terrainfo@terranova.es",
    href: "mailto:terrainfo@terranova.es",
    description: "Respondemos en menos de 24 h",
  },
  {
    icon: <WhatsAppIcon />,
    title: "WhatsApp",
    value: "+34 600 000 000",
    href: "https://wa.me/34600000000",
    description: "Atención: Lun–Vie, 9:00–19:00",
    external: true,
  },
  {
    icon: <PhoneIcon />,
    title: "Teléfono",
    value: "+34 600 000 000",
    href: "tel:+34600000000",
    description: "Lun–Vie, 9:00–19:00",
  },
];

export default function ContactoPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-[#003e3c] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Contacto"
            subtitle="¿Tienes alguna pregunta o quieres conocer más sobre una propiedad? Estamos aquí para ayudarte."
            light
          />
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-[#f8f5f2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left: Contact info */}
            <div className="space-y-6">
              <h2
                className="text-2xl font-bold text-[#003e3c]"
                style={{ fontFamily: "var(--font-raleway), sans-serif" }}
              >
                Cómo contactarnos
              </h2>

              {contactInfo.map(({ icon, title, value, href, description, external }) => (
                <a
                  key={title}
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="w-11 h-11 rounded-full bg-[#003e3c]/10 flex items-center justify-center text-[#003e3c] flex-shrink-0 group-hover:bg-[#e35336] group-hover:text-white transition-colors">
                    {icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">{title}</p>
                    <p className="font-semibold text-[#003e3c] mt-0.5 break-all">{value}</p>
                    <p className="text-xs text-[#6b7280] mt-1">{description}</p>
                  </div>
                </a>
              ))}

              {/* WhatsApp CTA button */}
              <a
                href="https://wa.me/34600000000?text=Hola%2C%20me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n%20sobre%20vuestras%20propiedades."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold text-base transition-colors shadow-md"
              >
                <WhatsAppIcon />
                Abrir chat de WhatsApp
              </a>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-8">
              <h2
                className="text-2xl font-bold text-[#003e3c] mb-2"
                style={{ fontFamily: "var(--font-raleway), sans-serif" }}
              >
                Envíanos un mensaje
              </h2>
              <p className="text-sm text-[#6b7280] mb-8">
                Usa el siguiente formulario para realizar consultas, solicitar información
                sobre una propiedad o reservar una visita.
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function EmailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
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

function PhoneIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.1 6.1l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
