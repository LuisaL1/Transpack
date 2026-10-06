// Contenido del sitio en el idioma de la URL actual.
import { useLang } from "@/i18n";
import { destinationName, postsFor, siteFor } from "@/data/content";

export function useSite() {
  const { lang } = useLang();
  return siteFor(lang);
}

export function usePosts() {
  const { lang } = useLang();
  return postsFor(lang);
}

export function useDestinationName() {
  const { lang } = useLang();
  return (name: string) => destinationName(name, lang);
}
