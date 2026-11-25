import { useRef, type CSSProperties } from "react";
import { useMotion } from "@/hooks/useMotion";

export type Step = { title: string; text: string };

// Pasos numerados en línea (Proceso del inicio y "Así será el proceso" de cada
// servicio). Movimiento (nov. 2026): en escritorio la línea punteada se dibuja
// con el scroll y cada paso se enciende (rombo y texto) cuando la línea llega a
// él; al subir, retrocede. En celular y tableta los pasos entran escalonados.
// Con `pin` (páginas de servicio, pedido del cliente, nov. 2026), en
// escritorio la sección queda fija mientras se baja: la línea avanza y los
// pasos se encienden con el scroll, y la página solo sigue cuando están todos
// completos. Se fija el contenedor marcado con `data-steps-pin` (un div dentro
// de la sección, nunca la sección: ver "Fijar con ScrollTrigger" en AGENTS.md).
// `tone`: "light" sobre blanco (o sobre otro fondo claro: el aro de los rombos
// toma `--steps-ring`), "dark" sobre azul. El último paso va en naranja
// (en "dark", todos naranja y el último en blanco).
export function StepsTimeline({
  items,
  tone = "light",
  pin = false,
}: {
  items: Step[];
  tone?: "light" | "dark";
  pin?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const dark = tone === "dark";
  const n = items.length;

  useMotion(ref, (m, box) => {
    const list = box.querySelector("ol")!;
    const steps = [...list.querySelectorAll("li")];
    m.gsap.matchMedia().add("(min-width: 1024px)", () => {
      const pinned = pin ? (box.closest<HTMLElement>("[data-steps-pin]") ?? box) : null;
      const tl = m.gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: pinned
          ? {
              trigger: pinned,
              start: "top top",
              // Unas 0,45 pantallas de scroll por paso
              end: () => `+=${Math.round(window.innerHeight * 0.45 * steps.length)}`,
              pin: pinned,
              scrub: 0.6,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            }
          : { trigger: list, start: "top 75%", end: "bottom 45%", scrub: 0.6 },
      });
      tl.fromTo("[data-step-line]", { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);
      steps.forEach((li, i) => {
        const at = (i / Math.max(1, steps.length - 1)) * 0.92;
        tl.from(
          li.querySelector("[data-step-dot]"),
          { scale: 0.3, opacity: 0.2, duration: 0.12 },
          at,
        );
        tl.from(
          li.querySelectorAll("h3, p"),
          { y: 24, opacity: 0, duration: 0.14, stagger: 0.03 },
          at,
        );
      });
      // Fija: con todos los pasos encendidos se queda un momento antes de seguir
      if (pinned) tl.to({}, { duration: 0.25 });
    });
    m.gsap.matchMedia().add("(max-width: 1023px)", () => {
      m.reveal(steps, list, { y: 36, stagger: 0.1 });
    });
  });

  return (
    <div ref={ref} className="relative">
      {/* La línea va del primer rombo al último (fuera de la lista: en un <ol>
          solo van <li>) */}
      <span
        aria-hidden="true"
        data-step-line
        className="pointer-events-none absolute start-7 top-7 hidden h-0.5 origin-left bg-[repeating-linear-gradient(90deg,#ff7619_0_8px,transparent_8px_16px)] lg:block"
        style={{ insetInlineEnd: `calc(${100 / n}% - 1rem)` }}
      />
      <ol
        className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-[repeat(var(--steps),minmax(0,1fr))] lg:gap-6"
        style={{ "--steps": n } as CSSProperties}
      >
        {items.map((p, i) => {
          const last = i === n - 1;
          const dot = dark
            ? last
              ? "bg-white text-azul"
              : "bg-naranja text-white"
            : last
              ? "bg-naranja text-white"
              : "bg-azul text-white";
          return (
            <li key={p.title} className="relative">
              <span
                data-step-dot
                className={`relative mb-6 grid h-14 w-14 rotate-45 place-items-center rounded-[14px] ${dot} ${
                  dark ? "shadow-[0_0_0_8px_#272b7c]" : "shadow-[0_0_0_8px_var(--steps-ring,#fff)]"
                }`}
              >
                <span className="-rotate-45 font-title text-xl font-semibold">{i + 1}</span>
              </span>
              <h3 className={`mb-2 text-[1.1rem] ${dark ? "!text-white" : ""}`}>{p.title}</h3>
              <p className={`text-start text-[0.92rem] ${dark ? "text-white/75" : "text-suave"}`}>
                {p.text}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
