import type { ReactNode } from "react";

// Encabezado de páginas internas (nosotros, servicio, artículo, política, 404).
// Sin degradados (pedido del cliente, oct. 2026): la información va sobre un
// panel azul sólido a la izquierda, con un corte diagonal como la franja del
// logo, y la foto se ve limpia y completa a la derecha, sin capas encima. En
// celular y tableta la foto va arriba y el panel debajo. Sin foto, el panel
// ocupa todo el ancho. El panel es blanco con texto oscuro en todas las páginas
// (pedido del cliente, oct. 2026); la franja naranja del corte se mantiene
// entre el panel y la foto.
export function PageHero({ children, image }: { children: ReactNode; image?: string }) {
  const bg = "bg-white";
  return (
    <section
      className={`relative overflow-hidden ${bg} pt-[124px] md:pt-[148px] wide:pt-[162px] border-b border-linea text-texto`}
    >
      <div className="relative">
        {image && (
          <div className="relative lg:absolute lg:inset-y-0 lg:right-0 lg:w-[58%]">
            <img
              fetchPriority="high"
              src={image}
              alt=""
              className="h-[240px] w-full object-cover sm:h-[340px] lg:h-full"
            />
          </div>
        )}
        {/* Franja naranja a lo largo del corte diagonal: la misma forma del
            panel, 8 px más ancha, por detrás */}
        {image && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 hidden w-[calc(52%+8px)] bg-naranja lg:block lg:[clip-path:polygon(0_0,100%_0,calc(100%-110px)_100%,0_100%)]"
          />
        )}
        <div
          className={`relative ${bg} py-10 md:py-14 ${
            image
              ? "lg:flex lg:min-h-[600px] lg:w-[52%] lg:flex-col lg:justify-center lg:py-14 lg:pe-32 lg:[clip-path:polygon(0_0,100%_0,calc(100%-110px)_100%,0_100%)]"
              : "pb-20 md:pb-28"
          }`}
        >
          <div
            className={`relative mx-auto w-[min(100%-32px,1200px)] ${
              image ? "lg:ms-[max(16px,calc((100vw-1200px)/2))] lg:w-auto" : ""
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
