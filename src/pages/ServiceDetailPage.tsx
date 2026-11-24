import { Link, useParams } from "react-router-dom";
import { useSite } from "@/hooks/useContent";
import { slugEs, useLang } from "@/i18n";
import { Bi, btn, Checks, Eyebrow, PhotoFrame, Reveal } from "@/components/ui";
import { CtaBand, PageHero } from "@/components/sections";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ColombiaRoutesMap } from "@/components/services/ColombiaRoutesMap";
import { ServiceGuide } from "@/components/services/ServiceGuide";

const container = "mx-auto w-[min(100%-32px,1200px)]";
const section = "relative py-[clamp(64px,8vw,112px)]";
import { serviceDetailText } from "@/data/pages";

// Detalle de servicio (/servicios/:slug). El servicio sale de SERVICES en
// src/data/site.ts; los textos de la página están en src/data/pages.ts.
export function ServiceDetailPage() {
  const { slug } = useParams();
  const { lang, lp, tr } = useLang();
  const t = serviceDetailText(tr);
  const { FAQS, SERVICES, waLink } = useSite();
  // En inglés la URL trae el slug traducido; internamente se usa el de español
  const service = SERVICES.find((s) => s.slug === slugEs(slug ?? "", lang));
  if (!service) return <NotFoundPage />;

  const others = SERVICES.filter((s) => s.slug !== service.slug);
  const quoteLink = lp(`/?servicio=${service.quote}#cotizar`);
  const generic = service.cta === "Cotizar" || service.cta === t.cotizar;

  return (
    <>
      <PageHero
        image={service.image}
        media={service.heroMap ? <ColombiaRoutesMap /> : undefined}
        drop={service.imageDrop}
        blend={service.imageBlend}
        tab={
          // Pestaña de la foto: el servicio, con su ícono
          <span className="inline-flex items-center gap-2.5 font-title text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-azul">
            <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-azul text-[0.95rem] text-naranja">
              <Bi n={service.icon} />
            </span>
            {service.title}
          </span>
        }
      >
        <nav aria-label={t.ruta} className="mb-4 flex items-center gap-2 text-[0.85rem] text-suave">
          <Link to={lp("/")} className="hover:text-azul">
            {t.inicio}
          </Link>
          <Bi n="chevron-right" className="text-[0.7rem]" />
          <Link to={lp("/#servicios")} className="hover:text-azul">
            {t.servicios}
          </Link>
          <Bi n="chevron-right" className="text-[0.7rem]" />
          <span className="font-semibold text-azul">{service.title}</span>
        </nav>
        <div className="animate-fade-up max-w-3xl">
          <span className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-azul text-[1.6rem] text-naranja shadow-[0_12px_26px_-12px_rgba(39,43,124,.8)]">
            <Bi n={service.icon} />
          </span>
          {service.kicker && <Eyebrow>{service.kicker}</Eyebrow>}
          <h1 className="mb-6 text-[clamp(1.7rem,1.15rem+2vw,2.75rem)] leading-[1.12] text-tinta">
            {service.headline}
          </h1>
          <p className="mb-8 max-w-2xl text-start text-[1.08rem] text-texto">{service.short}</p>
          <div className="flex flex-wrap gap-3">
            <Link to={quoteLink} className={`${btn.primary} ${btn.lg} w-full sm:w-auto`}>
              {generic ? t.quoteService(service.title) : service.cta}
            </Link>
            <a
              href={waLink(t.whatsappAbout(service.title))}
              target="_blank"
              rel="noopener"
              className={`${btn.outline} ${btn.lg} w-full sm:w-auto`}
            >
              <Bi n="whatsapp" /> {t.escribenos}
            </a>
          </div>
        </div>
      </PageHero>

      {/* Qué incluye */}
      <section className={section}>
        <div className={`${container} grid items-start gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20`}>
          <Reveal>
            <Eyebrow>{t.servicio}</Eyebrow>
            <h2 className="mb-5 text-[clamp(1.8rem,1.2rem+2vw,2.6rem)] leading-[1.15]">
              {t.comoHacemos}
            </h2>
            <p className="mb-8 text-[1.05rem]">{service.intro}</p>
            {service.commitment && (
              <p className="mb-4 flex items-start gap-3 rounded-2xl bg-gris px-5 py-4 text-violeta">
                <Bi n="heart" className="mt-0.5 text-lg text-naranja" />
                <span>
                  <strong>{t.compromiso}</strong> {service.commitment}
                </span>
              </p>
            )}
            {service.note && (
              <p className="flex items-start gap-3 rounded-2xl bg-beige px-5 py-4 text-start font-medium text-violeta">
                <Bi n="clock" className="mt-0.5 text-lg text-naranja" /> {service.note}
              </p>
            )}
          </Reveal>
          {service.includes ? (
            <Reveal delay={100} className="rounded-[22px] bg-gris p-8 md:p-10">
              <h3 className="mb-6 text-xl">{t.incluye}</h3>
              <Checks items={service.includes} />
            </Reveal>
          ) : (
            service.photo && (
              <Reveal delay={100}>
                <PhotoFrame tab corner="tr" className="aspect-[4/3]">
                  <img
                    src={service.photo.src}
                    alt={service.photo.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </PhotoFrame>
              </Reveal>
            )
          )}
        </div>
      </section>

      {/* Guía de términos (solo los servicios que la tienen) */}
      {service.guide && <ServiceGuide guide={service.guide} />}

      {/* Pasos o, en su lugar, carrusel de fotos */}
      {service.reel && (
        <section className={`${section} bg-azul text-white/75`}>
          <Reveal className={`${container} mb-12`}>
            <Eyebrow light>{t.nuestroTrabajo}</Eyebrow>
            <h2 className="text-[clamp(1.8rem,1.2rem+2vw,2.6rem)] leading-[1.15] !text-white">
              {t.asiProtegemos}
            </h2>
          </Reveal>
          <div className="marquee flex overflow-hidden" dir="ltr">
            {[0, 1].map((k) => (
              <ul
                key={k}
                className="animate-marquee flex shrink-0 gap-5 pr-5"
                aria-hidden={k === 1}
              >
                {service.reel?.map((p) => (
                  <li key={p.caption} className="w-[min(78vw,340px)] shrink-0">
                    <PhotoFrame tab className="aspect-[4/5] [--frame-bg:var(--color-azul)]">
                      <img
                        src={p.src}
                        alt={k === 1 ? "" : p.caption}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    </PhotoFrame>
                    <p className="mt-3 text-start text-[0.92rem]">{p.caption}</p>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </section>
      )}
      {service.steps && (
        <section className={`${section} bg-azul text-white/75`}>
          <div className={container}>
            <Reveal className="mb-12">
              <Eyebrow light>{t.pasoPaso}</Eyebrow>
              <h2 className="text-[clamp(1.8rem,1.2rem+2vw,2.6rem)] leading-[1.15] !text-white">
                {t.asiSeraProceso}
              </h2>
            </Reveal>
            <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {service.steps.map((st, i) => (
                <Reveal
                  as="li"
                  key={st.title}
                  delay={i * 80}
                  className="relative rounded-[22px] border border-white/10 bg-white/5 p-7"
                >
                  <span
                    className="mb-4 block font-title text-[2.6rem] font-bold leading-none text-transparent"
                    style={{ WebkitTextStroke: "1.5px #ff7619" }}
                  >
                    0{i + 1}
                  </span>
                  <h3 className="mb-2 text-lg !text-white">{st.title}</h3>
                  <p className="text-start text-[0.92rem]">{st.text}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Preguntas */}
      <section className={section}>
        <div className={`${container} grid items-start gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-20`}>
          <Reveal>
            <Eyebrow>{t.preguntasFrecuentes}</Eyebrow>
            <h2 className="mb-4 text-[clamp(1.8rem,1.2rem+2vw,2.6rem)] leading-[1.15]">
              {t.antesCotizar}
            </h2>
            <p className="text-start text-suave">{t.siTienesOtraDuda}</p>
          </Reveal>
          <Reveal className="faq">
            {FAQS.slice(0, 4).map((f) => (
              <details key={f.q} className="border-b border-linea">
                <summary className="flex cursor-pointer items-center justify-between gap-4 py-5 font-title text-[1.05rem] font-semibold text-tinta hover:text-azul">
                  {f.q}
                  <span className="faq-icon grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-gris text-azul transition-all duration-300">
                    <Bi n="plus-lg" />
                  </span>
                </summary>
                <p className="pb-6 text-suave">{f.a}</p>
              </details>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Otros servicios */}
      <section className={`${section} bg-gris`}>
        <div className={container}>
          <Reveal className="mb-10">
            <Eyebrow>{t.otrosServicios}</Eyebrow>
            <h2 className="text-[clamp(1.6rem,1.2rem+1.4vw,2.2rem)]">{t.complementaTraslado}</h2>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {others.map((o, i) => (
              <Reveal key={o.slug} delay={i * 60}>
                <Link
                  to={lp(`/servicios/${o.slug}`)}
                  className="group flex h-full flex-col gap-3 rounded-2xl bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-card)]"
                >
                  <Bi
                    n={o.icon}
                    className="text-2xl text-azul transition-colors group-hover:text-naranja"
                  />
                  <span className="flex-1 font-title font-semibold leading-snug text-tinta">
                    {o.title}
                  </span>
                  <Bi
                    n="arrow-right"
                    className="text-naranja transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
