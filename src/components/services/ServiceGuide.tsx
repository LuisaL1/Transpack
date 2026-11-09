import type { ServiceGuide as Guide } from "@/data/site";
import { Bi, Eyebrow, Reveal } from "@/components/ui";

const container = "mx-auto w-[min(100%-32px,1200px)]";

// Guía de términos de un servicio (por ahora, Mudanzas internacionales). El
// texto sale de "guide" en SERVICES (src/data/site.ts y site.en.ts).
export function ServiceGuide({ guide }: { guide: Guide }) {
  return (
    <section className="relative pb-[clamp(64px,8vw,112px)]">
      <div className={container}>
        <Reveal className="mb-12 max-w-3xl">
          <Eyebrow>{guide.eyebrow}</Eyebrow>
          <h2 className="mb-5 text-[clamp(1.8rem,1.2rem+2vw,2.6rem)] leading-[1.15]">
            {guide.title}
          </h2>
          <p className="text-[1.05rem]">{guide.lead}</p>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-2">
          {guide.sections.map((s, i) => (
            <Reveal
              as="article"
              key={s.title}
              delay={(i % 2) * 80}
              className="rounded-[22px] bg-gris p-7 md:p-9"
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
            </Reveal>
          ))}
          <Reveal
            as="article"
            delay={80}
            className="rounded-[22px] bg-azul p-7 text-white/80 md:p-9"
          >
            <div className="mb-5 flex items-center gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-xl text-naranja">
                <Bi n="heart-fill" />
              </span>
              <h3 className="text-xl leading-snug !text-white">{guide.closing.title}</h3>
            </div>
            {guide.closing.text.map((p, i) => (
              <p
                key={p}
                className={
                  i === guide.closing.text.length - 1
                    ? "font-title text-lg font-semibold text-white"
                    : "mb-4 text-[0.98rem]"
                }
              >
                {p}
              </p>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
