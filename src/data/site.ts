// Contenido del sitio. Fuentes: carpeta RecursosTranspack/ (Modelo de
// Negocio, Lógica de Cotización y blogs) y el Manual de Marca.
import imgEquipoSala from "@/assets/images/equipo-sala.jpg";
import imgEmbalajeSala from "@/assets/images/embalaje-sala.jpg";
import imgContenedor from "@/assets/images/contenedor.jpg";
import imgGuacales from "@/assets/images/guacales.jpg";
import imgNuevaEtapa from "@/assets/images/nueva-etapa.jpg";
import imgGlobal from "@/assets/images/global.jpg";
import imgCargue from "@/assets/images/cargue.jpg";
import imgProteccion from "@/assets/images/proteccion.jpg";
import imgBarco from "@/assets/images/barco.jpg";

export const CONTACT = {
  whatsapp: "573218115967",
  phones: ["321 811 5967", "321 811 5989", "321 811 5977"],
  email: "servicioalcliente@transpacksas.com",
  address: "Cra. 40 #20A – 96, Bogotá, Colombia",
  handle: "@transpackmudanzas",
  web: "www.transpacksas.com",
  socials: [
    {
      icon: "instagram",
      label: "Instagram",
      href: "https://www.instagram.com/transpackmudanzas",
    },
    {
      icon: "facebook",
      label: "Facebook",
      href: "https://www.facebook.com/transpackmudanzas",
    },
    {
      icon: "tiktok",
      label: "TikTok",
      href: "https://www.tiktok.com/@transpackmudanzas",
    },
    {
      icon: "linkedin",
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/transpacksas",
    },
    { icon: "youtube", label: "YouTube", href: "https://www.youtube.com/@TranspackSAS" },
  ],
};

export const waLink = (text = "Hola Transpack, quiero información sobre una mudanza") =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;

// Shorts del canal oficial de YouTube (títulos traducidos de los originales en inglés)
export const YOUTUBE_CHANNEL = "https://www.youtube.com/@TranspackSAS";
export const VIDEOS = [
  { id: "i4G8QG8lan8", tag: "Mudanza internacional", title: "De Estados Unidos a Colombia" },
  { id: "uFEVARznuhM", tag: "Regreso a Colombia", title: "¿Te mudas a Colombia?" },
  {
    id: "bUOWdNVa2Uc",
    tag: "Planeación",
    title: "Una mudanza internacional empieza mucho antes del envío",
  },
];

export const SLOGAN = "Prometemos con el corazón, cumplimos con excelencia.";

export const STATS = [
  { value: 58, suffix: "+", label: "años de trayectoria" },
  { value: 176, suffix: "+", label: "países de destino" },
  { value: 60, suffix: "K+", label: "toneladas de menaje exportadas" },
  { value: 2000, suffix: "+", label: "agentes internacionales" },
];

export const EMBASSIES = [
  "Estados Unidos",
  "España",
  "Canadá",
  "México",
  "India",
  "Francia",
  "Alemania",
  "Egipto",
  "Emiratos Árabes",
  "Italia",
];

// ─── Servicios ────────────────────────────────────────────────────────────────
// "slug" arma la URL de cada servicio (/servicios/<slug>) y "quote" es el tipo
// de servicio que se preselecciona en el cotizador.

export type QuoteService = "local" | "nacional" | "internacional" | "empresarial" | "bodegaje";

export type Service = {
  slug: string;
  icon: string;
  title: string;
  short: string;
  quote: QuoteService;
  cta: string;
  image: string;
  kicker: string;
  headline: string;
  intro: string;
  includes: string[];
  steps: { title: string; text: string }[];
  note?: string;
  featured?: boolean;
  tags?: { icon: string; label: string }[];
};

export const SERVICES: Service[] = [
  {
    slug: "mudanzas-locales",
    icon: "house-door",
    title: "Mudanzas locales",
    short:
      "Trasteos dentro de Bogotá y su área urbana, con personal capacitado, protección del mobiliario y vehículos adecuados al volumen.",
    quote: "local",
    cta: "Cotizar",
    image: imgEquipoSala,
    kicker: "Trasteos en Bogotá",
    headline: "Tu trasteo en la ciudad, sin estrés y sin sorpresas",
    intro:
      "Planeamos cada mudanza local según el inmueble de origen y de destino: piso, ascensor, escaleras, acceso del vehículo y horarios permitidos por la administración. Así llegamos con el equipo y el tiempo justos.",
    includes: [
      "Visita técnica o videollamada cuando el volumen lo requiere",
      "Personal de cargue capacitado en manipulación de muebles",
      "Protección de mobiliario, electrodomésticos y objetos delicados",
      "Desarme y armado de muebles",
      "Vehículo adecuado al volumen de tu inventario",
      "Opción de bodegaje temporal",
    ],
    steps: [
      {
        title: "Cuéntanos tu trasteo",
        text: "Origen, destino, fecha, tipo de inmueble y lo que vas a mover.",
      },
      {
        title: "Recibe tu estimado",
        text: "Te enviamos un valor estimado y, si estás de acuerdo, la cotización formal.",
      },
      {
        title: "Empacamos y protegemos",
        text: "Según el nivel de servicio que elijas: básico, protección o integral.",
      },
      {
        title: "Entregamos en destino",
        text: "Descargamos y ubicamos todo en tu nuevo espacio.",
      },
    ],
    note: "Las mudanzas locales suelen programarse con 1 a 2 semanas de anticipación, pero también atendemos solicitudes urgentes según disponibilidad.",
  },
  {
    slug: "mudanzas-nacionales",
    icon: "truck",
    title: "Mudanzas nacionales",
    short:
      "Traslados entre ciudades de Colombia con inventario detallado, embalaje profesional, monitoreo del vehículo y entrega puerta a puerta.",
    quote: "nacional",
    cta: "Cotizar",
    image: imgCargue,
    kicker: "Entre ciudades de Colombia",
    headline: "De una ciudad a otra, con tu patrimonio protegido todo el camino",
    intro:
      "En una mudanza nacional el inventario es la base de todo: nos permite calcular el volumen, el vehículo y los recursos necesarios. Cuidamos la seguridad, la protección y el cumplimiento de tiempos en cada ruta.",
    includes: [
      "Inventario detallado y cálculo de volumen",
      "Embalaje profesional y protección especializada",
      "Monitoreo del vehículo durante el trayecto",
      "Condiciones de cargue y descargue planeadas en origen y destino",
      "Servicio puerta a puerta en todo el país",
      "Bodegaje en Bogotá si tu nuevo espacio aún no está listo",
    ],
    steps: [
      {
        title: "Inventario",
        text: "Detallamos lo que se mueve para estimar volumen y costo.",
      },
      {
        title: "Ruta y operación",
        text: "Validamos la ruta, el vehículo y las condiciones de acceso.",
      },
      {
        title: "Embalaje y cargue",
        text: "Protegemos cada objeto según su valor y fragilidad.",
      },
      {
        title: "Entrega",
        text: "Descargamos y ubicamos todo en tu nueva ciudad.",
      },
    ],
  },
  {
    slug: "mudanzas-internacionales",
    icon: "globe-americas",
    title: "Mudanzas internacionales",
    short:
      "Vía marítima o aérea, desde y hacia Colombia. Te asesoramos en requisitos, tiempos y trámites aduaneros antes de cotizar.",
    quote: "internacional",
    cta: "Hablar con un asesor",
    image: imgGlobal,
    kicker: "Desde y hacia Colombia",
    headline: "Tu próxima vida en otro país empieza con un plan claro",
    intro:
      "Una mudanza internacional no se trata igual que una urbana. Primero entiendes el proceso, los requisitos, los tiempos y los costos; después cotizamos. Un asesor especializado te acompaña desde el primer contacto, con el respaldo de más de 2.000 agentes en 176 países.",
    includes: [
      "Asesoría inicial sobre requisitos de origen y destino",
      "Modalidad marítima (grandes volúmenes) o aérea (cargas urgentes)",
      "Gestión documental y aduanera del menaje doméstico",
      "Guacales de madera y embalaje de exportación",
      "Coordinación con agentes certificados LACMA, IAM y PAIMA",
      "Entrega puerta a puerta en el país de destino",
    ],
    steps: [
      {
        title: "Perfilamiento",
        text: "Origen, destino, fecha, motivo del traslado e inventario preliminar.",
      },
      {
        title: "Asesoría especializada",
        text: "Revisamos requisitos, tiempos y costos adicionales contigo.",
      },
      {
        title: "Embalaje de exportación",
        text: "Inventario, clasificación y protección para el tránsito internacional.",
      },
      {
        title: "Tránsito y entrega",
        text: "Seguimiento hasta que tu nuevo hogar está habitable.",
      },
    ],
    note: "Recomendamos iniciar el proceso entre 1 y 2 meses antes de la fecha de empaque.",
    featured: true,
    tags: [
      { icon: "water", label: "Marítima" },
      { icon: "airplane", label: "Aérea" },
    ],
  },
  {
    slug: "bodegaje",
    icon: "boxes",
    title: "Bodegaje",
    short:
      "Almacenamiento seguro en Bogotá, por días, meses o mientras se completa tu traslado. Infraestructura propia y control de inventario.",
    quote: "bodegaje",
    cta: "Cotizar",
    image: imgContenedor,
    kicker: "Almacenamiento en Bogotá",
    headline: "Un lugar seguro para tus cosas, el tiempo que lo necesites",
    intro:
      "Nuestra infraestructura de bodegaje en Bogotá te permite guardar menaje, mobiliario de oficina o archivo mientras te instalas, remodelas o esperas tu fecha de viaje. Puedes contratarlo solo o como parte de tu mudanza.",
    includes: [
      "Bodegas propias en Bogotá",
      "Control de inventario de lo almacenado",
      "Recogida en tu ubicación y entrega cuando lo pidas",
      "Embalaje adecuado para almacenamiento prolongado",
      "Planes por días, meses o largo plazo",
      "Ideal para empresas, expatriados y familias en transición",
    ],
    steps: [
      {
        title: "Cuéntanos qué guardar",
        text: "Tipo de bienes, volumen y tiempo estimado.",
      },
      {
        title: "Recogemos",
        text: "Embalamos e inventariamos en tu ubicación.",
      },
      {
        title: "Almacenamos",
        text: "Tus bienes quedan bajo control en nuestras bodegas.",
      },
      {
        title: "Entregamos",
        text: "Cuando lo necesites, en la dirección que nos indiques.",
      },
    ],
  },
  {
    slug: "embalaje-especializado",
    icon: "easel",
    title: "Embalaje especializado",
    short:
      "Guacales de madera a la medida, amortiguación de alta densidad y protección para obras de arte, cristalería y mobiliario de alto valor.",
    quote: "local",
    cta: "Cotizar",
    image: imgGuacales,
    kicker: "Ingeniería de empaque",
    headline: "Las piezas de alto valor no se envuelven en empaques genéricos",
    intro:
      "Obras de arte, colecciones, cristalería y mobiliario de diseñador requieren ingeniería de empaque: guacales de madera a la medida para lienzos, amortiguación de impacto de alta densidad y protección contra la humedad en tránsitos largos.",
    includes: [
      "Guacales de madera fabricados a la medida",
      "Amortiguación de impacto de alta densidad",
      "Protección contra humedad para tránsitos marítimos",
      "Manejo de pianos y elementos sobredimensionados",
      "Inventario y rotulado pieza por pieza",
      "Personal con experiencia en objetos delicados",
    ],
    steps: [
      {
        title: "Evaluación",
        text: "Identificamos piezas especiales, medidas y fragilidad.",
      },
      {
        title: "Diseño del empaque",
        text: "Definimos materiales y guacales para cada pieza.",
      },
      { title: "Embalaje", text: "Empacamos, rotulamos e inventariamos." },
      {
        title: "Traslado",
        text: "Manipulación experta hasta el destino final.",
      },
    ],
  },
  {
    slug: "gestion-aduanera",
    icon: "file-earmark-text",
    title: "Gestión documental y aduanera",
    short:
      "Acompañamiento en exportación e importación de menaje doméstico, inventarios declarados y requisitos de origen y destino.",
    quote: "internacional",
    cta: "Cotizar",
    image: imgBarco,
    kicker: "Trámites internacionales",
    headline: "Las aduanas son laberintos legales. Nosotros conocemos el camino",
    intro:
      "Un inventario mal declarado o un permiso omitido puede costar semanas de retraso y sanciones. Te acompañamos con la documentación de exportación e importación de menaje y efectos personales, según la normativa de cada país.",
    includes: [
      "Revisión de requisitos del país de origen y destino",
      "Inventario declarado para aduanas",
      "Coordinación de gastos portuarios y aeroportuarios",
      "Acompañamiento en inspecciones y validaciones",
      "Asesoría para retorno de colombianos al país",
      "Comunicación proactiva durante el proceso",
    ],
    steps: [
      {
        title: "Diagnóstico",
        text: "Revisamos tu caso y los documentos requeridos.",
      },
      {
        title: "Preparación",
        text: "Inventario y documentación sin inconsistencias.",
      },
      {
        title: "Trámite",
        text: "Coordinamos con autoridades y agentes en destino.",
      },
      {
        title: "Liberación",
        text: "Seguimiento hasta la entrega de tus bienes.",
      },
    ],
  },
];

// ─── Soluciones por segmento (Modelo de Negocio, 4.1 y 4.2) ──────────────────

export const SEGMENTS = [
  {
    id: "residencial",
    icon: "house-door",
    tab: "Residencial",
    kicker: "Transpack Residencial",
    title: "Tu hogar, en las mismas condiciones en el nuevo destino",
    text: "Mudanzas de hogar locales, nacionales e internacionales. Elige cuánto quieres delegar: desde el traslado básico hasta un servicio integral en el que nos ocupamos de todo.",
    points: [
      "Embalaje, desarme y armado de muebles",
      "Protección de objetos delicados y de alto valor",
      "Bodegaje temporal mientras te instalas",
    ],
    cta: "Cotizar mudanza de hogar",
    quote: "local" as QuoteService,
    image: imgEquipoSala,
  },
  {
    id: "corporate",
    icon: "buildings",
    tab: "Corporate Mobility",
    kicker: "Transpack Corporate Mobility",
    title: "Un solo operador para trasladar oficinas y talento",
    text: "Traslados de oficinas y reubicación de personal nacional e internacional. Trabajamos con Compras y Recursos Humanos bajo acuerdos o contratos, con un ejecutivo de cuenta dedicado.",
    points: [
      "Ejecutivo de cuenta y operación recurrente",
      "Jornadas nocturnas o de fin de semana según cronograma",
      "Reportes, trazabilidad y condiciones corporativas",
    ],
    cta: "Solicitar propuesta corporativa",
    quote: "empresarial" as QuoteService,
    image: imgContenedor,
  },
  {
    id: "diplomatic",
    icon: "flag",
    tab: "Diplomatic & Institutional",
    kicker: "Transpack Diplomatic & Institutional",
    title: "Discreción, protocolo y precisión para misiones diplomáticas",
    text: "Embajadas de Estados Unidos, España, Canadá, México, India, Francia, Alemania, Egipto, Emiratos Árabes e Italia, y entidades como la CAF, han confiado en nosotros el traslado de su personal.",
    points: [
      "Atención protocolaria y absoluta confidencialidad",
      "Proceso de registro como proveedor institucional",
      "Cumplimiento normativo en origen y destino",
    ],
    cta: "Contactar al área institucional",
    quote: "internacional" as QuoteService,
    image: imgGuacales,
  },
  {
    id: "diaspora",
    icon: "airplane",
    tab: "Vivir en el exterior",
    kicker: "Te mudas a otro país o regresas a Colombia",
    title: "No solo llevamos tus cosas: facilitamos tu transición",
    text: "Si te vas a vivir a Estados Unidos, Canadá, Europa u otro destino, o regresas a Colombia, te acompañamos desde la planeación para que llegues con todo en orden.",
    points: [
      "Asesoría sobre requisitos, tiempos y costos antes de empacar",
      "Elección entre envío marítimo o aéreo según tu caso",
      "Red de agentes que te recibe en el país de destino",
    ],
    cta: "Planear mi mudanza internacional",
    quote: "internacional" as QuoteService,
    image: imgNuevaEtapa,
  },
];

// ─── Niveles de servicio (Lógica de Cotización, sección 8) ───────────────────

export const LEVELS = [
  {
    n: "01",
    title: "Traslado básico",
    text: "Ya tienes todo empacado. Nosotros ponemos el personal y el vehículo.",
    points: ["Personal de cargue", "Transporte", "Descargue en destino"],
    value: "Nivel 1 · Traslado básico",
  },
  {
    n: "02",
    title: "Protección y empaque",
    text: "Empacamos tus cajas y protegemos el mobiliario con manipulación profesional.",
    points: [
      "Todo lo del nivel básico",
      "Empaque de cajas",
      "Protección del mobiliario",
      "Manipulación profesional",
    ],
    value: "Nivel 2 · Protección y empaque",
    featured: true,
  },
  {
    n: "03",
    title: "Servicio integral",
    text: "Nos encargamos de todo el proceso, de principio a fin, para que tú solo llegues.",
    points: [
      "Todo lo del nivel 2",
      "Desarme y armado",
      "Organización en destino",
      "Coordinación completa",
    ],
    value: "Nivel 3 · Servicio integral",
  },
];

export const PROCESS = [
  {
    title: "Diagnóstico",
    text: "Entendemos origen, destino, plazo, inventario y el nivel de servicio que buscas.",
  },
  {
    title: "Diseño de la solución",
    text: "Combinamos transporte, embalaje, bodegaje y trámites. Si hace falta, hacemos visita técnica.",
  },
  {
    title: "Embalaje e inventario",
    text: "Clasificamos y protegemos cada objeto con materiales adecuados a su valor y fragilidad.",
  },
  {
    title: "Operación y seguimiento",
    text: "Coordinamos la ruta nacional o internacional y te mantenemos informado.",
  },
  {
    title: "Entrega puerta a puerta",
    text: "Terminamos cuando tu nuevo espacio está listo para habitar.",
  },
];

export const FAQS = [
  {
    q: "¿Con cuánta anticipación debo solicitar mi mudanza?",
    a: "Las mudanzas locales pueden programarse con una o dos semanas de anticipación, e incluso atendemos solicitudes urgentes según disponibilidad. Para mudanzas internacionales recomendamos iniciar el proceso entre uno y dos meses antes del empaque.",
  },
  {
    q: "¿Cuánto tarda una mudanza marítima internacional?",
    a: "Depende del origen, el destino, la frecuencia de las rutas, los procesos aduaneros y la temporada. En promedio puede tomar desde varias semanas hasta algunos meses. Una buena planeación y documentación completa reducen los retrasos.",
  },
  {
    q: "¿Es mejor una mudanza marítima o aérea?",
    a: "La marítima es ideal para grandes volúmenes, mobiliario completo y pertenencias familiares. La aérea es más rápida y se recomienda para cargas pequeñas o urgentes. Te asesoramos según tu presupuesto, tiempos y tipo de pertenencias.",
  },
  {
    q: "¿Necesito una visita técnica para cotizar?",
    a: "No siempre. Si la información de tu inventario y del inmueble es suficiente, podemos darte un estimado. Cuando hay complejidad o riesgo de error (accesos difíciles, objetos especiales, grandes volúmenes), recomendamos una visita o videollamada.",
  },
  {
    q: "¿Por qué es tan importante el inventario?",
    a: "El inventario nos permite estimar el volumen, los recursos y el tiempo necesarios. Una omisión puede cambiar el costo final, por eso entre más preciso sea, más exacta será tu cotización.",
  },
  {
    q: "¿Qué pasa si el camión no puede parquear cerca del inmueble?",
    a: "Es un dato clave: la distancia entre el vehículo y la puerta cambia la operación. Cuéntanos si el camión debe quedar fuera del conjunto o lejos de la torre para planear el personal y el tiempo adecuados.",
  },
];

export const GALLERY = [
  { src: imgEmbalajeSala, caption: "Embalaje en sitio" },
  { src: imgGuacales, caption: "Guacales a la medida" },
  { src: imgBarco, caption: "Rutas marítimas" },
  { src: imgContenedor, caption: "Cargue de contenedor" },
  { src: imgEquipoSala, caption: "Protección del mobiliario" },
];

export const ABOUT_IMAGES = { a: imgCargue, b: imgProteccion };
