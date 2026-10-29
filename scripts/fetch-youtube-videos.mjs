// Genera src/data/youtubeVideos.ts con todos los videos y Shorts del canal de
// YouTube de Transpack (pnpm videos). Lee las pestañas "Videos" y "Shorts" del
// canal (con sus páginas siguientes), del más nuevo al más antiguo. Los títulos
// quedan sin hashtags. Vuelva a correrlo cuando el canal publique videos nuevos.
import { writeFile } from "node:fs/promises";

const CHANNEL = "https://www.youtube.com/@TranspackSAS";
const out = process.argv[2] ?? "src/data/youtubeVideos.ts";
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

// Sin hashtags, emojis ni espacios de más; si el título era solo hashtags, el primero
const clean = (title) => {
  const t = title
    .replace(/#[\p{L}\p{N}_]+/gu, " ")
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
  if (!json)
    throw new Error(`YouTube no devolvió la pestaña "${name}": intente de nuevo más tarde`);
  const data = JSON.parse(json);
  const key = html.match(/"INNERTUBE_API_KEY":"([^"]+)"/)[1];
  const version = html.match(/"INNERTUBE_CLIENT_VERSION":"([^"]+)"/)[1];
  const items = read(data);
  let token = [...walk(data, "continuationCommand")].at(-1)?.token;
  while (token) {
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

const videos = await tab("videos", (o) =>
  [...walk(o, "lockupViewModel")].map((l) => ({
    id: l.contentId,
    title: FIXED[l.contentId] ?? clean(l.metadata?.lockupMetadataViewModel?.title?.content ?? ""),
    duration: [...walk(l, "thumbnailBadgeViewModel")][0]?.text ?? "",
  })),
);
const shorts = await tab("shorts", (o) =>
  [...walk(o, "shortsLockupViewModel")].map((r) => ({
    id: r.onTap?.innertubeCommand?.reelWatchEndpoint?.videoId,
    title:
      FIXED[r.onTap?.innertubeCommand?.reelWatchEndpoint?.videoId] ??
      clean(r.overlayMetadata?.primaryText?.content ?? ""),
  })),
);
const uniq = (list) => list.filter((v, i) => v.id && list.findIndex((x) => x.id === v.id) === i);
if (!shorts.length && !videos.length) throw new Error("No se encontraron videos en el canal");

const ts = `// GENERADO con \`pnpm videos\` (scripts/fetch-youtube-videos.mjs): no editar a mano.
// Videos y Shorts del canal de YouTube de Transpack, del más nuevo al más antiguo.

export type ChannelVideo = { id: string; title: string; duration?: string };

export const CHANNEL_VIDEOS: ChannelVideo[] = ${JSON.stringify(uniq(videos), null, 2)};

export const CHANNEL_SHORTS: ChannelVideo[] = ${JSON.stringify(uniq(shorts), null, 2)};
`;
await writeFile(out, ts);
console.log(`${out}: ${uniq(videos).length} videos y ${uniq(shorts).length} Shorts`);
