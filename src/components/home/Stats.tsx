import { useEffect, useRef, useState } from "react";
import { useLang } from "@/i18n";
import { statsText } from "@/data/home";
import { useSite } from "@/hooks/useContent";
import { Bi, StatOdometer } from "@/components/ui";
import { container } from "@/components/ui/layout";

// Cifras bajo el hero (datos en STATS de src/data/site.ts): las cuatro a la vez
// en una sola barra (ya no en carrusel, pedido del cliente, nov. 2026), más
// compacta. Cada cifra llega a su valor cuando la barra se ve en
// pantalla (StatOdometer: los dígitos ruedan como un odómetro); el HTML pre-generado y los lectores de pantalla llevan
// el valor completo. Al pasar el cursor, cada cifra se levanta con sombra
// naranja, su ícono pasa a naranja y crece la franja naranja de abajo, como los
// logos de clientes del hero.
const ICONS = ["award", "globe-americas", "box-seam", "people"];

export function Stats() {
  const { tr } = useLang();
  const t = statsText(tr);
  const { STATS } = useSite();
  // La barra ya se vio en pantalla (antes no cuenta)
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

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

  return (
    <section ref={ref} className="pb-4 pt-6" aria-label={t.label}>
      <div
        className={`${container} relative overflow-hidden rounded-[22px] bg-white shadow-[var(--shadow-float)] ring-1 ring-linea`}
      >
        {/* Cuadrado naranja girado de la marca, esquina inferior derecha */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 -right-20 h-48 w-48 rotate-45 rounded-[22%] bg-naranja/10"
        />
        <ul className="relative grid grid-cols-2 gap-1.5 p-1.5 lg:grid-cols-4">
          {STATS.map((s, k) => (
            <li
              key={s.label}
              className="group relative flex flex-col items-start gap-2.5 overflow-hidden rounded-2xl px-3 py-5 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_40px_-16px_rgba(255,118,25,.45)] sm:flex-row sm:items-center sm:gap-3.5 sm:px-5"
            >
              <span className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-azul text-[1.25rem] text-naranja shadow-[0_10px_22px_-12px_rgba(39,43,124,.8)] transition-all duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:bg-naranja group-hover:text-white sm:h-12 sm:w-12">
                <span
                  aria-hidden="true"
                  className="absolute -right-3 -top-3 h-6 w-6 rotate-45 rounded-[5px] bg-white/20"
                />
                <Bi n={ICONS[k % ICONS.length]} className="relative" />
              </span>
              <span className="min-w-0">
                <span className="block font-title text-[clamp(1.5rem,1.25rem+.9vw,2.1rem)] font-bold leading-none text-azul">
                  <StatOdometer value={s.value} suffix={s.suffix} active={visible} />
                </span>
                <span className="mt-1.5 block text-[0.8rem] font-medium leading-snug text-suave sm:text-[0.86rem]">
                  {s.label.charAt(0).toUpperCase() + s.label.slice(1)}
                </span>
              </span>
              {/* Franja naranja que crece desde la izquierda */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-naranja transition-transform duration-300 group-hover:scale-x-100"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
