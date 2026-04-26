import LegalPage from "@/components/LegalPage";

export const metadata = {
  title: "Política de privacidad",
  description:
    "Consulta cómo Terranova recopila, utiliza, conserva y protege los datos personales facilitados a través de su sitio web y canales de contacto.",
};

const privacySections = [
  {
    id: "responsable",
    title: "1. Responsable del tratamiento",
    paragraphs: [
      "Terranova actúa como responsable del tratamiento de los datos personales que se recaban a través de este sitio web y de los canales de contacto asociados a la marca.",
      "Para cualquier cuestión relacionada con privacidad puedes escribir a terrainfo@terranova.es. Atenderemos solicitudes vinculadas con el ejercicio de derechos, dudas sobre tratamientos activos o peticiones de actualización de datos.",
    ],
  },
  {
    id: "datos",
    title: "2. Qué datos tratamos",
    paragraphs: [
      "Tratamos los datos que decides facilitarnos de forma directa cuando completas formularios, escribes por correo electrónico, nos contactas por WhatsApp o solicitas información sobre una propiedad.",
    ],
    items: [
      "Datos identificativos y de contacto, como nombre, correo electrónico y teléfono.",
      "Información sobre tus preferencias inmobiliarias, presupuesto, destino o tipo de inmueble buscado.",
      "Mensajes y consultas que nos envías, junto con la información necesaria para responderlas y hacer seguimiento comercial o informativo.",
    ],
  },
  {
    id: "finalidades",
    title: "3. Finalidades y base jurídica",
    paragraphs: [
      "Utilizamos tus datos para gestionar solicitudes de información, responder consultas, coordinar visitas, enviar propuestas relacionadas con propiedades y mantener el contacto comercial cuando exista una relación previa o una solicitud expresa por tu parte.",
      "La base jurídica principal es la ejecución de medidas precontractuales solicitadas por la persona interesada, el consentimiento cuando corresponde y, en determinados casos, el interés legítimo de Terranova en atender consultas y mejorar la calidad del servicio.",
    ],
  },
  {
    id: "conservacion",
    title: "4. Plazo de conservación",
    paragraphs: [
      "Conservaremos los datos únicamente durante el tiempo necesario para atender la finalidad para la que fueron recabados y para cumplir obligaciones legales o contractuales aplicables.",
      "Cuando la información deje de ser necesaria se bloqueará o eliminará de forma segura, salvo que resulte preciso mantenerla para la formulación, ejercicio o defensa de reclamaciones.",
    ],
  },
  {
    id: "destinatarios",
    title: "5. Destinatarios de los datos",
    paragraphs: [
      "No cedemos tus datos a terceros salvo obligación legal o cuando resulte necesario para la correcta prestación del servicio, por ejemplo, proveedores tecnológicos o colaboradores que actúen por cuenta de Terranova bajo las garantías contractuales adecuadas.",
      "Si en el futuro se utilizaran herramientas adicionales que impliquen tratamiento por terceros o transferencias internacionales, esta política se actualizará para reflejarlo con transparencia.",
    ],
  },
  {
    id: "derechos",
    title: "6. Tus derechos",
    paragraphs: [
      "Puedes solicitar el acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad de tus datos en los términos previstos por la normativa aplicable.",
    ],
    items: [
      "Escríbenos a terrainfo@terranova.es indicando el derecho que deseas ejercer.",
      "Podremos solicitar información adicional para verificar tu identidad antes de tramitar la solicitud.",
      "Si consideras que no hemos tratado tus datos correctamente, puedes presentar una reclamación ante la autoridad de control competente.",
    ],
  },
  {
    id: "seguridad",
    title: "7. Seguridad y confidencialidad",
    paragraphs: [
      "Aplicamos medidas técnicas y organizativas razonables para proteger la información personal frente a accesos no autorizados, pérdida, alteración o divulgación indebida.",
      "Aun así, ninguna transmisión por Internet es completamente invulnerable, por lo que te recomendamos no compartir información especialmente sensible a través de formularios abiertos si no es estrictamente necesario.",
    ],
  },
  {
    id: "actualizaciones",
    title: "8. Cambios en esta política",
    paragraphs: [
      "Podemos actualizar esta política para adaptarla a cambios normativos, técnicos o de funcionamiento del sitio web. La versión vigente será siempre la publicada en esta página.",
    ],
    note:
      "Conviene revisar esta política periódicamente, especialmente antes de enviar datos personales a través del sitio o de nuestros canales de contacto.",
  },
];

export default function PoliticaPrivacidadPage() {
  return (
    <LegalPage
      title="Política de privacidad"
      subtitle="Cómo recopilamos, utilizamos y protegemos tu información cuando interactúas con Terranova."
      updatedAt="26 de abril de 2026"
      summary="Esta página explica qué datos personales podemos tratar, con qué finalidad, durante cuánto tiempo y qué derechos puedes ejercer sobre tu información."
      sections={privacySections}
      ctaTitle="Atendemos cualquier solicitud de privacidad"
      ctaText="Si quieres ejercer tus derechos, actualizar tus datos o resolver una duda sobre el tratamiento de tu información, ponte en contacto con nuestro equipo."
      ctaLabel="Hablar con Terranova"
    />
  );
}