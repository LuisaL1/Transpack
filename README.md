# Transpack · Sitio web

Sitio corporativo de Transpack S.A.S. (mudanzas y bodegaje, Bogotá) — React 19 +
Vite 8 + Tailwind CSS v4 + TypeScript + React Router 7, en seis idiomas
(español, inglés, francés, alemán, italiano y árabe).

## Requisitos

- Node.js 22 o superior
- pnpm 12 (`corepack enable`; la versión exacta está en `packageManager` de `package.json`)

## Uso

```bash
pnpm install     # instalar dependencias
pnpm dev         # desarrollo en http://localhost:5173
pnpm build       # build de producción en dist/ (con HTML pre-generado por ruta, ver docs/seo.md)
pnpm preview     # ver el build localmente
pnpm check       # tipos + lint + pruebas + build (antes de cada commit)
pnpm check:all   # lo anterior + auditoría de seguridad + pruebas de extremo a extremo
pnpm map         # regenerar el mapamundi (ver scripts/generate-world-map.mjs)
```

- Pruebas de calidad, accesibilidad y seguridad: ver `TESTING.md`.
- Google Analytics y eventos de conversión: ver `docs/conversion-y-analitica.md`.
- SEO técnico y checklist del día de publicación: ver `docs/seo.md`.
- Arquitectura, reglas de contenido, idiomas, diseño y funcionamiento del asesor
  virtual Joel: ver `AGENTS.md`.

### Rutas

| Ruta | Página |
| --- | --- |
| `/` | Inicio (incluye el cotizador en `#cotizar`) |
| `/nosotros` | Quiénes somos |
| `/privacidad` | Política de tratamiento de datos personales (texto en `PRIVACY`, `src/data/site.ts`) |
| `/servicios/:slug` | Detalle de servicio (slugs en `src/data/site.ts`) |
| `/blog/:slug` | Artículo (contenido en `src/data/blogData.ts`) |

- Los demás idiomas van con prefijo y URLs traducidas (`/en/about`,
  `/fr/services/...`).
- El cotizador acepta preselección por URL: `/?servicio=internacional&nivel=2#cotizar`
  (`servicio`: local, nacional, internacional, empresarial, bodegaje · `nivel`: 1, 2, 3).
- Las soluciones abren un segmento con `/?segmento=corporate#soluciones`
  (residencial, corporate, diplomatic, diaspora).

## Despliegue

Vercel (framework: Vite, instalación `pnpm install`, build `pnpm build`, salida
`dist`).

- **Una página por ruta:** el build genera un HTML por ruta (72 páginas en seis
  idiomas, más `404.html`, `sitemap.xml` y `robots.txt`).
- **`vercel.json`:**
  - sirve cada página desde su HTML (`cleanUrls`) y responde 404 real en rutas
    desconocidas;
  - define las cabeceras de seguridad (CSP, HSTS…) y la caché de `/assets`.

Con el repositorio conectado a Vercel, cada push a `main` publica el sitio. Cada
push y pull request corre además la integración continua de GitHub Actions
(`.github/workflows/ci.yml`).

### Variables de entorno (Vercel → Settings → Environment Variables)

| Variable | Valor | Entorno |
| --- | --- | --- |
| `VITE_GA_MEASUREMENT_ID` | `G-BTXBFXKFEN` (Google Analytics 4 de Transpack) | **Solo Production** |
| `VITE_SITE_INDEXABLE` | `true` **solo el día en que el dominio apunte a este sitio** (ver `docs/seo.md`) | Solo Production |
| `VITE_GOOGLE_SITE_VERIFICATION` | Opcional (si Search Console se verifica con etiqueta HTML y no por DNS) | Solo Production |
| `BREVO_API_KEY` | Clave de API de Brevo para los formularios. **Secreta** (sin `VITE_`) | Production |
| `LEADS_TO` / `LEADS_TO_QUOTES` / `LEADS_FROM` / `LEADS_FROM_NAME` | Opcionales: destino del formulario, destino de las cotizaciones, remitente y nombre del remitente (ver `docs/formularios.md`) | Production |

- **Después de crear o cambiar una variable:** Deployments → último despliegue
  → **Redeploy**. Las variables se leen al compilar.
- **Solo Production** evita que las vistas previas (Preview) envíen visitas a
  Google Analytics.
- **Documentación:** las variables están documentadas en `.env.example`.
- **En local:** el ID va en `.env.production.local` (no versionado). Así solo
  `pnpm build` lo usa y `pnpm dev` nunca envía datos.

## Pendientes de desarrollo

- **Política de datos** (`/privacidad`): es un **borrador** basado en la
  Ley 1581 de 2012 y en lo que el sitio realmente hace. Pendiente:
  - **revisión y aprobación del asesor legal** de Transpack antes de publicar;
  - el **NIT**: no está en los documentos del cliente. Cuando lo entreguen, va
    en `CONTACT.nit` (`src/data/site.ts`) y la política lo muestra sola;
  - confirmar el área que atiende las solicitudes, la fecha de vigencia y el
    registro de bases de datos ante la SIC, si aplica.
- **Envío de formularios por correo (Brevo)**: por `api/contact.ts`, las
  cotizaciones llegan a mercadeo@transpacksas.com y el formulario de contacto a
  servicioalcliente@transpacksas.com.
  Falta que el área encargada verifique el dominio en Brevo (SPF, DKIM, DMARC),
  cree la clave y configure las variables en Vercel (ver `docs/formularios.md`).
  Mientras tanto, el formulario muestra el aviso con WhatsApp.
- **Google Analytics**: integrado y verificado (`pnpm test:ga`). Falta crear la
  variable en Vercel y marcar los eventos clave en GA4 (ver
  `docs/conversion-y-analitica.md`).
- **Información que no está en los documentos** (Joel responde "no tengo ese
  dato" y da el contacto): precios, condiciones del seguro, horario de atención,
  lista de artículos que no se pueden transportar, formas de pago y políticas
  de cancelación. Si el cliente las entrega, se agregan a `src/lib/joel.ts` y
  al contenido.
- **Chat con un asesor (Zoho SalesIQ)**: Joel atiende primero y ofrece
  "Chatear con un asesor", que abre Zoho (ver `docs/chat-crm.md`). En el panel
  de Zoho falta autorizar el dominio `www.transpacksas.com` y decidir si el bot
  de Zoho saluda o pasa directo a un asesor. Hay que verificar en producción
  que la CSP no bloquee funciones del chat (adjuntos o llamadas). Si Zoho
  cambia su ventana, revisar que el diseño del sitio se siga aplicando.
- **Joel**:
  - el cerebro solo funciona en español; en los otros idiomas el chat entiende
    palabras clave limitadas (por ejemplo, en alemán reconoce "Ausland", pero
    no nombres de países como "Kanada");
  - las preguntas que no supo responder quedan solo en el navegador de cada
    visitante (`localStorage`), así que el equipo no puede revisarlas sin un
    servidor.
- **Contraste de color (accesibilidad AA)**: el texto blanco sobre el naranja de
  marca y el "+" naranja de las cifras no alcanzan el mínimo (tabla en
  `TESTING.md`). Requiere aprobación de diseño.
- **Traducciones**: faltan dos etiquetas de accesibilidad de la franja de
  idiomas en francés, alemán, italiano y árabe (ver `TESTING.md`).
- **Rendimiento**:
  - JS principal de ~670 KB (218 KB comprimido) con los seis idiomas; las
    librerías van aparte (~260 KB, `vite.config.ts`) y el chat con un asesor se
    descarga solo al usarlo. Conviene dividir por idioma o por ruta con
    `React.lazy`. El CI falla si un archivo JS pasa de 800 KB;
  - fotos en JPG de hasta 425 KB (`cargue.jpg`, `equipo.jpg`, `global.jpg`;
    convertir a WebP/AVIF y servir tamaños según pantalla).
- **Fotos**: las actuales se reemplazarán cuando el cliente entregue nuevas.
- **Por confirmar con el cliente**:
  - los 13 destinos de ejemplo del mapa en Suramérica, África y Asia;
  - que se iluminen países con sanciones (Corea del Norte, Siria, Afganistán,
    Yemen): solo se excluyeron Irán y Rusia, como se pidió.
- **Mapa de Google** (contacto): se carga sin consentimiento y puede dejar
  cookies de Google; evaluar cargarlo al hacer clic, como ya se hace con los
  videos de YouTube.
- **SEO**: la indexación está desactivada (`noindex`) hasta que el dominio apunte
  a este sitio. Seguir el checklist de `docs/seo.md`, que incluye las
  redirecciones 301 desde las URL del sitio anterior. Los artículos no tienen
  fecha de publicación en el contenido.
- **Imagen para redes** (`public/brand/og-image.jpg`): pendiente de aprobación
  del cliente.
