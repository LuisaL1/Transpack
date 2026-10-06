import { describe, expect, it } from "vitest";
import { PUBLIC_ROUTES, clip, getPageMeta, renderHeadTags } from "@/seo/meta";
import { BRAND, SITE_URL } from "@/seo/site";
import { siteFor } from "@/data/content";
import { LANGS, localize } from "@/i18n";

// Metadatos SEO de cada ruta (los mismos que usa la pre-generación y SeoHead).
const metas = PUBLIC_ROUTES.map((r) => getPageMeta(r));
type Node = Record<string, unknown> & { "@type": string };
const nodes = (path: string) => getPageMeta(path).jsonLd.flatMap((g) => g["@graph"] as Node[]);
const types = (path: string) => nodes(path).map((n) => n["@type"]);

describe("SEO · metadatos por página", () => {
  it("cubre inicio, nosotros, 6 servicios y 3 artículos en los seis idiomas (66 rutas)", () => {
    expect(PUBLIC_ROUTES).toHaveLength(66);
    expect(new Set(PUBLIC_ROUTES).size).toBe(66);
    for (const l of LANGS) expect(PUBLIC_ROUTES).toContain(localize("/", l));
    expect(PUBLIC_ROUTES.filter((r) => r.startsWith("/servicios/"))).toHaveLength(6);
    expect(metas.every((m) => !m.notFound)).toBe(true);
  });

  it("títulos únicos, de 30 a 70 caracteres y con la marca", () => {
    expect(new Set(metas.map((m) => m.title)).size).toBe(metas.length);
    for (const m of metas) {
      expect(m.title.length, m.title).toBeGreaterThanOrEqual(30);
      expect(m.title.length, m.title).toBeLessThanOrEqual(70);
      expect(m.title, m.path).toMatch(/\| (Transpack|ترانسباك)$/);
    }
  });

  it("los servicios llevan la ciudad en el título", () => {
    for (const m of metas.filter((x) => /servic|leistung/.test(x.path)))
      expect(m.title, m.path).toMatch(/Bogot|بوغوتا/);
  });

  it("descripciones únicas y de 70 a 160 caracteres", () => {
    expect(new Set(metas.map((m) => m.description)).size).toBe(metas.length);
    for (const m of metas) {
      expect(m.description.length, m.description).toBeGreaterThanOrEqual(70);
      expect(m.description.length, m.description).toBeLessThanOrEqual(160);
    }
  });

  it("canónica absoluta en el dominio oficial, sin barra final (salvo el inicio)", () => {
    for (const m of metas) {
      expect(m.canonical.startsWith(SITE_URL + "/")).toBe(true);
      if (m.path !== "/") expect(m.canonical.endsWith("/"), m.canonical).toBe(false);
      expect(m.canonical).toBe(m.path === "/" ? SITE_URL + "/" : SITE_URL + m.path);
    }
  });

  it("cada página enlaza su versión en los seis idiomas + x-default (hreflang recíproco)", () => {
    for (const m of metas) {
      expect(m.alternates.map((a) => a.hreflang)).toEqual([...LANGS, "x-default"]);
      expect(m.alternates.map((a) => a.href)).toContain(m.canonical);
      // Cada alternativa existe y apunta de vuelta a esta página
      for (const a of m.alternates.slice(0, 6)) {
        const other = getPageMeta(a.href.replace(SITE_URL, "") || "/");
        expect(other.notFound, a.href).toBeFalsy();
        expect(other.alternates).toEqual(m.alternates);
      }
    }
  });

  it("imagen para redes con URL absoluta", () => {
    for (const m of metas) expect(m.image).toMatch(/^https:\/\//);
  });

  it("mientras no se active la indexación, todo lleva noindex", () => {
    for (const m of metas) expect(m.robots).toMatch(/noindex/);
  });

  it("rutas desconocidas o no canónicas → 404 con noindex y sin hreflang", () => {
    for (const p of [
      "/no-existe",
      "/servicios/no-existe",
      "/blog/no-existe",
      "/en/nosotros",
      "/xx",
    ]) {
      const m = getPageMeta(p);
      expect(m.notFound, p).toBe(true);
      expect(m.robots).toMatch(/noindex/);
      expect(m.alternates).toEqual([]);
    }
  });

  it("los artículos son og:type article con su portada", () => {
    for (const m of metas.filter((x) => x.path.includes("/blog/"))) {
      expect(m.ogType).toBe("article");
      expect(m.image).not.toContain("og-image");
    }
  });
});

describe("SEO · datos estructurados (JSON-LD)", () => {
  it("toda página pública incluye la empresa (MovingCompany, un LocalBusiness) y el sitio", () => {
    for (const r of PUBLIC_ROUTES)
      expect(types(r)).toEqual(expect.arrayContaining(["MovingCompany", "WebSite"]));
  });

  it("inicio: WebPage, lista de servicios y FAQPage con todas las preguntas, en cada idioma", () => {
    for (const l of LANGS) {
      const home = localize("/", l);
      expect(types(home)).toEqual(expect.arrayContaining(["WebPage", "ItemList", "FAQPage"]));
      const faq = nodes(home).find((n) => n["@type"] === "FAQPage");
      expect(faq?.mainEntity).toHaveLength(siteFor(l).FAQS.length);
    }
  });

  it("servicio: Service + migas; artículo: BlogPosting + migas; nosotros: AboutPage + migas", () => {
    expect(types("/servicios/bodegaje")).toEqual(
      expect.arrayContaining(["Service", "BreadcrumbList"]),
    );
    const art = PUBLIC_ROUTES.find((r) => r.startsWith("/blog/"))!;
    expect(types(art)).toEqual(expect.arrayContaining(["BlogPosting", "BreadcrumbList"]));
    expect(types("/nosotros")).toEqual(expect.arrayContaining(["AboutPage", "BreadcrumbList"]));
    expect(types("/en/about")).toEqual(expect.arrayContaining(["AboutPage", "BreadcrumbList"]));
  });

  it("los artículos no llevan fechas inventadas (el contenido no las tiene)", () => {
    for (const r of PUBLIC_ROUTES.filter((x) => x.includes("/blog/"))) {
      const post = nodes(r).find((n) => n["@type"] === "BlogPosting")!;
      expect(post.datePublished).toBeUndefined();
    }
  });

  it("la empresa: dirección en Bogotá, teléfono, correo y redes del sitio; sin horario inventado", () => {
    const org = nodes("/")[0];
    expect(org.address).toMatchObject({ addressLocality: "Bogotá", addressCountry: "CO" });
    expect(org.telephone).toMatch(/^\+57 /);
    expect(org.email).toBe(BRAND.email);
    expect(org.foundingDate).toBe("1968");
    expect((org.sameAs as string[]).length).toBeGreaterThanOrEqual(4);
    expect(org.openingHours).toBeUndefined();
    expect(org.openingHoursSpecification).toBeUndefined();
  });
});

describe("SEO · utilidades", () => {
  it("clip corta en palabra completa", () => {
    expect(clip("uno dos tres cuatro", 12)).toBe("uno dos…");
    expect(clip("corto", 12)).toBe("corto");
  });

  it("el HTML del head escapa comillas y el JSON-LD no puede cerrar la etiqueta", () => {
    const html = renderHeadTags({
      ...getPageMeta("/"),
      title: 'A "B" <script>',
      jsonLd: [{ x: "</script><script>alert(1)</script>" }],
    });
    expect(html).toContain("A &quot;B&quot; &lt;script&gt;");
    expect(html).not.toContain("</script><script>alert");
  });
});
