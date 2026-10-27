# Chat con un asesor: Zoho SalesIQ (CRM)

El chat del sitio **es el widget de Zoho SalesIQ**, con el diseño del sitio. Lo
atiende el bot de Zoho ("Joelito") y, cuando hace falta, un asesor desde su
panel de SalesIQ. **Nunca se menciona Zoho** en el sitio.

| Pieza | Archivo |
| --- | --- |
| Carga, precarga, apertura, diseño y avisos de la ventana de Zoho | `src/lib/crmChat.ts` |
| Lógica del chat (abrir/cerrar, respaldo, precarga, conversión, invitación) | `src/hooks/useAdvisorChat.ts` |
| Botón flotante, invitación y ventana de respaldo | `src/components/chat/` (`AdvisorChat`, `ChatLauncher`, `ChatTeaser`, `ChatBubble`, `ChatOptions`, `ChatAvatar`) |
| Textos del botón, la invitación y el respaldo | `src/data/chat.ts` |
| Eventos (`CRM_CHAT_EVENT`, `CHAT_LEAD_EVENT`) | `src/lib/advisorEvents.ts` |
| Diseño dentro de la ventana / copia para subir a Zoho | `src/styles/zoho-chat.css` / `public/zoho-salesiq.css` |
| La ventana de Zoho llena el iframe | `src/styles/zoho-host.css` |
| Tamaño y lugar de la ventana (iframe `#tp-zoho-frame`) | `src/styles/index.css` |
| Página aislada donde vive Zoho | `public/chat-asesor.html` (CSP propia en `vercel.json`) |

## Cómo funciona

1. **Precarga.** Si el visitante **aceptó las cookies** en el aviso (también si
   las acepta después, `tp:consent` de `src/lib/analytics.ts`) o si el sitio no
   muestra el aviso (Google Analytics sin configurar, p. ej. en desarrollo),
   Zoho se carga cuando el navegador está libre (`preloadCrmChat`). Su ventana
   queda armada, **escondida** y ya dentro de una conversación. No envía
   mensajes ni avisa al bot. Si el visitante rechaza las cookies o no responde
   el aviso, no hay precarga.
2. **Abrir.** Al tocar el botón flotante (o cualquier elemento que dispare
   `tp:open-chat`, como "Habla con Joelito" del menú o el buscador), `openCrmChat`
   muestra la ventana: con precarga tarda ~0,2 s; sin ella, ~3,5 s (el botón
   muestra que está cargando).
   - Abre en la pestaña de conversación (`defaultview: "chat"`) y, si no hay una
     en curso, entra sola a una conversación nueva (`enterConversation`). La
     ventana **no se muestra hasta estar dentro de la conversación**: no se ve el
     inicio ni la lista de Zoho.
   - Si la conversación está **vacía**, el sitio avisa a Zoho la acción
     personalizada `abrir_chat_asesor` (`triggerAdvisorStart`) para que el bot
     salude solo. Al reabrir una conversación con mensajes, no vuelve a avisar.
   - A la vista, el iframe deja de estar oculto para lectores de pantalla y
     teclado (`aria-hidden`, `tabIndex`) y el foco va al campo de escribir; al
     cerrar, el foco vuelve al botón.
3. **Cerrar.** Con la X del botón flotante (que queda debajo de la ventana) o la
   de la cabecera de Zoho.
4. **Respaldo.** Si Zoho no carga (bloqueador de anuncios, red), se abre la
   ventana del sitio con el aviso y los enlaces a WhatsApp y al formulario.
5. **Conversión.** Cuando el visitante inicia una conversación
   (`$zoho.salesiq.visitor.chat`), se registra `generate_lead` con
   `method: "advisor_chat"` (una vez por página, sin nada de lo que escribe).

## Configuración necesaria en Zoho (panel de SalesIQ)

- **Bot proactivo:** SalesIQ → Configuración → Bots (Zobot) → en "¿Cuándo
  activar el bot con el visitante?" elegir **"Realiza una acción
  personalizada"** con el valor **`abrir_chat_asesor`** (igual que
  `ADVISOR_START_ACTION` en `src/lib/crmChat.ts`).
  - **No** usar disparadores como "todos los visitantes" o "al entrar a una
    página": con la precarga, arrancarían el bot para cada visitante, aunque no
    abra el chat.
  - Frecuencia del disparador: **cada vez** que se abre el chat (si es "una vez
    por visitante", quien vuelve no recibe el saludo).
- **Chats que inicia el visitante:** que también los atienda el bot (si no, el
  primer mensaje va directo a los asesores, "En espera de conectarse…").
- **Título de la ventana:** "Joelito" (en la conversación nueva Zoho muestra su
  título; hoy "Chatee con nosotros ahora").
- **Dominio autorizado:** `www.transpacksas.com` (y el de Vercel si se prueba
  ahí). **Idioma:** español.
- **CSS personalizado:** subir `public/zoho-salesiq.css` (abajo, "Diseño").

## Diseño

La ventana de Zoho tiene el diseño del chat del sitio:

- cabecera azul con el cuadrado naranja translúcido girado 45°, foto de Joel de
  42 px sobre beige con el punto verde, rótulo naranja "ASESOR VIRTUAL", nombre
  y "Transpack · Responde al instante"; sin la flecha al inicio de Zoho ni su
  menú "⋮" (la ventana solo muestra la conversación);
- fondo gris; burbujas del asistente blancas y del visitante azules; opciones
  en una tarjeta con filas (ícono, texto y flecha); sin la hora en las burbujas;
- barra de escribir blanca con el campo gris de una línea ("Escribe tu mensaje
  al asesor…") y el botón cuadrado de enviar (gris vacío, azul con naranja al
  escribir); botón de responder y mensaje citado con colores de la marca;
- tipografías del sitio (IBM Plex Sans y Montserrat) y solo colores de la marca.

- **Por qué funciona:** la ventana de Zoho es un iframe del mismo origen que la
  página aislada, así que el sitio le agrega su hoja de estilos
  (`styleChatWindow`). Los colores se cambian con las variables del tema de Zoho
  (`--siqcw-…`). La foto de Joel va embebida en el CSS (no depende del dominio).
- **Cuidado:** los estilos dependen de las clases internas de Zoho
  (`.siqcw-header`, `.tag-div`, `.siqcw-textarea-cont`, `.embed-prof-cont`…). Si
  Zoho cambia su ventana, algunos podrían dejar de aplicarse: revise el chat
  después de cada actualización grande de Zoho.
- **En el panel de Zoho:** `public/zoho-salesiq.css` es la copia de
  `zoho-chat.css` para subir en SalesIQ → Configuración → Marcas →
  Personalización → Apariencia → "Upload custom CSS" (aplica a lo de adentro de
  la ventana, también fuera del sitio). Se genera desde el original (mismo
  cuerpo, otro comentario de cabecera); `tests/unit/crmChat.test.ts` avisa si
  difieren. El tamaño y lugar de la ventana y el botón flotante son del sitio:
  Zoho no los toma de este CSS.

## Página aislada y CSP (vercel.json)

Zoho **no se carga en las páginas del sitio**: vive en `public/chat-asesor.html`,
que el sitio abre en el iframe `#tp-zoho-frame`.

**Por qué:** el widget de Zoho ejecuta un script en línea distinto para cada
visitante, así que no se puede autorizar con una huella fija. Con la página
aislada, la CSP estricta del sitio no se relaja:

| Cabeceras                            | Para              | Scripts permitidos                                                                                                                                                                                  |
| ------------------------------------ | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/((?!chat-asesor).*)`               | Todo el sitio     | Solo los del propio sitio y Google Tag Manager. Nada de Zoho. `frame-src 'self'` para mostrar la página aislada.                                                                                    |
| `/chat-asesor` y `/chat-asesor.html` | La página aislada | `'unsafe-inline'` más `salesiq.zohopublic.com`, `salesiq.zoho.com` y `static.zohocdn.com`. Solo el sitio la puede mostrar (`frame-ancestors 'self'`, `X-Frame-Options: SAMEORIGIN`) y no se indexa. |

Otros dominios de Zoho permitidos en la página aislada:
- `style-src`: `static.zohocdn.com`, `*.nimbuspop.com` (de ahí sirve Zoho el CSS
  subido) y Google Fonts; `font-src`: `static.zohocdn.com` y Google Fonts;
  `media-src`: `static.zohocdn.com`;
- `img-src`: `static.zohocdn.com`, `*.zohopublic.com` y `*.nimbuspop.com`;
- `connect-src`: `salesiq.zoho.com`, `*.zohopublic.com` (también por `wss:`) y
  `static.zohocdn.com`;
- `frame-src`: `*.zohopublic.com`.

Si algo del chat no funciona en producción (por ejemplo, adjuntar archivos),
abra la consola del navegador: un mensaje "Refused to …" indica el dominio que
falta. Agréguelo en las reglas de `/chat-asesor` de `vercel.json`.

## Protección de datos

- Con las cookies aceptadas, Zoho se carga al entrar al sitio y recibe datos
  técnicos de la visita (páginas vistas, ubicación aproximada, navegador y
  dispositivo); si no se aceptan, solo al abrir el chat. Lo que se escribe en el
  chat se guarda en Zoho (fuera de Colombia) y en el CRM.
- La política (`/privacidad`) lo explica en español e inglés (fila "Chat con un
  asesor (Zoho SalesIQ)", proveedores y cookies). Las versiones en francés,
  alemán, italiano y árabe están desactivadas y **no** se actualizaron: todavía
  describen al asesor virtual Joel y la carga anterior de Zoho; revisarlas antes
  de volver a publicarlas.
- El sitio ya no guarda un perfil del visitante: la clave antigua
  `tp-joel-profile` se borra del navegador.
- Analítica: nunca se envía lo que escribe el visitante (ver
  `docs/conversion-y-analitica.md`).

## Pruebas

Las pruebas **nunca cargan el Zoho real**.

- `tests/unit/crmChat.test.ts`: no carga nada al entrar; carga una sola vez, en
  español y sin el botón de Zoho; abre ya dentro de una conversación nueva y
  avisa al sitio solo entonces; precargada no se muestra ni avisa hasta abrir y
  alterna `aria-hidden`/`tabIndex`; avisa si la conversación está vacía (el bot
  no vuelve a saludar al reabrir); avisa la conversación iniciada (conversión);
  maneja el error y el tiempo de espera; aplica el diseño del sitio con la foto
  de Joel; `public/zoho-salesiq.css` es el mismo diseño y sin rutas relativas.
- `tests/e2e/fixtures.ts`: en todas las pruebas e2e el script de Zoho se
  reemplaza por uno vacío (la precarga cargaría el real).
- `tests/e2e/flows.spec.ts`: se precarga escondido y al tocar el ícono abre ya
  en la conversación, accesible, con el saludo del bot, sin enviar nada; la X
  del botón la cierra; reabrir no vuelve a disparar el bot; si Zoho no carga,
  ventana de respaldo con WhatsApp y el formulario.
- `tests/e2e/analytics.spec.ts` (`pnpm test:ga`): sin aceptar las cookies no se
  precarga; al aceptarlas, sí.
- `tests/e2e/csp.spec.ts`: con las cabeceras de `vercel.json`, abrir el chat (y
  su diseño inyectado) no queda bloqueado.
