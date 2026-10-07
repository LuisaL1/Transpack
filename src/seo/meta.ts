import { siteFor, postsFor } from "@/data/content";
import { aboutText } from "@/data/about";
import { SEO_TEXT } from "@/data/meta";
import { LANG_INFO, LANGS, langOf, localize, makeTr, toSpanish, type Lang } from "@/i18n";
import { BRAND, GOOGLE_VERIFICATION, INDEXABLE, SITE_URL, abs } from "@/seo/site";

// ─── Metadatos por ruta ─────────────────────────────────────────────────────
// Una sola función para el servidor (pre-generación de HTML en el build,
// scripts/prerender.mjs) y el navegador (SeoHead al cambiar de ruta), así ambos
// dicen exactamente lo mismo. El sitio está en seis idiomas: cada ruta lleva su
// idioma, su canónica y los enlaces hreflang a la misma página en los demás.

export type JsonLd = Record<string, unknown>;
export type PageMeta = {
  path: string;
  lang: Lang;
  title: string;
  description: string;
  canonical: string;
  robots: string;
  ogType: "website" | "article";
  image: string;
  imageAlt: string;
  /** La misma página en cada idioma (hreflang), con x-default en español */
  alternates: { hreflang: string; href: string }[];
  jsonLd: JsonLd[];
  notFound?: boolean;
  /** Para el sitemap */
  lastmod?: string;
  priority?: number;
};

const ORG_ID = `${SITE_URL}/#organizacion`;
const SITE_ID = `${SITE_URL}/#sitio`;

/** Recorta en un límite de palabra, sin pasar de `max` caracteres. */
export function clip(text: string, max = 158) {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.\s]+$/, "") + "…";
}

/** og:locale de cada idioma */
export const OG_LOCALE: Record<Lang, string> = {
  es: "es_CO",
  en: "en_US",
  fr: "fr_FR",
  de: "de_DE",
  it: "it_IT",
  ar: "ar_AR",
};

const AREA = [
  { "@type": "City", name: "Bogotá" },
  { "@type": "Country", name: "Colombia" },
];

// La empresa: MovingCompany es el tipo de LocalBusiness para empresas de
// mudanzas. Sin horario (openingHours): no hay uno confirmado en los documentos.
const organization = (): JsonLd => {
  const es = siteFor("es");
  return {
    "@type": "MovingCompany",
    "@id": ORG_ID,
    name: BRAND.legalName,
    alternateName: BRAND.name,
    url: SITE_URL + "/",
    logo: abs(BRAND.logo),
    image: abs(BRAND.ogImage),
    description: clip(SEO_TEXT.es.homeDescription, 300),
    slogan: BRAND.slogan,
    foundingDate: BRAND.foundingDate,
    email: BRAND.email,
    telephone: BRAND.phones[0],
    address: { "@type": "PostalAddress", ...BRAND.address },
    areaServed: AREA,
    contactPoint: BRAND.phones.map((telephone) => ({
      "@type": "ContactPoint",
      telephone,
      email: BRAND.email,
      contactType: "customer service",
      areaServed: "CO",
      availableLanguage: ["es", "en"],
    })),
    sameAs: BRAND.sameAs,
    knowsAbout: es.SERVICES.map((s) => s.title),
  };
};

const website = (): JsonLd => ({
  "@type": "WebSite",
  "@id": SITE_ID,
  url: SITE_URL + "/",
  name: BRAND.name,
  inLanguage: LANGS.map((l) => LANG_INFO[l].locale),
  publisher: { "@id": ORG_ID },
});

const graph = (...nodes: JsonLd[]): JsonLd => ({
  "@context": "https://schema.org",
  "@graph": [organization(), website(), ...nodes],
});

const breadcrumb = (items: [string, string][]): JsonLd => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, path], i) => ({
    "@type": "ListItem",
    position: i + 1,
    name,
    item: abs(path),
  })),
});

const webPage = (
  path: string,
  lang: Lang,
  name: string,
  description: string,
  type = "WebPage",
): JsonLd => ({
  "@type": type,
  "@id": abs(path) + "#pagina",
  url: abs(path),
  name,
  description,
  inLanguage: LANG_INFO[lang].locale,
  isPartOf: { "@id": SITE_ID },
  about: { "@id": ORG_ID },
});

/** Ruta en español → la misma página en cada idioma (+ x-default en español). */
const alternatesOf = (esPath: string) => [
  ...LANGS.map((l) => ({ hreflang: LANG_INFO[l].hreflang, href: abs(localize(esPath, l)) })),
  { hreflang: "x-default", href: abs(esPath) },
];

const base = (path: string, lang: Lang, esPath: string) => ({
  path,
  lang,
  canonical: path === "/" ? SITE_URL + "/" : abs(path),
  robots: INDEXABLE
    ? "index, follow, max-image-preview:large, max-snippet:-1"
    : "noindex, nofollow",
  image: abs(BRAND.ogImage),
  imageAlt: `${BRAND.legalName} · ${BRAND.slogan}`,
  ogType: "website" as const,
  alternates: alternatesOf(esPath),
});

/** Título "Servicio en Bogotá, Colombia | Marca" (sin "Colombia" si pasa de 70). */
function cityTitle(name: string, lang: Lang) {
  const t = SEO_TEXT[lang];
  const long = `${name} ${t.inCity} | ${t.brand}`;
  return long.length <= 70 ? long : `${name} ${t.inCityShort} | ${t.brand}`;
}

function homeMeta(lang: Lang): PageMeta {
  const t = SEO_TEXT[lang];
  const { SERVICES, FAQS } = siteFor(lang);
  const path = localize("/", lang);
  const title = t.homeTitle;
  const description = clip(t.homeDescription);
  return {
    ...base(path, lang, "/"),
    title,
    description,
    priority: lang === "es" ? 1 : 0.8,
    jsonLd: [
      graph(
        webPage(path, lang, title, description),
        {
          "@type": "ItemList",
          name: t.servicesList,
          itemListElement: SERVICES.map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: s.title,
            url: abs(localize(`/servicios/${s.slug}`, lang)),
          })),
        },
        {
          "@type": "FAQPage",
          inLanguage: LANG_INFO[lang].locale,
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        },
      ),
    ],
  };
}

function aboutMeta(lang: Lang): PageMeta {
  const t = SEO_TEXT[lang];
  const path = localize("/nosotros", lang);
  const title = t.aboutTitle;
  const description = clip(aboutText(makeTr(lang)).somosOrganizacionConsolidadaDesde);
  return {
    ...base(path, lang, "/nosotros"),
    title,
    description,
    priority: 0.7,
    jsonLd: [
      graph(
        webPage(path, lang, title, description, "AboutPage"),
        breadcrumb([
          [t.breadcrumb.home, localize("/", lang)],
          [t.breadcrumb.about, path],
        ]),
      ),
    ],
  };
}

function privacyMeta(lang: Lang): PageMeta {
  const t = SEO_TEXT[lang];
  const path = localize("/privacidad", lang);
  const title = t.privacyTitle;
  const description = t.privacyDescription;
  return {
    ...base(path, lang, "/privacidad"),
    title,
    description,
    priority: 0.3,
    jsonLd: [
      graph(
        webPage(path, lang, title, description),
        breadcrumb([
          [t.breadcrumb.home, localize("/", lang)],
          [t.breadcrumb.privacy, path],
        ]),
      ),
    ],
  };
}

function serviceMeta(slug: string, lang: Lang): PageMeta | null {
  const s = siteFor(lang).SERVICES.find((x) => x.slug === slug);
  if (!s) return null;
  const t = SEO_TEXT[lang];
  const esPath = `/servicios/${slug}`;
  const path = localize(esPath, lang);
  const title = cityTitle(s.title, lang);
  const description = clip(`${s.title}: ${s.short}`);
  return {
    ...base(path, lang, esPath),
    title,
    description,
    image: abs(s.image),
    imageAlt: s.title,
    priority: 0.9,
    jsonLd: [
      graph(
        webPage(path, lang, title, description),
        {
          "@type": "Service",
          "@id": abs(path) + "#servicio",
          name: s.title,
          serviceType: s.title,
          description: s.intro,
          provider: { "@id": ORG_ID },
          areaServed: AREA,
          url: abs(path),
          inLanguage: LANG_INFO[lang].locale,
        },
        breadcrumb([
          [t.breadcrumb.home, localize("/", lang)],
          [t.breadcrumb.services, localize("/", lang) + "#servicios"],
          [s.title, path],
        ]),
      ),
    ],
  };
}

function articleMeta(slug: string, lang: Lang): PageMeta | null {
  const post = postsFor(lang).find((p) => p.slug === slug);
  if (!post) return null;
  const t = SEO_TEXT[lang];
  const esPath = `/blog/${slug}`;
  const path = localize(esPath, lang);
  // El título del artículo se recorta para que la marca siempre quede al final
  const suffix = ` | ${t.brand}`;
  const title = clip(post.title, 70 - suffix.length) + suffix;
  const description = clip(post.excerpt);
  const image = abs(post.cover);
  // Los artículos no tienen fecha en el contenido del cliente: no se inventa
  // (sin datePublished/dateModified; ver pendientes en docs/seo.md).
  return {
    ...base(path, lang, esPath),
    title,
    description,
    ogType: "article",
    image,
    imageAlt: post.title,
    priority: 0.6,
    jsonLd: [
      graph(
        webPage(path, lang, post.title, description),
        {
          "@type": "BlogPosting",
          "@id": abs(path) + "#articulo",
          headline: clip(post.title, 110),
          description,
          image: [image],
          inLanguage: LANG_INFO[lang].locale,
          articleSection: post.cat,
          author: { "@id": ORG_ID },
          publisher: { "@id": ORG_ID },
          mainEntityOfPage: { "@id": abs(path) + "#pagina" },
        },
        breadcrumb([
          [t.breadcrumb.home, localize("/", lang)],
          ["Blog", localize("/", lang) + "#blog"],
          [post.title, path],
        ]),
      ),
    ],
  };
}

function notFoundMeta(path: string, lang: Lang): PageMeta {
  const t = SEO_TEXT[lang];
  return {
    ...base(path, lang, "/"),
    canonical: lang === "es" ? SITE_URL + "/" : abs(localize("/", lang)),
    robots: "noindex, follow",
    notFound: true,
    alternates: [],
    title: t.notFoundTitle,
    description: t.notFoundDescription,
    jsonLd: [],
  };
}

/** Metadatos de cualquier ruta (las desconocidas devuelven la página 404). */
export function getPageMeta(pathname: string): PageMeta {
  const path = pathname.replace(/\/+$/, "") || "/";
  const lang = langOf(path);
  const es = toSpanish(path);
  // Solo la forma canónica de cada ruta en su idioma (p. ej. /en/about, no /en/nosotros)
  const page = (() => {
    if (localize(es, lang) !== path) return null;
    if (es === "/") return homeMeta(lang);
    if (es === "/nosotros") return aboutMeta(lang);
    if (es === "/privacidad") return privacyMeta(lang);
    const svc = es.match(/^\/servicios\/([a-z0-9-]+)$/);
    if (svc) return serviceMeta(svc[1], lang);
    const art = es.match(/^\/blog\/([a-z0-9-]+)$/);
    if (art) return articleMeta(art[1], lang);
    return null;
  })();
  return page ?? notFoundMeta(path, lang);
}

/** Todas las rutas públicas en los seis idiomas (pre-generación y sitemap). */
export const PUBLIC_ROUTES: string[] = LANGS.flatMap((l) => [
  localize("/", l),
  localize("/nosotros", l),
  localize("/privacidad", l),
  ...siteFor("es").SERVICES.map((s) => localize(`/servicios/${s.slug}`, l)),
  ...postsFor("es").map((p) => localize(`/blog/${p.slug}`, l)),
]);

// ─── HTML del <head> (lo usa la pre-generación) ─────────────────────────────
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// JSON-LD dentro de <script>: se escapa "<" para que ningún texto cierre la etiqueta.
export const jsonForScript = (o: JsonLd) => JSON.stringify(o).replace(/</g, "\\u003c");

export function renderHeadTags(m: PageMeta): string {
  const tags = [
    `<title data-seo>${esc(m.title)}</title>`,
    `<meta data-seo name="description" content="${esc(m.description)}" />`,
    `<meta data-seo name="robots" content="${m.robots}" />`,
    `<link data-seo rel="canonical" href="${esc(m.canonical)}" />`,
    ...m.alternates.map(
      (a) => `<link data-seo rel="alternate" hreflang="${a.hreflang}" href="${esc(a.href)}" />`,
    ),
    `<meta data-seo property="og:site_name" content="${BRAND.name}" />`,
    `<meta data-seo property="og:locale" content="${OG_LOCALE[m.lang]}" />`,
    `<meta data-seo property="og:type" content="${m.ogType}" />`,
    `<meta data-seo property="og:title" content="${esc(m.title)}" />`,
    `<meta data-seo property="og:description" content="${esc(m.description)}" />`,
    `<meta data-seo property="og:url" content="${esc(m.canonical)}" />`,
    `<meta data-seo property="og:image" content="${esc(m.image)}" />`,
    `<meta data-seo property="og:image:alt" content="${esc(m.imageAlt)}" />`,
    `<meta data-seo name="twitter:card" content="summary_large_image" />`,
    `<meta data-seo name="twitter:title" content="${esc(m.title)}" />`,
    `<meta data-seo name="twitter:description" content="${esc(m.description)}" />`,
    `<meta data-seo name="twitter:image" content="${esc(m.image)}" />`,
    ...(GOOGLE_VERIFICATION
      ? [`<meta name="google-site-verification" content="${esc(GOOGLE_VERIFICATION)}" />`]
      : []),
    ...m.jsonLd.map(
      (o) => `<script data-seo type="application/ld+json">${jsonForScript(o)}</script>`,
    ),
  ];
  return tags.join("\n    ");
}
