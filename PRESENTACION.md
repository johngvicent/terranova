# Guión de Presentación en Vivo — Terranova: El Arquitecto Proptech

> **Duración estimada:** 15–20 minutos  
> **Audiencia:** Personas de 25–30 años con conocimientos básicos/nulos de programación  
> **Tono:** Cercano, visual, con analogías del mundo real. Nada de jerga técnica sin explicar.

---

## ANTES DE EMPEZAR — Checklist

- [ ] Tener el proyecto corriendo en local (`npm run dev`)
- [ ] Navegador abierto en `http://localhost:3000`
- [ ] Segunda pestaña en `http://localhost:3000/admin/login`
- [ ] Terminal visible (para mostrar cómo llegan los datos)
- [ ] Diapositivas de apoyo o pizarra para los diagramas (opcional)
- [ ] Conexión a internet estable (para la demo de IA)

---

## BLOQUE 1 — El Problema (3 min)

### Abre con la historia

> "Imaginen que tienen una inmobiliaria que se llama Terranova. Les va bien, tienen propiedades bonitas, y la gente les escribe. Mucho. 
>
> Les escriben por WhatsApp. Les escriben por email. Les escriben por la web. Reciben **cientos de mensajes al día**.
>
> El problema es que entre esos cientos de mensajes hay una persona que quiere comprar una casa de 400.000 euros **esta semana**... y hay otra que solo escribió 'Hola, qué tal' a las 3 de la mañana. Y el agente ve los dos mensajes igual.
>
> Resultado: **pierden el 60% de las ventas** porque no llegan a tiempo al cliente que sí quería comprar."

### Visualiza el caos

> "Es como si un doctor en urgencias recibiera a todos los pacientes por orden de llegada, sin importar si uno tiene un resfriado y otro un infarto. Sin triaje, se muere gente. En ventas, se pierden clientes."

**Pausa. Hacer contacto visual.**

> "Y eso es exactamente lo que construimos: **un sistema de triaje, pero para leads inmobiliarios.**"

---

## BLOQUE 2 — La Solución, sin tecnicismos (4 min)

### Presenta el flujo con una analogía

> "Nuestra solución funciona como el filtro de un hospital de urgencias. Tiene tres pasos:"

**Paso 1 — La recepción (Centralización)**

> "No importa si el mensaje llega por WhatsApp, por email o por la web. Todo cae en el mismo sitio. Es como si en vez de tener tres puertas de entrada al hospital, pusiéramos una sola recepción que lo organiza todo."

**Paso 2 — El triaje (Inteligencia Artificial)**

> "Cuando llega un mensaje, una inteligencia artificial lo lee y decide tres cosas:
>
> 1. **¿Qué quiere esta persona?** — Comprar, alquilar, vender, preguntar... o es spam.
> 2. **¿Qué tan urgente es?** — Alta, media o baja.
> 3. **¿Qué puntuación le damos?** — Del 0 al 100.
>
> Si alguien escribe 'Busco casa en Asturias, 4 habitaciones, presupuesto 400k, necesito para julio', eso es un **85 sobre 100**. Eso es urgente. Eso es dinero.
>
> Si alguien escribe 'Hola, qué ofrecen?'... eso es un 20. Importante, pero no urgente."

**Paso 3 — La respuesta y la acción (Dashboard)**

> "Según la puntuación, pasan tres cosas distintas:"

| Puntaje | Qué pasa |
|---------|----------|
| **Más de 70** 🔴 | Se le responde al instante, se le asigna un agente humano y salta una alerta |
| **Entre 40 y 70** 🟡 | Se le manda una respuesta automática personalizada y entra en cola |
| **Menos de 40** 🔵 | Respuesta genérica con enlace al catálogo |
| **Spam** 🗑️ | No se responde |

> "Y todo esto pasa en **segundos**, sin que ningún humano tenga que leer los cientos de mensajes."

---

## BLOQUE 3 — Demo en vivo (5 min)

### 3.1 Mostrar la web pública

> "Este es el sitio que ve el cliente."

- Navegar por la home, mostrar propiedades
- Entrar a una propiedad, mostrar los detalles
- Ir a la página de contacto

### 3.2 Enviar un lead desde el formulario

> "Vamos a simular que un cliente nos escribe."

- Rellenar el formulario de contacto con datos realistas:
  - Nombre: **María López**
  - Email: **maria@ejemplo.com**
  - Interés: **Compra**
  - Mensaje: **"Busco una casa rural en Costa Brava, 3 habitaciones mínimo, tengo un presupuesto de 350.000€ y quiero cerrar antes de verano"**
- Enviar

> "Fíjense que el formulario confirma que el mensaje se recibió. Pero lo interesante es lo que pasó **por detrás**."

### 3.3 Mostrar el dashboard admin

- Ir a `http://localhost:3000/admin`
- Señalar los KPIs: leads de hoy, de la semana, tasa de conversión

> "Esto es lo que ve el agente inmobiliario. Ya no tiene que revisar WhatsApp, email y la web por separado. Todo está aquí."

- Entrar al lead de María que acabamos de crear
- Mostrar:
  - La clasificación IA (intención: COMPRA, urgencia: ALTA, score: ~85)
  - El resumen automático generado por IA
  - El historial del mensaje
  - La opción de cambiar estado y asignar agente

> "La IA leyó el mensaje de María, entendió que quiere comprar, que tiene presupuesto, que tiene prisa... y le puso 85 puntos. El agente ya sabe que esta persona es prioridad **antes de leer una sola palabra**."

### 3.4 Enviar un lead genérico (contraste)

- Volver al formulario
- Enviar: **"Hola, quería saber qué ofrecen"**
- Volver al dashboard y mostrar el score bajo (~20, INFORMACION, BAJA)

> "Ven la diferencia? Este mensaje no tiene urgencia, no tiene presupuesto, no tiene zona. Score: 20. No es que lo ignoremos, pero el agente sabe que no es lo primero que tiene que atender."

---

## BLOQUE 4 — ¿Cómo funciona por dentro? (3–4 min)

### Usa el diagrama simplificado

> "No necesitan saber programar para entender esto. Piensen en tres capas:"

```
📱💻📧  
Los mensajes llegan    →    🧠 La IA los clasifica    →    📊 El dashboard los muestra
(WhatsApp, Web, Email)      (intención, urgencia,          (con filtros, métricas,
                             score 0-100)                   y asignación a agentes)
```

### Explica la IA brevemente

> "La inteligencia artificial que usamos se llama GPT-4o-mini. Es del mismo tipo que ChatGPT, pero más pequeña y rápida. Le decimos: 'Eres un experto inmobiliario. Lee este mensaje y dime qué quiere, qué tan urgente es, y ponle nota del 0 al 100'. Y responde en menos de un segundo."

### Explica la deduplicación

> "Si la misma persona escribe por WhatsApp y luego por email, el sistema se da cuenta de que es la misma persona. No crea dos fichas, actualiza la que ya existe. Eso es **deduplicación**: evitar duplicados."

### Explica la seguridad en términos simples

> "Los datos personales (email, teléfono) se guardan **encriptados**. Imaginen que en vez de guardar 'maria@ejemplo.com', guardamos 'a7f3b2c1e892'. Solo nuestro sistema puede leerlo. Si alguien robara la base de datos, vería letras y números sin sentido."
>
> "Además, el sistema limita cuántos mensajes puede enviar una misma persona. Si alguien intenta mandar 100 formularios seguidos, se bloquea. Eso previene ataques."

---

## BLOQUE 5 — Impacto y números (2 min)

### Traduce la técnica a negocio

> "¿Qué significa todo esto para Terranova en la práctica?"

| Antes | Después |
|-------|---------|
| Agente revisa 3 plataformas manualmente | Todo llega a un solo dashboard |
| Responde cuando puede (horas/días) | Respuesta automática en segundos |
| No sabe quién es urgente | IA clasifica por intención y urgencia |
| Pierde leads duplicados entre canales | Sistema deduplica automáticamente |
| Datos personales en texto plano | Encriptación AES-256 en la base de datos |

> "El objetivo es pasar de perder el 60% de las ventas... a capturar prácticamente el 100% de los leads calientes y responderles antes de que se vayan a la competencia."

---

## BLOQUE 6 — Cierre y preguntas (2 min)

### Resumen en una frase

> "Construimos un sistema donde los mensajes de tres canales distintos entran por una sola puerta, una inteligencia artificial los clasifica como un triaje de hospital, y los agentes ven en un dashboard quién necesita atención urgente y quién puede esperar."

### Abre a preguntas

> "¿Alguna pregunta? Puede ser sobre cómo funciona, sobre la IA, sobre los datos... lo que sea."

### Preguntas frecuentes que podrían surgir

**"¿Y si la IA se equivoca?"**
> "La IA no toma decisiones finales. Clasifica y sugiere. El agente humano siempre tiene la última palabra. Puede cambiar el estado, reasignar, o ignorar la sugerencia."

**"¿Cuánto cuesta la IA?"**
> "GPT-4o-mini cuesta aproximadamente $0.15 por millón de tokens de entrada. Para una inmobiliaria con 200 mensajes al día, eso son centavos. Literalmente menos que un café al mes."

**"¿Y si se cae WhatsApp o el email?"**
> "Cada canal es independiente. Si WhatsApp se cae, los emails y la web siguen funcionando. Y si vuelve, los mensajes pendientes entran solos."

**"¿Esto lo puede usar alguien que no sabe programar?"**
> "El dashboard está diseñado para eso. Es una interfaz visual donde haces clic, filtras, asignas. No hay que tocar código para nada."

**"¿Qué pasa con la privacidad de los datos?"**
> "Los emails y teléfonos se guardan encriptados en la base de datos. Cumplimos con el RGPD europeo, incluyendo el derecho al olvido: si un cliente pide que borren sus datos, un clic y desaparece todo."

---

## TIPS PARA LA PRESENTACIÓN

1. **No leas el guión.** Úsalo como guía de puntos clave.
2. **Haz la demo en vivo.** Nada convence más que verlo funcionar.
3. **Usa los contrastes.** El lead de 85 puntos vs. el de 20 puntos es tu momento wow.
4. **No te disculpes por la técnica.** Si algo es técnico, tradúcelo a analogía y sigue.
5. **Mantén contacto visual** cuando expliques el problema y el impacto. La pantalla es para la demo.
6. **Si algo falla en la demo:** Ten screenshots preparados como backup. Nunca digas "esto normalmente funciona".
7. **Controla el tiempo.** El bloque más importante es la demo (Bloque 3). Si te quedas corto de tiempo, acorta el Bloque 4.
