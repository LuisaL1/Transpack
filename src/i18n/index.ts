// Idiomas del sitio. Español en la raíz ("/") y los demás con prefijo
// ("/en", "/fr", "/de", "/it", "/ar"). El idioma sale de la URL, así cada
// versión tiene sus propias direcciones para Google (hreflang).
//
// Textos cortos: tr("español", "English") → en francés, alemán, italiano y
// árabe se buscan en src/i18n/dict/<idioma>.ts usando el texto en inglés como
// clave. Si un texto lleva variables, se pasa el tercer argumento con cada
// idioma: tr(`Hola ${n}`, `Hi ${n}`, { fr: `Bonjour ${n}`, ... }).
import { useCallback } from "react";
import { useLocation } from "react-router-dom";
import fr from "@/i18n/dict/fr";
import de from "@/i18n/dict/de";
import it from "@/i18n/dict/it";
import ar from "@/i18n/dict/ar";

export type Lang = "es" | "en" | "fr" | "de" | "it" | "ar";
export const LANGS: Lang[] = ["es", "en", "fr", "de", "it", "ar"];

export const LANG_INFO: Record<
  Lang,
  { name: string; locale: string; hreflang: string; dir: "ltr" | "rtl" }
> = {
  es: { name: "Español", locale: "es-CO", hreflang: "es", dir: "ltr" },
  en: { name: "English", locale: "en-US", hreflang: "en", dir: "ltr" },
  fr: { name: "Français", locale: "fr-FR", hreflang: "fr", dir: "ltr" },
  de: { name: "Deutsch", locale: "de-DE", hreflang: "de", dir: "ltr" },
  it: { name: "Italiano", locale: "it-IT", hreflang: "it", dir: "ltr" },
  ar: { name: "العربية", locale: "ar", hreflang: "ar", dir: "rtl" },
};

const DICT: Partial<Record<Lang, Record<string, string>>> = { fr, de, it, ar };

export type Others = Partial<Record<Exclude<Lang, "es" | "en">, string>>;
export type Tr = (es: string, en: string, others?: Others) => string;

/** Traductor de textos cortos para un idioma */
export const makeTr =
  (lang: Lang): Tr =>
  (es, en, others) => {
    if (lang === "es") return es;
    if (lang === "en") return en;
    return others?.[lang] ?? DICT[lang]?.[en] ?? en;
  };

// ─── Rutas ────────────────────────────────────────────────────────────────────

type L = Exclude<Lang, "es">;

// Secciones con nombre propio en cada idioma
const SECTIONS: Record<string, Record<L, string>> = {
  servicios: { en: "services", fr: "services", de: "leistungen", it: "servizi", ar: "services" },
  nosotros: { en: "about", fr: "a-propos", de: "ueber-uns", it: "chi-siamo", ar: "about" },
};

// Slugs de servicios y artículos (el árabe usa los del inglés: URLs legibles)
const SLUGS: Record<string, Record<L, string>> = {
  "mudanzas-locales": {
    en: "local-moving",
    fr: "demenagement-local",
    de: "lokaler-umzug",
    it: "trasloco-locale",
    ar: "local-moving",
  },
  "mudanzas-nacionales": {
    en: "national-moving",
    fr: "demenagement-national",
    de: "nationaler-umzug",
    it: "trasloco-nazionale",
    ar: "national-moving",
  },
  "mudanzas-internacionales": {
    en: "international-moving",
    fr: "demenagement-international",
    de: "internationaler-umzug",
    it: "trasloco-internazionale",
    ar: "international-moving",
  },
  bodegaje: {
    en: "storage",
    fr: "garde-meubles",
    de: "einlagerung",
    it: "deposito-mobili",
    ar: "storage",
  },
  "embalaje-especializado": {
    en: "specialized-packing",
    fr: "emballage-specialise",
    de: "spezialverpackung",
    it: "imballaggio-specializzato",
    ar: "specialized-packing",
  },
  "gestion-aduanera": {
    en: "customs-and-documentation",
    fr: "douane-et-documentation",
    de: "zoll-und-dokumente",
    it: "dogana-e-documenti",
    ar: "customs-and-documentation",
  },
  "por-que-una-mudanza-maritima-internacional-puede-tardar": {
    en: "why-an-international-sea-move-can-take-longer",
    fr: "pourquoi-un-demenagement-maritime-international-peut-prendre-plus-de-temps",
    de: "warum-ein-internationaler-seeumzug-laenger-dauern-kann",
    it: "perche-un-trasloco-marittimo-internazionale-puo-richiedere-piu-tempo",
    ar: "why-an-international-sea-move-can-take-longer",
  },
  "elegancia-en-transito-seguridad-mudanzas-internacionales-premium": {
    en: "elegance-in-transit-security-premium-international-moves",
    fr: "elegance-en-transit-securite-demenagements-internationaux-premium",
    de: "eleganz-unterwegs-sicherheit-bei-premium-umzuegen-ins-ausland",
    it: "eleganza-in-transito-sicurezza-traslochi-internazionali-premium",
    ar: "elegance-in-transit-security-premium-international-moves",
  },
  "empresa-de-mudanzas-internacionales-en-colombia-58-anos": {
    en: "international-moving-company-colombia-58-years",
    fr: "entreprise-de-demenagement-international-en-colombie-58-ans",
    de: "internationales-umzugsunternehmen-in-kolumbien-58-jahre",
    it: "azienda-di-traslochi-internazionali-in-colombia-58-anni",
    ar: "international-moving-company-colombia-58-years",
  },
};

const PREFIXED = LANGS.filter((l) => l !== "es") as L[];

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
  const tr = useCallback<Tr>((es, en, others) => makeTr(lang)(es, en, others), [lang]);
  // La página actual en otro idioma (para el selector)
  const switchTo = (target: Lang) => localize(toSpanish(pathname + search + hash), target);
  return { lang, lp, tr, switchTo, dir: LANG_INFO[lang].dir };
}
