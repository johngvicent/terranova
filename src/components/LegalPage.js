import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";

export default function LegalPage({
  title,
  subtitle,
  updatedAt,
  summary,
  sections,
  ctaTitle = "¿Necesitas aclarar algo?",
  ctaText = "Si tienes dudas sobre cómo tratamos tus datos o sobre el uso de cookies, te respondemos personalmente.",
  ctaHref = "/contacto",
  ctaLabel = "Contactar con Terranova",
}) {
  return (
    <>
      <section className="bg-[#003e3c] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title={title} subtitle={subtitle} light />
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/70">
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/8 px-4 py-2">
              Actualizado: {updatedAt}
            </span>
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/8 px-4 py-2">
              Información clara y accesible
            </span>
          </div>
        </div>
      </section>

      <section className="bg-[#f8f5f2] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-10">
            <aside className="lg:sticky lg:top-24 h-fit space-y-6">
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6b7280]">
                  Resumen
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[#6b7280]">{summary}</p>
              </div>

              <div className="rounded-3xl bg-[#003e3c] p-6 text-white shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/50">
                  Índice
                </p>
                <nav className="mt-4 space-y-3">
                  {sections.map((section, index) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="flex items-start gap-3 rounded-2xl px-3 py-2 text-sm text-white/75 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      <span className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">
                        {index + 1}
                      </span>
                      <span>{section.title}</span>
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            <div className="space-y-6">
              {sections.map((section) => (
                <article
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-28 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-8"
                >
                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#e35336]" />
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6b7280]">
                      Apartado legal
                    </p>
                  </div>
                  <h2
                    className="mt-4 text-2xl font-bold text-[#003e3c]"
                    style={{ fontFamily: "var(--font-raleway), sans-serif" }}
                  >
                    {section.title}
                  </h2>
                  <div className="mt-4 space-y-4 text-sm leading-relaxed text-[#6b7280] sm:text-base">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                    {section.items?.length ? (
                      <ul className="space-y-3 rounded-2xl bg-[#f8f5f2] p-5 text-sm text-[#4b5563]">
                        {section.items.map((item) => (
                          <li key={item} className="flex gap-3">
                            <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#e35336]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {section.note ? (
                      <div className="rounded-2xl border border-[#003e3c]/10 bg-[#003e3c]/5 px-5 py-4 text-sm text-[#003e3c]">
                        {section.note}
                      </div>
                    ) : null}
                  </div>
                </article>
              ))}

              <section className="rounded-3xl bg-[#003e3c] px-6 py-8 text-white shadow-sm sm:px-8">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/50">
                  Contacto
                </p>
                <h2
                  className="mt-3 text-3xl font-bold"
                  style={{ fontFamily: "var(--font-raleway), sans-serif" }}
                >
                  {ctaTitle}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
                  {ctaText}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={ctaHref}
                    className="inline-flex items-center justify-center rounded-full bg-[#e35336] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#c44729]"
                  >
                    {ctaLabel}
                  </Link>
                  <a
                    href="mailto:terrainfo@terranova.es"
                    className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    terrainfo@terranova.es
                  </a>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}