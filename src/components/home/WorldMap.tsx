// Mapamundi de puntos con rutas desde Bogotá hacia los países donde Transpack
// ha operado. Los puntos vienen precalculados en src/data/worldMap.ts (pnpm map).
import { useEffect, useState } from "react";
import { useLang } from "@/i18n";
import { mapText } from "@/data/home";
import { useDestinationName } from "@/hooks/useContent";
import {
  DESTINATIONS,
  DOTS_BASE,
  DOTS_HOT,
  DOTS_ORIGIN,
  MAP_H,
  MAP_W,
  ORIGIN,
} from "@/data/worldMap";

// Curva que sale de Bogotá y se eleva según la distancia al destino
const arc = (x: number, y: number) => {
  const dist = Math.hypot(x - ORIGIN.x, y - ORIGIN.y);
  const cx = (ORIGIN.x + x) / 2;
  const cy = Math.min(ORIGIN.y, y) - dist * 0.32;
  return `M${ORIGIN.x} ${ORIGIN.y} Q${cx} ${cy} ${x} ${y}`;
};

// Si se pasa "active", el destino resaltado lo controla el padre (el titular del
// hero rota los destinos en sincronía con el mapa). null = ninguno resaltado.
export function WorldMap({
  className = "",
  active: controlled,
}: {
  className?: string;
  active?: number | null;
}) {
  const { tr } = useLang();
  const t = mapText(tr);
  const placeName = useDestinationName();
  const [auto, setAuto] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const isControlled = controlled !== undefined;

  // Sin control externo, recorre los destinos uno a uno
  useEffect(() => {
    if (isControlled || hover !== null) return;
    const id = setInterval(() => setAuto((i) => (i + 1) % DESTINATIONS.length), 2600);
    return () => clearInterval(id);
  }, [hover, isControlled]);

  const current = hover ?? (isControlled ? controlled : auto);

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        className="block h-auto w-full overflow-visible"
        role="img"
        aria-label={t.label}
      >
        <defs>
          <radialGradient id="pinGlow">
            <stop offset="0%" stopColor="#ff7619" stopOpacity=".55" />
            <stop offset="100%" stopColor="#ff7619" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Tierra */}
        <path
          d={DOTS_BASE}
          stroke="#ffffff"
          strokeOpacity=".3"
          strokeWidth="3.1"
          strokeLinecap="round"
        />
        <path
          d={DOTS_HOT}
          stroke="#ffb27a"
          strokeOpacity="1"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path d={DOTS_ORIGIN} stroke="#ff7619" strokeWidth="3.6" strokeLinecap="round" />

        {/* Rutas */}
        {DESTINATIONS.map((d, i) => {
          const path = arc(d.x, d.y);
          const on = i === current;
          return (
            <g key={d.name}>
              <path
                d={path}
                fill="none"
                stroke={on ? "#ff7619" : "#ffffff"}
                strokeOpacity={on ? 1 : 0.35}
                strokeWidth={on ? 2 : 1.2}
                className="route transition-all duration-500"
                style={{ animationDuration: `${2.6 + (i % 3) * 0.6}s` }}
              />
              <circle r={on ? 3.6 : 2.4} fill={on ? "#ff7619" : "#faeed9"}>
                <animateMotion
                  dur={`${3.2 + (i % 4) * 0.7}s`}
                  repeatCount="indefinite"
                  path={path}
                  begin={`-${i * 0.35}s`}
                />
              </circle>
            </g>
          );
        })}

        {/* Destinos */}
        {DESTINATIONS.map((d, i) => (
          <g
            key={d.name}
            className="cursor-pointer"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <circle
              cx={d.x}
              cy={d.y}
              r="14"
              fill="url(#pinGlow)"
              opacity={i === current ? 1 : 0}
              className="transition-opacity duration-500"
            />
            <circle cx={d.x} cy={d.y} r="9" fill="transparent" />
            <circle
              cx={d.x}
              cy={d.y}
              r={i === current ? 5 : 3.6}
              fill="#fff"
              stroke="#ff7619"
              strokeWidth="2"
              className="transition-all duration-300"
            />
          </g>
        ))}

        {/* Origen */}
        <circle
          cx={ORIGIN.x}
          cy={ORIGIN.y}
          r="12"
          fill="rgba(255,118,25,.4)"
          className="pulse-ring"
        />
        <circle cx={ORIGIN.x} cy={ORIGIN.y} r="5.5" fill="#ff7619" stroke="#fff" strokeWidth="2" />
      </svg>

      {/* Etiquetas (HTML para que se lean nítidas) */}
      <span
        className="pointer-events-none absolute -translate-x-1/2 translate-y-3 whitespace-nowrap rounded-full bg-naranja px-3 py-1 text-[0.72rem] font-semibold text-white shadow-lg sm:text-xs"
        style={{ left: `${(ORIGIN.x / MAP_W) * 100}%`, top: `${(ORIGIN.y / MAP_H) * 100}%` }}
      >
        {t.origin}
      </span>
      {DESTINATIONS.map((d, i) => (
        <span
          key={d.name}
          aria-hidden={i !== current}
          className={`pointer-events-none absolute whitespace-nowrap rounded-full bg-white px-3 py-1 text-[0.72rem] font-semibold text-azul shadow-lg transition-all duration-500 sm:text-xs ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
          style={{
            left: `${(d.x / MAP_W) * 100}%`,
            top: `${(d.y / MAP_H) * 100}%`,
            // Cerca del borde derecho la etiqueta crece hacia la izquierda (en móvil
            // el mapa se recorta y Japón o Corea quedarían cortados)
            translate: `${d.x > 780 ? "-88%" : "-50%"} calc(-100% - ${i === current ? 12 : 4}px)`,
          }}
        >
          {placeName(d.name)}
        </span>
      ))}
    </div>
  );
}
