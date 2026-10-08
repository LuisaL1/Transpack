# Entorno de pruebas

Cubre calidad de código, contenido, funcionamiento, accesibilidad y seguridad.
Todo corre en local con un comando, y en GitHub Actions en cada push y en cada
pull request a `main` (`.github/workflows/ci.yml`).

## Primer uso

```bash
pnpm install
pnpm exec playwright install chromium   # navegador para las pruebas de extremo a extremo
```

## Comandos

| Comando | Qué revisa | Tiempo aprox. |
| --- | --- | --- |
| `pnpm check` | Tipos + lint + pruebas unitarias + build + revisión del HTML pre-generado (`test:seo`). **Correr antes de cada commit.** | ~20 s |
| `pnpm check:all` | Lo anterior + auditoría de dependencias + extremo a extremo | ~1 min |
| `pnpm typecheck` | TypeScript estricto (incluye variables y parámetros sin uso) | |
| `pnpm lint` | ESLint: calidad, hooks de React, accesibilidad (jsx-a11y) y patrones inseguros (eslint-plugin-security) | |
| `pnpm test` | Pruebas unitarias, de contenido y de seguridad estática (Vitest) | |
| `pnpm test:watch` | Igual, en modo observación mientras se desarrolla | |
| `pnpm test:coverage` | Igual, con cobertura de `src/lib`, `src/data` y `src/hooks` (reporte en `coverage/`) | |
| `pnpm test:security` | Solo las pruebas de seguridad estática | |
| `pnpm test:deps` | Vulnerabilidades conocidas en todas las dependencias (nivel alto o crítico) | |
| `pnpm test:seo` | Revisa el HTML pre-generado en `dist/` (después de `pnpm build`): un archivo por ruta, etiquetas, JSON-LD, un `<h1>`, contenido, sitemap y robots | |
| `pnpm test:e2e` | Playwright sobre el build de producción, en escritorio (1440 px) y celular (Pixel 7). Se compila **sin** Google Analytics para no enviar visitas de prueba | ~45 s |
| `pnpm test:ga` | Compila **con** el ID real de Google Analytics y verifica: aviso de cookies, consentimiento denegado por defecto, sin cookie `_ga` antes de aceptar, cookie y envío de datos al aceptar, nada al rechazar. Necesita internet | ~10 s |

Para correr las pruebas de extremo a extremo contra otro entorno (por ejemplo,
una URL de Vercel Preview): `BASE_URL=https://su-preview.vercel.app pnpm test:e2e`.
El reporte HTML queda en `playwright-report/` (`pnpm exec playwright show-report`).

## Qué cubre cada capa

### 1. Calidad de código
- **TypeScript estricto** (`tsconfig.json`, con `noUnusedLocals` y `noUnusedParameters`).
- **ESLint** (`eslint.config.js`): reglas recomendadas de JS y TypeScript, hooks
  de React, accesibilidad en JSX y patrones inseguros. Prohíbe
  `dangerouslySetInnerHTML` y `eval`. Hay tres excepciones justificadas en el
  código (delegación de teclado en el cotizador y el buscador, y clic en el
  fondo del buscador para cerrarlo), cada una con su alternativa de teclado.
- **Build** sin errores. En CI falla si un archivo JS pasa de 800 KB (hoy el
  principal pesa ~670 KB y las librerías van aparte; ver pendientes en
  `README.md`).

### 2. Lógica y contenido (`tests/unit/`)
- `contact-api.test.ts` — la función `api/contact.ts` con `fetch` simulado (sin
  correos reales): 503 sin clave, 422 por correo o autorización, 403 desde otro
  dominio, campo trampa, destino y "responder a", HTML escapado, confirmación
  al visitante en su idioma, fallas de Brevo (502) y de la confirmación (200).
  Detalle en `docs/formularios.md`.
- `joel.test.ts` — el asesor virtual (`src/lib/joel.ts`):
  - entiende texto libre y errores de tipeo;
  - responde la pregunta específica antes que el resumen del servicio;
  - recuerda el servicio en contexto y asesora según el plazo;
  - maneja objeciones;
  - **no da precios** y solo menciona las certificaciones reales (LACMA, IAM, PAIMA);
  - si no tiene un dato, lo dice y ofrece el contacto;
  - rechaza intentos de manipulación (*prompt injection*), redirige temas
    ajenos, responde con honestidad si le preguntan si es ChatGPT y maneja
    groserías;
  - no repite HTML ni scripts del visitante;
  - aprende de la elección del visitante, guarda lo que no entendió,
    personaliza el saludo y funciona sin almacenamiento disponible.
- `chatRoute.test.ts` — chat en otros idiomas: palabras clave → paso correcto,
  y todas las opciones del chat guiado llevan a pasos que existen, en los seis
  idiomas.
- `search.test.ts` — buscador:
  - busca sin tildes ni mayúsculas y exige todas las palabras;
  - pide mínimo 2 letras y muestra máximo 8 resultados, todos con destino;
  - los países del mapa llevan a la mudanza internacional;
  - las rutas salen en el idioma de la búsqueda;
  - cada búsqueda sugerida tiene resultados en su idioma.
- `components.test.tsx` — el cotizador (elegir servicio → paso 2, validación,
  preselección por URL y textos en el idioma de la ruta) y las pestañas de
  soluciones.
- `seo.test.ts` — metadatos de las 72 rutas:
  - títulos únicos (30–70 caracteres, con marca, y ciudad en los servicios);
  - descripciones únicas (70–160 caracteres);
  - canónicas absolutas sin barra final;
  - hreflang recíproco en seis idiomas + x-default;
  - imagen absoluta;
  - `noindex` mientras no se active la indexación;
  - 404 (con `noindex` y sin hreflang) para rutas desconocidas o no canónicas;
  - JSON-LD por tipo de página;
  - empresa con dirección, teléfono, correo y redes, y sin horario inventado;
  - artículos sin fechas inventadas;
  - recorte de textos (`clip`) y escape seguro del `<head>`.
- `content.test.ts` — integridad de `src/data/` y reglas de `AGENTS.md`:
  - slugs únicos;
  - cada servicio con página en los seis idiomas;
  - cada servicio y segmento con un tipo de cotización existente;
  - el menú apunta a servicios y segmentos que existen;
  - todos los idiomas con los mismos servicios, segmentos, niveles, pasos,
    preguntas, cifras y artículos;
  - la política de datos con las mismas secciones en cada idioma, el aviso de
    que manda la versión en español y el mismo correo y dirección de contacto;
  - cada destino del mapa con su nombre en los seis idiomas;
  - **todos los textos cortos traducidos** en `src/i18n/dict` (salvo los
    pendientes conocidos, abajo);
  - los países marcados como embajada son exactamente los de `EMBASSIES`;
  - **sin precios**, sin certificaciones no reales (ISO 9001, FIDI, BASC, OEA);
  - **cifras coherentes con `STATS`** (58 años, 176 países, 2.000 agentes);
  - sin textos de relleno;
  - **solo colores de la paleta** (lista blanca);
  - **chat de Joel sin degradados**.

### 2b. HTML pre-generado (`tests/seo/dist.test.ts`, con `pnpm test:seo`)
Por cada una de las 72 rutas:
- existe su `.html`, con el idioma y la dirección del `<html>`;
- un solo `<title>` y una sola descripción, su canónica, 7 enlaces hreflang,
  Open Graph y `twitter:card`;
- JSON-LD que se puede leer, un solo `<h1>`, `data-path` correcto y contenido
  real (más de 1.500 caracteres de texto).

Además:
- `404.html` con `noindex`;
- `sitemap.xml` con todas las canónicas y sus idiomas;
- `robots.txt` coherente con la indexación;
- imágenes de marca presentes.

### 3. Seguridad
- **Estática** (`tests/security/static.test.ts`):
  - sin inyección de HTML ni `eval`;
  - enlaces en pestaña nueva con `rel="noopener"`/`noreferrer`;
  - sin `http://` inseguro;
  - sin credenciales ni llaves en el código;
  - sin enlaces `mailto:` (el correo va por el formulario) y la clave de Brevo
    solo en `api/`;
  - solo las variables públicas permitidas: `VITE_GA_MEASUREMENT_ID`,
    `VITE_SITE_INDEXABLE` y `VITE_GOOGLE_SITE_VERIFICATION`;
  - ningún `.env` real versionado y `.gitignore` correcto;
  - cabeceras de seguridad presentes y la CSP solo con los servicios reales;
  - caché inmutable para `/assets`.
- **Cabeceras HTTP** (`vercel.json`):
  - Content-Security-Policy, HSTS (2 años), `X-Content-Type-Options`,
    `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy` y
    `Cross-Origin-Opener-Policy`;
  - la CSP no permite scripts en línea ni `eval`;
  - solo autoriza Google Analytics (`*.googletagmanager.com`,
    `*.google-analytics.com`, `*.analytics.google.com`), Google Fonts, el mapa
    de Google (contacto), el reproductor de youtube-nocookie y sus portadas
    (i.ytimg.com);
  - sin comodín a `index.html`: cada ruta se sirve desde su HTML (`cleanUrls`).
- **CSP en el navegador** (`tests/e2e/csp.spec.ts`):
  - aplica las cabeceras de `vercel.json` sobre el build y falla si el
    navegador bloquea algún recurso (incluido reproducir un video);
  - **si agrega un servicio externo** (analytics, formularios, chat, CDN),
    añádalo a la CSP de `vercel.json` y a la lista de
    `tests/security/static.test.ts`, o las pruebas fallarán.
- **Dependencias**:
  - `pnpm test:deps` en local y en CI;
  - Dependabot (`.github/dependabot.yml`) abre PRs semanales;
  - en CI, **gitleaks** busca secretos en todo el historial de git.

### 4. Funcionamiento de extremo a extremo (`tests/e2e/`)
- `smoke.spec.ts`:
  - cada ruta (español, inglés, francés, alemán y árabe) carga sin errores de
    JavaScript ni recursos rotos, con título y `<h1>`;
  - el árabe va de derecha a izquierda;
  - una ruta inexistente muestra la 404.
- `flows.spec.ts`:
  - menú Servicios → página del servicio (escritorio y menú móvil);
  - buscador sin tildes;
  - cotizador con preselección y validación;
  - formulario de contacto: se abre desde soporte, exige la autorización y
    envía; se abre precargado y muestra el error con WhatsApp;
  - cotizador: exige la autorización, envía por correo y el WhatsApp lleva la
    solicitud (`/api/contact` simulado con `page.route`);
  - segmento abierto desde el menú;
  - chat de Joel con texto libre y sin precios;
  - chat con un asesor (Zoho simulado): Joel funciona sin cargar Zoho; se
    carga solo al elegir "Chatear con un asesor", en español y con el diseño
    del sitio; si no carga, Joel ofrece WhatsApp y el formulario;
  - el texto del visitante se muestra como texto, nunca como HTML;
  - cambio de idioma conservando la página.

- `seo.spec.ts`:
  - **sin JavaScript**, las rutas clave (español, inglés y árabe) traen idioma,
    título, H1, canónica, JSON-LD y hreflang;
  - al navegar cambian el título, la canónica y los hreflang, sin duplicar
    etiquetas;
  - la 404 ofrece inicio, cotizador y servicios, con `noindex`.
- `analytics.spec.ts` (solo con `pnpm test:ga`): Google Analytics con el
  consentimiento.
- La prueba de humo falla con cualquier error de consola, incluidos los
  **errores de hidratación** (diferencias entre el HTML pre-generado y el
  navegador).

### 5. Accesibilidad (`tests/e2e/a11y.spec.ts`)
axe-core con WCAG 2.1 A/AA en inicio, Nosotros, un servicio, un artículo, inglés
y árabe. Bloquea con cualquier problema crítico o grave. Para que axe vea todo
el contenido, las animaciones se desactivan (`prefers-reduced-motion`).

## Pendientes conocidos

### Contraste de color (depende del diseño)
Se reporta como anotación "pendiente", sin bloquear, porque depende de los
colores de marca y debe aprobarlo el cliente. Todo viene del naranja de marca
`#FF7619`:

| Elemento | Colores | Contraste | Mínimo AA |
| --- | --- | --- | --- |
| Botones naranjas con texto blanco ("Cotiza tu mudanza", cabecera y menú) | blanco sobre `#FF7619` | 2.7:1 | 4.5:1 (3:1 si el texto es grande) |
| Signo "+" naranja de las cifras ("58+", "176+") | `#FF7619` sobre blanco | 2.7:1 | 3:1 (texto grande) |
| Franja naranja final ("¿Listo para tu próximo destino?"): título, texto y botón "WhatsApp" | blanco sobre `#FF7619` y tonos claros | 2.1–2.6:1 | 4.5:1 |

Opciones para el diseño: oscurecer el naranja de los fondos con texto blanco
(por ejemplo `naranja-600` `#E8620A` llega a ~3.4:1, suficiente solo para texto
grande) o usar texto azul de marca `#272B7C` sobre el naranja actual (4.6:1,
cumple AA). Una vez corregido, active el
modo estricto (`A11Y_STRICT=1 pnpm test:e2e`) y déjelo fijo en
`tests/e2e/a11y.spec.ts`.

### Traducciones
Dos etiquetas de accesibilidad de la franja de idiomas no tienen traducción en
francés, alemán, italiano ni árabe y se leen en inglés: "Choose region and
language" y "Region and language". Están en la lista `PENDING` de
`tests/unit/content.test.ts`: al traducirlas en `src/i18n/dict/*.ts`, quítelas de
esa lista.

## Al agregar funcionalidad
1. Texto o contenido nuevo → en `src/data/` (con `tr("es", "en")` y su
   traducción en `src/i18n/dict/*.ts`); las pruebas de contenido lo validan solas.
2. Lógica nueva → en `src/lib/` o `src/hooks/`, con su prueba en `tests/unit/`.
3. Página o recorrido nuevo → agregue la ruta a `smoke.spec.ts` y `a11y.spec.ts`
   y, si tiene interacción, un caso en `flows.spec.ts`.
4. Servicio externo nuevo → CSP en `vercel.json` y lista en
   `tests/security/static.test.ts`.
5. Color nuevo → lista blanca en `tests/unit/content.test.ts` y paleta en `AGENTS.md`.
6. `pnpm check:all` en verde antes de abrir el PR.
