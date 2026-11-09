// Videos y Shorts del canal de YouTube al día: los pide a /api/videos (función
// del servidor que lee el canal, api/videos.mjs). Si no responde o la respuesta
// no tiene la forma esperada, devuelve null y la página se queda con la lista
// guardada (src/data/youtubeVideos.ts, la del HTML pre-generado).
import type { ChannelVideo } from "@/data/youtubeVideos";

export type ChannelLists = { videos: ChannelVideo[]; shorts: ChannelVideo[] };

const isVideo = (v: unknown): v is ChannelVideo =>
  !!v &&
  typeof v === "object" &&
  /^[\w-]{11}$/.test(String((v as ChannelVideo).id)) &&
  typeof (v as ChannelVideo).title === "string" &&
  (v as ChannelVideo).title.trim() !== "";

/** Valida la respuesta de /api/videos: solo videos con id de YouTube y título */
export function parseChannel(data: unknown): ChannelLists | null {
  const d = data as { ok?: boolean; videos?: unknown; shorts?: unknown };
  if (!d?.ok || !Array.isArray(d.videos) || !Array.isArray(d.shorts)) return null;
  const videos = d.videos.filter(isVideo);
  const shorts = d.shorts.filter(isVideo);
  return videos.length || shorts.length ? { videos, shorts } : null;
}

export async function fetchChannelVideos(): Promise<ChannelLists | null> {
  try {
    const res = await fetch("/api/videos");
    return res.ok ? parseChannel(await res.json()) : null;
  } catch {
    return null;
  }
}
