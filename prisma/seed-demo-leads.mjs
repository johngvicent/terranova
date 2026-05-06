import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

function firstNonEmpty(...values) {
  return values.find((value) => typeof value === "string" && value.length > 0);
}

function getDirectConnectionString() {
  const raw = firstNonEmpty(
    process.env.DATABASE_URL,
    process.env.DIRECT_URL,
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.POSTGRES_DATABASE_URL_UNPOOLED,
    process.env.POSTGRES_PRISMA_URL,
    process.env.POSTGRES_URL,
    process.env.POSTGRES_DATABASE_URL
  );

  if (!raw) {
    throw new Error(
      "No se encontró una cadena de conexión a la base de datos. Configura DATABASE_URL o una variable POSTGRES_* válida."
    );
  }

  if (!raw.startsWith("prisma+postgres://")) {
    return raw;
  }

  const url = new URL(raw);
  const apiKey = url.searchParams.get("api_key");

  if (!apiKey) {
    throw new Error("URL prisma+postgres inválida: falta api_key.");
  }

  const payload = JSON.parse(Buffer.from(apiKey, "base64").toString());

  if (!payload?.databaseUrl) {
    throw new Error(
      "URL prisma+postgres inválida: no se pudo extraer databaseUrl del api_key."
    );
  }

  return payload.databaseUrl;
}

const DEMO_LEADS = [
  {
    nombre: "Lucia",
    apellidos: "Benavente",
    email: "lucia.benavente@example.com",
    telefono: "+34 611 210 101",
    canal: "WEB",
    intencion: "COMPRA",
    urgencia: "ALTA",
    score: 94,
    estado: "NUEVO",
    resumenIA:
      "Busca una villa discreta frente al mar en Costa Brava, con privacidad, amarre cercano y cierre antes del verano.",
    agenteEmail: "agente1@terranova.es",
    hoursAgo: 1,
    mensajes: [
      {
        contenido:
          "Estamos buscando una casa con vistas abiertas al mar en la Costa Brava, preferiblemente con jardin maduro, piscina y total privacidad. Tenemos presupuesto aprobado y nos gustaria visitar una seleccion muy cuidada esta misma semana.",
        canal: "WEB",
        direccion: "INBOUND",
        metadata: { demoTag: "premium-2026", interes: "compra", zona: "Costa Brava" },
      },
    ],
  },
  {
    nombre: "Javier",
    apellidos: "Soler",
    email: "javier.soler@example.com",
    telefono: "+34 611 210 102",
    canal: "WHATSAPP",
    intencion: "ALQUILER",
    urgencia: "ALTA",
    score: 88,
    estado: "EN_PROGRESO",
    resumenIA:
      "Traslado ejecutivo inminente a Mallorca; prioriza alquiler anual premium con vistas y entrada en menos de 30 dias.",
    agenteEmail: "admin1@terranova.es",
    hoursAgo: 3,
    mensajes: [
      {
        contenido:
          "Hola, nos trasladamos a Mallorca por trabajo y buscamos un alquiler anual en una zona tranquila entre Soller y Deia. Valoramos terraza, luz natural y posibilidad de entrar este mismo mes.",
        canal: "WHATSAPP",
        direccion: "INBOUND",
        metadata: { demoTag: "premium-2026", source: "demo-whatsapp", zona: "Mallorca" },
      },
      {
        contenido:
          "Hola Javier, hemos filtrado dos propiedades con mucha coherencia para vuestro perfil. Te enviaremos disponibilidad, condiciones y una propuesta de visita privada en cuanto confirmemos agenda.",
        canal: "EMAIL",
        direccion: "OUTBOUND",
        metadata: {
          demoTag: "premium-2026",
          subject: "Seleccion inicial de alquiler anual en Mallorca",
          to: "javier.soler@example.com",
          sentBy: { email: "admin1@terranova.es", name: "Admin" },
        },
      },
    ],
  },
  {
    nombre: "Marta",
    apellidos: "Villalba",
    email: "marta.villalba@example.com",
    telefono: "+34 611 210 103",
    canal: "EMAIL",
    intencion: "INFORMACION",
    urgencia: "MEDIA",
    score: 67,
    estado: "CONTACTADO",
    resumenIA:
      "Compara compra frente a alquiler para una segunda residencia en el norte y responde bien a asesoramiento editorializado.",
    agenteEmail: "agente1@terranova.es",
    hoursAgo: 6,
    mensajes: [
      {
        contenido:
          "Buenos dias, estamos valorando una segunda residencia en Asturias o Cantabria y nos gustaria entender mejor que opciones premium teneis tanto para compra como para alquiler de larga estancia.",
        canal: "EMAIL",
        direccion: "INBOUND",
        metadata: {
          demoTag: "premium-2026",
          subject: "Consulta sobre segunda residencia en el norte",
        },
      },
      {
        contenido:
          "Hola Marta, gracias por escribirnos. Hemos preparado una primera curaduria de zonas y perfiles de propiedad para que puedas comparar compra y alquiler con mas criterio y menos ruido.",
        canal: "EMAIL",
        direccion: "OUTBOUND",
        metadata: {
          demoTag: "premium-2026",
          subject: "Re: Consulta sobre segunda residencia en el norte",
          to: "marta.villalba@example.com",
          sentBy: { email: "agente1@terranova.es", name: "Agente Demo" },
        },
      },
    ],
  },
  {
    nombre: "Alejandro",
    apellidos: "Crespo",
    email: "alejandro.crespo@example.com",
    telefono: "+34 611 210 104",
    canal: "WEB",
    intencion: "VENTA",
    urgencia: "MEDIA",
    score: 58,
    estado: "CERRADO_GANADO",
    resumenIA:
      "Propietario de finca singular en Gredos; ha aprobado propuesta de comercializacion boutique y cuenta como conversion cerrada.",
    agenteEmail: "admin1@terranova.es",
    hoursAgo: 28,
    mensajes: [
      {
        contenido:
          "Quiero vender una finca rehabilitada en la Sierra de Gredos y me interesa un enfoque mas selectivo, orientado a comprador nacional e internacional que valore arquitectura, entorno y discrecion.",
        canal: "WEB",
        direccion: "INBOUND",
        metadata: { demoTag: "premium-2026", interes: "vender", zona: "Sierra de Gredos" },
      },
      {
        contenido:
          "Alejandro, gracias por la informacion. Hemos validado que el activo encaja muy bien en nuestro catalogo editorial y podemos arrancar la comercializacion con una narrativa y un targeting muy precisos.",
        canal: "EMAIL",
        direccion: "OUTBOUND",
        metadata: {
          demoTag: "premium-2026",
          subject: "Propuesta de comercializacion Terranova",
          to: "alejandro.crespo@example.com",
          sentBy: { email: "admin1@terranova.es", name: "Admin" },
        },
      },
    ],
  },
  {
    nombre: "Carmen",
    apellidos: "Robles",
    email: "carmen.robles@example.com",
    telefono: "+34 611 210 105",
    canal: "EMAIL",
    intencion: "ALQUILER",
    urgencia: "BAJA",
    score: 34,
    estado: "CERRADO_PERDIDO",
    resumenIA:
      "Consulta inspiracional para una estancia larga en montana; aplaza la decision hasta otono y sale del funnel comercial activo.",
    agenteEmail: null,
    hoursAgo: 50,
    mensajes: [
      {
        contenido:
          "Hola, estoy sonando con pasar una temporada larga en una casa de montana el proximo otono. De momento solo estoy reuniendo referencias con mucho encanto, especialmente casas serenas y bien cuidadas.",
        canal: "EMAIL",
        direccion: "INBOUND",
        metadata: {
          demoTag: "premium-2026",
          subject: "Inspiracion para una estancia en otono",
        },
      },
    ],
  },
  {
    nombre: "Tomas",
    apellidos: "Echevarria",
    email: "tomas.echevarria@example.com",
    telefono: "+34 611 210 106",
    canal: "WHATSAPP",
    intencion: "COMPRA",
    urgencia: "BAJA",
    score: 26,
    estado: "NUEVO",
    resumenIA:
      "Interes exploratorio para 2027; quiere recibir catalogo curado y seguir la conversacion sin presion comercial.",
    agenteEmail: null,
    hoursAgo: 74,
    mensajes: [
      {
        contenido:
          "Buenas, estamos empezando a mirar con calma propiedades de naturaleza para el ano que viene, quiza Asturias o Menorca. Si teneis una seleccion muy cuidada, me encantara revisarla sin prisa.",
        canal: "WHATSAPP",
        direccion: "INBOUND",
        metadata: { demoTag: "premium-2026", source: "demo-whatsapp", horizonte: "2027" },
      },
    ],
  },
  {
    nombre: "Sofia",
    apellidos: "Maristany",
    email: "sofia.maristany@example.com",
    telefono: "+34 611 210 107",
    canal: "EMAIL",
    intencion: "COMPRA",
    urgencia: "ALTA",
    score: 91,
    estado: "CONTACTADO",
    resumenIA:
      "Busca una casa de verano en Menorca con acceso discreto al mar y responde a propuestas muy filtradas.",
    agenteEmail: "admin1@terranova.es",
    hoursAgo: 2,
    mensajes: [
      {
        contenido:
          "Estamos buscando una propiedad en Menorca para uso familiar, preferiblemente con jardin mediterraneo, acceso cercano al mar y una sensacion de refugio elegante. Si teneis una seleccion muy cuidada, nos encantaria verla.",
        canal: "EMAIL",
        direccion: "INBOUND",
        metadata: {
          demoTag: "premium-2026",
          subject: "Busqueda de propiedad en Menorca",
        },
      },
      {
        contenido:
          "Hola Sofia, estamos preparando una seleccion corta con propiedades que encajan bien por estilo, privacidad y ubicacion. Te la enviaremos en cuanto validemos las ultimas disponibilidades.",
        canal: "EMAIL",
        direccion: "OUTBOUND",
        metadata: {
          demoTag: "premium-2026",
          subject: "Re: Busqueda de propiedad en Menorca",
          to: "sofia.maristany@example.com",
          sentBy: { email: "admin1@terranova.es", name: "Admin" },
        },
      },
    ],
  },
  {
    nombre: "Eduardo",
    apellidos: "Figueroa",
    email: "eduardo.figueroa@example.com",
    telefono: "+34 611 210 108",
    canal: "WEB",
    intencion: "ALQUILER",
    urgencia: "ALTA",
    score: 84,
    estado: "EN_PROGRESO",
    resumenIA:
      "Necesita una estancia larga en el Pirineo catalan para verano y teletrabajo; valora rapidez y filtrado serio.",
    agenteEmail: "agente1@terranova.es",
    hoursAgo: 10,
    mensajes: [
      {
        contenido:
          "Buscamos una casa amplia y serena en el Pirineo catalan para una estancia de tres meses. Valoramos buena luz, silencio, vistas abiertas y espacios comodos para teletrabajo.",
        canal: "WEB",
        direccion: "INBOUND",
        metadata: { demoTag: "premium-2026", interes: "alquiler", zona: "Pirineo catalan" },
      },
      {
        contenido:
          "Hola Eduardo, ya estamos filtrando propiedades con buen nivel de privacidad, orientacion y calidad de interiores. Mañana te enviaremos una shortlist muy ajustada.",
        canal: "EMAIL",
        direccion: "OUTBOUND",
        metadata: {
          demoTag: "premium-2026",
          subject: "Preseleccion de estancia larga en el Pirineo",
          to: "eduardo.figueroa@example.com",
          sentBy: { email: "agente1@terranova.es", name: "Agente Demo" },
        },
      },
    ],
  },
  {
    nombre: "Beatriz",
    apellidos: "Llorente",
    email: "beatriz.llorente@example.com",
    telefono: "+34 611 210 109",
    canal: "WHATSAPP",
    intencion: "VENTA",
    urgencia: "MEDIA",
    score: 61,
    estado: "NUEVO",
    resumenIA:
      "Quiere valorar la venta de una casa de campo restaurada y espera una propuesta comercial elegante, no masiva.",
    agenteEmail: "admin1@terranova.es",
    hoursAgo: 14,
    mensajes: [
      {
        contenido:
          "Hola, estoy pensando en vender una casa de campo restaurada en el Emporda. No tengo prisa, pero si me gustaria entender como planteais una comercializacion mas selectiva y menos convencional.",
        canal: "WHATSAPP",
        direccion: "INBOUND",
        metadata: { demoTag: "premium-2026", source: "demo-whatsapp", zona: "Emporda" },
      },
    ],
  },
  {
    nombre: "Nicolas",
    apellidos: "Aranda",
    email: "nicolas.aranda@example.com",
    telefono: "+34 611 210 110",
    canal: "EMAIL",
    intencion: "INFORMACION",
    urgencia: "MEDIA",
    score: 52,
    estado: "CONTACTADO",
    resumenIA:
      "Busca entender el mercado de fincas habitables para un proyecto familiar a medio plazo; responde bien a contexto y comparativas.",
    agenteEmail: null,
    hoursAgo: 40,
    mensajes: [
      {
        contenido:
          "Estoy explorando la posibilidad de adquirir una finca habitable para combinar uso familiar y pequenas estancias creativas. Me interesa entender zonas, rangos y tipologias con calma.",
        canal: "EMAIL",
        direccion: "INBOUND",
        metadata: {
          demoTag: "premium-2026",
          subject: "Informacion sobre fincas habitables",
        },
      },
      {
        contenido:
          "Hola Nicolas, podemos ayudarte con una primera lectura del mercado y una seleccion de zonas con sentido para ese enfoque. Te enviaremos una nota comparativa muy clara para empezar.",
        canal: "EMAIL",
        direccion: "OUTBOUND",
        metadata: {
          demoTag: "premium-2026",
          subject: "Re: Informacion sobre fincas habitables",
          to: "nicolas.aranda@example.com",
          sentBy: { email: "agente1@terranova.es", name: "Agente Demo" },
        },
      },
    ],
  },
  {
    nombre: "Isabel",
    apellidos: "de la Vega",
    email: "isabel.delavega@example.com",
    telefono: "+34 611 210 111",
    canal: "WEB",
    intencion: "ALQUILER",
    urgencia: "BAJA",
    score: 39,
    estado: "CERRADO_GANADO",
    resumenIA:
      "Reserva una estancia de otono para desconexion y teletrabajo; el proceso ya esta cerrado con buen ajuste de producto.",
    agenteEmail: "agente1@terranova.es",
    hoursAgo: 36,
    mensajes: [
      {
        contenido:
          "Quiero reservar con tiempo una estancia larga en una casa tranquila de montana para otono. Busco silencio, interiorismo cuidado y un entorno muy natural.",
        canal: "WEB",
        direccion: "INBOUND",
        metadata: { demoTag: "premium-2026", interes: "alquiler", horizonte: "otono" },
      },
      {
        contenido:
          "Hola Isabel, hemos confirmado una opcion muy alineada con lo que nos comentas y ya podemos dejarla bloqueada para las fechas que te interesan.",
        canal: "EMAIL",
        direccion: "OUTBOUND",
        metadata: {
          demoTag: "premium-2026",
          subject: "Reserva confirmada para estancia de otono",
          to: "isabel.delavega@example.com",
          sentBy: { email: "agente1@terranova.es", name: "Agente Demo" },
        },
      },
    ],
  },
  {
    nombre: "Guillermo",
    apellidos: "Pardo",
    email: "guillermo.pardo@example.com",
    telefono: "+34 611 210 112",
    canal: "WHATSAPP",
    intencion: "COMPRA",
    urgencia: "BAJA",
    score: 28,
    estado: "CERRADO_PERDIDO",
    resumenIA:
      "Interes inicial en una compra patrimonial, pero decide pausar el proceso hasta el proximo ejercicio fiscal.",
    agenteEmail: null,
    hoursAgo: 82,
    mensajes: [
      {
        contenido:
          "Estamos valorando con calma una compra patrimonial en el norte, pero seguramente lo moveremos ya de cara al proximo ano. Si teneis material inspiracional, encantado de verlo.",
        canal: "WHATSAPP",
        direccion: "INBOUND",
        metadata: { demoTag: "premium-2026", source: "demo-whatsapp", horizonte: "proximo ejercicio" },
      },
    ],
  },
];

const OLD_DEMO_EMAILS = [
  "alba.demo@terranova.es",
  "bruno.demo@terranova.es",
  "carla.demo@terranova.es",
  "diego.demo@terranova.es",
  "elena.demo@terranova.es",
  "fabio.demo@terranova.es",
];

const OLD_DEMO_NAMES = [
  "Demo Alba",
  "Demo Bruno",
  "Demo Carla",
  "Demo Diego",
  "Demo Elena",
  "Demo Fabio",
];

const adapter = new PrismaPg({ connectionString: getDirectConnectionString() });
const prisma = new PrismaClient({ adapter });

try {
  const agents = await prisma.agent.findMany({
    where: {
      email: { in: ["agente1@terranova.es", "admin1@terranova.es"] },
    },
    select: { id: true, email: true },
  });

  const agentIdByEmail = Object.fromEntries(
    agents.map((agent) => [agent.email, agent.id])
  );

  await prisma.lead.deleteMany({
    where: {
      OR: [
        { email: { in: OLD_DEMO_EMAILS } },
        { email: { in: DEMO_LEADS.map((lead) => lead.email) } },
        { nombre: { in: OLD_DEMO_NAMES } },
      ],
    },
  });

  const now = Date.now();

  for (const lead of DEMO_LEADS) {
    const createdAt = new Date(now - lead.hoursAgo * 60 * 60 * 1000);

    await prisma.lead.create({
      data: {
        nombre: lead.nombre,
        apellidos: lead.apellidos,
        email: lead.email,
        telefono: lead.telefono,
        canal: lead.canal,
        intencion: lead.intencion,
        urgencia: lead.urgencia,
        score: lead.score,
        estado: lead.estado,
        resumenIA: lead.resumenIA,
        agenteId: lead.agenteEmail ? agentIdByEmail[lead.agenteEmail] ?? null : null,
        createdAt,
        mensajes: {
          create: lead.mensajes.map((message, index) => ({
            ...message,
            createdAt: new Date(createdAt.getTime() + index * 45 * 60 * 1000),
          })),
        },
      },
    });

    console.log(
      `✓ ${lead.nombre} ${lead.apellidos} | ${lead.urgencia} | ${lead.estado}`
    );
  }

  const urgencySummary = await prisma.lead.groupBy({
    by: ["urgencia"],
    where: { email: { in: DEMO_LEADS.map((lead) => lead.email) } },
    _count: true,
  });

  console.log("\nResumen por urgencia:");
  for (const item of urgencySummary) {
    console.log(`  ${item.urgencia}: ${item._count}`);
  }
} finally {
  await prisma.$disconnect();
}
