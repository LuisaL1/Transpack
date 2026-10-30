import imgInicio from "@/assets/images/imagen-transpack-inicio2.jpg";
import { useLang } from "@/i18n";
import { mapText } from "@/data/home";
import { useDestinationName } from "@/hooks/useContent";
import { useGlobe } from "@/hooks/useGlobe";

// Lado derecho de la portada (pedido del cliente, oct. 2026): empieza con la
// foto de la portada, que se cierra en un círculo donde aparece el mapa de
// Colombia; desde Bogotá salen las rutas a las capitales principales y luego al
// resto del mundo, en grises (src/lib/globe.ts). La foto también es lo que se
// ve en el HTML pre-generado y mientras carga el mapa.
export function Globe({ className = "" }: { className?: string }) {
  const { tr } = useLang();
  const t = mapText(tr);
  const placeName = useDestinationName();
  const { canvasRef, photoRef } = useGlobe({
    origin: t.origin,
    country: "Colombia",
    place: (p) => placeName(p.name),
  });
  return (
    <div className={`relative ${className}`} dir="ltr">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={t.label}
        className="absolute inset-0 h-full w-full"
      />
      <div
        ref={photoRef}
        className="pointer-events-none absolute inset-0 grid place-items-center will-change-transform"
      >
        <img
          src={imgInicio}
          alt={t.photoAlt}
          fetchPriority="high"
          decoding="async"
          className="max-h-full w-full max-w-[760px] object-contain"
        />
      </div>
    </div>
  );
}
