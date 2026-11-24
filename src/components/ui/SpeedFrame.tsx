import type { ReactNode } from "react";

// Efecto de velocidad en el borde de las fotos (pedido del cliente, nov. 2026:
// empresa de envíos, en vez de la línea divisora entre foto y texto). Hacia el
// borde indicado la foto toma un desenfoque de movimiento solo horizontal (como
// una foto tomada en movimiento), se deshace hacia el fondo y la cruzan unas
// líneas de velocidad. El filtro SVG se define una sola vez (SpeedFilter, en
// Layout). Con movimiento reducido las líneas no se ven (el resto es estático).
export type SpeedEdge = "left" | "right" | "bottom";

// Las clases van escritas completas (Tailwind solo genera las que encuentra)
const FADE: Record<SpeedEdge, string> = {
  left: "[mask-image:linear-gradient(90deg,transparent,#000_30%)]",
  right: "[mask-image:linear-gradient(270deg,transparent,#000_30%)]",
  bottom: "[mask-image:linear-gradient(0deg,transparent,#000_28%)]",
};
const LG_FADE: Record<SpeedEdge, string> = {
  left: "lg:[mask-image:linear-gradient(90deg,transparent,#000_30%)]",
  right: "lg:[mask-image:linear-gradient(270deg,transparent,#000_30%)]",
  bottom: "lg:[mask-image:linear-gradient(0deg,transparent,#000_28%)]",
};
// Desvanecido largo, para lo que no es foto (el mapa): disimula sus bordes
const LG_FADE_WIDE: Record<SpeedEdge, string> = {
  left: "lg:[mask-image:linear-gradient(90deg,transparent,#000_50%)]",
  right: "lg:[mask-image:linear-gradient(270deg,transparent,#000_50%)]",
  bottom: "lg:[mask-image:linear-gradient(0deg,transparent,#000_45%)]",
};
// Dónde se ve la copia desenfocada (la mitad de la foto más cercana al borde)
const BLUR: Record<SpeedEdge, string> = {
  left: "[mask-image:linear-gradient(90deg,#000_12%,transparent_58%)]",
  right: "[mask-image:linear-gradient(270deg,#000_12%,transparent_58%)]",
  bottom: "[mask-image:linear-gradient(0deg,#000_12%,transparent_58%)]",
};
const LG_BLUR: Record<SpeedEdge, string> = {
  left: "lg:[mask-image:linear-gradient(90deg,#000_12%,transparent_58%)]",
  right: "lg:[mask-image:linear-gradient(270deg,#000_12%,transparent_58%)]",
  bottom: "lg:[mask-image:linear-gradient(0deg,#000_12%,transparent_58%)]",
};
// Franja donde corren las líneas y hacia qué lado (--dir: -1 izquierda, 1 derecha)
const LINES: Record<SpeedEdge, string> = {
  left: "top-0 bottom-0 left-0 right-auto h-auto w-[48%] [--dir:-1]",
  right: "top-0 bottom-0 right-0 left-auto h-auto w-[48%] [--dir:1]",
  bottom: "top-auto bottom-0 left-0 right-0 h-[45%] w-auto [--dir:-1]",
};
const LG_LINES: Record<SpeedEdge, string> = {
  left: "lg:top-0 lg:bottom-0 lg:left-0 lg:right-auto lg:h-auto lg:w-[48%] lg:[--dir:-1]",
  right: "lg:top-0 lg:bottom-0 lg:right-0 lg:left-auto lg:h-auto lg:w-[48%] lg:[--dir:1]",
  bottom: "lg:top-auto lg:bottom-0 lg:left-0 lg:right-0 lg:h-[45%] lg:w-auto lg:[--dir:-1]",
};
// Líneas: altura (%), inicio y largo (% del ancho), retraso y si es naranja
const STREAKS = [
  { top: 18, left: 8, width: 62, delay: 0, orange: false },
  { top: 34, left: 22, width: 46, delay: 1.1, orange: true },
  { top: 52, left: 4, width: 70, delay: 0.5, orange: false },
  { top: 67, left: 30, width: 40, delay: 1.7, orange: false },
  { top: 82, left: 12, width: 54, delay: 0.8, orange: true },
];

/** Filtro de desenfoque de movimiento horizontal (una sola vez por página) */
export function SpeedFilter() {
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute">
      <filter id="tp-motion-blur" x="-10%" y="0" width="120%" height="100%">
        <feGaussianBlur stdDeviation="26 0" />
      </filter>
    </svg>
  );
}

/**
 * Marco con efecto de velocidad. `edge`: borde con el efecto (en celular y
 * tableta); `lgEdge`: el de pantallas anchas, si cambia. `blurSrc`: la misma
 * foto, para la capa desenfocada (sin ella, como en el mapa, solo se deshace
 * el borde y corren las líneas); `blurClassName`: el encuadre de esa foto
 * (object-position), igual al de la foto de adentro. `wideFade`: desvanecido
 * más largo en pantallas anchas (para lo que no es foto, como el mapa).
 */
export function SpeedFrame({
  edge,
  lgEdge,
  blurSrc,
  blurClassName = "",
  className = "",
  wideFade = false,
  children,
}: {
  edge: SpeedEdge;
  lgEdge?: SpeedEdge;
  blurSrc?: string;
  blurClassName?: string;
  className?: string;
  wideFade?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative overflow-hidden ${FADE[edge]} ${
        lgEdge ? (wideFade ? LG_FADE_WIDE : LG_FADE)[lgEdge] : ""
      } ${className}`}
    >
      {children}
      {blurSrc && (
        <img
          aria-hidden="true"
          alt=""
          src={blurSrc}
          decoding="async"
          className={`pointer-events-none absolute inset-0 h-full w-full scale-x-105 object-cover [filter:url(#tp-motion-blur)] ${BLUR[edge]} ${
            lgEdge ? LG_BLUR[lgEdge] : ""
          } ${blurClassName}`}
        />
      )}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute overflow-hidden ${LINES[edge]} ${lgEdge ? LG_LINES[lgEdge] : ""}`}
      >
        {STREAKS.map((s) => (
          <span
            key={s.top}
            className={`speed-line absolute h-[2px] rounded-full ${s.orange ? "bg-naranja/80" : "bg-white/75"}`}
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: `${s.width}%`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </span>
    </div>
  );
}
