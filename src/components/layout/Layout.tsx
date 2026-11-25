import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AdvisorChat } from "@/components/chat/AdvisorChat";
import { RouteLines } from "@/components/layout/RouteLines";
import { IsoCubes } from "@/components/layout/IsoCubes";
import { useScrollToHash } from "@/hooks/useScrollToHash";
import { loadMotion } from "@/hooks/useMotion";
import { usePageMotion } from "@/hooks/usePageMotion";

// Estructura común de todas las páginas: cabecera, contenido, pie y chat.
// El motor de movimiento (scroll inercial y animaciones, src/lib/motion.ts) se
// carga cuando el navegador queda libre, después de la primera pintura.
export function Layout() {
  useScrollToHash();
  usePageMotion();
  useEffect(() => {
    const start = () => void loadMotion();
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(start, 300);
    return () => clearTimeout(id);
  }, []);
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <AdvisorChat />
      {/* Fondo: rutas animadas (prueba) */}
      <RouteLines />
      {/* Fondo: cubos isométricos en los márgenes (prueba) */}
      <IsoCubes />
    </>
  );
}
