# Terranova — El Arquitecto Proptech

> Sistema inteligente de gestión de leads para inmobiliaria. Centraliza mensajes de WhatsApp, email y formulario web, los clasifica con IA (GPT-4o-mini) por intención y urgencia, y los presenta en un dashboard para los agentes.

## Tabla de Contenidos

- [El Problema](#el-problema)
- [La Solución](#la-solución)
- [Stack Tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Instalación](#instalación)
- [Variables de Entorno](#variables-de-entorno)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Reference](#api-reference)
- [Flujo de la IA](#flujo-de-la-ia)
- [Seguridad](#seguridad)
- [Contribución](#contribución)

---

## El Problema

Terranova pierde el **60% de sus ventas potenciales** por no poder filtrar cientos de mensajes diarios provenientes de WhatsApp, email y formularios web. Los agentes no distinguen un lead urgente con presupuesto de una consulta exploratoria, y el tiempo de respuesta se dispara.

## La Solución

Un sistema de **ingesta centralizada + clasificación IA + CRM integrado** que:

1. **Recibe** mensajes de 3 canales (WhatsApp Business API, SendGrid Inbound Parse, formulario web)
2. **Clasifica** cada lead con GPT-4o-mini: intención (compra/alquiler/venta/info), urgencia (alta/media/baja) y score (0-100)
3. **Deduplica** contactos que escriben por múltiples canales
4. **Responde** automáticamente con un mensaje personalizado según la prioridad
5. **Presenta** todo en un dashboard con filtros, métricas y asignación a agentes

---

## Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Framework | Next.js (App Router) | 16.2.1 |
| UI | React + Tailwind CSS | 19.2.4 / v4 |
| Base de Datos | PostgreSQL (Supabase) | — |
| ORM | Prisma | 7.6.0 |
| IA | OpenAI GPT-4o-mini | SDK 6.33 |
| Autenticación | Auth.js (NextAuth v5) | 5.0 beta |
| Validación | Zod | 4.3.6 |
| Compilador | React Compiler + Turbopack | — |

---

## Arquitectura

```
┌────────────── CANALES DE ENTRADA ──────────────────────┐
│   WhatsApp          Email             Formulario Web   │
│   Business API      SendGrid          ContactForm.js   │
│       │               │                    │           │
│       ▼               ▼                    ▼           │
│   /api/webhooks/  /api/webhooks/     /api/leads        │
│   whatsapp        email              POST              │
└───────────────────────┬────────────────────────────────┘
                        │
                        ▼
┌────────── PROCESAMIENTO ───────────────────────────────┐
│   ┌──────────────┐   ┌──────────────┐                  │
│   │ Deduplicación│──▶│ Clasificador │                  │
│   │ por email/   │   │ IA (GPT-4o-  │                  │
│   │ teléfono     │   │ mini)        │                  │
│   └──────────────┘   └──────┬───────┘                  │
│                             │                          │
│              ┌──────────────┼──────────────┐           │
│              ▼              ▼              ▼            │
│           Score>70      40-70          <40             │
│           🔴 HOT       🟡 WARM       🔵 COLD           │
│           Asignar +    Auto-resp.    Respuesta          │
│           alerta       + cola        genérica           │
└────────────────────────┬───────────────────────────────┘
                         │
                         ▼
┌────────── PERSISTENCIA ────────────────────────────────┐
│   PostgreSQL (Prisma ORM)                              │
│   ├── Lead (clasificación, estado, agente)             │
│   ├── Message (historial por canal)                    │
│   ├── Property (catálogo inmobiliario)                 │
│   ├── Agent (usuarios del CRM)                        │
│   └── AuditLog (trazabilidad RGPD)                    │
└────────────────────────┬───────────────────────────────┘
                         │
                         ▼
┌────────── DASHBOARD ADMIN (/admin) ────────────────────┐
│   • KPIs: leads hoy, semana, tasa conversión           │
│   • Bandeja de leads con filtros (urgencia/estado/canal)│
│   • Detalle: historial de mensajes + resumen IA        │
│   • Cambio de estado y asignación a agentes            │
└────────────────────────────────────────────────────────┘
```

---

## Instalación

### Requisitos previos

- **Node.js 20.9+**
- **PostgreSQL** (local o [Supabase](https://supabase.com) free tier)
- Cuenta de [OpenAI](https://platform.openai.com) (para clasificación IA)

### Pasos

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd terranova

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales (ver sección Variables de Entorno)

# 4. Generar el cliente Prisma
npx prisma generate

# 5. Ejecutar migraciones de base de datos
npx prisma migrate dev --name init

# 6. (Opcional) Crear un agente admin inicial
node -e "
const { createHash } = require('crypto');
const hash = createHash('sha256').update('tu-contraseña').digest('hex');
console.log('Hash:', hash);
// Usarlo en: npx prisma studio → tabla Agent → crear registro
"

# 7. Arrancar en desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) para ver el sitio público y [http://localhost:3000/admin/login](http://localhost:3000/admin/login) para el panel de gestión.

### Comandos disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo (Turbopack) |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción |
| `npm run lint` | Lint con ESLint |
| `npx prisma studio` | GUI visual de la base de datos |
| `npx prisma migrate dev` | Crear/aplicar migraciones |
| `npx prisma generate` | Regenerar cliente Prisma |

---

## Variables de Entorno

Copia `.env.example` a `.env.local` y rellena cada valor:

| Variable | Descripción | Cómo obtenerla |
|----------|-------------|----------------|
| `DATABASE_URL` | Connection string de PostgreSQL | Supabase → Settings → Database → URI |
| `ENCRYPTION_KEY` | Clave AES-256 (64 chars hex) | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `OPENAI_API_KEY` | API key de OpenAI | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| `AUTH_SECRET` | Secreto para firmar tokens JWT | `npx auth secret` |
| `WHATSAPP_TOKEN` | Token de acceso de WhatsApp Business | Meta Developer Console → WhatsApp → API Setup |
| `WHATSAPP_VERIFY_TOKEN` | Token personalizado para verificar el webhook | Inventar uno propio |
| `WHATSAPP_PHONE_NUMBER_ID` | ID del número de teléfono de WhatsApp | Meta Developer Console |
| `SENDGRID_API_KEY` | API key de SendGrid | [app.sendgrid.com/settings/api_keys](https://app.sendgrid.com/settings/api_keys) |
| `EMAIL_FROM` | Dirección de envío de emails | p.ej. `contacto@terranova.es` |

> **Importante:** Las variables sin prefijo `NEXT_PUBLIC_` **nunca** llegan al navegador del usuario. Solo están disponibles en el servidor (API Routes, Server Components).

---

## Estructura del Proyecto

```
terranova/
├── prisma/
│   └── schema.prisma           # Modelos de datos (Lead, Message, Property, Agent, AuditLog)
├── public/
│   ├── branding/               # Logotipos (SVG, PNG, PDF)
│   └── favicon.svg
├── src/
│   ├── app/
│   │   ├── layout.js           # Layout raíz (fonts, Header, Footer)
│   │   ├── page.js             # Home: hero, propiedades destacadas, stats
│   │   ├── contacto/page.js    # Página de contacto
│   │   ├── nosotros/page.js    # Sobre nosotros + equipo
│   │   ├── propiedades/
│   │   │   ├── page.js         # Listado con filtros venta/alquiler
│   │   │   └── [id]/page.js    # Detalle de propiedad (SSG)
│   │   ├── admin/
│   │   │   ├── layout.js       # Layout admin (sidebar + auth check)
│   │   │   ├── page.js         # Dashboard: KPIs y distribuciones
│   │   │   ├── login/page.js   # Login de agentes
│   │   │   └── leads/
│   │   │       ├── page.js     # Bandeja de leads (tabla + filtros)
│   │   │       └── [id]/page.js# Detalle del lead + mensajes
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.js  # Auth.js endpoints
│   │       ├── leads/
│   │       │   ├── route.js    # POST (público) + GET (admin)
│   │       │   ├── [id]/route.js # GET + PATCH + DELETE
│   │       │   └── stats/route.js # KPIs para dashboard
│   │       └── webhooks/
│   │           ├── whatsapp/route.js # Webhook Meta Business API
│   │           └── email/route.js    # Webhook SendGrid Inbound Parse
│   ├── components/
│   │   ├── admin/
│   │   │   └── AdminSidebar.js # Navegación lateral del panel
│   │   ├── Button.js           # Botón reutilizable (3 variantes, 3 tamaños)
│   │   ├── ContactForm.js      # Formulario → POST /api/leads
│   │   ├── Footer.js           # Footer con contacto y redes
│   │   ├── Header.js           # Navegación principal + móvil
│   │   ├── PropertyCard.js     # Tarjeta de propiedad
│   │   ├── PropertyListings.js # Grid con filtros
│   │   └── SectionHeading.js   # Encabezado de sección reutilizable
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── classifier.js   # Clasificación de leads con GPT-4o-mini
│   │   │   ├── responder.js    # Auto-respuesta personalizada
│   │   │   └── prompts.js      # System prompts + builders
│   │   ├── channels/
│   │   │   ├── whatsapp.js     # Parser + verificación HMAC
│   │   │   └── email.js        # Parser de SendGrid Inbound
│   │   ├── leads/
│   │   │   └── deduplication.js# Busca/crea leads sin duplicados
│   │   ├── auth.js             # Configuración Auth.js v5
│   │   ├── crypto.js           # AES-256-GCM encrypt/decrypt
│   │   ├── data.js             # Datos estáticos de propiedades
│   │   ├── prisma.js           # Singleton PrismaClient
│   │   ├── ratelimit.js        # Rate limiter en memoria
│   │   └── validations.js      # Schemas Zod
│   └── middleware.js           # Protección /admin + /api/leads
├── .env.example                # Template de variables de entorno
├── next.config.mjs             # Headers de seguridad + imagen remota
└── package.json
```

---

## API Reference

### Endpoints Públicos

#### `POST /api/leads` — Crear lead desde formulario web

```json
// Request body
{
  "nombre": "Elena García",
  "apellidos": "López",
  "email": "elena@ejemplo.com",
  "telefono": "+34 612 345 678",
  "interes": "compra",
  "mensaje": "Busco una casa rural en Asturias con 4 habitaciones, presupuesto ~400k",
  "privacidad": true
}

// Response 201
{
  "success": true,
  "message": "¡Mensaje recibido! Nos pondremos en contacto contigo pronto.",
  "leadId": "cm..."
}
```

**Validación (Zod):**
- `nombre`: obligatorio, 1-100 chars
- `mensaje`: obligatorio, 1-5000 chars
- `privacidad`: debe ser `true`
- `email`, `telefono`, `apellidos`, `interes`: opcionales
- `interes`: `"compra"` | `"alquiler"` | `"vender"` | `"info"` | `"reserva"` | `""`

**Rate limit:** 5 peticiones por IP cada 15 minutos.

---

#### `POST /api/webhooks/whatsapp` — Webhook de WhatsApp Business

Recibe mensajes de Meta Business API. Flujo:

1. Verificación HMAC-SHA256 del header `X-Hub-Signature-256`
2. Parseo del payload anidado de Meta
3. Deduplicación por número de teléfono (encriptado)
4. Clasificación IA asíncrona

El endpoint `GET` gestiona la verificación del webhook (challenge de Meta).

---

#### `POST /api/webhooks/email` — Webhook de SendGrid Inbound Parse

Recibe emails como `multipart/form-data`. Flujo:

1. Parseo de campos: `from`, `subject`, `text`, `html`
2. Extracción de nombre y email del formato `"Nombre <email@domain>"`
3. Deduplicación por email (encriptado)
4. Clasificación IA asíncrona

---

### Endpoints Protegidos (requieren autenticación)

#### `GET /api/leads` — Listar leads

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `estado` | `string` | Filtrar: `NUEVO`, `CONTACTADO`, `EN_PROGRESO`, `CERRADO_GANADO`, `CERRADO_PERDIDO` |
| `urgencia` | `string` | Filtrar: `ALTA`, `MEDIA`, `BAJA` |
| `canal` | `string` | Filtrar: `WEB`, `WHATSAPP`, `EMAIL` |
| `page` | `number` | Página (default: 1) |
| `limit` | `number` | Resultados por página (default: 20, max: 50) |

```json
// Response 200
{
  "leads": [ { "id": "...", "nombre": "...", "urgencia": "ALTA", "score": 85, ... } ],
  "pagination": { "page": 1, "limit": 20, "total": 142, "totalPages": 8 }
}
```

---

#### `GET /api/leads/:id` — Detalle de lead

Devuelve el lead con todos sus mensajes ordenados cronológicamente y datos del agente asignado.

---

#### `PATCH /api/leads/:id` — Actualizar estado o agente

```json
// Request body (todos los campos opcionales)
{
  "estado": "CONTACTADO",
  "agenteId": "cm..."
}
```

---

#### `DELETE /api/leads/:id` — Eliminar lead (RGPD)

Elimina el lead y todos sus mensajes en cascada. Cumple con el derecho al olvido del RGPD.

---

#### `GET /api/leads/stats` — KPIs del dashboard

```json
// Response 200
{
  "totalLeads": 142,
  "leadsHoy": 12,
  "leadsSemana": 67,
  "tasaConversion": 34,
  "porEstado": { "NUEVO": 45, "CONTACTADO": 30, "EN_PROGRESO": 25, ... },
  "porUrgencia": { "ALTA": 20, "MEDIA": 60, "BAJA": 50, ... },
  "porCanal": { "WEB": 80, "WHATSAPP": 40, "EMAIL": 22 }
}
```

---

## Flujo de la IA

### Clasificador (`src/lib/ai/classifier.js`)

Cada mensaje que llega al sistema (web, WhatsApp o email) se clasifica con GPT-4o-mini:

```
Mensaje del cliente
        │
        ▼
┌─────────────────────────────────────────┐
│  GPT-4o-mini (temperature: 0.1)         │
│  JSON mode activado                     │
│                                         │
│  Salida:                                │
│  ├── intencion: COMPRA | ALQUILER |     │
│  │              VENTA | INFORMACION |   │
│  │              SPAM                    │
│  ├── urgencia:  ALTA | MEDIA | BAJA    │
│  ├── score:     0-100                   │
│  ├── presupuesto: número o null         │
│  ├── zona: texto o null                 │
│  └── resumen: 1-2 frases                │
└─────────────────────────────────────────┘
```

**Criterios de puntuación (score):**

| Factor | Puntos |
|--------|--------|
| Intención clara y definida | +40 |
| Urgencia alta (+30) / media (+15) | +15 a +30 |
| Datos de contacto completos | +20 |
| Presupuesto mencionado | +10 |

**Ejemplo de clasificación:**

| Mensaje | Intención | Urgencia | Score |
|---------|-----------|----------|-------|
| _"Busco casa en Asturias 4 hab, presupuesto 400k, necesito para julio"_ | COMPRA | ALTA | 85 |
| _"Me gustaría información sobre alquileres en Mallorca"_ | ALQUILER | MEDIA | 55 |
| _"Hola, qué hacéis?"_ | INFORMACION | BAJA | 20 |

### Auto-respuesta (`src/lib/ai/responder.js`)

Tras la clasificación, se genera una respuesta personalizada:

| Score | Categoría | Respuesta |
|-------|-----------|-----------|
| > 70 | 🔴 HOT | _"Un agente le contactará en menos de 1 hora"_ + propiedades sugeridas |
| 40-70 | 🟡 WARM | _"Le responderemos en 24h"_ + enlace al catálogo |
| < 40 | 🔵 COLD | Respuesta genérica con enlace a propiedades |
| — | SPAM | No se envía respuesta |

### Fallback sin API key

Si `OPENAI_API_KEY` no está configurada, el sistema funciona igualmente:
- El clasificador asigna valores por defecto basándose en el campo `interes` del formulario
- El respondedor usa templates predefinidos por urgencia

---

## Seguridad

### Medidas implementadas

| Capa | Medida | Detalle |
|------|--------|---------|
| **Transporte** | HSTS | `Strict-Transport-Security: max-age=63072000` |
| **Frames** | X-Frame-Options | `DENY` — previene clickjacking |
| **MIME** | X-Content-Type-Options | `nosniff` |
| **Permisos** | Permissions-Policy | Cámara, micro, geolocalización deshabilitados |
| **Entrada** | Validación Zod | Todos los endpoints validan con schemas estrictos |
| **Fuerza bruta** | Rate Limiting | 5 forms/15min, 100 webhooks/min, 30 API/min |
| **Webhooks** | HMAC-SHA256 | Verificación de firma en WhatsApp webhook |
| **Datos en reposo** | AES-256-GCM | Emails y teléfonos encriptados en BD |
| **Autenticación** | Auth.js + JWT | Sesiones sin estado, roles (ADMIN/AGENTE) |
| **Autorización** | Middleware | `/admin/*` y API admin protegidos |
| **RGPD** | Derecho al olvido | `DELETE /api/leads/:id` elimina todo en cascada |
| **Auditoría** | AuditLog | Tabla para registrar acciones de agentes |
| **Secretos** | `.env.local` | Variables sin `NEXT_PUBLIC_` nunca llegan al cliente |

### Modelo de datos sensibles

```
┌─────────────────────────────────────────────┐
│  Lead en Base de Datos                       │
│                                              │
│  nombre: "Elena García"        ← texto plano │
│  email:  "a7f3:b2c1:e892..."   ← encriptado │
│  telefono: "d4e5:f6a7:1234..." ← encriptado │
│  score: 85                     ← texto plano │
│  resumenIA: "Busca casa..."    ← texto plano │
└─────────────────────────────────────────────┘
```

Solo `email` y `telefono` se encriptan (AES-256-GCM) porque son datos personales identificativos bajo el RGPD. El nombre se mantiene en texto plano para poder mostrarlo en el dashboard sin operaciones de descifrado constantes.

---

## Modelo de Datos

### Enums

```
Channel:          WEB | WHATSAPP | EMAIL
Intention:        COMPRA | ALQUILER | VENTA | INFORMACION | SPAM
Urgency:          ALTA | MEDIA | BAJA
LeadStatus:       NUEVO | CONTACTADO | EN_PROGRESO | CERRADO_GANADO | CERRADO_PERDIDO
MessageDirection: INBOUND | OUTBOUND
AgentRole:        ADMIN | AGENTE
PropertyType:     VENTA | ALQUILER
```

### Relaciones

```
Agent 1──────N Lead 1──────N Message
  │                           │
  └──N AuditLog               │
                               │
Property (independiente)       │
                               │
Lead.canal ∈ Channel          Message.canal ∈ Channel
```

---

## Contribución

1. Crear una rama desde `main`: `git checkout -b feature/mi-mejora`
2. Implementar los cambios siguiendo la estructura existente
3. Asegurar que `npm run lint` pase sin errores
4. Crear un Pull Request describiendo los cambios

### Convenciones

- **Componentes**: PascalCase (`PropertyCard.js`)
- **Utilidades**: camelCase (`ratelimit.js`)
- **API Routes**: `route.js` dentro de carpetas que reflejan la URL
- **Estilos**: Tailwind utility classes, sin CSS custom (excepto `globals.css`)
- **Colores**: Usar las CSS variables del tema (`--color-primary`, `--color-accent`, etc.)

---

## Licencia

Proyecto privado de Terranova Inmobiliaria. Todos los derechos reservados.
