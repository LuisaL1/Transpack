import { useEffect, useRef, useState } from "react";
import { useLang } from "@/i18n";
import { statsText } from "@/data/home";
import { useSite } from "@/hooks/useContent";
import { Bi, StatCounter } from "@/components/ui";
import { container } from "@/components/ui/layout";

// Cifras bajo el hero (datos en STATS de src/data/site.ts) como carrusel con
// movimiento, a pedido del cliente: una cifra a la vez, cada una con su espacio
// y su tiempo, deslizándose hacia la izquierda como los logos de clientes.
// Avanza solo, sin pausa (pedido del cliente), desde que el carrusel se ve en
// pantalla; solo se queda quieto si el visitante pidió reducir el movimiento en
// su equipo. Cada cifra cuenta desde 0 hasta su valor al entrar (StatCounter). Las barras de abajo
// muestran el avance y permiten saltar a otra cifra. Todas las cifras están en el
// HTML pre-generado (SEO); al final va una copia de la primera para que el
// giro de la última a la primera sea continuo.
// Tiempo de cada cifra: el conteo (~1,8 s) y unos segundos para leerla
const INTERVAL = 5000;
const ICONS = ["award", "globe-americas", "box-seam", "people"];

export function Stats() {
  const { tr } = useLang();
  const t = statsText(tr);
  const { STATS } = useSite();
  const n = STATS.length;
  const [i, setI] = useState(0); // 0..n (n = copia de la primera)
  const [animate, setAnimate] = useState(true);
  const [reduced, setReduced] = useState(false);
  // El carrusel ya se vio en pantalla (antes no cuenta ni avanza)
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const raf = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return setVisible(true);
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setVisible(true);
        obs.disconnect();
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(m.matches);
    on();
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);

  const running = !reduced && visible;

  // Avanza una cifra cada INTERVAL mientras corre
  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => {
      setAnimate(true);
      setI((v) => v + 1);
    }, INTERVAL);
    return () => window.clearTimeout(id);
  }, [running, i]);

  // Tras llegar a la copia de la primera, salta al inicio sin animación
  useEffect(() => {
    if (animate) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = requestAnimationFrame(() => setAnimate(true));
    });
    return () => cancelAnimationFrame(raf.current);
  }, [animate]);

  const active = i % n;
  const slides = [...STATS, STATS[0]];
  const goTo = (k: number) => {
    setAnimate(true);
    setI(k);
  };

  return (
    <section
      ref={ref}
      className="pb-4 pt-6"
      aria-label={t.label}
      aria-roledescription={t.carousel}
    >
      <div
        className={`${container} relative overflow-hidden rounded-[22px] bg-white shadow-[var(--shadow-float)] ring-1 ring-linea`}
      >
        {/* Cuadrado naranja girado de la marca, esquina inferior derecha */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 -right-20 h-48 w-48 rotate-45 rounded-[22%] bg-naranja/10"
        />
        <div
          className={`relative flex ${animate && !reduced ? "transition-transform duration-700 ease-[cubic-bezier(.65,0,.35,1)]" : ""}`}
          style={{ transform: `translateX(-${i * 100}%)` }}
          aria-live={running ? "off" : "polite"}
          onTransitionEnd={(e) => {
            if (e.target === e.currentTarget && i === n) {
              setAnimate(false);
              setI(0);
            }
          }}
        >
          {slides.map((s, k) => (
            <div
              key={`${s.label}-${k}`}
              role="group"
              aria-roledescription={t.slide}
              aria-label={t.of((k % n) + 1, n)}
              aria-hidden={k !== i}
              className="flex w-full shrink-0 flex-col items-center gap-4 px-6 py-9 text-center sm:px-12 md:flex-row md:justify-center md:gap-9 md:py-12 md:text-start"
            >
              <span className="relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-azul text-[1.7rem] text-naranja shadow-[0_12px_26px_-12px_rgba(39,43,124,.8)] md:h-20 md:w-20 md:text-[2rem]">
                <span
                  aria-hidden="true"
                  className="absolute -right-4 -top-4 h-9 w-9 rotate-45 rounded-[6px] bg-naranja/25"
                />
                <Bi n={ICONS[k % n]} className="relative" />
              </span>
              <span className="font-title text-[clamp(3.2rem,2.3rem+3.6vw,5.6rem)] font-bold leading-none text-azul">
                <StatCounter value={s.value} suffix={s.suffix} active={visible && k === i} instant={!animate} />
              </span>
              <span aria-hidden="true" className="hidden h-20 w-px bg-linea md:block" />
              <span className="max-w-[440px] text-balance font-title text-[clamp(1.2rem,1.02rem+.8vw,1.8rem)] font-semibold leading-snug text-tinta">
                {s.label.charAt(0).toUpperCase() + s.label.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Avance: una barra por cifra (la activa se llena con el tiempo) */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {STATS.map((s, k) => (
          <button
            key={s.label}
            type="button"
            onClick={() => goTo(k)}
            aria-label={t.goTo(k + 1)}
            aria-current={k === active}
            className="group px-1 py-3"
          >
            <span className="relative block h-1.5 w-10 overflow-hidden rounded-full bg-linea transition-colors group-hover:bg-suave/40 sm:w-14">
              {k === active && (
                <span
                  key={`${i}-${running}`}
                  className={`absolute inset-y-0 left-0 rounded-full bg-naranja ${running ? "animate-stat-progress" : "w-full"}`}
                  style={running ? { animationDuration: `${INTERVAL}ms` } : undefined}
                />
              )}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
