# Chat con un asesor: Zoho SalesIQ (CRM)

**Joel atiende primero.** El chat del sitio es Joel, el asesor virtual propio.
Cuando la persona quiere hablar con alguien del equipo, Joel ofrece
**"Chatear con un asesor"**. En los tres modos el asesor atiende desde su
panel de SalesIQ como cualquier chat:

| Modo | Cuándo | Cómo se ve |
| --- | --- | --- |
| **API** (`api/advisor.ts`) | Si las credenciales de la API de Zoho están en Vercel. **Hoy bloqueado:** Zoho no da el permiso de organización (ver "Estado") | Todo dentro de Joel; el navegador nunca carga Zoho. |
| **Puente** (`src/lib/zohoBridge.ts`) — **el que se usa hoy** | Si la API no está configurada | Todo dentro de Joel: el widget de Zoho se carga **escondido** y Joel escribe en él y muestra sus respuestas. Si Zoho pide un formulario, Joel ofrece completarlo en la ventana de Zoho u omitirlo. |
| **Ventana de Zoho** (respaldo) | Si el puente falla (por ejemplo, Zoho cambió su ventana) | Se abre la ventana del widget de SalesIQ, con el diseño del sitio. |

## Modo "puente" (activo)

1. "Chatear con un asesor" → Joel pide la pregunta.
2. Se carga el widget de Zoho fuera de la pantalla (`html.tp-zoho-hidden`,
   `src/styles/index.css`), se pulsa "Chatee con nosotros ahora" y se escribe
   la pregunta en su campo de texto.
3. Un observador lee los mensajes nuevos del bot o del asesor de Zoho
   (`[data-zsqa="agent_msg message_bubble"]`) y los muestra en Joel con su
   nombre; los botones de sugerencia de Zoho aparecen como opciones en Joel.
4. Lo que la persona escribe después va al campo de texto de Zoho.
5. Si Zoho pide un **formulario** (nombre, correo, medio de contacto), Joel
   ofrece "Completar mis datos" (muestra la ventana de Zoho; al cerrarla se
   vuelve a esconder) u "Omitir este paso" (pulsa "Omitir" en Zoho).
6. "Volver con Joel" deja de escuchar y esconde Zoho.

**Recomendación:** apagar o simplificar el bot de Zoho ("Joel Transpack",
SalesIQ → Bot → Zobot) en el sitio web, o hacer que pase directo a un asesor:
Joel ya cumple ese papel, y así no aparecen sus formularios ni dos "Joel".

**Cuidado:** depende de la estructura interna de la ventana de Zoho (clases y
atributos `data-zsqa`). Si Zoho la cambia, el puente falla y Joel abre la
ventana de Zoho (respaldo). Probado con el widget real el 8 de octubre de 2026.

## Modo "dentro de Joel"

```
Navegador (Joel) ──/api/advisor──► Función de Vercel (api/advisor.ts) ──API REST──► Zoho SalesIQ ◄── asesor (panel de SalesIQ)
```

1. "Chatear con un asesor" → Joel pide la pregunta en un mensaje.
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
| Función (abrir, enviar, leer) | `api/advisor.ts` |
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
lo muestra y se ajusta `api/advisor.ts` (acción `poll`).

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
7. Pruebe en el sitio: "Hablar con un asesor" → "Chatear con un asesor".

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
| Opción en Joel | `src/data/chat.ts` (paso `human`) y `src/lib/joel.ts` (`ADVISOR_CHAT`) | "Hablar con un asesor" muestra el aviso de datos y, como primera opción, "Chatear con un asesor". |
| Lógica | `src/hooks/useAdvisorChat.ts` | Si `/api/advisor` no está configurado, carga y abre la ventana de Zoho; mientras está abierta se ocultan la ventana y el botón de Joel. Si Zoho no carga, Joel ofrece WhatsApp y el formulario. |
| Cargador | `src/lib/crmChat.ts` (archivo aparte, se descarga solo al usarlo) | Carga el script de Zoho una sola vez, en español, sin su botón y con el diseño del sitio. |

- **Código del widget:** `SALESIQ_WIDGET` en `src/lib/crmChat.ts` (no es secreto).
- **Vista inicial:** la ventana abre en el inicio de Zoho ("Chatee con nosotros
  ahora"); Zoho no permite abrirla directo en la conversación.
- **Analítica:** "Chatear con un asesor" registra `contact_click` con
  `method: "advisor_chat"`. En el modo dentro de Joel, abrir la conversación
  registra además `generate_lead` con `method: "advisor_chat"`. Lo que se
  escribe nunca llega a Google Analytics.

## Protección de datos

- Mientras la persona no elija "Chatear con un asesor", no se envía nada a
  Zoho. En el modo dentro de Joel, el navegador nunca carga Zoho ni sus cookies.
- Antes de ofrecer el chat, Joel avisa que un asesor atiende desde Zoho
  SalesIQ y que los mensajes quedan en el sistema de clientes.
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
| Marco (esquinas, sombra) y botón de cerrar | final de `src/styles/index.css` |

- **Por qué funciona:** la ventana de Zoho es un iframe del mismo origen que la
  página, así que el sitio puede agregarle una hoja de estilos. Los colores se
  cambian con las variables del tema de Zoho (`--siqcw-…`).
- **Cuidado:** los estilos dependen de las clases internas de Zoho
  (`.siqcw-header`, `.home-icon-optns`, `.tag-div`, `.siqcw-bot-logo`…). Si
  Zoho cambia su ventana, algunos estilos podrían dejar de aplicarse. Revise el
  chat después de cada actualización grande de Zoho.
- **Opcional:** el mismo `zoho-chat.css` se puede pegar en Zoho (Configuración
  → Marca → Personalización → CSS personalizado), cambiando la foto por la
  dirección completa `https://www.transpacksas.com/brand/joel-avatar.png`.

## CSP (vercel.json)

Dominios observados al cargar y abrir el widget el 8 de octubre de 2026:

| Directiva | Dominios de Zoho |
| --- | --- |
| `script-src` | `https://salesiq.zohopublic.com` (widget), `https://salesiq.zoho.com`, `https://static.zohocdn.com` |
| `style-src`, `font-src`, `media-src` | `https://static.zohocdn.com` |
| `img-src` | `https://static.zohocdn.com`, `https://*.zohopublic.com` |
| `connect-src` | `https://salesiq.zoho.com`, `https://*.zohopublic.com`, `wss://*.zohopublic.com`, `https://static.zohocdn.com` |
| `frame-src` | `https://*.zohopublic.com` |

Si algo del chat no funciona en producción (por ejemplo, adjuntar archivos o
llamadas), abra la consola del navegador: un mensaje "Refused to …" indica el
dominio que falta. Agréguelo a `vercel.json` y a la lista de
`tests/security/static.test.ts`.

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

- `tests/unit/advisor-api.test.ts` (`api/advisor.ts` con `fetch` simulado):
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
- `tests/unit/joel.test.ts`: al pedir un asesor, la primera opción es el chat
  con un asesor y Joel avisa del uso de datos.
- `tests/e2e/flows.spec.ts`:
  - Joel funciona sin cargar Zoho;
  - "Hablar con un asesor" → aviso → "Chatear con un asesor" carga Zoho en
    español con el diseño del sitio;
  - se ocultan la ventana y el botón de Joel, y el botón vuelve al cerrar Zoho;
  - si Zoho no carga, Joel ofrece WhatsApp y el formulario.
- `tests/e2e/csp.spec.ts`: con las cabeceras de `vercel.json`, abrir el chat
  con un asesor no queda bloqueado.
