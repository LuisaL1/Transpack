import { useCallback, useEffect, useRef, useState } from "react";
import type { GlobeLabels, Hit } from "@/lib/globe";
import type { CountryPhoto, PlacePhoto } from "@/data/countryPhotos";
import { trackEvent } from "@/lib/analytics";

/** País o ciudad de Colombia que el visitante tocó en el mapa, con su foto, dónde
 * quedó y el tamaño del mapa (px de CSS) */
export type PickedCountry = Hit & { photo?: CountryPhoto | PlacePhoto; w: number; h: number };

/**
 * Anima el mapa de la portada: la foto (photoRef) y el mapa en un <canvas>
 * (canvasRef). El dibujo y la historia están en src/lib/globe.ts, que se carga
 * aparte (import()) con d3-geo y las siluetas de los países; mientras tanto, y
 * en el HTML pre-generado, se ve la foto. Se pausa fuera de pantalla y con la
 * pestaña oculta. Con movimiento reducido queda el mapa fijo.
 *
 * Al tocar un país (o una ciudad de Colombia), la animación se detiene y `picked`
 * trae el lugar y su foto (CountryCard); `close` la cierra y la animación sigue.
 */
export function useGlobe(labels: Omit<GlobeLabels, "selected">) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const [picked, setPicked] = useState<PickedCountry | null>(null);
  const labelsRef = useRef<GlobeLabels>(labels);
  labelsRef.current = { ...labels, selected: picked?.place.name };
  // Funciones del efecto que usa `close` (cerrar desde la tarjeta)
  const resumeRef = useRef<() => void>(() => {});

  const close = useCallback(() => {
    setPicked(null);
    resumeRef.current();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const photo = photoRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !photo || !ctx) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Velocidad de la historia (pedidos del cliente: el doble, luego un 25 %,
    // después un 20 % y en nov. 2026 un 50 % más lento)
    const speed = 1.6 / 1.2 / 1.5;
    let globe: typeof import("@/lib/globe") | null = null;
    let raf = 0;
    let last = 0;
    let time = 0;
    let onScreen = true;
    let paused = false;
    let dpr = 1;
    let cancelled = false;
    let hits: Hit[] = [];

    const draw = () => {
      if (!globe) return;
      const s = still ? globe.stillScene() : globe.scene(time);
      hits = globe.drawGlobe(ctx, s, time, labelsRef.current, dpr);
      // La foto se cierra en el círculo del mapa: de cubrir todo a su radio
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const full = Math.hypot(w, h) / 2;
      const r = full + (globe.lensRadius(w, h) - full) * s.morph;
      photo.style.clipPath = `circle(${r}px at 50% 50%)`;
      photo.style.opacity = String(s.photo);
      // La foto se ve completa y quieta; al dar paso al mapa se acerca, como si
      // la cámara entrara en el círculo
      const entering = time % globe.LOOP < globe.LOOP / 2;
      photo.style.transform = `scale(${1 + (entering ? 0.3 : 0) * (1 - s.photo)})`;
    };
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      draw();
    };
    const tick = (now: number) => {
      // Saltos largos (pestaña oculta) no adelantan la historia
      if (last) time += Math.min(now - last, 250) * speed;
      last = now;
      draw();
      raf = requestAnimationFrame(tick);
    };
    const play = () => {
      cancelAnimationFrame(raf);
      last = 0;
      if (!still && !paused && globe && onScreen && !document.hidden)
        raf = requestAnimationFrame(tick);
    };
    resumeRef.current = () => {
      paused = false;
      // Vuelve a dibujar sin el anillo del país (después de que React lo quite)
      requestAnimationFrame(draw);
      play();
    };

    // Destino más cercano al puntero (con más margen en pantallas táctiles)
    const hitAt = (e: MouseEvent) => {
      const box = canvas.getBoundingClientRect();
      const x = e.clientX - box.left;
      const y = e.clientY - box.top;
      const reach = (e as PointerEvent).pointerType === "touch" ? 24 : 14;
      let best: Hit | null = null;
      let bestD = reach;
      for (const h of hits) {
        const d = Math.hypot(h.x - x, h.y - y);
        if (d < bestD) [best, bestD] = [h, d];
      }
      return best;
    };
    const onMove = (e: PointerEvent) => {
      canvas.style.cursor = hitAt(e) ? "pointer" : "";
    };
    const onClick = (e: MouseEvent) => {
      const hit = globe && hitAt(e);
      if (!hit || !globe) {
        // Un toque fuera de los países cierra la tarjeta
        setPicked(null);
        if (paused) resumeRef.current();
        return;
      }
      paused = true;
      play();
      setPicked({
        ...hit,
        photo: globe.photoFor(hit),
        w: canvas.clientWidth,
        h: canvas.clientHeight,
      });
      requestAnimationFrame(draw); // con el anillo del país elegido
      trackEvent(
        "map_country_click",
        hit.kind === "city" ? { country: "Colombia", city: hit.place.name } : { country: hit.place.name },
      );
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      play();
    });
    io.observe(canvas);
    document.addEventListener("visibilitychange", play);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("click", onClick);

    import("@/lib/globe").then((m) => {
      if (cancelled) return;
      globe = m;
      resize();
      play();
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", play);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("click", onClick);
    };
  }, []);

  // Esc o un toque fuera del mapa cierran la tarjeta
  useEffect(() => {
    if (!picked) return;
    const root = canvasRef.current?.parentElement;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const onDown = (e: PointerEvent) => {
      if (root && !root.contains(e.target as Node)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [picked, close]);

  return { canvasRef, photoRef, picked, close };
}
