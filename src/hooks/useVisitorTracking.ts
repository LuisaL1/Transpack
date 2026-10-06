import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { track, trackVisit } from "@/lib/joel";

// Perfil del visitante para Joel: registra la visita y las secciones que se
// quedan al menos 1,5 s en pantalla (solo en el navegador, nunca sale del equipo)
export function useVisitorTracking() {
  const { pathname } = useLocation();
  useEffect(() => trackVisit(), []);
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const seen = new Set<string>();
    const timers: Record<string, number> = {};
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          const id = (e.target as HTMLElement).id;
          if (e.isIntersecting && !seen.has(id))
            timers[id] = window.setTimeout(() => {
              seen.add(id);
              track("section", id);
            }, 1500);
          else clearTimeout(timers[id]);
        }),
      { threshold: 0.35 },
    );
    // Espera a que la página nueva pinte sus secciones
    const raf = requestAnimationFrame(() =>
      document.querySelectorAll("main section[id]").forEach((el) => io.observe(el)),
    );
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      Object.values(timers).forEach(clearTimeout);
    };
  }, [pathname]);
}
