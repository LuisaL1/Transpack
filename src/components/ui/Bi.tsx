import type { CSSProperties } from "react";

// Ícono de Bootstrap Icons (solo se usa la fuente de íconos, no los componentes)
export function Bi({
  n,
  className = "",
  style,
}: {
  n: string;
  className?: string;
  style?: CSSProperties;
}) {
  return <i className={`bi bi-${n} ${className}`} style={style} aria-hidden="true" />;
}
