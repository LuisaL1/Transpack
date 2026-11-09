# Transpack · Sitio web

Sitio corporativo de Transpack S.A.S. (mudanzas locales, nacionales e
internacionales, bodegaje y movilidad corporativa, Bogotá) hecho con React 19 +
Vite 8 + Tailwind CSS v4 + TypeScript + React Router 7, en español e inglés. Se
publica en GoDaddy (hosting Node.js conectado a GitHub, sin PHP; `docs/godaddy.md`).

## Comandos

- `pnpm dev` — servidor local en http://localhost:5173
- `pnpm build` — build de producción en `dist/`, con HTML pre-generado por ruta (SEO)
  y versiones comprimidas `.br`/`.gz` (`scripts/precompress.mjs`)
- `pnpm start` — sirve el build como en producción (`server/server.mjs`) en http://localhost:3000
- `pnpm typecheck` — verificación de tipos (estricta, sin variables sin uso)
- `pnpm lint` — ESLint (calidad, hooks de React, accesibilidad, seguridad)
- `pnpm test` / `pnpm test:e2e` — pruebas (ver `TESTING.md`)
- `pnpm check` — tipos + lint + pruebas + build + revisión SEO del build (`test:seo`);
  debe quedar en verde antes de cada commit
- `pnpm test:ga` — verifica Google Analytics con el ID real (necesita internet)
- `pnpm check:all` — lo anterior + auditoría de dependencias + extremo a extremo
- `pnpm map` — regenera `src/data/worldMap.ts` (Bogotá y destinos),
  `src/data/worldGlobe.ts` (puntos de tierra del globo de la portada) y
  `src/data/colombiaMap.ts` (mapa de rutas de Mudanzas nacionales)
- `pnpm videos` — regenera `src/data/youtubeVideos.ts` (videos y Shorts del canal de
  YouTube para "Maestría Transpack"; necesita internet). Córralo cuando el canal publique
- `pnpm map:bogota` — regenera `src/data/bogotaMap.ts` (las 20 localidades de Bogotá del
  inicio del mapa, de la capa oficial de Datos Abiertos Bogotá/IDECA, CC BY 4.0, con su
  crédito en el mapa; necesita internet)
- `pnpm fotos` — regenera `src/data/countryPhotos.ts` (foto de la capital de cada destino
  del mapa, desde Wikidata y Wikimedia Commons, y `src/data/sectorPhotos.ts`, el carrusel del inicio; necesita internet) y la hoja para que el
  cliente las apruebe (`RecursosTranspack/fotos-paises.html`). No descarga imágenes:
  guarda solo enlaces, autor y licencia. Córralo si cambian los destinos del mapa
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
│   ├── VideosPage.tsx          "/videos": Maestría Transpack (todos los videos del canal)
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
│   │                       (Globe, con CountryCard al tocar un país), el
│   │                       cotizador (QuoteWizard + QuoteFields)
│   ├── services/           ColombiaRoutesMap (mapa animado de Mudanzas nacionales)
│   ├── videos/             VideoCard (tarjeta de video de Maestría Transpack)
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
│   ├── clientLogos.ts      Logos de clientes y banderas de las embajadas (franja del inicio y Nosotros)
│   ├── youtubeVideos.ts    Videos y Shorts del canal (GENERADO con `pnpm videos`, no editar a mano)
│   ├── countryPhotos.ts    Foto de la capital de cada destino del mapa (GENERADO con `pnpm fotos`, no editar a mano)
│   ├── sectorPhotos.ts     Carrusel con que empieza el mapa: sectores exclusivos de Bogotá (GENERADO con `pnpm fotos`)
│   ├── bogotaMap.ts        Localidades de Bogotá (GENERADO con `pnpm map:bogota`, no editar a mano)
│   ├── worldMap.ts         Bogotá y destinos con longitud y latitud (GENERADO con `pnpm map`, no editar a mano)
│   ├── worldGlobe.ts       Puntos de tierra del globo (GENERADO con `pnpm map`; se carga aparte con import())
│   └── colombiaMap.ts      Silueta de Colombia, ciudades y carreteras (GENERADO con `pnpm map`, no editar a mano)
├── lib/                    Lógica pura, sin React
│   ├── analytics.ts        Google Analytics 4 (Consent Mode v2, páginas vistas, eventos, resetConsent)
│   ├── leads.ts            sendLead(): envía formularios a /api/contact
│   ├── advisorEvents.ts    Eventos del chat (ventana a la vista, conversación iniciada)
│   ├── crmChat.ts          Chat: widget de Zoho SalesIQ (precarga, apertura, diseño; docs/chat-crm.md)
│   ├── globe.ts            Globo de la portada: proyección, rutas, recorrido y dibujo en canvas
│   ├── colombiaRoutes.ts   Mapa de Mudanzas nacionales: curvas de las carreteras, camino más corto y viaje del camión
│   ├── search.ts           Motor del buscador
│   └── text.ts             Normalización de texto (sin tildes)
├── seo/                    site.ts (dominio, empresa, interruptor de indexación) y
│                           meta.ts (metadatos, hreflang, JSON-LD y rutas públicas)
├── hooks/                  useContent (useSite/usePosts), useAdvisorChat, useGlobe,
│                           useTruckTrip, useScrollToHash
├── i18n/                   Idiomas: rutas y slugs traducidos, tr(), dict/<idioma>.ts
├── assets/images/          Imágenes importadas desde el código
└── styles/                index.css (tokens de marca, estilos globales y animaciones) y
                            zoho-chat.css y zoho-host.css (diseño del sitio dentro del chat de Zoho)
api/contact.mjs              Función del servidor: formularios → Brevo → correo (docs/formularios.md)
api/ticket.mjs               Función del servidor: ticket del cotizador → Zoho Desk
server/server.mjs           Servidor de GoDaddy (`pnpm start`): páginas de dist/, cabeceras, redirecciones y /api;
                            sin dependencias. Ver docs/godaddy.md
hosting/headers.json        Cabeceras (CSP, HSTS, caché) y redirecciones que aplica server.mjs
public/                     Archivos servidos tal cual (favicon, brand/logo.png, brand/og-image.jpg y
                            chat-asesor.html: página aislada donde vive Zoho, con su propia CSP)
scripts/                    generate-world-map.mjs y generate-colombia-map.mjs (pnpm map), generate-bogota-map.mjs (pnpm map:bogota), fetch-youtube-videos.mjs (pnpm videos), fetch-country-photos.mjs (pnpm fotos), prerender.mjs (HTML por ruta, sitemap,
                            robots), generate-email-header.mjs (banner de los correos), precompress.mjs (.br/.gz del build), brevo-events.mjs
                            (diagnóstico de envíos)
docs/                       chat-crm.md, conversion-y-analitica.md, formularios.md, godaddy.md y seo.md
tests/                      unit/ (Vitest, incluye el servidor), security/ (revisión estática), seo/ (HTML del build), e2e/ (Playwright + axe)
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
  redirigen a `/en` (`hosting/headers.json`).
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
  y exportación), **2.000+ agentes y aliados estratégicos** (así lo pidió el
  cliente, octubre de 2026; ni "representantes" ni "agentes internacionales") y **60.000+ toneladas** de menaje doméstico
  exportadas (`STATS` en `src/data/site.ts`). Las pruebas verifican que los
  textos coincidan con `STATS`. En el inicio se muestran como carrusel con
  movimiento (`Stats.tsx`), una cifra a la vez (5 s cada una): al entrar, cada
  cifra cuenta desde 0 hasta su valor (`StatCounter`), desde que el carrusel se
  ve en pantalla. El HTML pre-generado y los lectores de pantalla llevan el
  valor completo.
- Embajadas atendidas: las 10 de `EMBASSIES`. En la franja de clientes del inicio se
  muestran con su **logo** en grises y su nombre al lado ("Embajada de …";
  `EMBASSY_LOGOS`, pedido del cliente en noviembre de 2026): el de la Embajada de Francia en Colombia y, para
  las demás, el de su cancillería o gobierno o el emblema nacional (fuentes en
  `src/assets/images/clientes/embajadas/FUENTES.txt`). Son emblemas oficiales: el
  cliente debe confirmar que puede usarlos. En Nosotros siguen con su bandera
  (`EMBASSY_FLAGS`). Al agregar una embajada, agregue su logo y su bandera en
  `src/data/clientLogos.ts`. En el mapa, solo esos destinos
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
  naranja a rojizo. En todas las páginas internas (servicios, Nosotros, blog,
  política, Maestría Transpack, 404) el panel de `PageHero` es blanco, con la franja
  naranja del corte, y la cabecera usa siempre letras oscuras. El efecto de "velocidad" del brochure de referencia del
  cliente no se logra con capas sobre las fotos actuales (probado en octubre
  de 2026): debe venir en las fotos que entregue el cliente.
- Portada (`Hero`): titular a la izquierda y, a la derecha, la **animación del
  mapa** (`Globe`, sin el selector "¿Qué necesitas hoy?", que se quitó en
  octubre de 2026). Continentes en negro sobre mar gris claro (sin azules;
  negro pedido en noviembre de 2026), con Colombia en `#1800AD` (`--color-resaltado`;
  antes naranja, cambio pedido en noviembre de 2026), Estados Unidos en un tono más claro
  del mismo color, las localidades de Bogotá con los colores de Colombia en la
  vista nacional (tono claro de ese color con bordes en el color pleno), sin globo
  alrededor (elegido por el cliente en noviembre de 2026; la que se
  toca o está bajo el puntero, en naranja), y
  las rutas y puntos en naranja. Historia en bucle (desde noviembre de 2026 empieza en Bogotá; velocidad
  1,6 / 1,2 / 1,5 ≈ 0,89× en `useGlobe`; en noviembre de 2026 se hizo un 50 % más lenta): un **carrusel de fotos de los sectores exclusivos de Bogotá** (El Nogal, Hacienda Santa Bárbara en Usaquén, la Séptima con 94, El Refugio y el Parque de la 93; unos 3 s cada una, con su nombre y crédito; reemplazó la foto de la casa a pedido del cliente, noviembre de 2026, para mostrar los sectores de estratos 5 y 6 de sus clientes; `SECTORS` en `scripts/fetch-country-photos.mjs` → `src/data/sectorPhotos.ts`, cargadas desde Wikimedia como las demás) → la última se cierra
  en **Bogotá y sus 20 localidades** (unos 24 s; se pueden tocar; tres camiones iguales al de Mudanzas
  nacionales salen de Puente Aranda, la sede, uno tras otro, y entre los tres pasan, despacio, por todas
  menos Sumapaz, que queda fuera del mapa, con una estela naranja que se desvanece; frenan un momento en
  cada una, que se oscurece poco a poco con una onda azul. Cada camión termina, en un momento distinto,
  en una de las de clientes exclusivos, estratos 5 y 6 (Usaquén, Chapinero y Suba, `FINE`): se detiene
  más, la localidad se pone naranja con el aviso "Zona exclusiva" y queda en naranja suave con una
  estrella junto al nombre. Rutas y tiempos en `TRUCK_ROUTES` de `src/lib/globe.ts`, pedido del cliente
  en noviembre de 2026; solo las
  localidades sobre el fondo de la página, sin el globo, y el sur rural se desvanece
  hacia abajo: pedido del cliente, noviembre de 2026) → la cámara se aleja hasta Colombia de cerca y rutas desde Bogotá a las principales
  capitales de departamento (`CITIES`, unos 8 s) → por continente
  (América con toda Latinoamérica; Europa con sus 10 países principales, el resto
  solo sombreado; África y Asia), todas las rutas con el mismo estilo → globo
  girando con todos los destinos → vuelve la primera foto del carrusel. Ciudades y destinos: `scripts/generate-world-map.mjs`
  (`pnpm map`); nombres de capitales en `mapText` de `src/data/home.ts`. Lógica y
  dibujo en `src/lib/globe.ts`, animación en `src/hooks/useGlobe.ts` (pausa fuera
  de pantalla; mapa fijo con movimiento reducido).
- Al tocar un país del mapa (o, al inicio, una localidad de Bogotá, o durante la
  parte de Colombia, una de sus ciudades)
  la animación se detiene y `CountryCard` muestra la foto de su sitio más representativo (el monumento de la capital, de la ciudad o de la localidad: Torre Eiffel, Coliseo, Monserrate, TransMiCable…; elegidas a mano en `OVERRIDES` de `scripts/fetch-country-photos.mjs`, pedido del cliente en noviembre de 2026; las que no están ahí usan la foto automática de su capital) (o de la
  ciudad), con autor y licencia (lo exige la licencia). Las fotos **no están
  en el proyecto** (así lo pidió el equipo, noviembre de 2026): se cargan desde
  `thumb.wikimedia.org` y `upload.wikimedia.org` (las ya pequeñas), los únicos
  dominios de Wikimedia que autoriza la CSP. Para
  cambiar la foto de un país, use `OVERRIDES` en `scripts/fetch-country-photos.mjs`
  y corra `pnpm fotos`. Están pendientes de que el cliente las apruebe.
- Mudanzas nacionales (`/servicios/mudanzas-nacionales`): en el encabezado, en
  vez de la foto (`heroMap` en `SERVICES`; `cargue.jpg` sigue como imagen para
  redes), un **mapa de Colombia con un camión** (`ColombiaRoutesMap`, en SVG):
  silueta exacta (Natural Earth 1:10m), las 14 ciudades del recorrido de la
  portada y carreteras que pasan por los pueblos reales de cada troncal
  (`scripts/generate-colombia-map.mjs`, `pnpm map`). Misma estética del globo
  (el cliente pidió en noviembre de 2026 que resaltara más): el mapa va en un
  círculo sobre fondo blanco, con el mar gris claro, sombra suave, los países
  vecinos en negro carbón, Colombia en un tono claro de `#1800AD` con borde pleno y las
  carreteras en gris oscuro; puntos en tinta, Bogotá en naranja. Un solo
  camión azul y blanco (visto desde arriba, para girar suave en las curvas sin
  voltearse) viaja de la ciudad donde está a otra por el camino más corto (al azar, pero
  sin volver a una de sus últimas 6 ciudades, `RECENT`, para que recorra todo el país),
  dejando una estela naranja gruesa, con resplandor y un brillo blanco que la
  recorre; origen (casa azul) y destino (casa naranja) llevan un marcador.
  Animaciones del viaje (`.map-*` en `src/styles/index.css`): la casa del
  destino cae con un rebote y sale el aviso "Próximo destino"; al llegar salta,
  se abre una onda y sale "¡Llegamos a …!"; luego la estela se desvanece, la
  casa del origen se encoge y la del destino pasa a azul (nuevo origen). Textos
  de los avisos en `serviceDetailText` (`src/data/pages.ts`). Arranca y frena
  suave, y el giro está suavizado y con velocidad máxima
  (`src/lib/colombiaRoutes.ts`, `src/hooks/useTruckTrip.ts`); pausa fuera de
  pantalla y, con movimiento reducido, muestra el viaje ya hecho sin avisos.
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
  `public/chat-asesor.html`, con su propia CSP en `hosting/headers.json` (con los scripts
  en línea que Zoho exige). La CSP del sitio no autoriza nada de Zoho; no la
  relaje para Zoho.
- Las pruebas nunca cargan el Zoho real: lo simulan (`tests/e2e/fixtures.ts` lo
  reemplaza en todas las pruebas e2e).
