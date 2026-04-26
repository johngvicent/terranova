import LegalPage from "@/components/LegalPage";

export const metadata = {
  title: "Política de cookies",
  description:
    "Consulta qué cookies utiliza Terranova en su sitio web, con qué finalidad se emplean y cómo puedes gestionarlas desde tu navegador.",
};

const cookieSections = [
  {
    id: "que-son",
    title: "1. Qué son las cookies",
    paragraphs: [
      "Las cookies son pequeños archivos de texto que un sitio web puede almacenar en tu dispositivo para recordar información sobre tu visita, mejorar la navegación y habilitar determinadas funcionalidades.",
      "También pueden utilizarse tecnologías similares, como almacenamiento local o identificadores de sesión, con finalidades equivalentes a las descritas en esta política.",
    ],
  },
  {
    id: "tipos",
    title: "2. Qué categorías puede utilizar este sitio",
    paragraphs: [
      "Terranova prioriza el uso de cookies técnicas o estrictamente necesarias para el correcto funcionamiento del sitio. En función de la evolución del proyecto, podrían incorporarse otras categorías, siempre con la información y el consentimiento que resulten exigibles.",
    ],
    items: [
      "Cookies técnicas: permiten la navegación, la seguridad del sitio y el acceso a áreas restringidas o administrativas.",
      "Cookies de preferencias: recuerdan elecciones básicas del usuario para mejorar la experiencia, cuando se habiliten estas opciones.",
      "Cookies analíticas o de medición: solo se incorporarían para conocer el uso del sitio y optimizar contenidos, informando previamente de ello.",
      "Cookies de terceros: podrían aparecer si se integran servicios externos que requieran su propia capa de cookies y siempre quedarían sujetas a esta política y, en su caso, a la del proveedor correspondiente.",
    ],
  },
  {
    id: "actuales",
    title: "3. Cookies actualmente necesarias",
    paragraphs: [
      "En el estado actual del proyecto, el sitio puede emplear cookies o identificadores de sesión necesarios para funciones esenciales como mantener la navegación segura, gestionar sesiones administrativas y recordar configuraciones mínimas para el funcionamiento básico.",
      "Estas tecnologías no se utilizan para elaborar perfiles comerciales y, cuando son estrictamente necesarias, no requieren consentimiento previo, aunque sí deben informarse de forma clara al usuario.",
    ],
  },
  {
    id: "gestion",
    title: "4. Cómo gestionar o desactivar cookies",
    paragraphs: [
      "Puedes configurar tu navegador para aceptar, bloquear o eliminar cookies. Ten en cuenta que, si desactivas las cookies técnicas, algunas partes del sitio podrían dejar de funcionar correctamente.",
    ],
    items: [
      "Revisa la configuración de privacidad de tu navegador habitual para gestionar permisos por sitio web.",
      "Elimina cookies ya almacenadas si deseas reiniciar tus preferencias o revocar configuraciones anteriores.",
      "Si en el futuro incorporamos un panel de consentimiento, podrás modificar desde allí tus elecciones de forma granular.",
    ],
  },
  {
    id: "duracion",
    title: "5. Duración de las cookies",
    paragraphs: [
      "Las cookies pueden ser de sesión, cuando desaparecen al cerrar el navegador, o persistentes, cuando permanecen durante un tiempo determinado para recordar preferencias o ajustes en futuras visitas.",
      "La duración concreta dependerá de la funcionalidad que se habilite en cada momento y se actualizará en esta política cuando proceda.",
    ],
  },
  {
    id: "actualizaciones",
    title: "6. Actualizaciones de esta política",
    paragraphs: [
      "Esta política podrá modificarse si cambia la configuración técnica del sitio, si se añaden nuevos servicios o si la normativa aplicable lo exige.",
    ],
    note:
      "Si tienes dudas sobre el uso de cookies en Terranova, escríbenos a terrainfo@terranova.es y te indicaremos qué tecnologías están activas en cada momento.",
  },
];

export default function PoliticaCookiesPage() {
  return (
    <LegalPage
      title="Política de cookies"
      subtitle="Qué tecnologías de almacenamiento puede utilizar Terranova y cómo puedes gestionarlas con control."
      updatedAt="26 de abril de 2026"
      summary="Aquí explicamos qué son las cookies, qué tipos pueden intervenir en este sitio y cómo puedes aceptarlas, restringirlas o eliminarlas desde tu navegador."
      sections={cookieSections}
      ctaTitle="Te explicamos cualquier detalle técnico"
      ctaText="Si quieres confirmar qué cookies están activas o cómo afectan a tu navegación, te lo aclaramos por correo antes de que tomes una decisión."
      ctaLabel="Resolver dudas"
    />
  );
}