import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { loadMotion } from "@/hooks/useMotion";

/**
 * Movimiento común de todas las páginas (nov. 2026), aplicado por Layout sin
 * tocar cada sección: los títulos `h2` del contenido entran línea por línea
 * desde una máscara (SplitText) y los chevrons ››› de cada rótulo (Eyebrow) se
 * encienden en secuencia, y los botones con `data-magnetic` siguen un poco al
 * puntero. Lo que tenga animación propia se excluye con
 * `data-motion="off"` en el elemento o en un contenedor. Se rehace al cambiar
 * de página; con movimiento reducido no hace nada.
 */
export function usePageMotion() {
  const { pathname } = useLocation();
  useEffect(() => {
    let cancelled = false;
    let ctx: { revert: () => void } | undefined;
    const cleanups: (() => void)[] = [];
    loadMotion().then((m) => {
      const main = document.querySelector("main");
      if (cancelled || !m || !main) return;
      ctx = m.gsap.context(() => {
        for (const h of main.querySelectorAll<HTMLElement>("h2")) {
          if (h.closest("[data-motion='off']")) continue;
          m.splitReveal(h);
        }
        for (const e of main.querySelectorAll<HTMLElement>("[data-eyebrow]")) {
          if (e.closest("[data-motion='off']")) continue;
          m.reveal(e.querySelectorAll("[data-chevron]"), e, {
            x: -8,
            y: 0,
            stagger: 0.12,
            duration: 0.5,
          });
        }
        // Botones "magnéticos" (data-magnetic): siguen un poco al puntero; solo
        // con mouse
        if (window.matchMedia("(hover: hover) and (pointer: fine)").matches)
          for (const b of main.querySelectorAll<HTMLElement>("[data-magnetic]")) {
            const x = m.gsap.quickTo(b, "x", { duration: 0.5, ease: "power3.out" });
            const y = m.gsap.quickTo(b, "y", { duration: 0.5, ease: "power3.out" });
            const move = (e: PointerEvent) => {
              const r = b.getBoundingClientRect();
              x((e.clientX - r.left - r.width / 2) * 0.25);
              y((e.clientY - r.top - r.height / 2) * 0.35);
            };
            const leave = () => {
              x(0);
              y(0);
            };
            b.addEventListener("pointermove", move);
            b.addEventListener("pointerleave", leave);
            cleanups.push(() => {
              b.removeEventListener("pointermove", move);
              b.removeEventListener("pointerleave", leave);
            });
          }
      }, main);
    });
    return () => {
      cancelled = true;
      ctx?.revert();
      cleanups.forEach((f) => f());
    };
  }, [pathname]);
}
