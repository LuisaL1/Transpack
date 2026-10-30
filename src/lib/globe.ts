// Mapa animado de la portada: recorrido de la cámara, rutas y dibujo en
// <canvas>, en grises con Colombia y las rutas en naranja. Se carga aparte con
// import() desde src/hooks/useGlobe.ts (trae d3-geo y las siluetas de los
// países), así no pesa en el JS principal.
//
// Historia (en bucle), pedida por el cliente (oct. 2026):
// 1. La foto de la portada (imagen-transpack-inicio2.jpg), completa.
// 2. La foto se cierra en un círculo y en él aparece Colombia de cerca: desde
//    Bogotá salen, casi a la vez, las rutas a las principales capitales de
//    departamento (CITIES).
// 3. Por continente (América, Europa, África y Asia): la cámara encuadra el
//    continente y desde Bogotá salen, casi a la vez, las rutas a sus países.
// 4. Panorama: el globo gira con las rutas a todos los destinos.
// 5. Vuelve la foto.
// Todas las rutas internacionales tienen el mismo estilo.
import { geoGraticule10, geoOrthographic, geoPath, type GeoProjection } from "d3-geo";
import { feature, mesh } from "topojson-client";
import { COLOMBIA, WORLD } from "@/data/worldGlobe";
import { CITIES, DESTINATIONS, ORIGIN } from "@/data/worldMap";

export type Place = { name: string; lon: number; lat: number; embassy?: boolean; region?: string };
export type View = { lon: number; lat: number; zoom: number };
/** Textos que dibuja el mapa (vienen de src/data/home.ts, en el idioma de la página) */
export type GlobeLabels = {
  origin: string;
  country: string;
  /** Nombre del país (Suramérica y África) */
  place: (p: Place) => string;
};

const RAD = Math.PI / 180;
type Vec = [number, number, number];

const toVec = (p: { lon: number; lat: number }): Vec => {
  const l = p.lon * RAD;
  const f = p.lat * RAD;
  return [Math.cos(f) * Math.cos(l), Math.cos(f) * Math.sin(l), Math.sin(f)];
};
const toPlace = ([x, y, z]: Vec) => ({
  lon: Math.atan2(y, x) / RAD,
  lat: Math.asin(Math.max(-1, Math.min(1, z))) / RAD,
});
const angle = (a: Vec, b: Vec) =>
  Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])));

/** Punto intermedio del gran círculo entre a y b (t de 0 a 1) */
function slerp(a: Vec, b: Vec, t: number): Vec {
  const w = angle(a, b);
  if (w < 1e-6) return a;
  const s = Math.sin(w);
  const k0 = Math.sin((1 - t) * w) / s;
  const k1 = Math.sin(t * w) / s;
  return [a[0] * k0 + b[0] * k1, a[1] * k0 + b[1] * k1, a[2] * k0 + b[2] * k1];
}

/**
 * Proyección ortográfica (la misma de d3-geo): x a la derecha, y hacia arriba,
 * z hacia quien mira (z > 0 = cara visible). `alt` eleva el punto (rutas).
 */
function project(lon: number, lat: number, v: View, alt = 0) {
  const dl = (lon - v.lon) * RAD;
  const f = lat * RAD;
  const f0 = v.lat * RAD;
  const r = 1 + alt;
  const cf = Math.cos(f);
  return {
    x: r * cf * Math.sin(dl),
    y: r * (Math.cos(f0) * Math.sin(f) - Math.sin(f0) * cf * Math.cos(dl)),
    z: r * (Math.sin(f0) * Math.sin(f) + Math.cos(f0) * cf * Math.cos(dl)),
  };
}

// ─── Países ─────────────────────────────────────────────────────────────────

const countries = WORLD.objects.countries;
const FEATURES = feature(WORLD, countries).features;
const BY_ZONE = [0, 1, 2].map((z) => ({
  type: "FeatureCollection",
  features: FEATURES.filter((f) => f.properties.z === z),
}));
const BORDERS = mesh(WORLD, countries, (a, b) => a !== b);
const GRATICULE = geoGraticule10();
const SPHERE = { type: "Sphere" };

// ─── Rutas internacionales ──────────────────────────────────────────────────

const ROUTE_STEPS = 96;
/** Puntos de la ruta Bogotá → destino, elevada en el medio según la distancia */
function route(to: Place) {
  const a = toVec(ORIGIN);
  const b = toVec(to);
  const h = 0.02 + 0.1 * (angle(a, b) / Math.PI);
  return Array.from({ length: ROUTE_STEPS + 1 }, (_, i) => {
    const t = i / ROUTE_STEPS;
    return { ...toPlace(slerp(a, b, t)), alt: h * Math.sin(Math.PI * t) };
  });
}
const ROUTES = new Map(DESTINATIONS.map((d) => [d.name, route(d)]));

// Continentes en el orden del recorrido, con su encuadre (centro y acercamiento)
const CONTINENTS = [
  { key: "america", view: { lon: -72, lat: 6, zoom: 1.12 } },
  // Europa de cerca; las rutas entran por el Atlántico
  { key: "europa", view: { lon: -2, lat: 44, zoom: 1.75 } },
  { key: "africa", view: { lon: -18, lat: 2, zoom: 1 } },
  { key: "asia", view: { lon: 62, lat: 24, zoom: 1 } },
].map((c) => ({
  ...c,
  places: DESTINATIONS.filter((d) => d.region === c.key) as Place[],
}));

// ─── Tiempos (ms de historia; la animación corre más rápido, ver useGlobe) ───

const PHOTO = 3500; // la foto
const MORPH = 1000; // la foto se cierra en el círculo y aparece Colombia
const ENTER = PHOTO + MORPH;
const LOOK = 200; // Colombia de cerca, antes de las rutas
const GAP = 85; // las rutas por Colombia salen casi a la vez, en abanico
const LEG = 750; // cada ruta por Colombia
// Colombia se ve unos 2,7 s de historia, con la entrada y la salida (unos 2 s
// en pantalla)
const LOCAL = ENTER + LOOK + (CITIES.length - 2) * GAP + LEG + 150;
const legAt = (i: number) => ENTER + LOOK + i * GAP;

const REGION_MOVE = 1300; // la cámara viaja al continente
// Las rutas del continente salen casi a la vez: entre más países, más seguidas
// (todas salen en unos 2,6 s)
const regionGap = (n: number) => Math.min(160, 2600 / Math.max(1, n - 1));
const REGION_DRAW = 1000; // cada ruta de un continente
const REGION_HOLD = 1900; // pausa con el continente completo (se leen los nombres)
const regionLength = (n: number) =>
  REGION_MOVE + (n - 1) * regionGap(n) + REGION_DRAW + REGION_HOLD;
const REGION_AT: number[] = [];
let at = LOCAL;
for (const c of CONTINENTS) {
  REGION_AT.push(at);
  at += regionLength(c.places.length);
}
const PANORAMA = at;
// Continente que se está mostrando en el momento t
const regionAt = (t: number) => REGION_AT.filter((a) => t >= a).length - 1;
const OPEN = 1600; // la cámara se aleja para el panorama
const SPIN = PANORAMA + OPEN;
const TURN = 14000; // una vuelta del globo con todos los destinos
const LEAVE = SPIN + TURN;
const OUT = 1500; // vuelve la foto
/** Duración de una vuelta completa de la historia (ms) */
export const LOOP = LEAVE + OUT;

// ─── Cámara ─────────────────────────────────────────────────────────────────

// Radio del círculo donde se ve el globo y de la esfera con zoom 1 (fracción
// del lado menor del canvas)
// Con BASE 0.38 las rutas más altas (hasta 0.12 sobre la superficie) caben en
// el círculo y no se cortan al girar
const LENS = 0.46;
const BASE = 0.38;

// Colombia de cerca y luego un encuadre con todas las capitales de CITIES
const LOCAL_VIEWS: View[] = [
  { lon: -74.2, lat: 4.6, zoom: 4.2 },
  { lon: -74.6, lat: 7.0, zoom: 4.7 },
];
const PANO_LAT = 14;

const ease = (p: number) => (p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const progress = (t: number, from: number, len: number) => clamp01((t - from) / len);
// Giro por el camino corto (de -180 a 180)
const wrap = (d: number) => ((((d + 180) % 360) + 360) % 360) - 180;
function mix(a: View, b: View, p: number): View {
  const e = ease(p);
  return {
    lon: a.lon + wrap(b.lon - a.lon) * e,
    lat: a.lat + (b.lat - a.lat) * e,
    zoom: a.zoom * (b.zoom / a.zoom) ** e,
  };
}

function camera(t: number): View {
  const local = mix(LOCAL_VIEWS[0], LOCAL_VIEWS[1], progress(t, legAt(0), LOCAL - legAt(0)));
  if (t < LOCAL) return local;
  const last = CONTINENTS[CONTINENTS.length - 1].view;
  if (t < PANORAMA) {
    const i = regionAt(t);
    const from = i === 0 ? local : CONTINENTS[i - 1].view;
    return mix(from, CONTINENTS[i].view, progress(t, REGION_AT[i], REGION_MOVE));
  }
  const pano = { lon: last.lon, lat: PANO_LAT, zoom: 1 };
  if (t < SPIN) return mix(last, pano, progress(t, PANORAMA, OPEN));
  // La Tierra gira de oeste a este: el centro del globo avanza hacia el oeste
  return { ...pano, lon: pano.lon - 360 * ((t - SPIN) / (TURN + OUT)) };
}

/** Estado de la historia en el momento `time` (ms) */
export function scene(time: number) {
  const t = ((time % LOOP) + LOOP) % LOOP;

  // Foto: se cierra en el círculo del globo (morph 0 → 1) y se desvanece; al
  // final vuelve
  const back = ease(progress(t, LEAVE, OUT));
  const morph = t >= LEAVE ? 1 - back : ease(progress(t, PHOTO, MORPH));
  const photo = t >= LEAVE ? back : 1 - ease(progress(t, PHOTO + MORPH * 0.4, MORPH * 0.6));
  const map = t >= LEAVE ? 1 - back : ease(progress(t, PHOTO + MORPH * 0.3, MORPH * 0.7));

  // Recorrido por Colombia: cuánto de cada ruta se ve; se apaga al salir
  const legs = CITIES.slice(1).map((_, i) => progress(t, legAt(i), LEG));
  const localFade = 1 - progress(t, LOCAL, 1200);

  // Rutas internacionales: cada continente en su turno
  const region = t >= LOCAL && t < PANORAMA + 300 ? regionAt(t) : -1;
  const pano = progress(t, PANORAMA, OPEN);
  const drawn = (p: Place) => {
    const i = CONTINENTS.findIndex((c) => c.places.includes(p));
    if (i < 0) return pano;
    const list = CONTINENTS[i].places;
    return progress(
      t,
      REGION_AT[i] + REGION_MOVE * 0.6 + list.indexOf(p) * regionGap(list.length),
      REGION_DRAW,
    );
  };
  // Nombres de los países del continente, solo mientras se ve
  const regionLabels = region >= 0 ? CONTINENTS[region].places : [];

  return {
    view: camera(t),
    pano,
    drawn,
    regionLabels,
    legs,
    localFade,
    spinning: t >= SPIN,
    photo,
    morph,
    map,
  };
}
export type Scene = ReturnType<typeof scene>;

/** Vista fija (movimiento reducido): el Atlántico, de las Américas a Europa y África */
export const stillScene = (): Scene => ({
  view: { lon: -38, lat: 14, zoom: 1 },
  pano: 1,
  drawn: () => 1,
  regionLabels: [],
  legs: CITIES.slice(1).map(() => 0),
  localFade: 0,
  spinning: false,
  photo: 0,
  morph: 1,
  map: 1,
});

/** Radio del círculo del globo en píxeles (para cerrar la foto en él) */
export const lensRadius = (w: number, h: number) => Math.min(w, h) * LENS;

// ─── Dibujo ─────────────────────────────────────────────────────────────────

const ORANGE = "#FF7619";
const INK = "62,65,96"; // gris oscuro (texto del sitio)
const GRAY = "107,110,138"; // gris medio

type Side = "above" | "below" | "right" | "left";

// Pastilla con texto (Bogotá y la capital en turno)
function pill(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  dpr: number,
  dark: boolean,
  side: Side,
) {
  ctx.font = `600 ${12 * dpr}px Montserrat, system-ui, sans-serif`;
  const w = ctx.measureText(text).width + 22 * dpr;
  const h = 24 * dpr;
  const left = Math.min(
    Math.max(
      side === "right" ? x + 14 * dpr : side === "left" ? x - w - 14 * dpr : x - w / 2,
      4 * dpr,
    ),
    ctx.canvas.width - w - 4 * dpr,
  );
  const top =
    side === "right" || side === "left"
      ? y - h / 2
      : side === "above"
        ? y - h - 12 * dpr
        : y + 12 * dpr;
  ctx.save();
  ctx.shadowColor = `rgba(${INK},.28)`;
  ctx.shadowBlur = 12 * dpr;
  ctx.fillStyle = dark ? `rgb(${INK})` : "#ffffff";
  ctx.beginPath();
  ctx.roundRect(left, top, w, h, h / 2);
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = dark ? "#ffffff" : `rgb(${INK})`;
  ctx.textBaseline = "middle";
  ctx.fillText(text, left + 11 * dpr, top + h / 2 + 0.5 * dpr);
}

// Nombre corto junto a un punto (ciudades de Colombia y países de una región),
// con un borde blanco para que se lea sobre el mapa
function tag(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  dpr: number,
  side: Side,
) {
  ctx.font = `600 ${11 * dpr}px Montserrat, system-ui, sans-serif`;
  ctx.textBaseline = "middle";
  const vertical = side === "below" || side === "above";
  ctx.textAlign = vertical ? "center" : side === "left" ? "right" : "left";
  const tx = x + (vertical ? 0 : side === "left" ? -9 : 9) * dpr;
  const ty = y + (side === "below" ? 12 : side === "above" ? -12 : 0) * dpr;
  ctx.lineWidth = 3 * dpr;
  ctx.strokeStyle = "rgba(255,255,255,.85)";
  ctx.strokeText(text, tx, ty);
  ctx.fillStyle = `rgb(${INK})`;
  ctx.fillText(text, tx, ty);
  ctx.textAlign = "start";
}

// Punto de ciudad o destino
function pin(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  dpr: number,
  r: number,
  fill: string,
  stroke: string,
) {
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2 * dpr;
  ctx.beginPath();
  ctx.arc(x, y, r * dpr, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}
function pulse(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  dpr: number,
  time: number,
  rgb: string,
) {
  const p = (time % 2000) / 2000;
  ctx.fillStyle = `rgba(${rgb},${0.4 * (1 - p)})`;
  ctx.beginPath();
  ctx.arc(x, y, (6 + 18 * p) * dpr, 0, Math.PI * 2);
  ctx.fill();
}

// Países, fronteras y Colombia. `close` (0 a 1): de cerca Colombia va en
// naranja claro con borde naranja, para que las rutas se lean encima.
function drawLand(
  ctx: CanvasRenderingContext2D,
  path: ReturnType<typeof geoPath>,
  dpr: number,
  pano: number,
  close: number,
  borderWidth: number,
) {
  const fills = [
    `rgba(${GRAY},.32)`,
    `rgba(${GRAY},${0.42 + 0.18 * pano})`,
    "rgba(255,178,122,.95)",
  ];
  BY_ZONE.forEach((fc, z) => {
    ctx.fillStyle = fills[z];
    ctx.beginPath();
    path(fc);
    ctx.fill();
  });
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = borderWidth * dpr;
  ctx.beginPath();
  path(BORDERS);
  ctx.stroke();
  ctx.fillStyle = `rgba(255,118,25,${0.95 - 0.75 * close})`;
  ctx.beginPath();
  path(COLOMBIA);
  ctx.fill();
  ctx.strokeStyle = close > 0 ? ORANGE : "#ffffff";
  ctx.lineWidth = (close > 0 ? 2.2 : borderWidth) * dpr;
  ctx.stroke();
}

// Rutas desde Bogotá a las capitales de Colombia, con sus nombres
function drawLocal(
  ctx: CanvasRenderingContext2D,
  proj: GeoProjection,
  s: Scene,
  dpr: number,
  time: number,
  labels: GlobeLabels,
  alpha: number,
) {
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.lineCap = "round";
  // En línea recta: a esta escala la curva de la Tierra no se nota. La que se
  // está trazando va en naranja.
  const from = proj([CITIES[0].lon, CITIES[0].lat]);
  s.legs.forEach((amount, i) => {
    const b = proj([CITIES[i + 1].lon, CITIES[i + 1].lat]);
    if (amount <= 0 || !from || !b) return;
    const e = ease(amount);
    const on = amount < 1;
    ctx.save();
    ctx.strokeStyle = on ? ORANGE : `rgba(${INK},.5)`;
    ctx.lineWidth = (on ? 3 : 2) * dpr;
    ctx.setLineDash([2 * dpr, 7 * dpr]);
    if (on) {
      ctx.shadowColor = "rgba(255,118,25,.5)";
      ctx.shadowBlur = 8 * dpr;
    }
    ctx.beginPath();
    ctx.moveTo(from[0], from[1]);
    ctx.lineTo(from[0] + (b[0] - from[0]) * e, from[1] + (b[1] - from[1]) * e);
    ctx.stroke();
    ctx.restore();
  });
  const n = proj([-72.3, 1.4]);
  if (n) {
    ctx.font = `700 ${15 * dpr}px "IBM Plex Sans", system-ui, sans-serif`;
    ctx.letterSpacing = `${4 * dpr}px`;
    ctx.fillStyle = `rgba(${INK},.55)`;
    ctx.textAlign = "center";
    ctx.fillText(labels.country.toUpperCase(), n[0], n[1]);
    ctx.textAlign = "start";
    ctx.letterSpacing = "0px";
  }
  // Bogotá con pastilla; las demás capitales con punto y nombre al llegar su ruta
  CITIES.forEach((c, i) => {
    const p = proj([c.lon, c.lat]);
    if (!p || (i > 0 && s.legs[i - 1] < 1)) return;
    if (i === 0) {
      pulse(ctx, p[0], p[1], dpr, time, "255,118,25");
      pin(ctx, p[0], p[1], dpr, 6, "#ffffff", `rgb(${INK})`);
      pill(ctx, p[0], p[1], labels.origin, dpr, true, "right");
      return;
    }
    pin(ctx, p[0], p[1], dpr, 4, ORANGE, "#ffffff");
    tag(ctx, p[0], p[1], c.name, dpr, c.side);
  });
  ctx.restore();
}

// Lado del nombre de algunos países, para que no se monten con un vecino (el
// resto va a la derecha del punto)
const LABEL_SIDE: Record<string, Side> = {
  China: "left",
  "Arabia Saudita": "left",
  "Reino Unido": "left",
  Portugal: "left",
  "Países Bajos": "above",
  Alemania: "below",
  Suiza: "below",
  Italia: "below",
};

/** Dibuja el mapa en el estado `s` (de scene o stillScene) */
export function drawGlobe(
  ctx: CanvasRenderingContext2D,
  s: Scene,
  time: number,
  labels: GlobeLabels,
  dpr: number,
) {
  const { width: W, height: H } = ctx.canvas;
  ctx.clearRect(0, 0, W, H);
  if (s.map <= 0) return;
  const v = s.view;
  const cx = W / 2;
  const cy = H / 2;
  const lens = lensRadius(W, H);
  const R = Math.min(W, H) * BASE * v.zoom;
  // De cerca el círculo es una lupa sobre el mapa; de lejos se ve el globo entero
  const near = clamp01((v.zoom - 1.05) / 0.6);
  const close = clamp01((v.zoom - 1.8) / 1.6);
  const proj = geoOrthographic()
    .scale(R)
    .translate([cx, cy])
    .rotate([-v.lon, -v.lat])
    .clipAngle(90)
    .precision(0.6);
  const path = geoPath(proj, ctx);
  const px = (p: { x: number; y: number }) => [cx + R * p.x, cy - R * p.y] as const;

  ctx.save();
  ctx.globalAlpha = s.map;

  // Sombra suave del globo (solo de lejos)
  if (near < 1) {
    const shade = ctx.createRadialGradient(
      cx,
      cy + R * 0.05,
      R * 0.85,
      cx,
      cy + R * 0.05,
      R * 1.12,
    );
    shade.addColorStop(0, `rgba(${INK},${0.16 * (1 - near)})`);
    shade.addColorStop(1, `rgba(${INK},0)`);
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, W, H);
  }

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, lens, 0, Math.PI * 2);
  ctx.clip();

  // Mar gris muy claro, más luminoso arriba a la izquierda
  const sea = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.05, cx, cy, R);
  sea.addColorStop(0, "#FFFFFF");
  sea.addColorStop(0.6, "#F0F6F6");
  sea.addColorStop(1, "#E1E5EE");
  ctx.fillStyle = sea;
  ctx.beginPath();
  path(SPHERE);
  ctx.fill();
  ctx.strokeStyle = `rgba(${GRAY},.14)`;
  ctx.lineWidth = dpr;
  ctx.beginPath();
  path(GRATICULE);
  ctx.stroke();
  drawLand(ctx, path, dpr, s.pano, close, Math.max(0.6, Math.min(1.6, v.zoom * 0.4)));
  drawLocal(ctx, proj, s, dpr, time, labels, s.localFade * close);

  // Rutas internacionales: todas con el mismo estilo. Un tramo solo queda oculto
  // si pasa por detrás del planeta (cara trasera y dentro de su silueta): ahí se
  // dibuja tenue, así la línea se ve rodeando el globo en vez de cortarse; lo
  // que asoma por fuera del borde se dibuja completo.
  const hidden = (p: { x: number; y: number; z: number }) => p.z < 0 && p.x * p.x + p.y * p.y < 1;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = 1.8 * dpr;
  const front = new Path2D();
  const back = new Path2D();
  for (const d of DESTINATIONS) {
    const amount = s.drawn(d);
    if (amount <= 0) continue;
    const pts = ROUTES.get(d.name)!;
    const end = Math.max(1, Math.round(ease(amount) * ROUTE_STEPS));
    let prev = project(pts[0].lon, pts[0].lat, v, pts[0].alt);
    for (let i = 1; i <= end; i++) {
      const q = project(pts[i].lon, pts[i].lat, v, pts[i].alt);
      const target = hidden(prev) && hidden(q) ? back : front;
      const [x0, y0] = px(prev);
      const [x1, y1] = px(q);
      target.moveTo(x0, y0);
      target.lineTo(x1, y1);
      prev = q;
    }

    // En el giro, una luz recorre cada ruta (solo por la parte a la vista)
    if (s.spinning && amount >= 1) {
      const k = Math.floor(((time / 3250 + d.lon / 90 + 10) % 1) * ROUTE_STEPS);
      const q = project(pts[k].lon, pts[k].lat, v, pts[k].alt);
      if (!hidden(q)) {
        const [x, y] = px(q);
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(x, y, 2 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  ctx.strokeStyle = "rgba(255,118,25,.22)";
  ctx.stroke(back);
  ctx.strokeStyle = ORANGE;
  ctx.stroke(front);
  // Destinos (cuando la ruta llegó) y, mientras se ve su continente, su nombre;
  // un nombre que se montaría sobre otro ya puesto se omite
  const placed: [number, number, number, number][] = [];
  ctx.font = `600 ${11 * dpr}px Montserrat, system-ui, sans-serif`;
  for (const d of DESTINATIONS) {
    if (s.drawn(d) < 1) continue;
    const q = project(d.lon, d.lat, v);
    if (q.z <= 0) continue;
    const [x, y] = px(q);
    pin(ctx, x, y, dpr, 3.5, ORANGE, "#ffffff");
    if (!s.regionLabels.includes(d)) continue;
    const text = labels.place(d);
    const side = LABEL_SIDE[d.name] ?? "right";
    const w = ctx.measureText(text).width + 12 * dpr;
    const h = 8 * dpr;
    const box: [number, number, number, number] =
      side === "left"
        ? [x - w, y - h, x, y + h]
        : side === "right"
          ? [x, y - h, x + w, y + h]
          : side === "above"
            ? [x - w / 2, y - 3 * h, x + w / 2, y - h]
            : [x - w / 2, y + h, x + w / 2, y + 3 * h];
    if (placed.some((b) => box[0] < b[2] && box[2] > b[0] && box[1] < b[3] && box[3] > b[1]))
      continue;
    placed.push(box);
    tag(ctx, x, y, text, dpr, side);
  }

  // Bogotá (de cerca ya la marca el recorrido por Colombia)
  const o = project(ORIGIN.lon, ORIGIN.lat, v);
  // Solo si Bogotá queda dentro del círculo (de cerca a Europa queda fuera)
  const [bx, by] = px(o);
  if (o.z > 0 && s.localFade === 0 && Math.hypot(bx - cx, by - cy) < lens - 10 * dpr) {
    const [x, y] = [bx, by];
    pulse(ctx, x, y, dpr, time, INK);
    pin(ctx, x, y, dpr, 5.5, "#ffffff", `rgb(${INK})`);
    if (!s.spinning) pill(ctx, x, y, labels.origin, dpr, true, "below");
  }

  ctx.restore(); // fin del círculo

  // Borde del círculo cuando funciona como lupa
  if (near > 0) {
    ctx.strokeStyle = `rgba(${INK},${0.18 * near})`;
    ctx.lineWidth = 1.5 * dpr;
    ctx.beginPath();
    ctx.arc(cx, cy, lens, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}
