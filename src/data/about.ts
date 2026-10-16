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
      "Construimos una red de más de 2.000 agentes internacionales en 176 países.",
      "We built a network of more than 2,000 international agents in 176 countries.",
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
    "Nuestro trabajo se basa en la precisión, el cuidado y la metodología: inventarios detallados, embalaje técnico y una operación estructurada de principio a fin. Las certificaciones internacionales respaldan que tu mudanza se opera con el mismo estándar en cualquier parte del mundo.",
    "Our work is built on precision, care and method: detailed inventories, technical packing and a structured operation from start to finish. International certifications ensure your move runs to the same standard anywhere in the world.",
  ),
  selloLacmaCertifiedPackers: tr("Sello LACMA Certified Packers", "LACMA Certified Packers seal"),
  asociacionesInternacionalesEmpresasMudanzas: tr(
    "Asociaciones internacionales de empresas de mudanzas",
    "International associations of moving companies",
  ),
  cotizaMudanza: tr("Cotiza tu mudanza", "Get a moving quote"),
});

// ─── Nuestro CEO ─────────────────────────────────────────────────────────────
// PENDIENTE del cliente: nombre, cargo, texto, enlace a su página y la foto
// (public/brand/ceo.jpg). Mientras `name` esté vacío, la sección de Nosotros y
// la opción del menú no se muestran.
export const ceoInfo = (tr: Tr) => ({
  name: "Joël Doglioni",
  role: tr("CEO de Transpack", "CEO of Transpack"),
  bio: tr(
    `Llegué a Colombia en los años 80 como joven ejecutivo de un grupo francés, y he dedicado gran parte de mi vida a representar y apoyar a la comunidad francesa residente en el país. Nada me había preparado a ello salvo mi interés creciente por la vida pública y mi paso de joven por las filas del ejército, donde aprendí que el verbo SERVIR es noble.

Al margen de mi actividad profesional, fui consejero en la Asamblea de los Franceses de la zona andina entre 2003 y 2014 y consejero consular hasta 2021. Durante la pandemia de COVID-19, mi labor se intensificó, y hasta cambió de naturaleza, pues me vi obligado a brindar en condiciones muy desestabilizadoras asistencia administrativa, orientación práctica y apoyo psicológico a muchos compatriotas profundamente afectados. Este momento me marcó mucho.

Tengo mis convicciones políticas y filosóficas. Me ayudan a avanzar y a comprender un mundo cada vez más complejo, violento e imprevisible. Sin embargo, no considero los mandatos que ejercí como mandatos políticos. Apoyar a sus compatriotas, ayudarles a entender los entresijos de la legislación, abogar por ellos en el Consulado o en la Embajada, escribir si hace falta al ministro competente en París: todo esto no es política. Es civismo. Es puro servicio.

Ser un facilitador legítimo, es decir, alguien que ayuda a sus compatriotas a resolver las dificultades administrativas de todo tipo que conlleva vivir fuera del país, es lo que quise ser y lo que fui durante 18 años. De esta experiencia saco una simple enseñanza: la comunidad francesa en Colombia no necesita batallitas entre partidos políticos.

No necesita que uno venga a explicarle la diferencia entre la izquierda y la derecha, entre el bien y el mal, entre la luz y la noche. Lo que sí necesitamos, en tiempos revueltos como los que corren, son gentes comprometidas, competentes y cercanas.`,
    `I arrived in Colombia in the 1980s as a young executive of a French group, and I have devoted a large part of my life to representing and supporting the French community living in the country. Nothing had prepared me for it except my growing interest in public life and my time as a young man in the army, where I learned that the verb SERVE is a noble one.

Alongside my professional activity, I was a councillor in the Assembly of French Citizens Abroad for the Andean region between 2003 and 2014, and a consular councillor until 2021. During the COVID-19 pandemic my work intensified and even changed in nature: under very unsettling conditions I found myself providing administrative assistance, practical guidance and psychological support to many deeply affected compatriots. That period marked me profoundly.

I have my political and philosophical convictions. They help me move forward and understand a world that is ever more complex, violent and unpredictable. Yet I do not regard the mandates I held as political ones. Supporting your compatriots, helping them understand the ins and outs of the law, advocating for them at the Consulate or the Embassy, writing to the relevant minister in Paris when needed: none of that is politics. It is civic duty. It is pure service.

Being a legitimate facilitator, someone who helps compatriots solve the administrative difficulties of every kind that come with living abroad, is what I wanted to be and what I was for 18 years. From that experience I draw one simple lesson: the French community in Colombia does not need petty battles between political parties.

It does not need anyone to come and explain the difference between left and right, between good and evil, between light and night. What we do need, in turbulent times like these, are committed, competent people who are close to us.`,
  ),
  website: "https://www.joeldoglioni.com/",
  photo: "/brand/ceo.jpg",
  eyebrow: tr("Nuestro CEO", "Our CEO"),
  visit: tr("Visitar su página web", "Visit his website"),
});
