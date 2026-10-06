import { useLang } from "@/i18n";
import { processText } from "@/data/home";
import { useSite } from "@/hooks/useContent";
import { Reveal, SectionHead } from "@/components/ui";
import { container, section } from "@/components/ui/layout";

// Pasos del proceso (PROCESS de src/data/site.ts)
export function Process() {
  const { tr } = useLang();
  const t = processText(tr);
  const { PROCESS } = useSite();
  return (
    <section id="proceso" className={section}>
      <div className={container}>
        <SectionHead eyebrow={t.eyebrow} title={t.title} sub={t.sub} />
        <ol className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          <span
            aria-hidden="true"
            className="absolute start-7 end-[calc(20%-1rem)] top-7 hidden h-0.5 bg-[repeating-linear-gradient(90deg,#ff7619_0_8px,transparent_8px_16px)] lg:block"
          />
          {PROCESS.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 80} className="relative">
              <span
                className={`relative mb-6 grid h-14 w-14 rotate-45 place-items-center rounded-[14px] shadow-[0_0_0_8px_#fff] ${
                  i === PROCESS.length - 1 ? "bg-naranja" : "bg-azul"
                }`}
              >
                <span className="-rotate-45 font-title text-xl font-semibold text-white">
                  {i + 1}
                </span>
              </span>
              <h3 className="mb-2 text-[1.1rem]">{p.title}</h3>
              <p className="text-[0.92rem] text-suave">{p.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
