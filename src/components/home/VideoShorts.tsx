// Sección de videos: Shorts del canal de YouTube de Transpack (VIDEOS de
// src/data/site.ts).
import { useSite } from "@/hooks/useContent";
import { useLang } from "@/i18n";
import { videosText } from "@/data/home";
import { Bi, btn, Eyebrow, Reveal } from "@/components/ui";
import { ShortCard } from "@/components/home/ShortCard";

export function VideoShorts() {
  const { VIDEOS, YOUTUBE_CHANNEL } = useSite();
  const { tr } = useLang();
  const t = videosText(tr);
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
          <Eyebrow light>{t.eyebrow}</Eyebrow>
          <h2 className="mb-5 text-[clamp(1.9rem,1.2rem+2.4vw,3rem)] leading-[1.12] !text-white">
            {t.title}
          </h2>
          <p className="mb-8 max-w-md">{t.text}</p>
          <a
            href={YOUTUBE_CHANNEL}
            target="_blank"
            rel="noopener"
            className={`${btn.ghost} ${btn.md}`}
          >
            <Bi n="youtube" /> {t.more}
          </a>
        </Reveal>

        <Reveal delay={120} className="min-w-0">
          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto sm:gap-5 px-4 pb-4 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:pb-10">
            {VIDEOS.map((v, i) => (
              <ShortCard
                key={v.id}
                playLabel={t.play}
                shortLabel={t.short}
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
