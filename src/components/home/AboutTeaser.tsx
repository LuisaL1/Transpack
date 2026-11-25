import { useRef } from "react";
import { Link } from "react-router-dom";
import { useLang } from "@/i18n";
import { aboutTeaserText } from "@/data/home";
import { useSite } from "@/hooks/useContent";
import { useInView } from "@/hooks/useInView";
import { useMotion } from "@/hooks/useMotion";
import { Bi, btn, Eyebrow, PhotoFrame, Reveal, StatOdometer } from "@/components/ui";
import { container, section } from "@/components/ui/layout";

// Resumen de "Quiénes somos" con enlace a /nosotros. Movimiento (nov. 2026):
// las dos fotos se desplazan con el scroll a velocidades opuestas (parallax) y
// el año de la insignia rueda como odómetro.
export function AboutTeaser() {
  const { lp, tr } = useLang();
  const t = aboutTeaserText(tr);
  const { ABOUT_IMAGES } = useSite();
  const ref = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const counting = useInView(badgeRef);
  useMotion(ref, (m, el) => {
    // Las dos fotos (PhotoFrame), en sentidos opuestos
    const [a, b] = el.querySelectorAll(".photo-frame");
    m.parallax(a, el, { yPercent: 6 }, { yPercent: -6 });
    m.parallax(b, el, { yPercent: -14 }, { yPercent: 14 });
  });
  const year = Number(t.year);
  return (
    <section id="nosotros" ref={ref} className={section}>
      <div className={`${container} grid items-center gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-24`}>
        <Reveal className="relative aspect-[1/1.08] max-w-[560px]">
          {/* Dos fotos en marcos con pestaña (PhotoFrame); la pequeña, con un
              borde blanco que la separa de la grande */}
          <PhotoFrame tab corner="tr" className="absolute left-0 top-0 h-[86%] w-[76%]">
            <img
              loading="lazy"
              decoding="async"
              src={ABOUT_IMAGES.a}
              alt={t.crewAlt}
              className="h-full w-full object-cover"
            />
          </PhotoFrame>
          <PhotoFrame className="absolute bottom-0 right-0 h-[56%] w-[50%] ring-[6px] ring-white">
            <img
              loading="lazy"
              decoding="async"
              src={ABOUT_IMAGES.b}
              alt={t.furnitureAlt}
              className="h-full w-full object-cover"
            />
          </PhotoFrame>
          <div
            ref={badgeRef}
            className="absolute bottom-[2%] left-[6%] z-10 rounded-2xl bg-naranja px-6 py-4 text-white shadow-[var(--shadow-card)]"
          >
            <span className="block text-[0.75rem] font-semibold uppercase tracking-[0.14em]">
              {t.since}
            </span>
            <strong className="font-title text-[2.2rem] leading-none">
              {Number.isFinite(year) ? (
                <StatOdometer value={year} active={counting} plain />
              ) : (
                t.year
              )}
            </strong>
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
