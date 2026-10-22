import type { ReactNode } from "react";

// Encabezado oscuro para páginas internas (nosotros, servicio, artículo)
export function PageHero({ children, image }: { children: ReactNode; image?: string }) {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#272b7c_0%,#1b1e5c_55%,#2f2959_100%)] pb-20 pt-36 text-white/80 md:pb-28 md:pt-44">
      {image && (
        <>
          <img
            fetchPriority="high"
            src={image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-azul-900 via-azul-900/85 to-azul/40" />
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
