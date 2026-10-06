# SEO técnico

## Qué está implementado

| Qué | Dónde | Detalle |
| --- | --- | --- |
| HTML pre-generado por ruta | `src/entry-server.tsx`, `scripts/prerender.mjs` | 66 páginas (11 por idioma × 6 idiomas) + `404.html`, con el contenido ya renderizado: los buscadores y las redes lo leen sin ejecutar JavaScript. |
| Idioma por página | `<html lang dir>` en cada HTML | `es-CO`, `en-US`, `fr-FR`, `de-DE`, `it-IT` y `ar` (de derecha a izquierda). |
| Metadatos | `src/seo/meta.ts` (textos en `src/data/meta.ts`) | Título único (30–70 caracteres, palabra clave + ciudad + marca), descripción única (70–160), canónica absoluta, robots, Open Graph, Twitter. |
| Idiomas (hreflang) | `meta.ts` + `sitemap.xml` | Cada página enlaza su versión en los seis idiomas y `x-default` (español), recíprocos. |
| Datos estructurados | `meta.ts` (JSON-LD en `@graph`) | Empresa (`MovingCompany`, un `LocalBusiness`) y `WebSite` en todas las páginas, más el tipo de cada página (ver abajo). |
| Datos de la empresa | `src/seo/site.ts` | Salen de `CONTACT`, `SLOGAN` y `STATS` (`src/data/site.ts`): razón social, dirección, teléfonos, correo, redes y año de fundación. |
| Navegación interna | `SeoHead` (`src/components/layout/SeoHead.tsx`) | Al cambiar de página actualiza idioma, título y todas las etiquetas (sin `innerHTML`). Va antes de `AnalyticsTracker`, para que `page_view` lleve el título correcto. |
| sitemap.xml y robots.txt | `scripts/prerender.mjs` | Sitemap con las 66 canónicas, `lastmod`, `priority` y alternativas por idioma. `robots.txt` según el interruptor de indexación. |
| 404 real | `dist/404.html` + `vercel.json` | Vercel responde estado 404 en rutas desconocidas. La página ofrece inicio, cotizador y servicios, con `noindex`. |
| Servidor | `vercel.json` | `cleanUrls` y `trailingSlash: false` (sin el antiguo comodín a `index.html`). |
| Imágenes de marca | `public/brand/` | `logo.png` (584 px, la mayor versión disponible del logo) y `og-image.jpg` (1200×630) para compartir en redes. |
| Rendimiento | `index.html`, componentes | Tipografías con `preconnect` + un solo `<link>` (antes `@import` en CSS). Imágenes bajo el pliegue con `loading="lazy" decoding="async"`; la imagen de cabecera de las páginas internas con `fetchPriority="high"`. Logo, avatar de Joel, logo de Argos y favicon redimensionados a su tamaño real de uso. |
| Indexación | `VITE_SITE_INDEXABLE` | **Desactivada** (`noindex, nofollow` y `robots.txt` con `Disallow: /`). |

JSON-LD por página:

| Página | Tipos |
| --- | --- |
| Todas | `MovingCompany` (dirección, teléfonos, correo, redes, fundación, área de servicio, contactos) + `WebSite` |
| Inicio | `WebPage` + `ItemList` de servicios + `FAQPage` |
| Servicio | `WebPage` + `Service` (proveedor: la empresa) + `BreadcrumbList` |
| Artículo | `WebPage` + `BlogPosting` (portada, sección, autor y editor: la empresa) + `BreadcrumbList` |
| Nosotros | `AboutPage` + `BreadcrumbList` |

**No se incluyó, por falta de datos confirmados:**
- horario de atención (`openingHours`);
- coordenadas del mapa;
- precios;
- fechas de publicación de los artículos (`datePublished`): el contenido del
  cliente no las trae. Si se agregan al blog, añádalas a `BlogPosting`.

## Cómo funciona la pre-generación

`pnpm build` hace tres pasos:

1. `vite build`: el sitio normal en `dist/`.
2. `vite build --ssr src/entry-server.tsx --outDir dist-ssr`: la misma app,
   lista para renderizarse en Node.
3. `node scripts/prerender.mjs`: para cada ruta de `PUBLIC_ROUTES`:
   - toma `dist/index.html`;
   - pone el idioma del `<html>`;
   - reemplaza el bloque `<!--seo:start-->…<!--seo:end-->` por las etiquetas
     de esa página;
   - reemplaza `<div id="root"><!--app-html--></div>` por el HTML renderizado
     (con `data-path`);
   - escribe `dist/<ruta>.html`;
   - al final escribe `404.html`, `sitemap.xml` y `robots.txt`, y borra
     `dist-ssr/`.

En el navegador, `src/main.tsx` **hidrata** el HTML si `data-path` coincide con
la URL. Si no coincide (por ejemplo, la 404 en una URL desconocida, o `pnpm dev`,
que no pre-genera), renderiza desde cero.

## Reglas para no romper el SEO

- **Ruta nueva**:
  - agréguela en `App.tsx`, en `getPageMeta` y en `PUBLIC_ROUTES`
    (`src/seo/meta.ts`), con título y descripción en los seis idiomas;
  - si es de otro idioma, agregue sus slugs en `src/i18n/index.ts`;
  - las pruebas avisan si falta algo.
- **Nada de `window`, `document`, `localStorage` ni `matchMedia` durante el
  render** ni en el valor inicial de `useState`: el render también corre en
  Node durante el build. Empiece con un valor fijo y corríjalo en `useEffect`
  (como el aviso de cookies o el menú).
- El render del servidor y el del navegador deben coincidir: nada de fechas
  actuales, números aleatorios ni contenido distinto por idioma del navegador
  en el primer render.
- **Un solo `<h1>` por página.**
- Títulos de 30 a 70 caracteres y descripciones de 70 a 160, únicos.
- **Texto del sitio en `src/data/`:** así cambia a la vez la página, el
  buscador, Joel y los metadatos.

## Por qué la indexación queda desactivada

Mientras www.transpacksas.com siga mostrando el sitio anterior, este sitio vive
en una dirección de prueba (Vercel). Si Google lo indexara ahí, tendría dos
sitios de Transpack con contenido parecido compitiendo entre sí, y podría
perjudicar el posicionamiento que ya tiene el dominio. Por eso todas las páginas
llevan `noindex` y `robots.txt` bloquea a los buscadores. Se activa el día en que
el dominio apunte a este sitio.

## Checklist del día de publicación

1. **Dominio en Vercel**:
   - agregar `www.transpacksas.com` y `transpacksas.com` (Settings → Domains);
   - dejar `www` como principal, con el dominio sin `www` redirigido (301) a él.
     Es el dominio canónico de `src/seo/site.ts`.
2. **Activar la indexación**: `VITE_SITE_INDEXABLE=true` en Settings →
   Environment Variables (solo Production) y **Redeploy**.
   - Verifique que `https://www.transpacksas.com/robots.txt` muestre
     `Allow: /` y el sitemap.
3. **Google Search Console**:
   - verificar la propiedad de dominio por DNS (registro TXT);
   - enviar `https://www.transpacksas.com/sitemap.xml`;
   - inspeccionar la URL de inicio y solicitar indexación.
4. **Bing Webmaster Tools**: importar desde Search Console o verificar, y enviar
   el sitemap.
5. **Google Business Profile**: con los mismos datos del sitio (Transpack S.A.S.,
   Cra. 40 #20A – 96, Bogotá, teléfono 321 811 5967, sitio web).
   - Horario: solo el que confirme la empresa.
6. **Redirecciones 301 desde el sitio anterior** (WordPress):
   - listar sus URL (en Search Console o en su sitemap);
   - agregar en `vercel.json` un bloque `"redirects"` de cada URL antigua a la
     página equivalente (por ejemplo, la antigua página de mudanzas
     internacionales → `/servicios/mudanzas-internacionales`).
7. **Validar**:
   - [Prueba de resultados enriquecidos](https://search.google.com/test/rich-results)
     (inicio, un servicio, un artículo);
   - [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/);
   - [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/);
   - [PageSpeed Insights](https://pagespeed.web.dev/) en celular.

## Recomendaciones de contenido

- **Fechas:** poner fecha de publicación a los artículos del blog (mejora
  `BlogPosting` y la frescura).
- **Más artículos:** escribir sobre lo que la gente busca, por ejemplo:
  - cuánto cuesta (y de qué depende) una mudanza internacional;
  - documentos para mudarse a Estados Unidos, Canadá o España;
  - trasteos en Bogotá: checklist;
  - mudanza de oficinas sin parar la operación.
- **Páginas por destino**, cuando haya contenido real (requisitos, tiempos):
  "Mudanzas a Estados Unidos", "Mudanzas a Canadá", "Mudanzas a España".
- **Reseñas de Google Business Profile:** cuando existan, podrán mostrarse en el
  sitio, sin inventarlas ni marcarlas en JSON-LD si no son verificables.

## Pendientes de rendimiento

- **Bundle:** un solo bundle JS de ~836 KB (268 KB comprimido) con los seis
  idiomas. Dividir por idioma o por ruta (`React.lazy`) mejora la primera
  carga.
- **Fotos:** JPG de hasta 425 KB. Convertir a WebP/AVIF y servir tamaños según
  la pantalla (`srcset`).
- **Mapa de Google:** se carga en cuanto se ve. Cargarlo al hacer clic, como los
  videos, ahorra peso y cookies de terceros.
