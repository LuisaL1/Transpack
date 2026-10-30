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
  Ecuador: { en: "Ecuador" },
  Venezuela: { en: "Venezuela" },
  Bolivia: { en: "Bolivia" },
  Paraguay: { en: "Paraguay" },
  Uruguay: { en: "Uruguay" },
  Senegal: { en: "Senegal" },
  Ghana: { en: "Ghana" },
  Angola: { en: "Angola" },
  Etiopía: { en: "Ethiopia" },
  Guatemala: { en: "Guatemala" },
  Belice: { en: "Belize" },
  Honduras: { en: "Honduras" },
  "El Salvador": { en: "El Salvador" },
  Nicaragua: { en: "Nicaragua" },
  "Costa Rica": { en: "Costa Rica" },
  Panamá: { en: "Panama" },
  Cuba: { en: "Cuba" },
  "República Dominicana": { en: "Dominican Republic" },
  Haití: { en: "Haiti" },
  "Puerto Rico": { en: "Puerto Rico" },
  Guyana: { en: "Guyana" },
  Surinam: { en: "Suriname" },
  Portugal: { en: "Portugal" },
  "Reino Unido": { en: "United Kingdom" },
  "Países Bajos": { en: "Netherlands" },
  Suiza: { en: "Switzerland" },
  Suecia: { en: "Sweden" },
  Polonia: { en: "Poland" },
};

export const destinationName = (name: string, lang: Lang) =>
  lang === "es" ? name : (DESTINATION_NAMES[name]?.[lang] ?? name);
