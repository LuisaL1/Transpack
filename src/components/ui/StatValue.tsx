import { useEffect, useLayoutEffect, useState } from "react";
import { LANG_INFO, useLang } from "@/i18n";

// En el servidor (HTML pre-generado) useLayoutEffect avisa; allí no hace falta
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

// Separador de miles según el idioma de la página (2.000 en español, 2,000 en inglés)
const useNumberFormat = () => {
  const locale = LANG_INFO[useLang().lang].locale;
  return (n: number) => n.toLocaleString(locale);
};

// Cifra con sufijo en naranja (ej. 2.000+)
export function StatValue({ value, suffix }: { value: number; suffix: string }) {
  const fmt = useNumberFormat();
  return (
    <span>
      {fmt(value)}
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
  const fmt = useNumberFormat();

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
      <span aria-hidden="true">{fmt(shown)}</span>
      <span className="sr-only">{fmt(value)}</span>
      <span className="text-naranja">{suffix}</span>
    </span>
  );
}
