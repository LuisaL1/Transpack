import type { ReactNode } from "react";
import { PhotoFrame } from "@/components/ui";

// Foto del encabezado de los servicios (nov. 2026, en todos los que llevan foto;
// antes solo Mudanzas locales): la foto en un PhotoFrame con su pestaña abajo a
// la izquierda (nombre del servicio, con la animación de .hero-reveal), dos
// capas azules sólidas desplazadas detrás (como hojas apiladas, a 10 y 20 px; la
// de atrás más clara). La etiqueta de envío simulada que llevaba se quitó
// (pedido del equipo, nov. 2026).
export function ShippingPhoto({ children, tab }: { children: ReactNode; tab?: ReactNode | true }) {
  return (
    // Espacio a la derecha y abajo para los marcos desplazados
    <div className="relative h-full pb-5 pe-5">
      <div className="relative h-full">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 translate-x-5 translate-y-5 rounded-[24px] bg-azul/30"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-[24px] bg-azul"
        />
        <PhotoFrame tab={tab} className="h-full">
          {children}
        </PhotoFrame>
      </div>
    </div>
  );
}
