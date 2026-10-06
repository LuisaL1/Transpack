import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { headerText, menusFor, type Menu } from "@/data/navigation";
import { useLang } from "@/i18n";
import { Bi, btn } from "@/components/ui";
import { LangBar } from "@/components/layout/LangBar";
import { Logo } from "@/components/layout/Logo";
import { MegaMenuPanel } from "@/components/layout/MegaMenuPanel";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { SiteSearch } from "@/components/layout/SiteSearch";
import { SupportPanel } from "@/components/layout/SupportPanel";

// Cabecera fija: franja de idiomas, logo, megamenús, buscador, soporte y menú
// móvil. El contenido de los menús está en src/data/navigation.ts.
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const { pathname, hash, search } = useLocation();
  const { lang, lp, tr } = useLang();
  const MENUS = useMemo(() => menusFor(lang), [lang]);
  const t = headerText(tr);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Ctrl/⌘ + K abre el buscador
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setActive(null);
        setMenuOpen(false);
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Si el menú abre a Joel, el menú se cierra para dejarle espacio
  useEffect(() => {
    const close = () => {
      setMenuOpen(false);
      setActive(null);
    };
    window.addEventListener("tp:open-chat", close);
    return () => window.removeEventListener("tp:open-chat", close);
  }, []);

  // Cierra menús al navegar
  useEffect(() => {
    setMenuOpen(false);
    setActive(null);
  }, [pathname, hash, search]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setActive(null);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setActive(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [menuOpen]);

  // Abre al pasar el mouse; se cierra con un pequeño margen para poder llegar al panel
  const hoverOpen = (key: string) => {
    window.clearTimeout(closeTimer.current);
    setActive(key);
  };
  const hoverClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setActive(null), 160);
  };

  const solid = scrolled || menuOpen || active !== null;
  const iconCls = `grid h-9 w-9 place-items-center rounded-full text-[1.05rem] transition-colors ${
    solid
      ? "text-tinta hover:bg-gris hover:text-azul"
      : "text-white/90 hover:bg-white/15 hover:text-white"
  }`;
  const current = MENUS.find((m) => m.key === active);
  const sectionOf = (m: Menu) =>
    (m.key === "nosotros" && /^(\/en)?\/(nosotros|about)/.test(pathname)) ||
    (m.key === "servicios" && /^(\/en)?\/(servicios|services)/.test(pathname)) ||
    (m.key === "blog" && /^(\/en)?\/blog/.test(pathname));

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          solid
            ? "bg-white/95 shadow-[0_1px_0_#e1e5ee,0_8px_24px_-16px_rgba(39,43,124,.25)] backdrop-blur-xl"
            : ""
        }`}
      >
        <LangBar hidden={scrolled || menuOpen} />
        <div
          ref={navRef}
          onMouseLeave={hoverClose}
          className={`relative mx-auto flex w-[min(100%-32px,1200px)] items-center justify-between gap-6 transition-all ${
            scrolled ? "h-[66px]" : "h-[76px]"
          }`}
        >
          <Logo light={!solid} compact />

          {/* Escritorio */}
          <nav className="hidden items-center gap-4 lg:flex xl:gap-6" aria-label={t.mainNav}>
            {MENUS.map((m) => {
              const open = active === m.key;
              return (
                <button
                  key={m.key}
                  onMouseEnter={() => hoverOpen(m.key)}
                  onFocus={() => hoverOpen(m.key)}
                  onClick={() => setActive(open ? null : m.key)}
                  aria-expanded={open}
                  aria-haspopup="true"
                  className={`relative inline-flex items-center gap-1 py-1.5 text-[0.86rem] font-medium xl:text-[0.92rem] transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:bg-naranja after:transition-transform after:duration-300 ${
                    open || sectionOf(m) ? "after:scale-x-100" : "after:scale-x-0"
                  } ${solid ? "text-tinta hover:text-azul" : "text-white/90 hover:text-white"}`}
                >
                  {m.label}
                  <Bi
                    n="chevron-down"
                    className={`text-[0.65rem] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                  />
                </button>
              );
            })}
            <span className={`h-5 w-px ${solid ? "bg-linea" : "bg-white/25"}`} aria-hidden="true" />
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setActive(null);
                  setSearchOpen(true);
                }}
                onMouseEnter={hoverClose}
                aria-label={t.search}
                title={t.searchTitle}
                className={iconCls}
              >
                <Bi n="search" />
              </button>
              <button
                onMouseEnter={() => hoverOpen("soporte")}
                onFocus={() => hoverOpen("soporte")}
                onClick={() => setActive(active === "soporte" ? null : "soporte")}
                aria-label={t.support}
                aria-expanded={active === "soporte"}
                title={t.support}
                className={`${iconCls} ${active === "soporte" ? (solid ? "bg-gris text-azul" : "bg-white/15") : ""}`}
              >
                <Bi n="headset" />
              </button>
            </div>
            <Link
              to={lp("/#cotizar")}
              className={`${btn.primary} px-4 py-2 text-[0.85rem]`}
              onMouseEnter={hoverClose}
            >
              {t.quote}
            </Link>
          </nav>

          {/* Panel desplegable (megamenú) */}
          {current && (
            <div
              className="absolute left-1/2 top-full hidden w-[min(100vw-32px,880px)] -translate-x-1/2 pt-2 lg:block"
              onMouseEnter={() => window.clearTimeout(closeTimer.current)}
            >
              <MegaMenuPanel key={current.key} menu={current} />
            </div>
          )}

          {/* Panel de soporte */}
          {active === "soporte" && (
            <div
              className="absolute end-0 top-full w-[min(100vw-32px,330px)] pt-2"
              onMouseEnter={() => window.clearTimeout(closeTimer.current)}
            >
              <SupportPanel />
            </div>
          )}

          {/* Íconos en móvil */}
          <div className="relative z-10 ms-auto flex items-center gap-0.5 lg:hidden">
            <button
              onClick={() => {
                setMenuOpen(false);
                setSearchOpen(true);
              }}
              aria-label={t.searchMobile}
              className={`${iconCls} ${menuOpen ? "text-azul" : ""}`}
            >
              <Bi n="search" />
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                setActive(active === "soporte" ? null : "soporte");
              }}
              aria-label={t.support}
              aria-expanded={active === "soporte"}
              className={`${iconCls} ${menuOpen ? "text-azul" : ""}`}
            >
              <Bi n="headset" />
            </button>
          </div>

          {/* Botón de menú móvil */}
          <button
            className={`relative z-10 grid h-11 w-11 place-items-center text-2xl lg:hidden ${solid ? "text-azul" : "text-white"}`}
            aria-label={menuOpen ? t.closeMenu : t.openMenu}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <Bi n={menuOpen ? "x-lg" : "list"} />
          </button>
        </div>
      </header>

      <SiteSearch open={searchOpen} onClose={() => setSearchOpen(false)} />

      {menuOpen && <MobileMenu menus={MENUS} />}
    </>
  );
}
