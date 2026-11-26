import { useRef } from "react";
import { useLang } from "@/i18n";
import { galleryText } from "@/data/home";
import { useSite } from "@/hooks/useContent";
import { useMotion } from "@/hooks/useMotion";

// Fotos del trabajo (GALLERY de src/data/site.ts) en dos filas que se desplazan
// en sentidos opuestos con el scroll (nov. 2026, estilo unitedcarriers; sin
// fijar la sección). Las fotos verticales ("tall") van más angostas y las
// destacadas ("wide", 16:9) más anchas; las fotos nuevas del cliente (nov.
// 2026) van "wide" y al principio de cada fila, la parte que más se ve. Cada fila
// repite sus fotos para cubrir el ancho mientras se mueve (la copia va oculta a
// los lectores de pantalla). Al pasar el cursor, la foto se acerca (sin
// leyenda encima desde nov. 2026; la descripción queda en el alt). Con movimiento reducido, las filas quedan quietas.
// Con márgenes (nov. 2026, pedido del equipo): las filas ya no van de borde a
// borde de la pantalla, sino dentro del ancho del contenido (el de la
// cabecera), en un recuadro con las esquinas redondeadas como las fotos; sin
// difuminado en los lados (no gustó).
export function Gallery() {
  const { tr } = useLang();
  const t = galleryText(tr);
  const { GALLERY } = useSite();
  const rows = [GALLERY.filter((_, i) => i % 2 === 0), GALLERY.filter((_, i) => i % 2 === 1)];
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (m, el) => {
    const [a, b] = el.querySelectorAll("[data-gallery-row]");
    m.parallax(a, el, { xPercent: -4 }, { xPercent: -22 }, { scrub: 0.5 });
    m.parallax(b, el, { xPercent: -22 }, { xPercent: -4 }, { scrub: 0.5 });
  });
  return (
    <section
      ref={ref}
      aria-label={t.label}
      className="mx-auto my-3 grid w-[min(100%-32px,1200px)] gap-3 overflow-hidden rounded-[20px] wide:w-[min(100%-120px,1320px)]"
      dir="ltr"
    >
      {rows.map((row, r) => (
        <div key={r} data-gallery-row className="flex w-max gap-3">
          {[0, 1].map((copy) =>
            row.map((g) => (
              <figure
                key={`${copy}-${g.caption}`}
                aria-hidden={copy === 1}
                className={`group relative m-0 h-[200px] shrink-0 overflow-hidden rounded-[20px] sm:h-[260px] lg:h-[300px] ${
                  g.tall ? "aspect-[3/4]" : g.wide ? "aspect-[16/9]" : "aspect-[4/3]"
                }`}
              >
                <img
                  decoding="async"
                  src={g.src}
                  alt={copy === 1 ? "" : g.caption}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              </figure>
            )),
          )}
        </div>
      ))}
    </section>
  );
}
