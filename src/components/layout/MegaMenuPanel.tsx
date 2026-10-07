import { Link } from "react-router-dom";
import { postsFor } from "@/data/content";
import { headerText, type Menu } from "@/data/navigation";
import { DESTINATIONS } from "@/data/worldMap";
import { useDestinationName } from "@/hooks/useContent";
import { useLang } from "@/i18n";
import { Bi } from "@/components/ui";
import { MenuLink } from "@/components/layout/MenuLink";

// Panel desplegable de escritorio (megamenú)
export function MegaMenuPanel({ menu }: { menu: Menu }) {
  const f = menu.feature;
  const { lang, lp, tr } = useLang();
  const blogPosts = postsFor(lang);
  const placeName = useDestinationName();
  const t = headerText(tr);
  return (
    <div className="animate-fade-up grid grid-cols-[250px_1fr] gap-3 rounded-[22px] bg-white p-3 shadow-[var(--shadow-float)] ring-1 ring-azul/5">
      <div className="relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-azul to-violeta p-6 text-white/75">
        <span
          aria-hidden="true"
          className="absolute -right-10 -top-10 h-28 w-28 rotate-45 rounded-[22%] bg-naranja/25"
        />
        <p className="relative mb-2 font-title text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-naranja">
          {f.kicker}
        </p>
        <p className="relative mb-2 font-title text-[1.15rem] font-semibold leading-snug text-white">
          {f.title}
        </p>
        <p className="relative mb-5 text-[0.82rem] leading-relaxed">{f.text}</p>
        <Link
          to={f.to}
          className="group relative mt-auto inline-flex items-center gap-1.5 text-[0.85rem] font-semibold text-white"
        >
          {f.cta}{" "}
          <Bi
            n="arrow-right"
            className="text-naranja transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>

      <div className="py-1">
        {menu.posts && (
          <div className="mb-2 grid gap-1">
            {blogPosts.map((p) => (
              <Link
                key={p.slug}
                to={lp(`/blog/${p.slug}`)}
                className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-gris"
              >
                <img
                  loading="lazy"
                  decoding="async"
                  src={p.cover}
                  alt=""
                  className="h-12 w-16 shrink-0 rounded-lg object-cover"
                />
                <span className="min-w-0">
                  <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-naranja">
                    {p.cat}
                  </span>
                  <span className="line-clamp-1 text-[0.86rem] font-semibold text-tinta group-hover:text-azul">
                    {p.title}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        )}

        <div
          className={`grid gap-1 ${menu.cols === 2 ? "grid-cols-2" : ""} ${menu.posts ? "grid-cols-3 border-t border-linea pt-2" : ""}`}
        >
          {menu.items.map((it) => (
            <MenuLink
              key={it.label}
              item={it}
              className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-gris"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gris text-lg text-azul transition-colors group-hover:bg-azul group-hover:text-naranja">
                <Bi n={it.icon} />
              </span>
              <span className="min-w-0 self-center">
                <span className="block font-title text-[0.92rem] font-semibold leading-tight text-tinta">
                  {it.label}
                </span>
                {it.desc && (
                  <span className="mt-0.5 block text-[0.76rem] leading-snug text-suave">
                    {it.desc}
                  </span>
                )}
              </span>
            </MenuLink>
          ))}
        </div>

        {menu.chips && (
          <div className="mt-2 border-t border-linea px-3 pt-3">
            <p className="mb-2 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-suave">
              {t.embassiesServed}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {DESTINATIONS.filter((d) => d.embassy).map((d) => (
                <Link
                  key={d.name}
                  to={lp("/?servicio=internacional#cotizar")}
                  className="rounded-full border border-linea px-2.5 py-1 text-[0.76rem] font-medium text-tinta transition-colors hover:border-azul hover:text-azul"
                >
                  {placeName(d.name)}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
