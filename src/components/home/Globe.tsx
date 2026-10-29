import { useLang } from "@/i18n";
import { mapText } from "@/data/home";
import { useDestinationName } from "@/hooks/useContent";
import { useGlobe } from "@/hooks/useGlobe";

// Globo de la portada (pedido del cliente, oct. 2026, con la web de Spectrum
// como referencia): empieza en Colombia, traza las rutas hacia las capitales de
// los países con embajadas atendidas y luego gira mostrando todos los destinos
// (src/lib/globe.ts). Mientras cargan los puntos de tierra, y en el HTML
// pre-generado, se ve la esfera azul sola.
export function Globe({ className = "" }: { className?: string }) {
  const { tr } = useLang();
  const t = mapText(tr);
  const placeName = useDestinationName();
  const { canvasRef, ready } = useGlobe({
    origin: t.origin,
    stop: (p) =>
      t.capitals[p.name] ? `${t.capitals[p.name]} · ${placeName(p.name)}` : placeName(p.name),
  });
  return (
    <div className={`relative ${className}`} dir="ltr">
      {/* Esfera de respaldo (misma luz que la del canvas) */}
      <div
        aria-hidden="true"
        className={`absolute left-1/2 top-1/2 aspect-square h-[94%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_32%_30%,#34399A,#272B7C_55%,#0D0F33)] transition-opacity duration-700 ${
          ready ? "opacity-0" : "opacity-100"
        }`}
      />
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={t.label}
        className={`absolute inset-0 h-full w-full transition-[opacity,transform] duration-1000 ease-out ${
          ready ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
      />
    </div>
  );
}
