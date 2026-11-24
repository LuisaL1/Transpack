import { useCallback, useEffect, useRef, useState } from "react";
import type { GlobeLabels, Hit } from "@/lib/globe";
import type { CountryPhoto, PlacePhoto } from "@/data/countryPhotos";
import { trackEvent } from "@/lib/analytics";
import { scrollToY } from "@/lib/smoothScroll";

/** País, ciudad de Colombia o localidad de Bogotá que el visitante tocó en el mapa, con su foto, dónde
 * quedó y el tamaño del mapa (px de CSS) */
export type PickedCountry = Hit & { photo?: CountryPhoto | PlacePhoto; w: number; h: number };

/**
 * Anima el mapa de la portada: el carrusel de fotos (photoRef) y el mapa en un <canvas>
 * (canvasRef). El dibujo y la historia están en src/lib/globe.ts, que se carga
 * aparte (import()) con d3-geo y las siluetas de los países; mientras tanto, y
 * en el HTML pre-generado, se ve la primera foto. Se pausa fuera de pantalla y con la
 * pestaña oculta. Con movimiento reducido queda el mapa fijo.
 *
 * Historia guiada por el scroll (propuesta, nov. 2026): en escritorio, si el mapa
 * está dentro de un elemento `[data-globe-track]` (el Hero, más alto que la
 * pantalla y con su contenido fijo), el avance del scroll por ese elemento elige
 * el momento de la historia (`scrollScene`): bajar avanza de Bogotá a Colombia y
 * al mundo, subir retrocede. Los pulsos y brillos siguen con el reloj. En
 * celular y tableta la historia avanza sola, en bucle, y se detiene con el mouse
 * encima.
 *
 * Al tocar un país, una ciudad de Colombia o una localidad de Bogotá, la
 * animación se detiene y `picked`
 * trae el lugar y su foto (CountryCard); `close` la cierra y la animación sigue
 * (con el scroll, también se cierra al seguir bajando o subiendo).
 */
const TRACK = "[data-globe-track]";
// Avance del scroll donde cada pestaña deja la historia: Bogotá al inicio,
// Colombia con sus rutas trazadas y el mundo completo
const STAGE_AT = [0, 0.6, 1];
// Avance del scroll (0 a 1) por el elemento que fija el mapa
function trackProgress(track: HTMLElement) {
  const r = track.getBoundingClientRect();
  const len = r.height - window.innerHeight;
  return len > 0 ? Math.min(1, Math.max(0, -r.top / len)) : 0;
}
export function useGlobe(labels: Omit<GlobeLabels, "selected">) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const [picked, setPicked] = useState<PickedCountry | null>(null);
  // Etapa de la historia que se ve (0 Bogotá, 1 Colombia, 2 mundo), para las
  // pestañas del panel del mapa; cambia pocas veces por vuelta
  const [stage, setStage] = useState(0);
  // Con la historia guiada por el scroll (escritorio): las pestañas llevan a su etapa
  const [scrollMode, setScrollMode] = useState(false);
  // Barra de avance y aviso "Desliza para explorar" (se actualizan sin re-render)
  const barRef = useRef<HTMLSpanElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<GlobeLabels>(labels);
  labelsRef.current = { ...labels, selected: picked?.place.name };
  // Funciones del efecto que usa `close` (cerrar desde la tarjeta)
  const resumeRef = useRef<() => void>(() => {});

  const close = useCallback(() => {
    setPicked(null);
    resumeRef.current();
  }, []);

  // Lleva el scroll a la etapa `i` (0 Bogotá, 1 Colombia, 2 mundo)
  const goTo = useCallback((i: number) => {
    const track = canvasRef.current?.closest<HTMLElement>(TRACK);
    if (!track) return;
    const len = track.offsetHeight - window.innerHeight;
    const top = track.getBoundingClientRect().top + window.scrollY;
    scrollToY(top + len * STAGE_AT[i]);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const photo = photoRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !photo || !ctx) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const track = canvas.closest<HTMLElement>(TRACK);
    const wide = window.matchMedia("(min-width: 1024px)");
    const scrolled = () => !still && !!track && wide.matches;
    // Con el scroll: avance (0 a 1) y avance que se dibuja, que lo sigue con suavidad
    let progress = 0;
    let story = 0;
    // Velocidad de la historia (pedidos del cliente: el doble, luego un 25 %,
    // después un 20 % y en nov. 2026 un 50 % más lento)
    const speed = 1.6 / 1.2 / 1.5;
    let globe: typeof import("@/lib/globe") | null = null;
    let raf = 0;
    let last = 0;
    let time = 0;
    let onScreen = true;
    let paused = false;
    // Con el mouse encima del mapa la animación se detiene (pedido del cliente,
    // nov. 2026); en pantallas táctiles no, porque no hay "encima"
    let hovering = false;
    let dpr = 1;
    let cancelled = false;
    let hits: Hit[] = [];
    let hovered: string | undefined;
    let shown = 0;

    const draw = () => {
      if (!globe) return;
      const scroll = scrolled();
      const s = still ? globe.stillScene() : scroll ? globe.scrollScene(story) : globe.scene(time);
      hits = globe.drawGlobe(ctx, s, time, { ...labelsRef.current, hovered }, dpr);
      const now = scroll
        ? Math.min(2, Math.floor(progress * 3))
        : s.photo > 0.5 || s.bogota > 0.5
          ? 0
          : s.localFade > 0.5
            ? 1
            : 2;
      if (now !== shown) setStage((shown = now));
      if (barRef.current) barRef.current.style.transform = `scaleX(${scroll ? progress : 0})`;
      if (hintRef.current) hintRef.current.style.opacity = scroll && progress < 0.03 ? "1" : "0";
      // La foto se cierra en el círculo del mapa: de cubrir todo a su radio
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const full = Math.hypot(w, h) / 2;
      const r = full + (globe.lensRadius(w, h) - full) * s.morph;
      photo.style.clipPath = `circle(${r}px at 50% 50%)`;
      photo.style.opacity = String(s.photo);
      // Carrusel: la foto actual y, al final de su turno, la siguiente encima
      const k = Math.floor(s.slide);
      const next = Math.min(Math.max((s.slide - k - 0.8) / 0.2, 0), 1);
      [...photo.children].forEach((el, i) => {
        (el as HTMLElement).style.opacity = String(
          i === k ? 1 : i === k + 1 ? next * next * (3 - 2 * next) : 0,
        );
      });
      // La foto se ve completa y quieta; al dar paso al mapa se acerca, como si
      // la cámara entrara en el círculo
      const entering = scroll || time % globe.LOOP < globe.LOOP / 2;
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
      const dt = last ? Math.min(now - last, 250) : 0;
      time += dt * speed;
      last = now;
      if (scrolled() && globe && track) {
        progress = trackProgress(track);
        // Sigue al scroll con suavidad (igual a cualquier frecuencia de pantalla)
        story += (progress - story) * Math.min(1, dt / 140);
        if (Math.abs(progress - story) < 0.0005) story = progress;
      }
      draw();
      raf = requestAnimationFrame(tick);
    };
    const play = () => {
      cancelAnimationFrame(raf);
      last = 0;
      if (!still && !paused && (scrolled() || !hovering) && globe && onScreen && !document.hidden)
        raf = requestAnimationFrame(tick);
    };
    resumeRef.current = () => {
      paused = false;
      // Vuelve a dibujar sin el anillo del país (después de que React lo quite)
      requestAnimationFrame(draw);
      play();
    };

    // Destino más cercano al puntero (con más margen en pantallas táctiles) o, al
    // inicio, la localidad de Bogotá que está debajo
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
      return best ?? globe?.localityAt(x, y) ?? null;
    };
    const onMove = (e: PointerEvent) => {
      const hit = hitAt(e);
      canvas.style.cursor = hit ? "pointer" : "";
      // La localidad bajo el puntero se ilumina (con la animación detenida, se
      // vuelve a dibujar)
      const name = hit?.kind === "locality" ? hit.place.name : undefined;
      if (name !== hovered) {
        hovered = name;
        if (paused || still) requestAnimationFrame(draw);
      }
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
        hit.kind === "country"
          ? { country: hit.place.name }
          : hit.kind === "city"
            ? { country: "Colombia", city: hit.place.name }
            : { country: "Colombia", city: "Bogotá", locality: hit.place.name },
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
    const onLeave = () => {
      hovered = undefined;
      if (paused || still) requestAnimationFrame(draw);
    };
    canvas.addEventListener("pointerleave", onLeave);
    // Sobre todo el mapa, incluida la tarjeta de un lugar
    const root = canvas.parentElement ?? canvas;
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      hovering = true;
      play();
    };
    const onExit = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      hovering = false;
      play();
    };
    root.addEventListener("pointerenter", onEnter);
    root.addEventListener("pointerleave", onExit);
    canvas.addEventListener("click", onClick);
    // Con el scroll, seguir bajando o subiendo cierra la tarjeta y la historia sigue
    const onScroll = () => {
      if (!paused || !scrolled() || !track) return;
      if (Math.abs(trackProgress(track) - progress) < 0.01) return;
      setPicked(null);
      resumeRef.current();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const onWide = () => {
      setScrollMode(scrolled());
      resize();
      play();
    };
    wide.addEventListener("change", onWide);

    import("@/lib/globe").then((m) => {
      if (cancelled) return;
      globe = m;
      // Al cargar a mitad del Hero, el mapa empieza donde va el scroll
      if (track) story = progress = trackProgress(track);
      setScrollMode(scrolled());
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
      canvas.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("pointerenter", onEnter);
      root.removeEventListener("pointerleave", onExit);
      canvas.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
      wide.removeEventListener("change", onWide);
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

  return { canvasRef, photoRef, picked, close, stage, scrollMode, goTo, barRef, hintRef };
}
