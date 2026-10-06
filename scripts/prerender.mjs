// Pre-generación de HTML por ruta (SEO). Se ejecuta en `pnpm build` después
// del build del cliente (dist/) y del build de servidor (dist-ssr/).
//  · Escribe dist/<ruta>.html con el contenido ya renderizado, el idioma del
//    <html> y las etiquetas SEO propias de cada página (título, descripción,
//    canónica, hreflang, Open Graph, JSON-LD), en los seis idiomas.
//  · Escribe dist/404.html (Vercel lo sirve con estado 404), sitemap.xml y robots.txt.
// Vercel sirve /servicios/x desde dist/servicios/x.html gracias a "cleanUrls".
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";

const DIST = "dist";
const ssr = await import(pathToFileURL(join(process.cwd(), "dist-ssr", "entry-server.js")).href);
const { render, getPageMeta, renderHeadTags, PUBLIC_ROUTES, INDEXABLE, SITE_URL, LANG_INFO } = ssr;

const template = readFileSync(join(DIST, "index.html"), "utf8");
for (const mark of [
  "<!--seo:start-->",
  '<div id="root"><!--app-html--></div>',
  '<html lang="es-CO" dir="ltr">',
])
  if (!template.includes(mark)) throw new Error(`index.html sin el marcador ${mark}`);

function page(url) {
  const meta = getPageMeta(url);
  const { locale, dir } = LANG_INFO[meta.lang];
  const html = template
    .replace('<html lang="es-CO" dir="ltr">', `<html lang="${locale}" dir="${dir}">`)
    .replace(/<!--seo:start-->[\s\S]*?<!--seo:end-->/, renderHeadTags(meta))
    .replace(
      '<div id="root"><!--app-html--></div>',
      `<div id="root" data-path="${url}">${render(url)}</div>`,
    );
  return { meta, html };
}
const write = (file, content) => {
  const f = join(DIST, file);
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, content);
};

for (const route of PUBLIC_ROUTES) {
  const { meta, html } = page(route);
  if (meta.notFound) throw new Error(`La ruta pública ${route} no tiene metadatos`);
  write(route === "/" ? "index.html" : `${route.slice(1)}.html`, html);
}
write("404.html", page("/404").html);

const today = new Date().toISOString().slice(0, 10);
const xmlEsc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
write(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${PUBLIC_ROUTES.map((r) => {
  const m = getPageMeta(r);
  const alt = m.alternates
    .map(
      (a) =>
        `\n    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${xmlEsc(a.href)}" />`,
    )
    .join("");
  return `  <url>\n    <loc>${xmlEsc(m.canonical)}</loc>\n    <lastmod>${m.lastmod ?? today}</lastmod>\n    <priority>${(m.priority ?? 0.5).toFixed(1)}</priority>${alt}\n  </url>`;
}).join("\n")}
</urlset>
`,
);
write(
  "robots.txt",
  INDEXABLE
    ? `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`
    : `# Sitio aún no publicado en el dominio oficial: no indexar (activar con VITE_SITE_INDEXABLE=true).\nUser-agent: *\nDisallow: /\n`,
);

rmSync("dist-ssr", { recursive: true, force: true });
console.log(
  `Pre-generadas ${PUBLIC_ROUTES.length} rutas + 404 · sitemap.xml · robots.txt (${INDEXABLE ? "indexable" : "noindex"})`,
);
