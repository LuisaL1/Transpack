import { useRef } from "react";
import { Link } from "react-router-dom";
import imgEquipo from "@/assets/images/equipo.jpg";
import imgEmbalaje from "@/assets/images/embalaje-sala.jpg";
import imgGuacales from "@/assets/images/guacales.jpeg";
import lacmaImg from "@/assets/images/lacma.jpg";
import { useSite } from "@/hooks/useContent";
import { useMotion } from "@/hooks/useMotion";
import { useLang } from "@/i18n";
import { aboutText, aboutTimeline, aboutValues, ceoInfo } from "@/data/about";
import { container, section } from "@/components/ui/layout";
import { CLIENT_LOGOS, embassyFlag, logoHeight } from "@/data/clientLogos";
import { Bi, btn, Eyebrow, PhotoFrame, Reveal, SectionHead, SweepIn } from "@/components/ui";
import { CtaBand, PageHero, WorldLines } from "@/components/sections";
import { Stats } from "@/components/home/Stats";

// Nosotros (/nosotros): historia, misión y visión, valores, clientes y
// certificaciones. Textos en src/data/about.ts.
//
// Movimiento (nov. 2026, como el inicio y los servicios):
// · Cifras: la barra del inicio (Stats: odómetro y realce al pasar el cursor).
// · Historia: la línea de tiempo se dibuja con el scroll y cada hito se
//   enciende (rombo azul → naranja) cuando la línea llega; detrás, el año de
//   fundación gigante en contorno, con parallax.
// · Misión, visión y valores: entran (los valores en abanico) y se inclinan
//   hacia el puntero con un resplandor.
// · Clientes y embajadas: logos y banderas escalonados; cada logo toma sus
//   colores al pasar el cursor.
// · Certificaciones: las fotos llegan con el barrido de color (SweepIn) y el
//   sello LACMA se "estampa".
export function NosotrosPage() {
  const { lp, tr } = useLang();
  const t = aboutText(tr);
  const { EMBASSIES, SLOGAN } = useSite();
  const VALUES = aboutValues(tr);
  const TIMELINE = aboutTimeline(tr);
  const CEO = ceoInfo(tr);
  const historyRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const clientsRef = useRef<HTMLElement>(null);
  const certRef = useRef<HTMLElement>(null);

  // Historia: línea que se dibuja, hitos que se encienden y año con parallax
  useMotion(historyRef, (m, el) => {
    const box = el.querySelector<HTMLElement>("[data-timeline]")!;
    const dots = [...box.querySelectorAll<HTMLElement>("[data-tl-dot]")];
    const tl = m.gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: box, start: "top 70%", end: "bottom 55%", scrub: 0.6 },
    });
    tl.fromTo("[data-tl-line]", { scaleY: 0 }, { scaleY: 1, duration: 1 }, 0);
    for (const dot of dots) {
      const at = Math.min(0.95, dot.closest("li")!.offsetTop / box.offsetHeight);
      tl.fromTo(
        dot,
        // rotation: GSAP reemplaza el rotate-45 de Tailwind; sin él, quedaría cuadrado
        { backgroundColor: "#272b7c", scale: 0.6, rotation: 45 },
        { backgroundColor: "#ff7619", scale: 1, rotation: 45, duration: 0.06 },
        at,
      );
    }
    m.parallax("[data-tl-year]", el, { yPercent: 25 }, { yPercent: -25 });
  });

  // Misión, visión y valores: entrada y tarjetas que siguen al puntero
  useMotion(cardsRef, (m, el) => {
    const mv = [...el.querySelectorAll<HTMLElement>("[data-mv-card]")];
    m.reveal(mv, mv[0], { y: 50, stagger: 0.12 });
    m.gsap.from(el.querySelectorAll("[data-mv-icon]"), {
      rotation: -90,
      scale: 0.4,
      duration: 0.9,
      ease: "back.out(2)",
      stagger: 0.12,
      delay: 0.2,
      scrollTrigger: { trigger: mv[0], start: m.ENTER, once: true },
    });
    const values = [...el.querySelectorAll<HTMLElement>("[data-value-card]")];
    m.gsap.from(values, {
      y: 90,
      rotation: (i: number) => (i - (values.length - 1) / 2) * 6,
      opacity: 0,
      duration: 1.1,
      ease: "expo.out",
      stagger: 0.1,
      scrollTrigger: { trigger: values[0], start: m.ENTER, once: true },
    });
    const offs = [...mv, ...values].map((c) => m.tilt(c, 4));
    return () => offs.forEach((off) => off());
  });

  // Clientes y embajadas: logos y banderas escalonados
  useMotion(clientsRef, (m, el) => {
    const logos = el.querySelectorAll("[data-logo]");
    m.reveal(logos, logos[0], { y: 24, stagger: 0.05, duration: 0.7 });
    const flags = el.querySelectorAll("[data-flag]");
    m.reveal(flags, flags[0], { x: -14, y: 0, stagger: 0.06, duration: 0.6 });
  });

  // Certificaciones: el sello se estampa
  useMotion(certRef, (m, el) => {
    const seal = el.querySelector("[data-seal]");
    m.gsap.from(seal, {
      scale: 1.9,
      rotation: -28,
      opacity: 0,
      duration: 0.75,
      ease: "back.out(2.2)",
      scrollTrigger: { trigger: seal, start: "top 80%", once: true },
    });
  });

  return (
    <>
      <PageHero image={imgEquipo} reveal="right">
        <div className="hero-stagger max-w-3xl">
          <Eyebrow>{t.quienesSomos}</Eyebrow>
          <h1 className="mb-6 text-[clamp(1.9rem,1.2rem+2.4vw,3rem)] leading-[1.1] text-tinta">
            <span className="line-mask [--d:120ms]">
              <span>
                {t.masCincoDecadasMoviendo} <span className="text-naranja">{t.masQuieres}</span>
              </span>
            </span>
          </h1>
          <p className="max-w-2xl text-start text-[1.1rem]">
            {t.somosOrganizacionConsolidadaDesde}
          </p>
          <p className="mt-8 border-s-[3px] border-naranja ps-4 text-start font-title text-[0.78rem] font-medium uppercase tracking-[0.14em] text-azul">
            {SLOGAN}
          </p>
        </div>
      </PageHero>

      {/* Cifras: la misma barra del inicio, montada sobre el borde del encabezado */}
      <Stats className="relative z-10 -mt-12 pb-4" />

      {/* Nuestro CEO (solo cuando el cliente entregue los datos: src/data/about.ts) */}
      {CEO.name && (
        <section id="ceo" className={section}>
          <div
            className={`${container} grid items-start gap-12 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-20`}
          >
            {/* La foto acompaña la lectura de la biografía (larga) en escritorio */}
            <Reveal className="lg:sticky lg:top-32">
              <PhotoFrame tab className="aspect-square w-full max-w-[420px]">
                <img
                  loading="lazy"
                  decoding="async"
                  src={CEO.photo}
                  alt={CEO.name}
                  className="h-full w-full object-cover"
                />
              </PhotoFrame>
            </Reveal>
            <Reveal delay={100}>
              <Eyebrow>{CEO.eyebrow}</Eyebrow>
              <h2 className="mb-1 text-[clamp(1.9rem,1.2rem+2.4vw,3rem)] leading-[1.12]">
                {CEO.name}
              </h2>
              <p className="mb-6 text-start font-title text-[0.95rem] font-semibold uppercase tracking-[0.12em] text-naranja">
                {CEO.role} · {CEO.tagline}
              </p>
              <p className="mb-8 whitespace-pre-line text-[1.05rem]">{CEO.bio}</p>
              {CEO.website && (
                <a
                  href={CEO.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${btn.secondary} ${btn.md}`}
                >
                  <Bi n="box-arrow-up-right" /> {CEO.visit}
                </a>
              )}
            </Reveal>
          </div>
        </section>
      )}

      {/* Historia, sobre un mapamundi de líneas con pulsos de luz (WorldLines) */}
      <section id="historia" ref={historyRef} className={`${section} overflow-hidden`}>
        <WorldLines className="left-1/2 top-1/2 w-[max(1400px,130%)] -translate-x-1/2 -translate-y-1/2 lg:w-[min(1500px,110%)]" />
        {/* Velo blanco entre el mapa y el texto (nov. 2026): más fuerte donde
            están las letras y más suave hacia los bordes, para que el mapa se
            vea sin competir con la lectura */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_62%_70%_at_50%_50%,rgba(255,255,255,.62)_0%,rgba(255,255,255,.5)_55%,rgba(255,255,255,.1)_100%)]"
        />
        {/* Año de fundación gigante, en contorno, abajo a la derecha (bajo la
            línea de tiempo) */}
        <span
          aria-hidden="true"
          data-tl-year
          className="pointer-events-none absolute bottom-[2%] end-[max(16px,calc((100vw-1200px)/2))] hidden select-none font-title text-[clamp(9rem,15vw,14rem)] font-bold leading-none text-transparent [-webkit-text-stroke:2px_rgba(39,43,124,.1)] lg:block"
        >
          {TIMELINE[0].year}
        </span>
        <div className={`${container} relative grid items-start gap-14 lg:grid-cols-2 lg:gap-20`}>
          <Reveal>
            <Eyebrow>{t.nuestraHistoria}</Eyebrow>
            <h2 className="mb-6 text-[clamp(1.9rem,1.2rem+2.4vw,3rem)] leading-[1.12]">
              {t.redOperativaGlobalNo}
            </h2>
            <p className="mb-4">{t.nuestraHistoriaEmpezoHace}</p>
            <p className="mb-4">{t.hoyEsaRedNos}</p>
            <p>{t.hoyAcompanamos}</p>
          </Reveal>
          <div data-timeline className="relative">
            {/* Línea que se dibuja con el scroll sobre la guía punteada */}
            <span
              aria-hidden="true"
              data-tl-line
              className="pointer-events-none absolute start-0 top-0 h-full w-0.5 origin-top bg-[repeating-linear-gradient(180deg,#ff7619_0_6px,transparent_6px_12px)]"
            />
            <ol className="relative grid gap-8 border-s-2 border-dashed border-naranja/20 ps-8">
              {TIMELINE.map((t, i) => (
                <Reveal as="li" key={t.year} delay={i * 80} className="relative">
                  <span
                    aria-hidden="true"
                    data-tl-dot
                    className="absolute -start-[41px] top-1 h-4 w-4 rotate-45 rounded-[3px] bg-azul ring-4 ring-white"
                  />
                  <strong className="mb-1 block font-title text-xl font-semibold text-azul">
                    {t.year}
                  </strong>
                  <p className="text-start text-suave">{t.text}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <div ref={cardsRef}>
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
            ].map((b) => (
              <article
                key={b.title}
                data-mv-card
                className="spotlight relative rounded-[22px] border-t-[3px] border-naranja bg-white p-8 md:p-10"
              >
                <span
                  data-mv-icon
                  className="mb-5 grid h-14 w-14 place-items-center rounded-[14px] bg-azul text-2xl text-naranja"
                >
                  <Bi n={b.icon} />
                </span>
                <h3 className="mb-3 text-2xl text-azul">{b.title}</h3>
                <p>{b.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Valores */}
        <section id="valores" className={section}>
          <div className={container}>
            <SectionHead center eyebrow={t.valores} title={t.nosMueve} />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {VALUES.map((v) => (
                <article
                  key={v.title}
                  data-value-card
                  className="spotlight group relative rounded-[22px] border border-linea bg-white p-7 transition-[translate,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-card)]"
                >
                  <span className="mb-5 grid h-14 w-14 place-items-center rounded-[14px] bg-gris text-2xl text-azul transition-colors group-hover:bg-azul group-hover:text-naranja">
                    <Bi n={v.icon} />
                  </span>
                  <h3 className="mb-2 text-xl">{v.title}</h3>
                  <p className="text-start text-[0.93rem] text-suave">{v.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Clientes y embajadas */}
      <section
        id="clientes"
        ref={clientsRef}
        className={`${section} overflow-hidden bg-violeta text-white/78`}
      >
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
                  data-logo
                  className="group grid h-[76px] place-items-center rounded-2xl border border-white/10 bg-white/5 px-4 transition-colors duration-300 hover:bg-white"
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
                    className="max-w-full object-contain opacity-80 brightness-0 invert transition-[filter,opacity] duration-300 group-hover:opacity-100 group-hover:brightness-100 group-hover:invert-0"
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
              {EMBASSIES.map((e, i) => (
                <span
                  key={e}
                  data-flag
                  className="flex items-center gap-2.5 text-[0.92rem] text-white"
                >
                  <img
                    src={embassyFlag(i)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-[15px] w-5 shrink-0 rounded-[2px] object-cover ring-1 ring-white/20"
                  />
                  {e}
                </span>
              ))}
            </div>
            <p className="text-[0.95rem]">{t.ademasEntidadesComoCaf}</p>
          </Reveal>
        </div>
      </section>

      {/* Certificaciones y forma de trabajo */}
      <section id="certificaciones" ref={certRef} className={section}>
        <div className={`${container} grid items-center gap-14 lg:grid-cols-2 lg:gap-20`}>
          {/* Las dos fotos llegan con el barrido de color: una desde la
              izquierda y la otra desde arriba, un poco después */}
          <div className="grid grid-cols-2 gap-3">
            <SweepIn from="left">
              <PhotoFrame tab className="aspect-[3/4]">
                <img
                  loading="lazy"
                  decoding="async"
                  src={imgEmbalaje}
                  alt={t.equipoTranspackEmpacandoSala}
                  className="hero-img-in h-full w-full object-cover [--hero-ps:1]"
                />
              </PhotoFrame>
            </SweepIn>
            <SweepIn from="top" delay={350} className="mt-10">
              <PhotoFrame tab corner="tr" className="aspect-[3/4]">
                <img
                  loading="lazy"
                  decoding="async"
                  src={imgGuacales}
                  alt={t.guacalesMaderaExportacion}
                  className="hero-img-in h-full w-full object-cover [--hero-ps:1]"
                />
              </PhotoFrame>
            </SweepIn>
          </div>
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
                data-seal
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
