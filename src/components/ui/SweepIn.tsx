import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/** Lado desde el que el barrido de color descubre la foto */
export type SweepFrom = "left" | "right" | "top";

// Foto que llega con el barrido de color de los encabezados (PageHero), pero al
// entrar en pantalla (nov. 2026; reemplaza a DropIn, la caja que caía y
// rebotaba): una franja naranja y un panel azul cruzan el marco desde `from`,
// la foto aparece detrás acercándose y enfocándose y, al final, brota la
// pestaña de su PhotoFrame. Estilos .hero-reveal y .sweep-on-view en
// src/styles/index.css. La foto lleva la clase `hero-img-in`. `delay` (ms)
// escalona varias fotos. Como antes DropIn, en el HTML pre-generado la foto
// espera oculta; con movimiento reducido se ve directamente.
export function SweepIn({
  from = "left",
  delay = 0,
  className = "",
  children,
}: {
  from?: SweepFrom;
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) return setInView(true);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        io.disconnect();
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`hero-reveal hero-reveal-${from} sweep-on-view ${inView ? "is-in" : ""} ${className}`}
      style={delay ? ({ "--sweep-delay": `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
