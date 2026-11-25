// Mapamundi de líneas para fondos (Nosotros, bloque de historia): contornos de
// los continentes, fronteras, rutas desde Bogotá y pulsos de luz que las
// recorren, todo en un SVG con su propia animación CSS. GENERA
// src/assets/images/mapa-lineas.svg, su versión para fondo oscuro
// mapa-lineas-noche.svg (Cobertura del inicio) y, para el pie de página, el
// mapa de puntos src/assets/images/mapa-puntos.svg (parte de `pnpm map`; no
// editar a mano).
// Va como archivo aparte (se carga como imagen) para no sumar al JS principal.
//
// Datos: Natural Earth 1:110m (world-atlas) y los destinos del globo de la
// portada (src/data/worldMap.ts). Proyección Natural Earth, 1000 px de ancho.
// Colores del Manual de Marca: azul #272B7C (líneas), naranja #FF7619 y azul
// #34399A (pulsos). Con movimiento reducido, sin pulsos.
import { createRequire } from "module";
import fs from "fs";
import { geoNaturalEarth1, geoPath, geoInterpolate, geoArea, geoContains } from "d3-geo";
import { feature, mesh, merge } from "topojson-client";
import { DESTINATIONS, ORIGIN } from "../src/data/worldMap.ts";

const require = createRequire(import.meta.url);
const world = require("world-atlas/countries-110m.json");
const out = process.argv[2] ?? "src/assets/images/mapa-lineas.svg";
const outDots = process.argv[3] ?? "src/assets/images/mapa-puntos.svg";
const outNight = process.argv[4] ?? "src/assets/images/mapa-lineas-noche.svg";

const W = 1000;
// Sin la Antártida
const geoms = world.objects.countries.geometries.filter((g) => g.id !== "010");
const countries = { type: "GeometryCollection", geometries: geoms };
const projection = geoNaturalEarth1().fitWidth(W, feature(world, countries));
const H = Math.ceil(geoPath(projection).bounds(feature(world, countries))[1][1]);
// Coordenadas enteras: el archivo queda liviano y en un fondo tenue no se nota
const path = (g) =>
  (geoPath(projection)(g) ?? "")
    .replace(/-?\d+\.\d+/g, (n) => String(Math.round(+n)))
    .replace(/L(-?\d+),(-?\d+)(?=L\1,\2)/g, "");

// Costas: borde de la tierra (arcos de un solo país); fronteras: arcos entre dos
const coast = mesh(world, countries, (a, b) => a === b);
const borders = mesh(world, countries, (a, b) => a !== b);

// Pulsos por las costas: los contornos más largos (continentes), cada uno en su
// propio trazo para que el pulso lo recorra completo
const land = merge(world, geoms);
const rings = land.coordinates
  .map((poly) => ({ type: "Polygon", coordinates: [poly[0]] }))
  .sort((a, b) => geoArea(b) - geoArea(a))
  .slice(0, 9);

// Rutas desde Bogotá: un destino de cada pocos, para que no se amontonen
const origin = [ORIGIN.lon, ORIGIN.lat];
const routeDests = DESTINATIONS.filter((_, i) => i % 3 === 0);
const routes = routeDests.map((d) => {
  const at = geoInterpolate(origin, [d.lon, d.lat]);
  const pts = Array.from({ length: 33 }, (_, k) => projection(at(k / 32)));
  // Arco: se levanta en el centro, más entre más larga es la ruta
  const [x0, y0] = pts[0];
  const [x1, y1] = pts[pts.length - 1];
  const lift = Math.min(90, Math.hypot(x1 - x0, y1 - y0) * 0.18);
  return (
    "M" +
    pts
      .map(([x, y], k) => {
        const s = Math.sin((Math.PI * k) / 32);
        return `${Math.round(x)},${Math.round(y - lift * s)}`;
      })
      .join("L")
  );
});
const [bx, by] = projection(origin).map((v) => +v.toFixed(1));

const ORANGE = "#FF7619";
const BLUE = "#34399A";
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" fill="none" stroke-linecap="round" stroke-linejoin="round">
<!-- GENERADO con \`pnpm map\` (scripts/generate-world-lines.mjs). Natural Earth 1:110m. -->
<style>
.coast{stroke:#272B7C;stroke-opacity:.13;stroke-width:1}
.border{stroke:#272B7C;stroke-opacity:.07;stroke-width:.6}
.route{stroke:#272B7C;stroke-opacity:.12;stroke-width:1;stroke-dasharray:2 5}
.pulse{stroke-width:1.4;stroke-dasharray:1.6 98.4;stroke-dashoffset:100;animation:run linear infinite}
.o{stroke:${ORANGE};stroke-opacity:.34}
.b{stroke:${BLUE};stroke-opacity:.26}
.home{fill:${ORANGE};fill-opacity:.4}
.ring{stroke:${ORANGE};stroke-width:1.2;transform-box:fill-box;transform-origin:center;animation:ping 4s ease-out infinite}
@keyframes run{to{stroke-dashoffset:0}}
@keyframes ping{from{transform:scale(.4);opacity:.6}to{transform:scale(3);opacity:0}}
@media (prefers-reduced-motion:reduce){.pulse,.ring{animation:none;opacity:0}}
</style>
<path class="border" d="${path(borders)}"/>
<path class="coast" d="${path(coast)}"/>
${routes.map((d) => `<path class="route" d="${d}"/>`).join("\n")}
${rings
  .map(
    (r, i) =>
      `<path class="pulse ${i % 2 ? "b" : "o"}" pathLength="100" style="animation-duration:${26 + (i % 4) * 5}s;animation-delay:-${i * 3.7}s" d="${path(r)}"/>`,
  )
  .join("\n")}
${routes
  .map(
    (d, i) =>
      `<path class="pulse ${i % 3 === 2 ? "b" : "o"}" pathLength="100" style="stroke-dasharray:9 91;animation-duration:${7 + (i % 5) * 1.3}s;animation-delay:-${(i * 1.9).toFixed(1)}s" d="${d}"/>`,
  )
  .join("\n")}
<circle class="home" cx="${bx}" cy="${by}" r="3"/>
<circle class="ring" cx="${bx}" cy="${by}" r="4"/>
</svg>
`;
fs.writeFileSync(out, svg);
console.log("mapa de líneas", `${W}×${H}`, "rutas", routes.length, "bytes", svg.length);

// ─── Mapa de líneas "noche" (Cobertura del inicio, nov. 2026) ───────────────
// La misma geometría sobre fondo azul noche: costas y fronteras en blanco
// tenue, rutas punteadas en naranja, pulsos naranja y blancos que las recorren,
// el destino de cada ruta titilando y Bogotá con una onda. Reemplazó a la foto
// de Cobertura, que no tenía resolución para ocupar media pantalla.
const ends = routeDests.map((d) => projection([d.lon, d.lat]).map(Math.round));
const night = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" fill="none" stroke-linecap="round" stroke-linejoin="round">
<!-- GENERADO con \`pnpm map\` (scripts/generate-world-lines.mjs). Natural Earth 1:110m. -->
<style>
.coast{stroke:#FFFFFF;stroke-opacity:.3;stroke-width:.9}
.border{stroke:#FFFFFF;stroke-opacity:.1;stroke-width:.5}
.route{stroke:${ORANGE};stroke-opacity:.35;stroke-width:1;stroke-dasharray:2 5}
.pulse{stroke-width:1.6;stroke-dasharray:1.6 98.4;stroke-dashoffset:100;animation:run linear infinite}
.o{stroke:${ORANGE};stroke-opacity:.95}
.w{stroke:#FFFFFF;stroke-opacity:.7}
.dest{stroke:${ORANGE};stroke-width:4;animation:tw 3.6s ease-in-out infinite}
.home{fill:${ORANGE}}
.ring{stroke:${ORANGE};stroke-width:1.3;transform-box:fill-box;transform-origin:center;animation:ping 3.2s ease-out infinite}
@keyframes run{to{stroke-dashoffset:0}}
@keyframes tw{0%,100%{stroke-opacity:.3}50%{stroke-opacity:1}}
@keyframes ping{from{transform:scale(.4);opacity:.9}to{transform:scale(3.6);opacity:0}}
@media (prefers-reduced-motion:reduce){.pulse,.ring,.dest{animation:none}.pulse,.ring{opacity:0}.dest{stroke-opacity:.8}}
</style>
<path class="border" d="${path(borders)}"/>
<path class="coast" d="${path(coast)}"/>
${routes.map((d) => `<path class="route" d="${d}"/>`).join("\n")}
${rings
  .map(
    (r, i) =>
      `<path class="pulse ${i % 2 ? "w" : "o"}" pathLength="100" style="stroke-opacity:.45;animation-duration:${26 + (i % 4) * 5}s;animation-delay:-${i * 3.7}s" d="${path(r)}"/>`,
  )
  .join("\n")}
${routes
  .map(
    (d, i) =>
      `<path class="pulse ${i % 3 === 2 ? "w" : "o"}" pathLength="100" style="stroke-dasharray:9 91;animation-duration:${7 + (i % 5) * 1.3}s;animation-delay:-${(i * 1.9).toFixed(1)}s" d="${d}"/>`,
  )
  .join("\n")}
${ends.map(([x, y], i) => `<path class="dest" style="animation-delay:-${((i * 0.7) % 3.6).toFixed(1)}s" d="M${x} ${y}h0"/>`).join("\n")}
<circle class="home" cx="${bx}" cy="${by}" r="4"/>
<circle class="ring" cx="${bx}" cy="${by}" r="5"/>
</svg>
`;
fs.writeFileSync(outNight, night);
console.log("mapa de líneas noche", `${W}×${H}`, "bytes", night.length);

// ─── Mapa de puntos (pie de página, nov. 2026) ──────────────────────────────
// La tierra como una cuadrícula de puntos claros (sobre el azul del pie), los
// destinos en naranja titilando en cuatro grupos desfasados y Bogotá con una
// onda. Los puntos van como un solo trazo de "puntos" (M x y h0 con extremos
// redondos): así el archivo pesa poco. Con movimiento reducido, quietos.
const STEP = 10;
let land10 = "";
for (let y = STEP / 2; y < H; y += STEP)
  for (let x = STEP / 2; x < W; x += STEP) {
    const ll = projection.invert([x, y]);
    if (ll && geoContains(land, ll)) land10 += `M${x} ${y}h0`;
  }
const groups = [[], [], [], []];
DESTINATIONS.forEach((d, i) => {
  const [x, y] = projection([d.lon, d.lat]).map(Math.round);
  groups[i % 4].push(`M${x} ${y}h0`);
});
const dots = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" fill="none" stroke-linecap="round">
<!-- GENERADO con \`pnpm map\` (scripts/generate-world-lines.mjs). Natural Earth 1:110m. -->
<style>
.land{stroke:#FFFFFF;stroke-opacity:.16;stroke-width:3.4}
.dest{stroke:${ORANGE};stroke-width:4.6;animation:tw 4.8s ease-in-out infinite}
.ring{stroke:${ORANGE};stroke-width:1.2;transform-box:fill-box;transform-origin:center;animation:ping 3.2s ease-out infinite}
.home{fill:${ORANGE}}
@keyframes tw{0%,100%{stroke-opacity:.25}50%{stroke-opacity:1}}
@keyframes ping{from{transform:scale(.4);opacity:.8}to{transform:scale(3.4);opacity:0}}
@media (prefers-reduced-motion:reduce){.dest,.ring{animation:none}.ring{opacity:0}.dest{stroke-opacity:.7}}
</style>
<path class="land" d="${land10}"/>
${groups.map((g, i) => `<path class="dest" style="animation-delay:-${(i * 1.2).toFixed(1)}s" d="${g.join("")}"/>`).join("\n")}
<circle class="home" cx="${bx}" cy="${by}" r="4"/>
<circle class="ring" cx="${bx}" cy="${by}" r="5"/>
</svg>
`;
fs.writeFileSync(outDots, dots);
console.log("mapa de puntos", `${W}×${H}`, "bytes", dots.length);
