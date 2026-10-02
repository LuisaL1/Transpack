import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logoImg from "@/imports/logo.png";
import { postsFor, siteFor, useDestinationName } from "@/data/content";
import { localize, makeTr, useLang, type Lang } from "@/i18n";
import LangBar from "@/components/LangBar";
import { DESTINATIONS } from "@/data/worldMap";
import { Bi, btn } from "@/components/ui";
import SiteSearch from "@/components/SiteSearch";

// ─── Contenido de los menús ───────────────────────────────────────────────────
// Cada menú tiene una tarjeta destacada (izquierda) y una lista de enlaces.
// "to" = ruta interna, "href" = enlace externo, "chat" = abre a Joel.

type Item = {
  label: string;
  desc?: string;
  icon: string;
  to?: string;
  href?: string;
  chat?: boolean;
};
type Menu = {
  key: string;
  label: string;
  feature: { kicker: string; title: string; text: string; cta: string; to: string };
  items: Item[];
  cols?: 1 | 2;
  posts?: boolean;
  chips?: boolean;
};

function menusFor(lang: Lang): Menu[] {
  const { CONTACT, SERVICES, YOUTUBE_CHANNEL, waLink } = siteFor(lang);
  const tr = makeTr(lang);
  const lp = (path: string) => localize(path, lang);
  return [
    {
      key: "servicios",
      label: tr("Servicios", "Services"),
      feature: {
        kicker: tr("Servicios", "Services"),
        title: tr("Una solución integral para cada traslado", "A complete solution for every move"),
        text: tr(
          "Combinamos transporte, embalaje, bodegaje y trámites según lo que necesitas.",
          "We combine transport, packing, storage and paperwork around what you need.",
        ),
        cta: tr("Ver niveles de servicio", "See service levels"),
        to: lp("/#niveles"),
      },
      items: SERVICES.map((s) => ({
        label: s.title,
        desc: s.kicker,
        icon: s.icon,
        to: lp(`/servicios/${s.slug}`),
      })),
      cols: 2,
    },
    {
      key: "soluciones",
      label: tr("Soluciones", "Solutions"),
      feature: {
        kicker: tr("Soluciones", "Solutions"),
        title: tr(
          "Diseñamos el servicio según quién se mueve",
          "We design the service around who is moving",
        ),
        text: tr(
          "Tres unidades especializadas y un acompañamiento dedicado para quienes empiezan una vida en otro país.",
          "Three specialized units and dedicated support for those starting a life in another country.",
        ),
        cta: tr("Ver todas las soluciones", "See all solutions"),
        to: lp("/#soluciones"),
      },
      items: [
        {
          label: tr("Residencial", "Residential"),
          desc: tr(
            "Mudanzas de hogar locales, nacionales e internacionales",
            "Local, national and international household moves",
          ),
          icon: "house-door",
          to: lp("/?segmento=residencial#soluciones"),
        },
        {
          label: "Corporate Mobility",
          desc: tr(
            "Traslado de oficinas y reubicación de funcionarios",
            "Office moves and employee relocation",
          ),
          icon: "buildings",
          to: lp("/?segmento=corporate#soluciones"),
        },
        {
          label: "Diplomatic & Institutional",
          desc: tr(
            "Embajadas y organismos, con protocolo y confidencialidad",
            "Embassies and institutions, with protocol and confidentiality",
          ),
          icon: "flag",
          to: lp("/?segmento=diplomatic#soluciones"),
        },
        {
          label: tr("Diáspora", "Diaspora"),
          desc: tr(
            "Colombianos que se van del país o regresan a él",
            "Colombians moving abroad or coming back home",
          ),
          icon: "airplane",
          to: lp("/?segmento=diaspora#soluciones"),
        },
      ],
      cols: 2,
    },
    {
      key: "cobertura",
      label: tr("Cobertura", "Coverage"),
      feature: {
        kicker: tr("Cobertura global", "Global coverage"),
        title: tr("2.000+ agentes en 176 países", "2,000+ agents in 176 countries"),
        text: tr(
          "Operamos con los mismos estándares en origen y en destino, por vía marítima o aérea.",
          "We operate to the same standards at origin and destination, by sea or by air.",
        ),
        cta: tr("Ver la red global", "See the global network"),
        to: lp("/#cobertura"),
      },
      items: [
        {
          label: tr("Mudanzas internacionales", "International moving"),
          desc: tr(
            "Marítimas y aéreas, desde y hacia Colombia",
            "By sea and air, to and from Colombia",
          ),
          icon: "globe-americas",
          to: lp("/servicios/mudanzas-internacionales"),
        },
        {
          label: tr("Mudanzas nacionales", "National moving"),
          desc: tr("Entre ciudades, puerta a puerta", "Between cities, door to door"),
          icon: "truck",
          to: lp("/servicios/mudanzas-nacionales"),
        },
        {
          label: tr("Gestión aduanera", "Customs and documentation"),
          desc: tr("Exportación e importación de menaje", "Export and import of household goods"),
          icon: "file-earmark-text",
          to: lp("/servicios/gestion-aduanera"),
        },
        {
          label: tr("Certificaciones", "Certifications"),
          desc: "LACMA · IAM · PAIMA",
          icon: "award",
          to: lp("/nosotros#certificaciones"),
        },
      ],
      chips: true,
      cols: 2,
    },
    {
      key: "nosotros",
      label: tr("Nosotros", "About"),
      feature: {
        kicker: tr("Desde 1968", "Since 1968"),
        title: tr(
          "Más de cinco décadas cuidando lo que más quieres",
          "More than five decades caring for what you love most",
        ),
        text: tr(
          "Más de 60 mil toneladas de menaje exportadas a 176 países.",
          "More than 60,000 tons of household goods exported to 176 countries.",
        ),
        cta: tr("Conoce Transpack", "Meet Transpack"),
        to: lp("/nosotros"),
      },
      items: [
        {
          label: tr("Nuestra historia", "Our story"),
          icon: "clock-history",
          to: lp("/nosotros#historia"),
        },
        {
          label: tr("Misión y visión", "Mission and vision"),
          icon: "bullseye",
          to: lp("/nosotros#mision-vision"),
        },
        { label: tr("Valores", "Values"), icon: "heart", to: lp("/nosotros#valores") },
        {
          label: tr("Clientes y embajadas", "Clients and embassies"),
          icon: "people",
          to: lp("/nosotros#clientes"),
        },
        {
          label: tr("Certificaciones", "Certifications"),
          icon: "patch-check",
          to: lp("/nosotros#certificaciones"),
        },
        {
          label: tr("Transpack en video", "Transpack on video"),
          icon: "play-btn",
          to: lp("/#videos"),
        },
      ],
      cols: 2,
    },
    {
      key: "blog",
      label: "Blog",
      feature: {
        kicker: "Blog",
        title: tr("Guías para mudarte con tranquilidad", "Guides for a stress-free move"),
        text: tr(
          "Lo que debes saber antes de tu próximo traslado, explicado por quienes lo hacen todos los días.",
          "What you should know before your next move, explained by the people who do it every day.",
        ),
        cta: tr("Ver todas las guías", "See all guides"),
        to: lp("/#blog"),
      },
      items: [
        { label: tr("Preguntas frecuentes", "FAQ"), icon: "question-circle", to: lp("/#faq") },
        { label: tr("Videos", "Videos"), icon: "play-btn", to: lp("/#videos") },
        {
          label: tr("Canal de YouTube", "YouTube channel"),
          icon: "youtube",
          href: YOUTUBE_CHANNEL,
        },
      ],
      posts: true,
    },
    {
      key: "contacto",
      label: tr("Contacto", "Contact"),
      feature: {
        kicker: tr("Contacto", "Contact"),
        title: tr("Hablemos de tu mudanza", "Let's talk about your move"),
        text: CONTACT.address,
        cta: tr("Ver mapa y canales", "See map and channels"),
        to: lp("/#contacto"),
      },
      items: [
        {
          label: tr("Escríbenos por WhatsApp", "Message us on WhatsApp"),
          desc: CONTACT.phones[0],
          icon: "whatsapp",
          href: waLink(),
        },
        {
          label: tr("Llámanos", "Call us"),
          desc: CONTACT.phones.join(" · "),
          icon: "telephone",
          href: `tel:+57${CONTACT.phones[0].replace(/\s/g, "")}`,
        },
        {
          label: tr("Correo electrónico", "Email"),
          desc: CONTACT.email,
          icon: "envelope",
          href: `mailto:${CONTACT.email}`,
        },
        {
          label: tr("Habla con Joel", "Talk to Joel"),
          desc: tr("Asesor con IA, responde al instante", "AI advisor, answers instantly"),
          icon: "chat-dots",
          chat: true,
        },
      ],
      cols: 2,
    },
  ];
}

const openChat = () => window.dispatchEvent(new Event("tp:open-chat"));

// Un enlace de menú: interno, externo o el que abre el chat
function MenuLink({
  item,
  className,
  children,
}: {
  item: Item;
  className: string;
  children: React.ReactNode;
}) {
  if (item.chat)
    return (
      <button type="button" onClick={openChat} className={`${className} text-start`}>
        {children}
      </button>
    );
  if (item.href)
    return (
      <a
        href={item.href}
        target={item.href.startsWith("http") ? "_blank" : undefined}
        rel="noopener"
        className={className}
      >
        {children}
      </a>
    );
  return (
    <Link to={item.to ?? "/"} className={className}>
      {children}
    </Link>
  );
}

// ─── Panel desplegable de escritorio ──────────────────────────────────────────

function Panel({ menu }: { menu: Menu }) {
  const f = menu.feature;
  const { lang, lp, tr } = useLang();
  const blogPosts = postsFor(lang);
  const placeName = useDestinationName();
  return (
    <div className="animate-fade-up grid grid-cols-[250px_1fr] gap-3 rounded-[22px] bg-white p-3 shadow-[var(--shadow-float)] ring-1 ring-azul/5">
      <div className="relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-azul to-violeta p-6 text-white/75">
        <span
          aria-hidden="true"
          className="absolute -right-10 -top-10 h-28 w-28 rotate-45 bg-naranja/25"
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
                <img src={p.cover} alt="" className="h-12 w-16 shrink-0 rounded-lg object-cover" />
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
              {tr("Embajadas atendidas en", "Embassies served in")}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {DESTINATIONS.map((d) => (
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

// ─── Panel de soporte (audífonos) ─────────────────────────────────────────────

function supportFor(lang: Lang): Item[] {
  const { CONTACT, waLink } = siteFor(lang);
  const tr = makeTr(lang);
  return [
    {
      label: tr("Chatea con Joel", "Chat with Joel"),
      desc: tr("Asesor con IA, responde al instante", "AI advisor, answers instantly"),
      icon: "chat-dots",
      chat: true,
    },
    {
      label: "WhatsApp",
      desc: CONTACT.phones[0],
      icon: "whatsapp",
      href: waLink(tr("Hola Transpack, necesito ayuda", "Hello Transpack, I need help")),
    },
    {
      label: tr("Llámanos", "Call us"),
      desc: CONTACT.phones.join(" · "),
      icon: "telephone",
      href: `tel:+57${CONTACT.phones[0].replace(/\s/g, "")}`,
    },
    {
      label: tr("Escríbenos", "Email us"),
      desc: CONTACT.email,
      icon: "envelope",
      href: `mailto:${CONTACT.email}`,
    },
  ];
}

function SupportPanel() {
  const { lang, lp, tr } = useLang();
  const SUPPORT = supportFor(lang);
  return (
    <div className="animate-fade-up overflow-hidden rounded-[22px] bg-white shadow-[var(--shadow-float)] ring-1 ring-azul/5">
      <div className="relative overflow-hidden bg-gradient-to-br from-azul to-violeta px-5 py-4">
        <span
          aria-hidden="true"
          className="absolute -right-8 -top-8 h-20 w-20 rotate-45 bg-naranja/25"
        />
        <p className="relative flex items-center gap-2 font-title font-semibold text-white">
          <Bi n="headset" className="text-naranja" /> {tr("Soporte Transpack", "Transpack support")}
        </p>
        <p className="relative text-[0.8rem] text-white/70">
          {tr(
            "¿Necesitas ayuda con tu mudanza o tu solicitud?",
            "Need help with your move or your request?",
          )}
        </p>
      </div>
      <div className="grid gap-0.5 p-2">
        {SUPPORT.map((it) => (
          <MenuLink
            key={it.label}
            item={it}
            className="group flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-gris"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gris text-azul transition-colors group-hover:bg-azul group-hover:text-naranja">
              <Bi n={it.icon} />
            </span>
            <span className="min-w-0">
              <span className="block text-[0.88rem] font-semibold text-tinta">{it.label}</span>
              <span className="block truncate text-[0.74rem] text-suave">{it.desc}</span>
            </span>
          </MenuLink>
        ))}
      </div>
      <Link
        to={lp("/#faq")}
        className="flex items-center justify-between border-t border-linea px-5 py-3 text-[0.82rem] font-semibold text-azul hover:bg-gris"
      >
        {tr("Ver preguntas frecuentes", "See frequently asked questions")}{" "}
        <Bi n="question-circle" />
      </Link>
    </div>
  );
}

// ─── Logo ─────────────────────────────────────────────────────────────────────

export function Logo({ light = true, compact = false }: { light?: boolean; compact?: boolean }) {
  const { lp, tr } = useLang();
  return (
    <Link
      to={lp("/")}
      className="relative z-10 inline-flex items-center gap-3"
      aria-label={tr("Transpack, inicio", "Transpack, home")}
    >
      <img
        src={logoImg}
        alt=""
        width={44}
        height={44}
        className={`h-10 w-10 rounded-[4px] md:h-11 md:w-11 ${light ? "ring-[1.5px] ring-white/50" : ""}`}
      />
      <span
        className={`${compact ? "lg:hidden xl:inline" : ""} font-title text-lg font-bold tracking-[0.08em] transition-colors md:text-[1.3rem] ${
          light ? "text-white" : "text-azul"
        }`}
      >
        TRANSPACK
      </span>
    </Link>
  );
}

// ─── Encabezado ───────────────────────────────────────────────────────────────

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const { pathname, hash, search } = useLocation();
  const { lang, lp, tr } = useLang();
  const MENUS = useMemo(() => menusFor(lang), [lang]);
  const blogPosts = postsFor(lang);

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
          <nav
            className="hidden items-center gap-4 lg:flex xl:gap-6"
            aria-label={tr("Principal", "Main")}
          >
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
                aria-label={tr("Buscar en el sitio (Ctrl + K)", "Search the site (Ctrl + K)")}
                title={tr("Buscar (Ctrl + K)", "Search (Ctrl + K)")}
                className={iconCls}
              >
                <Bi n="search" />
              </button>
              <button
                onMouseEnter={() => hoverOpen("soporte")}
                onFocus={() => hoverOpen("soporte")}
                onClick={() => setActive(active === "soporte" ? null : "soporte")}
                aria-label={tr("Soporte", "Support")}
                aria-expanded={active === "soporte"}
                title={tr("Soporte", "Support")}
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
              {tr("Cotiza tu mudanza", "Get a quote")}
            </Link>
          </nav>

          {/* Panel desplegable (megamenú) */}
          {current && (
            <div
              className="absolute left-1/2 top-full hidden w-[min(100vw-32px,880px)] -translate-x-1/2 pt-2 lg:block"
              onMouseEnter={() => window.clearTimeout(closeTimer.current)}
            >
              <Panel key={current.key} menu={current} />
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
              aria-label={tr("Buscar en el sitio", "Search the site")}
              className={`${iconCls} ${menuOpen ? "text-azul" : ""}`}
            >
              <Bi n="search" />
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                setActive(active === "soporte" ? null : "soporte");
              }}
              aria-label={tr("Soporte", "Support")}
              aria-expanded={active === "soporte"}
              className={`${iconCls} ${menuOpen ? "text-azul" : ""}`}
            >
              <Bi n="headset" />
            </button>
          </div>

          {/* Botón de menú móvil */}
          <button
            className={`relative z-10 grid h-11 w-11 place-items-center text-2xl lg:hidden ${solid ? "text-azul" : "text-white"}`}
            aria-label={menuOpen ? tr("Cerrar menú", "Close menu") : tr("Abrir menú", "Open menu")}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <Bi n={menuOpen ? "x-lg" : "list"} />
          </button>
        </div>
      </header>

      <SiteSearch open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Menú móvil: acordeón por sección */}
      {menuOpen && (
        <nav
          className="animate-fade-up fixed inset-x-0 bottom-0 top-[66px] z-40 overflow-y-auto bg-white px-5 pb-10 pt-3 lg:hidden"
          aria-label={tr("Menú móvil", "Mobile menu")}
        >
          {MENUS.map((m) => {
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
            {tr("Cotiza tu mudanza", "Get a quote")}
          </Link>
        </nav>
      )}
    </>
  );
}
