import { useEffect, useRef } from "react";
import type { GlobeLabels } from "@/lib/globe";

/**
 * Anima el mapa de la portada: la foto (photoRef) y el mapa en un <canvas>
 * (canvasRef). El dibujo y la historia están en src/lib/globe.ts, que se carga
 * aparte (import()) con d3-geo y las siluetas de los países; mientras tanto, y
 * en el HTML pre-generado, se ve la foto. Se pausa fuera de pantalla y con la
 * pestaña oculta. Con movimiento reducido queda el mapa fijo.
 */
export function useGlobe(labels: GlobeLabels) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef(labels);
  labelsRef.current = labels;

  useEffect(() => {
    const canvas = canvasRef.current;
    const photo = photoRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !photo || !ctx) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Velocidad de la historia (pedidos del cliente: el doble, luego un 25 % y
    // después un 20 % más lento)
    const speed = 1.6 / 1.2;
    let globe: typeof import("@/lib/globe") | null = null;
    let raf = 0;
    let last = 0;
    let time = 0;
    let onScreen = true;
    let dpr = 1;
    let cancelled = false;

    const draw = () => {
      if (!globe) return;
      const s = still ? globe.stillScene() : globe.scene(time);
      globe.drawGlobe(ctx, s, time, labelsRef.current, dpr);
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
      if (!still && globe && onScreen && !document.hidden) raf = requestAnimationFrame(tick);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      play();
    });
    io.observe(canvas);
    document.addEventListener("visibilitychange", play);

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
    };
  }, []);

  return { canvasRef, photoRef };
}
