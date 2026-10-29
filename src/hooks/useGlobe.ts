import { useEffect, useRef, useState } from "react";
import { drawGlobe, type GlobeLabels } from "@/lib/globe";

/**
 * Anima el globo de la portada en un <canvas> (dibujo en src/lib/globe.ts).
 * Los puntos de tierra se cargan aparte (import()) para no pesar en el JS
 * principal; hasta entonces se ve la esfera de respaldo del componente. Se
 * pausa fuera de pantalla y con la pestaña oculta. Con movimiento reducido
 * queda una vista fija.
 */
export function useGlobe(labels: GlobeLabels) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelsRef = useRef(labels);
  labelsRef.current = labels;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dots: number[] | null = null;
    let raf = 0;
    let last = 0;
    let time = 0;
    let onScreen = true;
    let dpr = 1;
    let cancelled = false;

    const draw = () => dots && drawGlobe(ctx, dots, time, labelsRef.current, dpr, still);
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      draw();
    };
    const tick = (now: number) => {
      // Saltos largos (pestaña oculta) no adelantan la historia
      if (last) time += Math.min(now - last, 250);
      last = now;
      draw();
      raf = requestAnimationFrame(tick);
    };
    const play = () => {
      cancelAnimationFrame(raf);
      last = 0;
      if (!still && dots && onScreen && !document.hidden) raf = requestAnimationFrame(tick);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      play();
    });
    io.observe(canvas);
    document.addEventListener("visibilitychange", play);

    import("@/data/worldGlobe").then((m) => {
      if (cancelled) return;
      dots = m.LAND_DOTS;
      setReady(true);
      resize();
      play();
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", play);
    };
  }, []);

  return { canvasRef, ready };
}
