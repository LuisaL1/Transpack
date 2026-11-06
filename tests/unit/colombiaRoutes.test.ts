import { describe, expect, it } from "vitest";
import { COLOMBIA_VIEWBOX, ROADS, ROUTE_NODES } from "@/data/colombiaMap";
import {
  ARRIVE_PAUSE,
  NEXT_NOTICE,
  SHINE,
  buildJourney,
  buildTracks,
  MAX_TURN,
  journeyAt,
  pickDestination,
  roadPath,
  shineDash,
  shortestRoute,
  travelled,
  tripDuration,
  tripPhase,
  turnToward,
} from "@/lib/colombiaRoutes";

// Mapa de rutas de Mudanzas nacionales: datos generados con `pnpm map`
describe("Mudanzas nacionales · mapa de rutas", () => {
  const nodes = Object.fromEntries(ROUTE_NODES.map((n) => [n.id, n]));
  const cities = ROUTE_NODES.filter((n) => n.name);
  const tracks = buildTracks(ROADS);

  it("muestra las 14 ciudades principales, dentro del mapa", () => {
    const [x, y, w, h] = COLOMBIA_VIEWBOX.split(" ").map(Number);
    expect(cities).toHaveLength(14);
    expect(cities.find((c) => c.main)?.name).toBe("Bogotá");
    for (const n of ROUTE_NODES) {
      expect(n.x).toBeGreaterThan(x);
      expect(n.x).toBeLessThan(x + w);
      expect(n.y).toBeGreaterThan(y);
      expect(n.y).toBeLessThan(y + h);
    }
  });

  it("cada carretera empieza y termina en sus puntos, con una curva dibujable", () => {
    for (const [i, r] of ROADS.entries()) {
      expect(nodes[r.from] && nodes[r.to], `${r.from}–${r.to}`).toBeTruthy();
      const t = tracks[i];
      expect(t.pts[0]).toEqual([nodes[r.from].x, nodes[r.from].y]);
      const end = t.pts[t.pts.length - 1];
      expect(end[0]).toBeCloseTo(nodes[r.to].x, 5);
      expect(end[1]).toBeCloseTo(nodes[r.to].y, 5);
      expect(roadPath(r.points)).toMatch(/^M[\d.,-]+(C[\d.,\s-]+)+$/);
    }
  });

  it("hay camino entre cualquier par de ciudades y el viaje es continuo", () => {
    for (const a of cities)
      for (const b of cities) {
        if (a === b) continue;
        expect(shortestRoute(tracks, a.id, b.id).length, `${a.id}→${b.id}`).toBeGreaterThan(0);
        const j = buildJourney(tracks, a.id, b.id);
        expect(j.pts[0][0]).toBeCloseTo(a.x, 5);
        expect(j.pts[j.pts.length - 1][0]).toBeCloseTo(b.x, 5);
        // Sin saltos entre una carretera y la siguiente
        for (let i = 1; i < j.pts.length; i++) expect(j.cum[i] - j.cum[i - 1]).toBeLessThan(15);
      }
  });

  it("el camino más corto de Bogotá a Medellín es la autopista directa", () => {
    const [step, ...rest] = shortestRoute(tracks, "bogota", "medellin");
    expect(rest).toHaveLength(0);
    expect(ROADS[step.track]).toMatchObject({ from: "bogota", to: "medellin" });
  });

  it("el camión arranca despacio, frena al llegar y termina en el destino", () => {
    const { length } = buildJourney(tracks, "bogota", "cali");
    const total = tripDuration(length);
    expect(travelled(0, length)).toBe(0);
    expect(travelled(total, length)).toBeCloseTo(length, 5);
    expect(travelled(total + 5000, length)).toBeCloseTo(length, 5);
    // Avance en 100 ms al salir, a mitad de camino y al llegar
    const step = (t: number) => travelled(t + 100, length) - travelled(t, length);
    expect(step(0)).toBeLessThan(step(total / 2));
    expect(step(total - 100)).toBeLessThan(step(total / 2));
    // Nunca retrocede
    for (let t = 0; t < total; t += 50)
      expect(travelled(t + 50, length)).toBeGreaterThanOrEqual(travelled(t, length));
  });

  it("los giros son suaves y por el lado más corto", () => {
    // De 170° a -170° hay 20° (no 340°)
    const next = turnToward(170, -170, 16);
    expect(next).toBeGreaterThan(170);
    expect(next).toBeLessThan(190);
    // En 16 ms gira solo una parte del ángulo
    expect(turnToward(0, 90, 16)).toBeLessThan(10);
    // Dar la vuelta en U nunca supera la velocidad máxima de giro
    expect(Math.abs(turnToward(0, 180, 100))).toBeLessThanOrEqual(MAX_TURN * 100 + 1e-9);
    const j = buildJourney(tracks, "cali", "pasto");
    expect(Number.isFinite(journeyAt(j, j.length / 2).angle)).toBe(true);
  });

  it("el nuevo destino nunca es la ciudad donde está el camión", () => {
    let seed = 7;
    for (let i = 0; i < 50; i++) {
      const r = pickDestination(cities, "bogota", seed);
      expect(r.to).not.toBe("bogota");
      expect(nodes[r.to].name).toBeTruthy();
      seed = r.seed;
    }
  });

  it("los avisos siguen el viaje: próximo destino, en camino, llegada y borrado", () => {
    const d = 10000;
    expect(tripPhase(0, d)).toBe("start");
    expect(tripPhase(NEXT_NOTICE, d)).toBe("driving");
    expect(tripPhase(d, d)).toBe("arrived");
    expect(tripPhase(d + ARRIVE_PAUSE, d)).toBe("leaving");
  });

  it("el brillo recorre solo la estela ya hecha", () => {
    const length = 300;
    for (const dist of [0, 20, 150, 300])
      for (let ms = 0; ms < 6000; ms += 37) {
        const [, gap, dash] = shineDash(ms, dist, length).split(" ").map(Number);
        expect(dash).toBeGreaterThanOrEqual(0);
        expect(dash).toBeLessThanOrEqual(SHINE);
        // Nunca va más allá del camión
        expect(gap + dash).toBeLessThanOrEqual(dist + 0.1);
      }
  });

  it("el brillo se mueve mientras el camión avanza (no se queda quieto)", () => {
    const { length } = buildJourney(tracks, "bogota", "santamarta");
    // Un segundo de viaje a 60 cuadros por segundo, en plena marcha
    const spots = new Set<number>();
    for (let ms = 4000; ms < 5000; ms += 1000 / 60) {
      const [, gap] = shineDash(ms, travelled(ms, length), length).split(" ").map(Number);
      spots.add(Math.round(gap));
    }
    expect(spots.size).toBeGreaterThan(20);
  });
});
