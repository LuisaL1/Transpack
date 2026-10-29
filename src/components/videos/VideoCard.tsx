import { useState } from "react";
import { Bi } from "@/components/ui";

// Tarjeta de un video del canal (página Nuestros empaques). El reproductor de
// YouTube solo se carga al hacer clic (más rápido y sin cookies de YouTube antes
// de que el visitante decida verlo). `wide`: video horizontal; si no, Short.
export function VideoCard({
  id,
  title,
  duration,
  wide = false,
  playLabel,
  watchLabel,
  shortLabel,
  className = "",
}: {
  id: string;
  title: string;
  duration?: string;
  wide?: boolean;
  playLabel: string;
  watchLabel: string;
  shortLabel: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const watch = wide
    ? `https://www.youtube.com/watch?v=${id}`
    : `https://www.youtube.com/shorts/${id}`;
  return (
    <article
      className={`group flex min-w-0 flex-col overflow-hidden border border-linea bg-white shadow-sm transition-shadow hover:shadow-[var(--shadow-float)] ${
        wide ? "lg:grid lg:grid-cols-[1.7fr_1fr]" : ""
      } ${className}`}
    >
      <div
        className={`relative overflow-hidden bg-azul-900 ${wide ? "aspect-video" : "aspect-[9/16]"}`}
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
            className="absolute inset-0"
            aria-label={`${playLabel}: ${title}`}
          >
            <img
              decoding="async"
              loading="lazy"
              src={`https://i.ytimg.com/vi/${id}/${wide ? "hqdefault" : "oar2"}.jpg`}
              alt=""
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-azul-900/10 transition-colors group-hover:bg-azul-900/25" />
            <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-[0.7rem] font-semibold text-white backdrop-blur">
              <Bi n="youtube" className="text-[#ff3d3d]" /> {duration || shortLabel}
            </span>
            <span
              className={`absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-naranja text-white shadow-[0_10px_30px_-6px_rgba(255,118,25,.7)] transition-transform duration-300 group-hover:scale-110 ${
                wide ? "h-18 w-18 text-3xl" : "h-14 w-14 text-xl"
              }`}
            >
              <Bi n="play-fill" className="translate-x-0.5" />
            </span>
          </button>
        )}
      </div>
      <div
        className={`flex flex-1 flex-col gap-3 ${wide ? "p-6 lg:justify-center lg:p-10" : "p-4"}`}
      >
        <h3
          className={`font-title font-semibold leading-snug text-tinta ${
            wide ? "text-[clamp(1.2rem,1rem+0.8vw,1.6rem)]" : "line-clamp-3 text-[0.95rem]"
          }`}
        >
          {title}
        </h3>
        <a
          href={watch}
          target="_blank"
          rel="noopener"
          className={`inline-flex items-center gap-1.5 text-[0.85rem] font-semibold text-azul transition-colors hover:text-naranja ${wide ? "" : "mt-auto"}`}
        >
          {watchLabel} <Bi n="box-arrow-up-right" className="text-[0.75rem]" />
        </a>
      </div>
    </article>
  );
}
