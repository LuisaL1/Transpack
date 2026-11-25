import type { ReactNode } from "react";
import { DropIn, PhotoFrame, type DropFrom } from "@/components/ui";
import { ShippingPhoto } from "@/components/services/ShippingPhoto";

// Encabezado de páginas internas (nosotros, servicio, artículo, política, 404).
// La información va a la izquierda sobre fondo blanco y la foto a la derecha,
// como una tarjeta con esquinas redondeadas y sombra (sin línea divisora entre
// las dos, nov. 2026). Con `drop`, la foto llega como una caja que se deja:
// desde ese lado, golpea contra su lugar y rebota un poco (DropIn). En celular y
// tableta la foto va arriba y el texto debajo. Sin foto, el texto ocupa todo
// el ancho. En vez de la foto puede ir otro elemento (`media`), como el mapa
// animado de Mudanzas nacionales, en la misma tarjeta. Con `blend`, la foto va
// sin tarjeta: sus bordes se desvanecen y se funde con el fondo blanco.
// La tarjeta es un PhotoFrame (nov. 2026): esquinas redondeadas, sin sombra, y
// una pestaña blanca abajo a la izquierda, del lado del texto (vacía o con
// `tab`, p. ej. el nombre del servicio). Con `shipping` (prueba, nov. 2026), la
// foto va con un doble marco azul desplazado y una etiqueta de envío
// (ShippingPhoto).
export function PageHero({
  children,
  image,
  media,
  drop,
  blend = false,
  shipping = false,
  tab = true,
}: {
  children: ReactNode;
  image?: string;
  media?: ReactNode;
  drop?: DropFrom;
  blend?: boolean;
  shipping?: boolean;
  tab?: ReactNode | true;
}) {
  const visual = Boolean(image || media);
  const img = image && (
    <img
      fetchPriority="high"
      src={image}
      alt=""
      className={`h-[240px] w-full object-cover sm:h-[340px] lg:h-full ${blend ? "photo-blend" : ""}`}
    />
  );
  const photo =
    img &&
    (blend ? (
      img
    ) : shipping ? (
      <ShippingPhoto>{img}</ShippingPhoto>
    ) : (
      <PhotoFrame tab={tab} className="h-full">
        {img}
      </PhotoFrame>
    ));
  // Lugar de la foto o del mapa: a la derecha, alineado con el borde del
  // contenido; en celular y tableta, arriba con los mismos márgenes del texto
  const frame =
    "relative mx-auto w-[min(100%-32px,1200px)] pt-2 lg:absolute lg:top-10 lg:bottom-16 lg:left-[50%] lg:right-[max(16px,calc((100vw-1200px)/2))] lg:mx-0 lg:w-auto lg:pt-0";
  return (
    <section className="relative overflow-hidden border-b border-linea bg-white pt-[124px] text-texto md:pt-[148px] wide:pt-[162px]">
      <div className="relative">
        {media ? (
          <div className={frame}>
            <PhotoFrame tab={tab} className="h-full">
              {media}
            </PhotoFrame>
          </div>
        ) : (
          photo && (
            <div className={frame}>
              {drop ? (
                <DropIn from={drop} className="h-full">
                  {photo}
                </DropIn>
              ) : (
                photo
              )}
            </div>
          )
        )}
        <div
          className={`relative py-10 md:py-14 ${
            visual
              ? "lg:flex lg:min-h-[600px] lg:w-[46%] lg:flex-col lg:justify-center lg:py-14 lg:pe-10"
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
