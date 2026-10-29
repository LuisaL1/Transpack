// Globo de la portada: proyección 3D, rutas en arco, recorrido de la cámara y
// dibujo en <canvas>. Sin React (el bucle de animación está en
// src/hooks/useGlobe.ts y el componente en components/home/Globe.tsx).
//
// Historia (en bucle): Colombia de cerca → una a una las capitales de los
// países con embajadas atendidas, de la más cercana a la más lejana, con su
// ruta desde Bogotá → el globo se aleja y gira mostrando todos los destinos.
import { DESTINATIONS, ORIGIN } from "@/data/worldMap";

export type Place = { name: string; lon: number; lat: number; embassy?: boolean };
export type View = { lon: number; lat: number; zoom: number };
/** Textos que dibuja el globo (vienen de src/data/home.ts, en el idioma de la página) */
export type GlobeLabels = { origin: string; stop: (p: Place) => string };
/** Interacción del visitante: el puntero sobre el lienzo */
export type Interaction = {
  /** Puntero sobre el lienzo (px del canvas), o null si no está encima */
  pointer: { x: number; y: number } | null;
};
/** Resultado del dibujo: el destino bajo el puntero, si hay uno */
export type DrawResult = { hovered: Place | null };

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
 * Proyección ortográfica: x a la derecha, y hacia arriba, z hacia quien mira
 * (z > 0 = cara visible). `alt` eleva el punto sobre la superficie (rutas).
 */
export function project(lon: number, lat: number, v: View, alt = 0) {
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

// ─── Rutas ──────────────────────────────────────────────────────────────────

const ROUTE_STEPS = 64;
/** Puntos de la ruta Bogotá → destino, elevada en el medio según la distancia */
function route(to: Place) {
  const a = toVec(ORIGIN);
  const b = toVec(to);
  const h = 0.04 + 0.16 * (angle(a, b) / Math.PI);
  return Array.from({ length: ROUTE_STEPS + 1 }, (_, i) => {
    const t = i / ROUTE_STEPS;
    return { ...toPlace(slerp(a, b, t)), alt: h * Math.sin(Math.PI * t) };
  });
}
const ROUTES = new Map(DESTINATIONS.map((d) => [d.name, route(d)]));

// ─── Recorrido de la cámara ─────────────────────────────────────────────────

// Acercamientos de 1 como máximo: la esfera siempre cabe completa en el lienzo
// (no se ve recortada al empezar en Colombia)
const START: View = { lon: ORIGIN.lon, lat: ORIGIN.lat, zoom: 1 };
const INTRO = 1800; // Colombia de cerca
const STEP = 2000; // cada capital
const MOVE = 1000; // la cámara gira hacia la capital
const DRAW_FROM = 350; // la ruta empieza a trazarse
const DRAW = 900;
const HOLD = 700; // pausa en la última capital
const OPEN = 1800; // el globo se aleja para el panorama
const TURN = 24000; // una vuelta completa mostrando todos los destinos
const BACK = 2200; // regreso a Colombia

/** Capitales con embajadas atendidas, de la más cercana a la más lejana de Bogotá */
export const STOPS: Place[] = DESTINATIONS.filter((d) => d.embassy).sort(
  (a, b) => angle(toVec(ORIGIN), toVec(a)) - angle(toVec(ORIGIN), toVec(b)),
);
const stopAt = (i: number) => INTRO + i * STEP;
const PANORAMA = stopAt(STOPS.length) + HOLD;
const SPIN = PANORAMA + OPEN;
/** Duración de una vuelta completa de la historia (ms) */
export const LOOP = SPIN + TURN + BACK;

// Encuadre de cada capital: mira al punto medio de la ruta (algo más cerca de
// la capital) y se aleja más cuanto más lejos está
function frame(to: Place): View {
  const a = toVec(ORIGIN);
  const b = toVec(to);
  const mid = toPlace(slerp(a, b, 0.6));
  const far = angle(a, b) / Math.PI;
  return { lon: mid.lon, lat: Math.max(-10, Math.min(35, mid.lat)), zoom: 1 - far * 0.08 };
}
const PANO_LAT = 14;
const lastFrame = frame(STOPS[STOPS.length - 1]);

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

/** Estado de la historia en el momento t (ms, dentro del bucle) */
export function scene(time: number) {
  const t = ((time % LOOP) + LOOP) % LOOP;
  const current = STOPS.findIndex((_, i) => t >= stopAt(i) && t < stopAt(i + 1));
  let view: View;
  if (t < INTRO) view = START;
  else if (t < PANORAMA) {
    const i = Math.min(Math.floor((t - INTRO) / STEP), STOPS.length - 1);
    const from = i === 0 ? START : frame(STOPS[i - 1]);
    view = mix(from, frame(STOPS[i]), progress(t, stopAt(i), MOVE));
  } else if (t < SPIN)
    view = mix(
      lastFrame,
      { lon: lastFrame.lon, lat: PANO_LAT, zoom: 1 },
      progress(t, PANORAMA, OPEN),
    );
  else if (t < SPIN + TURN)
    // La Tierra gira de oeste a este: el centro del globo avanza hacia el oeste
    view = { lon: lastFrame.lon - 360 * ((t - SPIN) / TURN), lat: PANO_LAT, zoom: 1 };
  else
    view = mix(
      { lon: lastFrame.lon, lat: PANO_LAT, zoom: 1 },
      START,
      progress(t, SPIN + TURN, BACK),
    );

  // Cuánto de cada ruta se ve (0 a 1): las capitales en su turno, el resto en el panorama
  const pano = progress(t, PANORAMA + 300, OPEN);
  const back = 1 - progress(t, SPIN + TURN, BACK * 0.5);
  const drawn = (p: Place) => {
    const i = STOPS.indexOf(p);
    const own = i >= 0 ? progress(t, stopAt(i) + DRAW_FROM, DRAW) : pano;
    return own * back;
  };
  return { t, view, current, pano, drawn, spinning: t >= SPIN && t < SPIN + TURN };
}

/** Vista fija (movimiento reducido): el Atlántico, de las Américas a Europa y África */
export const STILL = { view: { lon: -35, lat: 18, zoom: 1 } as View };

// ─── Dibujo ─────────────────────────────────────────────────────────────────

const ORANGE = "#FF7619";
const PEACH = "255,178,122";

// Pastilla con texto (etiquetas de Bogotá y de la capital en turno)
function pill(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  dpr: number,
  dark: boolean,
  above: boolean,
) {
  ctx.font = `600 ${12 * dpr}px Montserrat, system-ui, sans-serif`;
  const w = ctx.measureText(text).width + 22 * dpr;
  const h = 24 * dpr;
  const left = Math.min(Math.max(x - w / 2, 4 * dpr), ctx.canvas.width - w - 4 * dpr);
  const top = above ? y - h - 12 * dpr : y + 12 * dpr;
  ctx.save();
  ctx.shadowColor = "rgba(13,15,51,.35)";
  ctx.shadowBlur = 12 * dpr;
  ctx.fillStyle = dark ? ORANGE : "#ffffff";
  ctx.beginPath();
  ctx.roundRect(left, top, w, h, h / 2);
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = dark ? "#ffffff" : "#1b1e5c";
  ctx.textBaseline = "middle";
  ctx.fillText(text, left + 11 * dpr, top + h / 2 + 0.5 * dpr);
}

/**
 * Dibuja el globo en el momento t. `dots`: puntos de tierra de
 * src/data/worldGlobe.ts. `still`: vista fija sin historia.
 */
export function drawGlobe(
  ctx: CanvasRenderingContext2D,
  dots: number[],
  time: number,
  labels: GlobeLabels,
  dpr: number,
  still = false,
  inter: Interaction = { pointer: null },
): DrawResult {
  const { width: W, height: H } = ctx.canvas;
  const s = still
    ? { ...STILL, t: 0, current: -1, pano: 1, drawn: () => 1, spinning: true }
    : scene(time);
  const v = s.view;
  // Sin halo ni elementos fuera de la esfera (pedido del cliente): el globo
  // ocupa casi todo el lienzo
  const R = Math.min(W, H) * 0.47 * v.zoom;
  const cx = W / 2;
  const cy = H / 2;
  const px = (p: { x: number; y: number }) => [cx + R * p.x, cy - R * p.y] as const;
  ctx.clearRect(0, 0, W, H);

  // Esfera azul de marca, iluminada arriba a la izquierda
  const sphere = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R);
  sphere.addColorStop(0, "#34399A");
  sphere.addColorStop(0.55, "#272B7C");
  sphere.addColorStop(1, "#0D0F33");
  ctx.fillStyle = sphere;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.fill();

  // Malla de meridianos y paralelos (cada 15°), tenue pero presente, como la
  // retícula del planeta de la referencia
  ctx.strokeStyle = "rgba(255,255,255,.11)";
  ctx.lineWidth = dpr;
  ctx.beginPath();
  const line = (pts: [number, number][]) => {
    let pen = false;
    for (const [lon, lat] of pts) {
      const p = project(lon, lat, v);
      if (p.z <= 0) {
        pen = false;
        continue;
      }
      const [x, y] = px(p);
      if (pen) ctx.lineTo(x, y);
      else ctx.moveTo(x, y);
      pen = true;
    }
  };
  for (let lon = -180; lon < 180; lon += 15)
    line(Array.from({ length: 41 }, (_, i): [number, number] => [lon, -80 + i * 4]));
  for (let lat = -75; lat <= 75; lat += 15)
    line(Array.from({ length: 91 }, (_, i): [number, number] => [-180 + i * 4, lat]));
  ctx.stroke();

  // Tierra: un punto por celda; más tenues hacia el borde de la esfera. Se
  // agrupan por zona y brillo para cambiar de color pocas veces.
  const size = Math.max(1.2 * dpr, R * 0.0072);
  const groups: number[][] = Array.from({ length: 16 }, () => []);
  for (let i = 0; i < dots.length; i += 3) {
    const p = project(dots[i] / 10, dots[i + 1] / 10, v);
    if (p.z <= 0.02) continue;
    const [x, y] = px(p);
    groups[dots[i + 2] * 4 + Math.min(3, Math.floor(p.z * 4))].push(x, y);
  }
  groups.forEach((g, k) => {
    const zone = k >> 2;
    const a = 0.35 + 0.65 * (((k & 3) + 0.5) / 4);
    ctx.fillStyle =
      zone === 3
        ? ORANGE
        : zone === 2
          ? `rgba(${PEACH},${a})`
          : `rgba(255,255,255,${a * (zone === 1 ? 0.5 + 0.35 * s.pano : 0.4)})`;
    for (let j = 0; j < g.length; j += 2)
      ctx.fillRect(g[j] - size / 2, g[j + 1] - size / 2, size, size);
  });
  // Destino bajo el puntero (el más cercano a menos de 22 px, en la cara visible)
  let hovered: Place | null = null;
  if (inter.pointer) {
    let best = 22 * dpr;
    for (const d of DESTINATIONS) {
      const q = project(d.lon, d.lat, v);
      if (q.z <= 0) continue;
      const [x, y] = px(q);
      const dist = Math.hypot(x - inter.pointer.x, y - inter.pointer.y);
      if (dist < best) {
        best = dist;
        hovered = d;
      }
    }
  }

  // Rutas: la de la capital en turno en naranja; las demás en blanco
  // Por detrás del globo solo se ve lo que asoma por encima del borde
  const visible = (p: { x: number; y: number; z: number }) =>
    p.z > 0 || (p.x * p.x + p.y * p.y > 1 && p.z > -0.35);
  ctx.lineCap = "round";
  for (const d of DESTINATIONS) {
    const amount = s.drawn(d);
    if (amount <= 0) continue;
    const pts = ROUTES.get(d.name)!;
    const on = STOPS[s.current] === d || hovered === d;
    const end = Math.max(1, Math.round(ease(amount) * ROUTE_STEPS));
    ctx.save();
    ctx.strokeStyle = on ? ORANGE : `rgba(255,255,255,${d.embassy ? 0.7 : 0.45})`;
    ctx.lineWidth = (on ? 2.4 : 1.3) * dpr;
    if (on) {
      ctx.shadowColor = ORANGE;
      ctx.shadowBlur = 10 * dpr;
    }
    ctx.beginPath();
    let pen = false;
    for (let i = 0; i <= end; i++) {
      const q = project(pts[i].lon, pts[i].lat, v, pts[i].alt);
      if (!visible(q)) {
        pen = false;
        continue;
      }
      const [x, y] = px(q);
      if (pen) ctx.lineTo(x, y);
      else ctx.moveTo(x, y);
      pen = true;
    }
    ctx.stroke();
    ctx.restore();

    // Una luz recorre cada ruta terminada, con estela (cometa); en naranja la
    // ruta en turno
    if (amount >= 1 && !still) {
      const head = ((time / 2400 + d.lon / 90) % 1 + 1) % 1;
      const kh = Math.floor(head * ROUTE_STEPS);
      ctx.save();
      for (let j = 6; j >= 0; j--) {
        const k = kh - j * 2;
        if (k < 0) continue;
        const q = project(pts[k].lon, pts[k].lat, v, pts[k].alt);
        if (!visible(q)) continue;
        const [x, y] = px(q);
        const a = 1 - j / 7;
        ctx.fillStyle = on ? `rgba(255,178,122,${a})` : `rgba(255,255,255,${a * 0.9})`;
        if (j === 0) {
          ctx.shadowColor = on ? ORANGE : "#ffffff";
          ctx.shadowBlur = 10 * dpr;
        }
        ctx.beginPath();
        ctx.arc(x, y, (on ? 2.8 : 2.2) * dpr * (0.45 + 0.55 * a), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Punto del destino (cuando la ruta llegó)
    if (amount >= 1) {
      const q = project(d.lon, d.lat, v);
      if (q.z > 0) {
        const [x, y] = px(q);
        if (on) {
          const pulse = (time % 1600) / 1600;
          ctx.fillStyle = `rgba(255,118,25,${0.45 * (1 - pulse)})`;
          ctx.beginPath();
          ctx.arc(x, y, (6 + 16 * pulse) * dpr, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = on ? ORANGE : "#ffffff";
        ctx.strokeStyle = on ? "#ffffff" : "#1b1e5c";
        ctx.lineWidth = 1.5 * dpr;
        ctx.beginPath();
        ctx.arc(x, y, (on ? 5 : 3) * dpr, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }
  }

  // Luz de borde: filo claro arriba a la izquierda (lado del sol) y sombra del
  // lado nocturno
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.clip();
  const night = ctx.createRadialGradient(cx + R * 0.45, cy + R * 0.45, R * 0.2, cx, cy, R * 1.05);
  night.addColorStop(0, "rgba(13,15,51,0)");
  night.addColorStop(0.7, "rgba(13,15,51,.18)");
  night.addColorStop(1, "rgba(13,15,51,.55)");
  ctx.fillStyle = night;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
  const rim = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
  rim.addColorStop(0, "rgba(255,255,255,.7)");
  rim.addColorStop(0.45, "rgba(255,255,255,.12)");
  rim.addColorStop(1, "rgba(255,255,255,0)");
  ctx.strokeStyle = rim;
  ctx.lineWidth = 1.6 * dpr;
  ctx.beginPath();
  ctx.arc(cx, cy, R - dpr, 0, Math.PI * 2);
  ctx.stroke();

  // Bogotá: punto naranja con pulso
  const o = project(ORIGIN.lon, ORIGIN.lat, v);
  if (o.z > 0) {
    const [x, y] = px(o);
    const pulse = (time % 2200) / 2200;
    ctx.fillStyle = `rgba(255,118,25,${0.5 * (1 - pulse)})`;
    ctx.beginPath();
    ctx.arc(x, y, (6 + 20 * pulse) * dpr, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = ORANGE;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2 * dpr;
    ctx.beginPath();
    ctx.arc(x, y, 5.5 * dpr, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    if (!s.spinning) pill(ctx, x, y, labels.origin, dpr, true, false);
  }

  // Nombre del destino bajo el puntero; si no, el de la capital en turno
  // cuando su ruta ya llegó
  const stop = STOPS[s.current];
  const show = hovered ?? (stop && s.drawn(stop) >= 1 ? stop : null);
  if (show) {
    const q = project(show.lon, show.lat, v);
    if (q.z > 0) {
      const [x, y] = px(q);
      pill(ctx, x, y, labels.stop(show), dpr, false, true);
    }
  }
  return { hovered };
}
