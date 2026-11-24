import { useRef } from "react";
import { Link } from "react-router-dom";
import { useLang } from "@/i18n";
import { levelsText } from "@/data/home";
import { useSite } from "@/hooks/useContent";
import { useMotion } from "@/hooks/useMotion";
import { btn, Checks, Reveal, SectionHead } from "@/components/ui";
import { container, section } from "@/components/ui/layout";

// Niveles de servicio (LEVELS de src/data/site.ts). Movimiento (nov. 2026): los
// números con contorno se descubren desde abajo al llegar, y las tarjetas se
// inclinan y brillan siguiendo al puntero (tilt y .spotlight)
export function Levels() {
  const { lp, tr } = useLang();
  const t = levelsText(tr);
  const { LEVELS } = useSite();
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (m, el) => {
    const nums = el.querySelectorAll("[data-level-n]");
    m.gsap.from(nums, {
      yPercent: 60,
      clipPath: "inset(0 0 100% 0)",
      duration: 1.1,
      ease: "expo.out",
      stagger: 0.12,
      scrollTrigger: { trigger: nums[0], start: m.ENTER, once: true },
    });
    const off = [...el.querySelectorAll<HTMLElement>("article")].map((a) => m.tilt(a, 4));
    return () => off.forEach((f) => f());
  });
  return (
    <section id="niveles" ref={ref} className={section}>
      <div className={container}>
        <SectionHead center eyebrow={t.eyebrow} title={t.title} sub={t.sub} />
        <div className="mx-auto grid max-w-[520px] gap-6 lg:max-w-none lg:grid-cols-3">
          {LEVELS.map((l, i) => (
            <Reveal key={l.n} delay={i * 80}>
              <article
                className={`spotlight relative flex h-full flex-col rounded-[22px] px-8 pb-8 pt-10 transition-[translate,box-shadow] duration-300 hover:-translate-y-1.5 ${
                  l.featured
                    ? "spotlight-light bg-azul text-white/75 shadow-[var(--shadow-float)] lg:-translate-y-3 lg:hover:-translate-y-4"
                    : "border border-linea bg-white hover:shadow-[var(--shadow-card)]"
                }`}
              >
                {l.featured && (
                  <span className="absolute right-6 top-6 rounded-full bg-naranja px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-white">
                    {t.popular}
                  </span>
                )}
                <span
                  data-level-n
                  className="mb-4 block font-title text-[3.2rem] font-bold leading-none text-transparent"
                  style={{
                    WebkitTextStroke: `1.5px ${l.featured ? "#faeed9" : "#ff7619"}`,
                  }}
                >
                  {l.n}
                </span>
                <h3 className={`mb-2 text-xl ${l.featured ? "!text-white" : ""}`}>{l.title}</h3>
                <p className={`mb-6 text-start ${l.featured ? "" : "text-suave"}`}>{l.text}</p>
                <div className="mb-8 flex-1">
                  <Checks items={l.points} light={l.featured} small />
                </div>
                <Link
                  to={lp(`/?nivel=${i + 1}#cotizar`)}
                  className={`${l.featured ? btn.primary : btn.outline} ${btn.md} w-full`}
                >
                  {t.choose} {l.title.toLowerCase()}
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
