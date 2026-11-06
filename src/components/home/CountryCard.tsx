import { useState } from "react";
import { Bi } from "@/components/ui/Bi";
import { useLang } from "@/i18n";
import { mapText } from "@/data/home";
import { useDestinationName } from "@/hooks/useContent";
import type { PickedCountry } from "@/hooks/useGlobe";

// Tarjeta junto al país (o la ciudad de Colombia) que se tocó en el mapa de la
// portada: su foto (de la capital, en los países; desde Wikimedia Commons, con su
// autor y licencia), el nombre y la capital o el país. Va a la
// derecha del punto o, en la mitad derecha del mapa, a la izquierda.
export function CountryCard({ picked, onClose }: { picked: PickedCountry; onClose: () => void }) {
  const { tr, lang } = useLang();
  const t = mapText(tr);
  const placeName = useDestinationName();
  const [broken, setBroken] = useState(false);
  const { photo, x, y, w: width, h: height } = picked;
  const city = picked.kind === "city";
  // Las ciudades de Colombia van con su nombre en español
  const name = city ? picked.place.name : placeName(picked.place.name);
  const capital = photo && "capital" in photo ? photo.capital[lang] : "";
  const subtitle = city ? t.countryName : capital && `${t.capital}: ${capital}`;
  const W = Math.min(240, width - 24);
  const left = x < width / 2 ? Math.min(x + 18, width - W - 12) : Math.max(x - W - 18, 12);
  const top = Math.min(Math.max(y - 120, 12), Math.max(12, height - 260));

  return (
    <div
      role="dialog"
      aria-label={name}
      className="animate-fade-up absolute z-10 overflow-hidden rounded-[18px] bg-white shadow-[var(--shadow-float)] ring-1 ring-azul/5"
      style={{ left, top, width: W }}
    >
      {photo && !broken && (
        <img
          key={photo.src}
          src={photo.src}
          alt={city ? t.cityPhoto(name, t.countryName) : t.cityPhoto(capital, name)}
          width={photo.width}
          height={photo.height}
          referrerPolicy="no-referrer"
          decoding="async"
          onError={() => setBroken(true)}
          className="aspect-[4/3] w-full bg-gris object-cover"
        />
      )}
      <div className="flex items-start gap-2 p-3.5">
        <div className="min-w-0 flex-1">
          <p className="text-left font-title text-[1.05rem] font-semibold leading-tight text-tinta">
            {name}
          </p>
          {subtitle && <p className="mt-0.5 text-left text-[0.8rem] text-texto">{subtitle}</p>}
          {photo && !broken && (
            <p className="mt-2 line-clamp-2 text-left text-[0.65rem] leading-snug text-suave">
              {t.credit}:{" "}
              <a
                href={photo.page}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-2 hover:underline"
              >
                {photo.author} · {photo.license}
              </a>
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gris text-texto transition-colors hover:bg-azul hover:text-white"
          aria-label={t.close}
        >
          <Bi n="x-lg" />
        </button>
      </div>
    </div>
  );
}
