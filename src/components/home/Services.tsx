import { Link } from "react-router-dom";
import { useLang } from "@/i18n";
import { servicesText } from "@/data/home";
import { useSite } from "@/hooks/useContent";
import { Bi, Reveal, SectionHead } from "@/components/ui";
import { container, section } from "@/components/ui/layout";

// Tarjetas de servicios (SERVICES de src/data/site.ts)
export function Services() {
  const { lp, tr } = useLang();
  const t = servicesText(tr);
  const { SERVICES } = useSite();
  return (
    <section id="servicios" className={section}>
      <div className={container}>
        <SectionHead eyebrow={t.eyebrow} title={t.title} sub={t.sub} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 3) * 80}>
              <Link
                to={lp(`/servicios/${s.slug}`)}
                className={`group relative flex h-full flex-col overflow-hidden rounded-[22px] p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-card)] ${
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
                  className={`grid h-14 w-14 place-items-center rounded-[14px] text-[1.6rem] transition-colors duration-300 ${
                    s.featured
                      ? "bg-white/10 text-naranja group-hover:bg-naranja group-hover:text-white"
                      : "bg-gris text-azul group-hover:bg-azul group-hover:text-white"
                  }`}
                >
                  <Bi n={s.icon} />
                </span>
                <h3 className={`mb-2 mt-5 text-xl ${s.featured ? "!text-white" : ""}`}>
                  {s.title}
                </h3>
                <p className="mb-4 flex-1 text-[0.95rem]">{s.short}</p>
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
                  className={`inline-flex items-center gap-1.5 text-[0.93rem] font-semibold ${
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
      </div>
    </section>
  );
}
