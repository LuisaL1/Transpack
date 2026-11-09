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
  kicker: string;
  headline: string;
  intro: string;
  includes: string[];
  steps: { title: string; text: string }[];
  note?: string;
  // Guía de términos que se muestra después de "¿Cómo lo hacemos?"
  guide?: ServiceGuide;
  featured?: boolean;
  tags?: { icon: string; label: string }[];
};

export type ServiceGuide = {
  eyebrow: string;
  title: string;
  lead?: string;
  sections: {
    icon: string;
    title: string;
    text: string[];
    // Términos en negrita con su explicación
    items?: { b: string; t: string }[];
    after?: string;
  }[];
  closing: { title: string; text: string[] };
};

// Guía de Mudanzas locales y nacionales (texto del cliente, noviembre de 2026)
const HOME_MOVE_GUIDE: ServiceGuide = {
  eyebrow: "Guía rápida",
  title: "Así será tu mudanza, paso a paso",
  sections: [
    {
      icon: "clipboard-check",
      title: "El primer paso: planificando tu mudanza",
      text: [
        "Antes de armar la primera caja, necesitamos calcular el tamaño de tu mudanza. A esto lo llamamos Encuesta Previa. Para tu comodidad, podemos hacer una Estimación Presencial (vamos a tu casa), Virtual (por videollamada) o Telefónica.",
        "Con esto creamos tu Lista de Inventario, el documento oficial donde anotamos todos tus Bienes del Hogar (muebles, electrodomésticos) y Efectos Personales (ropa, libros, artículos personales). Así sabemos exactamente qué viaja y garantizamos que todo llegue completo.",
      ],
    },
    {
      icon: "box-seam",
      title: "Día de la mudanza: empaque y cuidado de tus cosas",
      text: [
        "El día programado, nuestro equipo llegará a tu domicilio actual. Ellos cuentan con la mejor Capacitación del Personal para cuidar tus pertenencias como si fueran suyas:",
      ],
      items: [
        {
          b: "Materiales de Embalaje:",
          t: "utilizamos cajas de alta resistencia, plástico burbuja y papel kraft. También contamos con Materiales Ecológicos si prefieres cuidar el medio ambiente.",
        },
        {
          b: "Carga y Estiba:",
          t: "es el arte de acomodar todo perfectamente dentro del camión. Nos aseguramos de lograr una Carga Equilibrada para que el peso esté bien distribuido y nada sufra daños durante los movimientos del viaje.",
        },
        {
          b: "Contenedor Sellado / Camión Cerrado:",
          t: "tus bienes viajarán protegidos contra el clima y el polvo de la carretera, con sellos de seguridad si es necesario.",
        },
      ],
    },
    {
      icon: "signpost-split",
      title: "El viaje: en ruta hacia tu nuevo hogar",
      text: [
        "Para que tu mudanza no sufra retrasos innecesarios, utilizamos tecnología de Optimización de Rutas. Esto nos permite elegir el camino más seguro y eficiente, evitando zonas complicadas o tráfico pesado.",
        "Si en tu ciudad de destino hay alguna restricción vehicular o se requiere un Permiso Especial (por ejemplo, para ingresar a un conjunto residencial cerrado o para transitar a ciertas horas), nuestro equipo te asesorará para tenerlo todo listo.",
      ],
    },
    {
      icon: "key",
      title: "Tu llegada: desembalaje y entrega",
      text: [
        "¡Llegamos! Nuestro equipo bajará todo con el mayor cuidado. Una vez dentro de tu nueva casa, realizamos el Desembalaje (desempaque) de los artículos principales y te ayudamos con el Montaje e Instalación de tus camas, armarios o mesas para que puedas habitar tu hogar desde el primer día. Al terminar, nos encargamos de la Eliminación de Residuos, retirando todo el material de empaque usado para dejar tu espacio limpio.",
      ],
    },
    {
      icon: "shield-check",
      title: "Tu tranquilidad ante todo: riesgos y seguros",
      text: [
        "Aunque trabajamos con el máximo estándar para evitar Riesgos de Transporte, Carga o Descarga, los imprevistos en carretera existen. Para tu total tranquilidad, te ofrecemos opciones de Cobertura de Seguro:",
      ],
      items: [
        {
          b: "Cobertura Completa (Todo Riesgo):",
          t: "tu mejor aliada. Protege toda tu mudanza ante cualquier imprevisto o accidente en el camino.",
        },
        {
          b: "Cobertura Parcial:",
          t: "ideal si solo deseas asegurar ciertos objetos de valor específico.",
        },
      ],
    },
  ],
  closing: {
    title: "Nuestro compromiso contigo",
    text: [
      "Entendemos los Desafíos Logísticos de mover una casa entera y nos adaptamos a tus necesidades. Medimos la calidad de nuestro servicio a través de Indicadores de Calidad (KPIs) para asegurarnos de que recibas una atención cinco estrellas. Y si algo no sale como esperabas, nuestro equipo de Gestión de Quejas y Reclamaciones resolverá cualquier inconveniente de inmediato.",
      "¡Relájate y empieza a planificar tu nuevo espacio, nosotros nos encargamos del camión!",
    ],
  },
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
    image: imgEmbalajeHogar,
    kicker: "Trasteos en Bogotá",
    headline: "Su trasteo en la ciudad sin estrés",
    intro:
      "Planeamos cada mudanza local según el inmueble de origen y de destino: piso, ascensor, escaleras, acceso del vehículo y horarios permitidos por la administración. Así llegamos con el equipo y el tiempo justos.",
    includes: [
      "Visita técnica o videollamada cuando el volumen lo requiere",
      "Personal de cargue capacitado en manipulación de muebles",
      "Protección de mobiliario, electrodomésticos y objetos delicados",
      "Desarme y armado de muebles",
      "Vehículo adecuado al volumen de su inventario",
      "Opción de bodegaje temporal",
    ],
    steps: [
      {
        title: "Cuéntanos su trasteo",
        text: "Origen, destino, fecha, tipo de inmueble y lo que vas a mover.",
      },
      {
        title: "Recibe su estimado",
        text: "Te enviamos un valor estimado y, si estás de acuerdo, la cotización formal.",
      },
      {
        title: "Empacamos y protegemos",
        text: "Según el nivel de servicio que elijas: básico, protección o integral.",
      },
      {
        title: "Entregamos en destino",
        text: "Descargamos y ubicamos todo en su nuevo espacio.",
      },
    ],
    note: "Las mudanzas locales suelen programarse con 1 a 2 semanas de anticipación, pero también atendemos solicitudes urgentes según disponibilidad.",
    guide: HOME_MOVE_GUIDE,
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
    heroMap: true,
    kicker: "Entre ciudades de Colombia",
    headline: "Su patrimonio de puerta a puerta",
    intro:
      "En una mudanza nacional el inventario es la base de todo: nos permite calcular el volumen, el vehículo y los recursos necesarios. Cuidamos la seguridad, la protección y el cumplimiento de tiempos en cada ruta.",
    includes: [
      "Inventario detallado y cálculo de volumen",
      "Embalaje profesional y protección especializada",
      "Monitoreo del vehículo durante el trayecto",
      "Condiciones de cargue y descargue planeadas en origen y destino",
      "Servicio puerta a puerta en todo el país",
      "Bodegaje en Bogotá si su nuevo espacio aún no está listo",
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
    guide: HOME_MOVE_GUIDE,
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
    headline: "Cruzar fronteras sin preocupación",
    intro:
      "Una mudanza internacional no se trata igual que una urbana. Primero entiendes el proceso, los requisitos, los tiempos y los costos; después cotizamos. Un asesor especializado te acompaña desde el primer contacto, con el respaldo de más de 2.000 agentes y aliados estratégicos en 176 países.",
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
        text: "Seguimiento hasta que su nuevo hogar está habitable.",
      },
    ],
    note: "Recomendamos iniciar el proceso entre 1 y 2 meses antes de la fecha de empaque.",
    guide: {
      eyebrow: "Guía rápida",
      title: "¡Bienvenido a tu nueva aventura!",
      lead: "Sabemos que una mudanza internacional es el inicio de una gran etapa, y queremos que disfrutes el proceso sin preocuparte por la terminología técnica. Para que hablemos el mismo idioma desde el primer día, hemos preparado esta guía rápida con los términos que escucharás durante tu traslado. ¡Verás que es más sencillo de lo que parece!",
      sections: [
        {
          icon: "clipboard-check",
          title: "El inicio de todo: conociendo tu mudanza",
          text: [
            "Antes de mover una sola caja, necesitamos saber qué vamos a trasladar. A esto lo llamamos la Encuesta Previa. Dependiendo de tu tiempo y comodidad, podemos hacer una Estimación Presencial (vamos a tu casa), Virtual (por videollamada) o Telefónica.",
            "Al final, crearemos tu Lista de Inventario, que es el documento oficial donde anotamos cada uno de tus Bienes del Hogar (muebles, electrodomésticos) y Efectos Personales (ropa, libros).",
          ],
        },
        {
          icon: "box-seam",
          title: "Manos a la obra: empaque y logística",
          text: ["En este viaje no estás solo. Tendrás el apoyo de dos equipos clave:"],
          items: [
            {
              b: "Agente de Origen:",
              t: "el equipo en tu país actual que se encargará de empacar todo profesionalmente.",
            },
            {
              b: "Agente de Destino:",
              t: "la empresa que recibirá tus cosas en el nuevo país, las llevará a tu nuevo hogar, hará el Desembalaje (desempaque) y te ayudará con el Montaje e Instalación de tus muebles.",
            },
          ],
          after:
            "Para proteger tus pertenencias usamos Materiales de Embalaje de alta calidad (¡y también Materiales Ecológicos para cuidar el planeta!). Todo se acomoda de forma segura mediante un proceso llamado Carga y Estiba, asegurándonos de que haya una Carga Equilibrada dentro del contenedor para que nada se mueva en el camino. Tus cosas viajarán en un Contenedor Multimodal (que se adapta a barcos, trenes o camiones) y irá perfectamente protegido como un Contenedor Sellado.",
        },
        {
          icon: "passport",
          title: "El paso por la Aduana (¡sin estrés!)",
          text: [
            "Cruzar fronteras requiere papeleo, pero nuestro Agente de Aduanas se encargará de gestionar todo el despacho por ti. Escucharás hablar de:",
          ],
          items: [
            {
              b: "Declaración Aduanera y Formularios:",
              t: "los documentos oficiales donde le contamos a las autoridades qué llevamos y cuánto vale.",
            },
            {
              b: "Permiso de Importación o Especial:",
              t: "autorizaciones necesarias si viajas con artículos especiales como obras de arte, antigüedades o tus mascotas.",
            },
            {
              b: "Exención de Impuestos:",
              t: "un beneficio espectacular al que puedes aplicar si demuestras tu Residencia Legal, el cual te permite ingresar tus cosas sin pagar impuestos, siempre y cuando lo hagamos dentro del Plazo de Importación que dicta la ley de tu nuevo país.",
            },
          ],
        },
        {
          icon: "water",
          title: "Los documentos de tu viaje marítimo",
          text: [
            "Si tus cosas viajan por mar, el documento más importante es el Bill of Lading (BOL), que es el contrato y título de propiedad de tu envío.",
          ],
          items: [
            {
              b: "Conocimiento de Embarque Original (OBL):",
              t: "si te lo pedimos, significa que necesitaremos el papel en físico para liberar tus cosas en el puerto.",
            },
            {
              b: "Express Release:",
              t: "¡es mucho más rápido! Todo se libera digitalmente sin necesidad de papeles físicos.",
            },
          ],
        },
        {
          icon: "shield-check",
          title: "Tu tranquilidad es lo primero: riesgos y seguros",
          text: [
            "Aunque nuestro personal cuenta con la mejor Capacitación para evitar Riesgos de Transporte, Carga o Descarga, siempre es mejor viajar protegido. Por eso te ofreceremos una Cobertura de Seguro:",
          ],
          items: [
            {
              b: "Póliza Todo Riesgo (Cobertura Completa):",
              t: "tu mejor opción. Te protege contra prácticamente cualquier imprevisto o daño.",
            },
            {
              b: "Cobertura Parcial:",
              t: "ideal si solo quieres proteger ciertos artículos específicos o riesgos limitados.",
            },
          ],
        },
      ],
      closing: {
        title: "Nuestro compromiso contigo",
        text: [
          "Queremos que sepas que entendemos los Desafíos Logísticos de este proceso y respetamos profundamente la Cultura de tu lugar de destino. Monitoreamos nuestro servicio constantemente con Indicadores de Calidad (KPIs). Y si algo no sale perfecto, contamos con un equipo dedicado a la Gestión de Quejas y Reclamaciones para darte una solución justa y rápida.",
          "¡Relájate y empieza a empacar tus sueños, nosotros nos encargamos del resto!",
        ],
      },
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
    headline: "Un lugar seguro para sus pertenencias, el tiempo que lo necesites",
    intro:
      "Nuestra infraestructura de bodegaje en Bogotá te permite guardar menaje, mobiliario de oficina o archivo mientras te instalas, remodelas o esperas su fecha de viaje. Puedes contratarlo solo o como parte de su mudanza.",
    includes: [
      "Bodegas propias en Bogotá",
      "Control de inventario de lo almacenado",
      "Recogida en su ubicación y entrega cuando lo pidas",
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
        text: "Embalamos e inventariamos en su ubicación.",
      },
      {
        title: "Almacenamos",
        text: "Sus bienes quedan bajo control en nuestras bodegas.",
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
    headline:
      "Sus objetos más valiosos en manos profesionales. Empaque especializado y cuidado total",
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
    image: imgInspeccionCanina,
    kicker: "Trámites internacionales",
    headline: "Asesoría y trámites documentales para el proceso aduanero en cada país",
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
    title: "Cuidamos tu patrimonio, aseguramos tu destino",
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
    a: "No siempre. Si la información de su inventario y del inmueble es suficiente, podemos darte un estimado. Cuando hay complejidad o riesgo de error (accesos difíciles, objetos especiales, grandes volúmenes), recomendamos una visita o videollamada.",
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
