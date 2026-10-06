import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Al cambiar de ruta: si hay #ancla, baja a esa sección; si no, vuelve arriba.
export function useScrollToHash() {
  const { pathname, hash, search } = useLocation();
  useEffect(() => {
    if (hash) {
      // Espera a que la nueva página se pinte antes de buscar la sección
      const id = decodeURIComponent(hash.slice(1));
      let tries = 0;
      const go = () => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        else if (tries++ < 10) setTimeout(go, 50);
      };
      requestAnimationFrame(go);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash, search]);
}
