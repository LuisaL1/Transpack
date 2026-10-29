import { useEffect, useRef, useState } from "react";
import { drawGlobe, type GlobeLabels, type Interaction } from "@/lib/globe";

/**
 * Anima el globo de la portada en un <canvas> (dibujo en src/lib/globe.ts).
 * Los puntos de tierra se cargan aparte (import()) para no pesar en el JS
 * principal; hasta entonces se ve la esfera de respaldo del componente. Se
 * pausa fuera de pantalla y con la pestaña oculta. Con movimiento reducido
 * queda una vista fija. Al pasar el puntero por un destino muestra su nombre
 * (la historia no se detiene).
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
    // Puntero sobre el lienzo (para mostrar el nombre del destino)
    const inter: Interaction = { pointer: null };

    const draw = () => {
      if (!dots) return;
      const { hovered } = drawGlobe(ctx, dots, time, labelsRef.current, dpr, still, inter);
      canvas.style.cursor = hovered ? "pointer" : "";
    };
    const toCanvas = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: (e.clientX - r.left) * dpr, y: (e.clientY - r.top) * dpr };
    };
    const onCanvasMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse") inter.pointer = toCanvas(e);
    };
    const onCanvasLeave = () => {
      inter.pointer = null;
    };
    // En celular, un toque sobre un punto muestra su nombre
    const onTap = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") inter.pointer = toCanvas(e);
    };
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
    if (!still) {
      canvas.addEventListener("pointermove", onCanvasMove, { passive: true });
      canvas.addEventListener("pointerleave", onCanvasLeave);
      canvas.addEventListener("pointerup", onTap);
    }

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
      canvas.removeEventListener("pointermove", onCanvasMove);
      canvas.removeEventListener("pointerleave", onCanvasLeave);
      canvas.removeEventListener("pointerup", onTap);
    };
  }, []);

  return { canvasRef, ready };
}
