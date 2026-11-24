import type { ReactNode } from "react";
import { SpeedFrame } from "@/components/ui";

// Encabezado de páginas internas (nosotros, servicio, artículo, política, 404).
// La información va a la izquierda sobre fondo blanco y la foto a la derecha.
// Entre las dos ya no hay línea divisora (la franja naranja del corte diagonal
// se quitó en noviembre de 2026): la foto se deshace hacia el texto con efecto
// de velocidad (SpeedFrame: desenfoque de movimiento y líneas que corren), por
// ser una empresa de envíos. En celular y tableta la foto va arriba, con el
// efecto en su borde de abajo, y el texto debajo. Sin foto, el panel ocupa todo
// el ancho. En vez de la foto puede ir otro elemento (`media`), como el mapa
// animado de Mudanzas nacionales, con el mismo borde (sin desenfoque).
export function PageHero({
  children,
  image,
  media,
}: {
  children: ReactNode;
  image?: string;
  media?: ReactNode;
}) {
  const visual = Boolean(image || media);
  return (
    <section className="relative overflow-hidden border-b border-linea bg-white pt-[124px] text-texto md:pt-[148px] wide:pt-[162px]">
      <div className="relative">
        {visual && (
          <SpeedFrame
            edge="bottom"
            lgEdge="left"
            blurSrc={media ? undefined : image}
            wideFade={Boolean(media)}
            className="relative lg:absolute lg:inset-y-0 lg:right-0 lg:w-[60%]"
          >
            {media ?? (
              <img
                fetchPriority="high"
                src={image}
                alt=""
                className="h-[240px] w-full object-cover sm:h-[340px] lg:h-full"
              />
            )}
          </SpeedFrame>
        )}
        <div
          className={`relative py-10 md:py-14 ${
            visual
              ? "lg:flex lg:min-h-[600px] lg:w-[52%] lg:flex-col lg:justify-center lg:py-14 lg:pe-32"
              : "pb-20 md:pb-28"
          }`}
        >
          <div
            className={`relative mx-auto w-[min(100%-32px,1200px)] ${
              visual ? "lg:ms-[max(16px,calc((100vw-1200px)/2))] lg:w-auto" : ""
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
