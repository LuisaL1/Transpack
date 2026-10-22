// Contenido del buscador del sitio: qué se puede encontrar (servicios,
// soluciones, artículos, preguntas frecuentes y páginas), las búsquedas
// sugeridas y los textos del cuadro de búsqueda. El motor está en
// src/lib/search.ts.
import { DESTINATION_NAMES, postsFor, siteFor } from "@/data/content";
import { DESTINATIONS } from "@/data/worldMap";
import { localize, makeTr, type Lang, type Tr } from "@/i18n";
import { search, type SearchEntry } from "@/lib/search";

// Índice de búsqueda en el idioma pedido (las rutas ya salen localizadas)
export function searchIndex(lang: Lang): SearchEntry[] {
  const { FAQS, PRIVACY, SEGMENTS, SERVICES } = siteFor(lang);
  const posts = postsFor(lang);
  const tr = makeTr(lang);
  const lp = (path: string) => localize(path, lang);
  // Países y términos que deben llevar a la mudanza internacional (en ambos idiomas)
  const countries = `${DESTINATIONS.map((d) => `${d.name} ${Object.values(DESTINATION_NAMES[d.name] ?? {}).join(" ")}`).join(" ")} exterior extranjero otro pais emigrar abroad overseas relocate etranger expatriation ausland auswandern estero espatrio الخارج`;
  const page = (icon: string, title: string, desc: string, to: string, extra = "") => ({
    kind: tr("Página", "Page"),
    icon,
    title,
    desc,
    to: lp(to),
    extra,
  });
  return [
    ...SERVICES.map((s) => ({
      kind: tr("Servicio", "Service"),
      icon: s.icon,
      title: s.title,
      desc: s.short,
      to: lp(`/servicios/${s.slug}`),
      extra: `${s.kicker} ${s.intro} ${s.includes.join(" ")} ${s.quote === "internacional" ? countries : ""}`,
    })),
    ...SEGMENTS.map((s) => ({
      kind: tr("Solución", "Solution"),
      icon: s.icon,
      title: s.tab,
      desc: s.title,
      to: lp(`/?segmento=${s.id}#soluciones`),
      extra: `${s.kicker} ${s.text} ${s.points.join(" ")}`,
    })),
    ...posts.map((p) => ({
      kind: tr("Artículo", "Article"),
      icon: "journal-text",
      title: p.title,
      desc: p.excerpt,
      to: lp(`/blog/${p.slug}`),
      extra: p.cat,
    })),
    ...FAQS.map((f) => ({
      kind: tr("Pregunta", "Question"),
      icon: "question-circle",
      title: f.q,
      desc: f.a,
      to: lp("/#faq"),
    })),
    page(
      "ui-checks",
      tr("Cotiza tu mudanza", "Get a moving quote"),
      tr("Cotizador en 6 pasos, sin compromiso", "6-step quote form, no commitment"),
      "/#cotizar",
      "precio cotizacion presupuesto valor price quote cost estimate",
    ),
    page(
      "people",
      tr("Quiénes somos", "About us"),
      tr(
        "Historia, misión, visión y valores de Transpack desde 1968",
        "Transpack's history, mission, vision and values since 1968",
      ),
      "/nosotros",
      "empresa trayectoria company history",
    ),
    page(
      "award",
      tr("Certificaciones", "Certifications"),
      "LACMA · IAM · PAIMA",
      "/nosotros#certificaciones",
      "certificados calidad quality",
    ),
    page(
      "buildings",
      tr("Clientes y embajadas", "Clients and embassies"),
      tr(
        "Empresas y misiones diplomáticas que confían en Transpack",
        "Companies and diplomatic missions that trust Transpack",
      ),
      "/nosotros#clientes",
    ),
    page(
      "globe2",
      tr("Cobertura global", "Global coverage"),
      tr(
        "2.000+ agentes en 176 países, vía marítima o aérea",
        "2,000+ agents in 176 countries, by sea or air",
      ),
      "/#cobertura",
      "paises red agentes destinos countries network agents destinations",
    ),
    page(
      "layers",
      tr("Niveles de servicio", "Service levels"),
      tr("Básico, protección e integral", "Basic, protection and full service"),
      "/#niveles",
      "empaque proteccion integral packing",
    ),
    page(
      "play-btn",
      tr("Transpack en video", "Transpack on video"),
      tr("Shorts de nuestro canal de YouTube", "Shorts from our YouTube channel"),
      "/#videos",
      "youtube videos",
    ),
    page(
      "geo-alt",
      tr("Contacto", "Contact"),
      tr("Dirección, teléfonos, WhatsApp y correo", "Address, phone, WhatsApp and email"),
      "/#contacto",
      "telefono whatsapp correo direccion ubicacion mapa phone email address location map",
    ),
    page(
      "shield-lock",
      PRIVACY.title,
      tr(
        "Qué datos usamos, para qué y cómo ejercer tus derechos",
        "What data we use, why, and how to exercise your rights",
      ),
      "/privacidad",
      "privacidad datos personales habeas data ley 1581 cookies privacy personal data datenschutz donnees",
    ),
  ];
}

/** Busca en el contenido del sitio en el idioma indicado. */
export const searchSite = (lang: Lang, query: string) => search(searchIndex(lang), query);

// Búsquedas sugeridas cuando el cuadro está vacío
export const SEARCH_SUGGESTIONS: Record<Lang, string[]> = {
  es: ["Mudanza internacional", "Bodegaje", "Cuánto tarda", "Embajadas", "Obras de arte", "Canadá"],
  en: ["International moving", "Storage", "How long", "Embassies", "Artwork", "Canada"],
  fr: [
    "Déménagement international",
    "Garde-meubles",
    "Combien de temps",
    "Ambassades",
    "Œuvres d'art",
    "Canada",
  ],
  de: ["Internationaler Umzug", "Einlagerung", "Wie lange", "Botschaften", "Kunstwerke", "Kanada"],
  it: [
    "Trasloco internazionale",
    "Deposito mobili",
    "Quanto dura",
    "Ambasciate",
    "Opere d'arte",
    "Canada",
  ],
  ar: ["النقل الدولي", "التخزين", "كم يستغرق", "السفارات", "الأعمال الفنية", "كندا"],
};

export const searchText = (tr: Tr) => ({
  dialog: tr("Buscar en el sitio", "Search the site"),
  placeholder: tr(
    "Busca un servicio, un destino o una pregunta…",
    "Search for a service, a destination or a question…",
  ),
  input: tr("Buscar", "Search"),
  close: "Esc",
  popular: tr("Búsquedas frecuentes", "Popular searches"),
  noResults: tr("No encontramos resultados para", "No results for"),
  tryAgain: tr("Prueba con otra palabra o pregúntale a Joel.", "Try another word or ask Joel."),
  askJoel: tr("Hablar con Joel", "Talk to Joel"),
  navigate: tr("moverse", "navigate"),
  open: tr("abrir", "open"),
  closeHint: tr("cerrar", "close"),
});
