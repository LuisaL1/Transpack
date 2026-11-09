// Función del servidor: videos y Shorts del canal de YouTube de Transpack, para
// que "Maestría Transpack" (/videos) se actualice sola cuando el canal publique.
// Lee las pestañas "Videos" y "Shorts" del canal (con sus páginas siguientes),
// del más nuevo al más antiguo, sin clave de API. La respuesta se guarda 6 horas
// en memoria; si YouTube falla, se entrega la última lista buena.
//
// La misma lectura la usa `pnpm videos` (scripts/fetch-youtube-videos.mjs) para
// guardar la lista en src/data/youtubeVideos.ts: es la que va en el HTML
// pre-generado (buscadores) y el respaldo si esta función no responde.
// Este archivo no importa nada de src/.

const CHANNEL = "https://www.youtube.com/@TranspackSAS";
/** Cada cuánto se vuelve a leer el canal */
export const TTL_MS = 6 * 60 * 60 * 1000;
// SOCS: acepta el aviso de cookies de YouTube (si no, devuelve esa página)
const HEADERS = {
  "accept-language": "es-CO,es;q=0.9",
  "user-agent": "Mozilla/5.0",
  cookie: "SOCS=CAI",
};

function* walk(o, key) {
  if (Array.isArray(o)) for (const x of o) yield* walk(x, key);
  else if (o && typeof o === "object")
    for (const [k, v] of Object.entries(o)) {
      if (k === key) yield v;
      yield* walk(v, key);
    }
}

// Títulos que pierden sentido sin sus hashtags
const FIXED = {
  v6dqHzaYMC8: "Aspectos comunes en una mudanza internacional",
  vGs0LeQMyGs: "Mudanzas internacionales",
};

/** Título sin hashtags, emojis ni espacios de más; si era solo hashtags, el primero */
export const clean = (title) => {
  const t = title
    .replace(/#[\p{L}\p{N}_]+/gu, " ")
    // eslint-disable-next-line security/detect-unsafe-regex -- alternativas de un solo carácter, sin repeticiones anidadas
    .replace(/\p{Extended_Pictographic}|\u{FE0F}|\u{200D}|[\u{1F3FB}-\u{1F3FF}]/gu, " ")
    .replace(/\s+/g, " ")
    .replace(/[\s,.;:-]+$/, "")
    .trim();
  const tag = title.match(/#([\p{L}\p{N}_]+)/u)?.[1] ?? "Transpack";
  const s = t || tag;
  return s[0].toUpperCase() + s.slice(1);
};

async function tab(name, read) {
  const html = await (await fetch(`${CHANNEL}/${name}`, { headers: HEADERS })).text();
  const json = html.match(/var ytInitialData = (\{.*?\});<\/script>/s)?.[1];
  // Sin datos: YouTube respondió otra página (aviso de cookies, límite de pedidos)
  if (!json) throw new Error(`YouTube no devolvió la pestaña "${name}"`);
  const data = JSON.parse(json);
  const key = html.match(/"INNERTUBE_API_KEY":"([^"]+)"/)?.[1];
  const version = html.match(/"INNERTUBE_CLIENT_VERSION":"([^"]+)"/)?.[1];
  const items = read(data);
  let token = [...walk(data, "continuationCommand")].at(-1)?.token;
  while (token && key && version) {
    const res = await fetch(`https://www.youtube.com/youtubei/v1/browse?key=${key}`, {
      method: "POST",
      headers: { ...HEADERS, "content-type": "application/json" },
      body: JSON.stringify({
        context: { client: { clientName: "WEB", clientVersion: version, hl: "es" } },
        continuation: token,
      }),
    });
    const page = await res.json();
    const more = read(page);
    if (!more.length) break;
    items.push(...more);
    token = [...walk(page, "continuationCommand")].at(-1)?.token;
  }
  return items;
}

const uniq = (list) => list.filter((v, i) => v.id && list.findIndex((x) => x.id === v.id) === i);

/** Lee el canal: { videos, shorts }, del más nuevo al más antiguo */
export async function fetchChannel() {
  const videos = await tab("videos", (o) =>
    [...walk(o, "lockupViewModel")].map((l) => ({
      id: l.contentId,
      title: FIXED[l.contentId] ?? clean(l.metadata?.lockupMetadataViewModel?.title?.content ?? ""),
      duration: [...walk(l, "thumbnailBadgeViewModel")][0]?.text ?? "",
    })),
  );
  const shorts = await tab("shorts", (o) =>
    [...walk(o, "shortsLockupViewModel")].map((r) => {
      const id = r.onTap?.innertubeCommand?.reelWatchEndpoint?.videoId;
      return { id, title: FIXED[id] ?? clean(r.overlayMetadata?.primaryText?.content ?? "") };
    }),
  );
  if (!shorts.length && !videos.length) throw new Error("No se encontraron videos en el canal");
  return { videos: uniq(videos), shorts: uniq(shorts) };
}

// ─── Manejador ──────────────────────────────────────────────────────────────

let cache = null; // { data, at }
let pending = null;
/** Solo para pruebas: olvida la copia guardada */
export const resetVideosCache = () => {
  cache = null;
  pending = null;
};

const json = (data, status = 200, maxAge = 0) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": maxAge ? `public, max-age=${maxAge}` : "no-store",
    },
  });

export async function GET() {
  if (!cache || Date.now() - cache.at > TTL_MS) {
    // Una sola lectura a la vez aunque lleguen varias visitas juntas
    pending ??= fetchChannel()
      .then((data) => {
        cache = { data, at: Date.now() };
        console.log(
          `[videos] ✓ Canal leído: ${data.videos.length} videos y ${data.shorts.length} Shorts`,
        );
      })
      .catch((e) => {
        // Con una lista buena, se vuelve a intentar en 30 minutos (no en cada visita)
        if (cache) cache.at = Date.now() - TTL_MS + 30 * 60 * 1000;
        console.error(
          `[videos] ✗ YouTube no respondió (${e instanceof Error ? e.message : e})${
            cache ? ": se entrega la última lista" : ""
          }`,
        );
      })
      .finally(() => (pending = null));
    await pending;
  }
  if (!cache) return json({ ok: false, error: "youtube" }, 502);
  return json({ ok: true, ...cache.data, updatedAt: new Date(cache.at).toISOString() }, 200, 3600);
}
