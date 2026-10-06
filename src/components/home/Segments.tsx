import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useLang } from "@/i18n";
import { segmentsText } from "@/data/home";
import { useSite } from "@/hooks/useContent";
import { Bi, btn, Checks, Reveal, SectionHead } from "@/components/ui";
import { container, section } from "@/components/ui/layout";
import { SEGMENT_TOPIC, track } from "@/lib/joel";

// Soluciones por segmento (SEGMENTS de src/data/site.ts), en pestañas
export function Segments() {
  const { lp, tr } = useLang();
  const t = segmentsText(tr);
  const { SEGMENTS } = useSite();
  const [active, setActive] = useState(0);
  // El menú abre un segmento concreto con ?segmento=<id>#soluciones
  const [params] = useSearchParams();
  const wanted = params.get("segmento");
  useEffect(() => {
    const i = SEGMENTS.findIndex((s) => s.id === wanted);
    if (i >= 0) setActive(i);
  }, [wanted, SEGMENTS]);
  const seg = SEGMENTS[active];
  return (
    <section id="soluciones" className={`${section} bg-gris`}>
      <div className={container}>
        <SectionHead eyebrow={t.eyebrow} title={t.title} sub={t.sub} />
        <Reveal>
          <div
            role="tablist"
            aria-label={t.tabsLabel}
            className="mb-8 flex w-full max-w-full gap-1.5 overflow-x-auto rounded-2xl bg-white p-1.5 shadow-sm [scrollbar-width:none] sm:w-fit sm:rounded-full"
          >
            {SEGMENTS.map((s, i) => (
              <button
                key={s.id}
                role="tab"
                aria-selected={i === active}
                onClick={() => {
                  setActive(i);
                  // Segmento consultado (perfil del visitante para Joel)
                  if (SEGMENT_TOPIC[s.id]) track("service", SEGMENT_TOPIC[s.id]);
                }}
                className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-3 text-[0.9rem] font-semibold transition-colors ${
                  i === active ? "bg-azul text-white" : "text-suave hover:text-azul"
                }`}
              >
                <Bi n={s.icon} className={i === active ? "text-naranja" : ""} /> {s.tab}
              </button>
            ))}
          </div>
          <div
            key={seg.id}
            role="tabpanel"
            className="animate-fade-up grid items-center gap-8 rounded-[22px] bg-white p-4 shadow-sm md:p-6 lg:grid-cols-2 lg:gap-16"
          >
            <div className="aspect-[4/3.3] overflow-hidden rounded-2xl">
              <img
                loading="lazy"
                decoding="async"
                src={seg.image}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div className="px-2 py-2 lg:pr-6">
              <p className="mb-3 font-title text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-naranja">
                {seg.kicker}
              </p>
              <h3 className="mb-4 text-[clamp(1.4rem,1.1rem+1vw,2rem)] leading-tight">
                {seg.title}
              </h3>
              <p className="mb-6">{seg.text}</p>
              <Checks items={seg.points} />
              <Link
                to={lp(`/?servicio=${seg.quote}#cotizar`)}
                className={`${btn.secondary} ${btn.md} mt-8`}
              >
                {seg.cta}
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
