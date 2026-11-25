import type { CSSProperties } from "react";

// Fondo con rutas animadas (prueba, nov. 2026): líneas muy finas y discontinuas,
// en gris suave, que cruzan la pantalla en curvas y unen nodos circulares
// (origen: aro; entrega: aro con punto). Por cada ruta viaja un puntito naranja
// con una estela suave, en bucle de 31 a 38 s, desfasado entre rutas. Solo SVG y
// CSS (animación .route-run en src/styles/index.css), sin JS: el punto y la
// estela son trazos de la misma ruta que avanzan con stroke-dashoffset
// (pathLength = 1000), así siempre van juntos. Es solo fondo (nov. 2026): capa
// fija DETRÁS de todo el contenido (z-index -1, sobre el blanco del body), así
// textos, tarjetas e imágenes siempre quedan encima; se ve donde la sección no
// tiene fondo propio (por eso las secciones blancas no llevan bg-white).
// Decorativa (aria-hidden, sin clics). Desde 1024 px; con
// movimiento reducido quedan las rutas quietas, sin el punto.
type Route = {
  d: string;
  dur: number;
  delay: number;
  nodes: [number, number, "origin" | "drop"][];
};

const ROUTES: Route[] = [
  {
    d: "M40 770C220 650 150 430 330 340S540 120 790 70",
    dur: 34,
    delay: 0,
    nodes: [
      [40, 770, "origin"],
      [330, 340, "drop"],
      [790, 70, "drop"],
    ],
  },
  {
    d: "M1405 120C1250 250 1340 420 1180 520S990 790 1250 870",
    dur: 38,
    delay: -14,
    nodes: [
      [1405, 120, "origin"],
      [1180, 520, "drop"],
      [1250, 870, "drop"],
    ],
  },
  {
    d: "M640 890C780 790 960 830 1060 700S1290 560 1430 610",
    dur: 31,
    delay: -22,
    nodes: [
      [640, 890, "origin"],
      [1060, 700, "drop"],
      [1430, 610, "drop"],
    ],
  },
  {
    d: "M10 300C130 250 170 130 320 100S560 180 640 30",
    dur: 36,
    delay: -7,
    nodes: [
      [10, 300, "origin"],
      [320, 100, "drop"],
      [640, 30, "drop"],
    ],
  },
];

// Estela: tres trazos que terminan en el punto, cada vez más largos y tenues
const TRAIL = [
  { len: 70, width: 1.6, opacity: 0.1 },
  { len: 40, width: 2, opacity: 0.16 },
  { len: 18, width: 2.4, opacity: 0.24 },
];

export function RouteLines() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      className="route-lines pointer-events-none fixed inset-0 -z-10 hidden h-full w-full lg:block"
      fill="none"
    >
      {ROUTES.map((r, i) => {
        const timing = { "--route-dur": `${r.dur}s`, "--route-delay": `${r.delay}s` };
        return (
          <g key={i}>
            {/* La ruta */}
            <path
              d={r.d}
              className="stroke-suave"
              strokeOpacity={0.2}
              strokeWidth={1}
              strokeDasharray="4 7"
              strokeLinecap="round"
            />
            {/* Nodos de origen y entrega */}
            {r.nodes.map(([x, y, kind]) => (
              <g key={`${x}-${y}`} className="stroke-suave" strokeOpacity={0.3} strokeWidth={1.2}>
                <circle cx={x} cy={y} r={5} className="fill-white" />
                {kind === "drop" && (
                  <circle
                    cx={x}
                    cy={y}
                    r={1.6}
                    className="fill-suave"
                    fillOpacity={0.45}
                    stroke="none"
                  />
                )}
              </g>
            ))}
            {/* Estela y punto que recorren la ruta */}
            {TRAIL.map((t) => (
              <path
                key={t.len}
                d={r.d}
                pathLength={1000}
                className="route-run stroke-naranja"
                strokeOpacity={t.opacity}
                strokeWidth={t.width}
                strokeLinecap="round"
                strokeDasharray={`${t.len} 2000`}
                style={{ ...timing, "--route-len": t.len } as CSSProperties}
              />
            ))}
            <path
              d={r.d}
              pathLength={1000}
              className="route-run stroke-naranja"
              strokeOpacity={0.55}
              strokeWidth={5}
              strokeLinecap="round"
              strokeDasharray="0.01 2000"
              style={{ ...timing, "--route-len": 0.01 } as CSSProperties}
            />
          </g>
        );
      })}
    </svg>
  );
}
