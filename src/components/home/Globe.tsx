import { useLang } from "@/i18n";
import { mapText } from "@/data/home";
import { SECTOR_PHOTOS } from "@/data/sectorPhotos";
import { useDestinationName } from "@/hooks/useContent";
import { useGlobe } from "@/hooks/useGlobe";
import { CountryCard } from "@/components/home/CountryCard";
import { Bi } from "@/components/ui";

// Lado derecho de la portada (pedido del cliente, oct. 2026), sin panel: el mapa
// va en gris sobre el blanco de la página, integrado con el fondo (nov. 2026;
// antes en una tarjeta azul marino). Las pestañas con la etapa del recorrido y la
// leyenda flotan arriba y abajo, así el mapa ocupa todo el espacio. Empieza con un
// carrusel de fotos de los sectores exclusivos de Bogotá (SECTOR_PHOTOS, desde
// Wikimedia Commons, con su crédito; nov. 2026), que se cierra en un círculo
// donde aparece Bogotá; luego Colombia y el resto del mundo (src/lib/globe.ts).
// La primera foto es lo que se ve en el HTML pre-generado y mientras carga el
// mapa. Al tocar un país se detiene y muestra la foto de su capital (CountryCard).
export function Globe({ className = "" }: { className?: string }) {
  const { tr } = useLang();
  const t = mapText(tr);
  const placeName = useDestinationName();
  const { canvasRef, photoRef, picked, close, stage, scrollMode, goTo, barRef, hintRef } = useGlobe(
    {
      origin: t.origin,
      country: "Colombia",
      city: "Bogotá",
      cityCredit: t.cityCredit,
      place: (p) => placeName(p.name),
    },
  );
  return (
    // Sin tarjeta: pestañas con la etapa del recorrido arriba, el mapa en todo
    // el espacio y la leyenda abajo, sobre el blanco de la página
    <div className={`relative isolate flex flex-col bg-white text-texto ${className}`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-3 px-1">
        <ol
          aria-label={t.stagesLabel}
          className="pointer-events-auto flex gap-1 rounded-full bg-gris/90 p-1 ring-1 ring-linea backdrop-blur"
        >
          {t.stages.map((name, i) => (
            <li
              key={name}
              aria-current={i === stage ? "step" : undefined}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-title text-[0.72rem] font-semibold tracking-wide transition-colors duration-500 ${
                i === stage ? "bg-white text-azul shadow-sm" : "text-suave"
              }`}
            >
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${
                  i === stage ? "bg-naranja shadow-[0_0_8px_rgba(255,118,25,.7)]" : "bg-linea"
                }`}
              />
              {scrollMode ? (
                // Con el scroll, cada pestaña lleva a su etapa
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={t.goToStage(name)}
                  className="transition-colors hover:text-azul"
                >
                  {name}
                </button>
              ) : (
                name
              )}
            </li>
          ))}
        </ol>
        <p className="hidden font-title text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-suave sm:block">
          {t.network} · <span className="text-naranja">{t.countries}</span>
        </p>
      </div>

      <div className="relative min-h-0 flex-1" dir="ltr">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={t.label}
          className="absolute inset-0 h-full w-full"
        />
        <div
          ref={photoRef}
          className="pointer-events-none absolute inset-0 grid place-items-center will-change-transform"
        >
          {SECTOR_PHOTOS.map((p, i) => (
            <figure
              key={p.src}
              className="relative m-0 aspect-[4/3] w-[82%] max-w-[700px] overflow-hidden rounded-[22px] bg-azul-900 [grid-area:1/1]"
              style={{ opacity: i ? 0 : 1 }}
            >
              <img
                src={p.src}
                alt={t.cityPhoto(p.name, "Bogotá")}
                width={p.width}
                height={p.height}
                referrerPolicy="no-referrer"
                fetchPriority={i ? "auto" : "high"}
                decoding="async"
                className="h-full w-full object-cover"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-tinta/85 to-transparent px-5 pb-3.5 pt-10 text-left text-white">
                <span className="block font-title text-[1.05rem] font-semibold leading-tight">
                  {p.name}
                </span>
                <span className="block text-[0.65rem] text-white/80">
                  {t.credit}: {p.author} · {p.license}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
        {picked && <CountryCard key={picked.place.name} picked={picked} onClose={close} />}
        {/* Aviso al llegar, con la historia guiada por el scroll (lo muestra useGlobe) */}
        <div
          ref={hintRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center opacity-0 transition-opacity duration-500"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-1.5 text-[0.72rem] font-semibold text-azul shadow-[0_6px_18px_-10px_rgba(39,43,124,.45)] ring-1 ring-linea backdrop-blur">
            <span className="relative grid h-5 w-3.5 place-items-start justify-center rounded-full border border-azul/50 pt-1">
              <span className="h-1.5 w-0.5 animate-bounce rounded-full bg-naranja" />
            </span>
            {t.scrollHint}
          </span>
        </div>
      </div>

      {/* Leyenda y, debajo, la barra de avance del scroll por las tres etapas */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-1">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 pb-2 text-[0.72rem] text-suave">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true" className="h-0.5 w-5 rounded-full bg-naranja" />
            {t.legendRoutes}
          </span>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-[3px] bg-azul" />
            {t.legendHighlight}
          </span>
          <span className="ms-auto hidden items-center gap-1.5 md:inline-flex">
            <Bi n="hand-index" className="text-naranja" />
            {t.legendHint}
          </span>
        </div>
        <span
          aria-hidden="true"
          className="relative block h-0.5 overflow-hidden rounded-full bg-linea/70"
        >
          <span ref={barRef} className="absolute inset-0 origin-left scale-x-0 bg-naranja" />
        </span>
      </div>
    </div>
  );
}
