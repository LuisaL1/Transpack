import { useEffect, useMemo, useRef, useState } from "react";
import {
  ARRIVE_PAUSE,
  FADE,
  buildJourney,
  journeyAt,
  RECENT,
  pickDestination,
  shineDash,
  travelled,
  tripDuration,
  tripPhase,
  truckTransform,
  turnToward,
  type RouteNode,
  type Track,
  type TripPhase,
} from "@/lib/colombiaRoutes";

/**
 * Viajes del camión del mapa de rutas (ColombiaRoutesMap): sale de la ciudad
 * donde está hacia otra, deja una estela (con un brillo que la recorre) y, al
 * llegar, se detiene, borra la estela y elige un nuevo destino. `phase` dice en
 * qué momento va el viaje, para los avisos y las animaciones de las casas. La
 * lógica está en src/lib/colombiaRoutes.ts; aquí el ciclo de animación, que
 * mueve el camión y la estela sin volver a pintar React (solo al cambiar de
 * momento o de viaje). En el HTML pre-generado el camión espera en el origen;
 * con movimiento reducido se ve el viaje ya hecho. Se pausa fuera de pantalla
 * y con la pestaña oculta. El HTML pre-generado sale de `seed`; en el navegador,
 * el primer destino se elige al azar en cada visita.
 */
export function useTruckTrip(tracks: Track[], cities: RouteNode[], start: string, seed: number) {
  const [trip, setTrip] = useState(() => ({
    from: start,
    recent: [start],
    ...pickDestination(cities, start, seed, [start]),
  }));
  const [phase, setPhase] = useState<TripPhase>("start");
  const journey = useMemo(() => buildJourney(tracks, trip.from, trip.to), [tracks, trip]);
  const svgRef = useRef<SVGSVGElement>(null);
  const truckRef = useRef<SVGGElement>(null);
  const trailRefs = useRef<(SVGPathElement | null)[]>([]);
  const shineRef = useRef<SVGPathElement>(null);
  // La dirección del camión sigue de un viaje al siguiente
  const angleRef = useRef<number | null>(null);

  // Primer destino al azar en cada visita (no siempre el mismo). Va en un cuadro
  // de animación: el HTML pre-generado y la hidratación usan `seed`, que es fijo.
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const random = Math.floor(Math.random() * 2 ** 31);
      angleRef.current = null; // el camión arranca mirando hacia su nuevo destino
      setTrip({ from: start, recent: [start], ...pickDestination(cities, start, random, [start]) });
    });
    return () => cancelAnimationFrame(raf);
  }, [cities, start]);

  useEffect(() => {
    const svg = svgRef.current;
    const truck = truckRef.current;
    const shine = shineRef.current;
    if (!svg || !truck || !shine) return;
    const { length } = journey;
    const trail = (shown: number, opacity: number) => {
      trailRefs.current.forEach((p) => {
        p?.setAttribute("stroke-dasharray", `${shown} ${length + 1}`);
        p?.setAttribute("opacity", String(opacity));
      });
      shine.setAttribute("opacity", String(opacity));
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const end = journeyAt(journey, length);
      truck.setAttribute("transform", truckTransform(end.x, end.y, end.angle));
      trail(length, 1);
      return;
    }

    const duration = tripDuration(length);
    let time = 0;
    let raf = 0;
    let last = 0;
    let onScreen = true;
    let current: TripPhase = "start";
    trail(0, 1);

    const tick = (now: number) => {
      // Saltos largos (pestaña oculta) no adelantan el viaje
      const dt = last ? Math.min(now - last, 100) : 0;
      last = now;
      time += dt;
      const dist = travelled(time, length);
      const p = journeyAt(journey, dist);
      angleRef.current =
        angleRef.current === null ? p.angle : turnToward(angleRef.current, p.angle, dt);
      truck.setAttribute("transform", truckTransform(p.x, p.y, angleRef.current));
      // Estela hasta el camión, con el brillo; al llegar, pausa y se desvanece
      const fade = (time - duration - ARRIVE_PAUSE) / FADE;
      trail(dist, fade > 0 ? Math.max(1 - fade, 0) : 1);
      shine.setAttribute("stroke-dasharray", shineDash(time, dist, length));
      // Solo se vuelve a pintar React al cambiar de momento
      const next = tripPhase(time, duration);
      if (next !== current) setPhase((current = next));
      if (fade >= 1) {
        setTrip((t) => {
          const recent = [...t.recent, t.to].slice(-RECENT);
          return { from: t.to, recent, ...pickDestination(cities, t.to, t.seed, recent) };
        });
        setPhase("start");
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    const play = () => {
      cancelAnimationFrame(raf);
      last = 0;
      if (onScreen && !document.hidden) raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      play();
    });
    io.observe(svg);
    document.addEventListener("visibilitychange", play);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", play);
    };
  }, [journey, cities]);

  return { trip, phase, journey, svgRef, truckRef, trailRefs, shineRef };
}
