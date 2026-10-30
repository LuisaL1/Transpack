// Datos del globo de la portada (Globe.tsx), generados de Natural Earth
// (world-atlas, 1:110m): `pnpm map`.
// - src/data/worldMap.ts: Bogotá y los destinos (capitales) con su longitud y latitud.
// - src/data/worldGlobe.ts: siluetas de los países (topojson) marcadas por zona:
//   resto del mundo, regiones donde opera, Estados Unidos y Colombia. Se carga
//   aparte (import()) para no pesar en el JS principal.
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
// Recorrido por Colombia al empezar la animación de la portada: capitales de
// departamento principales (Bogotá primero; las rutas salen de ella, en este
// orden). "side": dónde va el nombre para que no se monten.
const CITIES = [
  { name: "Bogotá", lonlat: [-74.07, 4.71], side: "right" },
  { name: "Medellín", lonlat: [-75.57, 6.25], side: "left" },
  { name: "Cali", lonlat: [-76.53, 3.45], side: "left" },
  { name: "Barranquilla", lonlat: [-74.8, 10.96], side: "left" },
  { name: "Cartagena", lonlat: [-75.51, 10.39], side: "left" },
  { name: "Cúcuta", lonlat: [-72.5, 7.89], side: "right" },
  { name: "Bucaramanga", lonlat: [-73.12, 7.12], side: "right" },
  { name: "Ibagué", lonlat: [-75.23, 4.44], side: "below" },
  { name: "Santa Marta", lonlat: [-74.2, 11.24], side: "right" },
  { name: "Villavicencio", lonlat: [-73.63, 4.14], side: "below" },
  { name: "Pereira", lonlat: [-75.69, 4.81], side: "left" },
  { name: "Pasto", lonlat: [-77.28, 1.21], side: "left" },
  { name: "Montería", lonlat: [-75.88, 8.75], side: "left" },
  { name: "Neiva", lonlat: [-75.28, 2.93], side: "right" },
];
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
  // Más capitales de Suramérica y África (regiones donde opera)
  { id: "218", name: "Ecuador", lonlat: [-78.47, -0.18] },
  { id: "862", name: "Venezuela", lonlat: [-66.9, 10.49] },
  { id: "068", name: "Bolivia", lonlat: [-68.15, -16.5] },
  { id: "600", name: "Paraguay", lonlat: [-57.58, -25.26] },
  { id: "858", name: "Uruguay", lonlat: [-56.16, -34.9] },
  { id: "686", name: "Senegal", lonlat: [-17.45, 14.69] },
  { id: "288", name: "Ghana", lonlat: [-0.19, 5.6] },
  { id: "024", name: "Angola", lonlat: [13.23, -8.84] },
  { id: "231", name: "Etiopía", lonlat: [38.75, 9.03] },
  // Resto de Latinoamérica (pedido del cliente: todos los países)
  { id: "320", name: "Guatemala", lonlat: [-90.51, 14.63], region: "america" },
  { id: "084", name: "Belice", lonlat: [-88.77, 17.25], region: "america" },
  { id: "340", name: "Honduras", lonlat: [-87.21, 14.07], region: "america" },
  { id: "222", name: "El Salvador", lonlat: [-89.19, 13.69], region: "america" },
  { id: "558", name: "Nicaragua", lonlat: [-86.25, 12.13], region: "america" },
  { id: "188", name: "Costa Rica", lonlat: [-84.09, 9.93], region: "america" },
  { id: "591", name: "Panamá", lonlat: [-79.52, 8.98], region: "america" },
  { id: "192", name: "Cuba", lonlat: [-82.37, 23.11], region: "america" },
  { id: "214", name: "República Dominicana", lonlat: [-69.93, 18.49], region: "america" },
  { id: "332", name: "Haití", lonlat: [-72.34, 18.54], region: "america" },
  { id: "630", name: "Puerto Rico", lonlat: [-66.11, 18.47], region: "america" },
  { id: "328", name: "Guyana", lonlat: [-58.16, 6.8], region: "america" },
  { id: "740", name: "Surinam", lonlat: [-55.2, 5.85], region: "america" },
  // Europa: países principales (pedido del cliente); el resto queda implícito,
  // sombreado como región donde opera pero sin ruta ni nombre (EUROPE_REST)
  { id: "620", name: "Portugal", lonlat: [-9.14, 38.72], region: "europa" },
  { id: "826", name: "Reino Unido", lonlat: [-0.13, 51.51], region: "europa" },
  { id: "528", name: "Países Bajos", lonlat: [4.9, 52.37], region: "europa" },
  { id: "756", name: "Suiza", lonlat: [7.45, 46.95], region: "europa" },
  { id: "752", name: "Suecia", lonlat: [18.07, 59.33], region: "europa" },
  { id: "616", name: "Polonia", lonlat: [21.01, 52.23], region: "europa" },
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
// Resto de Europa: sin ruta ni nombre en la animación, pero sombreado como
// región donde opera (sin Rusia ni el Vaticano)
const EUROPE_REST = [
  "372", // Irlanda,
  "056", // Bélgica,
  "442", // Luxemburgo,
  "040", // Austria,
  "208", // Dinamarca,
  "578", // Noruega,
  "246", // Finlandia,
  "352", // Islandia,
  "203", // Chequia,
  "703", // Eslovaquia,
  "348", // Hungría,
  "705", // Eslovenia,
  "191", // Croacia,
  "070", // Bosnia y Herzegovina,
  "688", // Serbia,
  "499", // Montenegro,
  "008", // Albania,
  "807", // Macedonia del Norte,
  "300", // Grecia,
  "100", // Bulgaria,
  "642", // Rumania,
  "498", // Moldavia,
  "804", // Ucrania,
  "112", // Bielorrusia,
  "440", // Lituania,
  "428", // Letonia,
  "233", // Estonia,
  "470", // Malta,
  "196", // Chipre,
  "020", // Andorra,
  "492", // Mónaco,
  "438", // Liechtenstein,
  "674", // San Marino,
];
const hotIds = new Set([
  ...DEST.map((d) => d.id),
  ...SOUTH_AMERICA,
  ...AFRICA,
  ...ASIA,
  ...EUROPE_REST,
]);
// Continente de cada destino: la animación de la portada los recorre en orden
// (América, Europa, África, Asia)
const NORTH_AMERICA = ["840", "124", "484"];
const EUROPE = ["724", "250", "276", "380"];
const regionOf = (d) =>
  d.region ??
  ([...NORTH_AMERICA, ...SOUTH_AMERICA].includes(d.id)
    ? "america"
    : EUROPE.includes(d.id)
      ? "europa"
      : AFRICA.includes(d.id)
        ? "africa"
        : "asia");
const keyOf = (f) => f.id ?? f.properties.name;

const USA_ID = "840";
// Zona de cada país: 0 resto del mundo, 1 donde opera, 2 Estados Unidos
// (principal mercado, se ilumina aparte: pedido del cliente), 3 Colombia
const zoneOf = (f) =>
  f.id === ORIGIN.id ? 3 : f.id === USA_ID ? 2 : hotIds.has(keyOf(f)) ? 1 : 0;

// Países con su zona (topojson de 1:110m, que comparte las fronteras y pesa
// poco) y Colombia en más detalle (1:50m) para verla de cerca al empezar
const topo = structuredClone(world);
topo.objects.countries.geometries = topo.objects.countries.geometries
  .filter((g) => g.id !== "010")
  .map((g) => ({
    type: g.type,
    arcs: g.arcs,
    id: g.id,
    properties: { z: zoneOf(countries.find((f) => keyOf(f) === (g.id ?? g.properties.name))) },
  }));
delete topo.objects.land;
const world50 = require("world-atlas/countries-50m.json");
const round = (c) => (typeof c[0] === "number" ? c.map((v) => +v.toFixed(3)) : c.map(round));
const co = feature(world50, world50.objects.countries).features.find((f) => f.id === ORIGIN.id);
const colombia = { type: co.geometry.type, coordinates: round(co.geometry.coordinates) };

const ll = ([lon, lat]) => `lon: ${lon}, lat: ${lat}`;
const map = `// Bogotá y los destinos con ruta en el globo de la portada. GENERADO con
// \`pnpm map\` (scripts/generate-world-map.mjs): no editar a mano.

export const ORIGIN = { name: "${ORIGIN.name}", ${ll(ORIGIN.lonlat)} };

/** Recorrido por Colombia al empezar la animación de la portada: capitales de
 * departamento principales; las rutas salen de Bogotá en este orden */
export const CITIES = [
${CITIES.map((c) => `  { name: "${c.name}", ${ll(c.lonlat)}, side: "${c.side}" as const },`).join("\n")}
];

/** Destinos con ruta en el globo (capitales). "embassy": país donde Transpack ha
 * atendido embajadas; "region": continente (america, europa, africa o asia) */
export const DESTINATIONS = [
${DEST.map((d) => `  { name: "${d.name}", ${ll(d.lonlat)}, embassy: ${!!d.embassy}, region: "${regionOf(d)}" },`).join("\n")}
];
`;
const globe = `// Países del globo de la portada. GENERADO con \`pnpm map\`
// (scripts/generate-world-map.mjs): no editar a mano.
// WORLD: topojson de Natural Earth 1:110m; "z" es la zona de cada país (0 resto
// del mundo, 1 regiones donde opera, 2 Estados Unidos, 3 Colombia).
// COLOMBIA: silueta de 1:50m para el acercamiento inicial.
export const WORLD = ${JSON.stringify(topo)};
export const COLOMBIA = ${JSON.stringify(colombia)};
`;
fs.writeFileSync(`${outDir}/worldMap.ts`, map);
fs.writeFileSync(`${outDir}/worldGlobe.ts`, globe);
console.log("países", topo.objects.countries.geometries.length, "bytes", globe.length);
