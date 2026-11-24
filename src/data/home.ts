// Textos de las secciones del inicio (src/components/home). Cada función recibe
// `tr` (ver src/i18n): el español va primero y el inglés después.
// Las cifras, servicios, niveles, proceso y preguntas frecuentes
// están en src/data/site.ts (y su traducción site.en.ts).
import type { Tr } from "@/i18n";

export const heroText = (tr: Tr) => ({
  since: tr("Desde 1968", "Since 1968"),
  certifications: tr("Certificados LACMA, IAM y PAIMA", "LACMA, IAM and PAIMA certified"),
  certificationsShort: "LACMA · IAM · PAIMA",
  title: tr("Prometemos con el corazón,", "We promise from the heart,"),
  titlePrefix: tr("cumplimos ", "deliver "),
  titleHighlight: tr("con excelencia.", "with excellence."),
  sub: tr(
    // Texto pedido por el cliente (oct. 2026)
    "Hemos exportado en los últimos 56 años 60.000 toneladas de menaje doméstico, efectos personales, enseres y obras de arte con destino a 176 países.",
    "Over the last 56 years we have exported 60,000 tons of household goods, personal effects, furnishings and works of art to 176 countries.",
  ),
  // Cifras que se resaltan dentro de "sub" (deben aparecer tal cual en el texto)
  subHighlights: [tr("60.000 toneladas", "60,000 tons"), tr("176 países", "176 countries")],
  cta: tr("Cotiza tu mudanza", "Get a moving quote"),
  ctaServices: tr("Ver servicios", "See services"),
  clientsLabel: tr("Empresas que confían en Transpack", "Companies that trust Transpack"),
  embassiesLabel: tr("Embajadas que confían en Transpack", "Embassies that trust Transpack"),
  embassyOf: tr("Embajada de", "Embassy of"),
  // "the United States", "the United Arab Emirates"
  embassyName: (country: string) =>
    tr(country, /^United/.test(country) ? `the ${country}` : country),
  clientsTitle: tr(
    "Empresas, embajadas y organismos que han confiado su movilidad a Transpack",
    "Companies, embassies and institutions that have trusted Transpack with their mobility",
  ),
});

export const statsText = (tr: Tr) => ({
  label: tr("Transpack en cifras", "Transpack in numbers"),
});

export const servicesText = (tr: Tr) => ({
  eyebrow: tr("Servicios", "Services"),
  // Va debajo de las tarjetas, como cierre de la sección
  title: tr("Una solución integral para cada traslado", "A complete solution for every move"),
  more: tr("Ver servicio", "View service"),
});

export const levelsText = (tr: Tr) => ({
  eyebrow: tr("Niveles de servicio", "Service levels"),
  title: tr(
    "Elija la línea de servicio de acuerdo con sus necesidades",
    "Choose the service line that fits your needs",
  ),
  sub: tr(
    "No cotizamos solo un trasteo, le ofrecemos una mudanza con el nivel de servicio que necesita.",
    "We don't just quote a move: we offer you a move with the service level you need.",
  ),
  popular: tr("Más solicitado", "Most popular"),
  choose: tr("Elegir", "Choose"),
});

export const coverageText = (tr: Tr) => ({
  eyebrow: tr("Cobertura global", "Global coverage"),
  title: tr(
    "De Colombia al mundo, una logística que no se improvisa",
    "From Colombia to the world, logistics that can't be improvised",
  ),
  text: tr(
    "Con más de 5 décadas estableciendo alianzas logísticas con más de 2.000 agentes profesionales y certificados alrededor del mundo.",
    "More than 5 decades building logistics alliances with more than 2,000 professional, certified agents around the world.",
  ),
  modes: [
    {
      icon: "water",
      title: tr("Marítima", "Sea freight"),
      text: tr(
        "Ideal para grandes volúmenes y menaje completo.",
        "Ideal for large volumes and full households.",
      ),
    },
    {
      icon: "airplane",
      title: tr("Aérea", "Air freight"),
      text: tr(
        "Más rápida, para cargas pequeñas o urgentes.",
        "Faster, for small or urgent shipments.",
      ),
    },
  ],
  sealAlt: tr("Sello LACMA Certified Packers", "LACMA Certified Packers seal"),
  certificationsTitle: tr("Certificaciones internacionales", "International certifications"),
  certifications: "LACMA · IAM · PAIMA",
  imageAlt: tr("Avión y buque portacontenedores en puerto", "Airplane and container ship in port"),
  shipAlt: tr("Cargue de un contenedor de mudanza", "Loading a moving container"),
  agents: tr("2.000+", "2,000+"),
  agentsLabel: tr(
    "agentes y aliados estratégicos en 176 países",
    "agents and strategic partners in 176 countries",
  ),
});

export const processText = (tr: Tr) => ({
  eyebrow: tr("Cómo trabajamos", "How we work"),
  title: tr(
    "Un proceso estructurado, sin improvisación",
    "A structured process, with no improvisation",
  ),
  sub: tr(
    "Cada mudanza sigue una metodología probada durante décadas. Así reducimos imprevistos y sabes en todo momento qué sigue.",
    "Every move follows a methodology proven over decades. That way we reduce surprises and you always know what comes next.",
  ),
});

export const aboutTeaserText = (tr: Tr) => ({
  crewAlt: tr(
    "Colaboradores de Transpack cargando cajas en un camión",
    "Transpack crew loading boxes onto a truck",
  ),
  furnitureAlt: tr(
    "Dos colaboradores de Transpack cargando una caja de mudanza",
    "Two Transpack crew members carrying a moving box",
  ),
  since: tr("Desde", "Since"),
  year: "1968",
  eyebrow: tr("Quiénes somos", "About us"),
  title: tr(
    "Más de cinco décadas cuidando lo que más quieres",
    "More than five decades caring for what you love most",
  ),
  text: tr(
    "Somos una organización consolidada desde 1968, especializada en trasteos locales, mudanzas nacionales e internacionales y bodegaje, con alta calidad en embalaje y traslados a cualquier parte de Colombia y el mundo. Hemos exportado más de 60 mil toneladas de menaje doméstico y efectos personales a 176 países.",
    "We are an established company founded in 1968, specialized in local, national and international moving and storage, with high-quality packing and moves to anywhere in Colombia and the world. We have exported more than 60,000 tons of household goods and personal effects to 176 countries.",
  ),
  values: [
    { icon: "people", label: tr("Confianza", "Trust") },
    { icon: "shield-check", label: tr("Seguridad", "Security") },
    { icon: "award", label: tr("Experiencia", "Experience") },
    { icon: "patch-check", label: tr("Excelencia", "Excellence") },
  ],
  cta: tr("Conoce nuestra historia", "Discover our story"),
});

export const galleryText = (tr: Tr) => ({
  label: tr("Nuestro trabajo", "Our work"),
});

export const quoteSectionText = (tr: Tr) => ({
  eyebrow: tr("Cotiza su mudanza", "Get a moving quote"),
  title: tr("Contáctenos para cotizar su mudanza", "Contact us for a quote on your move"),
  sub: tr(
    "Con esta información un asesor se comunicará con una propuesta ajustada a su requerimiento.",
    "With this information an advisor will get in touch with a proposal tailored to your needs.",
  ),
});

export const blogSectionText = (tr: Tr) => ({
  eyebrow: "Blog",
  title: tr("Guías para mudarte con tranquilidad", "Guides for a stress-free move"),
  sub: tr(
    "Lo que debes saber antes de su próximo traslado, explicado por quienes lo hacen todos los días.",
    "What you should know before your next move, explained by the people who do it every day.",
  ),
  read: tr("Leer artículo", "Read article"),
});

export const faqText = (tr: Tr) => ({
  eyebrow: tr("Preguntas frecuentes", "Frequently asked questions"),
  title: tr("Resolvemos sus dudas", "Your questions, answered"),
  sub: tr(
    "¿No encuentras su pregunta? Escríbenos por WhatsApp y te respondemos.",
    "Can't find your question? Message us on WhatsApp and we'll answer.",
  ),
});

export const contactText = (tr: Tr) => ({
  eyebrow: tr("Contacto", "Contact"),
  title: tr("Visítanos o escríbenos", "Visit us or get in touch"),
  address: tr("Dirección", "Address"),
  phones: tr("Teléfonos y WhatsApp", "Phone and WhatsApp"),
  email: tr("Correo", "Email"),
  mapTitle: tr("Ubicación de Transpack en Bogotá", "Transpack location in Bogotá"),
  mapSrc: "https://www.google.com/maps?q=Carrera+40+%2320A-96,+Bogot%C3%A1,+Colombia&output=embed",
});

export const videosText = (tr: Tr) => ({
  eyebrow: tr("Transpack en video", "Transpack on video"),
  title: tr("Así se ve una mudanza bien hecha", "This is what a move done right looks like"),
  text: tr(
    "Procesos reales, contados por nuestro equipo: cómo planeamos, protegemos y movemos lo que más importa, dentro y fuera de Colombia.",
    "Real processes, told by our team: how we plan, protect and move what matters most, in Colombia and abroad.",
  ),
  more: tr("Ver más en YouTube", "More on YouTube"),
  play: tr("Reproducir video", "Play video"),
  short: "Short",
});

export const mapText = (tr: Tr) => ({
  label: tr(
    "Mapa de destinos de Transpack desde Bogotá",
    "Map of Transpack destinations from Bogotá",
  ),
  origin: tr("Bogotá · origen", "Bogotá · origin"),
  // Tarjeta al tocar un país (CountryCard)
  close: tr("Cerrar", "Close"),
  capital: tr("Capital", "Capital"),
  countryName: "Colombia",
  locality: tr("Localidad de Bogotá", "Bogotá locality"),
  cityCredit: tr("Mapa: IDECA · CC BY 4.0", "Map: IDECA · CC BY 4.0"),
  exclusive: tr("Zona exclusiva", "Exclusive area"),
  cityPhoto: (city: string, country: string) =>
    tr(`Vista de ${city}, ${country}`, `View of ${city}, ${country}`),
  credit: tr("Foto", "Photo"),
});
