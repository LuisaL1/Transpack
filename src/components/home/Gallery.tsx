import { useRef } from "react";
import { useLang } from "@/i18n";
import { galleryText } from "@/data/home";
import { useSite } from "@/hooks/useContent";
import { useMotion } from "@/hooks/useMotion";

// Fotos del trabajo (GALLERY de src/data/site.ts) en dos filas que se desplazan
// en sentidos opuestos con el scroll (nov. 2026, estilo unitedcarriers; sin
// fijar la sección). Las fotos verticales ("tall") van más angostas. Cada fila
// repite sus fotos para cubrir el ancho mientras se mueve (la copia va oculta a
// los lectores de pantalla). Al pasar el cursor, la foto se acerca y sube su
// leyenda. Con movimiento reducido, las filas quedan quietas.
export function Gallery() {
  const { tr } = useLang();
  const t = galleryText(tr);
  const { GALLERY } = useSite();
  const rows = [GALLERY.filter((_, i) => i % 2 === 0), GALLERY.filter((_, i) => i % 2 === 1)];
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (m, el) => {
    const scrub = { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.5 };
    const [a, b] = el.querySelectorAll("[data-gallery-row]");
    m.gsap.fromTo(a, { xPercent: -4 }, { xPercent: -22, ease: "none", scrollTrigger: scrub });
    m.gsap.fromTo(b, { xPercent: -22 }, { xPercent: -4, ease: "none", scrollTrigger: scrub });
  });
  return (
    <section ref={ref} aria-label={t.label} className="grid gap-3 overflow-hidden py-3" dir="ltr">
      {rows.map((row, r) => (
        <div key={r} data-gallery-row className="flex w-max gap-3">
          {[0, 1].map((copy) =>
            row.map((g) => (
              <figure
                key={`${copy}-${g.caption}`}
                aria-hidden={copy === 1}
                className={`group relative m-0 h-[200px] shrink-0 overflow-hidden rounded-[20px] sm:h-[260px] lg:h-[300px] ${
                  g.tall ? "aspect-[3/4]" : "aspect-[4/3]"
                }`}
              >
                <img
                  decoding="async"
                  src={g.src}
                  alt={copy === 1 ? "" : g.caption}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-tinta/85 to-transparent px-4 pb-3.5 pt-10 text-[0.88rem] font-semibold text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  {g.caption}
                </figcaption>
              </figure>
            )),
          )}
        </div>
      ))}
    </section>
  );
}
