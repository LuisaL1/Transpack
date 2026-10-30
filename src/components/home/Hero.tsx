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
// cliente (Spectrum). En celular el globo va debajo del texto. Los clientes al pie.
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
          <div className="animate-fade-up pointer-events-auto mx-auto max-w-[600px] text-center lg:mx-0 lg:max-w-[540px] lg:text-start">
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
