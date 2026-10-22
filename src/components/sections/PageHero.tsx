import type { ReactNode } from "react";

// Encabezado de páginas internas (nosotros, servicio, artículo). Con foto, la
// foto se ve bien (pedido del cliente, oct. 2026): azul oscuro solo a la
// izquierda, donde va el texto, y hacia la derecha tonos naranja a rojizo.
export function PageHero({ children, image }: { children: ReactNode; image?: string }) {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#272b7c_0%,#1b1e5c_55%,#2f2959_100%)] pb-20 pt-40 text-white/80 md:pb-28 md:pt-48">
      {image && (
        <>
          <img
            fetchPriority="high"
            src={image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,15,51,.94)_0%,rgba(27,30,92,.86)_34%,rgba(27,30,92,.45)_58%,rgba(232,64,28,.28)_82%,rgba(255,118,25,.22)_100%)]" />
        </>
      )}
      <span
        aria-hidden="true"
        className="absolute -left-[40%] top-[62%] h-[140px] w-[180%] -rotate-[38deg] bg-gradient-to-r from-transparent via-white/5 to-transparent"
      />
      <div className="relative mx-auto w-[min(100%-32px,1200px)]">{children}</div>
    </section>
  );
}
