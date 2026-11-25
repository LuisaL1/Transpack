import { useRef, type ReactNode } from "react";
import { PhotoFrame } from "@/components/ui";
import { useMotion } from "@/hooks/useMotion";

/** Lado desde el que el barrido de color descubre la foto del encabezado */
export type HeroReveal = "left" | "right" | "top";
import { ShippingPhoto } from "@/components/services/ShippingPhoto";

// Encabezado de páginas internas (nosotros, servicio, artículo, política, 404).
// La información va a la izquierda sobre fondo blanco y la foto a la derecha,
// como una tarjeta con esquinas redondeadas y sombra (sin línea divisora entre
// las dos, nov. 2026). En celular y tableta la foto va arriba y el texto debajo. Sin foto, el texto ocupa todo
// el ancho. En vez de la foto puede ir otro elemento (`media`) en la misma
// tarjeta (los mapas animados van ahora en `backdrop`, abajo). Con `blend`, la foto va
// sin tarjeta: sus bordes se desvanecen y se funde con el fondo blanco.
// La tarjeta es un PhotoFrame (nov. 2026): esquinas redondeadas, sin sombra, y
// una pestaña blanca abajo a la izquierda, del lado del texto (vacía o con
// `tab`, p. ej. el nombre del servicio). Con `shipping` (el slug del servicio;
// nov. 2026, en todos los servicios con foto), la foto va además con un doble
// marco azul desplazado y una etiqueta de envío acorde al servicio (ShippingPhoto).
//
// Movimiento (nov. 2026, como el inicio): el contenido entra escalonado y el
// h1 sale de una máscara (CSS .hero-stagger y .line-mask, sin esperar al
// motor). La foto (o el mapa) llega con un barrido de color (.hero-reveal, en
// CSS): una franja naranja y un panel azul cruzan el marco desde `reveal`
// (izquierda por defecto) y, al retirarse, dejan ver la foto, que se acerca y
// pasa de borrosa a nítida; luego entra la pestaña. La foto fundida (`blend`)
// aparece sin panel, con el mismo acercamiento. Ya quieta, la foto sigue un
// poco al cursor (solo con mouse) y, al bajar, se corre y se acerca (parallax).
// Ambos mueven variables CSS (--hero-mx, --hero-my, --hero-py, --hero-ps) que
// usan las propiedades translate y scale, aparte del transform del
// acercamiento al pasar el cursor de PhotoFrame. El cuadrado naranja de la
// marca flota detrás del texto.
//
// Con `backdrop` (panel del mapa animado) e `image`, diseño "bento" (nov.
// 2026; Mudanzas locales, nacionales e internacionales; antes, capas fundidas
// con máscara, que ensuciaban foto y mapa): el panel azul noche del mapa ocupa
// el lugar de la foto y la foto va aparte, nítida, como una tarjeta más pequeña
// con borde blanco (sin pestaña) montada sobre la esquina inferior izquierda
// del panel. El
// panel entra acercándose y enfocándose; la tarjeta llega después con el
// barrido de color y, al bajar, sube más rápido que el panel (profundidad). En
// celular y tableta el panel va arriba y la tarjeta se monta en su esquina.
export function PageHero({
  children,
  image,
  media,
  backdrop,
  reveal = "left",
  blend = false,
  shipping,
  tab = true,
}: {
  children: ReactNode;
  image?: string;
  media?: ReactNode;
  /** Mapa animado para la capa de fondo (con `image`: composición en capas) */
  backdrop?: ReactNode;
  reveal?: HeroReveal;
  blend?: boolean;
  shipping?: string;
  tab?: ReactNode | true;
}) {
  const visual = Boolean(image || media);
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (m, el) => {
    // En la parte de arriba la foto está quieta: no salta cuando carga el motor
    const scroll = { start: "top top", end: "bottom top" };
    m.parallax(
      "[data-hero-img]",
      el,
      { "--hero-py": "0%", "--hero-ps": 1.06 },
      { "--hero-py": "5%", "--hero-ps": 1.14 },
      scroll,
    );
    m.parallax("[data-hero-square]", el, { y: 0, rotation: 45 }, { y: 140, rotation: 75 }, scroll);
    m.parallax("[data-hero-card]", el, { y: 0 }, { y: -50 }, scroll);

    // La foto sigue un poco al cursor (en sentido contrario, como si estuviera
    // más lejos); solo con mouse
    const pic = el.querySelector<HTMLElement>("[data-hero-img]");
    if (!pic || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const mx = m.gsap.quickTo(pic, "--hero-mx", { duration: 1.2, ease: "power3.out" });
    const my = m.gsap.quickTo(pic, "--hero-my", { duration: 1.2, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      mx(-((e.clientX - r.left) / r.width - 0.5) * 22);
      my(-((e.clientY - r.top) / r.height - 0.5) * 16);
    };
    const leave = () => {
      mx(0);
      my(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  });
  // Clases del <section> y del cuadrado de la marca, comunes a las dos composiciones
  const shell =
    "relative overflow-hidden border-b border-linea pt-[124px] text-texto md:pt-[148px] wide:pt-[162px]";
  const square = (
    <span
      aria-hidden="true"
      data-hero-square
      className="pointer-events-none absolute -start-28 top-[42%] hidden h-56 w-56 rotate-45 rounded-[22%] bg-naranja/[0.07] md:block"
    />
  );

  // Lugar de la foto o del mapa: a la derecha, alineado con el borde del
  // contenido; en celular y tableta, arriba con los mismos márgenes del texto
  const frame =
    "relative mx-auto w-[min(100%-32px,1200px)] pt-2 lg:absolute lg:top-10 lg:bottom-16 lg:left-[50%] lg:right-[max(16px,calc((100vw-1200px)/2))] lg:mx-0 lg:w-auto lg:pt-0";
  if (backdrop && image)
    return (
      <section ref={ref} className={shell}>
        {square}
        <div className="relative">
          <div className={`${frame} lg:bottom-24`}>
            <div className="relative h-[360px] sm:h-[440px] lg:h-full">
              {/* Panel del mapa */}
              <div className="hero-blend-in h-full [--hero-ps:1]">{backdrop}</div>
              {/* Tarjeta de la foto, montada sobre la esquina del panel */}
              <div
                data-hero-card
                className="absolute -bottom-8 start-3 z-10 w-[46%] sm:w-[38%] lg:-bottom-12 lg:-start-12 lg:w-[42%]"
              >
                <div className="hero-reveal hero-reveal-left [--sweep-delay:.55s]">
                  <PhotoFrame className="aspect-[4/3] shadow-[var(--shadow-float)] ring-[6px] ring-white">
                    <img
                      fetchPriority="high"
                      src={image}
                      alt=""
                      data-hero-img
                      className="hero-parallax hero-img-in h-full w-full object-cover"
                    />
                  </PhotoFrame>
                </div>
              </div>
            </div>
          </div>
          <div className="relative pb-10 pt-16 md:pb-14 md:pt-20 lg:flex lg:min-h-[640px] lg:w-[46%] lg:flex-col lg:justify-center lg:py-14 lg:pe-10">
            <div className="relative mx-auto w-[min(100%-32px,1200px)] lg:ms-[max(16px,calc((100vw-1200px)/2))] lg:w-auto">
              {children}
            </div>
          </div>
        </div>
      </section>
    );

  const img = image && (
    <img
      fetchPriority="high"
      src={image}
      alt=""
      data-hero-img
      className={`hero-parallax h-[240px] w-full object-cover sm:h-[340px] lg:h-full ${
        blend ? "photo-blend hero-blend-in" : "hero-img-in"
      }`}
    />
  );
  const photo =
    img &&
    (blend ? (
      img
    ) : shipping ? (
      <ShippingPhoto slug={shipping} tab={tab}>
        {img}
      </ShippingPhoto>
    ) : (
      <PhotoFrame tab={tab} className="h-full">
        {img}
      </PhotoFrame>
    ));
  return (
    <section ref={ref} className={shell}>
      {/* Cuadrado naranja girado de la marca, detrás del texto */}
      {square}
      <span
        aria-hidden="true"
        className="hero-float pointer-events-none absolute start-[47%] top-[72%] hidden h-4 w-4 rotate-45 rounded-[4px] bg-naranja/50 lg:block"
      />
      <div className="relative">
        {media ? (
          <div className={frame}>
            <div className={`hero-reveal hero-reveal-${reveal} h-full`}>
              <PhotoFrame tab={tab} className="h-full">
                <div className="hero-img-in h-full [--hero-ps:1]">{media}</div>
              </PhotoFrame>
            </div>
          </div>
        ) : (
          photo && (
            <div className={frame}>
              {blend ? (
                photo
              ) : (
                <div className={`hero-reveal hero-reveal-${reveal} h-full`}>{photo}</div>
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
