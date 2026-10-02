import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import lacmaImg from "@/imports/lacma.jpg";
import imgGlobal from "@/imports/global.jpg";
import imgBarco from "@/imports/barco.jpg";
import { usePosts, useSite } from "@/data/content";
import { useLang } from "@/i18n";
import { CLIENT_LOGOS, logoHeight } from "@/data/clientLogos";
import { Bi, btn, Checks, StatValue, Eyebrow, Reveal, SectionHead } from "@/components/ui";
import { CtaBand } from "@/components/sections";
import WorldMap from "@/components/WorldMap";
import QuoteWizard from "@/components/QuoteWizard";
import VideoShorts from "@/components/VideoShorts";

const container = "mx-auto w-[min(100%-32px,1200px)]";
const section = "relative py-[clamp(72px,9vw,128px)]";

// ─── Hero ─────────────────────────────────────────────────────────────────────
// Degradado de azul profundo (arriba) a blanco (abajo), con el mapamundi de
// rutas reales y los clientes al pie, sobre la zona clara.

function Hero() {
  const { lp, tr } = useLang();
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#0d0f33_0%,#1b1e5c_20%,#272b7c_40%,#4248c4_60%,#9b9fe6_78%,#e9eafa_90%,#ffffff_100%)] pt-[136px] text-white/80 md:pt-[150px]">
      {/* Retícula sutil */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:120px_120px] [mask-image:linear-gradient(180deg,#000_0%,#000_55%,transparent_85%)]"
      />
      {/* Semitono de puntos, esquina superior derecha */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-24 h-[640px] w-[640px] bg-[radial-gradient(rgba(255,255,255,.28)_1.2px,transparent_1.6px)] bg-[size:9px_9px] [mask-image:radial-gradient(circle,#000_0%,transparent_65%)]"
      />
      {/* Luz naranja tenue detrás del titular */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-24 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-naranja/10 blur-[110px]"
      />

      <div className={`${container} animate-fade-up relative text-center`}>
        <Link
          to={lp("/#cobertura")}
          className="group mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[0.76rem] font-medium text-white/80 backdrop-blur transition-colors hover:bg-white/10 hover:text-white"
        >
          <span className="h-2 w-2 rounded-full bg-naranja shadow-[0_0_0_4px_rgba(255,118,25,.25)]" />
          <span>
            {tr("Desde 1968", "Since 1968")} ·{" "}
            <span className="hidden sm:inline">
              {tr("Certificados LACMA, IAM y PAIMA", "LACMA, IAM and PAIMA certified")}
            </span>
            <span className="sm:hidden">LACMA · IAM · PAIMA</span>
          </span>
          <Bi
            n="chevron-right"
            className="text-[0.7rem] transition-transform group-hover:translate-x-0.5"
          />
        </Link>
        <h1 className="mx-auto mb-5 max-w-[900px] text-[clamp(2rem,1.3rem+2.2vw,3.3rem)] leading-[1.12] !text-white">
          {tr("Movemos lo que más importa,", "We move what matters most,")}
          <br />
          {tr("a ", "")}
          <span className="text-naranja">
            {tr("cualquier lugar del mundo", "anywhere in the world")}
          </span>
        </h1>
        <p className="mx-auto mb-8 max-w-[560px] text-[clamp(.98rem,.94rem+.2vw,1.08rem)] text-white/70">
          {tr(
            "Mudanzas locales, nacionales e internacionales, bodegaje y movilidad corporativa con el respaldo de 58 años de experiencia.",
            "Local, national and international moving, storage and corporate mobility, backed by 58 years of experience.",
          )}
        </p>
        <Link to={lp("/#cotizar")} className={`${btn.primary} ${btn.md}`}>
          {tr("Cotiza tu mudanza", "Get a moving quote")}
        </Link>
      </div>

      {/* Mapamundi con rutas reales desde Bogotá */}
      <div
        dir="ltr"
        className="relative mx-auto -mb-6 mt-12 w-[170%] max-w-[1180px] -translate-x-[20%] sm:w-[125%] sm:-translate-x-[10%] md:mt-8 md:w-full md:translate-x-0"
      >
        <WorldMap />
      </div>
      <div className="relative flex flex-wrap justify-center gap-x-6 gap-y-2 px-4 pt-2 text-[0.8rem] font-medium text-tinta/80">
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-naranja" />{" "}
          {tr("Bogotá, punto de origen", "Bogotá, point of origin")}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffb27a]" />{" "}
          {tr("Países donde hemos atendido embajadas", "Countries whose embassies we have served")}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-white ring-1 ring-tinta/20" />{" "}
          {tr("Red de agentes en 176 países", "Agent network in 176 countries")}
        </span>
      </div>

      {/* Clientes */}
      <div
        className="relative pb-14 pt-10"
        aria-label={tr("Empresas que confían en Transpack", "Companies that trust Transpack")}
      >
        <p className="mb-7 px-4 text-center text-[0.95rem] font-medium text-texto">
          {tr(
            "Empresas, embajadas y organismos que han confiado su movilidad a Transpack",
            "Companies, embassies and institutions that have trusted Transpack with their mobility",
          )}
        </p>
        <div className="marquee flex overflow-hidden" dir="ltr">
          {[0, 1].map((k) => (
            <div
              key={k}
              className="animate-marquee flex shrink-0 items-center gap-16 pr-16"
              aria-hidden={k === 1}
            >
              {CLIENT_LOGOS.map((c) => (
                <img
                  key={c.name}
                  src={c.src}
                  alt={k === 0 ? c.name : ""}
                  title={c.name}
                  style={{ height: logoHeight(c.ratio), width: logoHeight(c.ratio) * c.ratio }}
                  className="shrink-0 object-contain opacity-55 brightness-0 transition-opacity duration-300 hover:opacity-90"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const { tr } = useLang();
  const { STATS } = useSite();
  return (
    <section className="pb-4 pt-6" aria-label={tr("Transpack en cifras", "Transpack in numbers")}>
      <div
        className={`${container} grid grid-cols-2 overflow-hidden rounded-[22px] bg-white shadow-[var(--shadow-float)] lg:grid-cols-4`}
      >
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={`flex flex-col gap-1.5 px-5 py-6 sm:px-7 sm:py-8 ${i % 2 ? "border-s border-linea" : ""} ${
              i >= 2 ? "border-t border-linea lg:border-s lg:border-t-0" : ""
            }`}
          >
            <span className="font-title text-[clamp(2.1rem,1.6rem+1.6vw,3rem)] font-semibold leading-none text-azul">
              <StatValue value={s.value} suffix={s.suffix} />
            </span>
            <span className="text-[0.88rem] font-medium text-suave">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Servicios ────────────────────────────────────────────────────────────────

function Services() {
  const { lp, tr } = useLang();
  const { SERVICES } = useSite();
  return (
    <section id="servicios" className={section}>
      <div className={container}>
        <SectionHead
          eyebrow={tr("Servicios", "Services")}
          title={tr(
            "Una solución integral para cada traslado",
            "A complete solution for every move",
          )}
          sub={tr(
            "La mudanza es el centro de lo que hacemos. Alrededor de ella combinamos embalaje, bodegaje, documentación y coordinación especializada para que no tengas que preocuparte por nada.",
            "Moving is at the heart of what we do. Around it we combine packing, storage, documentation and specialized coordination so you don't have to worry about a thing.",
          )}
        />
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
                  className="absolute -right-12 -top-12 h-20 w-20 rotate-45 bg-naranja opacity-0 transition-opacity duration-300 group-hover:opacity-100"
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
                  {tr("Ver servicio", "View service")}{" "}
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

// ─── Soluciones por segmento ──────────────────────────────────────────────────

function Segments() {
  const { lp, tr } = useLang();
  const { SEGMENTS } = useSite();
  const [active, setActive] = useState(0);
  // El menú abre un segmento concreto con ?segmento=<id>#soluciones
  const [params] = useSearchParams();
  const wanted = params.get("segmento");
  useEffect(() => {
    const i = SEGMENTS.findIndex((s) => s.id === wanted);
    if (i >= 0) setActive(i);
  }, [wanted]);
  const seg = SEGMENTS[active];
  return (
    <section id="soluciones" className={`${section} bg-gris`}>
      <div className={container}>
        <SectionHead
          eyebrow={tr("Soluciones", "Solutions")}
          title={tr(
            "Diseñamos el servicio según quién se mueve",
            "We design the service around who is moving",
          )}
          sub={tr(
            "Personas, empresas e instituciones tienen necesidades distintas. Por eso trabajamos con tres unidades especializadas y un acompañamiento dedicado para quienes empiezan una vida en otro país.",
            "People, companies and institutions have different needs. That is why we work with three specialized units and dedicated support for those starting a life in another country.",
          )}
        />
        <Reveal>
          <div
            role="tablist"
            aria-label={tr("Soluciones por segmento", "Solutions by segment")}
            className="mb-8 flex w-full max-w-full gap-1.5 overflow-x-auto rounded-2xl bg-white p-1.5 shadow-sm [scrollbar-width:none] sm:w-fit sm:rounded-full"
          >
            {SEGMENTS.map((s, i) => (
              <button
                key={s.id}
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-3 text-[0.9rem] font-semibold transition-colors ${
                  i === active ? "bg-azul text-white" : "text-suave hover:text-azul"
                }`}
              >
                <Bi n={s.icon} className={i === active ? "text-naranja" : ""} /> {s.tab}
              </button>
            ))}
          </div>
          <div
            key={seg.id}
            role="tabpanel"
            className="animate-fade-up grid items-center gap-8 rounded-[22px] bg-white p-4 shadow-sm md:p-6 lg:grid-cols-2 lg:gap-16"
          >
            <div className="aspect-[4/3.3] overflow-hidden rounded-2xl">
              <img src={seg.image} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="px-2 py-2 lg:pr-6">
              <p className="mb-3 font-title text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-naranja">
                {seg.kicker}
              </p>
              <h3 className="mb-4 text-[clamp(1.4rem,1.1rem+1vw,2rem)] leading-tight">
                {seg.title}
              </h3>
              <p className="mb-6">{seg.text}</p>
              <Checks items={seg.points} />
              <Link
                to={lp(`/?servicio=${seg.quote}#cotizar`)}
                className={`${btn.secondary} ${btn.md} mt-8`}
              >
                {seg.cta}
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Levels() {
  const { lang, lp, tr } = useLang();
  const { LEVELS } = useSite();
  return (
    <section id="niveles" className={section}>
      <div className={container}>
        <SectionHead
          center
          eyebrow={tr("Niveles de servicio", "Service levels")}
          title={tr("Tú decides cuánto delegar", "You decide how much to hand over")}
          sub={tr(
            "No cotizamos solo “una mudanza”: cotizamos la mudanza con el nivel de servicio que necesitas.",
            "We don't just quote “a move”: we quote your move with the service level you need.",
          )}
        />
        <div className="mx-auto grid max-w-[520px] gap-6 lg:max-w-none lg:grid-cols-3">
          {LEVELS.map((l, i) => (
            <Reveal key={l.n} delay={i * 80}>
              <article
                className={`relative flex h-full flex-col rounded-[22px] px-8 pb-8 pt-10 transition-all duration-300 hover:-translate-y-1.5 ${
                  l.featured
                    ? "bg-azul text-white/75 shadow-[var(--shadow-float)] lg:-translate-y-3 lg:hover:-translate-y-4"
                    : "border border-linea bg-white hover:shadow-[var(--shadow-card)]"
                }`}
              >
                {l.featured && (
                  <span className="absolute right-6 top-6 rounded-full bg-naranja px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-white">
                    {tr("Más solicitado", "Most popular")}
                  </span>
                )}
                <span
                  className="mb-4 block font-title text-[3.2rem] font-bold leading-none text-transparent"
                  style={{
                    WebkitTextStroke: `1.5px ${l.featured ? "#faeed9" : "#ff7619"}`,
                  }}
                >
                  {l.n}
                </span>
                <h3 className={`mb-2 text-xl ${l.featured ? "!text-white" : ""}`}>{l.title}</h3>
                <p className={`mb-6 ${l.featured ? "" : "text-suave"}`}>{l.text}</p>
                <div className="mb-8 flex-1">
                  <Checks items={l.points} light={l.featured} small />
                </div>
                <Link
                  to={lp(`/?nivel=${i + 1}#cotizar`)}
                  className={`${l.featured ? btn.primary : btn.outline} ${btn.md} w-full`}
                >
                  {tr("Elegir", "Choose")}{" "}
                  {lang === "de" || lang === "ar" ? l.title : l.title.toLowerCase()}
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Cobertura ────────────────────────────────────────────────────────────────

function Coverage() {
  const { tr } = useLang();
  return (
    <section id="cobertura" className={`${section} overflow-hidden bg-violeta text-white/78`}>
      <span
        aria-hidden="true"
        className="absolute -right-[300px] -top-[200px] h-[900px] w-[900px] rotate-45 bg-gradient-to-br from-white/4 to-transparent"
      />
      <div
        className={`${container} relative grid items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16`}
      >
        <Reveal>
          <Eyebrow light>{tr("Cobertura global", "Global coverage")}</Eyebrow>
          <h2 className="mb-5 text-[clamp(1.9rem,1.2rem+2.4vw,3rem)] leading-[1.12] !text-white">
            {tr(
              "De Colombia al mundo, con una red que no se improvisa",
              "From Colombia to the world, with a network you can't improvise",
            )}
          </h2>
          <p>
            {tr(
              "Casi seis décadas construyendo una red operativa con más de 2.000 agentes internacionales en 176 países: Estados Unidos, Canadá, la Unión Europea, Asia y toda Latinoamérica. Tu mudanza se opera con los mismos estándares en origen y en destino.",
              "Almost six decades building an operating network of more than 2,000 international agents in 176 countries: the United States, Canada, the European Union, Asia and all of Latin America. Your move runs to the same standards at origin and destination.",
            )}
          </p>
          <div className="my-8 grid gap-4 sm:grid-cols-2">
            {[
              [
                "water",
                tr("Marítima", "Sea freight"),
                tr(
                  "Ideal para grandes volúmenes y menaje completo.",
                  "Ideal for large volumes and full households.",
                ),
              ],
              [
                "airplane",
                tr("Aérea", "Air freight"),
                tr(
                  "Más rápida, para cargas pequeñas o urgentes.",
                  "Faster, for small or urgent shipments.",
                ),
              ],
            ].map(([icon, t, d]) => (
              <div
                key={t}
                className="flex gap-3.5 rounded-2xl border border-white/10 bg-white/6 p-4"
              >
                <Bi n={icon} className="text-[1.7rem] text-naranja" />
                <div>
                  <strong className="block font-title font-semibold text-white">{t}</strong>
                  <span className="text-[0.85rem] leading-snug">{d}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 border-t border-white/12 pt-6">
            <img
              src={lacmaImg}
              alt={tr("Sello LACMA Certified Packers", "LACMA Certified Packers seal")}
              width={76}
              height={76}
              className="rounded-full bg-white p-1"
            />
            <div>
              <strong className="block font-title font-semibold text-white">
                {tr("Certificaciones internacionales", "International certifications")}
              </strong>
              <span className="text-[0.9rem] tracking-[0.14em] text-beige">
                LACMA · IAM · PAIMA
              </span>
            </div>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="relative mx-auto aspect-[1/0.9] w-full max-w-[560px]">
            <img
              src={imgGlobal}
              alt={tr(
                "Avión y buque portacontenedores en puerto",
                "Airplane and container ship in port",
              )}
              className="absolute left-0 top-0 h-[78%] w-[82%] rounded-[22px] object-cover shadow-[var(--shadow-float)]"
            />
            <img
              src={imgBarco}
              alt={tr("Buque de carga en altamar", "Cargo ship at sea")}
              className="absolute bottom-0 right-0 h-[58%] w-[44%] rounded-[22px] border-[6px] border-violeta object-cover shadow-[var(--shadow-float)]"
            />
            <div className="absolute bottom-[6%] left-[4%] rounded-2xl bg-white px-5 py-4 shadow-[var(--shadow-float)]">
              <strong className="block font-title text-[2rem] leading-none text-azul">
                2.000+
              </strong>
              <span className="text-[0.8rem] font-medium text-texto">
                {tr("agentes en 176 países", "agents in 176 countries")}
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Process() {
  const { tr } = useLang();
  const { PROCESS } = useSite();
  return (
    <section id="proceso" className={section}>
      <div className={container}>
        <SectionHead
          eyebrow={tr("Cómo trabajamos", "How we work")}
          title={tr(
            "Un proceso estructurado, sin improvisación",
            "A structured process, with no improvisation",
          )}
          sub={tr(
            "Cada mudanza sigue una metodología probada durante décadas. Así reducimos imprevistos y sabes en todo momento qué sigue.",
            "Every move follows a methodology proven over decades. That way we reduce surprises and you always know what comes next.",
          )}
        />
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

function AboutTeaser() {
  const { lp, tr } = useLang();
  const { ABOUT_IMAGES } = useSite();
  return (
    <section id="nosotros" className={`${section} bg-gris`}>
      <div className={`${container} grid items-center gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-24`}>
        <Reveal className="relative aspect-[1/1.08] max-w-[560px]">
          <img
            src={ABOUT_IMAGES.a}
            alt={tr(
              "Colaboradores de Transpack cargando cajas en un camión",
              "Transpack crew loading boxes onto a truck",
            )}
            className="absolute left-0 top-0 h-[86%] w-[76%] rounded-[22px] object-cover shadow-[var(--shadow-card)]"
          />
          <img
            src={ABOUT_IMAGES.b}
            alt={tr(
              "Muebles protegidos listos para el traslado",
              "Protected furniture ready to move",
            )}
            className="absolute bottom-0 right-0 h-[56%] w-[50%] rounded-[22px] border-[6px] border-gris object-cover shadow-[var(--shadow-card)]"
          />
          <div className="absolute bottom-[2%] left-[6%] rounded-2xl bg-naranja px-6 py-4 text-white shadow-[var(--shadow-card)]">
            <span className="block text-[0.75rem] font-semibold uppercase tracking-[0.14em]">
              {tr("Desde", "Since")}
            </span>
            <strong className="font-title text-[2.2rem] leading-none">1968</strong>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <Eyebrow>{tr("Quiénes somos", "About us")}</Eyebrow>
          <h2 className="mb-5 text-[clamp(1.9rem,1.2rem+2.4vw,3rem)] leading-[1.12]">
            {tr(
              "Más de cinco décadas cuidando lo que más quieres",
              "More than five decades caring for what you love most",
            )}
          </h2>
          <p className="mb-6">
            {tr(
              "Somos una organización consolidada desde 1968, especializada en trasteos locales, mudanzas nacionales e internacionales y bodegaje, con alta calidad en embalaje y traslados a cualquier parte de Colombia y el mundo. Hemos exportado más de 60 mil toneladas de menaje doméstico y efectos personales a 176 países.",
              "We are an established company founded in 1968, specialized in local, national and international moving and storage, with high-quality packing and moves to anywhere in Colombia and the world. We have exported more than 60,000 tons of household goods and personal effects to 176 countries.",
            )}
          </p>
          <ul className="mb-8 flex flex-wrap gap-2.5">
            {[
              ["people", tr("Confianza", "Trust")],
              ["shield-check", tr("Seguridad", "Security")],
              ["award", tr("Experiencia", "Experience")],
              ["patch-check", tr("Excelencia", "Excellence")],
            ].map(([icon, v]) => (
              <li
                key={v}
                className="inline-flex items-center gap-2 rounded-full bg-azul px-4 py-2 text-[0.88rem] font-semibold text-white"
              >
                <Bi n={icon} className="text-naranja" /> {v}
              </li>
            ))}
          </ul>
          <Link to={lp("/nosotros")} className={`${btn.outline} ${btn.md}`}>
            {tr("Conoce nuestra historia", "Discover our story")}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function Gallery() {
  const spans = [
    "row-span-2",
    "",
    "",
    "lg:row-span-2 lg:col-start-4 lg:row-start-1",
    "lg:col-span-2",
  ];
  const { tr } = useLang();
  const { GALLERY } = useSite();
  return (
    <section
      aria-label={tr("Nuestro trabajo", "Our work")}
      className="grid grid-cols-2 grid-rows-[repeat(3,160px)] gap-2.5 p-2.5 sm:grid-rows-[repeat(3,220px)] lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] lg:grid-rows-[260px_260px]"
    >
      {GALLERY.map((g, i) => (
        <figure
          key={g.caption}
          className={`group relative m-0 overflow-hidden rounded-[10px] ${spans[i]}`}
        >
          <img
            src={g.src}
            alt={g.caption}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-tinta/85 to-transparent px-4 pb-3.5 pt-10 text-[0.88rem] font-semibold text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            {g.caption}
          </figcaption>
        </figure>
      ))}
    </section>
  );
}

function Quote() {
  const { tr } = useLang();
  const [params] = useSearchParams();
  return (
    <section id="cotizar" className={`${section} bg-gradient-to-b from-white to-gris`}>
      <div className={container}>
        <SectionHead
          center
          eyebrow={tr("Cotiza tu mudanza", "Get a moving quote")}
          title={tr(
            "Cuéntanos tu traslado en menos de 2 minutos",
            "Tell us about your move in under 2 minutes",
          )}
          sub={tr(
            "Con esta información un asesor te contactará con una propuesta a tu medida. Sin compromiso.",
            "With this information an advisor will contact you with a tailored proposal. No commitment.",
          )}
        />
        <Reveal>
          <QuoteWizard initialService={params.get("servicio")} initialLevel={params.get("nivel")} />
        </Reveal>
      </div>
    </section>
  );
}

function Blog() {
  const { lp, tr } = useLang();
  const blogPosts = usePosts();
  return (
    <section id="blog" className={`${section} bg-gris`}>
      <div className={container}>
        <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-x-16 gap-y-4 md:mb-16">
          <div>
            <Eyebrow>Blog</Eyebrow>
            <h2 className="text-[clamp(1.9rem,1.2rem+2.4vw,3rem)] leading-[1.12]">
              {tr("Guías para mudarte con tranquilidad", "Guides for a stress-free move")}
            </h2>
          </div>
          <p className="max-w-[420px] text-[1.06rem] text-suave">
            {tr(
              "Lo que debes saber antes de tu próximo traslado, explicado por quienes lo hacen todos los días.",
              "What you should know before your next move, explained by the people who do it every day.",
            )}
          </p>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((p, i) => (
            <Reveal key={p.slug} delay={i * 80}>
              <Link
                to={lp(`/blog/${p.slug}`)}
                className="group flex h-full flex-col overflow-hidden rounded-[22px] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-card)]"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={p.cover}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2.5 px-6 pb-7 pt-6">
                  <span className="text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-naranja">
                    {p.cat}
                  </span>
                  <h3 className="flex-1 text-[1.12rem] leading-snug">{p.title}</h3>
                  <span className="inline-flex items-center gap-1.5 text-[0.93rem] font-semibold text-azul">
                    {tr("Leer artículo", "Read article")}{" "}
                    <Bi
                      n="arrow-right"
                      className="text-naranja transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const { tr } = useLang();
  const { FAQS } = useSite();
  return (
    <section id="faq" className={section}>
      <div className={`${container} grid items-start gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-20`}>
        <SectionHead
          eyebrow={tr("Preguntas frecuentes", "Frequently asked questions")}
          title={tr("Resolvemos tus dudas", "Your questions, answered")}
          sub={tr(
            "¿No encuentras tu pregunta? Escríbenos por WhatsApp y te respondemos.",
            "Can't find your question? Message us on WhatsApp and we'll answer.",
          )}
        />
        <Reveal className="faq">
          {FAQS.map((f) => (
            <details key={f.q} className="group border-b border-linea">
              <summary className="flex cursor-pointer items-center justify-between gap-4 py-5 font-title text-[1.08rem] font-semibold text-tinta hover:text-azul">
                {f.q}
                <span className="faq-icon grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-gris text-azul transition-all duration-300">
                  <Bi n="plus-lg" />
                </span>
              </summary>
              <p className="animate-fade-up pb-6 text-suave lg:pr-12">{f.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function Contact() {
  const { tr } = useLang();
  const { CONTACT } = useSite();
  const items = [
    {
      icon: "geo-alt",
      title: tr("Dirección", "Address"),
      body: <span>{CONTACT.address}</span>,
    },
    {
      icon: "telephone",
      title: tr("Teléfonos y WhatsApp", "Phone and WhatsApp"),
      body: (
        <span className="flex flex-wrap gap-x-2">
          {CONTACT.phones.map((p, i) => (
            <a
              key={p}
              href={`tel:+57${p.replace(/\s/g, "")}`}
              className="whitespace-nowrap hover:text-naranja"
            >
              {p}
              {i < CONTACT.phones.length - 1 && " ·"}
            </a>
          ))}
        </span>
      ),
    },
    {
      icon: "envelope",
      title: tr("Correo", "Email"),
      body: (
        <a href={`mailto:${CONTACT.email}`} className="break-all hover:text-naranja">
          {CONTACT.email}
        </a>
      ),
    },
  ];
  return (
    <section id="contacto" className={section}>
      <div className={`${container} grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16`}>
        <Reveal>
          <Eyebrow>{tr("Contacto", "Contact")}</Eyebrow>
          <h2 className="mb-6 text-[clamp(1.9rem,1.2rem+2.4vw,3rem)] leading-[1.12]">
            {tr("Visítanos o escríbenos", "Visit us or get in touch")}
          </h2>
          <ul className="mb-8 grid gap-6">
            {items.map((it) => (
              <li key={it.title} className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gris text-xl text-azul">
                  <Bi n={it.icon} />
                </span>
                <div>
                  <strong className="block font-title font-semibold text-tinta">{it.title}</strong>
                  {it.body}
                </div>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-2.5">
            {CONTACT.socials.map((s) => (
              <a
                key={s.icon}
                href={s.href}
                target="_blank"
                rel="noopener"
                aria-label={s.label}
                className="grid h-11 w-11 place-items-center rounded-full bg-azul text-white transition-all hover:-translate-y-0.5 hover:bg-naranja"
              >
                <Bi n={s.icon} />
              </a>
            ))}
            <span className="ms-1 text-[0.9rem] font-semibold text-azul">{CONTACT.handle}</span>
          </div>
        </Reveal>
        <Reveal
          delay={100}
          className="min-h-[380px] overflow-hidden rounded-[22px] bg-gris shadow-[var(--shadow-card)]"
        >
          <iframe
            title={tr("Ubicación de Transpack en Bogotá", "Transpack location in Bogotá")}
            src="https://www.google.com/maps?q=Carrera+40+%2320A-96,+Bogot%C3%A1,+Colombia&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block h-full min-h-[380px] w-full border-0"
          />
        </Reveal>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Stats />
      <Services />
      <Segments />
      <Levels />
      <Coverage />
      <Process />
      <AboutTeaser />
      <Gallery />
      <Quote />
      <Blog />
      <Faq />
      <VideoShorts />
      <CtaBand />
      <Contact />
    </>
  );
}
