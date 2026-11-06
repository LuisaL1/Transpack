// Datos del mapa de rutas de Mudanzas nacionales (ColombiaRoutesMap.tsx),
// generados de Natural Earth (world-atlas, 1:10m): `pnpm map`.
// - Silueta de Colombia continental y de los países vecinos (recortados al mapa).
// - Ciudades principales y cruces de carreteras, ya proyectados (Mercator).
// - Carreteras: cada una pasa por los pueblos reales de la troncal que la
//   recorre, para que el trazado se parezca al de la vía. Las curvas y el
//   movimiento de los camiones se calculan en src/lib/colombiaRoutes.ts.
import { feature, merge } from "topojson-client";
import { geoMercator, geoPath } from "d3-geo";
import { createRequire } from "module";
import fs from "fs";
const require = createRequire(import.meta.url);
const world = require("world-atlas/countries-10m.json");
const countries = feature(world, world.objects.countries).features;
const outDir = process.argv[2] ?? "src/data";

// Colombia continental: sin San Andrés, Providencia ni Malpelo (lejos en el mar)
const colombia = countries.find((f) => f.id === "170");
const mainland = {
  type: "Feature",
  properties: {},
  geometry: {
    type: "MultiPolygon",
    coordinates: colombia.geometry.coordinates.filter((poly) =>
      poly[0].every(([lon]) => lon > -79.6),
    ),
  },
};

// Ciudades (capitales de departamento principales, las mismas del recorrido
// de la portada) y cruces sin nombre donde se unen las carreteras.
// "side": dónde va el nombre para que no se monte con otro.
const NODES = [
  { id: "bogota", name: "Bogotá", lonlat: [-74.07, 4.71], side: "right", main: true },
  { id: "medellin", name: "Medellín", lonlat: [-75.57, 6.25], side: "left" },
  { id: "cali", name: "Cali", lonlat: [-76.53, 3.45], side: "left" },
  { id: "barranquilla", name: "Barranquilla", lonlat: [-74.8, 10.96], side: "left" },
  { id: "cartagena", name: "Cartagena", lonlat: [-75.51, 10.39], side: "left" },
  { id: "cucuta", name: "Cúcuta", lonlat: [-72.5, 7.89], side: "right" },
  { id: "bucaramanga", name: "Bucaramanga", lonlat: [-73.12, 7.12], side: "right" },
  { id: "ibague", name: "Ibagué", lonlat: [-75.23, 4.44], side: "below" },
  { id: "santamarta", name: "Santa Marta", lonlat: [-74.2, 11.24], side: "right" },
  { id: "villavicencio", name: "Villavicencio", lonlat: [-73.63, 4.14], side: "right" },
  { id: "pereira", name: "Pereira", lonlat: [-75.69, 4.81], side: "left" },
  { id: "pasto", name: "Pasto", lonlat: [-77.28, 1.21], side: "right" },
  { id: "monteria", name: "Montería", lonlat: [-75.88, 8.75], side: "left" },
  { id: "neiva", name: "Neiva", lonlat: [-75.28, 2.93], side: "right" },
  // Cruces
  { id: "espinal", lonlat: [-74.88, 4.15] },
  { id: "armenia", lonlat: [-75.68, 4.53] },
  { id: "planetarica", lonlat: [-75.59, 8.41] },
  { id: "cienaga", lonlat: [-74.25, 11.01] },
];

// Carreteras entre ciudades y cruces, con los pueblos por los que pasan
const ROADS = [
  // Autopista Medellín–Bogotá: Villeta, Guaduas, Honda, Puerto Triunfo, Santuario
  {
    from: "bogota",
    to: "medellin",
    via: [
      [-74.35, 4.81],
      [-74.47, 5.01],
      [-74.6, 5.07],
      [-74.73, 5.2],
      [-74.65, 5.47],
      [-74.64, 5.87],
      [-74.72, 5.9],
      [-74.99, 6.04],
      [-75.27, 6.14],
      [-75.34, 6.17],
      [-75.38, 6.15],
    ],
  },
  // Bogotá–Girardot–Espinal: Soacha, Fusagasugá, Melgar, Girardot
  {
    from: "bogota",
    to: "espinal",
    via: [
      [-74.22, 4.58],
      [-74.36, 4.34],
      [-74.64, 4.2],
      [-74.8, 4.3],
    ],
  },
  { from: "espinal", to: "ibague", via: [[-75.03, 4.24]] },
  // Ruta 45 por el valle del Magdalena: Guamo, Saldaña, Natagaima, Aipe
  {
    from: "espinal",
    to: "neiva",
    via: [
      [-74.97, 4.03],
      [-74.99, 3.93],
      [-75.09, 3.62],
      [-75.24, 3.22],
    ],
  },
  // Bogotá–Villavicencio: Chipaque, Cáqueza, Guayabetal
  {
    from: "bogota",
    to: "villavicencio",
    via: [
      [-74.04, 4.44],
      [-73.95, 4.4],
      [-73.82, 4.22],
      [-73.7, 4.17],
    ],
  },
  // Ibagué–Armenia por La Línea: Cajamarca, Calarcá
  {
    from: "ibague",
    to: "armenia",
    via: [
      [-75.43, 4.44],
      [-75.53, 4.5],
      [-75.64, 4.53],
    ],
  },
  { from: "armenia", to: "pereira", via: [[-75.67, 4.67]] },
  // Armenia–Cali: La Tebaida, La Paila, Tuluá, Buga, Palmira
  {
    from: "armenia",
    to: "cali",
    via: [
      [-75.79, 4.45],
      [-75.98, 4.32],
      [-76.2, 4.08],
      [-76.3, 3.9],
      [-76.3, 3.53],
    ],
  },
  // Troncal de Occidente al norte: Santa Rosa, Chinchiná, Irra, Supía,
  // La Pintada, Santa Bárbara, Caldas
  {
    from: "pereira",
    to: "medellin",
    via: [
      [-75.62, 4.87],
      [-75.61, 4.98],
      [-75.67, 5.27],
      [-75.65, 5.45],
      [-75.61, 5.75],
      [-75.57, 5.87],
      [-75.63, 6.09],
    ],
  },
  // Panamericana: Jamundí, Santander de Quilichao, Popayán, El Bordo,
  // Remolino, Chachagüí
  {
    from: "cali",
    to: "pasto",
    via: [
      [-76.54, 3.26],
      [-76.48, 3.01],
      [-76.53, 2.64],
      [-76.61, 2.44],
      [-76.68, 2.35],
      [-76.98, 2.11],
      [-77.33, 1.71],
      [-77.28, 1.36],
    ],
  },
  // Troncal de Occidente: Bello, Don Matías, Santa Rosa de Osos, Yarumal,
  // Valdivia, Tarazá, Caucasia, La Apartada
  {
    from: "medellin",
    to: "planetarica",
    via: [
      [-75.56, 6.34],
      [-75.39, 6.48],
      [-75.46, 6.64],
      [-75.42, 6.96],
      [-75.44, 7.16],
      [-75.4, 7.58],
      [-75.2, 7.99],
      [-75.34, 8.2],
    ],
  },
  { from: "planetarica", to: "monteria", via: [[-75.74, 8.6]] },
  // Sahagún, Sincelejo, Corozal, El Carmen de Bolívar, San Juan Nepomuceno,
  // Arjona, Turbaco
  {
    from: "planetarica",
    to: "cartagena",
    via: [
      [-75.44, 8.95],
      [-75.4, 9.3],
      [-75.29, 9.32],
      [-75.12, 9.72],
      [-75.08, 9.95],
      [-75.34, 10.25],
      [-75.41, 10.33],
    ],
  },
  // Vía al Mar: Santa Catalina, Tubará
  {
    from: "cartagena",
    to: "barranquilla",
    via: [
      [-75.4, 10.5],
      [-75.29, 10.61],
      [-75.12, 10.77],
      [-74.95, 10.93],
    ],
  },
  // Barranquilla–Ciénaga por la Isla de Salamanca
  {
    from: "barranquilla",
    to: "cienaga",
    via: [
      [-74.75, 10.99],
      [-74.6, 10.99],
      [-74.45, 10.99],
      [-74.36, 10.98],
    ],
  },
  { from: "cienaga", to: "santamarta", via: [[-74.22, 11.12]] },
  // Ruta del Sol / Ruta 45: Fundación, Bosconia, Curumaní, Pailitas,
  // Aguachica, San Alberto
  {
    from: "cienaga",
    to: "bucaramanga",
    via: [
      [-74.15, 10.75],
      [-74.19, 10.52],
      [-73.89, 9.98],
      [-73.71, 9.62],
      [-73.54, 9.2],
      [-73.62, 8.96],
      [-73.62, 8.31],
      [-73.39, 7.76],
      [-73.32, 7.52],
      [-73.17, 7.3],
    ],
  },
  // Bucaramanga–Cúcuta: Berlín, Pamplona, Los Patios
  {
    from: "bucaramanga",
    to: "cucuta",
    via: [
      [-72.97, 7.15],
      [-72.88, 7.19],
      [-72.65, 7.38],
      [-72.64, 7.5],
      [-72.6, 7.65],
      [-72.51, 7.84],
    ],
  },
  // Troncal Central: Briceño, Chocontá, Tunja, Barbosa, Socorro, San Gil,
  // Piedecuesta
  {
    from: "bogota",
    to: "bucaramanga",
    via: [
      [-73.93, 4.95],
      [-73.69, 5.15],
      [-73.6, 5.22],
      [-73.36, 5.54],
      [-73.44, 5.76],
      [-73.62, 5.93],
      [-73.3, 6.26],
      [-73.26, 6.47],
      [-73.13, 6.56],
      [-73.04, 6.79],
      [-73.05, 6.99],
      [-73.09, 7.06],
    ],
  },
];

// Proyección ajustada a Colombia continental; el mapa queda con un margen
const W = 600;
const projection = geoMercator().fitWidth(W - 40, mainland);
const [[x0, y0], [x1, y1]] = geoPath(projection).bounds(mainland);
const PAD = 12;
const box = [x0 - PAD, y0 - PAD, x1 - x0 + PAD * 2, y1 - y0 + PAD * 2].map((v) => Math.round(v));
// La tierra de alrededor se dibuja también fuera del recuadro (el SVG deja ver
// lo que sobra y su contenedor lo recorta), para que no termine en un borde recto
const BLEED = 260;
projection.clipExtent([
  [box[0] - BLEED, box[1] - BLEED],
  [box[0] + box[2] + BLEED, box[1] + box[3] + BLEED],
]);

const r1 = (v) => Math.round(v * 10) / 10;
const xy = (lonlat) => projection(lonlat).map(r1);

// Trazo SVG con puntos a más de `tol` unidades (aligera la silueta); se omiten
// las islas de menos de `min` unidades, que a este tamaño no se ven
function svgPath(geo, tol, min) {
  let d = "";
  let ring = [];
  let last = null;
  const flush = () => {
    const xs = ring.map((p) => p[0]);
    const ys = ring.map((p) => p[1]);
    const size = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
    if (ring.length >= 3 && size >= min) d += "M" + ring.map((p) => p.join(",")).join("L") + "Z";
    ring = [];
  };
  const ctx = {
    moveTo(x, y) {
      flush();
      ring = [[r1(x), r1(y)]];
      last = [x, y];
    },
    lineTo(x, y) {
      if (Math.hypot(x - last[0], y - last[1]) < tol) return;
      ring.push([r1(x), r1(y)]);
      last = [x, y];
    },
    closePath: flush,
    arc() {},
  };
  geoPath(projection, ctx)(geo);
  flush();
  return d;
}

// Fondo: los demás países (1:50m, unidos sin fronteras entre ellos: basta de
// referencia y pesa poco). Sin Colombia, para que su silueta exacta (1:10m)
// no deje ver la tierra de menor detalle por fuera de su costa.
const world50 = require("world-atlas/countries-50m.json");
const neighbors = merge(
  world50,
  world50.objects.countries.geometries.filter((g) => g.id !== "170"),
);

const nodes = NODES.map(({ lonlat, ...n }) => ({ ...n, x: xy(lonlat)[0], y: xy(lonlat)[1] }));
const at = Object.fromEntries(NODES.map((n) => [n.id, n.lonlat]));
const roads = ROADS.map((r) => ({
  from: r.from,
  to: r.to,
  points: [at[r.from], ...r.via, at[r.to]].map(xy),
}));

const out = `// GENERADO con \`pnpm map\` (scripts/generate-colombia-map.mjs). No editar a mano.
// Natural Earth 1:10m (world-atlas), proyección Mercator.
import type { RoadData, RouteNode } from "@/lib/colombiaRoutes";

export const COLOMBIA_VIEWBOX = "${box.join(" ")}";

export const COLOMBIA_PATH =
  "${svgPath(mainland, 2, 3)}";

export const NEIGHBORS_PATH =
  "${svgPath(neighbors, 4, 14)}";

export const ROUTE_NODES: RouteNode[] = ${JSON.stringify(nodes)};

export const ROADS: RoadData[] = ${JSON.stringify(roads)};
`;
fs.writeFileSync(`${outDir}/colombiaMap.ts`, out);
console.log(
  `colombiaMap.ts: ${(out.length / 1024).toFixed(1)} KB, ${nodes.length} puntos, ${roads.length} carreteras`,
);
