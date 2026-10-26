// Contenido del sitio en cada idioma (los hooks que lo leen según la URL están
// en src/hooks/useContent.ts).
import * as es from "@/data/site";
import * as en from "@/data/site.en";
import { blogPosts as postsEs, type Post } from "@/data/blogData";
import { blogPosts as postsEn } from "@/data/blogData.en";
import type { Lang } from "@/i18n";

export type SiteContent = typeof es;

const SITES: Record<Lang, SiteContent> = {
  es,
  en: en as unknown as SiteContent,
};
const POSTS: Record<Lang, Post[]> = { es: postsEs, en: postsEn };

/** Contenido del idioma */
export const siteFor = (lang: Lang): SiteContent => SITES[lang];
export const postsFor = (lang: Lang): Post[] => POSTS[lang];

// Nombres de los destinos del mapa en cada idioma (clave = nombre en español)
export const DESTINATION_NAMES: Record<string, Record<Exclude<Lang, "es">, string>> = {
  "Estados Unidos": {
    en: "United States",
  },
  Canadá: { en: "Canada" },
  México: { en: "Mexico" },
  España: { en: "Spain" },
  Francia: { en: "France" },
  Alemania: { en: "Germany" },
  Italia: { en: "Italy" },
  Egipto: { en: "Egypt" },
  "Emiratos Árabes": {
    en: "United Arab Emirates",
  },
  India: { en: "India" },
  Brasil: { en: "Brazil" },
  Argentina: {
    en: "Argentina",
  },
  Chile: { en: "Chile" },
  Perú: { en: "Peru" },
  Marruecos: { en: "Morocco" },
  Nigeria: { en: "Nigeria" },
  Kenia: { en: "Kenya" },
  Sudáfrica: {
    en: "South Africa",
  },
  "Arabia Saudita": {
    en: "Saudi Arabia",
  },
  China: { en: "China" },
  Japón: { en: "Japan" },
  "Corea del Sur": {
    en: "South Korea",
  },
  Tailandia: { en: "Thailand" },
};

export const destinationName = (name: string, lang: Lang) =>
  lang === "es" ? name : (DESTINATION_NAMES[name]?.[lang] ?? name);
