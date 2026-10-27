# Chat con un asesor: Zoho SalesIQ (CRM)

> **Modo de prueba "solo widget" (rama `feature/chatbot`):** con
> `WIDGET_ONLY = true` en `src/hooks/useAdvisorChat.ts`, el ícono del chat abre
> directamente la ventana de Zoho (su widget, con el CSS de
> `public/zoho-salesiq.css` subido en Zoho), sin la ventana de Joel, el puente
> ni `/api/advisor`. Al abrirla se avisa la acción personalizada
> `abrir_chat_asesor` para que el bot salude solo. Si Zoho no carga, se muestra
> la ventana del sitio con WhatsApp y el formulario.
> El menú "⋮" y la flecha "<" de la cabecera de Zoho se esconden: la ventana
> solo muestra la conversación (no el inicio ni el menú de SalesIQ).
> La ventana abre en la pestaña de conversación (`defaultview: "chat"`) y, si
> no hay una en curso, el sitio entra solo a una conversación nueva
> (`enterConversation` en `src/lib/crmChat.ts`, sin enviar mensajes). La
> ventana se muestra solo cuando ya está dentro de la conversación (mientras
> tanto el botón flotante muestra que está cargando): no se alcanza a ver el
> inicio ni la lista de Zoho.
>
> **Precarga:** para que abra al instante (~0,2 s en vez de ~3,6 s), Zoho se
> carga al entrar al sitio, cuando el navegador está libre (`preloadCrmChat`),
> y deja su ventana armada, escondida y dentro de una conversación; al tocar el
> ícono solo se muestra. No envía mensajes ni avisa la acción del bot (eso pasa
> al abrir). Si el visitante **rechazó las cookies** en el aviso, no se precarga
> y Zoho se carga al abrir el chat. La política de datos lo explica (es y en). El saludo
> del bot depende del disparador del bot en Zoho; si no salta, el primer
> mensaje del visitante lo atiende quien Zoho tenga configurado (bot o asesores). Lo que sigue describe el
> modo normal (`WIDGET_ONLY = false`); sus pruebas e2e del puente no aplican
> mientras esté activo el modo de prueba.

**El chat abre directo con un asesor.** Al pulsar el ícono del chat, la ventana
conecta de una vez con un asesor (modo puente, el activo hoy): **no** muestra el
menú del asesor virtual Joel, **no** dice "Te conecto con un asesor…" y **no**
espera a que la persona escriba. En vez de enviar un mensaje, el puente avisa a
Zoho con una **acción personalizada** (`ADVISOR_START_ACTION`,
"abrir_chat_asesor", vía `visitor.customaction`); con esa acción, un **bot
proactivo configurado en Zoho** saluda solo, sin que el visitante escriba nada.
**Nunca se menciona Zoho** ni la plataforma.

> ⚠️ Para que el saludo aparezca hay que configurar ese disparador en Zoho (ver
> "Configuración del bot proactivo" abajo). Sin esa configuración, el chat abre
> pero el bot no saluda hasta que la persona escriba.

La ventana es **solo el chat con el asesor**: no muestra ninguna franja ni
mensaje propio ("Listo, un asesor te responderá…"), ni el botón "Volver con
Joel". El asesor virtual Joel ya **no se usa en el chat** (su cerebro y el
cotizador guiado siguen en el código pero no se alcanzan desde la ventana); el
cotizador del sitio (QuoteWizard en la portada) es independiente y sigue igual.
El botón de reiniciar de la cabecera empieza una conversación nueva con un
asesor. En los tres modos el asesor atiende desde su panel de SalesIQ como
cualquier chat:

| Modo | Cuándo | Cómo se ve |
| --- | --- | --- |
| **API** (`api/advisor.mjs`) | Si las credenciales de la API de Zoho están en Vercel. **Hoy bloqueado:** Zoho no da el permiso de organización (ver "Estado") | Todo dentro de Joel; el navegador nunca carga Zoho. |
| **Puente** (`src/lib/zohoBridge.ts`) — **el que se usa hoy** | Si la API no está configurada | Todo dentro de Joel: el widget de Zoho se carga **escondido** y Joel escribe en él y muestra sus respuestas. Si Zoho pide un formulario, Joel ofrece completarlo en la ventana de Zoho u omitirlo. |
| **Ventana de Zoho** (respaldo) | Si el puente falla (por ejemplo, Zoho cambió su ventana) | Se abre la ventana del widget de SalesIQ, con el diseño del sitio. |

## Cotización terminada → seguimiento del equipo comercial

Cuando el visitante termina la cotización guiada de Joel:

1. Joel pide el **celular o WhatsApp** después del nombre (valida que tenga al
   menos 7 dígitos; si no, lo vuelve a pedir).
2. El resumen trae como primer botón **"Enviar a un asesor"**. Al pulsarlo
   (nada se envía antes), Joel **manda la cotización al chat de los asesores**
   (por la API o el puente, el que esté activo) como una conversación nueva. El primer
   mensaje es `teamQuoteMessage` (`src/data/chat.ts`), siempre en español:

   ```
   🆕 NUEVA COTIZACIÓN para seguimiento (chat de Joel en el sitio web)
   Cliente: <nombre>
   Celular / WhatsApp: <número>

   • Servicio: …
   • Origen: … (todas las respuestas)
   [Idioma del cliente: …]   (si no es español)

   Por favor, contactar al cliente para dar seguimiento o cerrar la venta.
   ```

3. Joel confirma al cliente ("Listo, tu cotización ya está con un asesor. Te
   contactará al <número>…") y se queda
   escuchando: si el asesor responde mientras el cliente sigue en la página, la
   respuesta aparece en Joel. Si el envío falla, Joel sugiere WhatsApp.
4. Siguen disponibles los botones de WhatsApp y correo (no el cotizador: la cotización ya se hizo en el chat).

Se registra `generate_lead` con `method: "chat_advisor"`. La política de datos
(fila del chat de Joel) lo explica en los seis idiomas.

## Modo "puente" (activo)

1. Al **abrir el chat** (o con "Hablar con un asesor") se conecta de una vez,
   sin enviar ningún mensaje y sin pedírselo a la persona.
2. Se carga el widget de Zoho en la página aislada, escondida fuera de la
   pantalla (`#tp-zoho-frame`, `src/styles/index.css`), se pulsa "Chatee con
   nosotros ahora" y se avisa la acción personalizada (`triggerAdvisorStart()` en
   `src/lib/crmChat.ts` → `visitor.customaction("abrir_chat_asesor")`). **No se
   envía ningún mensaje**: el bot proactivo de Zoho (configurado para esa acción)
   saluda solo.
3. Un observador lee los mensajes nuevos del bot o del asesor de Zoho
   (`[data-zsqa="agent_msg message_bubble"]`) y los muestra en Joel con su
   nombre; los botones de sugerencia de Zoho aparecen como opciones en Joel.
4. Lo que la persona escribe después va al campo de texto de Zoho.
5. Las **preguntas de datos del visitante** que hace Zoho ("¿Cómo quiere que
   le contactemos?", "¿Podemos enviarle un correo electrónico?"…) se **omiten
   solas**: mientras no se respondan, Zoho no pasa la conversación a los
   asesores, y Joel ya tiene la consulta. Si una pregunta no se puede omitir,
   Joel ofrece "Completar mis datos" (muestra la ventana de Zoho; al cerrarla
   se vuelve a esconder).
6. Al cerrar la ventana del chat (la X de la cabecera) se deja de escuchar; la
   conversación sigue en SalesIQ y se retoma al abrir de nuevo.

**Configuración del bot proactivo (necesaria para que salude solo):**
Hay que hacer que el bot (Zobot) salude cuando el sitio dispara la acción
personalizada `abrir_chat_asesor`:
1. SalesIQ → Configuración → Bots (Zobot): edita el bot o crea uno.
2. En la audiencia / "¿Cuándo activar el bot con el visitante?" elige **"Realiza
   una acción personalizada"** y escribe el valor **`abrir_chat_asesor`** (igual
   que `ADVISOR_START_ACTION` en `src/lib/crmChat.ts`).
3. Guarda y activa el bot.

Alternativa más simple: poner la audiencia del bot en **"Todos los visitantes"**
(proactivo); así saluda al abrirse el chat sin depender de la acción. Es menos
preciso (puede traer condiciones de tiempo o de página), pero no necesita la
acción personalizada.

- Conviene que el bot pase la conversación a un asesor (o lo ofrezca) pronto;
  mientras el bot no transfiera, no llega a los asesores.
- Las preguntas de datos del visitante de la ventana de chat de Zoho se omiten
  solas (paso 5). Si se quieren quitar en Zoho, están en la configuración de
  la ventana de chat de la marca.
- Probado con Zoho real: la conversación entra a la bandeja de SalesIQ
  ("conectada", atiende Transpack) con la pregunta del visitante.

**Cuidado:** depende de la estructura interna de la ventana de Zoho (clases y
atributos `data-zsqa`). Si Zoho la cambia, el puente falla y Joel abre la
ventana de Zoho (respaldo). Probado con el widget real el 8 de octubre de 2026.

## Modo "dentro de Joel"

```
Navegador (Joel) ──/api/advisor──► Función de Vercel (api/advisor.mjs) ──API REST──► Zoho SalesIQ ◄── asesor (panel de SalesIQ)
```

1. "Hablar con un asesor" → Joel pide el mensaje.
2. Con esa pregunta, la función abre la conversación en SalesIQ (API de
   visitante) y le entrega al navegador un **pase firmado** que solo sirve para
   esa conversación.
3. Lo que la persona escribe después se envía a esa conversación.
4. Cada 3,5 segundos el chat pregunta si hay respuestas nuevas y las muestra
   con el nombre del asesor y un ícono de audífonos. "X se unió a la
   conversación" avisa cuando un asesor la toma.
5. Si en 2 minutos nadie responde, Joel ofrece WhatsApp y el formulario (la
   persona puede seguir esperando).
6. "Volver con Joel" termina el modo asesor en la ventana. Si el asesor cierra
   el chat, Joel lo avisa.
7. La conversación sigue al cambiar de página o recargar (se guarda el pase en
   `sessionStorage` de esa pestaña).

| Pieza | Archivo |
| --- | --- |
| Función (abrir, enviar, leer) | `api/advisor.mjs` |
| Cliente del navegador | `src/lib/advisorChat.ts` |
| Lógica en el chat | `src/hooks/useAdvisorChat.ts` (`live`: `ask` → `connecting` → `live`) |
| Mensaje del asesor y franja "Chat con un asesor" | `src/components/chat/ChatBubble.tsx`, `AdvisorChat.tsx` |
| Simulación en `pnpm dev` | `vite.config.ts` (un asesor de prueba responde a los 5 s) |
| Verificación con Zoho real | `scripts/zoho-advisor-check.mjs` (`pnpm advisor:check`) |

**Seguridad**
- Las credenciales de Zoho son de toda la cuenta: solo existen en el servidor
  (prueba en `tests/security/static.test.ts`).
- El pase está firmado con `ADVISOR_SECRET` y vence en 12 horas. Sin él, o
  alterado, la función responde 403. Nadie puede leer ni escribir en la
  conversación de otra persona.
- La función acepta solo pedidos del propio sitio, valida el largo de los
  mensajes y no reenvía al navegador los detalles de los errores de Zoho.

**Estado (8 de octubre de 2026): bloqueado por un permiso de Zoho.**
- Funciona: el token de la cuenta (lectura de marcas, departamentos y
  mensajes).
- No funciona: abrir conversaciones a nombre del visitante. Zoho responde
  `1009 Invalid OAuthScope` con tokens de usuario, tanto con
  `SalesIQ.conversations.CREATE` (Self Client) como con
  `SalesIQ.Conversations.ALL` (cliente Server-based).
- La autorización de organización (`/oauth/v2/org/auth`) responde
  "Cliente no válido: el ID de cliente no existe" con clientes creados en
  api-console.zoho.com.
- Siguiente paso: que soporte de Zoho SalesIQ indique cómo obtener el
  **Org OAuth token** para la API de visitante (y si el plan lo incluye).
  Mientras tanto, el sitio usa la ventana de Zoho (respaldo).

**Por confirmar en la primera prueba real:** la API de visitante devuelve un
`id` de conversación largo (por ejemplo `d2e4771b…`) y la lectura de mensajes
usa la API v2. Si la v2 no acepta ese `id`, `pnpm advisor:check --conversacion`
lo muestra y se ajusta `api/advisor.mjs` (acción `poll`).

### Configuración (área encargada de Zoho)

1. Entre a <https://api-console.zoho.com> con la cuenta administradora de
   SalesIQ → **Add Client → Self Client → Create**. Copie el **Client ID** y el
   **Client Secret**.
2. En el Self Client → **Generate Code**:
   - Scope: `SalesIQ.conversations.CREATE,SalesIQ.conversations.READ,SalesIQ.Apps.READ,SalesIQ.departments.READ`
   - Duración: 10 minutos. Copie el código.
3. Cambie el código por la clave de renovación (refresh token), en una terminal:

   ```bash
   curl -X POST "https://accounts.zoho.com/oauth/v2/token?grant_type=authorization_code&client_id=CLIENT_ID&client_secret=CLIENT_SECRET&code=CODIGO"
   ```

   La respuesta trae `refresh_token`. Guárdelo: no vuelve a mostrarse.
4. Cree una clave para firmar los pases: `openssl rand -base64 48`.
5. Para probar en el equipo, ponga los valores en `.env.local` (no se sube al
   repositorio; ver `.env.example`) y corra:
   - `pnpm advisor:check` → muestra las marcas y los departamentos;
   - `pnpm advisor:check --conversacion` → abre una conversación **de prueba**
     que les llega a los asesores.
6. En Vercel → **Settings → Environment Variables** (Production): las mismas
   variables (`ZOHO_CLIENT_ID`, `ZOHO_CLIENT_SECRET`, `ZOHO_REFRESH_TOKEN`,
   `ADVISOR_SECRET` y, si se quiere fijar, `ZOHO_SALESIQ_APP_ID` y
   `ZOHO_SALESIQ_DEPARTMENT_ID`). **Redeploy**.
7. Pruebe en el sitio: "Hablar con un asesor" y escriba un mensaje.

Notas:
- El portal se llama `transpacksas` (aparece en la dirección de SalesIQ); se
  cambia con `ZOHO_SALESIQ_SCREEN`.
- Si la cuenta de Zoho está en otro centro de datos (por ejemplo `.eu`),
  cambie `ZOHO_ACCOUNTS_URL` y `ZOHO_SALESIQ_URL`.
- Confirme que el plan de SalesIQ incluye la API REST (la cuenta está en
  período de prueba).

## Modo "ventana de Zoho" (respaldo)

| Pieza | Archivo | Qué hace |
| --- | --- | --- |
| Opción en Joel | `src/data/chat.ts` (paso `human`) y `src/lib/joel.ts` (`ADVISOR_CHAT`) | "Hablar con un asesor" (o pedir un asesor por escrito: intención `asesor`, `handoff`) conecta de una vez; pedir contacto ofrece "Chatear con un asesor" como primera opción. |
| Lógica | `src/hooks/useAdvisorChat.ts` | Si `/api/advisor` no está configurado, carga y abre la ventana de Zoho; mientras está abierta se ocultan la ventana y el botón de Joel. Si Zoho no carga, Joel ofrece WhatsApp y el formulario. |
| Cargador | `src/lib/crmChat.ts` (archivo aparte, se descarga solo al usarlo) | Carga el script de Zoho una sola vez, en español, sin su botón y con el diseño del sitio. |

- **Código del widget:** `SALESIQ_WIDGET` en `src/lib/crmChat.ts` (no es secreto).
- **Vista inicial:** la ventana abre en el inicio de Zoho ("Chatee con nosotros
  ahora"); Zoho no permite abrirla directo en la conversación.
- **Analítica:** abrir el chat con un asesor registra `contact_click` con
  `method: "advisor_chat"`. En el modo dentro de Joel, abrir la conversación
  registra además `generate_lead` con `method: "advisor_chat"`. Lo que se
  escribe nunca llega a Google Analytics.

## Protección de datos

- **Zoho se carga al entrar al sitio** (modo solo widget, precarga), salvo que
  el visitante rechace las cookies en el aviso; en ese caso se carga al abrir el
  chat. En el modo API dentro de Joel el navegador nunca carga Zoho ni sus
  cookies: todo pasa por `/api/advisor`.
- Para que el paso al asesor sea directo, no se muestra un aviso previo ni se
  nombra la plataforma: el uso de los datos lo explica la política.
- **Política actualizada (octubre de 2026)** en español e inglés: Zoho se carga
  al entrar al sitio (salvo que se rechacen las cookies) y recibe datos técnicos
  de la visita. Las versiones en francés, alemán, italiano y árabe están
  desactivadas y **no** se actualizaron: revisarlas antes de volver a publicarlas.
- La política (`/privacidad`, seis idiomas) lo explica:
  - fila "Chat con un asesor (Zoho SalesIQ)";
  - Zoho como encargado del tratamiento, con servidores que pueden estar fuera
    de Colombia;
  - las cookies de Zoho, solo si se abre su ventana.

## Diseño (modo ventana de Zoho)

La ventana de Zoho tiene el diseño del chat de Joel:

- cabecera azul sólida con el cuadrado naranja translúcido girado 45° (puntas
  redondeadas) y el rótulo naranja "TRANSPACK" en mayúsculas;
- fondo gris y tarjetas blancas con borde fino, con el ícono en un recuadro gris;
- burbujas del asistente blancas y opciones en filas con flecha;
- la foto de Joel en lugar del robot de Zoho (`public/brand/joel-avatar.png`,
  copia de `src/assets/images/joel-avatar.png`);
- tipografías del sitio y solo colores de la marca.

| Qué | Archivo |
| --- | --- |
| Lo de adentro de la ventana | `src/styles/zoho-chat.css` (se inyecta desde `src/lib/crmChat.ts`) |
| Marco (esquinas, sombra) y botón de cerrar | `src/styles/zoho-host.css` (se inyecta en la página aislada) |

- **Por qué funciona:** la ventana de Zoho es un iframe del mismo origen que la
  página, así que el sitio puede agregarle una hoja de estilos. Los colores se
  cambian con las variables del tema de Zoho (`--siqcw-…`).
- **Cuidado:** los estilos dependen de las clases internas de Zoho
  (`.siqcw-header`, `.home-icon-optns`, `.tag-div`, `.siqcw-bot-logo`…). Si
  Zoho cambia su ventana, algunos estilos podrían dejar de aplicarse. Revise el
  chat después de cada actualización grande de Zoho.
- **En el panel de Zoho:** `public/zoho-salesiq.css` es la copia lista para
  subir en SalesIQ → Configuración → Marcas → Personalización → Apariencia →
  "Upload custom CSS" (aplica a lo de adentro de la ventana, también fuera del
  sitio). Es el mismo `zoho-chat.css`, con la foto de Joel
  (embebida en el archivo, así no depende del dominio); si cambia el
  original, vuelva a generarla (`tests/unit/crmChat.test.ts` avisa si difieren).
  El marco de la ventana y el botón flotante (`zoho-host.css`) quedan fuera de
  la ventana: Zoho no los toma de este CSS.

## Página aislada y CSP (vercel.json)

Zoho **no se carga en las páginas del sitio**. Vive en una página propia y
vacía, `public/chat-asesor.html`, que el sitio abre en un iframe escondido
(`#tp-zoho-frame`, `src/lib/crmChat.ts`) solo cuando la persona pide
un asesor.

**Por qué:** el widget de Zoho ejecuta un script en línea distinto para cada
visitante (incluye su identificador), así que no se puede autorizar con una
huella fija. La CSP estricta del sitio lo bloqueaba (la ventana de Zoho quedaba
vacía). Con la página aislada:

| Cabeceras | Para | Scripts permitidos |
| --- | --- | --- |
| `/((?!chat-asesor).*)` | Todo el sitio | Solo los del propio sitio y Google Tag Manager. Nada de Zoho. `frame-src 'self'` para mostrar la página aislada. |
| `/chat-asesor` y `/chat-asesor.html` | La página aislada | `'unsafe-inline'` más `salesiq.zohopublic.com`, `salesiq.zoho.com` y `static.zohocdn.com`. Solo el sitio la puede mostrar (`frame-ancestors 'self'`, `X-Frame-Options: SAMEORIGIN`) y no se indexa. |

Otros dominios de Zoho permitidos en la página aislada:
- `style-src`, `font-src` y `media-src`: `static.zohocdn.com`;
- `img-src`: `static.zohocdn.com` y `*.zohopublic.com`;
- `connect-src`: `salesiq.zoho.com`, `*.zohopublic.com` (también por `wss:`) y
  `static.zohocdn.com`;
- `frame-src`: `*.zohopublic.com`.

Si algo del chat no funciona en producción (por ejemplo, adjuntar archivos o
llamadas), abra la consola del navegador: un mensaje "Refused to …" indica el
dominio que falta. Agréguelo en las reglas de `/chat-asesor` de `vercel.json` y
revise `tests/security/static.test.ts`.

## Configuración del widget en Zoho (modo ventana)

1. **Dominio:** autorice `www.transpacksas.com` (y el dominio de Vercel, si se
   prueba ahí).
2. **Idioma:** español.
3. **Bot de Zoho:** hoy el bot "Joel Transpack" saluda primero dentro de Zoho.
   Como Joel ya atendió en el sitio, conviene que en este canal pase directo a
   un asesor (o que el bot lo ofrezca de entrada).
4. **Foto (opcional):** en el sitio ya se ve la foto de Joel. Si se quiere
   también en el panel de Zoho, súbala como foto del bot.

## Pruebas

Las pruebas **nunca se conectan con Zoho**: simulan el script y la API.

- `tests/unit/advisor-api.test.ts` (`api/advisor.mjs` con `fetch` simulado):
  - sin credenciales → 503 y GET `configured: false`;
  - otro dominio → 403;
  - abre la conversación con marca, departamento y nombre, y entrega el pase;
  - valida pregunta y mensaje (422);
  - sin pase, alterado o vencido → 403, sin llamar a Zoho;
  - envía el mensaje a la conversación correcta;
  - devuelve solo lo nuevo del asesor (no lo del visitante) y el aviso de que
    un asesor se unió o cerró;
  - falla de Zoho → 502 sin revelar el detalle;
  - sin marca o departamento configurados, usa los primeros del portal.
- `tests/e2e/flows.spec.ts` · "chat con un asesor dentro de Joel": se escribe
  y se responde en la misma ventana, con el nombre del asesor, y nunca se carga
  la ventana de Zoho.

- `tests/unit/crmChat.test.ts`:
  - no carga nada al entrar;
  - carga una sola vez, en español y sin el botón de Zoho;
  - abre la ventana;
  - maneja el error y el tiempo de espera;
  - aplica el diseño del sitio, con la foto de Joel.
- `tests/unit/joel.test.ts`: pedir un asesor pasa directo (sin texto previo);
  "asesoría", agentes o el teléfono no; el contacto no menciona Zoho y su
  primera opción es el chat con un asesor.
- `tests/e2e/flows.spec.ts`:
  - Joel funciona sin cargar Zoho;
  - "Hablar con un asesor" conecta de una vez (sin mencionar Zoho);
  - la cotización solo se envía al pulsar "Enviar a un asesor";
  - se ocultan la ventana y el botón de Joel, y el botón vuelve al cerrar Zoho;
  - si Zoho no carga, Joel ofrece WhatsApp y el formulario.
- `tests/e2e/csp.spec.ts`: con las cabeceras de `vercel.json`, abrir el chat
  con un asesor no queda bloqueado.
