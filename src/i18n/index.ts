// Idiomas del sitio: español en la raíz ("/") e inglés con prefijo ("/en").
// El idioma sale de la URL, así cada versión tiene sus propias direcciones
// para Google (hreflang).
//
// Textos cortos: tr("español", "English").
import { useCallback } from "react";
import { useLocation } from "react-router-dom";

export type Lang = "es" | "en";
/** Idiomas del sitio: rutas, selector de idioma, hreflang y sitemap */
export const LANGS: Lang[] = ["es", "en"];

export const LANG_INFO: Record<Lang, { name: string; locale: string; hreflang: string }> = {
  es: { name: "Español", locale: "es-CO", hreflang: "es" },
  en: { name: "English", locale: "en-US", hreflang: "en" },
};

export type Tr = (es: string, en: string) => string;

/** Traductor de textos cortos para un idioma */
export const makeTr =
  (lang: Lang): Tr =>
  (es, en) =>
    lang === "es" ? es : en;

// ─── Rutas ────────────────────────────────────────────────────────────────────

type L = Exclude<Lang, "es">;

// Secciones con nombre propio en cada idioma
const SECTIONS: Record<string, Record<L, string>> = {
  servicios: { en: "services" },
  nosotros: { en: "about" },
  privacidad: {
    en: "privacy",
  },
};

// Slugs de servicios y artículos
const SLUGS: Record<string, Record<L, string>> = {
  "mudanzas-locales": {
    en: "local-moving",
  },
  "mudanzas-nacionales": {
    en: "national-moving",
  },
  "mudanzas-internacionales": {
    en: "international-moving",
  },
  bodegaje: {
    en: "storage",
  },
  "embalaje-especializado": {
    en: "specialized-packing",
  },
  "gestion-aduanera": {
    en: "customs-and-documentation",
  },
  "por-que-una-mudanza-maritima-internacional-puede-tardar": {
    en: "why-an-international-sea-move-can-take-longer",
  },
  "elegancia-en-transito-seguridad-mudanzas-internacionales-premium": {
    en: "elegance-in-transit-security-premium-international-moves",
  },
  "empresa-de-mudanzas-internacionales-en-colombia-58-anos": {
    en: "international-moving-company-colombia-58-years",
  },
};

const PREFIXED = LANGS.filter((l) => l !== "es") as L[];

/** Idioma de una ruta (el español va sin prefijo) */
export const langOf = (pathname: string): Lang => {
  const first = pathname.split("/")[1] as L;
  return PREFIXED.includes(first) ? first : "es";
};

const splitPath = (path: string) => {
  const m = path.match(/^([^?#]*)(.*)$/);
  return { pathname: m?.[1] || "/", rest: m?.[2] ?? "" };
};

const toLocal = (part: string, lang: L) => SECTIONS[part]?.[lang] ?? SLUGS[part]?.[lang] ?? part;
const fromLocal = (part: string, lang: L) =>
  Object.keys(SECTIONS).find((k) => SECTIONS[k][lang] === part) ??
  Object.keys(SLUGS).find((k) => SLUGS[k][lang] === part) ??
  part;

/** Slug en cualquier idioma → slug en español (para buscar el contenido) */
export const slugEs = (slug: string, lang: Lang) => (lang === "es" ? slug : fromLocal(slug, lang));

/** Ruta en español → la misma ruta en el idioma pedido */
export function localize(path: string, lang: Lang): string {
  if (lang === "es") return path;
  const { pathname, rest } = splitPath(path);
  const p = pathname
    .split("/")
    .map((part) => toLocal(part, lang))
    .join("/");
  return (p === "/" ? `/${lang}` : `/${lang}${p}`) + rest;
}

/** Ruta en cualquier idioma → su equivalente en español */
export function toSpanish(path: string): string {
  const { pathname, rest } = splitPath(path);
  const lang = langOf(pathname);
  if (lang === "es") return path;
  const p =
    pathname
      .slice(lang.length + 1)
      .split("/")
      .map((part) => fromLocal(part, lang))
      .join("/") || "/";
  return p + rest;
}

/** Idioma actual + utilidades para enlazar y traducir textos cortos */
export function useLang() {
  const { pathname, search, hash } = useLocation();
  const lang = langOf(pathname);
  const lp = useCallback((path: string) => localize(path, lang), [lang]);
  const tr = useCallback<Tr>((es, en) => makeTr(lang)(es, en), [lang]);
  // La página actual en otro idioma (para el selector)
  const switchTo = (target: Lang) => localize(toSpanish(pathname + search + hash), target);
  return { lang, lp, tr, switchTo };
}
