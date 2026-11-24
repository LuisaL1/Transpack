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
 * (cifras del inicio). Con `instant`, o si el visitante pidió
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

/**
 * Cifra tipo odómetro (nov. 2026, estilo terminal-industries): cada dígito es
 * una columna que rueda hasta su valor, una vuelta completa y un poco escalonada,
 * cuando `active` pasa a true. En el HTML pre-generado, sin JS y con movimiento
 * reducido, las columnas ya están en el valor final; los lectores de pantalla
 * leen el valor completo.
 */
export function StatOdometer({
  value,
  suffix = "",
  active,
  plain = false,
}: {
  value: number;
  suffix?: string;
  active: boolean;
  /** Sin separador de miles (p. ej. un año: 1968) */
  plain?: boolean;
}) {
  const fmt = useNumberFormat();
  const text = plain ? String(value) : fmt(value);
  // armed: en el navegador, con movimiento permitido, las columnas esperan en 0
  const [armed, setArmed] = useState(false);
  useIsoLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setArmed(true);
  }, []);
  const rolling = armed && !active;
  let digit = 0;
  return (
    <span>
      <span aria-hidden="true" className="inline-flex tabular-nums">
        {[...text].map((ch, i) => {
          if (!/\d/.test(ch)) return <span key={i}>{ch}</span>;
          const d = Number(ch);
          const k = digit++;
          return (
            <span key={i} className="inline-block h-[1em] overflow-hidden leading-none">
              {/* En el servidor, solo el dígito final (sin una lista de números
                  sueltos en el HTML); en el navegador, la columna completa */}
              {armed ? (
                <span
                  className="flex flex-col transition-transform duration-[1600ms] ease-[cubic-bezier(.2,.8,.2,1)]"
                  style={{
                    transform: `translateY(-${rolling ? 0 : 10 + d}em)`,
                    transitionDelay: `${k * 110}ms`,
                  }}
                >
                  {Array.from({ length: 20 }, (_, n) => (
                    <span key={n} className="h-[1em]">
                      {n % 10}
                    </span>
                  ))}
                </span>
              ) : (
                <span className="block h-[1em]">{d}</span>
              )}
            </span>
          );
        })}
      </span>
      <span className="sr-only">{text}</span>
      <span className="text-naranja">{suffix}</span>
    </span>
  );
}
