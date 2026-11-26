import lacmaImg from "@/assets/images/lacma.jpg";
import mapaNoche from "@/assets/images/mapa-lineas-noche.svg";
import { useRef } from "react";
import { useLang } from "@/i18n";
import { coverageText } from "@/data/home";
import { useSite } from "@/hooks/useContent";
import { useInView } from "@/hooks/useInView";
import { useMotion } from "@/hooks/useMotion";
import { Bi, Eyebrow, Reveal, StatOdometer } from "@/components/ui";
import { container, section } from "@/components/ui/layout";

// Cobertura global (nov. 2026): de fondo, un mapamundi de líneas animado sobre
// el azul noche (mapa-lineas-noche.svg, generado con `pnpm map`): costas en
// blanco tenue, rutas desde Bogotá en naranja con destellos que las recorren y
// los destinos titilando. Reemplazó a la foto del operario embalando una obra
// (y antes al avión y el buque): no tenía resolución para ocupar media
// pantalla. Es un dibujo (se ve nítido en cualquier pantalla) y trae su propia
// animación CSS, sin JS; con movimiento reducido queda quieto. El texto va a la
// izquierda, sobre un azul que se abre hacia el mapa; abajo a la derecha, las
// cifras de la red sobre tarjetas translúcidas. En celular el mapa va arriba.
// Movimiento: el mapa se desplaza un poco con el scroll, los modos de
// transporte entran escalonados, las cifras ruedan como odómetro y al pie
// pasa una marquesina gigante con contorno de los continentes.
export function Coverage() {
  const { tr } = useLang();
  const t = coverageText(tr);
  const { STATS } = useSite();
  // Cifras reales del sitio (STATS): agentes y aliados, y países
  const chips = [STATS[3], STATS[1]];
  const ref = useRef<HTMLElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const counting = useInView(chipsRef);
  useMotion(ref, (m, el) => {
    m.parallax("[data-cov-map]", el, { yPercent: -6 }, { yPercent: 6 });
    m.parallax("[data-cov-marquee]", el, { xPercent: 0 }, { xPercent: -28 });
    const modes = el.querySelectorAll("[data-cov-mode]");
    m.reveal(modes, modes[0], { y: 28, stagger: 0.12 });
  });
  return (
    <section
      id="cobertura"
      ref={ref}
      className={`${section} overflow-hidden bg-azul-900 text-white/80 lg:min-h-[720px]`}
    >
      {/* Mapamundi animado (decorativo), a la derecha y un poco más allá del borde */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[6%] top-[8%] bottom-[28%] left-[22%] hidden items-center lg:flex"
      >
        <img
          loading="lazy"
          decoding="async"
          src={mapaNoche}
          alt=""
          draggable={false}
          data-cov-map
          className="w-full select-none [mask-image:radial-gradient(ellipse_at_center,#000_55%,transparent_80%)]"
        />
      </div>
      {/* Azul a la izquierda (texto legible) que se abre hacia el mapa */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,#0d0f33_0%,#0d0f33_24%,rgba(13,15,51,.75)_34%,rgba(13,15,51,0)_50%)] lg:block"
      />
      <div
        className={`${container} relative grid items-end gap-12 lg:grid-cols-[minmax(0,500px)_1fr] lg:gap-16`}
      >
        {/* Celular y tableta: el mapa completo, arriba */}
        <Reveal className="lg:hidden">
          <img
            loading="lazy"
            decoding="async"
            src={mapaNoche}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="pointer-events-none -mx-[14%] -my-[6%] w-[128%] max-w-none select-none"
          />
        </Reveal>
        <Reveal>
          <Eyebrow light>{t.eyebrow}</Eyebrow>
          <h2 className="mb-5 text-[clamp(1.9rem,1.2rem+2.4vw,3rem)] leading-[1.12] !text-white">
            {t.title}
          </h2>
          <p>{t.text}</p>
          <div className="my-8 grid gap-4 sm:grid-cols-2">
            {t.modes.map((m) => (
              <div
                key={m.title}
                data-cov-mode
                className="flex gap-3.5 rounded-2xl border border-white/12 bg-white/8 p-4 backdrop-blur-sm"
              >
                <Bi n={m.icon} className="text-[1.7rem] text-naranja" />
                <div>
                  <strong className="block font-title font-semibold text-white">{m.title}</strong>
                  <span className="text-[0.85rem] leading-snug">{m.text}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 border-t border-white/15 pt-6">
            <img
              loading="lazy"
              decoding="async"
              src={lacmaImg}
              alt={t.sealAlt}
              width={76}
              height={76}
              className="rounded-full bg-white p-1"
            />
            <div>
              <strong className="block font-title font-semibold text-white">
                {t.certificationsTitle}
              </strong>
              <span className="text-[0.9rem] tracking-[0.14em] text-beige">{t.certifications}</span>
            </div>
          </div>
        </Reveal>

        {/* Cifras de la red, sobre la foto */}
        <div ref={chipsRef} className="flex flex-wrap gap-4 lg:justify-end">
          {chips.map((c) => (
            <div
              key={c.label}
              className="min-w-[200px] rounded-2xl border border-white/15 bg-white/10 px-6 py-5 shadow-[0_24px_50px_-20px_rgba(13,15,51,.8)] backdrop-blur-md"
            >
              <strong className="block font-title text-[2.4rem] leading-none text-white">
                <StatOdometer value={c.value} suffix={c.suffix} active={counting} />
              </strong>
              <span className="mt-1.5 block text-[0.85rem] font-medium text-white/85">
                {c.short ?? c.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Marquesina gigante con contorno (decorativa): avanza con el scroll */}
      <div
        aria-hidden="true"
        className="pointer-events-none relative mt-14 overflow-hidden whitespace-nowrap md:mt-20"
      >
        <div
          data-cov-marquee
          className="inline-block font-title text-[clamp(3.5rem,9vw,8.5rem)] font-bold uppercase leading-none tracking-[0.02em] text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,.18)]"
        >
          {[0, 1, 2].map((k) => (
            <span key={k}>
              {t.regions.map((r) => (
                <span key={r}>
                  {r}
                  <span className="mx-[0.4em] inline-block align-middle text-[0.45em] [-webkit-text-stroke:1.5px_rgba(255,118,25,.6)]">
                    ✦
                  </span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
