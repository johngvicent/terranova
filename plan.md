# Plan: Terranova — El Arquitecto Proptech

## TL;DR
Terranova pierde el 60% de ventas por no poder gestionar el volumen de mensajes (WhatsApp, email, formularios). La solución es un sistema de **ingesta centralizada + IA de clasificación + CRM integrado** que reciba todos los mensajes, los clasifique por intención/urgencia con un LLM, y los presente en un dashboard para los agentes inmobiliarios. Se construye sobre el proyecto Next.js 16 existente, añadiendo API Routes como backend, PostgreSQL como base de datos, y OpenAI para la IA.

---

## Diagrama de la Solución

```
┌─────────────────────────────────────────────────────────┐
│                   CANALES DE ENTRADA                     │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ WhatsApp  │  │    Email     │  │  Formulario Web   │  │
│  │ Business  │  │  (SendGrid)  │  │  (ContactForm.js) │  │
│  │   API     │  │  Inbound     │  │                   │  │
│  └─────┬─────┘  └──────┬───────┘  └────────┬──────────┘  │
│        │               │                    │             │
│        ▼               ▼                    ▼             │
│  ┌─────────────────────────────────────────────────┐     │
│  │          API Routes (Next.js Route Handlers)     │     │
│  │  /api/webhooks/whatsapp                          │     │
│  │  /api/webhooks/email                             │     │
│  │  /api/leads (formulario web)                     │     │
│  └──────────────────────┬──────────────────────────┘     │
└─────────────────────────┼───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              CAPA DE PROCESAMIENTO IA                     │
│  ┌─────────────────────────────────────────────────┐     │
│  │         Clasificador de Leads (OpenAI)           │     │
│  │  • Intención: compra / alquiler / info / otro    │     │
│  │  • Urgencia: alta / media / baja                 │     │
│  │  • Presupuesto estimado                          │     │
│  │  • Zona de interés                               │     │
│  │  • Score de cualificación (0-100)                │     │
│  └──────────────────────┬──────────────────────────┘     │
│                          │                                │
│  ┌─────────────────────────────────────────────────┐     │
│  │       Auto-respuesta Inteligente (OpenAI)        │     │
│  │  • Respuesta inmediata personalizada              │     │
│  │  • Sugerencia de propiedades                      │     │
│  │  • Escalado a humano si urgencia alta            │     │
│  └──────────────────────┬──────────────────────────┘     │
└─────────────────────────┼───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  CAPA DE DATOS                            │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  PostgreSQL   │  │    Prisma    │  │   Auth.js     │  │
│  │  (Supabase)   │  │    ORM       │  │  (NextAuth)   │  │
│  │               │  │              │  │               │  │
│  │  • Leads      │  │  • Tipado    │  │  • Login      │  │
│  │  • Mensajes   │  │  • Migraci.  │  │  • Roles      │  │
│  │  • Propied.   │  │  • Relacion. │  │  • Sesiones   │  │
│  │  • Agentes    │  │              │  │               │  │
│  └──────────────┘  └──────────────┘  └───────────────┘  │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                CAPA DE PRESENTACIÓN                       │
│  ┌─────────────────────────────────────────────────┐     │
│  │           Dashboard Admin (/admin)               │     │
│  │  • Bandeja de leads con filtros y prioridad      │     │
│  │  • Vista detalle de lead + historial mensajes    │     │
│  │  • Asignación a agentes                          │     │
│  │  • Métricas y KPIs                               │     │
│  └─────────────────────────────────────────────────┘     │
│  ┌─────────────────────────────────────────────────┐     │
│  │        Notificaciones en Tiempo Real              │     │
│  │  • Leads urgentes → push notification             │     │
│  │  • Email resumen diario a cada agente             │     │
│  └─────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────┘
```

---

## Stack Tecnológico

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| Frontend | Next.js 16 + React 19 + Tailwind v4 | Ya existente, App Router, SSR/SSG |
| Backend (API) | Next.js Route Handlers | Mismo proyecto, sin servidor separado, serverless-ready |
| Base de Datos | PostgreSQL (Supabase) | Relacional, robusto, Row Level Security nativo |
| ORM | Prisma | Tipado, migraciones, relaciones claras |
| IA | OpenAI GPT-4o-mini | Clasificación de leads, respuestas automáticas, bajo coste |
| Auth | Auth.js v5 (NextAuth) | Integración nativa Next.js, OAuth, roles |
| WhatsApp | Meta WhatsApp Business API (via webhook) | API oficial, fiable, mensajes bidireccionales |
| Email Inbound | SendGrid Inbound Parse | Recibe emails como webhooks |
| Email Outbound | SendGrid / Resend | Respuestas automáticas y notificaciones |
| Validación | Zod | Validación de schemas en API routes |
| Tiempo Real | Server-Sent Events (SSE) o polling | Notificaciones de nuevos leads sin WebSocket |

---

## Justificación de la Arquitectura

### ¿Por qué NO un backend separado?
- Next.js Route Handlers actúan como API serverless — escalan automáticamente
- Un solo proyecto = un solo deploy, un solo repositorio
- Para el volumen de Terranova (~100-300 mensajes/día), no necesitamos microservicios

### ¿Por qué PostgreSQL y no MongoDB?
- Los datos inmobiliarios son inherentemente relacionales (leads ↔ mensajes ↔ propiedades ↔ agentes)
- Supabase ofrece Row Level Security (RLS) — seguridad a nivel de fila sin código extra
- Consultas complejas (filtros por urgencia, fecha, agente, tipo) son más eficientes en SQL

### ¿Por qué OpenAI GPT-4o-mini y no un modelo propio?
- GPT-4o-mini cuesta ~$0.15 por millón de tokens de entrada — para 300 mensajes/día el coste es ~$5-10/mes
- No necesitamos entrenar un modelo, solo un prompt bien diseñado (few-shot)
- Clasificación + respuesta automática en una sola llamada API

### ¿Por qué Supabase y no una DB autogestionada?
- Hosting gratuito hasta 500MB, auth integrado, RLS nativo
- Dashboard visual para el equipo no-técnico
- Backups automáticos

---

## Fases de Implementación

### FASE 1: Base de Datos y API del Formulario (Fundamento)
*Prioridad: Alta — Bloquea todo lo demás*

1. Instalar dependencias: `prisma`, `@prisma/client`, `zod`
2. Configurar Prisma con PostgreSQL (Supabase) — crear `prisma/schema.prisma`
3. Definir schema de datos:
   - **Lead**: id, nombre, email, teléfono, interés, urgencia, score, estado (nuevo/contactado/en-progreso/cerrado), canal (web/whatsapp/email), agenteAsignado, createdAt
   - **Message**: id, leadId, contenido, dirección (inbound/outbound), canal, metadata (JSON), createdAt
   - **Property**: migrar datos de `lib/data.js` a la DB
   - **Agent**: id, nombre, email, rol (admin/agente), activo
4. Crear API Route `POST /api/leads` — recibe datos del formulario ContactForm.js, valida con Zod, guarda en DB
5. Modificar `ContactForm.js` para enviar fetch POST a `/api/leads` en lugar de solo mostrar éxito
6. Crear API Route `GET /api/leads` — para el futuro dashboard

**Archivos a crear/modificar:**
- `prisma/schema.prisma` — Schema de la base de datos
- `src/lib/prisma.js` — Singleton del cliente Prisma
- `src/lib/validations.js` — Schemas Zod para validación
- `src/app/api/leads/route.js` — API de leads
- `src/components/ContactForm.js` — Conectar al API real

### FASE 2: Integración IA — Clasificador de Leads
*Prioridad: Alta — Core del producto*
*Depende de: Fase 1*

1. Instalar `openai` SDK
2. Crear módulo `src/lib/ai/classifier.js` — prompt de clasificación de leads:
   - Input: mensaje del usuario + datos del formulario
   - Output JSON: { intención, urgencia, presupuestoEstimado, zonaInterés, score, resumenCorto }
   - Prompt con few-shot examples del contexto inmobiliario español
3. Crear módulo `src/lib/ai/responder.js` — generador de respuestas automáticas:
   - Personaliza según intención y urgencia
   - Sugiere propiedades del catálogo que encajen
4. Integrar clasificador en `POST /api/leads` — después de guardar, clasificar con IA y actualizar el lead
5. Integrar responder — enviar email de confirmación personalizado al lead

**Archivos a crear:**
- `src/lib/ai/classifier.js` — Clasificador IA
- `src/lib/ai/responder.js` — Auto-respuesta
- `src/lib/ai/prompts.js` — Templates de prompts
- `src/lib/email.js` — Servicio de envío de email (SendGrid/Resend)

### FASE 3: Webhooks — WhatsApp y Email
*Prioridad: Alta — Resuelve el problema principal*
*Depende de: Fase 2*

1. Crear `POST /api/webhooks/whatsapp` — recibe mensajes de Meta Business API
   - Verificación del webhook (GET con challenge token)
   - Parseo del payload de WhatsApp
   - Crear o vincular a lead existente (por número de teléfono)
   - Clasificar con IA → guardar mensaje y actualización del lead
2. Crear `POST /api/webhooks/email` — recibe emails de SendGrid Inbound Parse
   - Parseo del email (from, subject, body)
   - Crear o vincular a lead existente (por email)
   - Clasificar con IA → guardar
3. Lógica de deduplicación: si un lead escribe por WhatsApp y luego por email, vincular al mismo lead

**Archivos a crear:**
- `src/app/api/webhooks/whatsapp/route.js` — Webhook WhatsApp
- `src/app/api/webhooks/email/route.js` — Webhook Email
- `src/lib/channels/whatsapp.js` — Lógica de parseo WhatsApp
- `src/lib/channels/email.js` — Lógica de parseo Email
- `src/lib/leads/deduplication.js` — Deduplicación de leads

### FASE 4: Dashboard Admin
*Prioridad: Media — Interfaz para agentes*
*Depende de: Fase 1-3*
*Paralelo: puede empezarse el layout en paralelo con Fase 2-3*

1. Instalar `next-auth` (Auth.js v5) + configurar con Supabase como provider
2. Crear layout protegido `src/app/admin/layout.js` con middleware de autenticación
3. Crear páginas admin:
   - `/admin` — Dashboard: KPIs (leads hoy, tasa conversión, tiempo respuesta medio), lista de leads recientes
   - `/admin/leads` — Bandeja de leads con filtros (urgencia, estado, canal, agente)
   - `/admin/leads/[id]` — Detalle del lead: historial de mensajes, clasificación IA, asignación, notas
   - `/admin/propiedades` — CRUD de propiedades (migrar de data.js a DB)
4. APIs adicionales:
   - `PATCH /api/leads/[id]` — Actualizar estado, asignar agente
   - `GET /api/leads/stats` — Métricas para dashboard

**Archivos a crear:**
- `src/app/admin/layout.js` — Layout protegido
- `src/app/admin/page.js` — Dashboard principal
- `src/app/admin/leads/page.js` — Lista de leads
- `src/app/admin/leads/[id]/page.js` — Detalle lead
- `src/middleware.js` — Protección de rutas /admin
- `src/lib/auth.js` — Configuración Auth.js

### FASE 5: Seguridad y Hardening
*Prioridad: Alta — Debe implementarse transversalmente*
*En paralelo con todas las fases*

1. **Variables de entorno**: Todas las API keys en `.env.local`, nunca en código
   - `DATABASE_URL`, `OPENAI_API_KEY`, `WHATSAPP_TOKEN`, `WHATSAPP_VERIFY_TOKEN`, `SENDGRID_API_KEY`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
2. **Validación de entrada**: Zod en TODOS los API routes (ya cubierto en Fase 1)
3. **Verificación de webhooks**:
   - WhatsApp: Validar firma HMAC-SHA256 del header `X-Hub-Signature-256`
   - Email: Verificar IP de origen de SendGrid
4. **Rate limiting**: Middleware con mapa en memoria o con `upstash/ratelimit` para proteger APIs públicas
5. **CORS**: Configurar en Next.js para permitir solo orígenes conocidos
6. **Encriptación de datos sensibles**:
   - Teléfonos y emails encriptados en DB (campo `encrypted_`)
   - Usar `crypto.createCipheriv` con AES-256-GCM
7. **RGPD (GDPR)**:
   - Consentimiento explícito en formulario (ya existe checkbox de privacidad)
   - API `DELETE /api/leads/[id]` para derecho al olvido
   - Retención de datos: auto-eliminar leads cerrados tras 2 años
8. **Row Level Security (RLS)** en Supabase: un agente solo ve sus leads asignados
9. **Headers de seguridad**: CSP, X-Frame-Options, X-Content-Type-Options via `next.config.mjs` headers
10. **Audit log**: Tabla que registre quién accedió/modificó qué dato y cuándo

**Archivos a crear:**
- `.env.local` — Variables de entorno (no commitear)
- `.env.example` — Template de variables
- `src/lib/crypto.js` — Utilidades de encriptación
- `src/lib/ratelimit.js` — Rate limiting
- `src/middleware.js` — (ampliar) Headers de seguridad + rate limit

---

## Flujo de Decisión de la IA

```
Mensaje recibido (cualquier canal)
        │
        ▼
┌─ Extraer datos ──────────────────────┐
│  • Nombre / teléfono / email          │
│  • Contenido del mensaje              │
│  • Canal de origen                    │
│  • Historial previo (si existe lead)  │
└───────────────────┬──────────────────┘
                    │
                    ▼
┌─ Clasificación (GPT-4o-mini) ────────┐
│  Prompt: "Eres un agente inmobiliario │
│  experto. Clasifica este mensaje..."  │
│                                       │
│  → Intención:                         │
│    • COMPRA (quiere comprar)          │
│    • ALQUILER (quiere alquilar)       │
│    • VENTA (quiere vender su propiedad│
│    • INFORMACIÓN (consulta general)   │
│    • SPAM / IRRELEVANTE               │
│                                       │
│  → Urgencia:                          │
│    • ALTA: menciona plazos, "urgente" │
│           tiene presupuesto definido  │
│    • MEDIA: interés claro pero sin    │
│            urgencia temporal          │
│    • BAJA: consulta exploratoria      │
│                                       │
│  → Score: 0-100                       │
│    (ponderado: intención 40%,         │
│     urgencia 30%, datos 20%,          │
│     historial 10%)                    │
└───────────────────┬──────────────────┘
                    │
                    ▼
          ┌─ Score > 70? ─┐
          │                │
        Sí │              │ No
          │                │
          ▼                ▼
   ┌──────────┐    ┌──────────────┐
   │ LEAD HOT │    │  Score > 40? │
   │ Asignar  │    │              │
   │ agente   │    │  Sí     No   │
   │ +alerta  │    │  │       │   │
   │ inmediata│    │  ▼       ▼   │
   └──────────┘    │ WARM   COLD  │
                   │ Auto-  Auto-  │
                   │ resp.  resp.  │
                   │ +cola  genér. │
                   └──────────────┘
                    │
                    ▼
┌─ Auto-respuesta (GPT-4o-mini) ───────┐
│  • HOT: "Gracias [nombre], un agente  │
│    le contactará en menos de 1 hora.  │
│    Mientras, estas propiedades pueden │
│    interesarle: [sugerencias]"        │
│                                       │
│  • WARM: "Gracias por contactarnos.   │
│    Hemos recibido su consulta sobre   │
│    [intención]. Le responderemos en   │
│    24h. Explore nuestro catálogo..."  │
│                                       │
│  • COLD: "Gracias por su mensaje.     │
│    Visite terranova.es/propiedades    │
│    para ver nuestro catálogo."        │
│                                       │
│  • SPAM: No responder, marcar.        │
└───────────────────────────────────────┘
```

---

## Modelo de Datos (Prisma Schema)

**Lead** (contacto / cliente potencial):
- id, nombre, apellidos, email, teléfono
- canal (WEB | WHATSAPP | EMAIL)
- intención (COMPRA | ALQUILER | VENTA | INFORMACIÓN | SPAM)
- urgencia (ALTA | MEDIA | BAJA)
- score (0-100)
- estado (NUEVO | CONTACTADO | EN_PROGRESO | CERRADO_GANADO | CERRADO_PERDIDO)
- agenteId (FK → Agent)
- resumenIA (texto generado por la IA)
- createdAt, updatedAt

**Message** (cada interacción):
- id, leadId (FK → Lead)
- contenido, canal, dirección (INBOUND | OUTBOUND)
- metadata (JSON — IDs de WhatsApp, headers de email, etc.)
- createdAt

**Property** (migrada de data.js):
- id, title, location, region, description
- price, type, bedrooms, bathrooms, area
- image, featured, tags
- createdAt, updatedAt

**Agent** (usuario del sistema):
- id, nombre, email, passwordHash
- rol (ADMIN | AGENTE)
- activo, createdAt

**AuditLog**:
- id, agentId, acción, entidad, entidadId, metadata, createdAt

---

## Seguridad — Explicación para Frontend Dev

### 1. Variables de entorno (.env.local)
**Qué es**: Un archivo que guarda secretos (contraseñas de APIs, claves de encriptación) fuera del código.
**Por qué**: Si alguien ve tu código en GitHub, no puede acceder a tus servicios.
**Cómo funciona**: Next.js lee `.env.local` automáticamente. Las variables sin prefijo `NEXT_PUBLIC_` solo están disponibles en el servidor (API routes), nunca llegan al navegador.

### 2. Validación con Zod
**Qué es**: Una librería que verifica que los datos que llegan a tu API tienen la forma correcta.
**Por qué**: Un atacante puede enviar cualquier cosa a tu API. Sin validación, podría inyectar código malicioso (SQL injection, XSS).
**Analogía frontend**: Es como los `propTypes` de React pero para los datos que llegan del exterior, y lanza errores si no cumplen.

### 3. HMAC para webhooks
**Qué es**: Una firma digital que WhatsApp/SendGrid añaden a cada mensaje que envían a tu servidor.
**Por qué**: Sin esto, cualquiera podría enviar datos falsos a tu endpoint `/api/webhooks/whatsapp`.
**Cómo funciona**: WhatsApp firma el body del mensaje con un secreto compartido. Tu servidor recalcula la firma y compara. Si no coincide → rechazo.

### 4. Rate Limiting
**Qué es**: Limitar cuántas peticiones puede hacer una misma IP en un período de tiempo.
**Por qué**: Sin esto, un atacante podría enviar 10,000 formularios por segundo (ataque DoS) o gastar tu crédito de OpenAI.
**Ejemplo**: Máximo 10 envíos de formulario por IP cada 15 minutos.

### 5. Encriptación AES-256-GCM
**Qué es**: Un algoritmo que convierte datos legibles ("612345678") en texto ilegible ("a7f3b2c1...").
**Por qué**: Si alguien accede a la base de datos, los teléfonos y emails de clientes están protegidos.
**Analogía**: Como un candado del que solo tu servidor tiene la llave (almacenada en `.env.local`).

### 6. Row Level Security (RLS)
**Qué es**: Reglas en la base de datos que controlan qué filas puede ver cada usuario.
**Por qué**: El agente María solo debe ver SUS leads, no los de Pedro.
**Cómo funciona**: Supabase aplica automáticamente filtros según el usuario autenticado.

### 7. RGPD / GDPR
**Qué es**: Ley europea de protección de datos personales.
**Obligaciones**: 
- Consentimiento explícito antes de guardar datos (el checkbox que ya existe)
- Derecho al olvido: poder borrar todos los datos de un cliente si lo pide
- Minimización: solo guardar datos necesarios

---

## Verificación

1. **Formulario web → DB**: Enviar formulario de contacto, verificar que aparece en la DB con clasificación IA correcta
2. **Webhook WhatsApp**: Usar el simulador de Meta para enviar mensaje de prueba, verificar creación de lead
3. **Webhook Email**: Enviar email a la dirección de inbound parse, verificar creación de lead
4. **Deduplicación**: Enviar desde el mismo teléfono por WhatsApp y formulario web, verificar que se vinculan al mismo lead
5. **Clasificación IA**: Probar con 10 mensajes variados (compra urgente, alquiler casual, spam), verificar scores coherentes
6. **Auto-respuesta**: Verificar que el lead recibe email personalizado según su clasificación
7. **Dashboard**: Login como admin, ver lista de leads filtrada, cambiar estado, asignar agente
8. **Seguridad**: Intentar enviar payload malicioso al webhook sin firma HMAC → debe dar 401. Intentar acceder a /admin sin login → redirección. Enviar más de 10 formularios en 1 minuto → rate limit 429
9. **RGPD**: Ejecutar DELETE /api/leads/[id], verificar que se eliminan lead + mensajes + audit log registra la acción

---

## Decisiones

- **Monorepo**: Todo en el mismo proyecto Next.js (frontend + API). Suficiente para el volumen de Terranova. Si escala a >1000 mensajes/día, considerar extraer a microservicio
- **Supabase free tier**: Suficiente para empezar (500MB DB, 50K auth users). Plan Pro ($25/mes) si se necesita más
- **OpenAI GPT-4o-mini**: No GPT-4o completo — el mini es suficiente para clasificación y cuesta 10x menos
- **No WebSockets**: SSE o polling para el dashboard. Más simple, suficiente para este caso
- **Propiedades en DB**: Migrar de `lib/data.js` a PostgreSQL para permitir CRUD desde el admin
- **Scope incluido**: Formulario web, WhatsApp, Email inbound, clasificación IA, auto-respuesta, dashboard admin, CRUD propiedades
- **Scope excluido**: Chatbot conversacional (solo clasificación + respuesta única), portal de cliente, integración con portales inmobiliarios (Idealista, Fotocasa), app móvil nativa
