// Mapa de rutas de Mudanzas nacionales (ColombiaRoutesMap.tsx): curvas de las
// carreteras y viajes del camión entre ciudades. Lógica pura, sin React ni
// DOM: los datos (ya proyectados) vienen de src/data/colombiaMap.ts.

export type Point = [number, number];
export type Side = "left" | "right" | "above" | "below";

/** Ciudad (con nombre) o cruce de carreteras (sin nombre) */
export type RouteNode = {
  id: string;
  name?: string;
  x: number;
  y: number;
  side?: Side;
  main?: boolean;
};

/** Carretera entre dos puntos, por los pueblos de su troncal */
export type RoadData = { from: string; to: string; points: Point[] };

/** Carretera lista para recorrer: muestras de la curva y distancias acumuladas */
export type Track = { from: string; to: string; pts: Point[]; cum: number[]; length: number };

/** Viaje de una ciudad a otra por las carreteras: recorrido continuo */
export type Journey = {
  from: string;
  to: string;
  pts: Point[];
  cum: number[];
  length: number;
  // Trazo SVG del recorrido (para la estela)
  d: string;
};

/** Velocidad de crucero (unidades del mapa por segundo) y tramo de arranque y frenado */
export const SPEED = 30;
export const EASE = 40;
/** Pausa en el destino (ms, con el aviso de llegada) y duración del borrado de la estela */
export const ARRIVE_PAUSE = 2600;
export const FADE = 600;
/** Cuánto se ve el aviso "Próximo destino" al salir (ms) */
export const NEXT_NOTICE = 2200;

/** Momentos del viaje: sale (aviso del destino), en camino, llegó, borra la estela */
export type TripPhase = "start" | "driving" | "arrived" | "leaving";

/** Momento del viaje a los `ms` de salir, en un viaje que dura `duration` ms */
export function tripPhase(ms: number, duration: number): TripPhase {
  if (ms >= duration + ARRIVE_PAUSE) return "leaving";
  if (ms >= duration) return "arrived";
  return ms < NEXT_NOTICE ? "start" : "driving";
}

/** Largo del brillo que recorre la estela y cada cuánto la recorre entera (ms) */
export const SHINE = 34;
export const SHINE_PERIOD = 1400;

/**
 * stroke-dasharray del brillo: un tramo de SHINE unidades que corre del origen
 * hasta el camión, una y otra vez, sin pasar nunca de lo recorrido. Va por
 * tiempo (una pasada cada SHINE_PERIOD), no a velocidad fija: si fuera a un
 * múltiplo de la velocidad del camión, quedaría quieto en el mismo punto.
 */
export function shineDash(ms: number, dist: number, length: number) {
  const head = ((ms % SHINE_PERIOD) / SHINE_PERIOD) * (dist + SHINE);
  const start = Math.max(head - SHINE, 0);
  const end = Math.min(head, dist);
  return `0 ${r1(start)} ${r1(Math.max(end - start, 0))} ${r1(length + SHINE)}`;
}

// Curva suave por los puntos (Catmull-Rom convertida a Bézier cúbicas): los
// puntos de control de cada tramo. Los extremos repiten el primer y último punto.
function beziers(p: Point[]): [Point, Point, Point, Point][] {
  const out: [Point, Point, Point, Point][] = [];
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[Math.max(i - 1, 0)];
    const b = p[i];
    const c = p[i + 1];
    const d = p[Math.min(i + 2, p.length - 1)];
    out.push([
      b,
      [b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6],
      [c[0] - (d[0] - b[0]) / 6, c[1] - (d[1] - b[1]) / 6],
      c,
    ]);
  }
  return out;
}

const r1 = (v: number) => Math.round(v * 10) / 10;

/** Trazo SVG (atributo d) de una carretera */
export function roadPath(points: Point[]): string {
  const segs = beziers(points);
  let d = `M${points[0].join(",")}`;
  for (const [, c1, c2, e] of segs)
    d += `C${r1(c1[0])},${r1(c1[1])} ${r1(c2[0])},${r1(c2[1])} ${e.join(",")}`;
  return d;
}

function bezierAt([a, b, c, d]: [Point, Point, Point, Point], t: number): Point {
  const u = 1 - t;
  const k0 = u * u * u;
  const k1 = 3 * u * u * t;
  const k2 = 3 * u * t * t;
  const k3 = t * t * t;
  return [
    k0 * a[0] + k1 * b[0] + k2 * c[0] + k3 * d[0],
    k0 * a[1] + k1 * b[1] + k2 * c[1] + k3 * d[1],
  ];
}

function cumulative(pts: Point[]) {
  const cum = [0];
  for (let i = 1; i < pts.length; i++)
    cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return cum;
}

/** Muestrea cada carretera sobre la misma curva que se dibuja */
export function buildTracks(roads: RoadData[], steps = 12): Track[] {
  return roads.map(({ from, to, points }) => {
    const pts: Point[] = [points[0]];
    for (const seg of beziers(points))
      for (let s = 1; s <= steps; s++) pts.push(bezierAt(seg, s / steps));
    const cum = cumulative(pts);
    return { from, to, pts, cum, length: cum[cum.length - 1] };
  });
}

/** Camino más corto entre dos puntos de la red (Dijkstra): carreteras y sentido */
export function shortestRoute(tracks: Track[], from: string, to: string) {
  const best: Record<string, number> = { [from]: 0 };
  const prev: Record<string, { node: string; track: number; forward: boolean }> = {};
  const open = new Set([from]);
  while (open.size) {
    let node = "";
    for (const n of open) if (!node || best[n] < best[node]) node = n;
    open.delete(node);
    if (node === to) break;
    tracks.forEach((t, i) => {
      if (t.from !== node && t.to !== node) return;
      const forward = t.from === node;
      const other = forward ? t.to : t.from;
      const cost = best[node] + t.length;
      if (best[other] === undefined || cost < best[other]) {
        best[other] = cost;
        prev[other] = { node, track: i, forward };
        open.add(other);
      }
    });
  }
  const steps: { track: number; forward: boolean }[] = [];
  for (let n = to; n !== from; n = prev[n].node) {
    if (!prev[n]) return [];
    steps.unshift({ track: prev[n].track, forward: prev[n].forward });
  }
  return steps;
}

/** Une las carreteras del camino más corto en un solo recorrido */
export function buildJourney(tracks: Track[], from: string, to: string): Journey {
  const pts: Point[] = [];
  for (const { track, forward } of shortestRoute(tracks, from, to)) {
    const p = forward ? tracks[track].pts : [...tracks[track].pts].reverse();
    pts.push(...(pts.length ? p.slice(1) : p));
  }
  const cum = cumulative(pts);
  const d = pts.length ? `M${pts.map(([x, y]) => `${r1(x)},${r1(y)}`).join("L")}` : "";
  return { from, to, pts, cum, length: cum[cum.length - 1] ?? 0, d };
}

function at(j: Journey, dist: number): Point {
  const d = Math.min(Math.max(dist, 0), j.length);
  const { pts, cum } = j;
  if (pts.length < 2) return pts[0] ?? [0, 0];
  let lo = 1;
  let hi = cum.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (cum[mid] < d) lo = mid + 1;
    else hi = mid;
  }
  const span = cum[lo] - cum[lo - 1] || 1;
  const t = (d - cum[lo - 1]) / span;
  const [ax, ay] = pts[lo - 1];
  const [bx, by] = pts[lo];
  return [ax + (bx - ax) * t, ay + (by - ay) * t];
}

/**
 * Punto del recorrido y dirección de la vía (grados). La dirección mira un
 * tramo hacia atrás y hacia adelante, así las curvas cerradas no dan saltos.
 */
export function journeyAt(j: Journey, dist: number, look = 7) {
  const [x, y] = at(j, dist);
  const [ax, ay] = at(j, dist - look);
  const [bx, by] = at(j, dist + look);
  return { x, y, angle: (Math.atan2(by - ay, bx - ax) * 180) / Math.PI };
}

/**
 * Distancia recorrida a los `ms` de salir: arranca despacio, va a velocidad
 * constante y frena al llegar (perfil trapezoidal de velocidad).
 */
export function travelled(ms: number, length: number) {
  const s = ms / 1000;
  const e = Math.min(EASE, length / 2);
  const ta = (2 * e) / SPEED; // tiempo de arranque (y de frenado)
  const tc = (length - 2 * e) / SPEED;
  if (s <= 0) return 0;
  if (s < ta) return (SPEED / (2 * ta)) * s * s;
  if (s < ta + tc) return e + SPEED * (s - ta);
  const r = Math.min(s - ta - tc, ta);
  return Math.min(e + SPEED * tc + SPEED * r - (SPEED / (2 * ta)) * r * r, length);
}

/** Duración del viaje (ms) */
export function tripDuration(length: number) {
  const e = Math.min(EASE, length / 2);
  return ((4 * e) / SPEED + (length - 2 * e) / SPEED) * 1000;
}

/** Velocidad máxima de giro (grados por ms): una vuelta en U tarda ~0,8 s */
export const MAX_TURN = 0.22;

/**
 * Gira de `from` hacia `to` (grados) por el lado más corto, suavizado en el
 * tiempo y sin pasar de MAX_TURN (así dar la vuelta en una ciudad no es brusco)
 */
export function turnToward(from: number, to: number, dt: number, ms = 220) {
  const diff = ((((to - from) % 360) + 540) % 360) - 180;
  const step = diff * (1 - Math.exp(-dt / ms));
  const max = MAX_TURN * dt;
  return from + Math.max(-max, Math.min(max, step));
}

// Número pseudoaleatorio repetible (el mismo recorrido en cada visita)
export function nextSeed(seed: number) {
  const s = (seed * 1103515245 + 12345) % 2147483648;
  return { seed: s, value: s / 2147483648 };
}

/** Otra ciudad como destino (nunca la misma en la que está el camión) */
export function pickDestination(cities: RouteNode[], from: string, seed: number) {
  const options = cities.filter((c) => c.id !== from);
  const r = nextSeed(seed);
  return { to: options[Math.floor(r.value * options.length)].id, seed: r.seed };
}

/** transform SVG del camión (visto desde arriba: gira con la vía, sin voltearse) */
export function truckTransform(x: number, y: number, angle: number) {
  return `translate(${r1(x)} ${r1(y)}) rotate(${r1(angle)})`;
}
