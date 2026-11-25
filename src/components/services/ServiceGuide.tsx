import { useRef } from "react";
import type { ServiceGuide as Guide } from "@/data/site";
import { useMotion } from "@/hooks/useMotion";
import { Bi, Eyebrow, Reveal } from "@/components/ui";
import { container } from "@/components/ui/layout";

// Guía de términos de un servicio (Mudanzas locales, nacionales e internacionales). El
// texto sale de "guide" en SERVICES (src/data/site.ts y site.en.ts).
// Movimiento (nov. 2026): las tarjetas entran escalonadas desde abajo y, con el
// mouse, se inclinan hacia el puntero con un resplandor (.spotlight).
export function ServiceGuide({ guide }: { guide: Guide }) {
  const { sections = [], closing } = guide;
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (m, el) => {
    const cards = [...el.querySelectorAll<HTMLElement>("[data-guide-card]")];
    if (!cards.length) return;
    m.reveal(cards, cards[0], { y: 50, stagger: 0.1 });
    const offs = cards.map((c) => m.tilt(c, 3));
    return () => offs.forEach((off) => off());
  });
  return (
    <section ref={ref} className="relative pb-[clamp(64px,8vw,112px)]">
      <div className={container}>
        <Reveal className={`max-w-3xl ${sections.length || closing ? "mb-12" : ""}`}>
          <Eyebrow>{guide.eyebrow}</Eyebrow>
          <h2 className="mb-5 text-[clamp(1.8rem,1.2rem+2vw,2.6rem)] leading-[1.15]">
            {guide.title}
          </h2>
          {guide.lead && <p className="text-[1.05rem]">{guide.lead}</p>}
        </Reveal>
        {(sections.length > 0 || closing) && (
          <div className="grid gap-5 md:grid-cols-2">
            {sections.map((s, i) => (
              <article
                key={s.title}
                data-guide-card
                className="spotlight relative rounded-[22px] bg-gris p-7 md:p-9"
              >
                <div className="mb-5 flex items-center gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-azul text-xl text-naranja">
                    <Bi n={s.icon} />
                  </span>
                  <h3 className="text-xl leading-snug">
                    <span className="text-naranja">{i + 1}.</span> {s.title}
                  </h3>
                </div>
                {s.text.map((p) => (
                  <p key={p} className="mb-4 text-[0.98rem]">
                    {p}
                  </p>
                ))}
                {s.items && (
                  <ul className="mb-4 grid gap-3">
                    {s.items.map((it) => (
                      <li key={it.b} className="flex items-start gap-3 text-[0.98rem]">
                        <Bi n="check-circle-fill" className="mt-1 text-naranja" />
                        <span>
                          <strong className="text-tinta">{it.b}</strong> {it.t}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                {s.after && <p className="text-[0.98rem]">{s.after}</p>}
              </article>
            ))}
            {closing && (
              <article
                data-guide-card
                className="spotlight spotlight-light relative rounded-[22px] bg-azul p-7 text-white/80 md:p-9"
              >
                <div className="mb-5 flex items-center gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-xl text-naranja">
                    <Bi n="heart-fill" />
                  </span>
                  <h3 className="text-xl leading-snug !text-white">{closing.title}</h3>
                </div>
                {closing.text.map((p, i) => (
                  <p
                    key={p}
                    className={
                      i === closing.text.length - 1
                        ? "font-title text-lg font-semibold text-white"
                        : "mb-4 text-[0.98rem]"
                    }
                  >
                    {p}
                  </p>
                ))}
              </article>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
