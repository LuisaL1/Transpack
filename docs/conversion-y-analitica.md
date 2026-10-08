# Conversión y analítica (Google Analytics 4)

## Cómo está instalado

| Pieza | Dónde | Qué hace |
| --- | --- | --- |
| Configuración | Variable `VITE_GA_MEASUREMENT_ID` | ID de medición de GA4. Si falta o no es válido (formato `G-…`), GA no se carga y no aparece el aviso de cookies. El ejemplo `G-XXXXXXXXXX` se ignora. |
| Motor | `src/lib/analytics.ts` | Carga `gtag.js` una sola vez, Consent Mode v2, páginas vistas y eventos. |
| Rastreador | `AnalyticsTracker` en `src/components/layout/Analytics.tsx` | Página vista en cada cambio de ruta y clics en teléfono, correo y WhatsApp en todo el sitio. |
| Aviso de cookies | `CookieBanner` (mismo archivo), textos en `src/data/consent.ts` | En los seis idiomas. Botones "Aceptar" y "Rechazar" equivalentes. Mientras está visible, en celular se oculta el botón de Joel. |
| Seguridad | CSP de `vercel.json` | Solo autoriza `*.googletagmanager.com` (script e imagen) y `*.google-analytics.com`, `*.analytics.google.com` (envío de datos). |

- **Desarrollo:** `pnpm dev` nunca envía datos. El ID local va en
  `.env.production.local`, que no se versiona y solo usa `pnpm build`.
- **Producción:** variable en Vercel (ver `README.md`).

## Consentimiento (Consent Mode v2, Ley 1581 de 2012)

- **Por defecto:**
  - `analytics_storage` = `denied`, salvo que el visitante ya haya aceptado
    antes;
  - `ad_storage`, `ad_user_data` y `ad_personalization` siempre `denied`
    (no se usa con fines publicitarios);
  - `wait_for_update: 500`.
- **Antes de aceptar**, GA solo recibe señales sin cookies (sin `_ga`).
- **La decisión** se guarda en el navegador (`localStorage`,
  `tp-analytics-consent`) y se comunica con `gtag("consent", "update")`.
- **Cambiar la decisión:** el botón "Cambiar mi decisión sobre cookies" de la
  política de datos (`/privacidad`) llama a `resetConsent()`: borra la decisión,
  vuelve a denegar `analytics_storage` y emite el evento `tp:consent-reset`, que
  escucha el aviso de cookies para volver a mostrarse.

## Protección de datos personales (Ley 1581 de 2012)

- **Política:** `/privacidad` (texto en `PRIVACY`, `src/data/site.ts` y sus
  traducciones). Se enlaza desde el pie, el aviso de cookies, la autorización
  del formulario y del cotizador, el chat y Joel.
- **Autorización:** el formulario de contacto y el cotizador exigen marcar la
  casilla (sin marcar por defecto); la solicitud lleva "Autorización de datos:
  Sí" y la función `/api/contact` la vuelve a verificar. El chat informa el uso
  de los datos antes de pedir el nombre.
- **Qué recibe Google Analytics:** solo eventos e intenciones, nunca el texto
  que escribe el visitante ni sus datos de contacto (nombre, correo, teléfono o
  mensaje no se envían en ningún evento).
- **Envío de solicitudes:** por la función propia del sitio con Brevo como
  encargado del tratamiento; el sitio no guarda copia (ver `docs/formularios.md`).

## Eventos

| Evento | Cuándo | Parámetros |
| --- | --- | --- |
| `page_view` | Cada cambio de ruta (es una SPA: `send_page_view: false` y envío manual) | `page_path`, `page_location`, `page_title` (ya con el título de la página nueva: `SeoHead` se monta antes) |
| `generate_lead` | **Solicitud enviada**: en el cotizador, al pulsar "Enviar por WhatsApp" o cuando el envío por correo **se confirma**; en el formulario de contacto, cuando el envío se confirma; en el chat de Joel, al pulsar "Enviar por WhatsApp" en el resumen | `method` (`whatsapp`, `email` = cotizador por correo, `form` = formulario de contacto, `chat_whatsapp`), `service` (local, nacional, internacional, empresarial, bodegaje), `level` (cotizador), `reason` (motivo del formulario: cotizacion, informacion, soporte, pqrs, datos, empleo, otro), `lang` |
| `contact_click` | Clic en un enlace `tel:` o `https://wa.me/`, apertura del formulario de contacto (cualquier enlace a `#contacto`) o "Chatear con un asesor" en el chat de Joel (abre Zoho SalesIQ) | `method` (`phone`, `whatsapp`, `form`, `advisor_chat`) |
| `chat_open` | Al abrir el chat de Joel (botón, invitación, menú o buscador) | `lang` |
| `chat_message` | Cada mensaje escrito al chat. **Nunca se envía el texto del visitante**, solo lo que Joel entendió | `intent` (p. ej. `precio`, `fact-seguro`, `pain-exterior`, `obj-caro`; en otros idiomas `step-<paso>`), `service`, `lang` |
| `search` | Al elegir un resultado del buscador | `search_term`, `result` (ruta elegida), `lang` |
| `quote_step` | Cada paso del cotizador (para medir en qué paso se abandona) | `step` (2 a 6 o `resumen`), `service` |

## Recomendaciones en GA4

1. **Eventos clave:** marque `generate_lead` y `contact_click` como eventos
   clave (Administrar → Eventos → "Marcar como evento clave").
2. **Embudo** (Explorar → Exploración de embudo):
   `page_view` → `chat_open` o `search` → `quote_step` → `generate_lead`.
3. **Abandono del cotizador:** informe de `quote_step` por `step`.
4. **Dimensiones personalizadas** (Administrar → Definiciones personalizadas):
   `method`, `service`, `intent`, `step` y `lang`, con alcance de evento, para
   poder filtrar por ellas.
5. **Qué pregunta la gente a Joel:** informe de `chat_message` por `intent`.
   Las intenciones `fallback` son preguntas que Joel no supo responder.
6. Con `method` `email` o `form`, `generate_lead` se registra solo cuando la
   solicitud llegó a Brevo. Con WhatsApp significa que el visitante pulsó
   enviar: WhatsApp se abre con la solicitud lista, pero el envío final lo hace
   el visitante. Contraste con las solicitudes que realmente llegan a WhatsApp.

## Pruebas

- `pnpm test:e2e` compila **sin** GA, para no enviar visitas de prueba.
- `pnpm test:ga` compila con el ID real y verifica en el navegador:
  - aviso visible y consentimiento denegado por defecto;
  - sin cookie `_ga` antes de aceptar;
  - al aceptar, cookie `_ga` y envío a `google-analytics.com/g/collect` con
    `tid=<ID>`;
  - al rechazar, sin cookies, y la decisión se recuerda.

  Necesita internet y envía unas pocas visitas reales a la propiedad.
