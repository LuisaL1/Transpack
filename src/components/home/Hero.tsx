import { Link } from "react-router-dom";
import { useLang } from "@/i18n";
import { heroText } from "@/data/home";
import { CLIENT_LOGOS, embassyLogo, logoHeight } from "@/data/clientLogos";
import { useRef } from "react";
import { useDestinationName, useSite } from "@/hooks/useContent";
import { useMotion } from "@/hooks/useMotion";
import { DESTINATIONS } from "@/data/worldMap";
import { Bi, btn } from "@/components/ui";
import { container } from "@/components/ui/layout";
import headerImg from "@/assets/images/img-header.jpg";

// Portada (nov. 2026): la foto img-header.jpg (embalador con una vajilla) a pantalla completa, de borde a
// borde y también detrás de la cabecera (que flota sobre ella, ver Header), con
// un degradado oscuro desde la izquierda y desde arriba para que el titular y el
// menú se lean. Reemplazó al mapa animado (Globe). Al pie, los clientes y las
// embajadas atendidas, todos a la vista en cuadrículas fijas: en gris; al pasar
// el cursor, cada logo recupera sus colores y su ficha se levanta con sombra y
// la franja naranja de la marca.
// Resalta en negrita las cifras indicadas dentro de un texto
function highlight(text: string, marks: string[]) {
  const parts: React.ReactNode[] = [];
  let rest = text;
  for (const mark of marks) {
    const at = rest.indexOf(mark);
    if (at < 0) continue;
    parts.push(
      rest.slice(0, at),
      <strong key={mark} className="font-bold text-white">
        {mark}
      </strong>,
    );
    rest = rest.slice(at + mark.length);
  }
  return [...parts, rest];
}

export function Hero() {
  const { lp, tr } = useLang();
  const t = heroText(tr);
  const { EMBASSIES } = useSite();
  const placeName = useDestinationName();
  // Logos de clientes y embajadas: entran escalonados al llegar
  const clientsRef = useRef<HTMLDivElement>(null);
  useMotion(clientsRef, (m, el) => {
    for (const list of el.querySelectorAll("ul"))
      m.reveal(list.children, list, { y: 24, stagger: 0.05, duration: 0.7 });
  });
  return (
    <section className="relative text-texto">
      {/* Foto a pantalla completa, también detrás de la cabecera fija */}
      <div className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-[#0D0F33] pb-16 pt-[150px] md:pt-[180px] lg:pb-20">
        {/* Foto a sangre detrás de la cabecera transparente (estilo pedido por el
            cliente). La foto nítida baja hasta quedar bajo la cabecera, para que
            el menú no tape al embalador, y la misma foto desenfocada llena el
            espacio de atrás, así se ve continua. Foto de la vajilla (nov. 2026):
            el embalador está en el centro de la foto; en escritorio la foto
            nítida empieza al 28 % del ancho para que él quede a la derecha,
            completo y fuera del texto, y su borde izquierdo se funde con la
            desenfocada (.hero-photo-mask) */}
        <img
          src={headerImg}
          alt=""
          aria-hidden="true"
          width={1200}
          height={805}
          decoding="async"
          className="absolute inset-0 -z-30 h-full w-full scale-110 object-cover object-[50%_30%] blur-2xl"
        />
        <div className="absolute inset-x-0 bottom-0 top-[100px] -z-20 md:top-[124px] lg:left-[28%] wide:top-[136px]">
          <img
            src={headerImg}
            alt={t.imageAlt}
            width={1200}
            height={805}
            fetchPriority="high"
            decoding="async"
            className="hero-photo-mask h-full w-full object-cover object-[51%_10%]"
          />
        </div>
        {/* Degradado oscuro desde la izquierda (titular) y desde arriba (menú).
            En celular, el texto va sobre toda la foto: más parejo */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(13,15,51,.85)_0%,rgba(13,15,51,.7)_28%,rgba(13,15,51,.32)_44%,rgba(13,15,51,0)_56%)] max-lg:bg-[linear-gradient(180deg,rgba(13,15,51,.55)_0%,rgba(13,15,51,.72)_45%,rgba(13,15,51,.85)_100%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[240px] bg-[linear-gradient(180deg,rgba(13,15,51,.35)_0%,rgba(13,15,51,0)_100%)]"
        />

        <div className="mx-auto w-[min(100%-32px,1200px)] wide:w-[min(100%-120px,1320px)]">
          <div className="animate-fade-up mx-auto w-full min-w-0 max-w-[620px] text-center lg:mx-0 lg:text-start">
            <Link
              to={lp("/#cobertura")}
              className="group mb-7 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[0.76rem] font-medium text-white backdrop-blur-[10px] transition-colors hover:border-white/50 hover:bg-white/15"
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
            {/* Cada línea sale de una máscara (CSS .line-mask: está arriba, no
                espera al motor de movimiento) */}
            <h1 className="mb-6 text-[clamp(2.2rem,1.2rem+3vw,3.9rem)] leading-[1.05] tracking-[-0.005em] text-white! [text-shadow:0_2px_24px_rgba(13,15,51,.35)]">
              <span className="line-mask">
                <span>{t.title}</span>
              </span>
              <span className="line-mask [--d:140ms]">
                <span>
                  {t.titlePrefix}
                  <span className="text-naranja">{t.titleHighlight}</span>
                </span>
              </span>
            </h1>
            <p className="mx-auto mb-9 max-w-[52ch] text-[clamp(1rem,.95rem+.25vw,1.12rem)] font-medium text-white/90 lg:mx-0 lg:text-start">
              {highlight(t.sub, t.subHighlights)}
            </p>
            <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
              <Link to={lp("/#cotizar")} data-magnetic className={`${btn.primary} ${btn.lg}`}>
                {t.cta}
                <Bi n="arrow-right" />
              </Link>
              <Link to={lp("/#servicios")} className={`${btn.ghost} ${btn.lg}`}>
                {t.ctaServices}
              </Link>
            </div>
            {/* Marquesina de destinos (src/data/worldMap.ts) */}
            <div className="mt-9 flex items-center gap-3 text-[0.8rem] font-semibold">
              <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 font-title text-[0.72rem] uppercase tracking-[0.14em] text-white ring-1 ring-white/25 backdrop-blur-[10px]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-naranja/70 motion-reduce:hidden" />
                  <span className="relative h-2 w-2 rounded-full bg-naranja" />
                </span>
                {t.routesFrom}
              </span>
              <div className="marquee flex min-w-0 flex-1 overflow-hidden" dir="ltr">
                {[0, 1].map((k) => (
                  <ul
                    key={k}
                    aria-hidden={k === 1}
                    className="animate-marquee flex shrink-0 items-center gap-5 pr-5 text-white/90 [animation-duration:70s]"
                  >
                    {DESTINATIONS.map((d) => (
                      <li key={d.name} className="flex items-center gap-5 whitespace-nowrap">
                        {placeName(d.name)}
                        <Bi n="airplane" className="text-[0.7rem] text-naranja" />
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Clientes y embajadas: todos a la vista; el logo toma color al pasar el cursor */}
      <div ref={clientsRef} className="relative pb-14 pt-10">
        <p className="mb-10 px-4 text-center text-[0.95rem] font-medium text-texto">
          {t.clientsTitle}
        </p>
        <ul
          aria-label={t.clientsLabel}
          className={`${container} grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-8`}
        >
          {CLIENT_LOGOS.map((c, i) => (
            <li
              key={c.name}
              title={c.name}
              className={`${TILE} grid h-20 place-items-center px-2 sm:h-24 sm:px-4 ${
                // En celular (3 columnas), si el último queda solo, va al centro
                i === CLIENT_LOGOS.length - 1 && CLIENT_LOGOS.length % 3 === 1
                  ? "max-sm:col-start-2"
                  : ""
              }`}
            >
              <img
                decoding="async"
                loading="lazy"
                src={c.src}
                alt={c.name}
                style={{
                  height: logoHeight(c.ratio) * 1.15,
                  width: logoHeight(c.ratio) * c.ratio * 1.15,
                }}
                className="max-w-full object-contain opacity-55 brightness-0 transition duration-300 group-hover:scale-110 group-hover:opacity-100 group-hover:brightness-100"
              />
              <TileStripe />
            </li>
          ))}
        </ul>

        {/* Embajadas: su escudo o emblema en grises (en silueta, como los logos,
            se perderían) y su nombre al lado; al pasar el cursor, a color */}
        <ul
          aria-label={t.embassiesLabel}
          className={`${container} mt-2 grid grid-cols-2 gap-2 sm:mt-3 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5`}
        >
          {EMBASSIES.map((e, i) => {
            const logo = embassyLogo(i);
            const h = Math.min(logoHeight(logo.ratio) * 1.3, 46);
            return (
              <li
                key={e}
                title={`${t.embassyOf} ${t.embassyName(e)}`}
                className={`${TILE} flex h-20 items-center gap-3 px-3 sm:h-24 sm:px-4`}
              >
                <img
                  decoding="async"
                  loading="lazy"
                  src={logo.src}
                  alt=""
                  style={{ height: h, width: h * logo.ratio }}
                  className="max-w-[36%] shrink-0 object-contain sm:max-w-[42%] opacity-70 grayscale contrast-125 transition duration-300 group-hover:scale-110 group-hover:opacity-100 group-hover:grayscale-0 group-hover:contrast-100"
                />
                <span className="min-w-0 text-left font-title leading-tight text-black/55 transition-colors duration-300 group-hover:text-azul">
                  <span className="block whitespace-nowrap text-[0.6rem] font-semibold uppercase tracking-[0.06em] sm:text-[0.68rem] sm:tracking-[0.14em]">
                    {t.embassyOf}
                  </span>
                  <span className="block text-[0.95rem] font-semibold sm:text-[1.05rem]">
                    {t.embassyName(e)}
                  </span>
                </span>
                <TileStripe />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

// Ficha de logo: se levanta con borde y sombra naranja al pasar el cursor. La
// transición CSS se limita a esas propiedades: la entrada (opacidad y posición)
// la anima GSAP, y una transición CSS sobre las mismas lo confundiría al medir
// (los logos quedaban invisibles)
export const TILE =
  "group relative overflow-hidden rounded-2xl border border-transparent bg-white transition-[translate,border-color,box-shadow] duration-300 hover:-translate-y-1.5 hover:border-linea hover:shadow-[0_18px_40px_-16px_rgba(255,118,25,.45)]";

// Franja naranja que crece desde la izquierda al pasar el cursor por la ficha
export function TileStripe() {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-naranja transition-transform duration-300 group-hover:scale-x-100"
    />
  );
}
