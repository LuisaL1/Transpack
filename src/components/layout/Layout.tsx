import { Outlet } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AdvisorChat } from "@/components/chat/AdvisorChat";
import { useScrollToHash } from "@/hooks/useScrollToHash";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";

// Estructura común de todas las páginas: cabecera, contenido, pie y chat.
export function Layout() {
  useScrollToHash();
  useVisitorTracking();
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <AdvisorChat />
    </>
  );
}
