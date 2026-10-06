import { Link } from "react-router-dom";
import { useLang } from "@/i18n";
import { levelsText } from "@/data/home";
import { useSite } from "@/hooks/useContent";
import { btn, Checks, Reveal, SectionHead } from "@/components/ui";
import { container, section } from "@/components/ui/layout";

// Niveles de servicio (LEVELS de src/data/site.ts)
export function Levels() {
  const { lang, lp, tr } = useLang();
  const t = levelsText(tr);
  const { LEVELS } = useSite();
  return (
    <section id="niveles" className={section}>
      <div className={container}>
        <SectionHead center eyebrow={t.eyebrow} title={t.title} sub={t.sub} />
        <div className="mx-auto grid max-w-[520px] gap-6 lg:max-w-none lg:grid-cols-3">
          {LEVELS.map((l, i) => (
            <Reveal key={l.n} delay={i * 80}>
              <article
                className={`relative flex h-full flex-col rounded-[22px] px-8 pb-8 pt-10 transition-all duration-300 hover:-translate-y-1.5 ${
                  l.featured
                    ? "bg-azul text-white/75 shadow-[var(--shadow-float)] lg:-translate-y-3 lg:hover:-translate-y-4"
                    : "border border-linea bg-white hover:shadow-[var(--shadow-card)]"
                }`}
              >
                {l.featured && (
                  <span className="absolute right-6 top-6 rounded-full bg-naranja px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-white">
                    {t.popular}
                  </span>
                )}
                <span
                  className="mb-4 block font-title text-[3.2rem] font-bold leading-none text-transparent"
                  style={{
                    WebkitTextStroke: `1.5px ${l.featured ? "#faeed9" : "#ff7619"}`,
                  }}
                >
                  {l.n}
                </span>
                <h3 className={`mb-2 text-xl ${l.featured ? "!text-white" : ""}`}>{l.title}</h3>
                <p className={`mb-6 ${l.featured ? "" : "text-suave"}`}>{l.text}</p>
                <div className="mb-8 flex-1">
                  <Checks items={l.points} light={l.featured} small />
                </div>
                <Link
                  to={lp(`/?nivel=${i + 1}#cotizar`)}
                  className={`${l.featured ? btn.primary : btn.outline} ${btn.md} w-full`}
                >
                  {t.choose} {lang === "de" || lang === "ar" ? l.title : l.title.toLowerCase()}
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
