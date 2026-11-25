import { useLang } from "@/i18n";
import { mapText } from "@/data/home";
import { serviceDetailText } from "@/data/pages";
import { useSite } from "@/hooks/useContent";
import { Bi } from "@/components/ui";
import { ColombiaRoutesMap } from "@/components/services/ColombiaRoutesMap";
import { ServiceGlobe } from "@/components/services/ServiceGlobe";

export type ServiceMapKind = "bogota" | "colombia" | "mundo";

// Panel del mapa animado del encabezado de Mudanzas locales, nacionales e
// internacionales (diseño "bento", nov. 2026): panel claro en gris hielo, a
// tono con el mapa de la portada (Globe.tsx, en gris sobre blanco desde nov.
// 2026; antes ambos en azul noche), con una chapa de vidrio arriba que dice qué muestra el
// mapa (y su cifra) y la leyenda a la derecha. El mapa ocupa el resto, nítido;
// la foto del servicio va aparte, como tarjeta montada sobre la esquina
// (PageHero con `backdrop`). Bogotá y el mundo salen del globo de la portada
// (ServiceGlobe); Colombia, del mapa del camión (ColombiaRoutesMap).
export function ServiceMapPanel({ kind }: { kind: ServiceMapKind }) {
  const { tr } = useLang();
  const t = mapText(tr);
  const s = serviceDetailText(tr);
  const { STATS } = useSite();
  const chip =
    kind === "bogota"
      ? s.mapChipBogota
      : kind === "colombia"
        ? s.mapChipColombia
        : s.mapChipMundo(STATS[1].value);
  return (
    <div className="relative isolate flex h-full flex-col overflow-hidden rounded-[28px] bg-gris text-texto shadow-[var(--shadow-card)] ring-1 ring-linea">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_55%_45%,#ffffff_0%,#f0f6f6_70%)]"
      />
      <div className="relative z-10 flex items-center justify-between gap-3 px-4 pt-4 sm:px-5">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-1.5 font-title text-[0.74rem] font-semibold tracking-wide text-azul shadow-sm ring-1 ring-linea backdrop-blur">
          <span aria-hidden="true" className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-naranja/70 motion-reduce:hidden" />
            <span className="relative h-2 w-2 rounded-full bg-naranja shadow-[0_0_8px_rgba(255,118,25,.9)]" />
          </span>
          {chip}
        </span>
        <span className="hidden items-center gap-2 text-[0.72rem] text-suave sm:inline-flex">
          {kind === "colombia" ? (
            <>
              <span
                aria-hidden="true"
                className="h-0.5 w-5 rounded-full bg-naranja shadow-[0_0_6px_rgba(255,118,25,.9)]"
              />
              {s.mapLegendColombia}
            </>
          ) : (
            <>
              <Bi n="hand-index" className="text-naranja" />
              {t.legendHint}
            </>
          )}
        </span>
      </div>
      <div className="relative min-h-0 flex-1">
        {kind === "colombia" ? <ColombiaRoutesMap fill /> : <ServiceGlobe focus={kind} />}
      </div>
    </div>
  );
}
