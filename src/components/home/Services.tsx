import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "@/i18n";
import { servicesText } from "@/data/home";
import { useSite } from "@/hooks/useContent";
import { useMotion } from "@/hooks/useMotion";
import { Bi, Eyebrow, PhotoFrame } from "@/components/ui";
import { container, section } from "@/components/ui/layout";

// Explorador de servicios (SERVICES de src/data/site.ts; nov. 2026, estilo
// terminal-industries). En escritorio: la lista numerada a la izquierda (el
// servicio activo se despliega con su descripción, el enlace y una barra de
// avance) y, a la derecha, su foto grande en un PhotoFrame, fija mientras se
// recorre la lista; la foto nueva entra con un barrido sobre la anterior.
// Avanza solo cada 6 s mientras la sección está a la vista y sin el puntero
// encima: la barra de avance es una animación CSS y, al terminar, pasa al
// siguiente (con movimiento reducido no avanza sola). En celular y tableta
// todos van desplegados, cada uno con su foto.
export function Services() {
  const { lp, tr } = useLang();
  const t = servicesText(tr);
  const { SERVICES } = useSite();
  const [active, setActive] = useState(0);
  // El que se ve debajo mientras entra el nuevo
  const [previous, setPrevious] = useState(0);
  const [hover, setHover] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.35,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Celular y tableta: las tarjetas entran escalonadas
  useMotion(ref, (m, el) => {
    m.gsap.matchMedia().add("(max-width: 1023px)", () => {
      m.reveal(el.querySelectorAll("[data-service]"), el.querySelector("ul")!, {
        y: 50,
        stagger: 0.1,
      });
    });
  });

  const select = (i: number) => {
    if (i === active) return;
    setPrevious(active);
    setActive(i);
  };
  const playing = inView && !hover;

  return (
    <section id="servicios" ref={ref} className={section}>
      <div className={container}>
        <div className="mb-10 max-w-3xl md:mb-14">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h2 className="text-[clamp(1.9rem,1.2rem+2.4vw,3rem)] leading-[1.12]">{t.title}</h2>
        </div>
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14">
          <ul
            className="border-t border-linea"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            {SERVICES.map((s, i) => {
              const on = i === active;
              const panel = `servicio-${s.slug}`;
              return (
                <li key={s.slug} data-service className="relative border-b border-linea">
                  <button
                    type="button"
                    onClick={() => select(i)}
                    aria-expanded={on}
                    aria-controls={panel}
                    className="group flex w-full items-center gap-4 py-5 text-start"
                  >
                    <span
                      className={`w-7 shrink-0 font-title text-[0.8rem] font-semibold tabular-nums transition-colors duration-300 ${
                        on ? "text-naranja" : "text-suave"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-[12px] text-[1.25rem] transition-all duration-300 ${
                        on
                          ? "rotate-0 bg-azul text-naranja shadow-[0_10px_22px_-12px_rgba(39,43,124,.8)]"
                          : "bg-gris text-azul lg:-rotate-6 lg:group-hover:rotate-0"
                      }`}
                    >
                      <Bi n={s.icon} />
                    </span>
                    <span
                      className={`flex-1 font-title text-[clamp(1.1rem,1rem+.5vw,1.45rem)] font-semibold transition-colors duration-300 ${
                        on ? "text-azul" : "text-azul lg:text-tinta/75 lg:group-hover:text-azul"
                      }`}
                    >
                      {s.title}
                    </span>
                    <Bi
                      n="plus-lg"
                      className={`hidden text-azul transition-transform duration-500 lg:block ${
                        on ? "rotate-45" : ""
                      }`}
                    />
                  </button>
                  {/* Abierto: siempre en celular; en escritorio, solo el activo */}
                  <div
                    id={panel}
                    className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.22,.61,.36,1)] ${
                      on ? "grid-rows-[1fr]" : "grid-rows-[1fr] lg:grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="pb-6 ps-11 lg:ps-[4.75rem]">
                        <p className="mb-4 max-w-[52ch] text-start text-[0.98rem] text-texto">
                          {s.short}
                        </p>
                        <Link
                          to={lp(`/servicios/${s.slug}`)}
                          className="inline-flex items-center gap-2 font-semibold text-azul [&_.bi]:transition-transform hover:[&_.bi]:translate-x-1"
                        >
                          {t.more} <Bi n="arrow-right" className="text-naranja" />
                        </Link>
                        {/* Foto en celular y tableta */}
                        <PhotoFrame tab corner="tr" className="mt-5 aspect-[16/10] lg:hidden">
                          <img
                            src={s.image}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover"
                          />
                        </PhotoFrame>
                      </div>
                    </div>
                  </div>
                  {/* Barra de avance del activo (escritorio): al terminar, el siguiente */}
                  {on && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-px hidden h-0.5 lg:block"
                    >
                      <span
                        key={active}
                        onAnimationEnd={() => select((active + 1) % SERVICES.length)}
                        className="svc-progress block h-full origin-left bg-naranja"
                        style={{ animationPlayState: playing ? "running" : "paused" }}
                      />
                    </span>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Foto grande del activo (escritorio), fija mientras se recorre la lista */}
          <div className="sticky top-28 hidden lg:block">
            <PhotoFrame
              className="aspect-[5/4]"
              tab={
                <Link
                  to={lp(`/servicios/${SERVICES[active].slug}`)}
                  className="inline-flex items-center gap-2.5 font-title text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-azul [&_.bi-arrow-right]:transition-transform hover:[&_.bi-arrow-right]:translate-x-1"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-azul text-[0.95rem] text-naranja">
                    <Bi n={SERVICES[active].icon} />
                  </span>
                  {SERVICES[active].title}
                  <Bi n="arrow-right" className="text-naranja" />
                </Link>
              }
            >
              {SERVICES.map((s, i) => (
                <img
                  key={s.slug}
                  src={s.image}
                  alt={i === active ? s.title : ""}
                  loading="lazy"
                  decoding="async"
                  className={`svc-photo absolute inset-0 h-full w-full object-cover ${
                    i === active ? "is-on" : i === previous ? "is-prev" : ""
                  }`}
                />
              ))}
            </PhotoFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
