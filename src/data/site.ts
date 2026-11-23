// Contenido del sitio. Fuentes: carpeta RecursosTranspack/ (Modelo de
// Negocio, Lógica de Cotización y blogs) y el Manual de Marca.
import imgInspeccionCanina from "@/assets/images/inspeccion-canina.jpg";
import imgEmbalajeSala from "@/assets/images/embalaje-sala.jpg";
import imgContenedor from "@/assets/images/contenedor.jpg";
import imgCargador from "@/assets/images/cargador.jpg";
import imgGuacales from "@/assets/images/guacales.jpeg";
import imgOficina from "@/assets/images/oficina.jpeg";
import imgExterior from "@/assets/images/exterior.jpg";
import imgGlobal from "@/assets/images/global.jpg";
import imgCargue from "@/assets/images/cargue.jpg";
import imgEquipoCaja from "@/assets/images/equipo-caja.jpg";
import imgArteHogar from "@/assets/images/galeria/arte-hogar.jpg";
import imgEmbalajeHogar from "@/assets/images/galeria/embalaje-hogar.jpg";
import imgCargueCajas from "@/assets/images/galeria/cargue-cajas.jpg";
import imgDespachoBodega from "@/assets/images/galeria/despacho-bodega.jpg";
import imgBodegaGuacales from "@/assets/images/galeria/bodega-guacales.jpg";
import imgGuacalExportacion from "@/assets/images/galeria/guacal-exportacion.jpg";
import imgEmbalajeCuadro from "@/assets/images/galeria/embalaje-cuadro.jpg";
import imgEmbalajeCarton from "@/assets/images/galeria/embalaje-carton.jpg";
import imgResidencial from "@/assets/images/residencial.jpeg";

export const CONTACT = {
  whatsapp: "573218115967",
  phones: ["321 811 5967", "321 811 5989", "321 811 5977"],
  email: "servicioalcliente@transpacksas.com",
  address: "Cra. 40 #20A – 96, Bogotá, Colombia",
  legalName: "Transpack S.A.S.",
  // PENDIENTE: el NIT no aparece en los documentos del cliente. No inventarlo:
  // mientras esté vacío, la política de datos no lo muestra.
  nit: "",
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
  {
    value: 176,
    suffix: "+",
    label: "países de destino, importación y exportación",
    short: "países de destino",
  },
  { value: 60, suffix: "K+", label: "toneladas de menaje doméstico exportadas" },
  { value: 2000, suffix: "+", label: "agentes y aliados estratégicos", short: "agentes y aliados" },
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
  // En el encabezado, el mapa animado de rutas por Colombia en vez de la foto
  // (la foto sigue como imagen para compartir en redes)
  heroMap?: boolean;
  // Rótulo sobre el título; sin él, no se muestra
  kicker?: string;
  headline: string;
  intro: string;
  // "Qué incluye"; sin lista, se muestra "photo" en su lugar
  includes?: string[];
  photo?: { src: string; alt: string };
  // "Así será su proceso"; sin pasos, se muestra "reel" (carrusel de fotos) en su lugar
  steps?: { title: string; text: string }[];
  reel?: { src: string; caption: string }[];
  note?: string;
  // "Nuestro compromiso", debajo de "¿Cómo lo hacemos?"
  commitment?: string;
  // Guía de términos que se muestra después de "¿Cómo lo hacemos?"
  guide?: ServiceGuide;
  featured?: boolean;
  tags?: { icon: string; label: string }[];
};

export type ServiceGuide = {
  eyebrow: string;
  title: string;
  lead?: string;
  // Sin secciones ni cierre, la guía es solo el título y la entrada
  sections?: {
    icon: string;
    title: string;
    text: string[];
    // Términos en negrita con su explicación
    items?: { b: string; t: string }[];
    after?: string;
  }[];
  closing?: { title: string; text: string[] };
};

export const SERVICES: Service[] = [
  {
    slug: "mudanzas-locales",
    icon: "house-door",
    title: "Mudanzas locales",
    short:
      "Trasteos en Bogotá y sus alrededores, realizados por personal experto y capacitado para la protección profesional del mobiliario, con vehículos adecuados al volumen.",
    quote: "local",
    cta: "Cotizar",
    image: imgEmbalajeHogar,
    kicker: "Trasteos en Bogotá",
    headline: "Su trasteo en la ciudad sin estrés",
    intro:
      "Antes de empezar, realizamos una valoración previa (presencial, virtual o telefónica) donde cada mueble, cada artículo y cada detalle importante se registra para planificar su traslado. Así sabemos exactamente qué mueve y garantizamos una mudanza sin estrés ni preocupaciones.",
    includes: [
      "Visita técnica, videollamada o estimación telefónica para determinar el volumen de su mudanza",
      "Personal experto y capacitado en manipulación y traslado de muebles, enseres y bienes de alto valor",
      "Protección adecuada del mobiliario, electrodomésticos y objetos delicados",
      "Vehículos seguros y adecuados para su traslado",
      "Opción de bodegaje temporal",
      "Cobertura de seguro de acuerdo con sus necesidades",
    ],
    steps: [
      {
        title: "Contáctenos",
        text: "Para recibir su presupuesto.",
      },
      {
        title: "Cotización",
        text: "Obtenga la cotización del servicio ajustada a sus necesidades.",
      },
      {
        title: "Coordinación",
        text: "Coordinamos su mudanza con nuestro equipo logístico (tiempos, protección, traslado).",
      },
      {
        title: "Entrega en destino",
        text: "Descargamos y ubicamos su menaje en su nuevo espacio.",
      },
    ],
    commitment:
      "una mudanza sin estrés. Planifique su nuevo espacio; nosotros nos encargamos de acompañarlo durante el proceso.",
    note: "Las mudanzas locales suelen programarse con 1 a 2 semanas de anticipación, pero también atendemos solicitudes urgentes según disponibilidad.",
  },
  {
    slug: "mudanzas-nacionales",
    icon: "truck",
    title: "Mudanzas nacionales",
    short:
      "Traslado a las principales ciudades de Colombia con inventario detallado, embalaje profesional, monitoreo del vehículo y entrega puerta a puerta.",
    quote: "nacional",
    cta: "Cotizar",
    image: imgCargue,
    heroMap: true,
    headline: "Su hogar puerta a puerta",
    intro:
      "En una mudanza nacional, el inventario y una óptima planificación son la base de todo: nos permiten calcular el volumen, determinar el tipo de vehículo y los materiales de empaque requeridos para una adecuada protección, y programar un viaje seguro, con la ruta optimizada para ajustarnos a los tiempos que usted requiere.",
    includes: [
      "Visita técnica, videollamada o estimación telefónica para determinar el volumen de su mudanza",
      "Personal experto y capacitado en manipulación y traslado de muebles, enseres y bienes de alto valor",
      "Protección adecuada del mobiliario, electrodomésticos y objetos delicados",
      "Vehículos seguros y adecuados para su traslado",
      "Opción de bodegaje temporal en Bogotá",
      "Cobertura de seguro de acuerdo con sus necesidades",
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
        text: "Descargamos y ubicamos todo en su nueva ciudad.",
      },
    ],
    commitment:
      "una correcta asesoría para que planifique su nuevo destino; nosotros nos encargamos de acompañarlo durante el proceso.",
  },
  {
    slug: "mudanzas-internacionales",
    icon: "globe-americas",
    title: "Mudanzas internacionales",
    short:
      "Vía marítima o aérea, desde y hacia Colombia. Lo asesoramos en requisitos, tiempos y trámites aduaneros antes de cotizar.",
    quote: "internacional",
    cta: "Hablar con un asesor",
    image: imgGlobal,
    kicker: "Desde y hacia Colombia",
    headline: "Cruzar fronteras sin preocupación",
    intro:
      "Una mudanza internacional no se trata igual que una urbana. Primero entiende el proceso, los requisitos, los tiempos y los costos. Un asesor especializado lo acompaña desde el primer contacto, con el respaldo de más de 2.000 agentes y aliados estratégicos en 176 países.",
    includes: [
      "Visita técnica por parte de uno de nuestros coordinadores de empaque",
      "Asesoría inicial sobre requisitos y normativa de origen y destino",
      "Presupuesto adaptado al volumen de su mudanza (aéreo o marítimo)",
      "Orientación sobre requisitos documentales y aduaneros para el traslado de su menaje",
      "Embalaje tipo exportación con materiales de primera calidad",
      "Coordinación de procesos en destino a través de nuestros agentes certificados",
      "Servicio puerta a puerta con entrega en su domicilio final",
    ],
    steps: [
      {
        title: "Perfilamiento",
        text: "Conocer el origen, destino y características particulares de su mudanza.",
      },
      {
        title: "Asesoría especializada",
        text: "Le informamos requisitos, tiempos y costos de la operación.",
      },
      {
        title: "Empaque tipo exportación",
        text: "Embalaje y protección profesional de su mudanza realizado por expertos.",
      },
      {
        title: "Logística y entrega",
        text: "Programación de envío y entrega en su domicilio final.",
      },
    ],
    note: "Recomendamos iniciar el proceso entre 1 y 2 meses antes de la fecha de empaque.",
    guide: {
      eyebrow: "Guía rápida",
      title: "¡Bienvenido a su nueva aventura!",
      lead: "Sabemos que una mudanza internacional es el inicio de una gran etapa, y queremos que disfrute el proceso sin preocuparse por la terminología técnica. Para que hablemos el mismo idioma desde el primer día, hemos preparado esta guía rápida con los términos que escuchará durante su traslado. ¡Verá que es más sencillo de lo que parece!",
    },
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
      "Almacenamiento seguro en Bogotá, por días, meses o mientras se completa su traslado. Infraestructura propia y control de inventario.",
    quote: "bodegaje",
    cta: "Cotizar",
    image: imgCargador,
    kicker: "Almacenamiento en Bogotá",
    headline: "Un lugar seguro para sus pertenencias, el tiempo que lo necesite",
    intro:
      "Nuestra infraestructura de bodegaje en Bogotá le permite guardar menaje, mobiliario de oficina o archivo mientras se instala, remodela o espera su traslado definitivo. Puede contratarlo solo o como parte de su mudanza, por el tiempo que lo requiera.",
    includes: [
      "Bodegas propias en Bogotá",
      "Control de inventario de lo almacenado",
      "Recogida en su ubicación y entrega cuando lo pida",
      "Embalaje adecuado para almacenamiento prolongado",
      "Ideal para empresas, expatriados y familias en transición",
    ],
    steps: [
      {
        title: "Qué desea almacenar",
        text: "Tipo de bienes, tiempo y volumen estimado.",
      },
      {
        title: "Recogemos",
        text: "Empacamos e inventariamos todo en su domicilio.",
      },
      {
        title: "Almacenamos",
        text: "Sus bienes quedan bajo custodia en nuestras instalaciones con vigilancia 24/7.",
      },
      {
        title: "Entregamos",
        text: "Cuando lo necesite, en la dirección que nos indique.",
      },
    ],
  },
  {
    slug: "embalaje-especializado",
    icon: "easel",
    title: "Embalaje especializado",
    short:
      "Protección para obras de arte, cristalería e ítems de alto valor, con elaboración de guacales a la medida.",
    quote: "local",
    cta: "Cotizar",
    image: imgGuacales,
    kicker: "Obras de arte y objetos de valor",
    headline:
      "Sus objetos más valiosos en manos profesionales. Empaque especializado y cuidado total",
    intro:
      "Obras de arte, colecciones, cristalería y mobiliario de alto valor requieren de una protección especializada, realizada por expertos con materiales de primera calidad, en cumplimiento de normativas internacionales para el cuidado y resguardo de sus objetos más delicados.",
    photo: { src: imgEmbalajeCuadro, alt: "Embalaje de un cuadro" },
    reel: [
      { src: imgArteHogar, caption: "Protección de obras de arte en casa" },
      { src: imgEmbalajeCarton, caption: "Embalaje de un cuadro" },
      { src: imgGuacalExportacion, caption: "Guacal de exportación" },
      { src: imgEmbalajeSala, caption: "Embalaje en sitio" },
      { src: imgEmbalajeHogar, caption: "Embalaje del menaje en casa" },
      { src: imgBodegaGuacales, caption: "Bodega con guacales de almacenamiento" },
    ],
  },
  {
    slug: "gestion-aduanera",
    icon: "file-earmark-text",
    title: "Gestión documental y aduanera",
    short:
      "Ofrecemos una orientación clara y oportuna de la documentación y regulación aduanera para llevar a cabo el proceso de su mudanza en cumplimiento de la normativa internacional.",
    quote: "internacional",
    cta: "Cotizar",
    image: imgInspeccionCanina,
    kicker: "Trámites internacionales",
    headline: "Asesoría en requisitos documentales y aduaneros para trámite en cada país",
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
        text: "Revisamos su caso y los documentos requeridos.",
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
        text: "Seguimiento hasta la entrega de sus bienes.",
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
    title: "Tu mudanza local: Ágil, segura y sin complicaciones",
    text: "",
    points: [
      "Embalaje, desarme y armado de muebles",
      "Protección de objetos delicados y de alto valor",
      "Bodegaje temporal mientras te instalas",
    ],
    cta: "Cotizar mudanza de hogar",
    quote: "local" as QuoteService,
    image: imgResidencial,
    // Foto panorámica: el marco usa su proporción para que se vea completa
    imageWide: true,
  },
  {
    id: "corporate",
    icon: "buildings",
    tab: "Movilidad corporativa",
    kicker: "Transpack Movilidad corporativa",
    title: "Transpack, un solo operador para trasladar su oficina con talento",
    text: "",
    points: [
      "Ejecutivo de cuenta y operación recurrente",
      "Reportes, trazabilidad y condiciones corporativas",
    ],
    cta: "Solicitar propuesta corporativa",
    quote: "empresarial" as QuoteService,
    image: imgOficina,
    // Foto panorámica: el marco usa su proporción para que se vea completa
    imageWide: true,
  },
  {
    id: "diplomatic",
    icon: "flag",
    tab: "Diplomático e institucional",
    kicker: "Transpack Diplomático e institucional",
    title: "Discreción, protocolo y precisión para misiones diplomáticas",
    text: "",
    points: [
      "Atención protocolaria y absoluta confidencialidad",
      "Proceso de registro como proveedor institucional",
      "Cumplimiento normativo en origen y destino",
    ],
    cta: "Contactar al área institucional",
    quote: "internacional" as QuoteService,
    image: imgArteHogar,
  },
  {
    id: "diaspora",
    icon: "airplane",
    tab: "Vivir en el exterior",
    kicker: "Te mudas a otro país o regresas a Colombia",
    title: "No solo llevamos sus cosas: facilitamos su transición",
    text: "",
    points: [
      "Asesoría sobre requisitos, tiempos y costos antes de empacar",
      "Elección entre envío marítimo o aéreo según su caso",
      "Red de agentes y aliados estratégicos que te recibe en el país de destino",
    ],
    cta: "Planear mi mudanza internacional",
    quote: "internacional" as QuoteService,
    image: imgExterior,
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
    text: "Empacamos sus cajas y protegemos el mobiliario con manipulación profesional.",
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
    text: "Terminamos cuando su nuevo espacio está listo para habitar.",
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
    a: "La marítima es ideal para grandes volúmenes, mobiliario completo y pertenencias familiares. La aérea es más rápida y se recomienda para cargas pequeñas o urgentes. Te asesoramos según su presupuesto, tiempos y tipo de pertenencias.",
  },
  {
    q: "¿Necesito una visita técnica para cotizar?",
    a: "Con un inventario podemos darle un estimado; sin embargo, cuando hay complejidad por accesos difíciles o artículos sobredimensionados, recomendamos realizar una visita técnica.",
  },
  {
    q: "¿Por qué es tan importante el inventario?",
    a: "El inventario nos permite estimar el volumen, los recursos y el tiempo necesarios. Una omisión puede cambiar el costo final, por eso entre más preciso sea, más exacta será su cotización.",
  },
  {
    q: "¿Qué pasa si el camión no puede parquear cerca del inmueble?",
    a: "Es un dato clave: la distancia entre el vehículo y la puerta cambia la operación. Cuéntanos si el camión debe quedar fuera del conjunto o lejos de la torre para planear el personal y el tiempo adecuados.",
  },
];

// Galería (mosaico del inicio). "tall": foto vertical que ocupa dos filas.
export const GALLERY: { src: string; caption: string; tall?: boolean }[] = [
  { src: imgContenedor, caption: "Cargue de contenedor", tall: true },
  { src: imgEmbalajeCuadro, caption: "Embalaje de un cuadro", tall: true },
  { src: imgEmbalajeSala, caption: "Embalaje en sitio" },
  { src: imgArteHogar, caption: "Protección de obras de arte en casa" },
  { src: imgCargueCajas, caption: "Cargue de cajas Transpack" },
  { src: imgGuacales, caption: "Guacales a la medida" },
  { src: imgBodegaGuacales, caption: "Bodega con guacales de almacenamiento" },
  { src: imgEmbalajeHogar, caption: "Embalaje del menaje en casa" },
  { src: imgGuacalExportacion, caption: "Guacal de exportación" },
  { src: imgDespachoBodega, caption: "Despacho desde la bodega" },
];

export const ABOUT_IMAGES = { a: imgCargue, b: imgEquipoCaja };

// ─── Política de tratamiento de datos personales ─────────────────────────────
// Ley 1581 de 2012 y Decreto 1377 de 2013 (compilado en el Decreto 1074 de
// 2015). BORRADOR basado en los datos que recoge el sitio: debe revisarlo y
// aprobarlo el asesor legal de Transpack antes de publicar el sitio (ver
// README.md). Página: /privacidad (pages/PrivacyPage.tsx).

export type PrivacySection = {
  id: string;
  title: string;
  /** Párrafos antes de la tabla o la lista */
  text?: string[];
  /** Tabla "Dónde · Datos · Finalidad" */
  table?: { head: [string, string, string]; rows: [string, string, string][] };
  items?: string[];
  /** Párrafos después de la tabla o la lista */
  after?: string[];
};

export const PRIVACY = {
  title: "Política de tratamiento de datos personales",
  intro:
    "En Transpack S.A.S. tratamos sus datos personales de acuerdo con la Ley 1581 de 2012 y el Decreto 1377 de 2013 (compilado en el Decreto 1074 de 2015). Aquí te explicamos qué datos recogemos en este sitio, para qué los usamos, cómo se transmiten y cómo puedes ejercer sus derechos.",
  updated: "Última actualización: 8 de octubre de 2026",
  notice: "",
  sections: [
    {
      id: "responsable",
      title: "Responsable del tratamiento",
      text: ["La empresa responsable de sus datos personales es:"],
    },
    {
      id: "datos",
      title: "Qué datos recogemos y para qué",
      text: [
        "Solo pedimos los datos necesarios para atender lo que nos solicitas. Estos son todos los canales del sitio:",
      ],
      table: {
        head: ["Dónde", "Datos", "Finalidad"],
        rows: [
          [
            "Formulario de contacto",
            "Nombre, empresa (opcional), correo, teléfono (opcional), motivo y mensaje.",
            "Responder su mensaje o solicitud, incluidas las solicitudes sobre sus datos personales.",
          ],
          [
            "Cotizador",
            "Servicio, origen y destino, fechas, datos del inmueble, volumen o inventario, nivel de servicio, servicios adicionales y comentarios; nombre, celular y correo. Si es para una empresa: nombre de la empresa y cargo del funcionario.",
            "Preparar el estimado y la cotización formal, contactarte para revisarla y, si la aceptas, coordinar el servicio.",
          ],
          [
            "Chat con un asesor (Zoho SalesIQ)",
            "Lo que escribes en la conversación y los datos que decidas darnos (por ejemplo, nombre, correo o teléfono), junto con datos técnicos de la visita: páginas vistas, ubicación aproximada, navegador y dispositivo.",
            "Atender tu consulta con un asesor de nuestro equipo en el chat del sitio.",
          ],
          [
            "WhatsApp y teléfono",
            "Su número y lo que decidas contarnos.",
            "Atender su consulta o solicitud.",
          ],
          [
            "Analítica del sitio (solo si aceptas las cookies)",
            "Páginas visitadas, ubicación aproximada (país o ciudad), tipo de dispositivo y acciones como abrir el chat o enviar una solicitud, nunca su contenido.",
            "Medir de forma agregada cómo se usa el sitio para mejorarlo.",
          ],
        ],
      },
      after: ["No vendemos sus datos ni los usamos para publicidad."],
    },
    {
      id: "sensibles",
      title: "Datos sensibles y de menores de edad",
      text: [
        "No pedimos datos sensibles (como información de salud, origen étnico, creencias o datos biométricos) ni datos de niñas, niños o adolescentes. Te pedimos no incluirlos en sus mensajes; si lo haces, los usaremos solo para atender su solicitud.",
        "Este sitio no está dirigido a menores de edad.",
      ],
    },
    {
      id: "transmision",
      title: "Cómo se transmiten y conservan sus datos",
      items: [
        "Formulario de contacto y cotizador por correo: tus datos viajan cifrados (HTTPS) a una función del propio sitio, que los envía por correo a Transpack mediante Brevo, nuestro proveedor de correo, que actúa como encargado del tratamiento. Brevo también te envía una confirmación de que recibimos tu solicitud. El sitio no guarda copia de lo que envías.",
        "WhatsApp: si eliges enviar tu solicitud por WhatsApp, esa conversación se rige además por los términos y la política de privacidad de WhatsApp (Meta).",
        "En tu navegador: tu decisión sobre cookies se guarda solo en tu navegador (almacenamiento local) y nunca se envía a Transpack. Puedes borrarla cuando quieras borrando los datos de este sitio en tu navegador.",
        "Chat con un asesor: el chat del sitio funciona con Zoho SalesIQ, la herramienta de chat de nuestro CRM, que actúa como encargado del tratamiento. Si aceptas las cookies en el aviso, Zoho se carga en segundo plano al entrar al sitio para que el chat abra al instante; si no las aceptas, se carga solo cuando abres el chat. Desde que se carga, recibe datos técnicos de la visita (páginas vistas, ubicación aproximada, navegador y dispositivo). Lo que escribas en el chat se guarda en los servidores de Zoho, que pueden estar fuera de Colombia, y en nuestro CRM.",
        "Fotos del mapa: las fotos del mapa de la portada (las de Bogotá con que empieza y la de cada lugar que tocas) las carga tu navegador directamente desde Wikimedia Commons, que recibe los datos técnicos de esa petición (dirección IP y navegador). No le enviamos ningún otro dato tuyo.",
        "Conservación: guardamos las solicitudes que recibimos durante el tiempo necesario para atenderlas y prestar el servicio, y después el que exijan las normas contables, tributarias y legales.",
      ],
    },
    {
      id: "compartir",
      title: "Con quién compartimos sus datos",
      items: [
        "En mudanzas internacionales, con nuestros agentes y aliados en el país de origen o de destino y con las autoridades aduaneras, solo en lo necesario para hacer la mudanza. Esto puede implicar transferir sus datos fuera de Colombia.",
        "Con los proveedores que nos ayudan a operar el sitio y a comunicarnos contigo, como encargados del tratamiento: Vercel (alojamiento del sitio), Brevo (envío de correos), Zoho (chat con un asesor y CRM) y Google (analítica, solo si la aceptas). Algunos están fuera de Colombia, por lo que sus datos pueden transmitirse a otros países.",
        "Con autoridades, cuando la ley lo exija.",
      ],
    },
    {
      id: "cookies",
      title: "Cookies y analítica",
      text: [
        "Usamos Google Analytics solo si aceptas las cookies analíticas en el aviso que aparece al entrar. Google actúa como encargado del tratamiento. No usamos cookies con fines publicitarios y, si las rechazas, el sitio funciona igual. Zoho SalesIQ, que hace funcionar el chat con un asesor, guarda las cookies que necesita el chat: si aceptas las cookies, se carga al entrar al sitio; si no, solo cuando abres el chat.",
      ],
    },
    {
      id: "derechos",
      title: "Sus derechos",
      text: ["Como titular de los datos puedes:"],
      items: [
        "Conocer, actualizar y rectificar sus datos.",
        "Pedir prueba de la autorización que nos diste.",
        "Saber qué uso les hemos dado.",
        "Revocar la autorización o pedir que eliminemos sus datos, cuando no exista un deber legal o contractual de conservarlos.",
        "Acceder gratis a sus datos.",
        "Presentar quejas ante la Superintendencia de Industria y Comercio (SIC), después de haber hecho su solicitud a Transpack.",
      ],
    },
    {
      id: "como-ejercerlos",
      title: "Cómo ejercer sus derechos",
      text: [
        `Usa el formulario de contacto con el motivo «Datos personales» o escríbenos a ${CONTACT.email}. Indica su nombre, su solicitud y un medio para responderte.`,
      ],
      items: [
        "Consultas: respondemos en máximo 10 días hábiles, prorrogables hasta 5 días hábiles más, avisándote el motivo.",
        "Reclamos (corrección, actualización, supresión o revocatoria): respondemos en máximo 15 días hábiles, prorrogables hasta 8 días hábiles más, avisándote el motivo.",
      ],
      after: [
        "Si no quedas satisfecho con la respuesta, puedes presentar una queja ante la Superintendencia de Industria y Comercio (SIC).",
      ],
    },
    {
      id: "autorizacion",
      title: "Autorización",
      text: [
        "Al marcar la casilla de autorización en el formulario de contacto o en el cotizador, nos autorizas a tratar sus datos para las finalidades de esta política. Si nos escribes por el chat con un asesor o por WhatsApp, o nos llamas, nos das su autorización con esa acción, para atender su solicitud. Puedes revocarla en cualquier momento por los medios de «Cómo ejercer sus derechos».",
      ],
    },
    {
      id: "seguridad",
      title: "Seguridad",
      text: [
        "Aplicamos medidas técnicas, humanas y administrativas razonables para proteger sus datos contra pérdida, consulta, uso o acceso no autorizado.",
      ],
    },
    {
      id: "vigencia",
      title: "Cambios y vigencia",
      text: [
        "Esta política rige desde su publicación en este sitio. Si la cambiamos de forma sustancial, lo informaremos aquí antes de aplicar los cambios y actualizaremos la fecha de esta página.",
      ],
    },
  ] as PrivacySection[],
};
