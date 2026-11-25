// Mapa animado de la portada: recorrido de la cámara, rutas y dibujo en
// <canvas>, en gris sobre el fondo blanco de la página (sin panel: se integra
// con el fondo; nov. 2026), con Colombia resaltada en azul y las rutas en naranja. Se carga aparte con
// import() desde src/hooks/useGlobe.ts (trae d3-geo y las siluetas de los
// países), así no pesa en el JS principal.
//
// Historia (en bucle), pedida por el cliente (oct. y nov. 2026):
// 1. Carrusel de fotos de los sectores exclusivos de Bogotá (SECTOR_PHOTOS:
//    El Nogal, Usaquén, El Chicó…; antes la foto de la casa, cambio de nov. 2026).
// 2. La última foto se cierra en un círculo y en él aparece Bogotá con sus localidades
//    (LOCALITIES); desde la sede (Puente Aranda) se trazan líneas discontinuas
//    finas a cada localidad y, en naranja, a las de clientes exclusivos (Usaquén,
//    Chapinero y Suba). Antes eran camiones (se quitaron en nov. 2026). Luego la
//    cámara se aleja hasta Colombia.
// 3. Colombia de cerca: desde Bogotá salen, casi a la vez, las rutas a las
//    principales capitales de departamento (CITIES).
// 4. Por continente (América, Europa, África, Asia y Oceanía): la cámara encuadra el
//    continente y desde Bogotá salen, casi a la vez, las rutas a sus países.
// 5. Panorama: el globo gira con las rutas a todos los destinos.
// 6. Vuelve la primera foto del carrusel.
// Las localidades, las ciudades de Colombia y los países se pueden tocar para ver
// su foto (CountryCard).
// Todas las rutas internacionales tienen el mismo estilo.
import {
  geoContains,
  geoGraticule10,
  geoOrthographic,
  geoPath,
  geoTransform,
  type GeoPath,
  type GeoProjection,
  type GeoStreamWrapper,
} from "d3-geo";
import { feature, mesh } from "topojson-client";
import { COLOMBIA, WORLD } from "@/data/worldGlobe";
import { CITIES, DESTINATIONS, ORIGIN } from "@/data/worldMap";
import { CITY_PHOTOS, COUNTRY_PHOTOS, LOCALITY_PHOTOS } from "@/data/countryPhotos";
import { SECTOR_PHOTOS } from "@/data/sectorPhotos";
import { LOCALITIES } from "@/data/bogotaMap";

export type Place = { name: string; lon: number; lat: number; embassy?: boolean; region?: string };
export type View = { lon: number; lat: number; zoom: number };
/** Textos que dibuja el mapa (vienen de src/data/home.ts, en el idioma de la página) */
export type GlobeLabels = {
  origin: string;
  country: string;
  /** Rótulo sobre el mapa de las localidades */
  city: string;
  /** Crédito del mapa de las localidades (lo exige su licencia) */
  cityCredit: string;
  /** Nombre del país (Suramérica y África) */
  place: (p: Place) => string;
  /** País que el visitante tocó (se marca con un anillo) */
  selected?: string;
  /** Lugar bajo el puntero (las localidades se iluminan) */
  hovered?: string;
  /** Solo el mapa: sin el rótulo de la ciudad y con el nombre de cada
   * localidad solo sobre el punto al que llega su línea (no en todas) */
  plain?: boolean;
  /** Multiplica el tamaño del mapa en su lienzo (1 = el de la portada) */
  scale?: number;
};
/** Punto de un destino o de una ciudad de Colombia en pantalla (px de CSS), para
 * saber qué se toca */
export type Hit = {
  kind: "country" | "city" | "locality";
  place: Place;
  x: number;
  y: number;
};

/** Foto del país (de su capital), de la ciudad de Colombia o de la localidad de
 * Bogotá (src/data/countryPhotos.ts, enlaces a Wikimedia) */
export const photoFor = (h: Hit) =>
  (h.kind === "city" ? CITY_PHOTOS : h.kind === "locality" ? LOCALITY_PHOTOS : COUNTRY_PHOTOS)[
    h.place.name
  ];

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
  // Oceanía (pedido del cliente, nov. 2026): Australia y Nueva Zelanda
  { key: "oceania", view: { lon: 155, lat: -30, zoom: 1.5 } },
].map((c) => ({
  ...c,
  places: DESTINATIONS.filter((d) => d.region === c.key) as Place[],
}));

// ─── Tiempos (ms de historia; la animación corre más lento, ver useGlobe) ───

// Los tiempos en pantalla son los de la historia × 1,125 (corre a ~0,89×):
// 1780 ms de historia ≈ 2 s en pantalla.
// Transiciones y trazos de unos 5 a 6 s en pantalla (pedido del cliente, nov.
// 2026, para que se vea más fluido): STAGE ≈ 5,5 s.
const STAGE = 4900;

// Carrusel de fotos: 2 s en pantalla cada una (pedido del cliente, nov. 2026)
const SLIDE = 1780;
const PHOTO = SLIDE * SECTOR_PHOTOS.length;
const MORPH = 4400; // la foto se cierra en el círculo y aparece Bogotá (~5 s)
// Líneas por Bogotá (nov. 2026, en vez de los camiones): desde la sede (Puente
// Aranda) salen, en abanico, líneas discontinuas muy finas a un punto de la parte
// urbana de cada localidad (STOP_AT; menos Sumapaz, fuera del mapa). Las de las
// localidades de clientes exclusivos (estratos 5 y 6, FINE) van en naranja, más
// gruesas, y salen al final.
const HOME: [number, number] = [-74.1116, 4.6163]; // Puente Aranda, la sede
const STOP_AT: Record<string, [number, number]> = {
  "Los Mártires": [-74.088, 4.6071],
  "La Candelaria": [-74.072, 4.5966],
  "Santa Fe": [-74.068, 4.612],
  "San Cristóbal": [-74.088, 4.568],
  "Rafael Uribe Uribe": [-74.1134, 4.5665],
  "Antonio Nariño": [-74.103, 4.5888],
  Tunjuelito: [-74.136, 4.5749],
  Usme: [-74.12, 4.505],
  "Ciudad Bolívar": [-74.158, 4.55],
  Bosa: [-74.1944, 4.6218],
  Kennedy: [-74.1527, 4.6303],
  Fontibón: [-74.1401, 4.6782],
  Teusaquillo: [-74.0858, 4.6412],
  "Barrios Unidos": [-74.0736, 4.6696],
  Engativá: [-74.1132, 4.7011],
  Suba: [-74.075, 4.745],
  Usaquén: [-74.036, 4.712],
  Chapinero: [-74.058, 4.652],
};
const FINE = new Set(["Suba", "Usaquén", "Chapinero"]);
// Empiezan cuando ya se ven las localidades. Cada línea tarda LINE_DRAW; las
// demás salen en abanico (por ángulo, en el sentido del reloj) en LINE_FAN y las
// exclusivas después, una tras otra
const LINES_AT = PHOTO + MORPH * 0.8;
const LINE_DRAW = 2600;
const LINE_FAN = 2300;
const FINE_AT = 2600;
const FINE_GAP = 450;
const LINES = (() => {
  const turn = ([lon, lat]: [number, number]) =>
    (Math.atan2(lat - HOME[1], lon - HOME[0]) + Math.PI * 2.5) % (Math.PI * 2);
  const all = Object.entries(STOP_AT).map(([name, to]) => ({ name, to, fine: FINE.has(name) }));
  const plain = all.filter((l) => !l.fine).sort((a, b) => turn(b.to) - turn(a.to));
  const fine = all.filter((l) => l.fine).sort((a, b) => turn(b.to) - turn(a.to));
  return [
    ...plain.map((l, i) => ({ ...l, start: (i * LINE_FAN) / Math.max(1, plain.length - 1) })),
    ...fine.map((l, i) => ({ ...l, start: FINE_AT + i * FINE_GAP })),
  ];
})();
const LINES_TIME = Math.max(...LINES.map((l) => l.start)) + LINE_DRAW;
// Bogotá con sus localidades mientras se trazan las líneas (y 2 s con todas a
// la vista), y la cámara que se aleja hasta Colombia
const BOGOTA_HOLD = LINES_AT - PHOTO - MORPH + LINES_TIME + 1780;
const BOGOTA_MOVE = STAGE;
const BOGOTA_END = PHOTO + MORPH + BOGOTA_HOLD;
const ENTER = BOGOTA_END + BOGOTA_MOVE;
const LOOK = 500; // Colombia de cerca, antes de las rutas
const LEG = 2600; // cada ruta por Colombia
// Las rutas por Colombia salen casi a la vez, en abanico: todas en STAGE
const GAP = (STAGE - LEG) / Math.max(1, CITIES.length - 2);
// Colombia: pausa de 2 s en pantalla con todas las ciudades a la vista antes de
// pasar a América (pedido del cliente, nov. 2026; se pueden tocar para ver su foto)
const LOCAL_HOLD = 1780;
const LOCAL = ENTER + LOOK + (CITIES.length - 2) * GAP + LEG + 150 + LOCAL_HOLD;
const legAt = (i: number) => ENTER + LOOK + i * GAP;

const REGION_MOVE = STAGE; // la cámara viaja al continente
const REGION_START = REGION_MOVE * 0.55; // las rutas salen cuando ya casi llegó
// Las rutas del continente salen casi a la vez: entre más países, más seguidas
// (todas salen en unos 2,7 s) y cada una se traza en unos 3 s
const regionGap = (n: number) => Math.min(260, 2400 / Math.max(1, n - 1));
const REGION_DRAW = 2600;
// Pausa con el continente completo (se leen los nombres): 2 s en pantalla antes
// de pasar al siguiente (pedido del cliente, nov. 2026)
const REGION_HOLD = 1780;
const regionLength = (n: number) =>
  Math.max(REGION_MOVE, REGION_START + (n - 1) * regionGap(n) + REGION_DRAW) + REGION_HOLD;
const REGION_AT: number[] = [];
let at = LOCAL;
for (const c of CONTINENTS) {
  REGION_AT.push(at);
  at += regionLength(c.places.length);
}
const PANORAMA = at;
// Continente que se está mostrando en el momento t
const regionAt = (t: number) => REGION_AT.filter((a) => t >= a).length - 1;
const OPEN = STAGE; // la cámara se aleja para el panorama
const SPIN = PANORAMA + OPEN;
const TURN = 20000; // una vuelta del globo con todos los destinos
const LEAVE = SPIN + TURN;
const OUT = MORPH; // vuelve la foto
/** Duración de una vuelta completa de la historia (ms) */
export const LOOP = LEAVE + OUT;

// Historia guiada por el scroll (propuesta, nov. 2026): el avance del scroll (0
// a 1) elige el momento de la historia, y al subir retrocede. Tres etapas de un
// tercio cada una: Bogotá (la foto se cierra en la ciudad y se trazan las líneas a
// las localidades), Colombia (la cámara se aleja y salen las rutas a las ciudades) y el
// mundo (continentes y, al final, el mapamundi con todas las rutas). La foto se
// cierra en el primer 8 %; el mapamundi se abre desde el 90 %.
const SCROLL_AT = [0, 0.08, 1 / 3, 2 / 3, 0.9];
const SCROLL_TIME = [PHOTO, PHOTO + MORPH, BOGOTA_END, LOCAL, PANORAMA];
// Mapamundi final: el Atlántico, de las Américas a Europa y África, con Bogotá
const ATLANTIC: View = { lon: -38, lat: 14, zoom: 1 };
/** Estado de la historia para un avance del scroll de 0 a 1 (Hero en escritorio) */
export function scrollScene(p: number): Scene {
  const x = clamp01(p);
  const end = SCROLL_AT[SCROLL_AT.length - 1];
  if (x > end) {
    // Del último continente al mapamundi, con todas las rutas
    const f = (x - end) / (1 - end);
    const s = scene(PANORAMA + OPEN * f);
    return {
      ...s,
      view: mix(CONTINENTS[CONTINENTS.length - 1].view, ATLANTIC, f),
      regionLabels: [],
      slide: 0,
    };
  }
  let i = 0;
  while (i < SCROLL_AT.length - 2 && x > SCROLL_AT[i + 1]) i++;
  const f = (x - SCROLL_AT[i]) / (SCROLL_AT[i + 1] - SCROLL_AT[i]);
  // El carrusel se queda en la primera foto (la del HTML pre-generado)
  return { ...scene(SCROLL_TIME[i] + (SCROLL_TIME[i + 1] - SCROLL_TIME[i]) * f), slide: 0 };
}

// ─── Cámara ─────────────────────────────────────────────────────────────────

// Radio del círculo donde se ve el globo y de la esfera con zoom 1 (fracción
// del lado menor del canvas)
// Con BASE 0.38 las rutas más altas (hasta 0.12 sobre la superficie) caben en
// el círculo y no se cortan al girar
const LENS = 0.46;
const BASE = 0.38;

// Bogotá: la ciudad completa (sin el sur rural de Usme, Ciudad Bolívar y Sumapaz)
const BOGOTA_VIEW: View = { lon: -74.1, lat: 4.64, zoom: 320 };
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
  if (t < ENTER) return mix(BOGOTA_VIEW, LOCAL_VIEWS[0], progress(t, BOGOTA_END, BOGOTA_MOVE));
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
  // Foto del carrusel que se ve (con decimales: la siguiente aparece encima en
  // el último 20 % de cada una); al volver, la primera
  const slide = t >= LEAVE ? 0 : Math.min(t / SLIDE, SECTOR_PHOTOS.length - 1);

  // Localidades de Bogotá: se apagan cuando la cámara empieza a alejarse
  const bogota = 1 - progress(t, BOGOTA_END, BOGOTA_MOVE * 0.45);
  // Tiempo de las líneas de Bogotá (ms desde que salen; al volver, sin trazar)
  const lines = t >= LEAVE ? 0 : Math.max(t - LINES_AT, 0);

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
      REGION_AT[i] + REGION_START + list.indexOf(p) * regionGap(list.length),
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
    bogota,
    lines,
    legs,
    localFade,
    spinning: t >= SPIN,
    photo,
    slide,
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
  bogota: 0,
  lines: 0,
  legs: CITIES.slice(1).map(() => 0),
  localFade: 0,
  spinning: false,
  photo: 0,
  slide: 0,
  morph: 1,
  map: 1,
});

// ─── Mapas de las páginas de servicio (nov. 2026) ──────────────────────────
// Un tramo de la historia de la portada, en bucle y sin el carrusel de fotos:
// "bogota" (Mudanzas locales: las localidades y las líneas que salen de la sede hacia
// las zonas exclusivas) y "mundo" (Mudanzas internacionales: de Colombia a
// cada continente y la vuelta al globo con todas las rutas). Entre vuelta y
// vuelta el mapa se funde para que el salto al comienzo no se note.
export type GlobeFocus = "bogota" | "mundo";
const FOCUS_FADE = 700;
const FOCUS_HOLD = 2600; // Bogotá completa, con todas sus líneas, antes de volver a empezar
const FOCUS_RANGE: Record<GlobeFocus, [number, number]> = {
  bogota: [LINES_AT - 400, BOGOTA_END],
  mundo: [LOCAL, LEAVE],
};
/** Estado del mapa de una página de servicio en el momento `time` (ms); con
 * `once`, la animación corre una sola vez y queda completa (sin bucle) */
export function focusScene(focus: GlobeFocus, time: number, once = false): Scene {
  const [from, to] = FOCUS_RANGE[focus];
  const len = to - from + (focus === "bogota" ? FOCUS_HOLD : 0);
  const u = once ? Math.max(0, time) : ((time % len) + len) % len;
  const s = scene(Math.min(from + u, to - 1));
  const map = once
    ? Math.min(1, u / FOCUS_FADE)
    : Math.min(1, u / FOCUS_FADE, (len - u) / FOCUS_FADE);
  return { ...s, photo: 0, slide: 0, morph: 1, map: ease(clamp01(map)) };
}
/** Vista fija (movimiento reducido) del mapa de una página de servicio */
export const focusStill = (focus: GlobeFocus): Scene =>
  focus === "mundo"
    ? stillScene()
    : { ...scene(BOGOTA_END - 1), photo: 0, slide: 0, morph: 1, map: 1 };

/** Radio del círculo del globo en píxeles (para cerrar la foto en él) */
export const lensRadius = (w: number, h: number) => Math.min(w, h) * LENS;

// ─── Dibujo ─────────────────────────────────────────────────────────────────

const ORANGE = "#FF7619";
// Gris sobre blanco (pedido del cliente, nov. 2026; antes la propuesta "noche",
// en un panel azul marino): el mar es el blanco de la página, los continentes
// gris, las fronteras blancas, Colombia (y, más suave, Estados Unidos) en el azul
// de la marca y las rutas y puntos en naranja. Textos en azul con halo blanco.
const AZUL = "#272B7C";
const HIGHLIGHT = "39,43,124"; // azul de la marca: Colombia y EE. UU.
const INK = "39,43,124"; // textos y anillo de los puntos
const MUTED = "107,110,138"; // textos secundarios y líneas tenues
const HALO = "255,255,255"; // halo de los textos y fronteras
const LAND = "176,182,196"; // continentes
const LOCALITY = "214,219,229"; // localidades de Bogotá
const SHADE = "39,43,124"; // sombras (azul muy transparente)

// Relieve 3D (prototipo pedido por el cliente, nov. 2026): Colombia de cerca y
// Bogotá son bloques con grosor, en grises; Bogotá además se ve inclinada (en perspectiva)
const WALL_DARK: [number, number, number] = [150, 156, 172]; // paredes del bloque, abajo
const WALL_LIGHT: [number, number, number] = [200, 205, 216]; // ídem, arriba
const SLAB_COLOMBIA = 9; // grosor de Colombia de cerca (px de CSS)
const SLAB_BOGOTA = 14; // grosor del bloque de Bogotá (px de CSS)
const TILT = 0.62; // achatamiento vertical de Bogotá (coseno de la inclinación, ~52°)

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
  ctx.shadowColor = `rgba(${SHADE},.22)`;
  ctx.shadowBlur = 14 * dpr;
  ctx.fillStyle = dark ? ORANGE : "#ffffff";
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
  ctx.strokeStyle = `rgba(${HALO},.9)`;
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
  ctx.save();
  // Resplandor del color del punto
  ctx.shadowColor = fill === ORANGE ? "rgba(255,118,25,.6)" : `rgba(${SHADE},.25)`;
  ctx.shadowBlur = r * 3 * dpr;
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2 * dpr;
  ctx.beginPath();
  ctx.arc(x, y, r * dpr, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.stroke();
  ctx.restore();
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

// Bloque con grosor (relieve 3D, nov. 2026): copias de `shape` corridas hacia
// abajo hasta `depth` px, de más oscuras (abajo) a más claras (arriba), con una
// sombra debajo. La cara de arriba (el mapa) queda donde estaba, así todo lo que
// va encima (rutas, nombres, líneas) no se mueve.
function drawSlab(
  ctx: CanvasRenderingContext2D,
  shape: Path2D,
  depth: number,
  dpr: number,
  dark: [number, number, number],
  light: [number, number, number],
  shadow = true,
) {
  if (depth <= 0) return;
  ctx.save();
  if (shadow) {
    ctx.save();
    ctx.translate(0, depth);
    ctx.shadowColor = `rgba(${SHADE},.2)`;
    ctx.shadowBlur = 22 * dpr;
    ctx.shadowOffsetY = 8 * dpr;
    ctx.fillStyle = `rgb(${dark})`;
    ctx.fill(shape);
    ctx.restore();
  }
  for (let d = depth; d > 0; d -= dpr) {
    const k = d / depth;
    ctx.fillStyle = `rgb(${dark.map((c, i) => Math.round(c * k + light[i] * (1 - k)))})`;
    ctx.save();
    ctx.translate(0, d);
    ctx.fill(shape);
    ctx.restore();
  }
  ctx.restore();
}

// Países, fronteras y Colombia. `close` (0 a 1): de cerca Colombia va en un
// tono claro del color resaltado, con borde pleno, para que las rutas se lean
// encima, y sobresale como un bloque. `bogota` (0 a 1): mientras se ven las
// localidades, Colombia se apaga.
function drawLand(
  ctx: CanvasRenderingContext2D,
  path: GeoPath,
  proj: GeoProjection,
  dpr: number,
  pano: number,
  close: number,
  borderWidth: number,
  bogota: number,
) {
  // Continentes en gris sobre el blanco: las regiones donde opera más oscuras y
  // el resto del mundo más tenue
  const fills = [
    `rgba(${LAND},${0.42 + 0.06 * pano})`,
    `rgba(${LAND},${0.8 + 0.1 * pano})`,
    // Estados Unidos: un tono más suave que Colombia
    `rgba(${HIGHLIGHT},.28)`,
  ];
  BY_ZONE.forEach((fc, z) => {
    ctx.fillStyle = fills[z];
    ctx.beginPath();
    path(fc);
    ctx.fill();
  });
  ctx.strokeStyle = `rgba(${HALO},.95)`;
  ctx.lineWidth = borderWidth * dpr;
  ctx.beginPath();
  path(BORDERS);
  ctx.stroke();
  // De cerca, Colombia sobresale: el bloque gris y, encima, una base blanca para
  // que el tono claro no deje ver el bloque
  if (close > 0) {
    const shape = new Path2D(geoPath(proj)(COLOMBIA) ?? "");
    ctx.save();
    ctx.globalAlpha *= close * (1 - bogota);
    drawSlab(ctx, shape, SLAB_COLOMBIA * dpr * close, dpr, WALL_DARK, WALL_LIGHT);
    ctx.fillStyle = "#ffffff";
    ctx.fill(shape);
    ctx.restore();
  }
  ctx.beginPath();
  path(COLOMBIA);
  ctx.fillStyle = `rgba(${HIGHLIGHT},${(0.85 - 0.75 * close) * (1 - bogota)})`;
  ctx.fill();
  ctx.strokeStyle = close > 0 ? `rgb(${HIGHLIGHT})` : `rgba(${HALO},.95)`;
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
  hits: Hit[],
) {
  if (alpha <= 0) return;
  const { width: W, height: H } = ctx.canvas;
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
    ctx.strokeStyle = on ? ORANGE : `rgba(${MUTED},.55)`;
    ctx.lineWidth = (on ? 2.4 : 1.6) * dpr;
    ctx.setLineDash([2 * dpr, 7 * dpr]);
    if (on) {
      ctx.shadowColor = "rgba(255,118,25,.35)";
      ctx.shadowBlur = 6 * dpr;
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
    ctx.fillStyle = `rgba(${INK},.35)`;
    ctx.textAlign = "center";
    ctx.fillText(labels.country.toUpperCase(), n[0], n[1]);
    ctx.textAlign = "start";
    ctx.letterSpacing = "0px";
  }
  // Bogotá con pastilla; las demás capitales con punto y nombre al llegar su ruta
  // Con Colombia bien a la vista, las ciudades se pueden tocar (su foto)
  const touchable = alpha > 0.5;
  const lens = lensRadius(W, H);
  CITIES.forEach((c, i) => {
    const p = proj([c.lon, c.lat]);
    if (!p || (i > 0 && s.legs[i - 1] < 1)) return;
    if (touchable && Math.hypot(p[0] - W / 2, p[1] - H / 2) < lens)
      hits.push({ kind: "city", place: c, x: p[0] / dpr, y: p[1] / dpr });
    if (labels.selected === c.name) {
      ctx.strokeStyle = ORANGE;
      ctx.lineWidth = 2 * dpr;
      ctx.beginPath();
      ctx.arc(p[0], p[1], 11 * dpr, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (i === 0) {
      pulse(ctx, p[0], p[1], dpr, time, "255,118,25");
      pin(ctx, p[0], p[1], dpr, 6, "#ffffff", ORANGE);
      pill(ctx, p[0], p[1], labels.origin, dpr, true, "right");
      return;
    }
    pin(ctx, p[0], p[1], dpr, 4, ORANGE, AZUL);
    tag(ctx, p[0], p[1], c.name, dpr, c.side);
  });
  ctx.restore();
}

// Proyección de Bogotá inclinada: la normal, achatada en vertical alrededor del
// centro del canvas. Sirve como función ([lon, lat] → px), con `invert` (qué se
// toca) y con geoPath (sin recorte: Bogotá es pequeña y siempre está de frente)
type Flat = ((p: [number, number]) => [number, number] | null) & {
  invert: (p: [number, number]) => [number, number] | null;
  stream: GeoStreamWrapper["stream"];
};
function tilted(proj: GeoProjection, cy: number): Flat {
  const f = (p: [number, number]) => {
    const q = proj(p);
    return q ? ([q[0], cy + (q[1] - cy) * TILT] as [number, number]) : null;
  };
  const { stream } = geoTransform({
    point(x, y) {
      const q = f([x, y]);
      if (q) this.stream.point(q[0], q[1]);
    },
  });
  return Object.assign(f, {
    stream,
    invert: ([x, y]: [number, number]) => proj.invert?.([x, cy + (y - cy) / TILT]) ?? null,
  });
}

// Proyección del último cuadro con las localidades a la vista (para saber cuál
// se toca); null si no se ven
let localityView: { flat: Flat; dpr: number } | null = null;

// Nombres de las localidades: primero las grandes (por el tamaño de su recuadro);
// las más pequeñas del centro, si no caben, muestran su nombre al tocarlas
const span = (l: (typeof LOCALITIES)[number]) => {
  const pts = l.geometry.coordinates.flat(2);
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  return (Math.max(...xs) - Math.min(...xs)) * (Math.max(...ys) - Math.min(...ys));
};
const LOCALITY_LABELS = [...LOCALITIES].sort((a, b) => span(b) - span(a));

// Casa de la sede (Puente Aranda), de donde salen las líneas
const HOUSE = new Path2D("M4.2,8L8,4.6L11.8,8V11.6H9.2V9.4H6.8V11.6H4.2Z");

// Siluetas de las localidades en pantalla (cambian solo al mover la cámara)
type Shapes = { key: string; all: Path2D; each: Map<string, Path2D> };
let shapes: Shapes | null = null;
function bogotaShapes(flat: Flat, key: string) {
  if (shapes?.key !== key) {
    const path = geoPath(flat);
    const each = new Map(LOCALITIES.map((l) => [l.name, new Path2D(path(l.geometry) ?? "")]));
    const all = new Path2D();
    for (const p of each.values()) all.addPath(p);
    shapes = { key, all, each };
  }
  return shapes;
}

// Las localidades en gris claro, sobre un bloque gris con grosor y sombra suave,
// con fronteras blancas (gris sobre blanco, nov. 2026)
function paintLocalities(ctx: CanvasRenderingContext2D, sh: Shapes, dpr: number) {
  drawSlab(ctx, sh.all, SLAB_BOGOTA * dpr, dpr, WALL_DARK, WALL_LIGHT);
  ctx.fillStyle = `rgb(${LOCALITY})`;
  ctx.fill(sh.all);
}
function paintBorders(ctx: CanvasRenderingContext2D, sh: Shapes, dpr: number) {
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1.6 * dpr;
  ctx.lineJoin = "round";
  ctx.stroke(sh.all);
}
let bogotaKey = "";
let bogotaCache: { key: string; under: HTMLCanvasElement; over: HTMLCanvasElement } | null = null;

// Línea de la sede a una localidad (px): un arco suave, siempre hacia el mismo
// lado, en LINE_STEPS tramos
const LINE_STEPS = 40;
function arc(a: [number, number], b: [number, number]) {
  const bend = 0.16;
  const c = [(a[0] + b[0]) / 2 - (b[1] - a[1]) * bend, (a[1] + b[1]) / 2 + (b[0] - a[0]) * bend];
  return Array.from({ length: LINE_STEPS + 1 }, (_, i) => {
    const t = i / LINE_STEPS;
    const u = 1 - t;
    return [
      u * u * a[0] + 2 * u * t * c[0] + t * t * b[0],
      u * u * a[1] + 2 * u * t * c[1] + t * t * b[1],
    ] as [number, number];
  });
}

type Box = [number, number, number, number];
const endFont = (fine: boolean, dpr: number) =>
  `${fine ? 700 : 600} ${10.5 * dpr}px Montserrat, system-ui, sans-serif`;
const overlap = (a: Box, b: Box) =>
  Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0])) *
  Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1]));
// Lugar del nombre de cada localidad junto al punto al que llega su línea (mapa
// `plain`): se prueban posiciones alrededor del punto (arriba, abajo, a los
// lados y en diagonal) y se toma la primera que no tapa otro nombre, otro punto
// ni la sede; si ninguna está libre, la que menos tapa. Se calcula con todas las
// líneas, no solo las ya trazadas: así un nombre no salta cuando llega otro.
// Devuelve la caja (px del lienzo) de cada nombre.
function placeEndLabels(
  ctx: CanvasRenderingContext2D,
  flat: Flat,
  home: [number, number] | null,
  dpr: number,
): Map<string, Box> {
  const pts = LINES.map((l) => ({ ...l, at: flat(l.to) })).filter(
    (l): l is (typeof LINES)[number] & { at: [number, number] } => !!l.at,
  );
  const busy: Box[] = pts.map(({ at: [x, y] }) => [
    x - 4 * dpr,
    y - 4 * dpr,
    x + 4 * dpr,
    y + 4 * dpr,
  ]);
  if (home) {
    const r = 14 * dpr;
    busy.push([home[0] - r, home[1] - r, home[0] + r, home[1] + r]);
  }
  // Primero las exclusivas y luego las que tienen más vecinos cerca (las del
  // centro), que son las que menos opciones tienen
  const near = (p: (typeof pts)[number]) =>
    pts.filter((q) => Math.hypot(q.at[0] - p.at[0], q.at[1] - p.at[1]) < 60 * dpr).length;
  const order = [...pts].sort((a, b) => Number(b.fine) - Number(a.fine) || near(b) - near(a));
  const out = new Map<string, Box>();
  ctx.save();
  for (const p of order) {
    ctx.font = endFont(p.fine, dpr);
    const w = ctx.measureText(p.name).width + 2 * dpr;
    const h = 12 * dpr;
    const g = (p.fine ? 8 : 5) * dpr;
    const d = g * 0.7;
    const [x, y] = p.at;
    const options: Box[] = [
      [x - w / 2, y - g - h, x + w / 2, y - g], // arriba
      [x + g, y - h / 2, x + g + w, y + h / 2], // derecha
      [x - g - w, y - h / 2, x - g, y + h / 2], // izquierda
      [x - w / 2, y + g, x + w / 2, y + g + h], // abajo
      [x + d, y - d - h, x + d + w, y - d], // arriba a la derecha
      [x - d - w, y - d - h, x - d, y - d], // arriba a la izquierda
      [x + d, y + d, x + d + w, y + d + h], // abajo a la derecha
      [x - d - w, y + d, x - d, y + d + h], // abajo a la izquierda
    ];
    let best = options[0];
    let bestCost = Infinity;
    for (const o of options) {
      const cost = busy.reduce((sum, b) => sum + overlap(o, b), 0);
      if (cost < bestCost) [best, bestCost] = [o, cost];
      if (cost === 0) break;
    }
    busy.push(best);
    out.set(p.name, best);
  }
  ctx.restore();
  return out;
}

// Bogotá con sus localidades, inclinada y en bloque, con las líneas desde la sede
// y los nombres (uno que se montaría sobre otro ya puesto se omite)
function drawBogota(
  ctx: CanvasRenderingContext2D,
  proj: GeoProjection,
  s: Scene,
  dpr: number,
  time: number,
  labels: GlobeLabels,
) {
  const { width: W, height: H } = ctx.canvas;
  const flat = tilted(proj, H / 2);
  localityView = s.bogota > 0.5 && s.map > 0.5 ? { flat, dpr } : null;
  if (s.bogota <= 0) return;
  ctx.save();
  ctx.globalAlpha *= s.bogota;
  // La base (bloque, relleno) y los bordes no cambian mientras la cámara está
  // quieta: se dibujan una vez aparte y se copian (dibujarlos en cada cuadro hacía
  // ir a saltos la animación). Encima, cada cuadro, la localidad resaltada
  const key = `${W}x${H}:${proj.scale()}:${proj.rotate()}:${proj.translate()}:${dpr}`;
  const sh = bogotaShapes(flat, key);
  const still = key === bogotaKey;
  bogotaKey = key;
  if (still && bogotaCache?.key !== key) {
    const layers = [0, 1].map(() => {
      const c = document.createElement("canvas");
      [c.width, c.height] = [W, H];
      return c;
    });
    const [under, over] = layers.map((c) => c.getContext("2d")!);
    paintLocalities(under, sh, dpr);
    paintBorders(over, sh, dpr);
    bogotaCache = { key, under: layers[0], over: layers[1] };
  }
  const cache = still && bogotaCache?.key === key ? bogotaCache : null;
  if (cache) ctx.drawImage(cache.under, 0, 0);
  else paintLocalities(ctx, sh, dpr);
  // La que se toca o está bajo el puntero, en naranja suave
  for (const name of new Set([labels.selected, labels.hovered])) {
    const shape = name && sh.each.get(name);
    if (!shape) continue;
    ctx.fillStyle = "rgba(255,118,25,.3)";
    ctx.fill(shape);
  }
  if (cache) ctx.drawImage(cache.over, 0, 0);
  else paintBorders(ctx, sh, dpr);

  // Líneas discontinuas muy finas desde la sede: azules a las localidades y
  // naranja, un poco más gruesas y con resplandor, a las exclusivas. Ya trazadas,
  // los trazos avanzan despacio hacia la localidad
  const home = flat(HOME);
  const arrived = new Set<string>();
  // Con `plain`: nombres sobre el punto de llegada de cada línea (se escriben al final)
  const ends: { name: string; at: [number, number]; fine: boolean; a: number }[] = [];
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (const l of LINES) {
    const amount = progress(s.lines, l.start, LINE_DRAW);
    const to = flat(l.to);
    if (amount <= 0 || !home || !to) continue;
    const pts = arc(home, to);
    const head = ease(amount) * LINE_STEPS;
    const k = Math.floor(head);
    const f = head - k;
    const tip: [number, number] =
      k >= LINE_STEPS
        ? pts[LINE_STEPS]
        : [
            pts[k][0] + (pts[k + 1][0] - pts[k][0]) * f,
            pts[k][1] + (pts[k + 1][1] - pts[k][1]) * f,
          ];
    const line = new Path2D();
    line.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i <= k; i++) line.lineTo(pts[i][0], pts[i][1]);
    line.lineTo(tip[0], tip[1]);
    ctx.lineDashOffset = -time * 0.012 * dpr;
    if (l.fine) {
      ctx.setLineDash([]);
      ctx.strokeStyle = "rgba(255,118,25,.16)";
      ctx.lineWidth = 6 * dpr;
      ctx.stroke(line);
      ctx.setLineDash([5 * dpr, 4 * dpr]);
      ctx.strokeStyle = ORANGE;
      ctx.lineWidth = 1.7 * dpr;
    } else {
      ctx.setLineDash([3 * dpr, 4 * dpr]);
      ctx.strokeStyle = `rgba(${INK},.7)`;
      ctx.lineWidth = 0.9 * dpr;
    }
    ctx.stroke(line);
    ctx.setLineDash([]);
    if (amount >= 1) arrived.add(l.name);
    if (labels.plain && amount > 0.85)
      ends.push({ name: l.name, at: to, fine: l.fine, a: (amount - 0.85) / 0.15 });
    // Punta de la línea y, al llegar, el punto de la localidad (con pulso en las
    // exclusivas)
    if (l.fine) {
      if (amount >= 1) pulse(ctx, to[0], to[1], dpr, time, "255,118,25");
      pin(ctx, tip[0], tip[1], dpr, amount >= 1 ? 3.5 : 2.5, ORANGE, "#ffffff");
    } else {
      ctx.fillStyle = `rgb(${INK})`;
      ctx.beginPath();
      ctx.arc(tip[0], tip[1], (amount >= 1 ? 2 : 1.6) * dpr, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  // La sede, encima de las líneas
  if (home) {
    ctx.save();
    ctx.translate(home[0], home[1]);
    pulse(ctx, 0, 0, dpr, time, "255,118,25");
    ctx.shadowColor = `rgba(${SHADE},.25)`;
    ctx.shadowBlur = 8 * dpr;
    ctx.fillStyle = ORANGE;
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2 * dpr;
    ctx.beginPath();
    ctx.arc(0, 0, 11 * dpr, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.stroke();
    ctx.scale(1.3 * dpr, 1.3 * dpr);
    ctx.translate(-8, -8.1);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill(HOUSE);
    ctx.restore();
  }
  const n = labels.plain ? null : flat([-74.2, 4.78]);
  if (n) {
    ctx.font = `700 ${15 * dpr}px "IBM Plex Sans", system-ui, sans-serif`;
    ctx.letterSpacing = `${4 * dpr}px`;
    ctx.fillStyle = `rgba(${INK},.35)`;
    ctx.textAlign = "center";
    ctx.fillText(labels.city.toUpperCase(), n[0], n[1]);
    ctx.letterSpacing = "0px";
  }
  // Crédito del mapa (lo exige la licencia): abajo a la derecha; con `plain`
  // no va en el mapa sino en el pie de página
  if (!labels.plain) {
    ctx.font = `500 ${9 * dpr}px Montserrat, system-ui, sans-serif`;
    ctx.fillStyle = `rgb(${MUTED})`;
    ctx.textAlign = "center";
    const lens = lensRadius(W, H);
    ctx.fillText(labels.cityCredit, W / 2 + lens * 0.42, H / 2 + lens * 0.64);
  }
  if (labels.plain) {
    const spots = placeEndLabels(ctx, flat, home, dpr);
    for (const e of ends) {
      const b = spots.get(e.name);
      if (!b) continue;
      ctx.save();
      ctx.globalAlpha *= e.a;
      ctx.font = endFont(e.fine, dpr);
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      const x = b[0] + dpr;
      const y = (b[1] + b[3]) / 2;
      ctx.lineWidth = 3 * dpr;
      ctx.strokeStyle = `rgba(${HALO},.9)`;
      ctx.strokeText(e.name, x, y);
      ctx.fillStyle = e.fine ? "#E8620A" : `rgb(${INK})`;
      ctx.fillText(e.name, x, y);
      ctx.restore();
    }
  }
  const placed: Box[] = [];
  for (const l of labels.plain ? [] : LOCALITY_LABELS) {
    const p = flat([l.lon, l.lat]);
    if (!p) continue;
    // Las exclusivas, en negrita y, con su línea ya trazada, en naranja
    const fine = FINE.has(l.name);
    ctx.font = `${fine ? 700 : 600} ${10 * dpr}px Montserrat, system-ui, sans-serif`;
    const w = ctx.measureText(l.name).width + 4 * dpr;
    const h = 6.5 * dpr;
    const box: [number, number, number, number] = [p[0] - w / 2, p[1] - h, p[0] + w / 2, p[1] + h];
    if (placed.some((b) => box[0] < b[2] && box[2] > b[0] && box[1] < b[3] && box[3] > b[1]))
      continue;
    placed.push(box);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineWidth = 3 * dpr;
    ctx.strokeStyle = `rgba(${HALO},.9)`;
    ctx.strokeText(l.name, p[0], p[1]);
    ctx.fillStyle = fine && arrived.has(l.name) ? "#E8620A" : `rgb(${INK})`;
    ctx.fillText(l.name, p[0], p[1]);
  }
  ctx.textAlign = "start";
  ctx.restore();
}

/** Localidad de Bogotá bajo el punto (px de CSS del canvas), si se ven */
export function localityAt(x: number, y: number): Hit | null {
  const v = localityView;
  if (!v) return null;
  const at = v.flat.invert([x * v.dpr, y * v.dpr]);
  const l = at && LOCALITIES.find((l) => geoContains(l.geometry, at));
  return l ? { kind: "locality", place: l, x, y } : null;
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

/** Dibuja el mapa en el estado `s` (de scene o stillScene) y devuelve dónde
 * quedaron los destinos a la vista */
export function drawGlobe(
  ctx: CanvasRenderingContext2D,
  s: Scene,
  time: number,
  labels: GlobeLabels,
  dpr: number,
): Hit[] {
  const { width: W, height: H } = ctx.canvas;
  ctx.clearRect(0, 0, W, H);
  const hits: Hit[] = [];
  if (s.map <= 0) return hits;
  const v = s.view;
  const cx = W / 2;
  const cy = H / 2;
  const lens = lensRadius(W, H);
  const R = Math.min(W, H) * BASE * v.zoom * (labels.scale ?? 1);
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

  // El globo no se dibuja mientras no se ve (las localidades lo tapan): dibujarlo
  // igual hacía ir a saltos la animación
  if (s.bogota < 1) {
    ctx.save();
    // Mientras se ven las localidades de Bogotá no se ve el globo (pedido del
    // cliente, nov. 2026): aparece cuando la cámara se aleja hacia Colombia
    ctx.globalAlpha = s.map * (1 - s.bogota);

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, lens, 0, Math.PI * 2);
    ctx.clip();

    // El mar es el blanco de la página: solo la retícula, muy tenue, y de lejos
    // el borde del globo
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    path(SPHERE);
    ctx.fill();
    ctx.strokeStyle = `rgba(${LAND},${0.28 + 0.2 * (1 - near)})`;
    ctx.lineWidth = 1.2 * dpr;
    ctx.stroke();
    ctx.strokeStyle = `rgba(${LAND},.22)`;
    ctx.lineWidth = dpr;
    ctx.beginPath();
    path(GRATICULE);
    ctx.stroke();
    drawLand(
      ctx,
      path,
      proj,
      dpr,
      s.pano,
      close,
      Math.max(0.6, Math.min(1.6, v.zoom * 0.4)),
      s.bogota,
    );
    // Luz de esfera (relieve 3D, nov. 2026; solo de lejos): el borde en una
    // sombra azul muy suave, sobre los continentes
    if (near < 1) {
      const light = ctx.createRadialGradient(cx - R * 0.42, cy - R * 0.48, 0, cx, cy, R);
      light.addColorStop(0, "rgba(255,255,255,0)");
      light.addColorStop(0.7, `rgba(${SHADE},0)`);
      light.addColorStop(1, `rgba(${SHADE},${0.07 * (1 - near)})`);
      ctx.fillStyle = light;
      ctx.beginPath();
      path(SPHERE);
      ctx.fill();
    }
    drawLocal(ctx, proj, s, dpr, time, labels, s.localFade * close * (1 - s.bogota), hits);

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
    ctx.strokeStyle = "rgba(255,118,25,.18)";
    ctx.stroke(back);
    // Resplandor: un trazo ancho y tenue debajo del trazo fino
    ctx.save();
    ctx.lineWidth = 6 * dpr;
    ctx.strokeStyle = "rgba(255,118,25,.16)";
    ctx.stroke(front);
    ctx.restore();
    ctx.lineWidth = 1.6 * dpr;
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
      if (Math.hypot(x - cx, y - cy) > lens) continue;
      hits.push({ kind: "country", place: d, x: x / dpr, y: y / dpr });
      if (labels.selected === d.name) {
        ctx.strokeStyle = ORANGE;
        ctx.lineWidth = 2 * dpr;
        ctx.beginPath();
        ctx.arc(x, y, 9 * dpr, 0, Math.PI * 2);
        ctx.stroke();
      }
      pin(ctx, x, y, dpr, 3.5, ORANGE, AZUL);
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
      // En naranja y con pastilla blanca, para que se vean sobre los continentes negros
      pulse(ctx, x, y, dpr, time, "255,118,25");
      pin(ctx, x, y, dpr, 5.5, "#ffffff", ORANGE);
      if (!s.spinning) pill(ctx, x, y, labels.origin, dpr, false, "below");
    }

    // De cerca, el círculo es una lupa sin borde: el mapa se funde con el blanco
    // de la página hacia el borde, así no parece una tarjeta
    if (near > 0) {
      const feather = ctx.createRadialGradient(cx, cy, lens * 0.72, cx, cy, lens);
      feather.addColorStop(0, "rgba(255,255,255,0)");
      feather.addColorStop(1, `rgba(255,255,255,${near})`);
      ctx.fillStyle = feather;
      ctx.fillRect(cx - lens, cy - lens, lens * 2, lens * 2);
    }

    ctx.restore(); // fin del círculo
    ctx.restore();
  }

  // Bogotá: solo las localidades, sobre el fondo de la página, fuera del círculo;
  // se dibujan aparte para desvanecer hacia abajo el sur rural, que sigue más
  // allá del encuadre
  localityView = null;
  if (s.bogota > 0) {
    layer ??= document.createElement("canvas");
    if (layer.width !== W || layer.height !== H) [layer.width, layer.height] = [W, H];
    const lc = layer.getContext("2d")!;
    lc.clearRect(0, 0, W, H);
    drawBogota(lc, proj, s, dpr, time, labels);
    lc.save();
    lc.globalCompositeOperation = "destination-in";
    // (con `scale`, el fundido crece con el mapa)
    const k = labels.scale ?? 1;
    const fade = lc.createLinearGradient(0, cy + lens * k * 0.55, 0, cy + lens * k * 0.98);
    fade.addColorStop(0, "#000");
    fade.addColorStop(1, "rgba(0,0,0,0)");
    lc.fillStyle = fade;
    lc.fillRect(0, 0, W, H);
    lc.restore();
    ctx.save();
    ctx.globalAlpha = s.map;
    ctx.drawImage(layer, 0, 0);
    // Mapa `plain`: sin crédito en el mapa (pedido del equipo, nov. 2026); el
    // crédito que exige la licencia va en el pie de página (Footer, mapCredit)
    ctx.restore();
  }
  return hits;
}
let layer: HTMLCanvasElement | null = null;
