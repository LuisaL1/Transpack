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
  historia en Nosotros) y `src/data/colombiaMap.ts` (mapa de rutas de Mudanzas
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
│   │                       (Globe, con CountryCard al tocar un país), el
│   │                       cotizador (QuoteWizard + QuoteFields)
│   ├── services/           ColombiaRoutesMap (mapa animado de Mudanzas nacionales)
│   ├── chat/               Chat (Zoho SalesIQ): AdvisorChat (botón, invitación y
│   │                       ventana de respaldo), ChatLauncher, ChatTeaser,
│   │                       ChatBubble, ChatOptions, ChatAvatar
│   └── ui/                 Primitivas: Bi (íconos), btn, Eyebrow, SectionHead,
│                           Reveal, DropIn, PhotoFrame (marco de foto con pestaña),
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
  en una barra compacta (`Stats.tsx`; ya no en carrusel desde noviembre de
  2026): al entrar, cada cifra cuenta desde 0 hasta su valor (`StatCounter`),
  desde que la barra se ve en pantalla, y al pasar el cursor cada una se
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
  (mudanzas locales, nacionales e internacionales, bodegaje, embalaje, gestión
  aduanera, movilidad corporativa y diplomático; `SERVICES` en `src/data/site.ts`)
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
  acción, el panel azul noche del mapa de la portada). Fondos con movimiento
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
  máscara), `tilt()` (inclinación y resplandor `.spotlight` con el cursor) y
  `ENTER` (cuándo entra un elemento).
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
- **En todas las páginas** (`usePageMotion`, montado en `Layout`): los `h2` de
  `main` entran línea por línea, los chevrons ››› de cada `Eyebrow` se encienden
  en secuencia y los enlaces con `data-magnetic` siguen un poco al puntero.
  Excluya algo con `data-motion="off"`.
- **Cabecera:** se esconde al bajar (pasados 480 px, salvo en saltos grandes
  como ir a una sección) y vuelve al subir; línea naranja de avance de lectura.
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
  scroll (escritorio); Quiénes somos con parallax y "1968" en odómetro; Galería
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
- **`DropIn`** (`src/components/ui/DropIn.tsx`, animaciones `.drop-*`): la foto
  llega como una caja que se deja (desde un lado o desde arriba, golpe y
  rebote) al entrar en pantalla. En las fotos del encabezado de los servicios
  con `imageDrop` en `SERVICES`, Quiénes somos, los artículos del blog
  (`PageHero drop`) y Certificaciones en Nosotros. Mudanzas locales usa en
  cambio la foto fundida con el fondo (`imageBlend`, `.photo-blend`).
- **`WorldLines`** (`src/components/sections/WorldLines.tsx`): fondo de
  mapamundi de líneas (costas, fronteras y rutas desde Bogotá en azul al 7–13 %)
  con destellos naranja y azul que las recorren lento y sin parar. Es un SVG
  aparte con su propia animación CSS (`src/assets/images/mapa-lineas.svg`,
  generado por `scripts/generate-world-lines.mjs` en `pnpm map`), sin JS. En el
  bloque de historia de Nosotros.
- Clientes y embajadas del inicio (`Hero`): dos cuadrículas fijas con todos los
  logos, en gris; al pasar el cursor el logo toma sus colores y su ficha se
  levanta con sombra y la franja naranja.

### Portada (`Hero` + `Globe`)

- Dos columnas en escritorio: titular y botones a la izquierda; a la derecha el
  **mapa animado en un panel azul noche** (`#0D0F33`) con esquinas redondeadas,
  resplandor azul suave detrás, **pestañas** arriba (Bogotá · Colombia · Mundo,
  marcan la etapa y llevan a ella), barra de avance naranja y leyenda abajo. En
  celular y tableta el panel va debajo del texto.
- Estilo del mapa ("noche", `src/lib/globe.ts`): mar azul marino con halo,
  continentes azul grisáceo translúcido, Colombia, Estados Unidos y las
  localidades de Bogotá en lavanda luminosa, rutas y puntos naranja con
  resplandor, textos claros con halo oscuro, camión blanco con franjas naranja.
- **Historia guiada por el scroll en escritorio** (sin movimiento reducido): el
  bloque superior del Hero mide 3,2 pantallas (`data-globe-track`,
  `motion-safe:lg:h-[320vh]`) y su contenido queda fijo (`sticky`) mientras se
  recorre; el avance elige el momento de la historia (`scrollScene` en
  `src/lib/globe.ts`, suavizado en `useGlobe`) y al subir retrocede:
  0–33 % Bogotá (la primera foto de los sectores se cierra en la ciudad y los
  camiones recorren las localidades), 33–66 % Colombia (la cámara se aleja y
  salen las rutas a las ciudades), 66–100 % Mundo (continentes y, desde el
  90 %, el mapamundi del Atlántico con todas las rutas). Aviso "Desliza para
  explorar" al llegar. Los pulsos y brillos siguen con el reloj. Seguir
  desplazándose cierra la tarjeta de un lugar. La sección usa `overflow-x-clip`
  (no `overflow-hidden`, que rompe el `sticky`).
- **En celular y tableta** la historia avanza sola en bucle (velocidad ≈ 0,89×
  en `useGlobe`) y se detiene con el mouse encima: carrusel de fotos de los
  sectores exclusivos de Bogotá (El Nogal, Hacienda Santa Bárbara en Usaquén,
  la Séptima con 94, El Refugio y el Parque de la 93; 2 s cada una, con nombre
  y crédito; `SECTORS` en `scripts/fetch-country-photos.mjs` →
  `src/data/sectorPhotos.ts`) → Bogotá y sus 20 localidades (unos 15 s) →
  Colombia con rutas a las capitales de departamento (`CITIES`) → por
  continente (América con toda Latinoamérica; Europa con sus 10 países
  principales; África; Asia; Oceanía con Australia y Nueva Zelanda), con 2 s
  de pausa en Colombia y en cada continente → globo girando con todos los
  destinos → vuelve la primera foto. Con movimiento reducido, mapa fijo.
- Bogotá: tres camiones salen de Puente Aranda (la sede) y pasan por todas las
  localidades menos Sumapaz, con estela naranja; frenan en cada una (onda) y
  cada uno termina en una de las de clientes exclusivos, estratos 5 y 6
  (Usaquén, Chapinero y Suba, `FINE`), que sube, se pone naranja con el aviso
  "Zona exclusiva" y queda con una estrella. Rutas y tiempos en `TRUCK_ROUTES`.
  Las localidades se pueden tocar.
- Ciudades y destinos: `scripts/generate-world-map.mjs` (`pnpm map`); nombres
  de capitales y textos del panel en `mapText` de `src/data/home.ts`. Lógica y
  dibujo en `src/lib/globe.ts`, animación en `src/hooks/useGlobe.ts` (pausa
  fuera de pantalla).
- Al tocar un país (o una localidad de Bogotá, o una ciudad de Colombia) la
  animación se detiene y `CountryCard` muestra la foto de su sitio más
  representativo (Torre Eiffel, Coliseo, Monserrate, TransMiCable…; elegidas a
  mano en `OVERRIDES` de `scripts/fetch-country-photos.mjs`; las demás usan la
  foto automática de su capital), con autor y licencia (lo exige la licencia).
  Las fotos **no están en el proyecto**: se cargan desde `thumb.wikimedia.org`
  y `upload.wikimedia.org`, los únicos dominios de Wikimedia que autoriza la
  CSP. Para cambiar una, use `OVERRIDES` y corra `pnpm fotos`. Están
  pendientes de que el cliente las apruebe.

### Páginas internas

- `PageHero`: texto a la izquierda sobre blanco (la cabecera usa letras
  oscuras) y, a la derecha, la foto en un `PhotoFrame` con pestaña (en los
  servicios, con su ícono y nombre); en celular la foto va arriba.
- Mudanzas nacionales (`/servicios/mudanzas-nacionales`): en vez de la foto
  (`heroMap` en `SERVICES`; `cargue.jpg` sigue como imagen para redes), un
  **mapa de Colombia con un camión** (`ColombiaRoutesMap`, en SVG): silueta
  exacta (Natural Earth 1:10m), las 14 ciudades del recorrido de la portada y
  carreteras por los pueblos reales de cada troncal
  (`scripts/generate-colombia-map.mjs`, `pnpm map`). Va en un círculo con el
  mar gris claro, los países vecinos en negro carbón y Colombia en un tono
  claro de `#1800AD` (estética anterior; candidata a pasarse al estilo "noche"
  de la portada). Un camión azul y blanco viaja de una ciudad a otra por el
  camino más corto (al azar, sin repetir sus últimas 6, `RECENT`), con estela
  naranja y brillo; la casa del destino cae con rebote y aviso "Próximo
  destino", al llegar salta con una onda y "¡Llegamos a …!" (`.map-*` en
  `src/styles/index.css`; textos en `serviceDetailText` de `src/data/pages.ts`;
  lógica en `src/lib/colombiaRoutes.ts` y `src/hooks/useTruckTrip.ts`). Pausa
  fuera de pantalla; con movimiento reducido, el viaje ya hecho sin avisos.
- Chat: mismo estilo de los menús (cabecera azul con el cuadrado naranja
  translúcido girado 45°, rótulo naranja en mayúsculas, opciones como lista con
  íconos en cuadros grises). La ventana de Zoho lo recibe de
  `src/styles/zoho-chat.css`.

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
