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
- `pnpm map` — regenera `src/data/worldMap.ts` (Bogotá y destinos),
  `src/data/worldGlobe.ts` (puntos de tierra del globo de la portada),
  `src/assets/images/mapa-lineas.svg` (mapamundi de líneas animado, fondo de la
  historia en Nosotros), su versión para fondo oscuro `mapa-lineas-noche.svg`
  (fondo animado de Cobertura en el inicio) y `src/data/colombiaMap.ts` (mapa de rutas de Mudanzas
  nacionales)
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
  chunk `vendor` (`vite.config.ts`), GSAP y Lenis en el chunk `motion` (con
  `import()`, ver "Movimiento") y el chat de Zoho con `import()`.
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
│   └── NotFoundPage.tsx        404
├── components/
│   ├── layout/             Layout (cabecera + contenido + pie + chat), SeoHead,
│   │                       Analytics (rastreador + aviso de cookies), Header,
│   │                       megamenús (MegaMenuPanel), menú móvil, panel de
│   │                       soporte, Logo, franja de idiomas (LangBar), buscador
│   │                       (SiteSearch) y Footer
│   ├── sections/           Secciones compartidas: PageHero, CtaBand y WorldLines
│   │                       (fondo de mapamundi de líneas animado)
│   ├── home/               Una sección del inicio por archivo (Hero, Stats,
│   │                       Services, Levels, Coverage, Process,
│   │                       AboutTeaser, Gallery, QuoteSection, BlogSection,
│   │                       FaqSection, VideoShorts, ContactSection), el mapamundi
│   │                       (Globe y CountryCard, ya sin montar), el
│   │                       cotizador (QuoteWizard + QuoteFields)
│   ├── services/           ServiceMapPanel (panel del mapa del encabezado) con ColombiaRoutesMap
│   │                       (Colombia), ServiceGlobe (Bogotá, del globo de la portada) o
│   │                       WorldRoutesMap (el mundo, mapamundi plano en relieve)
│   ├── chat/               Chat (Zoho SalesIQ): AdvisorChat (botón, invitación y
│   │                       ventana de respaldo), ChatLauncher, ChatTeaser,
│   │                       ChatBubble, ChatOptions, ChatAvatar
│   └── ui/                 Primitivas: Bi (íconos), btn, Eyebrow, SectionHead,
│                           Reveal, SweepIn, PhotoFrame (marco de foto con pestaña),
│                           StatValue, Checks y medidas de sección (layout.ts)
├── data/                   CONTENIDO del sitio (fuente única de verdad)
│   ├── site.ts (+ .en)                   Contacto, cifras, servicios,
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
│   ├── motion.ts           Motor de movimiento: GSAP (ScrollTrigger, SplitText) y Lenis; solo vía useMotion
│   ├── smoothScroll.ts     scrollToY / scrollToElement: scroll por código que respeta a Lenis
│   ├── colombiaRoutes.ts   Mapa de Mudanzas nacionales: curvas de las carreteras, camino más corto y viaje del camión
│   ├── search.ts           Motor del buscador
│   └── text.ts             Normalización de texto (sin tildes)
├── seo/                    site.ts (dominio, empresa, interruptor de indexación) y
│                           meta.ts (metadatos, hreflang, JSON-LD y rutas públicas)
├── hooks/                  useContent (useSite/usePosts), useAdvisorChat, useGlobe,
│                           useTruckTrip, useScrollToHash, useMotion (animaciones
│                           GSAP de un componente), usePageMotion (títulos, rótulos y
│                           botones magnéticos de toda página) y useInView
├── i18n/                   Idiomas: rutas y slugs traducidos, tr(), dict/<idioma>.ts
├── assets/images/          Imágenes importadas desde el código
└── styles/                index.css (tokens de marca, estilos globales y animaciones) y
                            zoho-chat.css y zoho-host.css (diseño del sitio dentro del chat de Zoho)
api/contact.mjs              Función de Vercel: formularios → Brevo → correo (docs/formularios.md)
public/                     Archivos servidos tal cual (favicon, brand/logo.png, brand/og-image.jpg y
                            chat-asesor.html: página aislada donde vive Zoho, con su propia CSP)
scripts/                    generate-world-map.mjs, generate-world-lines.mjs y generate-colombia-map.mjs (pnpm map), generate-bogota-map.mjs (pnpm map:bogota), fetch-country-photos.mjs (pnpm fotos), prerender.mjs (HTML por ruta, sitemap,
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
  y exportación), **2.000+ agentes y aliados estratégicos** (así lo pidió el
  cliente, octubre de 2026; ni "representantes" ni "agentes internacionales") y **60.000+ toneladas** de menaje doméstico
  exportadas (`STATS` en `src/data/site.ts`). Las pruebas verifican que los
  textos coincidan con `STATS`. En el inicio se muestran las cuatro a la vez
  en una barra compacta en azul marino (`Stats.tsx`, `azul-900`: cifras en
  blanco, sufijo `+`/`K+` en naranja, descripciones en blanco al 80 %, íconos en cuadros blancos; ya no en
  carrusel desde noviembre de 2026): al entrar, los dígitos de cada cifra ruedan como un odómetro hasta su
  valor (`StatOdometer`), desde que la barra se ve en pantalla, y al pasar el cursor cada una se
  levanta con sombra y franja naranja, como los logos de clientes. El HTML
  pre-generado y los lectores de pantalla llevan el valor completo.
- Embajadas atendidas: las 10 de `EMBASSIES`. En el inicio van en su propia
  cuadrícula, debajo de los logos de clientes, con su **logo** en grises (a
  color al pasar el cursor) y su nombre al lado ("Embajada de …";
  `EMBASSY_LOGOS`, pedido del cliente en noviembre de 2026): el de la Embajada de Francia en Colombia y, para
  las demás, el de su cancillería o gobierno o el emblema nacional (fuentes en
  `src/assets/images/clientes/embajadas/FUENTES.txt`). Son emblemas oficiales: el
  cliente debe confirmar que puede usarlos. En Nosotros siguen con su bandera
  (`EMBASSY_FLAGS`). Al agregar una embajada, agregue su logo y su bandera en
  `src/data/clientLogos.ts`. En el mapa, solo esos destinos
  llevan `embassy: true`; los demás son destinos de las regiones donde opera
  (Suramérica, África, Asia excepto Irán y Rusia, y Oceanía), definidos en
  `scripts/generate-world-map.mjs`.
- Política de datos (`PRIVACY` en `src/data/site.ts` y sus traducciones, página
  `/privacidad`): es un borrador pendiente de aprobación legal. El NIT
  (`CONTACT.nit`) está vacío hasta que el cliente lo entregue: no inventarlo. Si se pide un dato nuevo al visitante
  (cotizador, chat) o se agrega una herramienta que recoja datos, actualice la
  política en español e inglés. La versión en español es la oficial.
- El cotizador **no calcula precios** (la Lógica de Cotización no los define):
  perfila la solicitud y la envía por WhatsApp o correo.
- Menús (noviembre de 2026, revisión del cliente): sin menú "Cobertura" (la sección
  azul del inicio sigue) y sin la página "Maestría Transpack" (`/videos` y
  `/en/videos` redirigen al inicio en `vercel.json`); los Shorts del inicio siguen.
  Del blog se retiró el artículo "Elegancia en tránsito" (premium): el cliente dijo
  que sus términos no eran correctos. Su URL redirige al blog del inicio.
- Lenguaje claro, sin tecnicismos (por ejemplo, "vivir en el exterior" en vez
  de "diáspora").
- Trato: de "tú" en general, pero de **"usted/su"** en las páginas de servicios
  (mudanzas locales, nacionales e internacionales, bodegaje, embalaje, trámites
  internacionales —antes "Gestión documental y aduanera", nov. 2026; su rótulo es "Documentación aduanera"; la URL
  sigue siendo `/servicios/gestion-aduanera`—, movilidad corporativa y diplomático; `SERVICES` en `src/data/site.ts`)
  y en los textos del inicio que el cliente corrigió (niveles, cotizador, proceso). Pedido del cliente,
  noviembre de 2026: no mezclar "tú" y "su" en una misma frase ni en una misma
  sección.

- **Sin "Soluciones"** (noviembre de 2026): el menú y la sección del inicio
  "Soluciones" se quitaron. Movilidad corporativa (`/servicios/movilidad-corporativa`)
  y Diplomático (`/servicios/diplomatico`) son ahora servicios, con su página, en
  el menú "Servicios", el pie, el buscador y el sitemap; sus textos salen de las
  correcciones del cliente de noviembre de 2026 y del Modelo de Negocio (4.1 y 7).
  Residencial se descartó porque repetía Mudanzas locales y nacionales. Los
  enlaces viejos `/?segmento=…#soluciones` llevan al inicio.

## Diseño

### Dirección (noviembre de 2026)

- **Cambió el interlocutor del cliente.** El nuevo pide un sitio **más dinámico
  y más bonito**: movimiento, profundidad, color y transiciones cuidadas. Las
  decisiones de diseño del interlocutor anterior (continentes negros, "sin
  azules", fondo totalmente blanco, sin degradados ni manchas de color, chat
  sin degradados, etc.) **ya no son obligatorias**: son historia y se pueden
  cambiar cuando mejoren el sitio, sin pedir permiso por eso. Lo que se cambie,
  documéntelo aquí.
- **Sigue fijo** (no es gusto del cliente, es marca o calidad técnica):
  - Paleta y tipografías del Manual de Marca (abajo). Se pueden usar
    transparencias, degradados y derivados de esos colores. Un color nuevo en
    hexadecimal va a propósito en la lista blanca de `tests/unit/content.test.ts`.
  - Accesibilidad: toda animación respeta `prefers-reduced-motion` (versión
    quieta o sin movimiento), el texto mantiene buen contraste y lo decorativo
    lleva `aria-hidden` y `pointer-events: none`.
  - Rendimiento: JS principal por debajo de 450 KB. Lo pesado va aparte
    (`import()` o archivos, como `mapa-lineas.svg`), las animaciones se pausan
    fuera de pantalla cuando cuestan, y se prefiere CSS/SVG a librerías.
  - Pre-generación (SEO): nada de `window` durante el render.
  - Las fotos del cliente se reemplazan solo con fotos que él entregue o apruebe
    (no fotos de banco).

### Marca y base

- Paleta del Manual de Marca (bloque `@theme` de `src/styles/index.css`):
  azul `#272B7C`, naranja `#FF7619`, beige `#FAEED9`, violeta `#2F2959`,
  gris `#F0F6F6`, más sus derivados (`azul-900`, `azul-700`, `tinta`, `texto`,
  `suave`, `linea`, `rojizo` `#E8401C`, `resaltado` `#1800AD`, el azul noche
  `#0D0F33`…). La lista blanca de colores está en `tests/unit/content.test.ts`.
- Tipografías: IBM Plex Sans (títulos) y Montserrat (texto).
- Íconos: Bootstrap Icons (`<Bi n="..." />`).
- Alineación del texto: los párrafos se justifican solo en pantallas anchas
  (1024 px+, regla base de `src/styles/index.css`); en celular y tableta siguen
  la alineación de su bloque, y las listas nunca se justifican. Los textos
  cortos o en columnas angostas (tarjetas, subtítulos, entradillas, lemas en
  mayúsculas) llevan `text-start` en el propio elemento; los centrados,
  `text-center`. Los párrafos del header van siempre a la izquierda (`header p`).
- Fondo de página blanco por defecto, con bloques de color hechos a propósito
  (Cobertura en azul, Videos en violeta, la franja naranja de llamado a la
  acción, la foto a pantalla completa de la portada). **Ritmo del inicio**
  (nov. 2026, para quitar el exceso de blanco): las secciones alternan blanco,
  gris hielo (`bg-gris`: Niveles, Proceso, Cotizador) y azul (cifras en panel
  `azul-900`, Cobertura, Blog en `bg-azul` con tarjetas blancas); nunca dos
  seguidas con el mismo fondo (orden en `LandingPage.tsx`). Sobre gris, el aro
  de los rombos de `StepsTimeline` toma `--steps-ring`. Fondos con movimiento
  sutil (como `WorldLines`) son bienvenidos donde una sección se vea estática.

### Movimiento (noviembre de 2026)

Referencias del cliente: terminal-industries.com y unitedcarriers.com. El
inicio se mueve con el scroll y responde al cursor; el fondo sigue mayormente
blanco.

- **Motor:** `src/lib/motion.ts` (GSAP 3 con ScrollTrigger y SplitText, y Lenis
  para el scroll inercial) se carga con `import()` después de la primera
  pintura (`Layout`, en un momento libre del navegador) y va en el chunk
  `motion`. Ningún componente lo importa directamente: se usa con
  **`useMotion(ref, (m, el) => …)`** (`src/hooks/useMotion.ts`), que corre la
  configuración en un `gsap.context` limitado al elemento y la deshace al
  desmontar (devuelva una función para quitar listeners). Utilidades del motor:
  `reveal()` (entrada escalonada con `opacity`, nunca `autoAlpha`: lo que espera
  debe poder enfocarse con el teclado), `splitReveal()` (líneas desde una
  máscara), `tilt()` (inclinación y resplandor `.spotlight` con el cursor),
  `parallax()` (desplazamiento atado al scroll), `drawLine()` (línea que se
  dibuja con el scroll), `velocityMarquee()` (marquesina que se acelera con la
  velocidad del scroll) y `ENTER` (cuándo entra un elemento).
- **Fijar con ScrollTrigger (`pin`):** nunca fije un elemento que React monta o
  quita directamente (una `section` de la página): ScrollTrigger lo envuelve en
  un `pin-spacer` y, al salir de la página, React falla con `removeChild` y deja
  la pantalla en blanco. Fije un `div` interno (ver "Otros servicios" en
  `ServiceDetailPage`; lo vigila una prueba en `tests/e2e/flows.spec.ts`).
- **Transición entre páginas:** `PageCurtain` (`src/components/layout/`,
  montado en `Layout`): al cambiar de ruta, un telón azul con el cuadrado
  naranja se retira hacia arriba (`.page-curtain`, solo CSS). No sale al
  entrar al sitio, con `#anclas` ni con movimiento reducido. `BrowserRouter` no
  admite las View Transitions de React Router, por eso es CSS.
- **GSAP y transiciones CSS no se mezclan:** un elemento que GSAP anima (opacidad,
  posición, giro) no puede tener una transición CSS sobre esas mismas
  propiedades (`transition-all`): al recalcular posiciones, ScrollTrigger lee
  el valor a medio camino y el elemento puede quedar invisible (pasó con los
  logos de clientes). Limite la transición a lo que usa el efecto al pasar el
  cursor, p. ej. `transition-[translate,border-color,box-shadow]`.
- **Regla anti-parpadeo:** el HTML pre-generado lleva todo visible y completo.
  Lo de arriba de la portada se anima con CSS (`.line-mask`, `animate-*`), sin
  esperar al motor; GSAP anima solo lo que entra con el scroll
  (`gsap.from` + ScrollTrigger). Con movimiento reducido, `useMotion` no hace
  nada, Lenis no se crea y las animaciones CSS se apagan.
- **Lenis:** el scroll por código pasa por `scrollToY` / `scrollToElement`
  (`src/lib/smoothScroll.ts`), nunca `window.scrollTo` directo (Lenis lo
  desharía). Se detiene solo cuando un modal bloquea el scroll
  (`body.style.overflow = "hidden"`); no suaviza dentro de diálogos ni de lo
  marcado con `data-lenis-prevent`.
- **Encabezado de las páginas internas** (`PageHero`): los hijos del bloque de
  texto con `.hero-stagger` entran uno tras otro y el `h1` lleva su texto en
  `.line-mask` (CSS, sin esperar al motor). La foto (o el mapa) llega con un
  **barrido de color** (`.hero-reveal`, CSS; pedido del cliente, nov. 2026, en
  vez de la caja que caía y rebotaba): una franja naranja y un panel azul
  cruzan el marco con `clip-path` desde el lado de `reveal` (`imageReveal` en
  `SERVICES`; izquierda por defecto), la foto aparece detrás acercándose y
  pasando de borrosa a nítida (`.hero-img-in`), completa y con las cuatro
  esquinas redondeadas; al terminar, la pestaña brota rápido desde su esquina
  con un pequeño rebote (`hero-tab-pop`) y la esquina de la foto vuelve a ser
  recta bajo ella. La
  foto fundida (`imageBlend`) solo se acerca y se enfoca (`.hero-blend-in`).
  Ya quieta, la foto sigue un poco al cursor (solo con mouse) y, al bajar, se
  corre y se acerca: GSAP mueve `--hero-mx`/`--hero-my`/`--hero-py`/`--hero-ps`,
  que usan las propiedades `translate` y `scale`, aparte del `transform` del
  acercamiento de `PhotoFrame`. Flota detrás del texto el cuadrado naranja de
  la marca.
- **En todas las páginas** (`usePageMotion`, montado en `Layout`): los `h2` de
  `main` entran línea por línea, los chevrons ››› de cada `Eyebrow` se encienden
  en secuencia y los enlaces con `data-magnetic` siguen un poco al puntero.
  Excluya algo con `data-motion="off"`.
- **Cabecera:** se esconde al bajar (pasados 480 px, salvo en saltos grandes
  como ir a una sección) y vuelve al subir; línea naranja de avance de lectura
  arriba del todo. **Sin franja de fondo arriba** (nov. 2026): el logo y las acciones
  (buscar y soporte en círculos de vidrio, "Cotice su mudanza") flotan sobre la
  página, y Nosotros · Servicios · Blog · Contacto van en una **píldora de
  vidrio** (`rounded-full`, `backdrop-blur-[10px]`, borde sutil). Arriba en el
  inicio va sobre la foto: vidrio blanco al 10 %, letras blancas, logo con
  anillo blanco y franja de idiomas sin fondo (`LangBar overlay`). En las
  demás páginas y al bajar: vidrio blanco al 70 % con letras oscuras. **Al
  bajar** (nov. 2026, pedido del equipo) aparece detrás una **franja blanca
  translúcida** de lado a lado (`bg-white/75`, desenfoque y línea fina abajo)
  para que la cabecera se distinga sobre cualquier sección, también las
  oscuras; es la única barra: la píldora y los círculos de buscar y soporte
  quedan planos sobre ella (sin borde, fondo ni sombra; nada de barra doble).
  Arriba en la portada no hay franja. (Se probó y descartó un vidrio
  azul noche que se adaptaba a las secciones oscuras.) Con el menú móvil
  abierto, la cabecera es blanca.
- **Botones:** la flecha `bi-arrow-right` se desliza al pasar el cursor; el
  primario lleva un brillo que lo cruza.
- **Inicio, sección por sección:** titular del Hero por líneas (CSS) y
  marquesina de destinos "Desde Bogotá" (`DESTINATIONS`); logos de clientes
  escalonados; cifras tipo **odómetro** (`StatOdometer`: en el servidor solo el
  dígito final, en el navegador columnas que ruedan); **explorador de
  servicios** (`Services.tsx`: lista numerada, foto grande fija que entra con
  barrido, avance automático cada 6 s con barra, pausa con el cursor o fuera de
  pantalla; en celular, todos desplegados con su foto); Niveles con números que
  se descubren y tarjetas con `tilt`; Cobertura con parallax, odómetro y
  marquesina gigante de continentes; Proceso con la línea que se dibuja con el
  scroll (escritorio; `StepsTimeline`, el mismo de los servicios); Quiénes somos con parallax y "1968" en odómetro; Galería
  en dos filas que se desplazan en sentidos opuestos; tarjetas del blog con
  `tilt`; FAQ que abre con animación de altura (`::details-content`); pasos del
  cotizador que entran deslizándose; Shorts que entran en abanico; franja
  naranja con marquesina gigante que se acelera con la velocidad del scroll y
  barrido de luz; pie con el **mapa de puntos** (`mapa-puntos.svg`, de
  `pnpm map`) con los destinos titilando.
- **Pruebas e2e:** con el Hero fijo y la cabecera que se esconde, haga clic en
  coordenadas (`page.mouse.click`) cuando el clic de un elemento desplazaría la
  página, y suba un poco antes de usar la cabecera tras bajar
  (`tests/e2e/flows.spec.ts`).

### Piezas visuales reutilizables

- **`PhotoFrame`** (`src/components/ui/PhotoFrame.tsx`, estilos `.photo-frame`
  y `.frame-tab-*` en `@layer components` de `src/styles/index.css`): marco de
  foto estilo "bento", con esquinas redondeadas, sin sombra, y una **pestaña
  invertida** en una esquina (abajo a la izquierda `bl` o arriba a la derecha
  `tr`) del color del fondo que la rodea (`--frame-bg`, blanco por defecto; p.
  ej. `[--frame-bg:var(--color-azul)]` sobre azul). La pestaña va vacía
  (`tab`, solo el recorte) o con un rótulo. Al pasar el cursor por el marco o
  por su tarjeta (`group`), la foto se acerca a 1.03×. Se usa en `PageHero`
  (pestaña con ícono y nombre del servicio), la foto y el carrusel de las
  páginas de servicio, las tarjetas del blog (la categoría va en la pestaña),
  los artículos relacionados, Quiénes somos, el CEO y Certificaciones en
  Nosotros. Ya no hay franjas diagonales naranja sobre las fotos.
- **`SweepIn`** (`src/components/ui/SweepIn.tsx`): el barrido de color de los
  encabezados (`.hero-reveal`, ver "Movimiento") para una foto más abajo en la
  página: espera en pausa (`.sweep-on-view`) hasta entrar en pantalla; `delay`
  escalona varias fotos (`--sweep-delay`). La foto lleva la clase `hero-img-in`.
  En Certificaciones de Nosotros. Reemplazó a `DropIn` (la caja que caía y
  rebotaba), que se eliminó en noviembre de 2026 porque al cliente no le
  gustaba. `imageBlend` (`.photo-blend`) funde la foto del encabezado con el
  fondo; hoy ningún servicio lo usa.
- **`ShippingPhoto`** (`src/components/services/ShippingPhoto.tsx`, nov. 2026):
  foto del encabezado de **todos los servicios con foto** (no Mudanzas
  locales, nacionales ni internacionales, que llevan el panel del mapa; ver
  "Encabezado bento con mapa"): `PhotoFrame` con la pestaña abajo a la
  izquierda (ícono y nombre del servicio, con su animación), **doble marco**
  azul desplazado detrás (10 y 20 px) y una **etiqueta de envío** compacta
  (138 px de ancho, un 40 % menos que la primera; nov. 2026) arriba a la
  izquierda, girada, con un sello; en Diplomático y Movilidad corporativa va
  abajo a la derecha para dejar visible al equipo
  (`LABEL_BOTTOM_RIGHT` en `ShippingPhoto.tsx`). Los datos de la etiqueta son de muestra y van
  con el servicio (`shippingLabelText(tr, slug)` en `src/data/pages.ts`: p.
  ej. Bogotá → Madrid por vía marítima en internacionales, orden de bodegaje en
  Bodegaje, guacal a medida en Embalaje); al agregar un servicio, agregue su
  etiqueta. Es decorativa (`aria-hidden`). `PageHero` la usa con
  `shipping={service.slug}`.
- **Fondos decorativos fijos** (`RouteLines` y `IsoCubes` en
  `src/components/layout/`): son solo fondo, con `-z-10`, detrás de todo el
  contenido; textos, tarjetas e imágenes siempre quedan encima. Se ven donde la
  sección no tiene fondo propio: las secciones blancas no llevan `bg-white`
  (el blanco es el del `body`); no se lo agregue o las taparía.
- **`WorldLines`** (`src/components/sections/WorldLines.tsx`): fondo de
  mapamundi de líneas (costas, fronteras y rutas desde Bogotá en azul al 7–13 %)
  con destellos naranja y azul que las recorren lento y sin parar. Es un SVG
  aparte con su propia animación CSS (`src/assets/images/mapa-lineas.svg`,
  generado por `scripts/generate-world-lines.mjs` en `pnpm map`), sin JS. En el
  bloque de historia de Nosotros, con un velo blanco radial encima (más
  fuerte bajo el texto) para que las letras se lean sin perder el mapa. Las
  rutas son arcos sobre el mapa plano (no círculos máximos, que cruzaban el
  mapa de borde a borde). **Versión noche** (`mapa-lineas-noche.svg`,
  nov. 2026): costas en blanco tenue, rutas en naranja, destinos titilando y
  Bogotá con onda; es el fondo de **Cobertura** en el inicio (`Coverage.tsx`),
  en lugar de la foto, que no tenía resolución para ocupar media pantalla.
- **Certificaciones y membresías** (`Certifications`, al pie de Contacto en el
  inicio; nov. 2026): LACMA, IAM y PAIMA en fichas con el estilo de los logos de
  clientes (`TILE` y `TileStripe`, exportados de `Hero.tsx`), que entran
  escalonadas. Logos: LACMA es el sello del cliente e IAM el oficial de
  iamovers.org (`cert-iam.svg`). PAIMA va como logotipo de texto hasta que el
  cliente entregue su logo (su sitio no respondía).
- Clientes y embajadas del inicio (`Hero`): dos cuadrículas fijas con todos los
  logos, en gris; al pasar el cursor el logo toma sus colores y su ficha se
  levanta con sombra y la franja naranja.

### Portada (`Hero`)

- **Foto a pantalla completa** (nov. 2026; reemplazó al mapa animado):
  `src/assets/images/img-header.jpg`, el embalador con una vajilla (original en
  `RecursosTranspack/Imagenes/img-header-vajilla.png`). La foto nítida empieza
  bajo la cabecera (para que el menú no tape al embalador) y, en escritorio, al
  28 % del ancho, con el borde izquierdo fundido (`.hero-photo-mask`); detrás, la
  misma foto desenfocada llena todo el Hero (`min-h-[100svh]`), también detrás
  de la cabecera transparente. Degradado oscuro (azul noche `#0D0F33`
  translúcido) desde la izquierda, hasta un 56 % del ancho, y desde arriba; en
  celular, uno vertical más parejo. Para reemplazarla: horizontal, idealmente
  16:9 y 2400 × 1350 px, con el sujeto centrado y aire arriba. Titular, texto,
  rótulo "Desde 1968", botón
  secundario (`btn.ghost`) y marquesina van en blanco. El `h1` usa
  `text-white!`: la regla base de `h1` en `index.css` no está en una capa y
  le gana a las utilidades.
- **Mapa animado (retirado de la portada):** `Globe`, `useGlobe`,
  `src/lib/globe.ts` y `CountryCard` siguen en el proyecto pero no se montan
  en ninguna página. Su historia (Bogotá con líneas a las localidades, Colombia
  y el mundo, gris sobre blanco) está en el historial de git.

### Páginas internas

- `PageHero`: texto a la izquierda sobre blanco (la cabecera usa letras
  oscuras) y, a la derecha, la foto en un `PhotoFrame` con pestaña (en los
  servicios, con su ícono y nombre); en celular la foto va arriba. Movimiento
  en "Movimiento".
- **Encabezado bento con mapa** (nov. 2026; `heroMap` en `SERVICES` →
  `PageHero` con `backdrop`): Mudanzas locales (`"bogota"`), nacionales
  (`"colombia"`) e internacionales (`"mundo"`). Mapa y foto van **separados y
  nítidos**: a la derecha, el panel claro del mapa (`ServiceMapPanel`, gris
  hielo con borde suave, a tono con el mapa de la portada en gris sobre blanco;
  los tres mapas en la misma línea visual, ver abajo) con una chapa de vidrio arriba ("Bogotá
  · 20 localidades", "Colombia · 14 ciudades", "Desde Bogotá · 176+ países",
  este último de `STATS`) y la leyenda; la foto del servicio, como una tarjeta
  más pequeña con borde blanco y sin pestaña, montada sobre la esquina inferior
  izquierda del panel. El panel entra con `.hero-blend-in`, la tarjeta con el
  barrido (`.hero-reveal`) y, al bajar, sube más rápido que el panel
  (`[data-hero-card]`). En celular y tableta el panel va arriba y la tarjeta se
  monta en su esquina. Reemplazó a una composición en capas con la foto
  fundida sobre el mapa (máscara y velo blanco), descartada porque ensuciaba
  foto y mapa. Bogotá es `ServiceGlobe` (el motor del globo de la
  portada: `focusScene`/`focusStill` en `src/lib/globe.ts` y
  `useGlobe(labels, focus)`, solo ese tramo de la historia en bucle; se carga
  aparte con `import()`); Colombia es `ColombiaRoutesMap fill`. **El mundo**
  (nov. 2026; el globo no le gustó al cliente) es `WorldRoutesMap`: mapamundi
  plano en relieve en la **línea visual del mapa de Bogotá**, que sí le gustó
  (`mapa-mundo-relieve.svg`, de `pnpm map`: continentes grises con paredes,
  fronteras blancas, Colombia en azul, arcos naranja desde Bogotá con
  destellos), con la casita naranja en Bogotá y un punto azul por destino
  (`src/data/worldLines.ts`, generado). Tocar cerca de un punto abre su ficha
  (`CountryCard`; el destino más cercano al toque, porque en Europa están muy
  juntos) y, al pasar el cursor, se ve su nombre. Mientras hay una ficha
  abierta, la tarjeta de la foto del servicio se desvanece para no taparla
  (`group-has-[[role=dialog]]` en `PageHero`).
- **Encabezado "split" de los servicios con mapa** (Mudanzas locales,
  nacionales e internacionales: `heroLayout: "split"` en `SERVICES` →
  `PageHero split`). **Desde el 26 de nov. de 2026** (pedido del cliente: "la
  foto es la protagonista", con la misma secuencia de diseño de los servicios
  sin mapa): la **foto a la derecha**, con el mismo marco de los demás servicios
  (`ShippingPhoto`: pestaña, doble marco azul y etiqueta de envío), y el **mapa
  de fondo detrás del texto**, en la mitad izquierda (`ServiceMapPanel bare`,
  al 80 % de opacidad, decorativo: `aria-hidden`, `inert` y sin eventos del
  puntero; por eso el mapa del mundo ya no abre fichas en el encabezado). El
  texto va en una tarjeta de vidrio blanco **más transparente** (`bg-white/60`,
  sin desenfoque; antes `/80` con desenfoque) para que se vea el mapa. En
  celular, la foto arriba y el texto con el mapa detrás debajo. Antes: la foto a
  sangre en los 2/3 izquierdos con la tarjeta encima y el mapa libre en el
  tercio derecho. Bogotá se agranda con `BARE_SCALE`; los nombres de las
  localidades van junto al punto al que llega su línea (`plain`). El crédito de
  IDECA, que exige la licencia, va en el pie de página (`mapCredit` en
  `footerText`). El diseño "bento" (panel con la foto montada) sigue en
  `PageHero` para un servicio con mapa sin `heroLayout`.
- **Los tres mapas de los servicios** (Mudanzas locales, nacionales e
  internacionales; nov. 2026, pedido del equipo: "que no sea un sancocho")
  usan **los mismos elementos gráficos**, tomados del mapa de Bogotá (el que le
  gustó al cliente; colores en `src/lib/globe.ts`): tierra en gris claro
  `rgb(214,219,229)` con paredes en relieve (`WALL_DARK`/`WALL_LIGHT`),
  vecinos o continentes en gris, fronteras blancas, rutas naranja punteadas o
  la estela naranja, Bogotá con la casita naranja, destinos y ciudades en
  puntos azules con borde blanco y nombres en azul (IBM Plex Sans) con halo
  blanco, sobre el panel gris hielo. Un mapa nuevo debe seguir esta lista.
- Páginas de servicio (`ServiceDetailPage`, nov. 2026, con la dinámica del
  inicio): en "Cómo lo hacemos" el texto queda fijo en escritorio mientras pasa
  la lista "Qué incluye", cuyos ítems entran escalonados y su ✓ se dibuja
  (trazo SVG `data-check` en `Checks`); las cajas de compromiso y nota entran
  con su franja naranja. Los pasos van en `StepsTimeline` (tono oscuro sobre
  azul, con `pin`): en escritorio la sección queda fija mientras se baja y solo
  sigue cuando la línea llegó al último paso (pedido del cliente, nov. 2026;
  unas 0,45 pantallas de scroll por paso). Se fija el `div` `data-steps-pin`,
  no la sección. En el inicio (`Process`) los pasos no se fijan. La guía de términos (`ServiceGuide`) lleva tarjetas con `tilt`. El
  carrusel de Embalaje usa `velocityMarquee` (se detiene con el cursor y, con
  movimiento reducido, se desliza a mano). "Otros servicios" son tarjetas con
  la foto de cada servicio: en escritorio la fila queda fija y se desplaza de
  lado con el scroll; en celular se desliza con el dedo. La página se arma de
  nuevo al pasar de un servicio a otro (`key` con el slug).
- Mudanzas nacionales (`/servicios/mudanzas-nacionales`): en el panel del
  encabezado (`heroMap: "colombia"`, ver "Encabezado bento con mapa"), un
  **mapa de Colombia con un camión** (`ColombiaRoutesMap`, en SVG): silueta
  exacta (Natural Earth 1:10m), las 14 ciudades del recorrido de la portada y
  carreteras por los pueblos reales de cada troncal
  (`scripts/generate-colombia-map.mjs`, `pnpm map`). Sin círculo ni mar, en
  la línea visual del mapa de Bogotá (nov. 2026, ver "Los tres mapas de los
  servicios"): Colombia en gris claro con paredes en relieve, vecinos en gris
  que se desvanece, fronteras blancas, ciudades en puntos azules y nombres en
  azul; la casa del origen en naranja y la del destino en azul (antes: un
  círculo "noche" con mar azul marino y Colombia en lavanda). Un camión azul y blanco viaja de una ciudad a otra por el
  camino más corto (al azar, sin repetir sus últimas 6, `RECENT`), con estela
  naranja y brillo; la casa del destino cae con rebote y aviso "Próximo
  destino", al llegar salta con una onda y "¡Llegamos a …!" (`.map-*` en
  `src/styles/index.css`; textos en `serviceDetailText` de `src/data/pages.ts`;
  lógica en `src/lib/colombiaRoutes.ts` y `src/hooks/useTruckTrip.ts`). Pausa
  fuera de pantalla; con movimiento reducido, el viaje ya hecho sin avisos.
- Nosotros (`NosotrosPage`, nov. 2026, con la dinámica del inicio): las cifras
  son la barra del inicio (`Stats`, con `className` para montarla sobre el borde
  del encabezado); la línea de tiempo de la historia se dibuja con el scroll y
  cada hito se enciende (rombo azul → naranja; GSAP reemplaza el `rotate-45`,
  por eso la animación incluye `rotation: 45`), con el año de fundación
  gigante en contorno y parallax abajo a la derecha; misión, visión y valores
  (estos en abanico) entran y se inclinan hacia el puntero (`tilt` +
  `.spotlight`); logos y banderas entran escalonados y cada logo toma sus
  colores al pasar el cursor; las fotos de Certificaciones llegan con
  `SweepIn` y el sello LACMA se "estampa".
- Chat: mismo estilo de los menús (cabecera azul con el cuadrado naranja
  translúcido girado 45°, rótulo naranja en mayúsculas, opciones como lista con
  íconos en cuadros grises). La ventana de Zoho lo recibe de
  `src/styles/zoho-chat.css`.

## Chat (Zoho SalesIQ)

- **El chat del sitio es el widget de Zoho SalesIQ** (bot "Joel" y asesores
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
