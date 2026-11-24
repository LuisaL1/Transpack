import { Link } from "react-router-dom";
import { useLang } from "@/i18n";
import { heroText } from "@/data/home";
import { CLIENT_LOGOS, logoHeight } from "@/data/clientLogos";
import { Bi, btn } from "@/components/ui";
import { Globe } from "@/components/home/Globe";
import { container } from "@/components/ui/layout";

// Fondo blanco (pedido del cliente, oct. 2026). A la izquierda el titular y los
// botones; a la derecha el globo animado (Globe), grande y
// recortado por el borde de la página, como en la web de referencia del
// cliente (Spectrum). En celular el globo va debajo del texto. Los clientes al
// pie, todos a la vista en una cuadrícula fija (ya no en carrusel, nov. 2026):
// en gris; al pasar el cursor, cada logo recupera sus colores y su ficha se
// levanta con sombra y la franja naranja de la marca.
// Resalta en negrita y azul las cifras indicadas dentro de un texto
function highlight(text: string, marks: string[]) {
  const parts: React.ReactNode[] = [];
  let rest = text;
  for (const mark of marks) {
    const at = rest.indexOf(mark);
    if (at < 0) continue;
    parts.push(
      rest.slice(0, at),
      <strong key={mark} className="font-bold text-azul">
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
  return (
    <section className="relative overflow-hidden bg-white pt-[150px] text-texto md:pt-[180px]">
      <div className="relative">
        {/* El bloque de texto va encima del globo pero deja pasar el puntero fuera
            de sus elementos, para que el globo se pueda girar y apuntar */}
        <div className={`${container} pointer-events-none relative z-10 lg:min-h-[700px] lg:py-8`}>
          <div className="animate-fade-up pointer-events-auto mx-auto max-w-[600px] text-center lg:mx-0 lg:max-w-[460px] lg:text-start xl:max-w-[540px]">
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
            <h1 className="mb-5 text-[clamp(2.1rem,1.3rem+2.6vw,3.6rem)] leading-[1.08] text-azul">
              {t.title}
              <br />
              {t.titlePrefix}
              <span className="text-naranja-600">{t.titleHighlight}</span>
            </h1>
            <p className="mx-auto mb-8 max-w-[60ch] text-[clamp(1rem,.95rem+.25vw,1.12rem)] font-medium text-texto lg:mx-0 lg:text-start">
              {highlight(t.sub, t.subHighlights)}
            </p>
            <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
              <Link to={lp("/#cotizar")} className={`${btn.primary} ${btn.lg}`}>
                {t.cta}
              </Link>
              <Link to={lp("/#servicios")} className={`${btn.outline} ${btn.lg}`}>
                {t.ctaServices}
              </Link>
            </div>
          </div>
        </div>

        {/* Globo: grande, como el planeta de la referencia del cliente. En celular
            va debajo del texto y se sale un poco por los lados; en escritorio ocupa
            la derecha y desborda el borde de la página (la sección lo recorta) */}
        <div className="relative left-1/2 mt-2 aspect-square w-[min(108vw,600px)] -translate-x-1/2 lg:absolute lg:left-auto lg:top-[2%] lg:bottom-[0] lg:right-[-2vw] lg:mt-0 lg:aspect-auto lg:w-[56vw] lg:max-w-[940px] lg:translate-x-0">
          <Globe className="h-full w-full" />
        </div>
      </div>

      {/* Clientes: todos a la vista; el logo toma color al pasar el cursor */}
      <div className="relative pb-14 pt-10">
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
              className={`group relative grid h-20 place-items-center overflow-hidden rounded-2xl border border-transparent bg-white px-2 transition-all duration-300 hover:-translate-y-1.5 hover:border-linea hover:shadow-[0_18px_40px_-16px_rgba(255,118,25,.45)] sm:h-24 sm:px-4 ${
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
              {/* Franja naranja que crece desde la izquierda */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-naranja transition-transform duration-300 group-hover:scale-x-100"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
