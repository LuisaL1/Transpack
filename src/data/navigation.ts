// Contenido de la navegación: megamenús de la cabecera, panel de soporte y
// textos de la cabecera. Cada menú tiene una tarjeta destacada (izquierda) y
// una lista de enlaces: "to" = ruta interna, "href" = enlace externo,
// "chat" = abre a Joel.
import { siteFor } from "@/data/content";
import { LANG_INFO, localize, makeTr, type Lang, type Tr } from "@/i18n";

export type MenuItem = {
  label: string;
  desc?: string;
  icon: string;
  to?: string;
  href?: string;
  chat?: boolean;
};
export type Menu = {
  key: string;
  label: string;
  feature: { kicker: string; title: string; text: string; cta: string; to: string };
  items: MenuItem[];
  cols?: 1 | 2;
  posts?: boolean;
  chips?: boolean;
};

export function menusFor(lang: Lang): Menu[] {
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
          label: tr("Vivir en el exterior", "Living abroad"),
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

// Canales del panel de soporte (ícono de audífonos)
export function supportFor(lang: Lang): MenuItem[] {
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

export const headerText = (tr: Tr) => ({
  mainNav: tr("Principal", "Main"),
  search: tr("Buscar en el sitio (Ctrl + K)", "Search the site (Ctrl + K)"),
  searchTitle: tr("Buscar (Ctrl + K)", "Search (Ctrl + K)"),
  searchMobile: tr("Buscar en el sitio", "Search the site"),
  support: tr("Soporte", "Support"),
  quote: tr("Cotiza tu mudanza", "Get a quote"),
  openMenu: tr("Abrir menú", "Open menu"),
  closeMenu: tr("Cerrar menú", "Close menu"),
  mobileNav: tr("Menú móvil", "Mobile menu"),
  embassiesServed: tr("Embajadas atendidas en", "Embassies served in"),
  supportTitle: tr("Soporte Transpack", "Transpack support"),
  supportSub: tr(
    "¿Necesitas ayuda con tu mudanza o tu solicitud?",
    "Need help with your move or your request?",
  ),
  supportFaq: tr("Ver preguntas frecuentes", "See frequently asked questions"),
  logoLabel: tr("Transpack, inicio", "Transpack, home"),
  logoText: "TRANSPACK",
});

export const footerText = (tr: Tr) => ({
  services: tr("Servicios", "Services"),
  solutions: tr("Soluciones", "Solutions"),
  about: tr("Quiénes somos", "About us"),
  contact: tr("Contacto", "Contact"),
  legal: "Transpack S.A.S. · Bogotá, Colombia",
});

// Franja superior de idiomas: una opción por idioma, nombrada por la región
// que lo usa y escrita en ese mismo idioma.
export const REGIONS: Record<Lang, string> = {
  es: "Latinoamérica y España",
  en: "International",
  fr: "France et Canada",
  de: "Deutschland",
  it: "Italia",
  ar: "الشرق الأوسط",
};
export const regionLabel = (l: Lang) => `${REGIONS[l]} (${LANG_INFO[l].name})`;

export const langBarText = (tr: Tr) => ({
  choose: tr("Elegir región e idioma", "Choose region and language"),
  list: tr("Región e idioma", "Region and language"),
});
