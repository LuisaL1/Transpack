import { useEffect, useRef, useState, type ReactNode } from "react";

/** Lado desde el que llega la imagen */
export type DropFrom = "left" | "right" | "top";

// Imagen que llega como una caja que se deja (pedido del cliente, nov. 2026):
// no se ve hasta que entra en pantalla; entonces llega desde un lado o desde
// arriba, golpea contra su lugar (se aplasta un poco) y da un pequeño rebote
// antes de quedarse quieta. Animaciones .drop-* en src/styles/index.css. Como
// <Reveal />, en el HTML pre-generado empieza oculta; con movimiento reducido
// se ve directamente.
export function DropIn({
  from,
  delay = 0,
  className = "",
  children,
}: {
  from: DropFrom;
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [dropped, setDropped] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) return setDropped(true);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDropped(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`drop-in drop-from-${from} ${dropped ? "is-dropped" : ""} ${className}`}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
