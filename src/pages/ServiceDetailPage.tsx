import { Link, useParams } from "react-router-dom";
import { useSite } from "@/data/content";
import { slugEs, useLang } from "@/i18n";
import { Bi, btn, Checks, Eyebrow, Reveal } from "@/components/ui";
import { CtaBand, PageHero } from "@/components/sections";
import NotFoundPage from "@/pages/NotFoundPage";

const container = "mx-auto w-[min(100%-32px,1200px)]";
const section = "relative py-[clamp(64px,8vw,112px)]";

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const { lang, lp, tr } = useLang();
  const { FAQS, SERVICES, waLink } = useSite();
  // En inglés la URL trae el slug traducido; internamente se usa el de español
  const service = SERVICES.find((s) => s.slug === slugEs(slug ?? "", lang));
  if (!service) return <NotFoundPage />;

  const others = SERVICES.filter((s) => s.slug !== service.slug);
  const quoteLink = lp(`/?servicio=${service.quote}#cotizar`);
  const generic = service.cta === "Cotizar" || service.cta === tr("Cotizar", "Get a quote");

  return (
    <>
      <PageHero image={service.image}>
        <nav
          aria-label={tr("Ruta", "Breadcrumb")}
          className="mb-6 flex items-center gap-2 text-[0.85rem] text-white/60"
        >
          <Link to={lp("/")} className="hover:text-white">
            {tr("Inicio", "Home")}
          </Link>
          <Bi n="chevron-right" className="text-[0.7rem]" />
          <Link to={lp("/#servicios")} className="hover:text-white">
            {tr("Servicios", "Services")}
          </Link>
          <Bi n="chevron-right" className="text-[0.7rem]" />
          <span className="text-white">{service.title}</span>
        </nav>
        <div className="animate-fade-up max-w-3xl">
          <span className="mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-white/10 text-3xl text-naranja">
            <Bi n={service.icon} />
          </span>
          <Eyebrow light>{service.kicker}</Eyebrow>
          <h1 className="mb-6 text-[clamp(2.1rem,1.4rem+2.8vw,3.6rem)] leading-[1.08] !text-white">
            {service.headline}
          </h1>
          <p className="mb-8 max-w-2xl text-[1.08rem]">{service.short}</p>
          <div className="flex flex-wrap gap-3">
            <Link to={quoteLink} className={`${btn.primary} ${btn.lg} w-full sm:w-auto`}>
              {generic
                ? tr(
                    `Cotizar ${service.title.toLowerCase()}`,
                    `Get a ${service.title.toLowerCase()} quote`,
                    {
                      fr: "Demander un devis",
                      de: "Angebot anfordern",
                      it: "Richiedi un preventivo",
                      ar: "اطلب عرض سعر",
                    },
                  )
                : service.cta}
            </Link>
            <a
              href={waLink(
                tr(
                  `Hola Transpack, quiero información sobre: ${service.title}`,
                  `Hello Transpack, I would like information about: ${service.title}`,
                  {
                    fr: `Bonjour Transpack, je souhaite des informations sur : ${service.title}`,
                    de: `Hallo Transpack, ich hätte gern Informationen zu: ${service.title}`,
                    it: `Ciao Transpack, vorrei informazioni su: ${service.title}`,
                    ar: `مرحبًا ترانسباك، أود الحصول على معلومات حول: ${service.title}`,
                  },
                ),
              )}
              target="_blank"
              rel="noopener"
              className={`${btn.ghost} ${btn.lg} w-full sm:w-auto`}
            >
              <Bi n="whatsapp" /> {tr("Escríbenos", "Message us")}
            </a>
          </div>
        </div>
      </PageHero>

      {/* Qué incluye */}
      <section className={section}>
        <div className={`${container} grid items-start gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20`}>
          <Reveal>
            <Eyebrow>{tr("El servicio", "The service")}</Eyebrow>
            <h2 className="mb-5 text-[clamp(1.8rem,1.2rem+2vw,2.6rem)] leading-[1.15]">
              {tr("¿Cómo lo hacemos?", "How do we do it?")}
            </h2>
            <p className="mb-8 text-[1.05rem]">{service.intro}</p>
            {service.note && (
              <p className="flex items-start gap-3 rounded-2xl bg-beige px-5 py-4 font-medium text-violeta">
                <Bi n="clock" className="mt-0.5 text-lg text-naranja" /> {service.note}
              </p>
            )}
          </Reveal>
          <Reveal delay={100} className="rounded-[22px] bg-gris p-8 md:p-10">
            <h3 className="mb-6 text-xl">{tr("Qué incluye", "What's included")}</h3>
            <Checks items={service.includes} />
          </Reveal>
        </div>
      </section>

      {/* Pasos */}
      <section className={`${section} bg-azul text-white/75`}>
        <div className={container}>
          <Reveal className="mb-12">
            <Eyebrow light>{tr("Paso a paso", "Step by step")}</Eyebrow>
            <h2 className="text-[clamp(1.8rem,1.2rem+2vw,2.6rem)] leading-[1.15] !text-white">
              {tr("Así será tu proceso", "What your process looks like")}
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
                <p className="text-[0.92rem]">{st.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Preguntas */}
      <section className={section}>
        <div className={`${container} grid items-start gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-20`}>
          <Reveal>
            <Eyebrow>{tr("Preguntas frecuentes", "Frequently asked questions")}</Eyebrow>
            <h2 className="mb-4 text-[clamp(1.8rem,1.2rem+2vw,2.6rem)] leading-[1.15]">
              {tr("Antes de cotizar", "Before you get a quote")}
            </h2>
            <p className="text-suave">
              {tr(
                "Si tienes otra duda, escríbenos y un asesor te responde.",
                "If you have another question, message us and an advisor will answer.",
              )}
            </p>
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
            <Eyebrow>{tr("Otros servicios", "Other services")}</Eyebrow>
            <h2 className="text-[clamp(1.6rem,1.2rem+1.4vw,2.2rem)]">
              {tr("Complementa tu traslado", "Complete your move")}
            </h2>
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
