# Chat con un asesor: Zoho SalesIQ (CRM)

**Joel atiende primero.** El chat del sitio sigue siendo Joel, el asesor
virtual propio. Cuando la persona quiere hablar con alguien del equipo, Joel le
ofrece **"Chatear con un asesor"**, que abre el chat de **Zoho SalesIQ**,
conectado al CRM de Transpack.

## Cómo funciona

| Pieza | Archivo | Qué hace |
| --- | --- | --- |
| Opción en Joel | `src/data/chat.ts` (paso `human`) y `src/lib/joel.ts` (`ADVISOR_CHAT`, primera acción de contacto) | "Hablar con un asesor" muestra el aviso de datos y, como primera opción, "Chatear con un asesor". En español, Joel también la ofrece cuando alguien pide un asesor o un contacto con texto libre. |
| Botón de la acción | `src/components/chat/ChatBubble.tsx` | Las acciones con `crm: true` llaman a `requestAdvisorChat()` (evento `tp:open-advisor`). |
| Lógica | `src/hooks/useAdvisorChat.ts` | Carga y abre Zoho. Mientras carga, el botón de Joel muestra un indicador. Con la ventana de Zoho abierta se ocultan la ventana y el botón de Joel; al cerrarla vuelve el botón. Si Zoho no carga, Joel ofrece WhatsApp y el formulario. |
| Cargador | `src/lib/crmChat.ts` | Carga el script de Zoho **solo en ese momento**, una sola vez. Lo pone en español, oculta el botón propio de Zoho, le aplica el diseño del sitio y avisa cuando la ventana se abre o se cierra (evento `tp:crm-chat`). |

```
Joel ──"Hablar con un asesor"──► aviso de datos + "Chatear con un asesor"
                                         │
                                         ▼
                   se inserta <script id="zsiqscript" src="https://salesiq.zoho.com/widget?wc=…">
                                         │
                                         ▼
                  Zoho llama a ready() ──► idioma "es", botón de Zoho oculto, ventana abierta
```

- **Código del widget:** `SALESIQ_WIDGET` en `src/lib/crmChat.ts`. No es
  secreto: es el mismo que Zoho pide pegar en la página. Si Zoho entrega uno
  nuevo, se cambia ahí.
- **Idioma:** el chat con un asesor es siempre en español. En los otros idiomas
  la opción lo dice: "Chat with an advisor (in Spanish)".
- **Vista inicial:** la ventana de Zoho abre en su inicio, donde la persona
  pulsa "Chatee con nosotros ahora". Zoho no permite abrirla directo en la
  conversación desde el sitio después de cargar.
- **Analítica:** al pulsar "Chatear con un asesor" se registra `contact_click`
  con `method: "advisor_chat"`. Lo que se escribe en Zoho queda en Zoho, no en
  Google Analytics.

## Protección de datos

- Mientras la persona no elija "Chatear con un asesor", Zoho **no se carga**:
  no hay cookies ni seguimiento de Zoho.
- Antes de ofrecer el chat, Joel avisa que se abre en Zoho SalesIQ y que los
  mensajes quedan en el sistema de clientes, según la política de datos.
- La política (`/privacidad`, seis idiomas) lo explica:
  - fila "Chat con un asesor (Zoho SalesIQ)" en la tabla de canales;
  - Zoho como encargado del tratamiento, con servidores que pueden estar fuera
    de Colombia;
  - sus cookies, solo al elegir ese chat.

## Diseño

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
| `script-src` | `https://salesiq.zoho.com`, `https://static.zohocdn.com` |
| `style-src`, `font-src`, `media-src` | `https://static.zohocdn.com` |
| `img-src` | `https://static.zohocdn.com`, `https://*.zohopublic.com` |
| `connect-src` | `https://salesiq.zoho.com`, `https://*.zohopublic.com`, `wss://*.zohopublic.com`, `https://static.zohocdn.com` |
| `frame-src` | `https://*.zohopublic.com` |

Si algo del chat no funciona en producción (por ejemplo, adjuntar archivos o
llamadas), abra la consola del navegador: un mensaje "Refused to …" indica el
dominio que falta. Agréguelo a `vercel.json` y a la lista de
`tests/security/static.test.ts`.

## Configuración en Zoho (área encargada del CRM)

1. **Dominio:** autorice `www.transpacksas.com` (y el dominio de Vercel, si se
   prueba ahí).
2. **Idioma:** español.
3. **Bot de Zoho:** hoy el bot "Joel Transpack" saluda primero dentro de Zoho.
   Como Joel ya atendió en el sitio, conviene que en este canal pase directo a
   un asesor (o que el bot lo ofrezca de entrada).
4. **Foto (opcional):** en el sitio ya se ve la foto de Joel. Si se quiere
   también en el panel de Zoho, súbala como foto del bot.

## Pruebas

Las pruebas **nunca cargan el script real de Zoho**: lo simulan.

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
