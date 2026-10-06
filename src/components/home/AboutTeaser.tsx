import { Link } from "react-router-dom";
import { useLang } from "@/i18n";
import { aboutTeaserText } from "@/data/home";
import { useSite } from "@/hooks/useContent";
import { Bi, btn, Eyebrow, Reveal } from "@/components/ui";
import { container, section } from "@/components/ui/layout";

// Resumen de "Quiénes somos" con enlace a /nosotros
export function AboutTeaser() {
  const { lp, tr } = useLang();
  const t = aboutTeaserText(tr);
  const { ABOUT_IMAGES } = useSite();
  return (
    <section id="nosotros" className={`${section} bg-gris`}>
      <div className={`${container} grid items-center gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-24`}>
        <Reveal className="relative aspect-[1/1.08] max-w-[560px]">
          <img
            loading="lazy"
            decoding="async"
            src={ABOUT_IMAGES.a}
            alt={t.crewAlt}
            className="absolute left-0 top-0 h-[86%] w-[76%] rounded-[22px] object-cover shadow-[var(--shadow-card)]"
          />
          <img
            loading="lazy"
            decoding="async"
            src={ABOUT_IMAGES.b}
            alt={t.furnitureAlt}
            className="absolute bottom-0 right-0 h-[56%] w-[50%] rounded-[22px] border-[6px] border-gris object-cover shadow-[var(--shadow-card)]"
          />
          <div className="absolute bottom-[2%] left-[6%] rounded-2xl bg-naranja px-6 py-4 text-white shadow-[var(--shadow-card)]">
            <span className="block text-[0.75rem] font-semibold uppercase tracking-[0.14em]">
              {t.since}
            </span>
            <strong className="font-title text-[2.2rem] leading-none">{t.year}</strong>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h2 className="mb-5 text-[clamp(1.9rem,1.2rem+2.4vw,3rem)] leading-[1.12]">{t.title}</h2>
          <p className="mb-6">{t.text}</p>
          <ul className="mb-8 flex flex-wrap gap-2.5">
            {t.values.map((v) => (
              <li
                key={v.label}
                className="inline-flex items-center gap-2 rounded-full bg-azul px-4 py-2 text-[0.88rem] font-semibold text-white"
              >
                <Bi n={v.icon} className="text-naranja" /> {v.label}
              </li>
            ))}
          </ul>
          <Link to={lp("/nosotros")} className={`${btn.outline} ${btn.md}`}>
            {t.cta}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
