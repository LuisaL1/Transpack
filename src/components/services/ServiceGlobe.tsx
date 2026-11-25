import { useLang } from "@/i18n";
import { mapText } from "@/data/home";
import { useDestinationName } from "@/hooks/useContent";
import { useGlobe } from "@/hooks/useGlobe";
import type { GlobeFocus } from "@/lib/globe";
import { CountryCard } from "@/components/home/CountryCard";

// Mapa animado de las páginas de servicio (nov. 2026), sacado del globo de la
// portada (mismo motor y estilo: src/lib/globe.ts y useGlobe): solo Bogotá
// con sus localidades y las líneas que salen de la sede (Mudanzas locales) o
// solo el mundo, de Colombia a cada continente
// y la vuelta al globo con todas las rutas (Mudanzas internacionales). Ocupa
// todo su contenedor, sin fondo propio: va dentro del panel azul noche de
// ServiceMapPanel. Se puede tocar un lugar para ver su foto (CountryCard),
// como en la portada.
// Con `plain` (encabezado "split"), solo el mapa con el nombre de cada localidad
// en la punta de su línea; la animación corre una vez, sin bucle ni pausa con el
// cursor. `scale` lo agranda en su lienzo.
export function ServiceGlobe({
  focus,
  plain = false,
  scale = 1,
}: {
  focus: GlobeFocus;
  plain?: boolean;
  scale?: number;
}) {
  const { tr } = useLang();
  const t = mapText(tr);
  const placeName = useDestinationName();
  const { canvasRef, picked, close } = useGlobe(
    {
      origin: t.origin,
      country: "Colombia",
      city: "Bogotá",
      cityCredit: t.cityCredit,
      place: (p) => placeName(p.name),
      plain,
      scale,
    },
    focus,
    { once: plain, hoverPause: !plain },
  );
  return (
    <div className="absolute inset-0" dir="ltr">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={t.label}
        className="absolute inset-0 h-full w-full"
      />
      {picked && <CountryCard key={picked.place.name} picked={picked} onClose={close} />}
    </div>
  );
}
