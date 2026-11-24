import { useEffect, type DependencyList, type RefObject } from "react";

type MotionModule = typeof import("@/lib/motion");

let loading: Promise<MotionModule | null> | null = null;

/** Carga el motor de movimiento una sola vez (null con movimiento reducido) */
export function loadMotion() {
  loading ??= import("@/lib/motion").then((m) => (m.init() ? m : null));
  return loading;
}

/**
 * Animaciones con GSAP sobre el elemento `ref` (única puerta de entrada al
 * motor, src/lib/motion.ts). `setup` corre después de cargar el motor, dentro de
 * un gsap.context limitado a ese elemento: al desmontar (o al cambiar `deps`) se
 * deshace todo (y se llama la función que devuelva `setup`, p. ej. para quitar
 * listeners). No corre en la pre-generación ni con movimiento reducido, así
 * que el contenido debe verse completo sin animación: anime solo con
 * gsap.from / ScrollTrigger lo que entra con el scroll (lo de arriba de la
 * portada se anima con CSS, sin esperar al motor).
 */
export function useMotion<T extends HTMLElement>(
  ref: RefObject<T | null>,
  setup: (m: MotionModule, el: T) => void | (() => void),
  deps: DependencyList = [],
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    let ctx: { revert: () => void } | undefined;
    loadMotion().then((m) => {
      if (cancelled || !m) return;
      ctx = m.gsap.context(() => setup(m, el), el);
    });
    return () => {
      cancelled = true;
      ctx?.revert();
    };
    // `setup` se define en cada render; lo que lo cambia va en `deps`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
