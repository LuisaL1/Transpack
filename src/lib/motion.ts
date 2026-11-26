// Motor de movimiento del sitio (nov. 2026): GSAP con ScrollTrigger y SplitText,
// y Lenis para el scroll inercial. Se carga aparte con import() (chunk "motion",
// ver vite.config.ts) desde src/hooks/useMotion.ts, así no pesa en el JS
// principal. Nunca se importa directamente desde un componente: use useMotion.
//
// Con movimiento reducido no se crea el scroll inercial y useMotion no corre
// ninguna animación (todo queda quieto y visible).
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import { setScroller } from "@/lib/smoothScroll";

gsap.registerPlugin(ScrollTrigger, SplitText);
gsap.defaults({ ease: "power3.out", duration: 0.9 });

export { gsap, ScrollTrigger, SplitText };

/** Cómo entra en pantalla un elemento: cuando su borde superior pasa el 85 % */
export const ENTER = "top 85%";

let lenis: Lenis | null = null;

// Scroll inercial (Lenis) sincronizado con ScrollTrigger y el reloj de GSAP.
// No se suaviza dentro de diálogos, del menú móvil ni de lo marcado con
// data-lenis-prevent; se detiene mientras un modal bloquea el scroll de la
// página (body con overflow: hidden).
function startLenis() {
  if (lenis) return;
  const l = new Lenis({
    lerp: 0.1,
    // Enlaces #ancla con margen para la cabecera fija
    anchors: { offset: -90 },
    prevent: (node) =>
      !!node.closest?.("[data-lenis-prevent], [role='dialog'], [aria-modal='true']"),
  });
  lenis = l;
  l.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => l.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  setScroller({ scrollTo: (target, opts) => l.scrollTo(target, { ...opts, force: true }) });
  const sync = () => (document.body.style.overflow === "hidden" ? l.stop() : l.start());
  new MutationObserver(sync).observe(document.body, {
    attributes: true,
    attributeFilter: ["style"],
  });
}

/** Arranca el motor (una sola vez). Devuelve false con movimiento reducido. */
export function init() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  startLenis();
  watchLayout();
  return true;
}

// ScrollTrigger calcula dónde empieza y termina cada animación al crearla. Si
// después la página cambia de alto (fotos o secciones que terminan de armarse
// más arriba), esas posiciones quedan corridas, y en celular no se recalculan
// solas (ScrollTrigger ignora los cambios de tamaño en pantallas táctiles):
// la galería del inicio arrancaba ~200 px antes y su primera foto no se veía.
// Al cambiar el alto del documento, recalcula (agrupado; el segundo cálculo
// ya no cambia el alto, así que no entra en bucle).
let layoutWatched = false;
function watchLayout() {
  if (layoutWatched || typeof ResizeObserver === "undefined") return;
  layoutWatched = true;
  let height = document.documentElement.scrollHeight;
  let timer: ReturnType<typeof setTimeout> | undefined;
  new ResizeObserver(() => {
    const h = document.documentElement.scrollHeight;
    if (Math.abs(h - height) < 2) return;
    height = h;
    clearTimeout(timer);
    timer = setTimeout(() => {
      ScrollTrigger.refresh();
      height = document.documentElement.scrollHeight;
    }, 250);
  }).observe(document.body);
}

/**
 * Entrada escalonada de `targets` (desde abajo y transparentes) al llegar a
 * `trigger`. Con `opacity`, no `autoAlpha`: mientras esperan siguen visibles
 * para el teclado (un enlace oculto con visibility no se podría enfocar) y, al
 * enfocarlos, el navegador los trae a la vista y la animación corre.
 */
export function reveal(targets: gsap.TweenTarget, trigger: Element, vars: gsap.TweenVars = {}) {
  return gsap.from(targets, {
    y: 40,
    opacity: 0,
    stagger: 0.08,
    ...vars,
    scrollTrigger: { trigger, start: ENTER, once: true },
  });
}

/**
 * Tarjeta que se inclina hacia el puntero (3D leve) y deja en --mx/--my dónde
 * está, para el resplandor de .spotlight (src/styles/index.css). Solo con
 * mouse. Devuelve la función que quita los listeners.
 */
export function tilt(el: HTMLElement, max = 5) {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return () => {};
  gsap.set(el, { transformPerspective: 900 });
  const rx = gsap.quickTo(el, "rotationX", { duration: 0.6 });
  const ry = gsap.quickTo(el, "rotationY", { duration: 0.6 });
  const move = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry((px - 0.5) * 2 * max);
    rx(-(py - 0.5) * 2 * max);
    el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
  };
  const leave = () => {
    rx(0);
    ry(0);
  };
  el.addEventListener("pointermove", move);
  el.addEventListener("pointerleave", leave);
  return () => {
    el.removeEventListener("pointermove", move);
    el.removeEventListener("pointerleave", leave);
  };
}

/** Titular que entra línea por línea, cada una saliendo de una máscara */
export function splitReveal(el: Element, vars: gsap.TweenVars = {}) {
  return SplitText.create(el, {
    type: "lines,words",
    mask: "lines",
    autoSplit: true,
    onSplit: (self) =>
      gsap.from(self.lines, {
        yPercent: 110,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.09,
        ...vars,
        scrollTrigger: { trigger: el, start: ENTER, once: true },
      }),
  });
}

/** Desplazamiento atado al scroll mientras `trigger` cruza la pantalla */
const SCRUB = { start: "top bottom", end: "bottom top", scrub: true } as const;

/**
 * Parallax: `target` va de `from` a `to` mientras `trigger` cruza la pantalla
 * (de que asoma abajo a que sale arriba), atado al scroll y sin aceleración.
 * `scroll` cambia el tramo (p. ej. `{ start: "top top" }` en un encabezado).
 */
export function parallax(
  target: gsap.TweenTarget,
  trigger: Element,
  from: gsap.TweenVars,
  to: gsap.TweenVars,
  scroll: ScrollTrigger.Vars = {},
) {
  return gsap.fromTo(target, from, {
    ...to,
    ease: "none",
    scrollTrigger: { trigger, ...SCRUB, ...scroll },
  });
}

/**
 * Línea que se dibuja con el scroll (de 0 a su largo, en `axis`) mientras
 * `trigger` pasa del 75 % al 45 % de la pantalla; al subir, retrocede. La
 * línea debe tener su `transform-origin` en el punto de partida.
 */
export function drawLine(
  line: gsap.TweenTarget,
  trigger: Element,
  axis: "x" | "y" = "x",
  scroll: ScrollTrigger.Vars = {},
) {
  const prop = axis === "x" ? "scaleX" : "scaleY";
  return gsap.fromTo(
    line,
    { [prop]: 0 },
    {
      [prop]: 1,
      ease: "none",
      scrollTrigger: { trigger, start: "top 75%", end: "bottom 45%", scrub: 0.6, ...scroll },
    },
  );
}

/**
 * Marquesina infinita (`row` lleva el contenido dos veces y se corre −50 %)
 * que se acelera con la velocidad del scroll y retrocede al subir, como la
 * franja naranja (CtaBand). `duration`: segundos de una vuelta en reposo.
 */
export function velocityMarquee(row: Element, trigger: Element, duration = 28) {
  const loop = gsap.to(row, { xPercent: -50, duration, ease: "none", repeat: -1 });
  ScrollTrigger.create({
    trigger,
    ...SCRUB,
    scrub: false,
    onUpdate: (self) => {
      const v = self.getVelocity();
      const boost = Math.min(Math.abs(v) / 250, 6);
      gsap.to(loop, {
        timeScale: (v < 0 ? -1 : 1) * (1 + boost),
        duration: 0.2,
        overwrite: true,
        onComplete: () => void gsap.to(loop, { timeScale: v < 0 ? -1 : 1, duration: 1.2 }),
      });
    },
  });
  return loop;
}
