// Motor del buscador del sitio: busca sin tildes ni mayúsculas, exige que
// aparezcan todas las palabras escritas (de 2 letras o más) y prioriza las
// coincidencias en el título. Devuelve como máximo 8 resultados.
import { stripAccents as normalizeSearch } from "@/lib/text";

export type SearchEntry = {
  kind: string;
  icon: string;
  title: string;
  desc: string;
  to: string;
  extra?: string;
};

export function search(index: SearchEntry[], query: string): SearchEntry[] {
  const words = normalizeSearch(query)
    .split(/\s+/)
    .filter((w) => w.length > 1);
  if (!words.length) return [];
  return index
    .map((e) => {
      const title = normalizeSearch(e.title);
      const all = normalizeSearch(`${e.title} ${e.desc} ${e.kind} ${e.extra ?? ""}`);
      if (!words.every((w) => all.includes(w))) return null;
      const score =
        words.reduce((n, w) => n + (title.includes(w) ? 3 : 1), 0) +
        (title.startsWith(words[0]) ? 2 : 0);
      return { e, score };
    })
    .filter((r): r is { e: SearchEntry; score: number } => r !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((r) => r.e);
}
