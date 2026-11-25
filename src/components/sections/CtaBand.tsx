import { useRef } from "react";
import { Link } from "react-router-dom";
import { useSite } from "@/hooks/useContent";
import { useLang } from "@/i18n";
import { useMotion } from "@/hooks/useMotion";
import { Bi, btn, Reveal } from "@/components/ui";
import { ctaBandText } from "@/data/pages";

// Franja naranja de llamado a la acción. Movimiento (nov. 2026, estilo
// unitedcarriers): arriba pasa una marquesina gigante con contorno que se
// acelera con la velocidad del scroll (y retrocede al subir), un barrido de luz
// lento cruza la franja (.cta-sweep) y los botones son magnéticos.
export function CtaBand({ title, text }: { title?: string; text?: string }) {
  const { lp, tr } = useLang();
  const { waLink } = useSite();
  const t = ctaBandText(tr);
  title ??= t.title;
  text ??= t.text;
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (m, el) => {
    m.velocityMarquee(el.querySelector("[data-cta-marquee]")!, el);
  });
  return (
    <section
      ref={ref}
      className="cta-sweep relative overflow-hidden bg-naranja pb-16 pt-8 text-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none mb-8 overflow-hidden whitespace-nowrap"
        dir="ltr"
      >
        <div
          data-cta-marquee
          className="inline-flex font-title text-[clamp(3.2rem,8vw,7.5rem)] font-bold uppercase leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,.5)]"
        >
          {[0, 1].map((k) => (
            <span key={k} className="flex shrink-0">
              {[0, 1, 2].map((n) => (
                <span key={n} className="flex items-center">
                  {t.marquee}
                  <span className="mx-[0.4em] text-[0.45em] text-white [-webkit-text-stroke:0]">
                    ✦
                  </span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
      <Reveal className="relative mx-auto flex w-[min(100%-32px,1200px)] flex-wrap items-center justify-between gap-8">
        <div>
          <h2 className="mb-1 text-[clamp(1.7rem,1.2rem+1.8vw,2.6rem)] !text-white">{title}</h2>
          <p className="text-start text-[1.05rem] text-white/90">{text}</p>
        </div>
        <div className="flex w-full flex-wrap gap-3 sm:w-auto">
          <Link
            to={lp("/#cotizar")}
            data-magnetic
            className={`${btn.light} ${btn.lg} w-full sm:w-auto`}
          >
            {t.cta}
          </Link>
          <a
            href={waLink()}
            target="_blank"
            rel="noopener"
            className={`${btn.ghost} ${btn.lg} w-full sm:w-auto`}
          >
            <Bi n="whatsapp" /> WhatsApp
          </a>
        </div>
      </Reveal>
    </section>
  );
}
