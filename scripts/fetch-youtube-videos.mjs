// Genera src/data/youtubeVideos.ts con todos los videos y Shorts del canal de
// YouTube de Transpack (pnpm videos). Lee las pestañas "Videos" y "Shorts" del
// canal (con sus páginas siguientes), del más nuevo al más antiguo. Los títulos
// quedan sin hashtags. Esta lista va en el HTML pre-generado y es el respaldo:
// la página se actualiza sola con /api/videos (api/videos.mjs) al abrirla.
import { writeFile } from "node:fs/promises";
// La lectura del canal es la misma que usa el servidor (/api/videos)
import { fetchChannel } from "../api/videos.mjs";

const out = process.argv[2] ?? "src/data/youtubeVideos.ts";
const { videos, shorts } = await fetchChannel();

const ts = `// GENERADO con \`pnpm videos\` (scripts/fetch-youtube-videos.mjs): no editar a mano.
// Videos y Shorts del canal de YouTube de Transpack, del más nuevo al más antiguo.

export type ChannelVideo = { id: string; title: string; duration?: string };

export const CHANNEL_VIDEOS: ChannelVideo[] = ${JSON.stringify(videos, null, 2)};

export const CHANNEL_SHORTS: ChannelVideo[] = ${JSON.stringify(shorts, null, 2)};
`;
await writeFile(out, ts);
console.log(`${out}: ${videos.length} videos y ${shorts.length} Shorts`);
