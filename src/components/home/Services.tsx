import { Link } from "react-router-dom";
import { useLang } from "@/i18n";
import { servicesText } from "@/data/home";
import { useSite } from "@/hooks/useContent";
import { Bi, Eyebrow, Reveal } from "@/components/ui";
import { container, section } from "@/components/ui/layout";

// Tarjetas de servicios (SERVICES de src/data/site.ts) en cuadrícula de 3 × 2, con
// el rótulo arriba y el titular debajo, como cierre de la sección
export function Services() {
  const { lp, tr } = useLang();
  const t = servicesText(tr);
  const { SERVICES } = useSite();
  return (
    <section id="servicios" className={section}>
      <div className={container}>
        <Reveal className="mb-8 md:mb-10">
          <Eyebrow>{t.eyebrow}</Eyebrow>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 3) * 80}>
              <Link
                to={lp(`/servicios/${s.slug}`)}
                className={`group relative flex h-full flex-col overflow-hidden rounded-[20px] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-card)] ${
                  s.featured
                    ? "bg-gradient-to-br from-azul to-violeta text-white/80"
                    : "border border-linea bg-white hover:border-transparent"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="absolute -right-12 -top-12 h-20 w-20 rotate-45 rounded-[22%] bg-naranja opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
                <span
                  className={`grid h-12 w-12 place-items-center rounded-[12px] text-[1.4rem] transition-colors duration-300 ${
                    s.featured
                      ? "bg-white/10 text-naranja group-hover:bg-naranja group-hover:text-white"
                      : "bg-gris text-azul group-hover:bg-azul group-hover:text-white"
                  }`}
                >
                  <Bi n={s.icon} />
                </span>
                <h3 className={`mb-1.5 mt-4 text-lg ${s.featured ? "!text-white" : ""}`}>
                  {s.title}
                </h3>
                <p className="mb-3 flex-1 text-[0.9rem]">{s.short}</p>
                {s.tags && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {s.tags.map((t) => (
                      <span
                        key={t.label}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[0.78rem] font-semibold text-beige"
                      >
                        <Bi n={t.icon} /> {t.label}
                      </span>
                    ))}
                  </div>
                )}
                <span
                  className={`inline-flex items-center gap-1.5 text-[0.9rem] font-semibold ${
                    s.featured ? "text-white" : "text-azul"
                  }`}
                >
                  {t.more}{" "}
                  <Bi
                    n="arrow-right"
                    className="text-naranja transition-transform group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal className="mx-auto mt-12 max-w-3xl text-center md:mt-16">
          <h2 className="text-[clamp(1.9rem,1.2rem+2.4vw,3rem)] leading-[1.12]">{t.title}</h2>
        </Reveal>
      </div>
    </section>
  );
}
