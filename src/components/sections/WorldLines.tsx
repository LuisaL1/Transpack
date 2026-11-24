import mapaLineas from "@/assets/images/mapa-lineas.svg";

// Fondo de mapamundi de líneas (propuesta nov. 2026; Nosotros, bloque de
// historia): contornos de los continentes, fronteras y rutas desde Bogotá en
// azul muy tenue (7 a 13 %), con destellos cortos de luz naranja y azul (26 a
// 34 %) que las recorren lento y sin parar. El SVG trae su propia animación CSS
// (sin JS) y, con
// movimiento reducido, se queda sin pulsos. Se genera con `pnpm map`
// (scripts/generate-world-lines.mjs). Va detrás del contenido: la sección debe
// ser `relative overflow-hidden` y su contenido `relative`.
export function WorldLines({ className = "" }: { className?: string }) {
  return (
    <img
      src={mapaLineas}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      draggable={false}
      className={`pointer-events-none absolute select-none [mask-image:radial-gradient(ellipse_at_center,#000_40%,transparent_78%)] ${className}`}
    />
  );
}
