// Shorts de YouTube del canal de Transpack. Se muestra la portada y el video
// solo se carga al hacer clic (más rápido y sin cookies de YouTube antes de
// que el visitante decida verlo).
import { useState } from "react";
import { useSite } from "@/data/content";
import { useLang } from "@/i18n";
import { Bi, btn, Eyebrow, Reveal } from "@/components/ui";

function ShortCard({
  playLabel,
  id,
  title,
  tag,
  offset,
}: {
  playLabel: string;
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
            src={`https://i.ytimg.com/vi/${id}/oar2.jpg`}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-[linear-gradient(to_top,#1b1e5c_0%,#1b1e5c_22%,rgba(27,30,92,.75)_40%,transparent_62%)]" />
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/35 px-2.5 py-1 text-[0.7rem] font-semibold text-white backdrop-blur">
            <Bi n="youtube" className="text-[#ff3d3d]" /> Short
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

export default function VideoShorts() {
  const { VIDEOS, YOUTUBE_CHANNEL } = useSite();
  const { tr } = useLang();
  return (
    <section
      id="videos"
      className="relative overflow-hidden bg-violeta py-[clamp(72px,9vw,128px)] text-white/78"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] bg-[radial-gradient(rgba(255,255,255,.18)_1.2px,transparent_1.6px)] bg-[size:9px_9px] [mask-image:radial-gradient(circle,#000_0%,transparent_65%)]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-[260px] bottom-[-320px] h-[760px] w-[760px] rotate-45 bg-gradient-to-br from-white/5 to-transparent"
      />

      <div className="relative mx-auto grid w-[min(100%-32px,1200px)] items-center gap-12 lg:grid-cols-[0.62fr_1.38fr] lg:gap-14">
        <Reveal className="min-w-0">
          <Eyebrow light>{tr("Transpack en video", "Transpack on video")}</Eyebrow>
          <h2 className="mb-5 text-[clamp(1.9rem,1.2rem+2.4vw,3rem)] leading-[1.12] !text-white">
            {tr("Así se ve una mudanza bien hecha", "This is what a move done right looks like")}
          </h2>
          <p className="mb-8 max-w-md">
            {tr(
              "Procesos reales, contados por nuestro equipo: cómo planeamos, protegemos y movemos lo que más importa, dentro y fuera de Colombia.",
              "Real processes, told by our team: how we plan, protect and move what matters most, in Colombia and abroad.",
            )}
          </p>
          <a
            href={YOUTUBE_CHANNEL}
            target="_blank"
            rel="noopener"
            className={`${btn.ghost} ${btn.md}`}
          >
            <Bi n="youtube" /> {tr("Ver más en YouTube", "More on YouTube")}
          </a>
        </Reveal>

        <Reveal delay={120} className="min-w-0">
          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto sm:gap-5 px-4 pb-4 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:pb-10">
            {VIDEOS.map((v, i) => (
              <ShortCard
                key={v.id}
                playLabel={tr("Reproducir video", "Play video")}
                id={v.id}
                title={v.title}
                tag={v.tag}
                offset={i === 1}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
