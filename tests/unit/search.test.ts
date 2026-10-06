import { describe, expect, it } from "vitest";
import { SEARCH_SUGGESTIONS, searchSite } from "@/data/search";
import { LANGS } from "@/i18n";

// Buscador del sitio (contenido en src/data/search.ts, motor en src/lib/search.ts)
describe("Buscador", () => {
  it("encuentra sin tildes ni mayúsculas", () => {
    expect(searchSite("es", "MUDANZA INTERNACIONAL")[0].title).toMatch(/internacionales/i);
    expect(searchSite("es", "gestion aduanera").some((r) => /aduanera/i.test(r.title))).toBe(true);
  });

  it("exige todas las palabras y pide al menos 2 letras", () => {
    expect(searchSite("es", "a")).toEqual([]);
    expect(searchSite("es", "bodegaje xyzzy")).toEqual([]);
  });

  it("lleva un país del mapa a la mudanza internacional", () => {
    expect(searchSite("es", "japon").some((r) => r.to.includes("mudanzas-internacionales"))).toBe(
      true,
    );
  });

  it("muestra como máximo 8 resultados, cada uno con destino", () => {
    const r = searchSite("es", "de");
    expect(r.length).toBeLessThanOrEqual(8);
    for (const e of searchSite("es", "mudanza")) expect(e.to).toMatch(/^\//);
  });

  it("en otros idiomas devuelve rutas en ese idioma", () => {
    expect(searchSite("en", "storage")[0].to).toMatch(/^\/en\//);
  });

  it("cada búsqueda sugerida tiene resultados en su idioma", () => {
    for (const lang of LANGS)
      for (const s of SEARCH_SUGGESTIONS[lang])
        expect(searchSite(lang, s).length, `${lang}: ${s}`).toBeGreaterThan(0);
  });
});
