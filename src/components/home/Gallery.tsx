import { useLang } from "@/i18n";
import { galleryText } from "@/data/home";
import { useSite } from "@/hooks/useContent";

// Mosaico de fotos del trabajo (GALLERY de src/data/site.ts): 4 columnas en
// escritorio y 2 en celular. Las fotos verticales ("tall") ocupan dos filas y el
// acomodo denso llena los huecos, así que agregar o quitar fotos no requiere
// posiciones a mano (para un mosaico sin huecos: celdas = fotos + verticales,
// múltiplo de 4).
export function Gallery() {
  const { tr } = useLang();
  const t = galleryText(tr);
  const { GALLERY } = useSite();
  return (
    <section
      aria-label={t.label}
      className="grid grid-flow-row-dense auto-rows-[160px] grid-cols-2 gap-2.5 p-2.5 sm:auto-rows-[220px] lg:grid-cols-4"
    >
      {GALLERY.map((g) => (
        <figure
          key={g.caption}
          className={`group relative m-0 overflow-hidden rounded-[10px] ${g.tall ? "row-span-2" : ""}`}
        >
          <img
            decoding="async"
            src={g.src}
            alt={g.caption}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-tinta/85 to-transparent px-4 pb-3.5 pt-10 text-[0.88rem] font-semibold text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            {g.caption}
          </figcaption>
        </figure>
      ))}
    </section>
  );
}
