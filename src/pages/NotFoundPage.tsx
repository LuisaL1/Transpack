import { Link } from "react-router-dom";
import { Bi, btn, Eyebrow } from "@/components/ui";
import { PageHero } from "@/components/sections";
import { useSite } from "@/hooks/useContent";
import { useLang } from "@/i18n";
import { notFoundText } from "@/data/pages";

// Página no encontrada (404): enlaces al inicio, al cotizador y a cada
// servicio. En producción Vercel la sirve con estado 404 (dist/404.html).
// Textos en src/data/pages.ts.
export function NotFoundPage() {
  const { lp, tr } = useLang();
  const { SERVICES } = useSite();
  const t = notFoundText(tr);
  return (
    <PageHero>
      <div className="max-w-3xl py-10">
        <Eyebrow light>{t.eyebrow}</Eyebrow>
        <h1 className="mb-5 text-[clamp(2.2rem,1.4rem+3vw,3.6rem)] !text-white">{t.title}</h1>
        <p className="mb-8 text-[1.08rem]">{t.text}</p>
        <div className="mb-12 flex flex-wrap gap-3">
          <Link to={lp("/")} className={`${btn.primary} ${btn.lg}`}>
            {t.cta}
          </Link>
          <Link to={lp("/#cotizar")} className={`${btn.ghost} ${btn.lg}`}>
            {t.quote}
          </Link>
        </div>
        <p className="mb-4 font-title text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-beige">
          {t.services}
        </p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {SERVICES.map((s) => (
            <li key={s.slug}>
              <Link
                to={lp(`/servicios/${s.slug}`)}
                className="group flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-white transition-colors hover:bg-white/10"
              >
                <Bi n={s.icon} className="text-lg text-naranja" />
                <span className="flex-1 font-medium">{s.title}</span>
                <Bi
                  n="arrow-right"
                  className="text-naranja transition-transform group-hover:translate-x-1"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </PageHero>
  );
}
