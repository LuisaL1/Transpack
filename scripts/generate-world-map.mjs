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

// Países con operación destacada (embajadas atendidas, según el blog #3) + origen
const ORIGIN = { id: "170", name: "Bogotá, Colombia", lonlat: [-74.07, 4.71] };
const DEST = [
  { id: "840", name: "Estados Unidos", lonlat: [-77.04, 38.9] },
  { id: "124", name: "Canadá", lonlat: [-75.7, 45.42] },
  { id: "484", name: "México", lonlat: [-99.13, 19.43] },
  { id: "724", name: "España", lonlat: [-3.7, 40.42] },
  { id: "250", name: "Francia", lonlat: [2.35, 48.86] },
  { id: "276", name: "Alemania", lonlat: [13.4, 52.52] },
  { id: "380", name: "Italia", lonlat: [12.5, 41.9] },
  { id: "818", name: "Egipto", lonlat: [31.24, 30.04] },
  { id: "784", name: "Emiratos Árabes", lonlat: [54.37, 24.45] },
  { id: "356", name: "India", lonlat: [77.21, 28.61] },
];
const hotIds = new Set(DEST.map((d) => d.id));
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
    else if (hotIds.has(hit.id)) hot += seg;
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
/** Puntos de los países con operación destacada */
export const DOTS_HOT = "${hot}";
/** Puntos de Colombia */
export const DOTS_ORIGIN = "${origin}";

export const ORIGIN = { name: "${ORIGIN.name}", x: ${pt(ORIGIN.lonlat)[0]}, y: ${pt(ORIGIN.lonlat)[1]} };

/** Capitales de los países donde Transpack ha atendido embajadas */
export const DESTINATIONS = [
${DEST.map((d) => {
  const [x, y] = pt(d.lonlat);
  return `  { name: "${d.name}", x: ${x}, y: ${y} },`;
}).join("\n")}
];
`;
fs.writeFileSync(process.argv[2], out);
console.log("dots", n, "bytes", out.length);
