import { useRef, useState } from "react";
import { useLang } from "@/i18n";
import { videosPageText } from "@/data/pages";
import type { ChannelVideo } from "@/data/youtubeVideos";
import { Bi, btn } from "@/components/ui";
import { VideoCard } from "@/components/videos/VideoCard";

// Shorts de Experiencias Transpack: al entrar se ve una sola fila (2 en celular, 3
// en tableta, 4 en computador); "Ver más" muestra el resto y "Ver menos" vuelve
// a la fila. Todos van en el HTML (buscadores); los demás solo se esconden, y
// sus portadas no se descargan mientras estén escondidas.
const rowCls = (i: number) =>
  i < 2 ? "" : i === 2 ? "hidden sm:flex" : i === 3 ? "hidden lg:flex" : "hidden";

export function ShortsGrid({
  shorts,
  ...cardText
}: {
  shorts: ChannelVideo[];
  playLabel: string;
  watchLabel: string;
  shortLabel: string;
}) {
  const { tr } = useLang();
  const t = videosPageText(tr);
  const [all, setAll] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const toggle = () => {
    // Al cerrar, vuelve al inicio de la lista para no quedar en medio de la página
    if (all) gridRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setAll(!all);
  };
  return (
    <>
      <div
        ref={gridRef}
        id="shorts"
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4"
      >
        {shorts.map((v, i) => (
          <VideoCard key={v.id} {...v} {...cardText} className={all ? "" : rowCls(i)} />
        ))}
      </div>
      {shorts.length > 2 && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={toggle}
            aria-expanded={all}
            aria-controls="shorts"
            className={`${btn.outline} ${btn.lg}`}
          >
            {all ? t.less : t.more(shorts.length)}
            <Bi n={all ? "chevron-up" : "chevron-down"} />
          </button>
        </div>
      )}
    </>
  );
}
