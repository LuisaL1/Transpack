import type { ReactNode } from "react";
import { Bi } from "@/components/ui";

// Filas de enlaces del chat: tarjeta blanca con borde fino y, en cada fila, un
// ícono en su recuadro, el texto en negrita y una flecha que se desplaza al
// pasar el mouse. Las usan las acciones de la ventana de respaldo (WhatsApp,
// formulario).

/** Tarjeta que agrupa las filas */
export function ChatList({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`animate-fade-up grid gap-0.5 rounded-2xl border border-linea bg-white p-2 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

/** Clases de cada fila (botón, enlace interno o externo) */
export const chatRowCls =
  "group flex items-center gap-3 rounded-xl p-2 text-start transition-colors hover:bg-gris";

/** Contenido de una fila: ícono, texto y flecha */
export function ChatRow({ icon, label }: { icon: string; label: string }) {
  return (
    <>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gris text-azul transition-colors group-hover:bg-azul group-hover:text-naranja">
        <Bi n={icon} />
      </span>
      <span className="min-w-0 flex-1 text-[0.86rem] font-semibold leading-snug text-azul">
        {label}
      </span>
      <Bi
        n="chevron-right"
        className="shrink-0 text-[0.8rem] text-suave transition-transform group-hover:translate-x-0.5 group-hover:text-naranja rtl:rotate-180"
      />
    </>
  );
}
