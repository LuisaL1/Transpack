import type { ReactNode } from "react";

// Etiqueta superior de sección con los chevrons naranja del manual (›››)
export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <p
      data-eyebrow
      className={`mb-4 inline-flex items-center gap-2 font-title text-[0.8rem] font-semibold uppercase tracking-[0.18em] ${
        light ? "text-beige" : "text-azul"
      }`}
    >
      <span
        aria-hidden="true"
        className="text-[1.5em] font-bold leading-none tracking-[-0.12em] text-naranja"
      >
        {/* Cada chevron por separado: se encienden en secuencia (usePageMotion) */}
        <span data-chevron className="inline-block">
          ›
        </span>
        <span data-chevron className="inline-block">
          ›
        </span>
        <span data-chevron className="inline-block">
          ›
        </span>
      </span>
      {children}
    </p>
  );
}
