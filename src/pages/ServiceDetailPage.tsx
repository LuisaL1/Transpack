import { useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useSite } from "@/hooks/useContent";
import { useMotion } from "@/hooks/useMotion";
import { slugEs, useLang } from "@/i18n";
import { serviceDetailText } from "@/data/pages";
import type { Service } from "@/data/site";
import { Bi, btn, Checks, Eyebrow, PhotoFrame, Reveal } from "@/components/ui";
import { container } from "@/components/ui/layout";
import { CtaBand, PageHero, StepsTimeline } from "@/components/sections";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ColombiaRoutesMap } from "@/components/services/ColombiaRoutesMap";
import { ServiceGuide } from "@/components/services/ServiceGuide";

// Las páginas de servicio usan un espaciado vertical un poco menor que el inicio
const section = "relative py-[clamp(64px,8vw,112px)]";

// Detalle de servicio (/servicios/:slug). El servicio sale de SERVICES en
// src/data/site.ts; los textos de la página están en src/data/pages.ts.
//
// Movimiento (nov. 2026, como el inicio):
// · Encabezado: entrada escalonada y foto con parallax (PageHero).
// · "Cómo lo hacemos": en escritorio el texto queda fijo mientras pasa la
//   lista; cada ítem entra y su ✓ se dibuja; las cajas de compromiso y nota
//   entran con su franja naranja.
// · Pasos: StepsTimeline. En escritorio la sección queda fija hasta que la
//   línea llega al último paso; luego la página sigue.
// · Carrusel de Embalaje: se acelera con la velocidad del scroll, se detiene
//   con el cursor y sus fotos se inclinan hacia el puntero.
// · Otros servicios: tarjetas con foto; en escritorio la fila se desplaza de
//   lado mientras se baja (sección fija), en celular se deslizan con el dedo.
export function ServiceDetailPage() {
  const { slug } = useParams();
  const { lang } = useLang();
  const { SERVICES } = useSite();
  // En inglés la URL trae el slug traducido; internamente se usa el de español
  const service = SERVICES.find((s) => s.slug === slugEs(slug ?? "", lang));
  if (!service) return <NotFoundPage />;
  // Con `key`, al pasar de un servicio a otro se arma de nuevo (y su movimiento)
  return <ServiceDetail key={service.slug} service={service} />;
}

function ServiceDetail({ service }: { service: Service }) {
  const { lp, tr } = useLang();
  const t = serviceDetailText(tr);
  const { FAQS, SERVICES, waLink } = useSite();
  const introRef = useRef<HTMLElement>(null);
  const reelRef = useRef<HTMLElement>(null);
  const othersRef = useRef<HTMLElement>(null);

  // "Cómo lo hacemos": ítems escalonados con su ✓ dibujándose y franjas naranja
  useMotion(introRef, (m, el) => {
    const items = el.querySelectorAll("[data-includes] li");
    if (items.length) {
      m.reveal(items, items[0], { x: -18, y: 0, stagger: 0.08, duration: 0.7 });
      m.gsap.from(el.querySelectorAll("[data-check]"), {
        strokeDashoffset: 1,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.08,
        delay: 0.25,
        scrollTrigger: { trigger: items[0], start: m.ENTER, once: true },
      });
    }
    for (const bar of el.querySelectorAll("[data-sweep]"))
      m.gsap.from(bar, {
        scaleY: 0,
        duration: 0.8,
        ease: "expo.out",
        scrollTrigger: { trigger: bar, start: m.ENTER, once: true },
      });
  });

  // Carrusel de fotos (Embalaje especializado)
  useMotion(reelRef, (m, el) => {
    const loop = m.velocityMarquee(el.querySelector("[data-reel-row]")!, el, 45);
    const strip = el.querySelector("[data-reel]")!;
    const pause = () => void loop.pause();
    const play = () => void loop.resume();
    strip.addEventListener("pointerenter", pause);
    strip.addEventListener("pointerleave", play);
    const offs = [...el.querySelectorAll<HTMLElement>("[data-reel-card]")].map((c) => m.tilt(c, 5));
    return () => {
      strip.removeEventListener("pointerenter", pause);
      strip.removeEventListener("pointerleave", play);
      offs.forEach((off) => off());
    };
  });

  // Otros servicios: fila fija que se desplaza de lado (escritorio) y tarjetas
  // que se inclinan hacia el puntero
  useMotion(othersRef, (m, el) => {
    // Se fija el div interno, no la sección: ScrollTrigger lo envuelve en un
    // "pin-spacer" y, si fuera la sección, React no la encontraría al salir de
    // la página (error removeChild y pantalla en blanco)
    const pinned = el.querySelector<HTMLElement>("[data-others-pin]")!;
    const scroller = el.querySelector<HTMLElement>("[data-others-scroller]")!;
    const track = el.querySelector<HTMLElement>("[data-others-track]")!;
    m.gsap.matchMedia().add("(min-width: 1024px)", () => {
      m.gsap.set(scroller, { overflowX: "visible" });
      const distance = () => Math.max(0, track.scrollWidth - scroller.clientWidth);
      m.gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: pinned,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
    });
    m.reveal(track.children, el, { y: 50, stagger: 0.07 });
    const offs = [...el.querySelectorAll<HTMLElement>("[data-other-card]")].map((c) =>
      m.tilt(c, 4),
    );
    return () => offs.forEach((off) => off());
  });

  const others = SERVICES.filter((s) => s.slug !== service.slug);
  const quoteLink = lp(`/?servicio=${service.quote}#cotizar`);
  const generic = service.cta === "Cotizar" || service.cta === t.cotizar;

  return (
    <>
      <PageHero
        image={service.image}
        media={service.heroMap ? <ColombiaRoutesMap /> : undefined}
        reveal={service.imageReveal}
        blend={service.imageBlend}
        shipping={service.imageShipping}
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
        <div className="hero-stagger max-w-3xl">
          <nav
            aria-label={t.ruta}
            className="mb-4 flex items-center gap-2 text-[0.85rem] text-suave"
          >
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
          <span className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-azul text-[1.6rem] text-naranja shadow-[0_12px_26px_-12px_rgba(39,43,124,.8)]">
            <Bi n={service.icon} />
          </span>
          {service.kicker && <Eyebrow>{service.kicker}</Eyebrow>}
          <h1 className="mb-6 text-[clamp(1.7rem,1.15rem+2vw,2.75rem)] leading-[1.12] text-tinta">
            <span className="line-mask [--d:220ms]">
              <span>{service.headline}</span>
            </span>
          </h1>
          <p className="mb-8 max-w-2xl text-start text-[1.08rem] text-texto">{service.short}</p>
          <div className="flex flex-wrap gap-3">
            <Link
              to={quoteLink}
              data-magnetic
              className={`${btn.primary} ${btn.lg} w-full sm:w-auto`}
            >
              {generic ? t.quoteService(service.title) : service.cta}
              <Bi n="arrow-right" />
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
      <section ref={introRef} className={section}>
        <div className={`${container} grid items-start gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20`}>
          <Reveal className="lg:sticky lg:top-32">
            <Eyebrow>{t.servicio}</Eyebrow>
            <h2 className="mb-5 text-[clamp(1.8rem,1.2rem+2vw,2.6rem)] leading-[1.15]">
              {t.comoHacemos}
            </h2>
            <p className="mb-8 text-[1.05rem]">{service.intro}</p>
            {service.commitment && (
              <p className="relative mb-4 flex items-start gap-3 overflow-hidden rounded-2xl bg-gris px-5 py-4 text-violeta">
                <span
                  aria-hidden="true"
                  data-sweep
                  className="pointer-events-none absolute inset-y-0 start-0 w-1 origin-top bg-naranja"
                />
                <Bi n="heart" className="mt-0.5 text-lg text-naranja" />
                <span>
                  <strong>{t.compromiso}</strong> {service.commitment}
                </span>
              </p>
            )}
            {service.note && (
              <p className="relative flex items-start gap-3 overflow-hidden rounded-2xl bg-beige px-5 py-4 text-start font-medium text-violeta">
                <span
                  aria-hidden="true"
                  data-sweep
                  className="pointer-events-none absolute inset-y-0 start-0 w-1 origin-top bg-naranja"
                />
                <Bi n="clock" className="mt-0.5 text-lg text-naranja" /> {service.note}
              </p>
            )}
          </Reveal>
          {service.includes ? (
            <div data-includes className="rounded-[22px] bg-gris p-8 md:p-10">
              <h3 className="mb-6 text-xl">{t.incluye}</h3>
              <Checks items={service.includes} />
            </div>
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
        <section ref={reelRef} className={`${section} overflow-hidden bg-azul text-white/75`}>
          <Reveal className={`${container} mb-12`}>
            <Eyebrow light>{t.nuestroTrabajo}</Eyebrow>
            <h2 className="text-[clamp(1.8rem,1.2rem+2vw,2.6rem)] leading-[1.15] !text-white">
              {t.asiProtegemos}
            </h2>
          </Reveal>
          {/* Con movimiento reducido no corre: se desliza a mano */}
          <div data-reel className="overflow-hidden motion-reduce:overflow-x-auto" dir="ltr">
            <div data-reel-row className="flex w-max">
              {[0, 1].map((k) => (
                <ul key={k} className="flex shrink-0 gap-5 pr-5" aria-hidden={k === 1}>
                  {service.reel?.map((p) => (
                    <li key={p.caption} data-reel-card className="w-[min(78vw,340px)] shrink-0">
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
          </div>
        </section>
      )}
      {service.steps && (
        <section className="relative bg-azul text-white/75">
          {/* En escritorio queda fija hasta completar los pasos (StepsTimeline pin) */}
          <div
            data-steps-pin
            className="py-[clamp(64px,8vw,112px)] lg:flex lg:min-h-screen lg:flex-col lg:justify-center"
          >
            <div className={container}>
              <Reveal className="mb-12">
                <Eyebrow light>{t.pasoPaso}</Eyebrow>
                <h2 className="text-[clamp(1.8rem,1.2rem+2vw,2.6rem)] leading-[1.15] !text-white">
                  {t.asiSeraProceso}
                </h2>
              </Reveal>
              <StepsTimeline items={service.steps} tone="dark" pin />
            </div>
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
                <p className="animate-fade-up pb-6 text-suave">{f.a}</p>
              </details>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Otros servicios */}
      <section ref={othersRef} className="relative overflow-hidden bg-gris">
        <div
          data-others-pin
          className="py-[clamp(64px,8vw,112px)] lg:flex lg:min-h-screen lg:flex-col lg:justify-center"
        >
          <Reveal className={`${container} mb-10`}>
            <Eyebrow>{t.otrosServicios}</Eyebrow>
            <h2 className="text-[clamp(1.6rem,1.2rem+1.4vw,2.2rem)]">{t.complementaTraslado}</h2>
          </Reveal>
          {/* En celular se desliza con el dedo; en escritorio la mueve el scroll */}
          <div
            data-others-scroller
            data-lenis-prevent-wheel
            className="snap-x snap-mandatory overflow-x-auto pb-4 [scrollbar-width:none]"
          >
            <ul
              data-others-track
              className="flex w-max gap-4 px-[max(16px,calc((100vw-1200px)/2))] lg:gap-5"
            >
              {others.map((o) => (
                <li key={o.slug} className="w-[min(76vw,300px)] shrink-0 snap-start lg:w-[340px]">
                  <Link
                    to={lp(`/servicios/${o.slug}`)}
                    data-other-card
                    className="spotlight group relative flex h-full flex-col rounded-[26px] bg-white p-2 transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]"
                  >
                    <PhotoFrame tab corner="tr" className="aspect-[4/3]">
                      <img
                        src={o.image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    </PhotoFrame>
                    <span className="flex flex-1 items-start gap-3 px-3 pb-3 pt-4">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-azul text-[1.1rem] text-naranja transition-colors group-hover:bg-naranja group-hover:text-white">
                        <Bi n={o.icon} />
                      </span>
                      <span className="flex-1">
                        <span className="block font-title font-semibold leading-snug text-tinta">
                          {o.title}
                        </span>
                        <span className="mt-1 inline-flex items-center gap-1.5 text-[0.86rem] font-semibold text-azul">
                          {t.verServicio}
                          <Bi
                            n="arrow-right"
                            className="text-naranja transition-transform group-hover:translate-x-1"
                          />
                        </span>
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
