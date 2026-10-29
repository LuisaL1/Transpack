import { useEffect, useLayoutEffect, useState } from "react";

// En el servidor (HTML pre-generado) useLayoutEffect avisa; allí no hace falta
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

// Cifra con sufijo en naranja (ej. 2.000+)
export function StatValue({ value, suffix }: { value: number; suffix: string }) {
  return (
    <span>
      {value.toLocaleString("es-CO")}
      <span className="text-naranja">{suffix}</span>
    </span>
  );
}

/**
 * Cifra que cuenta desde 0 hasta su valor cada vez que `active` pasa a true
 * (carrusel de cifras del inicio). Con `instant`, o si el visitante pidió
 * reducir el movimiento, muestra el valor completo sin contar. En el HTML
 * pre-generado y para los lectores de pantalla va siempre el valor completo.
 */
export function StatCounter({
  value,
  suffix,
  active,
  instant = false,
  duration = 1800,
}: {
  value: number;
  suffix: string;
  active: boolean;
  instant?: boolean;
  duration?: number;
}) {
  const [shown, setShown] = useState(value);

  // Al activarse, vuelve a 0 antes de pintarse (sin parpadeo del valor final)
  useIsoLayoutEffect(() => {
    if (!active || instant) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setShown(0);
  }, [active]);

  useEffect(() => {
    if (!active) return;
    if (instant || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      // Rápido al principio y suave al llegar
      setShown(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <span>
      <span aria-hidden="true">{shown.toLocaleString("es-CO")}</span>
      <span className="sr-only">{value.toLocaleString("es-CO")}</span>
      <span className="text-naranja">{suffix}</span>
    </span>
  );
}
