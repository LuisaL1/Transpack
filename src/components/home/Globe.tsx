import { useLang } from "@/i18n";
import { mapText } from "@/data/home";
import { SECTOR_PHOTOS } from "@/data/sectorPhotos";
import { useDestinationName } from "@/hooks/useContent";
import { useGlobe } from "@/hooks/useGlobe";
import { CountryCard } from "@/components/home/CountryCard";

// Lado derecho de la portada (pedido del cliente, oct. 2026): empieza con un
// carrusel de fotos de los sectores exclusivos de Bogotá (SECTOR_PHOTOS, desde
// Wikimedia Commons, con su crédito; nov. 2026), que se cierra en un círculo
// donde aparece Bogotá; luego Colombia y el resto del mundo (src/lib/globe.ts).
// La primera foto es lo que se ve en el HTML pre-generado y mientras carga el
// mapa. Al tocar un país se detiene y muestra la foto de su capital (CountryCard).
export function Globe({ className = "" }: { className?: string }) {
  const { tr } = useLang();
  const t = mapText(tr);
  const placeName = useDestinationName();
  const { canvasRef, photoRef, picked, close } = useGlobe({
    origin: t.origin,
    country: "Colombia",
    city: "Bogotá",
    cityCredit: t.cityCredit,
    exclusive: t.exclusive,
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
        {SECTOR_PHOTOS.map((p, i) => (
          <figure
            key={p.src}
            className="relative m-0 aspect-[4/3] w-[82%] max-w-[700px] overflow-hidden rounded-[28px] bg-gris [grid-area:1/1]"
            style={{ opacity: i ? 0 : 1 }}
          >
            <img
              src={p.src}
              alt={t.cityPhoto(p.name, "Bogotá")}
              width={p.width}
              height={p.height}
              referrerPolicy="no-referrer"
              fetchPriority={i ? "auto" : "high"}
              decoding="async"
              className="h-full w-full object-cover"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-tinta/85 to-transparent px-5 pb-3.5 pt-10 text-left text-white">
              <span className="block font-title text-[1.05rem] font-semibold leading-tight">
                {p.name}
              </span>
              <span className="block text-[0.65rem] text-white/80">
                {t.credit}: {p.author} · {p.license}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      {picked && <CountryCard key={picked.place.name} picked={picked} onClose={close} />}
    </div>
  );
}
