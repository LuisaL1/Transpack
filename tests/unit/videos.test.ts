import { describe, expect, it } from "vitest";
import { CHANNEL_SHORTS, CHANNEL_VIDEOS } from "@/data/youtubeVideos";
import { headerText, footerText } from "@/data/navigation";
import { makeTr } from "@/i18n";

// Nuestros empaques (/videos): lista generada con `pnpm videos`
describe("Nuestros empaques · videos del canal", () => {
  const all = [...CHANNEL_VIDEOS, ...CHANNEL_SHORTS];

  it("tiene videos, sin repetidos y con ids de YouTube válidos", () => {
    expect(all.length).toBeGreaterThan(0);
    expect(new Set(all.map((v) => v.id)).size).toBe(all.length);
    for (const v of all) expect(v.id).toMatch(/^[\w-]{11}$/);
  });

  it("los títulos no llevan hashtags ni quedan vacíos", () => {
    for (const v of all) {
      expect(v.title.trim()).not.toBe("");
      expect(v.title).not.toMatch(/#\p{L}/u);
    }
  });

  it("el enlace se llama «Nuestros empaques» en la cabecera y el pie", () => {
    const tr = makeTr("es");
    expect(headerText(tr).videos).toBe("Nuestros empaques");
    expect(footerText(tr).videos).toBe("Nuestros empaques");
  });
});
