import { useState } from "react";
import { useLang } from "@/i18n";
import { serviceDetailText } from "@/data/pages";
import { COLOMBIA_PATH, NEIGHBORS_PATH, ROADS, ROUTE_NODES } from "@/data/colombiaMap";
import {
  buildTracks,
  journeyAt,
  roadPath,
  truckTransform,
  type RouteNode,
  type Side,
  type TripPhase,
} from "@/lib/colombiaRoutes";
import { useTruckTrip } from "@/hooks/useTruckTrip";

// Encabezado de Mudanzas nacionales: mapa de Colombia (Natural Earth 1:10m)
// con las carreteras entre las ciudades principales. Un camión viaja de una
// ciudad a otra por el camino más corto y deja una estela con un brillo que la
// recorre. Origen y destino llevan una casa: la del destino cae con un rebote
// y un aviso ("Próximo destino"); al llegar salta, se abre una onda y sale el
// aviso de llegada; luego se borra la estela, la casa del origen desaparece y
// la del destino pasa a ser el nuevo origen. Misma estética del globo de la
// portada: grises, Colombia y rutas en naranja, puntos en tinta y Bogotá en
// naranja. Como en la portada (pedido del cliente, nov. 2026, para que resalte):
// el mapa va en un círculo sobre fondo blanco, con el mar gris claro, los países
// vecinos en negro carbón y Colombia en un tono claro de #1800AD con borde pleno
// (antes naranja; pedido del cliente, nov. 2026). Datos: `pnpm
// map` (src/data/colombiaMap.ts); recorrido:
// src/lib/colombiaRoutes.ts; animaciones: .map-* en src/styles/index.css.
const TRACKS = buildTracks(ROADS);
const ROAD_PATHS = ROADS.map((r) => roadPath(r.points));
const CITIES = ROUTE_NODES.filter((n) => n.name);
const BY_ID = Object.fromEntries(CITIES.map((c) => [c.id, c])) as Record<string, RouteNode>;
// El primer viaje sale de Bogotá; en el HTML pre-generado el destino sale de esta
// semilla y en el navegador se elige al azar (useTruckTrip)
const SEED = 7;
// Círculo donde se ve el mapa: el más pequeño que contiene a Colombia, con un
// margen (unidades del SVG; ver COLOMBIA_VIEWBOX)
const LENS = { x: 356, y: 388, r: 412 };
const PAD = 26; // para la sombra del círculo
const VIEWBOX = [
  LENS.x - LENS.r - PAD,
  LENS.y - LENS.r - PAD,
  2 * (LENS.r + PAD),
  2 * (LENS.r + PAD),
].join(" ");
const INK = "62,65,96"; // gris oscuro del texto (como en src/lib/globe.ts)
const CHARCOAL = "34,34,40"; // negro carbón de los continentes de la portada
// Grosor del bloque de Colombia (unidades del SVG) y sus paredes, de más
// oscuras (abajo) a más claras (arriba), en tonos del color resaltado como en
// src/lib/globe.ts
const SLAB = 16;
const SLAB_STEPS = Array.from({ length: SLAB / 2 }, (_, i) => SLAB - 2 * i);
const wallColor = (k: number) => {
  const [dark, light] = [
    [82, 64, 194],
    [163, 153, 222],
  ];
  return `rgb(${dark.map((c, i) => Math.round(c * k + light[i] * (1 - k)))})`;
};

// Lugar del nombre junto al punto (en em, para que crezca con la letra)
const LABEL: Record<Side, { dx: string; dy: string; anchor: "start" | "middle" | "end" }> = {
  right: { dx: "0.75em", dy: "0.35em", anchor: "start" },
  left: { dx: "-0.75em", dy: "0.35em", anchor: "end" },
  above: { dx: "0", dy: "-0.85em", anchor: "middle" },
  below: { dx: "0", dy: "1.45em", anchor: "middle" },
};

export function ColombiaRoutesMap() {
  const { tr } = useLang();
  const t = serviceDetailText(tr);
  const { trip, phase, journey, svgRef, truckRef, trailRefs, shineRef } = useTruckTrip(
    TRACKS,
    CITIES,
    "bogota",
    SEED,
  );
  // Lugar del camión en el primer pintado (HTML pre-generado). Después lo mueve
  // solo el hook: si React lo volviera a poner al cambiar de viaje, el camión
  // saltaría de dirección en vez de girar suave.
  const [firstTransform] = useState(() => {
    const p = journeyAt(journey, 0);
    return truckTransform(p.x, p.y, p.angle);
  });
  const from = BY_ID[trip.from];
  const to = BY_ID[trip.to];
  const arrived = phase === "arrived" || phase === "leaving";
  return (
    <div className="relative h-[440px] w-full overflow-hidden bg-white sm:h-[500px] lg:h-full">
      <svg
        ref={svgRef}
        viewBox={VIEWBOX}
        role="img"
        aria-label={t.mapaRutas}
        className="absolute inset-0 h-full w-full overflow-visible px-4 py-5 lg:py-2 lg:ps-[22%] lg:pe-6"
      >
        <defs>
          {/* Resplandor de la estela */}
          <filter id="tp-trail-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
          <clipPath id="tp-co-lens">
            <circle cx={LENS.x} cy={LENS.y} r={LENS.r} />
          </clipPath>
          {/* Mar gris muy claro, más luminoso arriba a la izquierda */}
          <radialGradient id="tp-co-sea" cx="32%" cy="28%" r="80%">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="0.6" stopColor="#F0F6F6" />
            <stop offset="1" stopColor="#E1E5EE" />
          </radialGradient>
          {/* Silueta de Colombia, una sola vez: el bloque la repite con <use> */}
          <path id="tp-co-shape" d={COLOMBIA_PATH} />
          <filter id="tp-co-blur" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
          <radialGradient id="tp-co-shade">
            <stop
              offset={LENS.r / (LENS.r + PAD) - 0.08}
              stopColor={`rgb(${INK})`}
              stopOpacity={0.18}
            />
            <stop offset="1" stopColor={`rgb(${INK})`} stopOpacity={0} />
          </radialGradient>
        </defs>

        {/* Sombra suave del círculo */}
        <circle cx={LENS.x} cy={LENS.y + 10} r={LENS.r + PAD} fill="url(#tp-co-shade)" />

        {/* Mar, países vecinos en negro carbón y Colombia en el color resaltado */}
        <g clipPath="url(#tp-co-lens)">
          <circle cx={LENS.x} cy={LENS.y} r={LENS.r} fill="url(#tp-co-sea)" />
          <path
            d={NEIGHBORS_PATH}
            fill={`rgba(${CHARCOAL},.82)`}
            stroke="rgba(255,255,255,.55)"
            strokeWidth={1.4}
            strokeLinejoin="round"
          />
          {/* Relieve 3D (prototipo, nov. 2026): Colombia sobresale como un bloque
              con sombra; la cara de arriba queda donde estaba, así carreteras,
              ciudades y camión no se mueven */}
          <use
            href="#tp-co-shape"
            transform={`translate(0 ${SLAB + 8})`}
            fill={`rgba(${INK},.4)`}
            filter="url(#tp-co-blur)"
          />
          {SLAB_STEPS.map((d) => (
            <use
              key={d}
              href="#tp-co-shape"
              transform={`translate(0 ${d})`}
              fill={wallColor(d / SLAB)}
            />
          ))}
          <path
            d={COLOMBIA_PATH}
            fill="rgb(223,219,244)"
            stroke="#1800AD"
            strokeWidth={3}
            strokeLinejoin="round"
          />
        </g>
        <circle
          cx={LENS.x}
          cy={LENS.y}
          r={LENS.r}
          fill="none"
          stroke={`rgba(${INK},.18)`}
          strokeWidth={2}
        />

        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          {/* Carreteras: borde blanco y vía gris oscuro, para que se lean sobre
              el naranja y la estela del viaje resalte */}
          {ROAD_PATHS.map((d) => (
            <path key={`c${d}`} d={d} stroke="#FFFFFF" strokeWidth={6} strokeOpacity={0.9} />
          ))}
          {ROAD_PATHS.map((d) => (
            <path key={`r${d}`} d={d} stroke={`rgba(${INK},.62)`} strokeWidth={2.8} />
          ))}
          {/* Estela del viaje: crece detrás del camión, con resplandor, borde
              blanco y vía naranja; encima, el brillo que la recorre */}
          {[
            { stroke: "#FF7619", width: 16, glow: true },
            { stroke: "#FFFFFF", width: 11 },
            { stroke: "#FF7619", width: 6.4 },
          ].map((s, i) => (
            <path
              key={`${journey.d}${i}`}
              ref={(el) => {
                trailRefs.current[i] = el;
              }}
              d={journey.d}
              stroke={s.stroke}
              strokeWidth={s.width}
              strokeDasharray={`0 ${journey.length + 1}`}
              filter={s.glow ? "url(#tp-trail-glow)" : undefined}
              strokeOpacity={s.glow ? 0.45 : undefined}
            />
          ))}
          <path
            key={`${journey.d}shine`}
            ref={shineRef}
            d={journey.d}
            stroke="#FFFFFF"
            strokeWidth={3}
            strokeOpacity={0.9}
            strokeDasharray={`0 ${journey.length + 1}`}
          />
        </g>

        {/* Ciudades */}
        {CITIES.map((c) =>
          c.main ? (
            <g key={c.id}>
              <circle cx={c.x} cy={c.y} r={7} className="pulse-ring fill-naranja/40" />
              <circle
                cx={c.x}
                cy={c.y}
                r={6}
                className="fill-naranja stroke-white"
                strokeWidth={2}
              />
            </g>
          ) : (
            <circle
              key={c.id}
              cx={c.x}
              cy={c.y}
              r={4.2}
              className="fill-white stroke-texto"
              strokeWidth={2}
            />
          ),
        )}

        {/* Onda al llegar */}
        {arrived && (
          <g key={`ripple${trip.from}${trip.to}`}>
            {[0, 350].map((delay) => (
              <circle
                key={delay}
                cx={to.x}
                cy={to.y}
                r={10}
                fill="none"
                stroke="#FF7619"
                strokeWidth={2.5}
                className="map-ripple motion-reduce:hidden"
                style={{ animationDelay: `${delay}ms` }}
              />
            ))}
          </g>
        )}

        {/* Origen y destino: casa en un marcador (con la misma clave por
            ciudad, así la casa del destino se vuelve el nuevo origen) */}
        <HomePin key={from.id} node={from} origin anim={phase === "leaving" ? "out" : undefined} />
        <HomePin
          key={to.id}
          node={to}
          origin={false}
          anim={phase === "start" ? "in" : phase === "arrived" ? "arrive" : undefined}
        />

        {/* Camión */}
        <g ref={truckRef} transform={firstTransform}>
          <Truck />
        </g>

        {/* Nombres, encima de todo y con borde blanco para que se lean */}
        {CITIES.map((c) => {
          const l = LABEL[c.side ?? "right"];
          const end = c.id === trip.from || c.id === trip.to;
          return (
            <text
              key={c.id}
              x={c.x}
              y={c.y}
              dx={l.dx}
              dy={l.dy}
              textAnchor={l.anchor}
              paintOrder="stroke"
              stroke="#FFFFFF"
              strokeWidth={4}
              strokeLinejoin="round"
              className={`font-body text-[30px] sm:text-[24px] lg:text-[19px] ${
                c.main || end ? "fill-azul font-bold" : "fill-texto font-semibold"
              }`}
            >
              {c.name}
            </text>
          );
        })}

        {/* Avisos del viaje, sobre la casa del destino */}
        <TripNotice
          key={`${trip.from}${trip.to}${arrived ? "a" : "s"}`}
          node={to}
          phase={phase}
          text={arrived ? t.mapaLlegamos(to.name ?? "") : t.mapaProximo(to.name ?? "")}
        />
      </svg>
    </div>
  );
}

// Marcador con una casa, con la punta sobre la ciudad: azul en el origen y
// naranja (con un pulso) en el destino. "in": cae con un rebote; "arrive":
// salta al llegar el camión; "out": se encoge y desaparece.
function HomePin({
  node,
  origin,
  anim,
}: {
  node: RouteNode;
  origin: boolean;
  anim?: "in" | "arrive" | "out";
}) {
  return (
    <g transform={`translate(${node.x} ${node.y})`}>
      {!origin && <circle r={9} className="pulse-ring fill-naranja/40" />}
      <g className={`map-pin ${anim ? `map-pin-${anim}` : ""}`}>
        <path
          d="M0,0C-3.5,-5 -11,-10 -11,-18A11,11 0 1 1 11,-18C11,-10 3.5,-5 0,0Z"
          stroke="#FFFFFF"
          strokeWidth={2}
          strokeLinejoin="round"
          className={`drop-shadow-[0_2px_3px_rgba(29,32,80,.35)] transition-colors duration-700 ${
            origin ? "fill-azul" : "fill-naranja"
          }`}
        />
        <path d="M-5.6,-17.2L0,-22.6L5.6,-17.2V-12.6H1.8V-15.6H-1.8V-12.6H-5.6Z" fill="#FFFFFF" />
      </g>
    </g>
  );
}

// Aviso sobre la casa del destino: "Próximo destino" (blanco) al salir y
// "¡Llegamos!" (azul, con un visto) al llegar. Siempre encima de la casa: en
// las ciudades del norte se sale del recuadro del mapa hacia el margen (el SVG
// lo deja ver), sin tapar los nombres de la costa. Medidas en em para que
// crezca con la letra en celular. Se ve solo en esos momentos y nunca con
// movimiento reducido.
function TripNotice({ node, phase, text }: { node: RouteNode; phase: TripPhase; text: string }) {
  const arrived = phase === "arrived" || phase === "leaving";
  // Fuera de esos momentos se desvanece (no desaparece de golpe)
  const shown = phase === "start" || phase === "arrived";
  const w = text.length * 0.6 + 2.6;
  return (
    <g
      transform={`translate(${node.x} ${node.y - 34})`}
      className={`font-body text-[27px] font-semibold transition-opacity duration-500 motion-reduce:hidden sm:text-[22px] lg:text-[17px] ${
        shown ? "opacity-100" : "opacity-0"
      }`}
    >
      <g className="map-popup">
        <rect
          x={`${-w / 2}em`}
          y="-2em"
          width={`${w}em`}
          height="2em"
          rx="1em"
          className={`drop-shadow-[0_6px_10px_rgba(29,32,80,.28)] ${arrived ? "fill-azul" : "fill-white"}`}
        />
        <svg x={`${-w / 2 + 0.4}em`} y="-1.6em" width="1.2em" height="1.2em" viewBox="0 0 16 16">
          <circle cx={8} cy={8} r={8} fill="#FF7619" />
          {arrived ? (
            <path
              d="M4.4,8.3L7,10.8L11.8,5.6"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            <path d="M4.2,8L8,4.6L11.8,8V11.6H9.2V9.4H6.8V11.6H4.2Z" fill="#FFFFFF" />
          )}
        </svg>
        <text
          x={`${-w / 2 + 1.9}em`}
          y="-1em"
          dy="0.35em"
          className={arrived ? "fill-white" : "fill-azul"}
        >
          {text}
        </text>
      </g>
    </g>
  );
}

// Camión visto desde arriba, mirando a la derecha y centrado en la vía (el
// punto 0,0): furgón azul con la franja diagonal del logo (ancha, con su flecha
// y una línea delgada al lado) y cabina blanca con parabrisas azul. Así gira con
// las curvas sin tener que voltearse.
function Truck() {
  return (
    <g transform="scale(1.5)">
      <rect x={-14} y={-4.4} width={28} height={11} rx={2.2} fill="#1D2050" opacity={0.2} />
      <clipPath id="tp-truck-box">
        <rect x={-15} y={-5.5} width={19} height={11} rx={1.6} />
      </clipPath>
      <rect x={-15} y={-5.5} width={19} height={11} rx={1.6} fill="#272B7C" />
      {/* Franja diagonal del logo, de abajo a la izquierda hacia arriba a la derecha */}
      <g clipPath="url(#tp-truck-box)" fill="#FFFFFF">
        <path d="M-15.5,4.2L-1.6,-5.8H2.6L-11.3,4.2Z" />
        <path d="M-1.6,-5.8L3.6,-5.8L3.6,-1.2Z" />
        <path d="M-12.2,6.2L1.8,-3.8L2.3,-3.1L-11.7,6.9Z" />
      </g>
      <rect
        x={5}
        y={-4.8}
        width={8.4}
        height={9.6}
        rx={2.4}
        fill="#FFFFFF"
        stroke="#272B7C"
        strokeWidth={0.8}
      />
      <rect x={10.2} y={-3.6} width={2.2} height={7.2} rx={0.8} fill="#272B7C" />
      <rect x={8.6} y={-6.2} width={1.6} height={1.4} rx={0.4} fill="#272B7C" />
      <rect x={8.6} y={4.8} width={1.6} height={1.4} rx={0.4} fill="#272B7C" />
    </g>
  );
}
