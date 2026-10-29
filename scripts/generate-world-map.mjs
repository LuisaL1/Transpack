// Datos del globo de la portada (Globe.tsx), generados de Natural Earth
// (world-atlas, 1:110m): `pnpm map`.
// - src/data/worldMap.ts: Bogotá y los destinos (capitales) con su longitud y latitud.
// - src/data/worldGlobe.ts: puntos de tierra sobre la esfera (el globo se dibuja
//   con puntos, como luces), marcados por zona: resto del mundo, regiones donde
//   opera, Estados Unidos y Colombia. Se carga aparte (import()) para no pesar en
//   el JS principal.
import { geoBounds, geoContains } from "d3-geo";
import { feature } from "topojson-client";
import { createRequire } from "module";
import fs from "fs";
const require = createRequire(import.meta.url);
const world = require("world-atlas/countries-110m.json");
const countries = feature(world, world.objects.countries).features.filter((f) => f.id !== "010"); // sin Antártida
const outDir = process.argv[2] ?? "src/data";

// Destinos con ruta y nombre en el mapa (capital de cada país) + origen.
// "embassy": países donde Transpack ha atendido embajadas (blog #3); el resto
// son destinos de las regiones donde opera (Suramérica, África y Asia).
// Se intercalan por región para que la animación recorra todo el mapa.
const ORIGIN = { id: "170", name: "Bogotá, Colombia", lonlat: [-74.07, 4.71] };
const DEST = [
  { id: "840", name: "Estados Unidos", lonlat: [-77.04, 38.9], embassy: true },
  { id: "076", name: "Brasil", lonlat: [-47.88, -15.79] },
  { id: "724", name: "España", lonlat: [-3.7, 40.42], embassy: true },
  { id: "710", name: "Sudáfrica", lonlat: [28.19, -25.75] },
  { id: "156", name: "China", lonlat: [116.4, 39.9] },
  { id: "124", name: "Canadá", lonlat: [-75.7, 45.42], embassy: true },
  { id: "032", name: "Argentina", lonlat: [-58.38, -34.6] },
  { id: "250", name: "Francia", lonlat: [2.35, 48.86], embassy: true },
  { id: "566", name: "Nigeria", lonlat: [7.49, 9.06] },
  { id: "392", name: "Japón", lonlat: [139.69, 35.69] },
  { id: "484", name: "México", lonlat: [-99.13, 19.43], embassy: true },
  { id: "152", name: "Chile", lonlat: [-70.67, -33.45] },
  { id: "276", name: "Alemania", lonlat: [13.4, 52.52], embassy: true },
  { id: "404", name: "Kenia", lonlat: [36.82, -1.29] },
  { id: "410", name: "Corea del Sur", lonlat: [126.98, 37.57] },
  { id: "604", name: "Perú", lonlat: [-77.04, -12.05] },
  { id: "380", name: "Italia", lonlat: [12.5, 41.9], embassy: true },
  { id: "504", name: "Marruecos", lonlat: [-6.84, 34.02] },
  { id: "682", name: "Arabia Saudita", lonlat: [46.72, 24.71] },
  { id: "818", name: "Egipto", lonlat: [31.24, 30.04], embassy: true },
  { id: "764", name: "Tailandia", lonlat: [100.5, 13.75] },
  { id: "784", name: "Emiratos Árabes", lonlat: [54.37, 24.45], embassy: true },
  { id: "356", name: "India", lonlat: [77.21, 28.61], embassy: true },
];
// Regiones donde Transpack opera, que también se iluminan (código ISO 3166
// numérico; los territorios sin código en Natural Earth van por nombre).
const SOUTH_AMERICA = [
  "032",
  "068",
  "076",
  "152",
  "218",
  "238",
  "328",
  "600",
  "604",
  "740",
  "858",
  "862",
];
const AFRICA = [
  "012",
  "024",
  "072",
  "108",
  "120",
  "140",
  "148",
  "178",
  "180",
  "204",
  "226",
  "231",
  "232",
  "262",
  "266",
  "270",
  "288",
  "324",
  "384",
  "404",
  "426",
  "430",
  "434",
  "450",
  "454",
  "466",
  "478",
  "504",
  "508",
  "516",
  "562",
  "566",
  "624",
  "646",
  "686",
  "694",
  "706",
  "710",
  "716",
  "728",
  "729",
  "732",
  "748",
  "768",
  "788",
  "800",
  "818",
  "834",
  "854",
  "894",
  "Somaliland",
];
// Asia: todos los países menos Irán (364) y Rusia (643)
const ASIA = [
  "004",
  "031",
  "050",
  "051",
  "064",
  "096",
  "104",
  "116",
  "144",
  "156",
  "158",
  "196",
  "268",
  "275",
  "356",
  "360",
  "368",
  "376",
  "392",
  "398",
  "400",
  "408",
  "410",
  "414",
  "417",
  "418",
  "422",
  "458",
  "496",
  "512",
  "524",
  "586",
  "608",
  "626",
  "634",
  "682",
  "704",
  "760",
  "762",
  "764",
  "784",
  "792",
  "795",
  "860",
  "887",
  "N. Cyprus",
];
const hotIds = new Set([...DEST.map((d) => d.id), ...SOUTH_AMERICA, ...AFRICA, ...ASIA]);
const keyOf = (f) => f.id ?? f.properties.name;

const USA_ID = "840";
// Zona de cada país: 0 resto del mundo, 1 donde opera, 2 Estados Unidos
// (principal mercado, se ilumina aparte: pedido del cliente), 3 Colombia
const zoneOf = (f) =>
  f.id === ORIGIN.id ? 3 : f.id === USA_ID ? 2 : hotIds.has(keyOf(f)) ? 1 : 0;

// Rejilla casi uniforme sobre la esfera: cada STEP grados de latitud, y en
// longitud más espaciada cerca del ecuador que en los polos
const STEP = 1.5;
const boxes = countries.map((f) => ({ f, b: geoBounds(f), zone: zoneOf(f) }));
const inBox = ([lon, lat], [[x0, y0], [x1, y1]]) =>
  lat >= y0 && lat <= y1 && (x0 <= x1 ? lon >= x0 && lon <= x1 : lon >= x0 || lon <= x1);
const dots = [];
for (let lat = -56; lat <= 82; lat += STEP) {
  const step = STEP / Math.max(Math.cos((lat * Math.PI) / 180), 0.2);
  for (let lon = -180; lon < 180; lon += step) {
    const p = [lon, lat];
    const hit = boxes.find(({ f, b }) => inBox(p, b) && geoContains(f, p));
    if (hit) dots.push(Math.round(lon * 10), Math.round(lat * 10), hit.zone);
  }
}

const ll = ([lon, lat]) => `lon: ${lon}, lat: ${lat}`;
const map = `// Bogotá y los destinos con ruta en el globo de la portada. GENERADO con
// \`pnpm map\` (scripts/generate-world-map.mjs): no editar a mano.

export const ORIGIN = { name: "${ORIGIN.name}", ${ll(ORIGIN.lonlat)} };

/** Destinos con ruta en el globo (capitales). "embassy": país donde Transpack ha atendido embajadas */
export const DESTINATIONS = [
${DEST.map((d) => `  { name: "${d.name}", ${ll(d.lonlat)}, embassy: ${!!d.embassy} },`).join("\n")}
];
`;
const globe = `// Puntos de tierra del globo de la portada. GENERADO con \`pnpm map\`
// (scripts/generate-world-map.mjs): no editar a mano.
// De tres en tres: longitud × 10, latitud × 10 y zona (0 resto del mundo,
// 1 regiones donde opera, 2 Estados Unidos, 3 Colombia).
export const LAND_DOTS = [${dots.join(",")}];
`;
fs.writeFileSync(`${outDir}/worldMap.ts`, map);
fs.writeFileSync(`${outDir}/worldGlobe.ts`, globe);
console.log("puntos", dots.length / 3, "bytes", globe.length);
