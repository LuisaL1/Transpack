// Genera src/data/bogotaMap.ts con las 20 localidades de Bogotá para el inicio
// del mapa de la portada (pnpm map:bogota). Fuente: capa oficial "Localidad.
// Bogotá D.C." de Datos Abiertos Bogotá (IDECA, licencia CC BY 4.0). Simplifica
// los bordes (Douglas-Peucker, ~40 m: menos de un píxel en el mapa) para que el
// archivo pese poco. Necesita internet.
import { writeFile } from "node:fs/promises";
import { geoCentroid } from "d3-geo";

const out = process.argv[2] ?? "src/data/bogotaMap.ts";
const SOURCE =
  "https://datosabiertos.bogota.gov.co/dataset/856cb657-8ca3-4ee8-857f-37211173b1f8/resource/497b8756-0927-4aee-8da9-ca4e32ca3a8a/download/loca.json";
const TOLERANCE = 0.00035; // grados (~40 m)

// Nombre oficial de cada localidad por su código (la capa los trae en mayúsculas
// y sin tildes)
const NAMES = {
  "01": "Usaquén",
  "02": "Chapinero",
  "03": "Santa Fe",
  "04": "San Cristóbal",
  "05": "Usme",
  "06": "Tunjuelito",
  "07": "Bosa",
  "08": "Kennedy",
  "09": "Fontibón",
  10: "Engativá",
  11: "Suba",
  12: "Barrios Unidos",
  13: "Teusaquillo",
  14: "Los Mártires",
  15: "Antonio Nariño",
  16: "Puente Aranda",
  17: "La Candelaria",
  18: "Rafael Uribe Uribe",
  19: "Ciudad Bolívar",
  20: "Sumapaz",
};

const res = await fetch(SOURCE);
if (!res.ok) throw new Error(`${res.status} ${SOURCE}`);
const data = await res.json();

// Douglas-Peucker sobre un anillo (abierto o cerrado)
function simplify(pts) {
  if (pts.length < 4) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    const [ax, ay] = pts[a];
    const [bx, by] = pts[b];
    const dx = bx - ax;
    const dy = by - ay;
    const len = Math.hypot(dx, dy) || 1e-12;
    let far = -1;
    let max = TOLERANCE;
    for (let i = a + 1; i < b; i++) {
      const d = Math.abs(dy * (pts[i][0] - ax) - dx * (pts[i][1] - ay)) / len;
      if (d > max) [far, max] = [i, d];
    }
    if (far > 0) {
      keep[far] = 1;
      stack.push([a, far], [far, b]);
    }
  }
  return pts.filter((_, i) => keep[i]);
}
// Un anillo cerrado se parte en dos mitades para que no colapse
const simplifyRing = (ring) => {
  const mid = Math.floor(ring.length / 2);
  const s = [...simplify(ring.slice(0, mid + 1)), ...simplify(ring.slice(mid)).slice(1)];
  return s.map(([x, y]) => [+x.toFixed(5), +y.toFixed(5)]);
};
// Área con signo (positiva = antihorario)
const area = (r) =>
  r.reduce((s, [x, y], i) => s + x * r[(i + 1) % r.length][1] - r[(i + 1) % r.length][0] * y, 0) /
  2;

const localities = data.features
  .map((f) => {
    const code = f.attributes.LocCodigo;
    const name = NAMES[code] ?? NAMES[+code];
    if (!name) throw new Error(`Localidad sin nombre: ${code}`);
    // ArcGIS: anillos exteriores en sentido horario y huecos antihorario (lo mismo
    // que espera d3-geo); cada exterior abre un polígono nuevo
    const polygons = [];
    for (const ring of f.geometry.rings) {
      const r = simplifyRing(ring);
      if (r.length < 4) continue;
      if (area(r) < 0 || !polygons.length) polygons.push([r]);
      else polygons[polygons.length - 1].push(r);
    }
    const geometry = { type: "MultiPolygon", coordinates: polygons };
    const [lon, lat] = geoCentroid(geometry);
    return { code, name, lon: +lon.toFixed(4), lat: +lat.toFixed(4), geometry };
  })
  .sort((a, b) => a.code.localeCompare(b.code));
if (localities.length !== 20) throw new Error(`Se esperaban 20 localidades: ${localities.length}`);

await writeFile(
  out,
  `// Localidades de Bogotá para el inicio del mapa de la portada. GENERADO con
// \`pnpm map:bogota\` (scripts/generate-bogota-map.mjs): no editar a mano.
// Fuente: "Localidad. Bogotá D.C.", Datos Abiertos Bogotá (IDECA), CC BY 4.0.
// "lon"/"lat": centro de la localidad (para su nombre).

export type Locality = {
  code: string;
  name: string;
  lon: number;
  lat: number;
  geometry: { type: "MultiPolygon"; coordinates: number[][][][] };
};

export const LOCALITIES: Locality[] = ${JSON.stringify(localities)};
`,
);
const pts = localities.reduce((s, l) => s + l.geometry.coordinates.flat(2).length, 0);
console.log(`${localities.length} localidades, ${pts} puntos → ${out}`);
