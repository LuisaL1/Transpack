import { Outlet } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AdvisorChat } from "@/components/chat/AdvisorChat";
import { SpeedFilter } from "@/components/ui";
import { useScrollToHash } from "@/hooks/useScrollToHash";

// Estructura común de todas las páginas: cabecera, contenido, pie y chat.
export function Layout() {
  useScrollToHash();
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <AdvisorChat />
      {/* Desenfoque de movimiento de las fotos (SpeedFrame) */}
      <SpeedFilter />
    </>
  );
}
