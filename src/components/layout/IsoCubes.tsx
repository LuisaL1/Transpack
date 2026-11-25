import type { CSSProperties } from "react";

// Fondo con cubos isométricos en contorno (prueba, nov. 2026): siluetas de
// cajas y cubos dibujadas solo con líneas finas, en gris suave, en los
// márgenes laterales (donde no hay contenido). Levitan y giran unos pocos
// grados (animación .iso-float en src/styles/index.css), cada una con su
// duración y su desfase, para que nunca se sincronicen. Solo SVG y CSS, sin JS.
// Decorativo (aria-hidden, sin clics) y solo fondo: detrás de todo el contenido
// (z-index negativo, como RouteLines). Desde 1360 px, cuando los márgenes junto
// al contenido (1200 px) quedan libres; con movimiento reducido, quietos.
type Shape = "cube" | "flat" | "tall";

const PIECES: {
  shape: Shape;
  side: "left" | "right";
  top: string;
  size: number;
  dur: number;
  delay: number;
}[] = [
  { shape: "cube", side: "left", top: "17vh", size: 56, dur: 9, delay: 0 },
  { shape: "flat", side: "right", top: "29vh", size: 62, dur: 11, delay: -4 },
  { shape: "tall", side: "left", top: "47vh", size: 50, dur: 8, delay: -2.5 },
  { shape: "cube", side: "right", top: "64vh", size: 46, dur: 12, delay: -7 },
  { shape: "flat", side: "left", top: "80vh", size: 54, dur: 10, delay: -5.5 },
];

export function IsoCubes() {
  return (
    <div
      aria-hidden="true"
      className="bg-margins-only pointer-events-none fixed inset-0 -z-10 hidden min-[1360px]:block"
    >
      {PIECES.map((p, i) => (
        <div
          key={i}
          className={`absolute ${p.side === "left" ? "-translate-x-1/2" : "translate-x-1/2"}`}
          style={{
            top: p.top,
            [p.side]: "calc((100vw - 1200px) / 4)",
          }}
        >
          <svg
            viewBox="0 0 60 60"
            width={p.size}
            height={p.size}
            className="iso-float text-suave"
            style={{ "--iso-dur": `${p.dur}s`, "--iso-delay": `${p.delay}s` } as CSSProperties}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.28}
            strokeWidth={1.1}
            strokeLinejoin="round"
            strokeLinecap="round"
          >
            <IsoShape shape={p.shape} />
          </svg>
        </div>
      ))}
    </div>
  );
}

// Prisma isométrico: tapa (rombo), aristas verticales y base. Desde el vértice
// de atrás de la tapa (B), el ancho `w` baja hacia la izquierda y el fondo `d`
// hacia la derecha (pendiente 1/2); `h` es la altura. Centrado en `cx`.
function prism(cx: number, top: number, w: number, d: number, h: number) {
  const bx = cx + (w - d) / 2;
  const B = [bx, top];
  const L = [bx - w, top + w / 2];
  const R = [bx + d, top + d / 2];
  const F = [bx - w + d, top + (w + d) / 2];
  const lid = `M${B} L${R} L${F} L${L} Z`;
  const sides = `M${L} V${L[1] + h} L${F[0]} ${F[1] + h} L${R[0]} ${R[1] + h} V${R[1]} M${F} V${F[1] + h}`;
  return { lid, sides, B, L, R, F };
}

function IsoShape({ shape }: { shape: Shape }) {
  if (shape === "cube") {
    const p = prism(30, 6, 20, 20, 24);
    return (
      <>
        <path d={p.lid} />
        <path d={p.sides} />
      </>
    );
  }
  if (shape === "tall") {
    const p = prism(30, 4, 14, 14, 36);
    return (
      <>
        <path d={p.lid} />
        <path d={p.sides} />
        {/* Franja de la etiqueta en la cara izquierda */}
        <path
          d={`M${p.L[0] + 3} ${p.L[1] + 15.5} L${p.F[0] - 3} ${p.F[1] + 12.5}`}
          strokeOpacity={0.2}
        />
      </>
    );
  }
  // Caja plana con la cinta que cruza la tapa y baja por el frente
  const p = prism(32, 14, 24, 16, 14);
  const midBL = [(p.B[0] + p.L[0]) / 2, (p.B[1] + p.L[1]) / 2];
  const midRF = [(p.R[0] + p.F[0]) / 2, (p.R[1] + p.F[1]) / 2];
  return (
    <>
      <path d={p.lid} />
      <path d={p.sides} />
      <path d={`M${midBL} L${midRF} V${midRF[1] + 14}`} strokeOpacity={0.2} />
    </>
  );
}
