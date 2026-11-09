import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET, TTL_MS, clean, resetVideosCache } from "../../api/videos.mjs";
import { parseChannel } from "@/lib/videos";

// Función /api/videos (lee el canal de YouTube). Nunca se llama a YouTube de
// verdad: fetch se simula con la página del canal y su ytInitialData.
const page = (data: unknown) =>
  new Response(`<script>var ytInitialData = ${JSON.stringify({ contents: data })};</script>`);
const VIDEOS = {
  lockupViewModel: {
    contentId: "q7UCk22TbGI",
    metadata: { lockupMetadataViewModel: { title: { content: "El sentimiento #Transpack" } } },
  },
};
const SHORTS = {
  shortsLockupViewModel: {
    onTap: { innertubeCommand: { reelWatchEndpoint: { videoId: "DEAs21he8aQ" } } },
    overlayMetadata: { primaryText: { content: "Traslado de sede 🚚" } },
  },
};
const youtube = () =>
  vi.fn(async (url: string) => page(String(url).endsWith("/shorts") ? [SHORTS] : [VIDEOS]));

beforeEach(() => resetVideosCache());
afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("/api/videos", () => {
  it("lee los videos y Shorts del canal, con títulos sin hashtags ni emojis", async () => {
    vi.stubGlobal("fetch", youtube());
    const res = await GET();
    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toMatch(/max-age=3600/);
    const data = await res.json();
    expect(data.videos).toEqual([{ id: "q7UCk22TbGI", title: "El sentimiento", duration: "" }]);
    expect(data.shorts).toEqual([{ id: "DEAs21he8aQ", title: "Traslado de sede" }]);
  });

  it("guarda la lista 6 horas: no consulta YouTube en cada visita", async () => {
    const yt = youtube();
    vi.stubGlobal("fetch", yt);
    vi.useFakeTimers();
    await GET();
    await GET();
    expect(yt).toHaveBeenCalledTimes(2); // pestañas Videos y Shorts, una vez
    vi.advanceTimersByTime(TTL_MS + 1);
    await GET();
    expect(yt).toHaveBeenCalledTimes(4);
  });

  it("si YouTube falla, entrega la última lista buena; sin lista, 502", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("<html>consent</html>")),
    );
    expect((await GET()).status).toBe(502);
    vi.stubGlobal("fetch", youtube());
    vi.useFakeTimers();
    await GET();
    vi.advanceTimersByTime(TTL_MS + 1);
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("<html>consent</html>")),
    );
    const res = await GET();
    expect(res.status).toBe(200);
    expect((await res.json()).shorts).toHaveLength(1);
  });

  it("limpia títulos: sin hashtags; si era solo hashtags, el primero", () => {
    expect(clean("mudanzas internacionales #mudanza #bogota")).toBe("Mudanzas internacionales");
    expect(clean("#Transpack #mudanzas")).toBe("Transpack");
  });
});

describe("Maestría Transpack · lista al día en el navegador (parseChannel)", () => {
  it("acepta solo videos con id de YouTube y título", () => {
    expect(
      parseChannel({
        ok: true,
        videos: [
          { id: "q7UCk22TbGI", title: "Video" },
          { id: "x", title: "malo" },
        ],
        shorts: [
          { id: "DEAs21he8aQ", title: "" },
          { id: "vHyz6P-loEU", title: "Short" },
        ],
      }),
    ).toEqual({
      videos: [{ id: "q7UCk22TbGI", title: "Video" }],
      shorts: [{ id: "vHyz6P-loEU", title: "Short" }],
    });
  });

  it("sin respuesta válida devuelve null (se queda la lista guardada)", () => {
    expect(parseChannel({ ok: false, error: "youtube" })).toBeNull();
    expect(parseChannel({ ok: true, videos: [], shorts: [] })).toBeNull();
    expect(parseChannel("<html>")).toBeNull();
  });
});
