import { useCallback, useEffect, useRef, useState } from "react";
import mapaRelieve from "@/assets/images/mapa-mundo-relieve.svg";
import { useLang } from "@/i18n";
import { mapText } from "@/data/home";
import { DESTINATIONS } from "@/data/worldMap";
import { WORLD_LINES } from "@/data/worldLines";
import { useDestinationName } from "@/hooks/useContent";
import type { PickedCountry } from "@/hooks/useGlobe";
import { trackEvent } from "@/lib/analytics";
import { CountryCard } from "@/components/home/CountryCard";
import { Bi } from "@/components/ui";

// Mapa del encabezado de Mudanzas internacionales (nov. 2026; reemplazó al
// globo, que no gustó), en la línea visual del mapa de Bogotá de Mudanzas
// locales, que le gustó al cliente: mapamundi plano en relieve sobre el panel
// gris hielo (mapa-mundo-relieve.svg, generado con `pnpm map`: continentes en
// gris con paredes, fronteras blancas, Colombia en azul y rutas naranja desde
// Bogotá con destellos; animación CSS, sin JS) y, encima, Bogotá con la casita
// naranja y un punto azul por cada destino (WORLD_LINES, misma proyección).
// Al tocar cerca de un punto se abre su ficha con la foto de la capital
// (CountryCard, como en el globo); las fotos (countryPhotos.ts) se cargan solo
// entonces. Esc, el botón cerrar o un toque fuera del mapa la cierran.
/** Con `zoom` (encabezado "split"): el dibujo del mapa se agranda en
 *  escritorio; la ficha del destino no (va fuera de lo que se agranda) */
export function WorldRoutesMap({ zoom = false }: { zoom?: boolean }) {
  const { tr } = useLang();
  const t = mapText(tr);
  const placeName = useDestinationName();
  const rootRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [picked, setPicked] = useState<PickedCountry | null>(null);
  // Destino más cercano al puntero (se resalta y el cursor pasa a mano)
  const [hovered, setHovered] = useState<string | null>(null);
  const close = useCallback(() => setPicked(null), []);
  const { w, h, origin, points } = WORLD_LINES;

  const pick = useCallback(
    async (name: string) => {
      const root = rootRef.current;
      const map = mapRef.current;
      const point = points.find((p) => p.name === name);
      const place = DESTINATIONS.find((d) => d.name === name);
      if (!root || !map || !point || !place) return;
      const r = root.getBoundingClientRect();
      const m = map.getBoundingClientRect();
      const { COUNTRY_PHOTOS } = await import("@/data/countryPhotos");
      setPicked((now) =>
        now?.place.name === name
          ? null
          : {
              kind: "country",
              place,
              photo: COUNTRY_PHOTOS[name],
              x: m.left + (point.x / w) * m.width - r.left,
              y: m.top + (point.y / h) * m.height - r.top,
              w: r.width,
              h: r.height,
            },
      );
      trackEvent("map_country_click", { country: name });
    },
    [points, w, h],
  );

  // Con el mouse o el dedo se elige el destino más cercano al toque (en Europa
  // los puntos están muy juntos); con el teclado, cada punto es un botón
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const nearest = (e: MouseEvent) => {
      const m = map.getBoundingClientRect();
      let best: string | null = null;
      let dist = 22; // px: más lejos de cualquier punto, no elige ninguno
      for (const p of points) {
        const d = Math.hypot(
          m.left + (p.x / w) * m.width - e.clientX,
          m.top + (p.y / h) * m.height - e.clientY,
        );
        if (d < dist) [best, dist] = [p.name, d];
      }
      return best;
    };
    const onMove = (e: PointerEvent) => setHovered(nearest(e));
    const onLeave = () => setHovered(null);
    const onClick = (e: MouseEvent) => {
      const name = nearest(e);
      if (name) void pick(name);
      else close();
    };
    map.addEventListener("pointermove", onMove);
    map.addEventListener("pointerleave", onLeave);
    map.addEventListener("click", onClick);
    return () => {
      map.removeEventListener("pointermove", onMove);
      map.removeEventListener("pointerleave", onLeave);
      map.removeEventListener("click", onClick);
    };
  }, [points, w, h, pick, close]);

  // Esc o un toque fuera del mapa cierran la ficha
  useEffect(() => {
    if (!picked) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [picked, close]);

  return (
    <div ref={rootRef} className="absolute inset-0" dir="ltr">
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          ref={mapRef}
          className={`relative w-[112%] shrink-0 ${zoom ? "lg:origin-[70%_50%] lg:scale-[1.45]" : ""} ${hovered ? "cursor-pointer" : ""}`}
          style={{ aspectRatio: `${w} / ${h}` }}
        >
          <img
            src={mapaRelieve}
            alt={t.label}
            draggable={false}
            decoding="async"
            className="absolute inset-0 h-full w-full select-none"
          />
          {points.map((p) => {
            const on = picked?.place.name === p.name;
            const near = hovered === p.name;
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => void pick(p.name)}
                aria-label={placeName(p.name)}
                aria-pressed={on}
                title={placeName(p.name)}
                className="group pointer-events-none absolute grid h-5 w-5 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
                style={{ left: `${(p.x / w) * 100}%`, top: `${(p.y / h) * 100}%` }}
              >
                <span
                  className={`block rounded-full transition-[width,height,background-color,box-shadow] duration-200 ${
                    on
                      ? "h-3 w-3 bg-naranja ring-2 ring-white shadow-[0_0_0_5px_rgba(255,118,25,.25)]"
                      : near
                        ? "h-2.5 w-2.5 bg-naranja ring-2 ring-white"
                        : "h-1.5 w-1.5 bg-azul ring-1 ring-white group-focus-visible:h-2.5 group-focus-visible:w-2.5 group-focus-visible:bg-naranja"
                  }`}
                />
              </button>
            );
          })}
          {/* Nombre del destino que se va a abrir, al pasar el cursor cerca */}
          {hovered &&
            hovered !== picked?.place.name &&
            (() => {
              const p = points.find((q) => q.name === hovered)!;
              return (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -translate-x-1/2 -translate-y-[calc(100%+10px)] whitespace-nowrap rounded-full bg-azul px-2.5 py-1 font-title text-[0.7rem] font-semibold text-white shadow-[var(--shadow-float)]"
                  style={{ left: `${(p.x / w) * 100}%`, top: `${(p.y / h) * 100}%` }}
                >
                  {placeName(p.name)}
                </span>
              );
            })()}
          {/* Bogotá: la casita naranja del mapa de Mudanzas locales (sin rótulo, como allá) */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute grid h-6 w-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-naranja text-[0.7rem] text-white shadow-[0_0_0_5px_rgba(255,118,25,.22),0_4px_10px_rgba(39,43,124,.25)]"
            style={{ left: `${(origin.x / w) * 100}%`, top: `${(origin.y / h) * 100}%` }}
          >
            <Bi n="house-door-fill" />
          </span>
        </div>
      </div>
      {picked && <CountryCard key={picked.place.name} picked={picked} onClose={close} />}
    </div>
  );
}
