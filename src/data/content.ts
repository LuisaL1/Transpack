// Devuelve el contenido del sitio en el idioma de la URL actual.
import * as es from "@/data/site";
import * as en from "@/data/site.en";
import * as fr from "@/data/site.fr";
import * as de from "@/data/site.de";
import * as it from "@/data/site.it";
import * as ar from "@/data/site.ar";
import { blogPosts as postsEs, type Post } from "@/data/blogData";
import { blogPosts as postsEn } from "@/data/blogData.en";
import { blogPosts as postsFr } from "@/data/blogData.fr";
import { blogPosts as postsDe } from "@/data/blogData.de";
import { blogPosts as postsIt } from "@/data/blogData.it";
import { blogPosts as postsAr } from "@/data/blogData.ar";
import { useLang, type Lang } from "@/i18n";

export type SiteContent = typeof es;

const SITES: Record<Lang, SiteContent> = {
  es,
  en: en as unknown as SiteContent,
  fr: fr as unknown as SiteContent,
  de: de as unknown as SiteContent,
  it: it as unknown as SiteContent,
  ar: ar as unknown as SiteContent,
};
const POSTS: Record<Lang, Post[]> = {
  es: postsEs,
  en: postsEn,
  fr: postsFr,
  de: postsDe,
  it: postsIt,
  ar: postsAr,
};

export const siteFor = (lang: Lang): SiteContent => SITES[lang];
export const postsFor = (lang: Lang) => POSTS[lang];

export function useSite() {
  const { lang } = useLang();
  return siteFor(lang);
}

export function usePosts() {
  const { lang } = useLang();
  return postsFor(lang);
}

// Nombres de los destinos del mapa en cada idioma (clave = nombre en español)
export const DESTINATION_NAMES: Record<string, Record<Exclude<Lang, "es">, string>> = {
  "Estados Unidos": {
    en: "United States",
    fr: "États-Unis",
    de: "USA",
    it: "Stati Uniti",
    ar: "الولايات المتحدة",
  },
  Canadá: { en: "Canada", fr: "Canada", de: "Kanada", it: "Canada", ar: "كندا" },
  México: { en: "Mexico", fr: "Mexique", de: "Mexiko", it: "Messico", ar: "المكسيك" },
  España: { en: "Spain", fr: "Espagne", de: "Spanien", it: "Spagna", ar: "إسبانيا" },
  Francia: { en: "France", fr: "France", de: "Frankreich", it: "Francia", ar: "فرنسا" },
  Alemania: { en: "Germany", fr: "Allemagne", de: "Deutschland", it: "Germania", ar: "ألمانيا" },
  Italia: { en: "Italy", fr: "Italie", de: "Italien", it: "Italia", ar: "إيطاليا" },
  Egipto: { en: "Egypt", fr: "Égypte", de: "Ägypten", it: "Egitto", ar: "مصر" },
  "Emiratos Árabes": {
    en: "United Arab Emirates",
    fr: "Émirats arabes unis",
    de: "Vereinigte Arabische Emirate",
    it: "Emirati Arabi Uniti",
    ar: "الإمارات",
  },
  India: { en: "India", fr: "Inde", de: "Indien", it: "India", ar: "الهند" },
};

export const destinationName = (name: string, lang: Lang) =>
  lang === "es" ? name : (DESTINATION_NAMES[name]?.[lang] ?? name);

export function useDestinationName() {
  const { lang } = useLang();
  return (name: string) => destinationName(name, lang);
}
