import { useState } from "react";
import { Bi } from "@/components/ui";

// Portada de un Short de YouTube: el video solo se carga al hacer clic (más
// rápido y sin cookies de YouTube antes de que el visitante decida verlo).
export function ShortCard({
  playLabel,
  shortLabel,
  id,
  title,
  tag,
  offset,
}: {
  playLabel: string;
  shortLabel: string;
  id: string;
  title: string;
  tag: string;
  offset: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  return (
    <div
      className={`group relative aspect-[9/16] w-[72vw] max-w-[260px] shrink-0 snap-center overflow-hidden rounded-[26px] border border-white/15 bg-azul-900 shadow-[var(--shadow-float)] sm:w-auto sm:max-w-none ${
        offset ? "lg:translate-y-10" : ""
      }`}
    >
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <button
          onClick={() => setPlaying(true)}
          className="absolute inset-0 text-start"
          aria-label={`${playLabel}: ${title}`}
        >
          <img
            decoding="async"
            src={`https://i.ytimg.com/vi/${id}/oar2.jpg`}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-[linear-gradient(to_top,#1b1e5c_0%,#1b1e5c_22%,rgba(27,30,92,.75)_40%,transparent_62%)]" />
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/35 px-2.5 py-1 text-[0.7rem] font-semibold text-white backdrop-blur">
            <Bi n="youtube" className="text-[#ff3d3d]" /> {shortLabel}
          </span>
          <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-naranja text-2xl text-white shadow-[0_10px_30px_-6px_rgba(255,118,25,.7)] transition-transform duration-300 group-hover:scale-110">
            <Bi n="play-fill" className="translate-x-0.5" />
          </span>
          <span className="absolute inset-x-0 bottom-0 p-5">
            <span className="mb-1.5 block font-title text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-naranja">
              {tag}
            </span>
            <span className="block font-title text-[1.02rem] font-semibold leading-snug text-white">
              {title}
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
