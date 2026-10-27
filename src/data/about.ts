// Contenido de la página Nosotros (/nosotros): valores, línea de tiempo y
// textos de cada sección. Las cifras están en STATS de src/data/site.ts.
import type { Tr } from "@/i18n";

export const aboutValues = (tr: Tr) => [
  {
    icon: "people",
    title: tr("Confianza", "Trust"),
    text: tr(
      "Empresas, embajadas y familias nos confían su patrimonio desde hace casi seis décadas.",
      "Companies, embassies and families have trusted us with their belongings for almost six decades.",
    ),
  },
  {
    icon: "shield-check",
    title: tr("Seguridad", "Security"),
    text: tr(
      "Embalaje técnico, inventarios precisos y trazabilidad en cada etapa del traslado.",
      "Technical packing, accurate inventories and traceability at every stage of the move.",
    ),
  },
  {
    icon: "award",
    title: tr("Experiencia", "Experience"),
    text: tr(
      "Más de 60 mil toneladas de menaje exportadas a 176 países.",
      "More than 60,000 tons of household goods exported to 176 countries.",
    ),
  },
  {
    icon: "patch-check",
    title: tr("Excelencia", "Excellence"),
    text: tr(
      "Estándares certificados por LACMA, IAM y PAIMA en origen y destino.",
      "Standards certified by LACMA, IAM and PAIMA at origin and destination.",
    ),
  },
];

export const aboutTimeline = (tr: Tr) => [
  {
    year: "1968",
    text: tr(
      "Nace Transpack en Bogotá, especializada en trasteos y mudanzas.",
      "Transpack is founded in Bogotá, specializing in moving services.",
    ),
  },
  {
    year: tr("Décadas de red", "Decades of network"),
    text: tr(
      "Construimos una red de más de 2.000 representantes en 176 países.",
      "We built a network of more than 2,000 representatives in 176 countries.",
    ),
  },
  {
    year: tr("Hoy", "Today"),
    text: tr(
      "Operamos mudanzas locales, nacionales, internacionales, bodegaje y movilidad corporativa.",
      "We run local, national and international moves, storage and corporate mobility.",
    ),
  },
  {
    year: "2028",
    text: tr(
      "Visión: ser una de las compañías líderes en trasteos, mudanzas y bodegaje en Bogotá.",
      "Vision: to be one of the leading moving and storage companies in Bogotá.",
    ),
  },
];

export const aboutText = (tr: Tr) => ({
  certificationsList: "LACMA · IAM · PAIMA",
  quienesSomos: tr("Quiénes somos", "About us"),
  masCincoDecadasMoviendo: tr("Más de cinco décadas moviendo", "More than five decades moving"),
  masQuieres: tr("lo que más quieres", "what you love most"),
  somosOrganizacionConsolidadaDesde: tr(
    "Somos una organización consolidada desde 1968, especializada en trasteos locales, mudanzas nacionales e internacionales y bodegaje, con alta calidad en embalaje y traslados a cualquier parte de Colombia y el mundo.",
    "We are an established company founded in 1968, specialized in local, national and international moving and storage, with high-quality packing and moves to anywhere in Colombia and the world.",
  ),
  nuestraHistoria: tr("Nuestra historia", "Our story"),
  redOperativaGlobalNo: tr(
    "Una red operativa global que no se improvisa",
    "A global operating network you can't improvise",
  ),
  nuestraHistoriaEmpezoHace: tr(
    "Nuestra historia empezó hace 58 años, en un momento en el que el comercio internacional era más lento, más manual y con muchas más incertidumbres logísticas. Con el paso de las décadas construimos algo que no se improvisa: una red operativa global.",
    "Our story began 58 years ago, when international trade was slower, more manual and far more uncertain. Over the decades we built something you can't improvise: a global operating network.",
  ),
  hoyEsaRedNos: tr(
    "Hoy, esa red nos permite operar mudanzas marítimas y aéreas hacia Estados Unidos, Canadá, la Unión Europea, Asia y toda Latinoamérica, con los mismos estándares en origen y en destino.",
    "Today that network lets us run sea and air moves to the United States, Canada, the European Union, Asia and all of Latin America, with the same standards at origin and destination.",
  ),
  mision: tr("Misión", "Mission"),
  queremosMantenerCompromisoNuestros: tr(
    "Queremos mantener el compromiso con nuestros clientes ofreciéndoles siempre lo mejor de nosotros en la prestación de servicios de trasteos, mudanzas y transporte a nivel local, nacional e internacional; soportado con una experiencia de más de cinco décadas, donde la atención personalizada, dedicación, cumplimiento y protección al medio ambiente son el fundamento pleno de nuestra gestión.",
    "To keep our commitment to our clients by always giving our best in local, national and international moving and transport services, backed by more than five decades of experience, with personalized attention, dedication, reliability and environmental protection as the foundation of everything we do.",
  ),
  vision: tr("Visión", "Vision"),
  ano2028TranspackSas: tr(
    "Para el año 2028 TRANSPACK SAS se perfila como una de las compañías líderes en trasteos locales y mudanzas nacionales e internacionales, así como servicios de bodegaje en Bogotá, reconocida por nuestra excelencia, calidad, experiencia y profesionalismo; permaneciendo siempre a la vanguardia, ofreciendo soluciones a las necesidades de logística de transporte y traslado en Colombia y en el mundo.",
    "By 2028, TRANSPACK SAS aims to be one of the leading local, national and international moving and storage companies in Bogotá, recognized for its excellence, quality, experience and professionalism, always at the forefront and offering solutions to transport and relocation logistics needs in Colombia and around the world.",
  ),
  valores: tr("Valores", "Values"),
  nosMueve: tr("Lo que nos mueve", "What drives us"),
  estandarCorporativo: tr("Estándar corporativo", "Corporate standard"),
  confianzaMarcasMasExigentes: tr(
    "La confianza de las marcas más exigentes",
    "Trusted by the most demanding brands",
  ),
  estandarDiplomatico: tr("Estándar diplomático", "Diplomatic standard"),
  embajadasHanConfiadoNosotros: tr(
    "Embajadas que han confiado en nosotros",
    "Embassies that have trusted us",
  ),
  ademasEntidadesComoCaf: tr(
    "Además de entidades como la CAF y funcionarios de las Fuerzas Militares de Colombia y Estados Unidos: operaciones que exigen discreción, protocolo y absoluta confidencialidad.",
    "As well as institutions such as CAF and personnel of the Colombian and United States Armed Forces: operations that demand discretion, protocol and complete confidentiality.",
  ),
  equipoTranspackEmpacandoSala: tr(
    "Equipo de Transpack empacando en una sala",
    "Transpack crew packing in a living room",
  ),
  guacalesMaderaExportacion: tr("Guacales de madera para exportación", "Wooden export crates"),
  certificaciones: tr("Certificaciones", "Certifications"),
  procesosRealesCuidadoExperto: tr(
    "Procesos reales, cuidado experto",
    "Real processes, expert care",
  ),
  nuestroTrabajoBasaPrecision: tr(
    "Nuestro trabajo se basa en la precisión, el cuidado y la metodología: inventarios detallados, embalaje técnico y una operación estructurada de principio a fin. Las certificaciones internacionales respaldan que su mudanza se opera con el mismo estándar en cualquier parte del mundo.",
    "Our work is built on precision, care and method: detailed inventories, technical packing and a structured operation from start to finish. International certifications ensure your move runs to the same standard anywhere in the world.",
  ),
  selloLacmaCertifiedPackers: tr("Sello LACMA Certified Packers", "LACMA Certified Packers seal"),
  asociacionesInternacionalesEmpresasMudanzas: tr(
    "Asociaciones internacionales de empresas de mudanzas",
    "International associations of moving companies",
  ),
  cotizaMudanza: tr("Cotiza su mudanza", "Get a moving quote"),
});

// ─── Nuestro CEO ─────────────────────────────────────────────────────────────
// PENDIENTE del cliente: nombre, cargo, texto, enlace a su página y la foto
// (public/brand/ceo.jpg). Mientras `name` esté vacío, la sección de Nosotros y
// la opción del menú no se muestran.
export const ceoInfo = (tr: Tr) => ({
  name: "Joël Doglioni",
  role: tr("CEO de Transpack", "CEO of Transpack"),
  // Rótulo del formato que entregó el cliente ("Empresario comprometido")
  tagline: tr("Empresario comprometido", "Committed entrepreneur"),
  // Texto del formato "Empresario comprometido" que entregó el cliente (oct. 2026)
  bio: tr(
    `Egresado de la Universidad Paul Valéry de Montpellier, en Francia, con un Máster II en Gestión de la información y la documentación, Joël Doglioni, ciudadano francés, es un apasionado administrador de empresas y un enamorado de Colombia.

Llegó al país andino con una robusta experiencia previa como ejecutivo de empresas francesas del sector de obras públicas. Domina el español, el inglés y el italiano, además del francés, su lengua materna.

Arraigado en Colombia y a la vez conocedor del mundo globalizado, se ha convertido en experto en logística de transporte internacional y nacional, manejando Transpack S.A.S.

Paralelamente, Joël Doglioni ha desarrollado una destacada actividad social en el seno de la comunidad francesa de Colombia. Fue miembro de la Junta directiva de la Alianza Francesa y del Liceo Francés de Bogotá, Consejero electo de la comunidad francesa durante 18 años, y es ahora Presidente de honor de la Unión en Colombia de los Franceses en el Extranjero (UFE). Chevalier de la Légion d'honneur, Joël Doglioni ha sido condecorado en repetidas ocasiones por Francia.

Joël lleva también años comprometido con el desarrollo sostenible y la reducción del impacto ecológico de sus actividades, centrándose en estrategias de reducción del consumo de papel y del uso de materiales plásticos y cartones en su empresa.

Premiado en 2001 con el "Premio Ecología Juan Peralta" de la Asociación Panamericana de Mudanzas Internacionales (PAIMA) por el proyecto de preservación de más de 55.000 árboles que lleva cuidadosamente a cabo en el área urbana de Bogotá, Joël Doglioni fue seleccionado en 2004 por las Naciones Unidas (UNODC) para participar activamente en un programa de ayuda a familias campesinas necesitadas.

Con altura de miras, sentido ético y compromiso social y medioambiental, Joël Doglioni ha logrado fortalecer Transpack S.A.S., haciendo de ella una compañía pionera en Colombia, sinónimo de seriedad, de calidad de servicio y de atención al cliente.`,
    `A graduate of Paul Valéry University in Montpellier, France, with a Master II in Information and Documentation Management, Joël Doglioni, a French citizen, is a passionate business administrator and a lover of Colombia.

He arrived in the Andean country with solid prior experience as an executive of French public works companies. He speaks Spanish, English and Italian, as well as French, his mother tongue.

Rooted in Colombia and at the same time at home in a globalized world, he has become an expert in international and national transport logistics, leading Transpack S.A.S.

Alongside this, Joël Doglioni has carried out an outstanding social role within the French community in Colombia. He was a member of the Board of the Alliance Française and of the Lycée Français in Bogotá, an elected Councillor of the French community for 18 years, and is now Honorary President of the Union of French Citizens Abroad (UFE) in Colombia. A Chevalier of the Légion d'honneur, Joël Doglioni has been decorated by France on several occasions.

Joël has also been committed for years to sustainable development and to reducing the ecological impact of his activities, focusing on strategies to reduce the use of paper, plastics and cardboard in his company.

Awarded the "Juan Peralta Ecology Award" in 2001 by the Pan American International Movers Association (PAIMA) for the project to preserve more than 55,000 trees that he carefully carries out in the urban area of Bogotá, Joël Doglioni was selected in 2004 by the United Nations (UNODC) to take an active part in an aid program for families of farmers in need.

With vision, ethics and social and environmental commitment, Joël Doglioni has strengthened Transpack S.A.S., making it a pioneering company in Colombia, synonymous with reliability, quality of service and customer care.`,
  ),
  website: "https://www.joeldoglioni.com/",
  photo: "/brand/ceo.jpg",
  eyebrow: tr("Nuestro CEO", "Our CEO"),
  visit: tr("Visitar su página web", "Visit his website"),
});
