import { Link } from "react-router-dom";
import techo from "@/assets/images/techo.jpeg";
import { useSite } from "@/hooks/useContent";
import { useLang } from "@/i18n";
import { videosPageText } from "@/data/pages";
import { useChannelVideos } from "@/hooks/useChannelVideos";
import { container, section } from "@/components/ui/layout";
import { Bi, btn, Eyebrow, Reveal } from "@/components/ui";
import { CtaBand, PageHero } from "@/components/sections";
import { VideoCard } from "@/components/videos/VideoCard";
import { ShortsGrid } from "@/components/videos/ShortsGrid";

// Maestría Transpack (/videos): todos los videos y Shorts del canal de YouTube,
// al día con /api/videos (useChannelVideos; la lista guardada va en el HTML).
export function VideosPage() {
  const { lp, tr } = useLang();
  const t = videosPageText(tr);
  const { YOUTUBE_CHANNEL } = useSite();
  const { videos, shorts } = useChannelVideos();
  const total = videos.length + shorts.length;
  const cardText = { playLabel: t.play, watchLabel: t.watch, shortLabel: t.short };
  return (
    <>
      <PageHero image={techo}>
        <nav aria-label={t.path} className="mb-6 flex items-center gap-2 text-[0.85rem] text-suave">
          <Link to={lp("/")} className="hover:text-azul">
            {t.home}
          </Link>
          <Bi n="chevron-right" className="text-[0.7rem]" />
          <span className="font-semibold text-azul">{t.title}</span>
        </nav>
        <div className="animate-fade-up max-w-3xl">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h1 className="mb-6 text-[clamp(2rem,1.3rem+2.6vw,3.2rem)] leading-[1.1] text-tinta">
            {t.title}
          </h1>
          <p className="max-w-2xl text-[1.05rem]">{t.intro}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={`${YOUTUBE_CHANNEL}?sub_confirmation=1`}
              target="_blank"
              rel="noopener"
              className={`${btn.primary} ${btn.lg}`}
            >
              <Bi n="youtube" /> {t.subscribe}
            </a>
            <span className="font-title text-[0.9rem] font-semibold text-azul">
              {t.count(total)}
            </span>
          </div>
        </div>
      </PageHero>

      <section className={section}>
        <div className={container}>
          {videos.length > 0 && (
            <Reveal className="mb-16 md:mb-20">
              <Eyebrow>{t.featured}</Eyebrow>
              <div className={`grid gap-6 ${videos.length > 1 ? "lg:grid-cols-2" : ""}`}>
                {videos.map((v) => (
                  <VideoCard key={v.id} wide {...v} {...cardText} />
                ))}
              </div>
            </Reveal>
          )}

          <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <div>
              <Eyebrow>{t.shorts}</Eyebrow>
              <h2 className="text-[clamp(1.6rem,1.2rem+1.4vw,2.2rem)]">{t.shortsSub}</h2>
            </div>
            <span className="text-[0.9rem] font-medium text-suave">{t.count(shorts.length)}</span>
          </Reveal>
          <ShortsGrid shorts={shorts} {...cardText} />
        </div>
      </section>

      <CtaBand title={t.ctaTitle} text={t.ctaText} />
    </>
  );
}
