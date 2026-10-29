# Transpack · Sitio web

Sitio corporativo de Transpack S.A.S. (mudanzas locales, nacionales e
internacionales, bodegaje y movilidad corporativa, Bogotá) hecho con React 19 +
Vite 8 + Tailwind CSS v4 + TypeScript + React Router 7, en español e inglés. Se
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
- `pnpm videos` — regenera `src/data/youtubeVideos.ts` (videos y Shorts del canal de
  YouTube para "Nuestros empaques"; necesita internet). Córralo cuando el canal publique
- `pnpm format` — formatea con oxfmt
- `pnpm brevo:events` — motivo de cada error de envío en Brevo (`docs/formularios.md`)

### Rendimiento (límites que vigila el CI)

- El JS principal debe quedar **por debajo de 450 KB** sin comprimir
  (`.github/workflows/ci.yml`). Lo pesado va aparte: React y React Router en el
  chunk `vendor` (`vite.config.ts`) y el chat de Zoho con `import()`.
- Fotos: JPG de **máximo 1200 px** en el lado largo (900 px en la galería),
  calidad ~72, idealmente **menos de 200 KB** cada una. Los originales del
  cliente van en `RecursosTranspack/Imagenes/`, no en la raíz del proyecto.

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
│   ├── VideosPage.tsx          "/videos": Nuestros empaques (todos los videos del canal)
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
│   ├── videos/             VideoCard (tarjeta de video de Nuestros empaques)
│   ├── chat/               Chat (Zoho SalesIQ): AdvisorChat (botón, invitación y
│   │                       ventana de respaldo), ChatLauncher, ChatTeaser,
│   │                       ChatBubble, ChatOptions, ChatAvatar
│   └── ui/                 Primitivas: Bi (íconos), btn, Eyebrow, SectionHead,
│                           Reveal, StatValue, Checks y medidas de sección (layout.ts)
├── data/                   CONTENIDO del sitio (fuente única de verdad)
│   ├── site.ts (+ .en)                   Contacto, cifras, servicios, segmentos,
│   │                                     niveles, proceso, preguntas frecuentes
│   ├── blogData.ts (+ idiomas)           Artículos del blog
│   ├── content.ts          siteFor(lang) / postsFor(lang) y nombres de destinos
│   ├── home.ts             Textos de las secciones del inicio
│   ├── about.ts            Textos de Nosotros (valores, línea de tiempo…)
│   ├── pages.ts            Textos de servicio, artículo, 404 y franja CTA
│   ├── navigation.ts       Megamenús, soporte, pie y franja de idiomas
│   ├── quote.ts            Opciones y textos del cotizador
│   ├── chat.ts             Textos del botón del chat, la invitación y el respaldo
│   ├── search.ts           Qué encuentra el buscador y búsquedas sugeridas
│   ├── meta.ts             Títulos, descripciones y migas de cada página por idioma (SEO)
│   ├── consent.ts          Textos del aviso de cookies
│   ├── contact.ts          Formulario de contacto: motivos, textos y contactHref()
│   ├── clientLogos.ts      Logos de clientes
│   ├── youtubeVideos.ts    Videos y Shorts del canal (GENERADO con `pnpm videos`, no editar a mano)
│   └── worldMap.ts         Mapamundi: siluetas de los países y destinos (GENERADO con `pnpm map`, no editar a mano)
├── lib/                    Lógica pura, sin React
│   ├── analytics.ts        Google Analytics 4 (Consent Mode v2, páginas vistas, eventos, resetConsent)
│   ├── leads.ts            sendLead(): envía formularios a /api/contact
│   ├── advisorEvents.ts    Eventos del chat (ventana a la vista, conversación iniciada)
│   ├── crmChat.ts          Chat: widget de Zoho SalesIQ (precarga, apertura, diseño; docs/chat-crm.md)
│   ├── search.ts           Motor del buscador
│   └── text.ts             Normalización de texto (sin tildes)
├── seo/                    site.ts (dominio, empresa, interruptor de indexación) y
│                           meta.ts (metadatos, hreflang, JSON-LD y rutas públicas)
├── hooks/                  useContent (useSite/usePosts), useAdvisorChat,
│                           useScrollToHash
├── i18n/                   Idiomas: rutas y slugs traducidos, tr(), dict/<idioma>.ts
├── assets/images/          Imágenes importadas desde el código
└── styles/                index.css (tokens de marca, estilos globales y animaciones) y
                            zoho-chat.css y zoho-host.css (diseño del sitio dentro del chat de Zoho)
api/contact.mjs              Función de Vercel: formularios → Brevo → correo (docs/formularios.md)
public/                     Archivos servidos tal cual (favicon, brand/logo.png, brand/og-image.jpg y
                            chat-asesor.html: página aislada donde vive Zoho, con su propia CSP)
scripts/                    generate-world-map.mjs (pnpm map), fetch-youtube-videos.mjs (pnpm videos), prerender.mjs (HTML por ruta, sitemap,
                            robots), generate-email-header.mjs (banner de los correos), brevo-events.mjs
                            (diagnóstico de envíos)
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

### Idiomas (es / en)

- **El sitio está solo en español e inglés** (`LANGS` en `src/i18n/index.ts`).
  Francés, alemán, italiano y árabe se eliminaron en octubre de 2026 (la
  revisión del cliente encontró errores de gramática); sus URLs antiguas
  redirigen a `/en` (`vercel.json`).
- Español en la raíz (`/`, `/nosotros`, `/servicios/...`); inglés con prefijo
  y URLs traducidas (`/en/about`, `/en/services/...`).
- Rutas, slugs e información de cada idioma: `src/i18n/index.ts`.
- Textos cortos: `tr("español", "English")` dentro de las funciones de `src/data/`.
- Contenido largo: `src/data/site.ts` / `site.en.ts` y `src/data/blogData.ts` /
  `blogData.en.ts`. **Si cambia un texto en español, actualice también el inglés.**

### SEO y analítica

- El HTML de cada ruta se pre-genera en el build (ver `docs/seo.md`). Por eso:
  - nada de `window`, `document`, `localStorage` ni `matchMedia` durante el
    render ni en el valor inicial de `useState` (úselos en `useEffect`);
  - un solo `<h1>` por página;
  - cada ruta nueva va en `getPageMeta` y `PUBLIC_ROUTES` (`src/seo/meta.ts`),
    con título (30–70 caracteres) y descripción (70–160) en español e inglés.
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
- Los envíos pasan por `sendLead()` (`src/lib/leads.ts`) → `api/contact.mjs` →
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
- Cifras: más de **58 años** (desde 1968), **176 países** (de destino, importación
  y exportación), **2.000+ representantes** (el cliente pidió "representantes",
  no "agentes internacionales") y **60.000+ toneladas** de menaje doméstico
  exportadas (`STATS` en `src/data/site.ts`). Las pruebas verifican que los
  textos coincidan con `STATS`. En el inicio se muestran como carrusel con
  movimiento (`Stats.tsx`), una cifra a la vez (5 s cada una): al entrar, cada
  cifra cuenta desde 0 hasta su valor (`StatCounter`), desde que el carrusel se
  ve en pantalla. El HTML pre-generado y los lectores de pantalla llevan el
  valor completo.
- Embajadas atendidas: las 10 de `EMBASSIES`. En el mapa, solo esos destinos
  llevan `embassy: true`; los demás son destinos de las regiones donde opera
  (Suramérica, África y Asia excepto Irán y Rusia), definidos en
  `scripts/generate-world-map.mjs`.
- Política de datos (`PRIVACY` en `src/data/site.ts` y sus traducciones, página
  `/privacidad`): es un borrador pendiente de aprobación legal. El NIT
  (`CONTACT.nit`) está vacío hasta que el cliente lo entregue: no inventarlo. Si se pide un dato nuevo al visitante
  (cotizador, chat) o se agrega una herramienta que recoja datos, actualice la
  política en español e inglés. La versión en español es la oficial.
- El cotizador **no calcula precios** (la Lógica de Cotización no los define):
  perfila la solicitud y la envía por WhatsApp o correo.
- Lenguaje claro, sin tecnicismos (por ejemplo, "Vivir en el exterior" en vez
  de "Diáspora"). Trato de "tú".

## Diseño

- Paleta del Manual de Marca (bloque `@theme` de `src/styles/index.css`):
  azul `#272B7C`, naranja `#FF7619`, beige `#FAEED9`, violeta `#2F2959`,
  gris `#F0F6F6`, más sus derivados (`azul-900`, `tinta`, `texto`, `suave`,
  `linea`, `rojizo` `#E8401C`…). La lista blanca de colores está en `tests/unit/content.test.ts`:
  para usar un color nuevo, agréguelo ahí a propósito.
- Tipografías: IBM Plex Sans (títulos) y Montserrat (texto).
- **Fondo general de la página totalmente blanco** (pedido del cliente, octubre
  de 2026): sin franjas grises entre secciones ni manchas beige o naranja en la
  portada. El color va en los componentes (tarjetas, tablero del mapa, botones)
  y en los bloques de sección hechos a propósito (Cobertura en azul, Videos en
  violeta y la franja naranja de llamado a la acción); las páginas internas usan `PageHero` con la foto bien visible y tonos
  naranja a rojizo. En las páginas de servicio el panel de `PageHero` es blanco
  (`light`, con la franja naranja del corte) y la cabecera usa letras oscuras. El efecto de "velocidad" del brochure de referencia del
  cliente no se logra con capas sobre las fotos actuales (probado en octubre
  de 2026): debe venir en las fotos que entregue el cliente.
- Mapa del inicio (`WorldMap` sobre el panel azul de marca del `Hero`, el mismo
  del selector de servicios): países
  en blanco translúcido, **Estados Unidos iluminado** en naranja claro (capa
  `LAND_USA`, pedido del cliente), Colombia en naranja.
- Íconos: Bootstrap Icons (`<Bi n="..." />`).
- Chat: **sin degradados**, mismo estilo de los menús (cabecera azul sólida con
  el cuadrado naranja translúcido girado 45°, rótulo naranja en mayúsculas,
  opciones como lista con íconos en cuadros grises). La ventana de Zoho lo
  recibe de `src/styles/zoho-chat.css`.
- Las fotos actuales se reemplazarán cuando el cliente entregue nuevas: no
  cambiarlas por fotos de banco sin su aprobación.

## Chat (Zoho SalesIQ)

- **El chat del sitio es el widget de Zoho SalesIQ** (bot "Joelito" y asesores
  desde el panel de SalesIQ), con el diseño del sitio. **Nunca se menciona
  Zoho.** La cara y el nombre de Joel quedan como marca del chat (botón,
  invitación, avatar del bot). Detalle completo en `docs/chat-crm.md`.
- `src/lib/crmChat.ts` carga el script de Zoho una sola vez (con `import()`, en
  español y sin su botón) en la página aislada `public/chat-asesor.html`. **Se
  precarga al entrar** (`preloadCrmChat`, ventana lista y escondida, ya en una
  conversación) **solo si el visitante aceptó las cookies** o si el sitio no
  muestra el aviso; si no, se carga al abrir el chat.
- Al abrir: la ventana no se muestra hasta estar dentro de una conversación (no
  se ve el inicio de Zoho); si está vacía, se avisa la acción personalizada
  `abrir_chat_asesor` para que el bot salude (se configura en Zoho). Si Zoho no
  carga, la ventana del sitio ofrece WhatsApp y el formulario (respaldo).
- Lógica: `src/hooks/useAdvisorChat.ts`. Textos: `src/data/chat.ts`. Otros
  componentes abren el chat con `window.dispatchEvent(new Event("tp:open-chat"))`
  (`openChat()` en `components/layout/MenuLink.tsx`).
- **Diseño:** `src/styles/zoho-chat.css` se inyecta dentro de la ventana de
  Zoho; `public/zoho-salesiq.css` es su copia para subir en Zoho (se genera del
  original; la prueba de `crmChat` avisa si difieren). Tamaño y lugar de la
  ventana: `#tp-zoho-frame` en `src/styles/index.css`. Solo colores de la marca.
- **Zoho nunca se carga en las páginas del sitio:** vive en
  `public/chat-asesor.html`, con su propia CSP en `vercel.json` (con los scripts
  en línea que Zoho exige). La CSP del sitio no autoriza nada de Zoho; no la
  relaje para Zoho.
- Las pruebas nunca cargan el Zoho real: lo simulan (`tests/e2e/fixtures.ts` lo
  reemplaza en todas las pruebas e2e).
