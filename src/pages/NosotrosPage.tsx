import { Link } from "react-router-dom";
import imgEquipo from "@/assets/images/equipo.jpg";
import imgEmbalaje from "@/assets/images/embalaje-sala.jpg";
import imgGuacales from "@/assets/images/guacales.jpg";
import lacmaImg from "@/assets/images/lacma.jpg";
import { useSite } from "@/hooks/useContent";
import { useLang } from "@/i18n";
import { aboutText, aboutTimeline, aboutValues } from "@/data/about";
import { container, section } from "@/components/ui/layout";
import { CLIENT_LOGOS, logoHeight } from "@/data/clientLogos";
import { Bi, btn, StatValue, Eyebrow, Reveal, SectionHead } from "@/components/ui";
import { CtaBand, PageHero } from "@/components/sections";

// Nosotros (/nosotros): historia, misión y visión, valores, clientes y
// certificaciones. Textos en src/data/about.ts.
export function NosotrosPage() {
  const { lp, tr } = useLang();
  const t = aboutText(tr);
  const { EMBASSIES, SLOGAN, STATS } = useSite();
  const VALUES = aboutValues(tr);
  const TIMELINE = aboutTimeline(tr);
  return (
    <>
      <PageHero image={imgEquipo}>
        <div className="animate-fade-up max-w-3xl">
          <Eyebrow light>{t.quienesSomos}</Eyebrow>
          <h1 className="mb-6 text-[clamp(2.2rem,1.4rem+3vw,3.8rem)] leading-[1.08] !text-white">
            {t.masCincoDecadasMoviendo} <span className="text-naranja">{t.masQuieres}</span>
          </h1>
          <p className="max-w-2xl text-[1.1rem]">{t.somosOrganizacionConsolidadaDesde}</p>
          <p className="mt-8 border-s-[3px] border-naranja ps-4 font-title text-[0.78rem] font-medium uppercase tracking-[0.14em] text-beige">
            {SLOGAN}
          </p>
        </div>
      </PageHero>

      {/* Cifras */}
      <section className="relative z-10 -mt-12">
        <div
          className={`${container} grid grid-cols-2 overflow-hidden rounded-[22px] bg-white shadow-[var(--shadow-float)] lg:grid-cols-4`}
        >
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col gap-1.5 px-6 py-7 ${i % 2 ? "border-s border-linea" : ""} ${
                i >= 2 ? "border-t border-linea lg:border-t-0 lg:border-s" : ""
              }`}
            >
              <span className="font-title text-[clamp(2rem,1.6rem+1.4vw,2.8rem)] font-semibold leading-none text-azul">
                <StatValue value={s.value} suffix={s.suffix} />
              </span>
              <span className="text-[0.88rem] font-medium text-suave">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Historia */}
      <section id="historia" className={section}>
        <div className={`${container} grid items-start gap-14 lg:grid-cols-2 lg:gap-20`}>
          <Reveal>
            <Eyebrow>{t.nuestraHistoria}</Eyebrow>
            <h2 className="mb-6 text-[clamp(1.9rem,1.2rem+2.4vw,3rem)] leading-[1.12]">
              {t.redOperativaGlobalNo}
            </h2>
            <p className="mb-4">{t.nuestraHistoriaEmpezoHace}</p>
            <p>{t.hoyEsaRedNos}</p>
          </Reveal>
          <ol className="relative grid gap-8 border-s-2 border-dashed border-naranja/50 ps-8">
            {TIMELINE.map((t, i) => (
              <Reveal as="li" key={t.year} delay={i * 80} className="relative">
                <span className="absolute -start-[41px] top-1 h-4 w-4 rotate-45 rounded-[3px] bg-azul ring-4 ring-white" />
                <strong className="mb-1 block font-title text-xl font-semibold text-azul">
                  {t.year}
                </strong>
                <p className="text-suave">{t.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Misión y visión */}
      <section id="mision-vision" className={`${section} bg-gris`}>
        <div className={`${container} grid gap-6 md:grid-cols-2`}>
          {[
            {
              icon: "bullseye",
              title: t.mision,
              text: t.queremosMantenerCompromisoNuestros,
            },
            {
              icon: "eye",
              title: t.vision,
              text: t.ano2028TranspackSas,
            },
          ].map((b, i) => (
            <Reveal
              key={b.title}
              delay={i * 100}
              className="rounded-[22px] border-t-[3px] border-naranja bg-white p-8 md:p-10"
            >
              <span className="mb-5 grid h-14 w-14 place-items-center rounded-[14px] bg-azul text-2xl text-naranja">
                <Bi n={b.icon} />
              </span>
              <h3 className="mb-3 text-2xl text-azul">{b.title}</h3>
              <p>{b.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Valores */}
      <section id="valores" className={section}>
        <div className={container}>
          <SectionHead center eyebrow={t.valores} title={t.nosMueve} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <Reveal
                key={v.title}
                delay={i * 80}
                className="group rounded-[22px] border border-linea p-7 transition-all hover:-translate-y-1.5 hover:shadow-[var(--shadow-card)]"
              >
                <span className="mb-5 grid h-14 w-14 place-items-center rounded-[14px] bg-gris text-2xl text-azul transition-colors group-hover:bg-azul group-hover:text-naranja">
                  <Bi n={v.icon} />
                </span>
                <h3 className="mb-2 text-xl">{v.title}</h3>
                <p className="text-[0.93rem] text-suave">{v.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Clientes y embajadas */}
      <section id="clientes" className={`${section} overflow-hidden bg-violeta text-white/78`}>
        <div className={`${container} grid gap-14 lg:grid-cols-2`}>
          <Reveal>
            <Eyebrow light>{t.estandarCorporativo}</Eyebrow>
            <h2 className="mb-6 text-[clamp(1.7rem,1.2rem+1.8vw,2.5rem)] leading-[1.15] !text-white">
              {t.confianzaMarcasMasExigentes}
            </h2>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {CLIENT_LOGOS.map((c) => (
                <div
                  key={c.name}
                  title={c.name}
                  className="grid h-[76px] place-items-center rounded-2xl border border-white/10 bg-white/5 px-4 transition-colors hover:bg-white/10"
                >
                  <img
                    decoding="async"
                    src={c.src}
                    alt={c.name}
                    loading="lazy"
                    style={{
                      height: Math.round(logoHeight(c.ratio) * 0.8),
                      width: Math.round(logoHeight(c.ratio) * 0.8 * c.ratio),
                    }}
                    className="max-w-full object-contain opacity-80 brightness-0 invert"
                  />
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={100}>
            <Eyebrow light>{t.estandarDiplomatico}</Eyebrow>
            <h2 className="mb-6 text-[clamp(1.7rem,1.2rem+1.8vw,2.5rem)] leading-[1.15] !text-white">
              {t.embajadasHanConfiadoNosotros}
            </h2>
            <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {EMBASSIES.map((e) => (
                <span key={e} className="flex items-center gap-2 text-[0.92rem] text-white">
                  <Bi n="flag" className="text-naranja" /> {e}
                </span>
              ))}
            </div>
            <p className="text-[0.95rem]">{t.ademasEntidadesComoCaf}</p>
          </Reveal>
        </div>
      </section>

      {/* Certificaciones y forma de trabajo */}
      <section id="certificaciones" className={section}>
        <div className={`${container} grid items-center gap-14 lg:grid-cols-2 lg:gap-20`}>
          <Reveal className="grid grid-cols-2 gap-3">
            <img
              loading="lazy"
              decoding="async"
              src={imgEmbalaje}
              alt={t.equipoTranspackEmpacandoSala}
              className="aspect-[3/4] h-full w-full rounded-[22px] object-cover"
            />
            <img
              loading="lazy"
              decoding="async"
              src={imgGuacales}
              alt={t.guacalesMaderaExportacion}
              className="mt-10 aspect-[3/4] h-full w-full rounded-[22px] object-cover"
            />
          </Reveal>
          <Reveal delay={100}>
            <Eyebrow>{t.certificaciones}</Eyebrow>
            <h2 className="mb-5 text-[clamp(1.9rem,1.2rem+2.4vw,3rem)] leading-[1.12]">
              {t.procesosRealesCuidadoExperto}
            </h2>
            <p className="mb-6">{t.nuestroTrabajoBasaPrecision}</p>
            <div className="mb-8 flex items-center gap-4 rounded-2xl bg-gris p-4">
              <img
                loading="lazy"
                decoding="async"
                src={lacmaImg}
                alt={t.selloLacmaCertifiedPackers}
                width={68}
                height={68}
                className="rounded-full bg-white p-1"
              />
              <div>
                <strong className="block font-title font-semibold text-tinta">
                  {t.certificationsList}
                </strong>
                <span className="text-[0.88rem] text-suave">
                  {t.asociacionesInternacionalesEmpresasMudanzas}
                </span>
              </div>
            </div>
            <Link to={lp("/#cotizar")} className={`${btn.primary} ${btn.md}`}>
              {t.cotizaMudanza}
            </Link>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
