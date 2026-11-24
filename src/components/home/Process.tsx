import { useRef } from "react";
import { useLang } from "@/i18n";
import { processText } from "@/data/home";
import { useSite } from "@/hooks/useContent";
import { useMotion } from "@/hooks/useMotion";
import { SectionHead } from "@/components/ui";
import { container, section } from "@/components/ui/layout";

// Pasos del proceso (PROCESS de src/data/site.ts). Movimiento (nov. 2026): en
// escritorio la línea punteada se dibuja con el scroll y cada paso se enciende
// (rombo y texto) cuando la línea llega a él; al subir, retrocede. En celular
// y tableta los pasos entran escalonados.
export function Process() {
  const { tr } = useLang();
  const t = processText(tr);
  const { PROCESS } = useSite();
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (m, el) => {
    const list = el.querySelector("ol")!;
    const steps = [...list.querySelectorAll("li")];
    m.gsap.matchMedia().add("(min-width: 1024px)", () => {
      const tl = m.gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: list, start: "top 75%", end: "bottom 45%", scrub: 0.6 },
      });
      tl.fromTo("[data-process-line]", { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);
      steps.forEach((li, i) => {
        const at = (i / Math.max(1, steps.length - 1)) * 0.92;
        tl.from(
          li.querySelector("[data-process-dot]"),
          { scale: 0.3, opacity: 0.2, duration: 0.12 },
          at,
        );
        tl.from(
          li.querySelectorAll("h3, p"),
          { y: 24, opacity: 0, duration: 0.14, stagger: 0.03 },
          at,
        );
      });
    });
    m.gsap.matchMedia().add("(max-width: 1023px)", () => {
      m.reveal(steps, list, { y: 36, stagger: 0.1 });
    });
  });
  return (
    <section id="proceso" ref={ref} className={section}>
      <div className={container}>
        <SectionHead eyebrow={t.eyebrow} title={t.title} sub={t.sub} />
        <ol className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          <span
            aria-hidden="true"
            data-process-line
            className="absolute origin-left start-7 end-[calc(20%-1rem)] top-7 hidden h-0.5 bg-[repeating-linear-gradient(90deg,#ff7619_0_8px,transparent_8px_16px)] lg:block"
          />
          {PROCESS.map((p, i) => (
            <li key={p.title} className="relative">
              <span
                data-process-dot
                className={`relative mb-6 grid h-14 w-14 rotate-45 place-items-center rounded-[14px] shadow-[0_0_0_8px_#fff] ${
                  i === PROCESS.length - 1 ? "bg-naranja" : "bg-azul"
                }`}
              >
                <span className="-rotate-45 font-title text-xl font-semibold text-white">
                  {i + 1}
                </span>
              </span>
              <h3 className="mb-2 text-[1.1rem]">{p.title}</h3>
              <p className="text-start text-[0.92rem] text-suave">{p.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
