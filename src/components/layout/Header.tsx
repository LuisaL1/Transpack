import { Fragment, useEffect, useMemo, useRef, useState } from "react";
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
// Sin franja de fondo (nov. 2026): el logo y las acciones flotan sobre la página
// y los enlaces van en una píldora de vidrio (translúcida, con desenfoque). En
// la parte de arriba del inicio flota sobre la foto del Hero, en blanco.
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  // Escondida al bajar (pasada la parte de arriba); vuelve al subir
  const [tucked, setTucked] = useState(false);
  // Línea naranja de avance de lectura (se actualiza sin re-render)
  const progressRef = useRef<HTMLSpanElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const { pathname, hash, search, key } = useLocation();
  const { lang, lp, tr } = useLang();
  const MENUS = useMemo(() => menusFor(lang), [lang]);
  const t = headerText(tr);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (Math.abs(y - last) > 8) {
        // Un salto grande (ir a una sección desde el menú) no la esconde:
        // quien acaba de navegar espera verla
        const jump = Math.abs(y - last) > window.innerHeight;
        setTucked(!jump && y > last && y > 480);
        last = y;
      }
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current)
        progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    };
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
  }, [pathname, hash, search, key]);

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

  // Nunca se esconde con un menú o el buscador abiertos
  const hide = tucked && !menuOpen && active === null && !searchOpen;
  // Arriba en el inicio la cabecera va sobre la foto oscura del Hero: letras
  // blancas. En las demás portadas (blancas) y al bajar, letras oscuras.
  const home = pathname.replace(/\/$/, "") === lp("/").replace(/\/$/, "");
  const overlay = home && !scrolled && !menuOpen;
  const glass = overlay
    ? "border-white/25 bg-white/10 text-white shadow-[0_8px_30px_-12px_rgba(13,15,51,.55)]"
    : "border-linea bg-white/70 text-tinta shadow-[0_8px_30px_-14px_rgba(39,43,124,.35)]";
  const iconCls = `grid h-10 w-10 place-items-center rounded-full border text-[1.05rem] backdrop-blur-[10px] transition-colors ${
    overlay
      ? "border-white/25 bg-white/10 text-white hover:bg-white/20"
      : "border-linea bg-white/70 text-tinta hover:bg-white hover:text-azul"
  }`;
  const current = MENUS.find((m) => m.key === active);
  const sectionOf = (m: Menu) =>
    (m.key === "nosotros" && /^(\/en)?\/(nosotros|about)/.test(pathname)) ||
    (m.key === "servicios" && /^(\/en)?\/(servicios|services)/.test(pathname)) ||
    (m.key === "blog" && /^(\/en)?\/blog/.test(pathname));

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(.22,.61,.36,1)] focus-within:translate-y-0 ${
          hide ? "-translate-y-[calc(100%+12px)]" : ""
        } ${menuOpen ? "bg-white lg:bg-transparent" : ""}`}
      >
        <LangBar hidden={scrolled || menuOpen} overlay={home} />
        {/* Avance de lectura, arriba del todo (ya no hay franja de fondo) */}
        <span
          ref={progressRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-[61] h-0.5 origin-left scale-x-0 bg-naranja"
        />
        <div
          ref={navRef}
          onMouseLeave={hoverClose}
          className={`relative mx-auto flex w-[min(100%-32px,1200px)] items-center justify-between gap-2 transition-all lg:gap-3 xl:gap-6 wide:w-[min(100%-120px,1320px)] ${
            scrolled
              ? "h-[70px] md:h-[86px] wide:h-[100px]"
              : "h-[88px] md:h-[112px] wide:h-[126px]"
          }`}
        >
          <Logo light={overlay} small={scrolled} className="xl:-ms-6 wide:ms-0" />

          {/* Escritorio */}
          {/* Menús en el centro, entre el logo y las acciones, en una píldora de
              vidrio redondeada como el botón de cotizar */}
          <nav className="hidden flex-1 justify-center lg:flex" aria-label={t.mainNav}>
            <div
              className={`flex items-center gap-0.5 rounded-full border p-1 backdrop-blur-[10px] transition-colors duration-300 xl:gap-1 ${glass}`}
            >
              {MENUS.map((m) => {
                const open = active === m.key;
                const on = open || sectionOf(m);
                const link = `inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 text-[0.82rem] font-bold transition-colors xl:px-4 xl:text-[0.95rem] wide:px-5 wide:text-[1rem] ${
                  overlay
                    ? on
                      ? "bg-white/20 text-white"
                      : "text-white hover:bg-white/15"
                    : on
                      ? "bg-azul/[.07] text-azul"
                      : "text-tinta hover:bg-azul/[.05] hover:text-azul"
                }`;
                return (
                  <Fragment key={m.key}>
                    <button
                      onMouseEnter={() => hoverOpen(m.key)}
                      onFocus={() => hoverOpen(m.key)}
                      onClick={() => setActive(open ? null : m.key)}
                      aria-expanded={open}
                      aria-haspopup="true"
                      className={link}
                    >
                      {m.label}
                      <Bi
                        n="chevron-down"
                        className={`text-[0.65rem] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                      />
                    </button>
                  </Fragment>
                );
              })}
            </div>
          </nav>
          {/* Buscar, soporte y cotizar, a la derecha */}
          <div className="hidden items-center gap-1.5 lg:flex xl:gap-3.5">
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
                className={iconCls}
              >
                <Bi n="headset" />
              </button>
            </div>
            <Link
              to={lp("/#cotizar")}
              className={`${btn.primary} whitespace-nowrap px-3 py-2 text-[0.82rem] font-bold! xl:px-4 xl:text-[0.975rem]`}
              onMouseEnter={hoverClose}
            >
              {t.quote}
            </Link>
          </div>

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
              className={iconCls}
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
              className={iconCls}
            >
              <Bi n="headset" />
            </button>
          </div>

          {/* Botón de menú móvil */}
          <button
            className={`relative z-10 grid h-11 w-11 place-items-center rounded-full border text-2xl backdrop-blur-[10px] transition-colors lg:hidden ${glass}`}
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
