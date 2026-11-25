import { useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

// Transición entre páginas (nov. 2026): al cambiar de ruta, un telón azul con
// el cuadrado naranja de la marca cubre la pantalla y se retira hacia arriba
// dejando ver la página nueva (animación .page-curtain en src/styles/index.css).
// No aparece al entrar al sitio, al saltar a una sección de la misma página
// (#ancla) ni con movimiento reducido. Es decorativo: no se lee ni se puede
// tocar.
export function PageCurtain() {
  const { pathname } = useLocation();
  const first = useRef(true);
  // Cambia en cada navegación para volver a montar el telón (y su animación)
  const [run, setRun] = useState(0);

  // Antes de pintar la página nueva, así no se alcanza a ver sin el telón
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setRun((n) => n + 1);
  }, [pathname]);

  if (!run) return null;
  return (
    <div
      key={run}
      aria-hidden="true"
      className="page-curtain pointer-events-none fixed inset-0 z-[90] grid place-items-center bg-azul"
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) setRun(0);
      }}
    >
      <span className="page-curtain-mark h-14 w-14 rotate-45 rounded-[22%] bg-naranja" />
    </div>
  );
}
