import { useState } from "react";
import { Link } from "react-router-dom";
import { postsFor } from "@/data/content";
import { headerText, type Menu } from "@/data/navigation";
import { useLang } from "@/i18n";
import { Bi, btn } from "@/components/ui";
import { MenuLink } from "@/components/layout/MenuLink";

// Menú móvil a pantalla completa: acordeón por sección
export function MobileMenu({ menus }: { menus: Menu[] }) {
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const { lang, lp, tr } = useLang();
  const blogPosts = postsFor(lang);
  const t = headerText(tr);
  return (
    <nav
      className="animate-fade-up fixed inset-x-0 bottom-0 top-[66px] z-40 overflow-y-auto bg-white px-5 pb-10 pt-3 lg:hidden"
      aria-label={t.mobileNav}
    >
      {menus.map((m) => {
        const open = mobileSection === m.key;
        return (
          <div key={m.key} className="border-b border-linea">
            <button
              onClick={() => setMobileSection(open ? null : m.key)}
              aria-expanded={open}
              className="flex w-full items-center justify-between py-4 font-title text-lg font-semibold text-tinta"
            >
              {m.label}
              <Bi
                n="chevron-down"
                className={`text-sm text-azul transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>
            {open && (
              <div className="animate-fade-up grid gap-0.5 pb-4">
                {m.posts &&
                  blogPosts.map((p) => (
                    <Link
                      key={p.slug}
                      to={lp(`/blog/${p.slug}`)}
                      className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-gris"
                    >
                      <img
                        loading="lazy"
                        decoding="async"
                        src={p.cover}
                        alt=""
                        className="h-10 w-14 shrink-0 rounded-lg object-cover"
                      />
                      <span className="line-clamp-2 text-[0.88rem] font-medium text-tinta">
                        {p.title}
                      </span>
                    </Link>
                  ))}
                {m.items.map((it) => (
                  <MenuLink
                    key={it.label}
                    item={it}
                    className="flex items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-gris"
                  >
                    <Bi n={it.icon} className="text-lg text-azul" />
                    <span className="font-medium text-tinta">{it.label}</span>
                  </MenuLink>
                ))}
                <Link
                  to={m.feature.to}
                  className="mt-1 inline-flex items-center gap-1.5 px-2 py-2 text-[0.88rem] font-semibold text-naranja"
                >
                  {m.feature.cta} <Bi n="arrow-right" />
                </Link>
              </div>
            )}
          </div>
        );
      })}
      <Link to={lp("/#cotizar")} className={`${btn.primary} ${btn.lg} mt-6 w-full`}>
        {t.quote}
      </Link>
    </nav>
  );
}
