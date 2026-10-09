# Transpack · Sitio web

Sitio corporativo de Transpack S.A.S. (mudanzas locales, nacionales e
internacionales, bodegaje y movilidad corporativa, Bogotá) hecho con React 19 +
Vite 8 + Tailwind CSS v4 + TypeScript + React Router 7, en seis idiomas. Se
publica en Vercel.

## Comandos

- `pnpm dev` — servidor local en http://localhost:5173
- `pnpm build` — build de producción en `dist/`, con HTML pre-generado por ruta (SEO)
- `pnpm typecheck` — verificación de tipos (estricta, sin variables sin uso)
- `pnpm lint` — ESLint (calidad, hooks de React, accesibilidad, seguridad)
- `pnpm test` / `pnpm test:e2e` — pruebas (ver `TESTING.md`)
- `pnpm check` — tipos + lint + pruebas + build + revisión SEO del build (`test:seo`);
  debe quedar en verde antes de cada commit
- `pnpm test:ga` — verifica Google Analytics con el ID real (necesita internet)
- `pnpm check:all` — lo anterior + auditoría de dependencias + extremo a extremo
- `pnpm map` — regenera `src/data/worldMap.ts` (países y destinos del mapamundi)
- `pnpm format` — formatea con oxfmt

## Arquitectura (`src/`)

```
src/
├── main.tsx                Punto de entrada: hidrata el HTML pre-generado o renderiza desde cero
├── entry-server.tsx        Render en Node para la pre-generación (scripts/prerender.mjs)
├── App.tsx                 Rutas (una página por ruta, en cada idioma) + SeoHead,
│                           AnalyticsTracker y aviso de cookies
├── pages/                  Una página por ruta (delgadas: arman componentes)
│   ├── LandingPage.tsx         "/"           (secciones de components/home)
│   ├── NosotrosPage.tsx        "/nosotros"
│   ├── ServiceDetailPage.tsx   "/servicios/:slug"
│   ├── ArticlePage.tsx         "/blog/:slug"
│   ├── PrivacyPage.tsx         "/privacidad" (texto en PRIVACY de site.ts)
│   └── NotFoundPage.tsx        404
├── components/
│   ├── layout/             Layout (cabecera + contenido + pie + chat), SeoHead,
│   │                       Analytics (rastreador + aviso de cookies), Header,
│   │                       megamenús (MegaMenuPanel), menú móvil, panel de
│   │                       soporte, Logo, franja de idiomas (LangBar), buscador
│   │                       (SiteSearch) y Footer
│   ├── sections/           Secciones compartidas: PageHero y CtaBand
│   ├── home/               Una sección del inicio por archivo (Hero, Stats,
│   │                       Services, Segments, Levels, Coverage, Process,
│   │                       AboutTeaser, Gallery, QuoteSection, BlogSection,
│   │                       FaqSection, VideoShorts, ContactSection), el mapamundi
│   │                       (WorldMap), el cotizador (QuoteWizard + QuoteFields)
│   ├── chat/               Chat de Joel: AdvisorChat (ventana), ChatLauncher,
│   │                       ChatTeaser, ChatBubble, ChatOptions, ChatAvatar
│   └── ui/                 Primitivas: Bi (íconos), btn, Eyebrow, SectionHead,
│                           Reveal, StatValue, Checks y medidas de sección (layout.ts)
├── data/                   CONTENIDO del sitio (fuente única de verdad)
│   ├── site.ts (+ .en/.fr/.de/.it/.ar)   Contacto, cifras, servicios, segmentos,
│   │                                     niveles, proceso, preguntas frecuentes
│   ├── blogData.ts (+ idiomas)           Artículos del blog
│   ├── content.ts          siteFor(lang) / postsFor(lang) y nombres de destinos
│   ├── home.ts             Textos de las secciones del inicio
│   ├── about.ts            Textos de Nosotros (valores, línea de tiempo…)
│   ├── pages.ts            Textos de servicio, artículo, 404 y franja CTA
│   ├── navigation.ts       Megamenús, soporte, pie y franja de idiomas
│   ├── quote.ts            Opciones y textos del cotizador
│   ├── chat.ts             Pasos del chat guiado y textos del chat
│   ├── joelKnowledge.ts    Conocimiento que recibe el cerebro de Joel
│   ├── search.ts           Qué encuentra el buscador y búsquedas sugeridas
│   ├── meta.ts             Títulos, descripciones y migas de cada página por idioma (SEO)
│   ├── consent.ts          Textos del aviso de cookies
│   ├── contact.ts          Formulario de contacto: motivos, textos y contactHref()
│   ├── clientLogos.ts      Logos de clientes
│   └── worldMap.ts         Mapamundi (GENERADO con `pnpm map`, no editar a mano)
├── lib/                    Lógica pura, sin React
│   ├── joel.ts             "Cerebro" del asesor virtual (sin IA externa)
│   ├── chatRoute.ts        Chat en en/fr/de/it/ar: palabras clave → paso
│   ├── analytics.ts        Google Analytics 4 (Consent Mode v2, páginas vistas, eventos, resetConsent)
│   ├── leads.ts            sendLead(): envía formularios a /api/contact
│   ├── advisorChat.ts      Chat con un asesor DENTRO de Joel (habla con /api/advisor)
│   ├── advisorEvents.ts    Eventos del chat con un asesor
│   ├── zohoBridge.ts       Puente: chat con un asesor dentro de Joel con Zoho escondido
│   ├── crmChat.ts          Respaldo: ventana de Zoho SalesIQ, solo al elegirla (docs/chat-crm.md)
│   ├── search.ts           Motor del buscador
│   └── text.ts             Normalización de texto (sin tildes)
├── seo/                    site.ts (dominio, empresa, interruptor de indexación) y
│                           meta.ts (metadatos, hreflang, JSON-LD y rutas públicas)
├── hooks/                  useContent (useSite/usePosts), useAdvisorChat,
│                           useScrollToHash, useVisitorTracking
├── i18n/                   Idiomas: rutas y slugs traducidos, tr(), dict/<idioma>.ts
├── assets/images/          Imágenes importadas desde el código
└── styles/                index.css (tokens de marca, estilos globales y animaciones) y
                            zoho-chat.css y zoho-host.css (diseño del sitio dentro del chat de Zoho)
api/contact.mts              Función de Vercel: formularios → Brevo → correo (docs/formularios.md)
api/advisor.mts              Función de Vercel: chat con un asesor dentro de Joel → Zoho SalesIQ (docs/chat-crm.md)
public/                     Archivos servidos tal cual (favicon, brand/logo.png, brand/og-image.jpg y
                            chat-asesor.html: página aislada donde vive Zoho, con su propia CSP)
scripts/                    generate-world-map.mjs (pnpm map) y prerender.mjs (HTML por ruta, sitemap, robots)
docs/                       chat-crm.md, conversion-y-analitica.md, formularios.md y seo.md
tests/                      unit/ (Vitest), security/ (revisión estática), seo/ (HTML del build), e2e/ (Playwright + axe)
RecursosTranspack/          Documentos fuente del cliente (contexto, no se publican)
```

Los documentos fuente del cliente están en `RecursosTranspack/` (contexto, no
se publican): Modelo de Negocio, Lógica de Cotización, los tres artículos del
blog en PDF, el Manual de Marca y, en `Imagenes/`, la imagen original de Joel, el
logo de Argos y el sello LACMA. Todo el contenido del sitio debe salir de ahí.

### Reglas de código

- Importar con el alias `@/` (apunta a `src/`).
- Un archivo por componente o por grupo pequeño relacionado; exportaciones con
  nombre (`export function X`), nunca `export default`.
- Las páginas solo arman componentes; la lógica va en `hooks/` o `lib/`.
- El texto del sitio **no** se escribe en los componentes: vive en `src/data/`.
  Las funciones de texto reciben `tr` y el componente las usa así:
  `const t = heroText(tr);` → `{t.title}`. Así el buscador, el chat y las
  páginas leen la misma fuente.

### Idiomas (es / en / fr / de / it / ar)

- Español en la raíz (`/`, `/nosotros`, `/servicios/...`); los demás con prefijo
  y URLs traducidas (`/en/about`, `/fr/services/...`, `/de/leistungen/...`).
  El árabe se muestra de derecha a izquierda.
- Rutas, slugs e información de cada idioma: `src/i18n/index.ts`.
- Textos cortos: `tr("español", "English")` dentro de las funciones de `src/data/`.
  El francés, alemán, italiano y árabe se buscan **por el texto en inglés** en
  `src/i18n/dict/{fr,de,it,ar}.ts`. Si cambia el inglés, cambie también la clave
  del diccionario (la prueba de contenido avisa si falta una traducción).
- Contenido largo: `src/data/site.<idioma>.ts` y `src/data/blogData.<idioma>.ts`.
  **Si cambia un texto en español, actualice también sus traducciones.**

### SEO y analítica

- El HTML de cada ruta se pre-genera en el build (ver `docs/seo.md`). Por eso:
  - nada de `window`, `document`, `localStorage` ni `matchMedia` durante el
    render ni en el valor inicial de `useState` (úselos en `useEffect`);
  - un solo `<h1>` por página;
  - cada ruta nueva va en `getPageMeta` y `PUBLIC_ROUTES` (`src/seo/meta.ts`),
    con título (30–70 caracteres) y descripción (70–160) en los seis idiomas.
- La indexación está desactivada (`VITE_SITE_INDEXABLE`) hasta que el dominio
  apunte a este sitio.
- Google Analytics solo se carga con `VITE_GA_MEASUREMENT_ID` y respeta el
  aviso de cookies. Eventos en `snake_case` con `trackEvent` (`src/lib/analytics.ts`).
  Nunca se envía el texto que escribe el visitante (solo la intención detectada).
  Tabla de eventos: `docs/conversion-y-analitica.md`.

### Formularios y datos personales

- **Nada de `mailto:`** (lo revisa la prueba de seguridad). Para "escribir un
  correo" use un enlace a `#contacto` o `contactHref({ motivo, mensaje, nombre,
  empresa })` (`src/data/contact.ts`): abre `ContactModal`, montado una vez en
  `App`.
- Los envíos pasan por `sendLead()` (`src/lib/leads.ts`) → `api/contact.mts` →
  Brevo. Nunca a servicios de formularios de terceros. La clave
  (`BREVO_API_KEY`) es del servidor: jamás con prefijo `VITE_` ni en `src/`.
- Todo formulario que pida datos personales lleva la casilla de autorización
  (sin marcar por defecto, con enlace a `/privacidad`) y envía
  `"Autorización de datos": "Sí"`; el servidor la vuelve a verificar.
- El correo al equipo va en español (motivos y etiquetas); la confirmación al
  visitante va en su idioma (`lang`).
- Destinos: las cotizaciones (cotizador y formulario con motivo "Cotización")
  van a mercadeo@transpacksas.com (`LEADS_TO_QUOTES`); lo demás a
  servicioalcliente@transpacksas.com (`LEADS_TO`).
- Las pruebas nunca envían correos reales: simulan `fetch` o `/api/contact`.

## Reglas de contenido

- Todo sale de los documentos del cliente y de lo ya publicado en el sitio.
  **No inventar** precios, tarifas, tiempos exactos, pólizas de seguro,
  horarios de atención, listas de artículos prohibidos ni certificaciones.
- Certificaciones reales: **LACMA, IAM y PAIMA** (no ISO 9001, FIDI, BASC, OEA).
- Cifras: más de **58 años** (desde 1968), **176 países**, **2.000+ agentes**,
  **60.000+ toneladas** de menaje exportadas (`STATS` en `src/data/site.ts`).
  Las pruebas verifican que los textos coincidan con `STATS`.
- Embajadas atendidas: las 10 de `EMBASSIES`. En el mapa, solo esos destinos
  llevan `embassy: true`; los demás son destinos de las regiones donde opera
  (Suramérica, África y Asia excepto Irán y Rusia), definidos en
  `scripts/generate-world-map.mjs`.
- Política de datos (`PRIVACY` en `src/data/site.ts` y sus traducciones, página
  `/privacidad`): es un borrador pendiente de aprobación legal. El NIT
  (`CONTACT.nit`) está vacío hasta que el cliente lo entregue: no inventarlo. Si se pide un dato nuevo al visitante
  (cotizador, chat) o se agrega una herramienta que recoja datos, actualice la
  política en los seis idiomas. La versión en español es la oficial.
- El cotizador **no calcula precios** (la Lógica de Cotización no los define):
  perfila la solicitud y la envía por WhatsApp o correo.
- Lenguaje claro, sin tecnicismos (por ejemplo, "Vivir en el exterior" en vez
  de "Diáspora"). Trato de "tú".

## Diseño

- Paleta del Manual de Marca (bloque `@theme` de `src/styles/index.css`):
  azul `#272B7C`, naranja `#FF7619`, beige `#FAEED9`, violeta `#2F2959`,
  gris `#F0F6F6`, más sus derivados (`azul-900`, `tinta`, `texto`, `suave`,
  `linea`…). La lista blanca de colores está en `tests/unit/content.test.ts`:
  para usar un color nuevo, agréguelo ahí a propósito.
- Tipografías: IBM Plex Sans (títulos) y Montserrat (texto).
- Íconos: Bootstrap Icons (`<Bi n="..." />`).
- Chat de Joel: **sin degradados**, mismo estilo de los menús (cabecera azul
  sólida con el cuadrado naranja translúcido girado 45°, rótulo naranja en
  mayúsculas, opciones como lista con íconos en cuadros grises).
- Las fotos actuales se reemplazarán cuando el cliente entregue nuevas: no
  cambiarlas por fotos de banco sin su aprobación.

## Joel (asesor virtual)

- `src/lib/joel.ts` (cerebro, solo en español):
  - entiende texto libre: palabras clave, sinónimos, raíces y errores de tipeo;
  - responde preguntas específicas (FACTS) antes que el resumen del servicio;
  - recuerda de qué servicio se venía hablando;
  - detecta el problema del cliente y asesora (p. ej. "me trasladan a Alemania
    en dos meses");
  - maneja objeciones;
  - se defiende de manipulación, insultos y temas ajenos.
- Aprende y personaliza:
  - si no entiende algo y el visitante elige después una opción, asocia esas
    palabras a esa opción;
  - saluda según el comportamiento del visitante (comprador, técnico o
    explorador).
- Perfil y aprendizaje viven en el `localStorage` del visitante
  (`tp-joel-profile`). No hay servidor: los datos nunca salen del navegador.
- Conocimiento: lo recibe al crearse desde `src/data/joelKnowledge.ts`
  (mismos datos del sitio). Si no tiene un dato, lo dice y ofrece el contacto.
- Conversación guiada (cotización por pasos) y textos: `src/data/chat.ts`.
  Lógica de la ventana: `src/hooks/useAdvisorChat.ts`.
- En inglés, francés, alemán, italiano y árabe el texto libre se enruta por
  palabras clave (`src/lib/chatRoute.ts`).
- Otros componentes abren el chat con `window.dispatchEvent(new Event("tp:open-chat"))`
  (`openChat()` en `components/layout/MenuLink.tsx`).

### Chat con un asesor (Zoho SalesIQ)

- **Joel atiende primero.** "Hablar con un asesor" (o escribir que se quiere
  un asesor) **conecta de una vez**, sin pasos intermedios ni mencionar Zoho;
  un pedido de contacto ofrece **"Chatear con un asesor"** como primera opción.
  El resumen de la cotización trae **"Enviar a un asesor"**, que la manda al
  chat de los asesores (`docs/chat-crm.md`):
  - **dentro de Joel** si `/api/advisor` está configurado: la persona escribe
    en la misma ventana y el asesor responde desde SalesIQ (API REST, sin
    cargar Zoho en el navegador). Credenciales `ZOHO_*` y `ADVISOR_SECRET` solo
    en el servidor; cada conversación con un pase firmado;
  - si no, por el **puente** (`src/lib/zohoBridge.ts`, el que se usa hoy): el
    widget de Zoho se carga escondido y Joel escribe en él y muestra sus
    respuestas; si Zoho pide un formulario, Joel ofrece completarlo en la
    ventana de Zoho u omitirlo;
  - si el puente falla, se abre la **ventana de Zoho** (respaldo, abajo).
- `src/lib/crmChat.ts` carga el script de Zoho **solo en ese momento** (nunca
  al entrar: sin cookies de Zoho antes), una sola vez, en español y con el
  botón de Zoho oculto. El uso de los datos lo explica la política (`/privacidad`).
- Acciones con `crm: true` (`ChatAction` y `JoelAction`) abren ese chat.
- **Diseño:** la ventana de Zoho recibe `src/styles/zoho-chat.css` (estilo del
  chat de Joel y foto de Joel); el marco y el botón de cerrar están al final de
  `src/styles/index.css`. Solo colores de la marca.
- **Zoho nunca se carga en las páginas del sitio:** vive en
  `public/chat-asesor.html` (iframe escondido), que tiene su propia CSP en
  `vercel.json` (con los scripts en línea que Zoho exige). La CSP del sitio no
  autoriza nada de Zoho; no la relaje para Zoho.
- Las pruebas simulan el script de Zoho: nunca cargan el real.
