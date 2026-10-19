import { useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "@/i18n";
import { useSite } from "@/hooks/useContent";
import { quickPickText } from "@/data/home";
import { trackEvent } from "@/lib/analytics";
import { Bi } from "@/components/ui";

// "¿Qué necesitas hoy?": selector compacto de los seis servicios en la portada
// (mismo patrón que el sitio de Transarchivos). Al elegir uno muestra en una
// línea qué hace Transpack y lleva a su página o al cotizador con ese servicio
// ya elegido. Los textos salen de SERVICES (src/data/site*.ts) y de home.ts.
export function HeroQuickStart() {
  const { lp, tr } = useLang();
  const t = quickPickText(tr);
  const { SERVICES } = useSite();
  const [sel, setSel] = useState(0);
  const s = SERVICES[sel];
  return (
    <div className="mx-auto w-full max-w-[520px] text-start lg:mx-0">
      <p className="mb-3 flex items-center justify-center gap-2 font-title text-[0.95rem] font-semibold text-white lg:justify-start">
        <span className="h-2 w-2 rounded-full bg-naranja shadow-[0_0_0_4px_rgba(255,118,25,.25)]" />
        {t.title}
      </p>
      {/* Panel de vidrio: borde de luz arriba y sombra en dos capas (cercana y
          lejana) para que flote sobre el fondo azul */}
      <div className="relative rounded-[28px] border border-white/15 bg-white/[0.08] p-2.5 shadow-[0_2px_0_0_rgba(255,255,255,.08)_inset,0_10px_24px_-10px_rgba(13,15,51,.45),0_40px_80px_-30px_rgba(13,15,51,.7)] backdrop-blur-md">
        <div role="tablist" aria-label={t.title} className="grid grid-cols-3 gap-1.5">
          {SERVICES.map((o, i) => {
            const on = i === sel;
            return (
              <button
                key={o.slug}
                type="button"
                role="tab"
                id={`qs-tab-${o.slug}`}
                aria-selected={on}
                aria-controls="qs-panel"
                onClick={() => {
                  setSel(i);
                  trackEvent("hero_service_pick", { service: o.quote });
                }}
                className={`group flex flex-col items-center gap-1.5 rounded-2xl px-2 py-3 text-[0.74rem] font-bold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                  on
                    ? "bg-naranja text-white shadow-[0_12px_24px_-10px_rgba(255,118,25,.85),inset_0_1px_0_rgba(255,255,255,.25)]"
                    : "text-white/75 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Bi
                  n={o.icon}
                  className={`text-[1.1rem] transition-transform duration-200 ${on ? "" : "group-hover:scale-110"}`}
                />
                <span>{t.labels[o.slug] ?? o.title}</span>
              </button>
            );
          })}
        </div>

        {/* Detalle del servicio elegido. Los seis textos ocupan la misma celda:
            la tarjeta mide lo del más largo y no salta al cambiar de pestaña. */}
        <div
          role="tabpanel"
          id="qs-panel"
          aria-labelledby={`qs-tab-${s.slug}`}
          className="mt-2.5 overflow-hidden rounded-[20px] bg-white shadow-[0_18px_40px_-18px_rgba(13,15,51,.55)] ring-1 ring-azul/5"
        >
          <div className="grid">
            {SERVICES.map((o, i) => (
              <div
                key={o.slug}
                aria-hidden={i !== sel}
                className={`flex items-center gap-4 px-5 py-5 [grid-area:1/1] ${
                  i === sel ? "animate-fade-up" : "invisible"
                }`}
              >
                <span className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-azul text-[1.2rem] text-naranja shadow-[0_8px_18px_-8px_rgba(39,43,124,.7)]">
                  <span
                    aria-hidden="true"
                    className="absolute -right-3 -top-3 h-6 w-6 rotate-45 rounded-[5px] bg-naranja/25"
                  />
                  <Bi n={o.icon} className="relative" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-title text-[1rem] font-semibold leading-tight text-azul">
                    {o.title}
                  </p>
                  <p className="mt-1 text-[0.8rem] leading-[1.5] text-suave">{o.short}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-linea bg-gris/60 px-5 py-3">
            <Link
              to={lp(`/servicios/${s.slug}`)}
              className="group inline-flex items-center gap-1 text-[0.82rem] font-semibold text-azul transition-colors hover:text-naranja"
            >
              {t.more}
              <Bi
                n="chevron-right"
                className="text-[0.6rem] transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              to={lp(`/?servicio=${s.quote}#cotizar`)}
              className="group inline-flex items-center gap-2 rounded-full bg-azul py-1.5 pe-1.5 ps-4 text-[0.82rem] font-bold text-white shadow-[0_10px_22px_-10px_rgba(39,43,124,.8)] transition-all hover:-translate-y-0.5 hover:bg-azul-700"
            >
              {t.cta}
              <span className="grid h-7 w-7 place-items-center rounded-full bg-naranja text-white transition-transform group-hover:translate-x-0.5">
                <Bi n="arrow-right" className="text-[0.75rem]" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
