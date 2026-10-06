// Textos de las secciones del inicio (src/components/home). Cada función recibe
// `tr` (ver src/i18n): el español va primero y el inglés después; el francés,
// alemán, italiano y árabe se buscan por el texto en inglés en src/i18n/dict.
// Las cifras, servicios, segmentos, niveles, proceso y preguntas frecuentes
// están en src/data/site.ts (y sus traducciones site.<idioma>.ts).
import type { Tr } from "@/i18n";

export const heroText = (tr: Tr) => ({
  since: tr("Desde 1968", "Since 1968"),
  certifications: tr("Certificados LACMA, IAM y PAIMA", "LACMA, IAM and PAIMA certified"),
  certificationsShort: "LACMA · IAM · PAIMA",
  title: tr("Movemos lo que más importa,", "We move what matters most,"),
  titlePrefix: tr("a ", ""),
  titleHighlight: tr("cualquier lugar del mundo", "anywhere in the world"),
  sub: tr(
    "Mudanzas locales, nacionales e internacionales, bodegaje y movilidad corporativa con el respaldo de 58 años de experiencia.",
    "Local, national and international moving, storage and corporate mobility, backed by 58 years of experience.",
  ),
  cta: tr("Cotiza tu mudanza", "Get a moving quote"),
  legend: {
    origin: tr("Bogotá, punto de origen", "Bogotá, point of origin"),
    operate: tr("Países donde operamos", "Countries where we operate"),
    network: tr("Red de agentes en 176 países", "Agent network in 176 countries"),
  },
  clientsLabel: tr("Empresas que confían en Transpack", "Companies that trust Transpack"),
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
  title: tr("Una solución integral para cada traslado", "A complete solution for every move"),
  sub: tr(
    "La mudanza es el centro de lo que hacemos. Alrededor de ella combinamos embalaje, bodegaje, documentación y coordinación especializada para que no tengas que preocuparte por nada.",
    "Moving is at the heart of what we do. Around it we combine packing, storage, documentation and specialized coordination so you don't have to worry about a thing.",
  ),
  more: tr("Ver servicio", "View service"),
});

export const segmentsText = (tr: Tr) => ({
  eyebrow: tr("Soluciones", "Solutions"),
  title: tr(
    "Diseñamos el servicio según quién se mueve",
    "We design the service around who is moving",
  ),
  sub: tr(
    "Personas, empresas e instituciones tienen necesidades distintas. Por eso trabajamos con tres unidades especializadas y un acompañamiento dedicado para quienes empiezan una vida en otro país.",
    "People, companies and institutions have different needs. That is why we work with three specialized units and dedicated support for those starting a life in another country.",
  ),
  tabsLabel: tr("Soluciones por segmento", "Solutions by segment"),
});

export const levelsText = (tr: Tr) => ({
  eyebrow: tr("Niveles de servicio", "Service levels"),
  title: tr("Tú decides cuánto delegar", "You decide how much to hand over"),
  sub: tr(
    "No cotizamos solo “una mudanza”: cotizamos la mudanza con el nivel de servicio que necesitas.",
    "We don't just quote “a move”: we quote your move with the service level you need.",
  ),
  popular: tr("Más solicitado", "Most popular"),
  choose: tr("Elegir", "Choose"),
});

export const coverageText = (tr: Tr) => ({
  eyebrow: tr("Cobertura global", "Global coverage"),
  title: tr(
    "De Colombia al mundo, con una red que no se improvisa",
    "From Colombia to the world, with a network you can't improvise",
  ),
  text: tr(
    "Casi seis décadas construyendo una red operativa con más de 2.000 agentes internacionales en 176 países: Estados Unidos, Canadá, la Unión Europea, Asia y toda Latinoamérica. Tu mudanza se opera con los mismos estándares en origen y en destino.",
    "Almost six decades building an operating network of more than 2,000 international agents in 176 countries: the United States, Canada, the European Union, Asia and all of Latin America. Your move runs to the same standards at origin and destination.",
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
  shipAlt: tr("Buque de carga en altamar", "Cargo ship at sea"),
  agents: "2.000+",
  agentsLabel: tr("agentes en 176 países", "agents in 176 countries"),
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
    "Muebles protegidos listos para el traslado",
    "Protected furniture ready to move",
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
  eyebrow: tr("Cotiza tu mudanza", "Get a moving quote"),
  title: tr(
    "Cuéntanos tu traslado en menos de 2 minutos",
    "Tell us about your move in under 2 minutes",
  ),
  sub: tr(
    "Con esta información un asesor te contactará con una propuesta a tu medida. Sin compromiso.",
    "With this information an advisor will contact you with a tailored proposal. No commitment.",
  ),
});

export const blogSectionText = (tr: Tr) => ({
  eyebrow: "Blog",
  title: tr("Guías para mudarte con tranquilidad", "Guides for a stress-free move"),
  sub: tr(
    "Lo que debes saber antes de tu próximo traslado, explicado por quienes lo hacen todos los días.",
    "What you should know before your next move, explained by the people who do it every day.",
  ),
  read: tr("Leer artículo", "Read article"),
});

export const faqText = (tr: Tr) => ({
  eyebrow: tr("Preguntas frecuentes", "Frequently asked questions"),
  title: tr("Resolvemos tus dudas", "Your questions, answered"),
  sub: tr(
    "¿No encuentras tu pregunta? Escríbenos por WhatsApp y te respondemos.",
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
});
