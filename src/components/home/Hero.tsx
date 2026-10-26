import { Link } from "react-router-dom";
import { useLang } from "@/i18n";
import { heroText, mapText } from "@/data/home";
import { useSite } from "@/hooks/useContent";
import { CLIENT_LOGOS, logoHeight } from "@/data/clientLogos";
import { Bi, StatValue } from "@/components/ui";
import { WorldMap } from "@/components/home/WorldMap";
import { HeroQuickStart } from "@/components/home/HeroQuickStart";
import { container } from "@/components/ui/layout";

// Fondo blanco (pedido del cliente, oct. 2026) con detalles de marca para que
// no quede plano: retícula azul muy tenue, semitono de puntos, luz naranja
// detrás del titular y una franja beige al pie. Bajo el titular, el mapamundi
// de rutas reales (izquierda) y el selector "¿Qué necesitas hoy?" (derecha,
// HeroQuickStart) sobre un tablero con sombra para que se despegue del fondo;
// los clientes al pie.
export function Hero() {
  const { lp, tr } = useLang();
  const t = heroText(tr);
  const m = mapText(tr);
  const { STATS } = useSite();
  // Cifras reales del sitio (STATS): países de destino y representantes
  const chips = [STATS[1], STATS[3]];
  return (
    <section className="relative overflow-hidden bg-white pt-[150px] text-texto md:pt-[176px]">
      {/* Retícula sutil */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(39,43,124,.05)_1px,transparent_1px),linear-gradient(rgba(39,43,124,.05)_1px,transparent_1px)] bg-[size:120px_120px] [mask-image:linear-gradient(180deg,#000_0%,#000_40%,transparent_75%)]"
      />
      {/* Semitono de puntos, esquina superior derecha */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-24 h-[640px] w-[640px] bg-[radial-gradient(rgba(39,43,124,.16)_1.2px,transparent_1.6px)] bg-[size:9px_9px] [mask-image:radial-gradient(circle,#000_0%,transparent_65%)]"
      />
      {/* Cuadrado naranja girado de la marca, esquina superior izquierda */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-28 hidden h-56 w-56 rotate-45 rounded-[22%] bg-naranja/10 md:block"
      />
      {/* Luz naranja tenue detrás del titular */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-24 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-naranja/15 blur-[110px]"
      />
      {/* Franja beige al pie, detrás del tablero y de los clientes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-[linear-gradient(180deg,rgba(250,238,217,0)_0%,rgba(250,238,217,.7)_45%,#ffffff_100%)]"
      />

      <div className={`${container} animate-fade-up relative text-center`}>
        <Link
          to={lp("/#cobertura")}
          className="group mb-6 inline-flex items-center gap-2 rounded-full border border-linea bg-white px-3.5 py-1.5 text-[0.76rem] font-medium text-texto shadow-[0_6px_18px_-12px_rgba(39,43,124,.45)] transition-colors hover:border-azul/30 hover:text-azul"
        >
          <span className="h-2 w-2 rounded-full bg-naranja shadow-[0_0_0_4px_rgba(255,118,25,.25)]" />
          <span>
            {t.since} · <span className="hidden sm:inline">{t.certifications}</span>
            <span className="sm:hidden">{t.certificationsShort}</span>
          </span>
          <Bi
            n="chevron-right"
            className="text-[0.7rem] transition-transform group-hover:translate-x-0.5"
          />
        </Link>
        <h1 className="mx-auto mb-5 max-w-[900px] text-[clamp(2rem,1.3rem+2.2vw,3.3rem)] leading-[1.12] text-azul">
          {t.title}
          <br />
          {t.titlePrefix}
          <span className="text-naranja-600">{t.titleHighlight}</span>
        </h1>
        <p className="mx-auto max-w-[560px] text-[clamp(.98rem,.94rem+.2vw,1.08rem)] font-medium text-texto">
          {t.sub}
        </p>
      </div>

      {/* Mapamundi con rutas reales desde Bogotá (izquierda; en móvil se recorta
          lo justo para que se vean de las Américas a Japón) y el selector de
          servicios (derecha; en móvil va primero) */}
      <div
        className={`${container} relative mt-10 grid items-center gap-8 overflow-hidden rounded-[28px] bg-white p-5 shadow-[0_2px_8px_rgba(13,15,51,.08),0_24px_50px_-18px_rgba(39,43,124,.35),0_60px_120px_-40px_rgba(13,15,51,.45)] ring-1 ring-azul/10 md:mt-12 md:p-8 lg:grid-cols-[1.3fr_0.7fr] lg:gap-8`}
      >
        <div className="order-2 min-w-0 lg:order-1">
          {/* Panel del mapa: fondo gris claro de marca */}
          <div className="relative overflow-hidden rounded-[22px] bg-gris p-4 ring-1 ring-linea md:p-5">
            <div className="relative mb-2 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="flex items-center gap-2 font-title text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-naranja">
                  <Bi n="globe-americas" /> {m.eyebrow}
                </p>
                <p className="font-title text-[1.15rem] font-semibold leading-tight text-tinta">
                  {m.title}
                </p>
              </div>
              <div className="flex gap-2">
                {chips.map((c) => (
                  <span
                    key={c.label}
                    className="rounded-xl bg-white px-3 py-1.5 text-center shadow-[0_6px_16px_-10px_rgba(39,43,124,.5)] ring-1 ring-linea"
                  >
                    <span className="block font-title text-[1.05rem] font-bold leading-none text-azul">
                      <StatValue value={c.value} suffix={c.suffix} />
                    </span>
                    <span className="text-[0.68rem] font-medium text-suave">
                      {c.short ?? c.label}
                    </span>
                  </span>
                ))}
              </div>
            </div>
            <div
              dir="ltr"
              className="relative mx-auto w-[125%] max-w-[1180px] -translate-x-[10%] md:w-full md:translate-x-0"
            >
              <WorldMap />
            </div>
          </div>
          <div className="relative flex flex-wrap justify-center gap-x-5 gap-y-2 px-2 pt-4 text-[0.8rem] font-medium text-texto lg:justify-start">
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-naranja shadow-[0_0_0_3px_rgba(255,118,25,.25)]" />{" "}
              {t.legend.origin}
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-3.5 rounded-[3px] bg-suave/60" /> {t.legend.operate}
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-tinta ring-2 ring-white" />{" "}
              {t.legend.network}
            </span>
          </div>
        </div>
        <div className="order-1 animate-fade-up lg:order-2">
          <HeroQuickStart />
        </div>
      </div>

      {/* Clientes */}
      <div className="relative pb-14 pt-10" aria-label={t.clientsLabel}>
        <p className="mb-7 px-4 text-center text-[0.95rem] font-medium text-texto">
          {t.clientsTitle}
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
                  decoding="async"
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
