// Metadatos de cada página en cada idioma (título de la pestaña, descripción
// para buscadores y redes, y rótulos de las migas de pan del JSON-LD). Los usa
// src/seo/meta.ts. Las descripciones de servicios y artículos salen de su
// propio contenido (src/data/site.ts y blogData.ts).
// Títulos: palabra clave + ciudad, de 30 a 70 caracteres (ver docs/seo.md).
import type { Lang } from "@/i18n";

export type SeoText = {
  brand: string;
  homeTitle: string;
  homeDescription: string;
  aboutTitle: string;
  privacyTitle: string;
  privacyDescription: string;
  /** "en Bogotá, Colombia": se agrega al nombre del servicio en su título */
  inCity: string;
  inCityShort: string;
  notFoundTitle: string;
  notFoundDescription: string;
  breadcrumb: { home: string; services: string; about: string; privacy: string };
  servicesList: string;
};

export const SEO_TEXT: Record<Lang, SeoText> = {
  es: {
    brand: "Transpack",
    homeTitle: "Mudanzas nacionales e internacionales en Bogotá | Transpack",
    homeDescription:
      "Transpack S.A.S.: mudanzas locales, nacionales e internacionales, bodegaje y movilidad corporativa desde Bogotá. Más de 58 años de experiencia y cobertura en 176 países.",
    aboutTitle: "Quiénes somos: mudanzas desde 1968 en Bogotá | Transpack",
    privacyTitle: "Política de tratamiento de datos personales | Transpack",
    privacyDescription:
      "Cómo Transpack S.A.S. trata tus datos personales según la Ley 1581 de 2012: qué datos recogemos, para qué los usamos y cómo ejercer tus derechos.",
    inCity: "en Bogotá, Colombia",
    inCityShort: "en Bogotá",
    notFoundTitle: "Página no encontrada | Transpack",
    notFoundDescription:
      "La página que buscas no existe o cambió de dirección. Vuelve al inicio para conocer nuestros servicios de mudanza y bodegaje.",
    breadcrumb: {
      home: "Inicio",
      services: "Servicios",
      about: "Nosotros",
      privacy: "Política de datos",
    },
    servicesList: "Servicios de mudanza y bodegaje",
  },
  en: {
    brand: "Transpack",
    homeTitle: "National and International Movers in Bogotá | Transpack",
    homeDescription:
      "Transpack S.A.S.: local, national and international moving, storage and corporate mobility from Bogotá, Colombia. 58 years of experience and coverage in 176 countries.",
    aboutTitle: "About us: movers in Bogotá since 1968 | Transpack",
    privacyTitle: "Personal Data Processing Policy | Transpack",
    privacyDescription:
      "How Transpack S.A.S. processes your personal data under Colombian Law 1581 of 2012: what we collect, why we use it and how to exercise your rights.",
    inCity: "in Bogotá, Colombia",
    inCityShort: "in Bogotá",
    notFoundTitle: "Page not found | Transpack",
    notFoundDescription:
      "The page you are looking for does not exist or has moved. Go back home to see our moving and storage services.",
    breadcrumb: { home: "Home", services: "Services", about: "About", privacy: "Privacy policy" },
    servicesList: "Moving and storage services",
  },
  fr: {
    brand: "Transpack",
    homeTitle: "Déménagement national et international à Bogota | Transpack",
    homeDescription:
      "Transpack S.A.S. : déménagements locaux, nationaux et internationaux, garde-meubles et mobilité d'entreprise depuis Bogota, Colombie. 58 ans d'expérience et une couverture dans 176 pays.",
    aboutTitle: "Qui sommes-nous : déménageurs à Bogota depuis 1968 | Transpack",
    privacyTitle: "Politique de traitement des données personnelles | Transpack",
    privacyDescription:
      "Comment Transpack S.A.S. traite vos données personnelles selon la loi colombienne 1581 de 2012 : données collectées, finalités et exercice de vos droits.",
    inCity: "à Bogota, Colombie",
    inCityShort: "à Bogota",
    notFoundTitle: "Page introuvable | Transpack",
    notFoundDescription:
      "La page que vous cherchez n'existe pas ou a changé d'adresse. Revenez à l'accueil pour découvrir nos services de déménagement.",
    breadcrumb: {
      home: "Accueil",
      services: "Services",
      about: "À propos",
      privacy: "Politique de données",
    },
    servicesList: "Services de déménagement et de garde-meubles",
  },
  de: {
    brand: "Transpack",
    homeTitle: "Nationale und internationale Umzüge ab Bogotá | Transpack",
    homeDescription:
      "Transpack S.A.S.: Umzüge vor Ort, innerhalb Kolumbiens und international, Einlagerung und Firmenmobilität ab Bogotá. 58 Jahre Erfahrung und ein Netzwerk in 176 Ländern.",
    aboutTitle: "Über uns: Umzugsunternehmen in Bogotá seit 1968 | Transpack",
    privacyTitle: "Richtlinie zur Verarbeitung personenbezogener Daten | Transpack",
    privacyDescription:
      "Wie Transpack S.A.S. Ihre personenbezogenen Daten nach dem kolumbianischen Gesetz 1581 von 2012 verarbeitet: Daten, Zwecke und Ihre Rechte.",
    inCity: "in Bogotá, Kolumbien",
    inCityShort: "in Bogotá",
    notFoundTitle: "Seite nicht gefunden | Transpack",
    notFoundDescription:
      "Die gesuchte Seite existiert nicht oder wurde verschoben. Zurück zur Startseite und unseren Umzugs- und Einlagerungsleistungen.",
    breadcrumb: {
      home: "Startseite",
      services: "Leistungen",
      about: "Über uns",
      privacy: "Datenschutz",
    },
    servicesList: "Umzugs- und Einlagerungsleistungen",
  },
  it: {
    brand: "Transpack",
    homeTitle: "Traslochi nazionali e internazionali a Bogotá | Transpack",
    homeDescription:
      "Transpack S.A.S.: traslochi locali, nazionali e internazionali, deposito mobili e mobilità aziendale da Bogotá, Colombia. 58 anni di esperienza e copertura in 176 paesi.",
    aboutTitle: "Chi siamo: traslochi a Bogotá dal 1968 | Transpack",
    privacyTitle: "Informativa sul trattamento dei dati personali | Transpack",
    privacyDescription:
      "Come Transpack S.A.S. tratta i tuoi dati personali secondo la legge colombiana 1581 del 2012: quali dati raccogliamo, perché e come esercitare i tuoi diritti.",
    inCity: "a Bogotá, Colombia",
    inCityShort: "a Bogotá",
    notFoundTitle: "Pagina non trovata | Transpack",
    notFoundDescription:
      "La pagina che cerchi non esiste o ha cambiato indirizzo. Torna alla home per scoprire i nostri servizi di trasloco e deposito.",
    breadcrumb: { home: "Home", services: "Servizi", about: "Chi siamo", privacy: "Privacy" },
    servicesList: "Servizi di trasloco e deposito",
  },
  ar: {
    brand: "ترانسباك",
    homeTitle: "شركة نقل أثاث محلي ودولي في بوغوتا | ترانسباك",
    homeDescription:
      "ترانسباك: نقل داخل المدينة وبين المدن ونقل دولي، وتخزين، وخدمات تنقّل للشركات انطلاقًا من بوغوتا، كولومبيا. خبرة 58 عامًا وتغطية في 176 دولة.",
    aboutTitle: "من نحن: شركة نقل في بوغوتا منذ 1968 | ترانسباك",
    privacyTitle: "سياسة معالجة البيانات الشخصية | ترانسباك",
    privacyDescription:
      "كيف تعالج شركة ترانسباك بياناتك الشخصية وفقًا للقانون الكولومبي رقم 1581 لسنة 2012: البيانات التي نجمعها والغرض منها وكيفية ممارسة حقوقك.",
    inCity: "في بوغوتا، كولومبيا",
    inCityShort: "في بوغوتا",
    notFoundTitle: "الصفحة غير موجودة | ترانسباك",
    notFoundDescription:
      "الصفحة التي تبحث عنها غير موجودة أو تغيّر عنوانها. عُد إلى الصفحة الرئيسية للتعرّف على خدمات النقل والتخزين لدينا.",
    breadcrumb: {
      home: "الرئيسية",
      services: "الخدمات",
      about: "من نحن",
      privacy: "سياسة البيانات",
    },
    servicesList: "خدمات النقل والتخزين",
  },
};
