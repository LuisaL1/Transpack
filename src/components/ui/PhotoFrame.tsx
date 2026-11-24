import type { ReactNode } from "react";

/** Esquina donde va la pestaña: abajo a la izquierda o arriba a la derecha */
export type TabCorner = "bl" | "tr";

// Marco de foto (propuesta nov. 2026, estilo "bento"): esquinas redondeadas y,
// en una esquina, una pestaña invertida del color del fondo que rodea la foto,
// con sus dos curvas hacia adentro, como si la foto estuviera recortada. Así la
// imagen se une con el fondo y con el texto de al lado. La pestaña puede ir
// vacía (`tab` = true, solo el recorte) o con un rótulo. El color del fondo se
// toma de `--frame-bg` (blanco si no se indica; p. ej.
// `[--frame-bg:var(--color-azul)]` sobre una sección azul).
//
// La foto (hija directa) se acerca un poco (1.03×) al pasar el cursor sobre el
// marco o sobre la tarjeta que lo contiene (`group`). Estilos: .photo-frame en
// src/styles/index.css.
export function PhotoFrame({
  children,
  tab,
  corner = "bl",
  className = "",
}: {
  children: ReactNode;
  tab?: ReactNode | true;
  corner?: TabCorner;
  className?: string;
}) {
  return (
    <div className={`photo-frame ${className}`}>
      {children}
      {tab && (
        <span className={`frame-tab frame-tab-${corner}`}>
          {tab === true ? <span aria-hidden="true" className="block h-5 w-14 sm:w-20" /> : tab}
        </span>
      )}
    </div>
  );
}
