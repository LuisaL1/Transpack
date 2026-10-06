import { useLang } from "@/i18n";
import { galleryText } from "@/data/home";
import { useSite } from "@/hooks/useContent";

// Mosaico de fotos del trabajo (GALLERY de src/data/site.ts)
export function Gallery() {
  const spans = [
    "row-span-2",
    "",
    "",
    "lg:row-span-2 lg:col-start-4 lg:row-start-1",
    "lg:col-span-2",
  ];
  const { tr } = useLang();
  const t = galleryText(tr);
  const { GALLERY } = useSite();
  return (
    <section
      aria-label={t.label}
      className="grid grid-cols-2 grid-rows-[repeat(3,160px)] gap-2.5 p-2.5 sm:grid-rows-[repeat(3,220px)] lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] lg:grid-rows-[260px_260px]"
    >
      {GALLERY.map((g, i) => (
        <figure
          key={g.caption}
          className={`group relative m-0 overflow-hidden rounded-[10px] ${spans[i]}`}
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
