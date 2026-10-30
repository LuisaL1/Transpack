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
  videosTitle: string;
  videosDescription: string;
  privacyDescription: string;
  /** "en Bogotá, Colombia": se agrega al nombre del servicio en su título */
  inCity: string;
  inCityShort: string;
  notFoundTitle: string;
  notFoundDescription: string;
  breadcrumb: { home: string; services: string; about: string; privacy: string; videos: string };
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
    videosTitle: "Experiencias Transpack: videos de mudanzas | Transpack",
    videosDescription:
      "Mira cómo embalamos y movemos muebles, arte e instrumentos: todos los videos del canal de YouTube de Transpack, empresa de mudanzas en Bogotá desde 1968.",
    privacyDescription:
      "Cómo Transpack S.A.S. trata sus datos personales según la Ley 1581 de 2012: qué datos recogemos, para qué los usamos y cómo ejercer sus derechos.",
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
      videos: "Experiencias Transpack",
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
    videosTitle: "Transpack Experiences: moving videos | Transpack",
    videosDescription:
      "See how we pack and move furniture, art and musical instruments: every video from the YouTube channel of Transpack, movers in Bogotá since 1968.",
    privacyDescription:
      "How Transpack S.A.S. processes your personal data under Colombian Law 1581 of 2012: what we collect, why we use it and how to exercise your rights.",
    inCity: "in Bogotá, Colombia",
    inCityShort: "in Bogotá",
    notFoundTitle: "Page not found | Transpack",
    notFoundDescription:
      "The page you are looking for does not exist or has moved. Go back home to see our moving and storage services.",
    breadcrumb: {
      home: "Home",
      services: "Services",
      about: "About",
      privacy: "Privacy policy",
      videos: "Transpack Experiences",
    },
    servicesList: "Moving and storage services",
  },
};
