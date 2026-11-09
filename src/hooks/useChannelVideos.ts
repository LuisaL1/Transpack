// Videos y Shorts del canal para Maestría Transpack (/videos). Empieza con la
// lista guardada (la del HTML pre-generado, para buscadores) y, ya en el
// navegador, la reemplaza por la del canal al día (src/lib/videos.ts).
import { useEffect, useState } from "react";
import { CHANNEL_SHORTS, CHANNEL_VIDEOS } from "@/data/youtubeVideos";
import { fetchChannelVideos, type ChannelLists } from "@/lib/videos";

export function useChannelVideos(): ChannelLists {
  const [lists, setLists] = useState<ChannelLists>({
    videos: CHANNEL_VIDEOS,
    shorts: CHANNEL_SHORTS,
  });
  useEffect(() => {
    let alive = true;
    void fetchChannelVideos().then((fresh) => {
      if (alive && fresh) setLists(fresh);
    });
    return () => {
      alive = false;
    };
  }, []);
  return lists;
}
