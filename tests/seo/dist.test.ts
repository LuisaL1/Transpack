import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { PUBLIC_ROUTES, getPageMeta } from "@/seo/meta";
import { LANG_INFO } from "@/i18n";

// Revisa el HTML pre-generado en dist/ (correr después de `pnpm build`:
// `pnpm test:seo`). Es lo que reciben Google y las redes sociales.
const file = (r: string) => `dist/${r === "/" ? "index" : r.slice(1)}.html`;
const read = (f: string) => readFileSync(f, "utf8");

describe("HTML pre-generado", () => {
  it("existe un archivo por ruta pública y la 404", () => {
    for (const r of PUBLIC_ROUTES) expect(existsSync(file(r)), file(r)).toBe(true);
    expect(existsSync("dist/404.html")).toBe(true);
  });

  for (const r of PUBLIC_ROUTES) {
    it(`${r}: idioma, título, descripción, canónica, hreflang, OG, JSON-LD y contenido`, () => {
      const html = read(file(r));
      const m = getPageMeta(r);
      const { locale, dir } = LANG_INFO[m.lang];
      expect(html).toContain(`<html lang="${locale}" dir="${dir}">`);
      const head = html.slice(0, html.indexOf("</head>"));
      expect(head.match(/<title/g)).toHaveLength(1);
      expect(head).toContain(`<link data-seo rel="canonical" href="${m.canonical}"`);
      expect(head.match(/name="description"/g)).toHaveLength(1);
      expect(head.match(/rel="alternate" hreflang=/g)).toHaveLength(7);
      for (const p of [
        "og:title",
        "og:description",
        "og:image",
        "og:url",
        "og:locale",
        "twitter:card",
      ])
        expect(head).toContain(`"${p}"`);
      const blocks =
        head.match(/<script data-seo type="application\/ld\+json">([\s\S]*?)<\/script>/g) ?? [];
      expect(blocks.length).toBeGreaterThan(0);
      for (const block of blocks)
        expect(() =>
          JSON.parse(block.replace(/^<script[^>]*>/, "").replace(/<\/script>$/, "")),
        ).not.toThrow();
      const body = html.slice(html.indexOf("<body"));
      expect(body.match(/<h1[\s>]/g), "un solo h1").toHaveLength(1);
      expect(body).toContain(`data-path="${r}"`);
      expect(
        body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").length,
        "contenido renderizado",
      ).toBeGreaterThan(1500);
    });
  }

  it("404.html lleva noindex y su propio contenido", () => {
    const html = read("dist/404.html");
    expect(html).toMatch(/name="robots" content="noindex/);
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
  });

  it("sitemap.xml lista todas las rutas con su canónica y sus idiomas", () => {
    const xml = read("dist/sitemap.xml");
    for (const r of PUBLIC_ROUTES) expect(xml).toContain(`<loc>${getPageMeta(r).canonical}</loc>`);
    expect(xml.match(/<url>/g)).toHaveLength(PUBLIC_ROUTES.length);
    expect(xml).toContain('hreflang="x-default"');
  });

  it("robots.txt coherente con la indexación", () => {
    const txt = read("dist/robots.txt");
    if (getPageMeta("/").robots.includes("noindex")) expect(txt).toMatch(/Disallow: \//);
    else expect(txt).toMatch(/Sitemap: https:\/\/.+\/sitemap\.xml/);
  });

  it("las imágenes de marca existen (logo y la imagen para redes de 1200×630)", () => {
    expect(existsSync("dist/brand/logo.png")).toBe(true);
    expect(existsSync("dist/brand/og-image.jpg")).toBe(true);
  });
});
