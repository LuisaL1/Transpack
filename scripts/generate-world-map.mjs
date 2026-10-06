import { geoNaturalEarth1, geoContains, geoBounds } from "d3-geo";
import { feature } from "topojson-client";
import { createRequire } from "module";
import fs from "fs";
const require = createRequire(import.meta.url);
const world = require("world-atlas/countries-110m.json");
const countries = feature(world, world.objects.countries).features.filter((f) => f.id !== "010"); // sin Antártida

const W = 1000,
  H = 500,
  STEP = 7.2;
const proj = geoNaturalEarth1().fitExtent(
  [
    [0, 8],
    [W, H - 8],
  ],
  { type: "FeatureCollection", features: countries },
);

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
const bounds = countries.map((f) => geoBounds(f));

let base = "",
  hot = "",
  origin = "",
  n = 0;
for (let y = STEP / 2; y < H; y += STEP) {
  for (let x = STEP / 2; x < W; x += STEP) {
    const ll = proj.invert([x, y]);
    if (!ll || !isFinite(ll[0])) continue;
    let hit = null;
    for (let i = 0; i < countries.length; i++) {
      const [[x0, y0], [x1, y1]] = bounds[i];
      const inLon = x0 <= x1 ? ll[0] >= x0 && ll[0] <= x1 : ll[0] >= x0 || ll[0] <= x1;
      if (!inLon || ll[1] < y0 || ll[1] > y1) continue;
      if (geoContains(countries[i], ll)) {
        hit = countries[i];
        break;
      }
    }
    if (!hit) continue;
    n++;
    const seg = `M${x.toFixed(1)} ${y.toFixed(1)}h0`;
    if (hit.id === ORIGIN.id) origin += seg;
    else if (hotIds.has(keyOf(hit))) hot += seg;
    else base += seg;
  }
}
const pt = (ll) => proj(ll).map((v) => +v.toFixed(1));
const out = `// Mapa mundial de puntos, generado a partir de Natural Earth (world-atlas, 1:110m)
// con proyección Natural Earth. No editar a mano: los puntos están precalculados.
// Para cambiar los países resaltados hay que regenerar el archivo.

export const MAP_W = ${W};
export const MAP_H = ${H};

/** Puntos de tierra (resto del mundo) */
export const DOTS_BASE = "${base}";
/** Puntos de los países y regiones con operación (destinos, Suramérica, África y Asia) */
export const DOTS_HOT = "${hot}";
/** Puntos de Colombia */
export const DOTS_ORIGIN = "${origin}";

export const ORIGIN = { name: "${ORIGIN.name}", x: ${pt(ORIGIN.lonlat)[0]}, y: ${pt(ORIGIN.lonlat)[1]} };

/** Destinos con ruta en el mapa (capitales). "embassy": país donde Transpack ha atendido embajadas */
export const DESTINATIONS = [
${DEST.map((d) => {
  const [x, y] = pt(d.lonlat);
  return `  { name: "${d.name}", x: ${x}, y: ${y}, embassy: ${!!d.embassy} },`;
}).join("\n")}
];
`;
fs.writeFileSync(process.argv[2], out);
console.log("dots", n, "bytes", out.length);
