// Artículos del blog. Texto tomado de los PDF de contexto/RecursosTranspack
// (#1 mudanza marítima internacional, #2 elegancia en tránsito, #3 58 años).
import imgBarco from "@/assets/images/barco.jpg";
import imgGuacales from "@/assets/images/guacales.jpg";
import imgGlobal from "@/assets/images/global.jpg";

export type Item = string | { b: string; t: string };
export type Block =
  | { t: "h2"; text: string }
  | { t: "p"; text: string }
  | {
      t: "ul";
      items: Item[];
    };

export type Post = {
  slug: string;
  title: string;
  cat: string;
  cover: string;
  excerpt: string;
  cta: string;
  blocks: Block[];
};

export const blogPosts: Post[] = [
  {
    slug: "por-que-una-mudanza-maritima-internacional-puede-tardar",
    title: "¿Por qué una mudanza marítima internacional puede tardar más de lo esperado?",
    cat: "Mudanza internacional",
    cover: imgBarco,
    excerpt:
      "Aduanas, rutas, puertos y clima: entender cómo funciona una mudanza marítima te ayuda a tener expectativas claras y a evitar retrasos.",
    cta: "Planear mi mudanza internacional",
    blocks: [
      {
        t: "p",
        text: "Cuando una persona planea una mudanza internacional, una de las preguntas más frecuentes suele ser: ¿por qué el proceso tarda tanto? Aunque muchas veces se piensa que el traslado consiste únicamente en cargar pertenencias en un contenedor y enviarlas al destino final, la realidad es que una mudanza marítima internacional involucra una cadena logística compleja, coordinada y altamente regulada.",
      },
      {
        t: "p",
        text: "Desde procesos aduaneros hasta tiempos portuarios y condiciones climáticas, existen múltiples factores que pueden influir en la duración del traslado. Comprender cómo funciona este proceso no solo ayuda a tener expectativas más claras, sino también a tomar mejores decisiones al momento de planificar.",
      },
      { t: "h2", text: "¿Cuánto tarda una mudanza marítima internacional?" },
      {
        t: "p",
        text: "En promedio, una mudanza marítima internacional puede tardar entre varias semanas y algunos meses. No existe un tiempo universal exacto, ya que cada traslado depende de variables específicas como:",
      },
      {
        t: "ul",
        items: [
          "Distancia entre países",
          "Frecuencia de rutas marítimas",
          "Procesos aduaneros",
          "Disponibilidad portuaria",
          "Tipo de servicio contratado",
          "Temporadas de alta demanda",
        ],
      },
      {
        t: "h2",
        text: "Principales factores que hacen que una mudanza marítima tarde más",
      },
      {
        t: "ul",
        items: [
          {
            b: "Procesos aduaneros internacionales.",
            t: "Cada país cuenta con normativas específicas para el ingreso de menaje, efectos personales y mobiliario, lo que implica revisiones documentales, validaciones e incluso inspecciones físicas. Cuando la documentación presenta inconsistencias, los tiempos pueden extenderse considerablemente.",
          },
          {
            b: "Disponibilidad de rutas marítimas.",
            t: "Las navieras operan bajo itinerarios y frecuencias determinadas. Algunas rutas requieren tiempos de espera mayores para consolidar carga o coordinar conexiones portuarias.",
          },
          {
            b: "Congestión en puertos internacionales.",
            t: "En temporadas vacacionales o cierres comerciales es común que aumenten los tiempos de carga, descarga y liberación de contenedores.",
          },
          {
            b: "Condiciones climáticas y factores externos.",
            t: "Tormentas, temporadas invernales o restricciones operativas pueden generar cambios en rutas o ajustes logísticos temporales.",
          },
          {
            b: "Embalaje y protección de pertenencias.",
            t: "Obras de arte, cristalería, muebles de alto valor, objetos delicados y documentación importante requieren inventario, clasificación y protección especializada. Hacerlo bien requiere tiempo, experiencia y planeación.",
          },
        ],
      },
      {
        t: "h2",
        text: "¿Por qué una buena planificación puede reducir retrasos?",
      },
      {
        t: "p",
        text: "Muchas demoras ocurren por falta de preparación previa: documentos incompletos, tiempos mal calculados o desconocimiento de los procesos internacionales. Una adecuada planificación permite:",
      },
      {
        t: "ul",
        items: [
          "Anticipar requisitos aduaneros",
          "Organizar inventarios correctamente",
          "Coordinar fechas estratégicas",
          "Optimizar tiempos logísticos",
          "Reducir imprevistos",
        ],
      },
      { t: "h2", text: "Errores comunes que retrasan una mudanza marítima" },
      {
        t: "ul",
        items: [
          {
            b: "Documentación incompleta.",
            t: "No contar con todos los documentos requeridos para exportación o ingreso al país destino.",
          },
          {
            b: "Contratar empresas sin experiencia internacional.",
            t: "No todas las empresas de mudanzas conocen la logística internacional, los procesos marítimos y la coordinación aduanera.",
          },
          {
            b: "No planificar con suficiente anticipación.",
            t: "Lo ideal es iniciar el proceso con tiempo para garantizar una mejor organización.",
          },
        ],
      },
      { t: "h2", text: "¿Es mejor una mudanza marítima o aérea?" },
      {
        t: "p",
        text: "Depende de cada traslado. Las mudanzas marítimas son una excelente opción para grandes volúmenes, mobiliario completo y pertenencias familiares; las aéreas pueden ser más rápidas, aunque generalmente están orientadas a cargas más pequeñas o urgentes. La mejor alternativa dependerá del presupuesto, los tiempos y el tipo de pertenencias.",
      },
      { t: "h2", text: "Conclusión" },
      {
        t: "p",
        text: "Una mudanza internacional no debería sentirse improvisada, especialmente cuando se trata de proteger pertenencias importantes y comenzar una nueva etapa de vida. En Transpack acompañamos mudanzas nacionales e internacionales con procesos organizados, embalaje especializado y asesoría personalizada, para que hagas tu traslado con experiencia, confianza y respaldo profesional.",
      },
    ],
  },
  {
    slug: "elegancia-en-transito-seguridad-mudanzas-internacionales-premium",
    title:
      "Elegancia en tránsito: la ciencia de la seguridad en las mudanzas internacionales premium",
    cat: "Premium",
    cover: imgGuacales,
    excerpt:
      "Para líderes corporativos, diplomáticos y familias de alto perfil, la seguridad del patrimonio y la paz mental son innegociables. Estos son los 5 pilares de una transición sin fricciones.",
    cta: "Hablar con un consultor",
    blocks: [
      {
        t: "p",
        text: "Establecerse en un nuevo destino global es un hito de expansión. Sin embargo, para líderes corporativos, diplomáticos y familias de alto perfil, una mudanza internacional no es un simple asunto de transporte: es una transición crítica donde la seguridad del patrimonio, la gestión del tiempo y la paz mental son innegociables.",
      },
      {
        t: "p",
        text: "Cuando obras de arte, mobiliario de diseñador y colecciones privadas deben cruzar fronteras, la improvisación es el mayor riesgo. La verdadera tranquilidad radica en delegar el proceso en una firma con el respaldo estructural para mitigar cualquier eventualidad.",
      },
      {
        t: "h2",
        text: "Los 5 pilares de una transición global sin fricciones",
      },
      {
        t: "ul",
        items: [
          {
            b: "Embalaje técnico especializado.",
            t: "Las piezas de alto valor requieren ingeniería de empaque: guacales de madera a la medida para lienzos, amortiguación de impacto de alta densidad y control de humedad en tránsitos marítimos, u óptima protección en transporte aéreo.",
          },
          {
            b: "Cumplimiento aduanero riguroso.",
            t: "Un inventario mal declarado o la omisión de un permiso portuario puede costar semanas de retraso y sanciones económicas. La gestión debe estar en manos de expertos que dominen la legislación de origen y destino.",
          },
          {
            b: "Trazabilidad y control activo.",
            t: "El cliente premium exige visibilidad sobre el estado de su envío y una comunicación proactiva que elimine la incertidumbre durante el tránsito.",
          },
          {
            b: "Garantía y certificaciones internacionales.",
            t: "El aval de LACMA (Latin American & Caribbean Movers Association), IAM (International Association of Movers) y PAIMA (Pan American International Movers Association) asegura que la red de agentes en destino opere con los mismos estándares que en origen.",
          },
          {
            b: "Continuidad del estilo de vida.",
            t: "El servicio debe ser estrictamente puerta a puerta. La mudanza culmina únicamente cuando el nuevo hogar está habitable, con el mobiliario ensamblado y ubicado con la misma delicadeza con la que fue empacado.",
          },
        ],
      },
      {
        t: "h2",
        text: "Transpack S.A.S.: más de medio siglo de excelencia logística en Colombia",
      },
      {
        t: "p",
        text: "Con más de medio siglo de trayectoria, Transpack S.A.S. se ha consolidado como el socio estratégico para la reubicación de multinacionales, embajadas y cuentas clave. Nuestra propuesta combina:",
      },
      {
        t: "ul",
        items: [
          "Ingeniería de empaque premium adaptada a activos de alto valor.",
          "Asesoría aduanera integral para exportaciones e importaciones ágiles.",
          "Respaldo global certificado por LACMA, IAM y PAIMA.",
        ],
      },
      {
        t: "p",
        text: "Para quienes la seguridad de su patrimonio no es negociable, Transpack S.A.S. es la garantía de una transición sin fronteras. Permita que nuestros expertos diseñen una estrategia de mudanza internacional a la medida de sus exigencias corporativas y familiares.",
      },
    ],
  },
  {
    slug: "empresa-de-mudanzas-internacionales-en-colombia-58-anos",
    title:
      "Empresa de mudanzas internacionales en Colombia: 58 años de experiencia y cobertura global",
    cat: "Trayectoria",
    cover: imgGlobal,
    excerpt:
      "Por qué las organizaciones más exigentes y las misiones diplomáticas no dejan su movilidad al azar, y qué debes saber antes de elegir tu operador logístico.",
    cta: "Cotizar mi mudanza internacional",
    blocks: [
      {
        t: "p",
        text: "Una reubicación internacional no se mide en kilómetros; se mide en el nivel de incertidumbre que estás dispuesto a tolerar. Un solo error en un trámite aduanero, un retraso en puerto o un embalaje inadecuado pueden convertir un proyecto corporativo o de vida en una pesadilla logística costosa.",
      },
      {
        t: "p",
        text: "Por eso, cuando se trata de mover tu patrimonio o el de tu equipo directivo a través de las fronteras, la improvisación no es una opción.",
      },
      {
        t: "h2",
        text: "De Colombia al mundo: casi seis décadas de trayectoria",
      },
      {
        t: "p",
        text: "La historia de Transpack empezó hace 58 años, en un momento en el que el comercio internacional era más lento, más manual y con muchas más incertidumbres logísticas. Con el paso de las décadas, la compañía construyó algo que no se improvisa: una red operativa global.",
      },
      {
        t: "p",
        text: "Hoy esa red se traduce en más de 2.000 agentes internacionales en 176 países, con cobertura en Estados Unidos, Canadá, la Unión Europea, Asia y toda Latinoamérica. Esta cobertura es la razón por la cual empresas y familias confían su patrimonio a Transpack cuando cruzan fronteras.",
      },
      { t: "h2", text: "Especialistas en rutas marítimas y aéreas" },
      {
        t: "p",
        text: "No es lo mismo movilizar el menaje completo de una familia que se reubica en Europa que gestionar el traslado urgente de los efectos personales de un ejecutivo que asume funciones en Asia en cuestión de semanas. Esta doble capacidad operativa, marítima y aérea, permite diseñar soluciones flexibles sin sacrificar seguridad ni cumplimiento de tiempos.",
      },
      {
        t: "h2",
        text: "Estándar corporativo: la confianza de las marcas más exigentes",
      },
      {
        t: "p",
        text: "DHL, Mitsubishi, Saint-Gobain, Sumitomo Corp., Holcim, Schneider, Total Colombia, Mapfre, Air Liquide, Argos, Cartus, Teleperformance, Pernod Ricard, 3M, Grupo Santander, Nexans, Cencosud y Smartfit, entre muchas otras compañías, han elegido a Transpack para gestionar la reubicación de su personal. Este tipo de organizaciones trabaja con proveedores capaces de cumplir estándares internacionales de seguridad, trazabilidad y puntualidad.",
      },
      { t: "h2", text: "Un servicio a la altura de la diplomacia" },
      {
        t: "p",
        text: "Embajadas como las de Estados Unidos, España, Canadá, México, India, Francia, Alemania, Egipto, Emiratos Árabes e Italia, y entidades como la CAF, han confiado en Transpack el traslado de su personal diplomático, un segmento que exige discreción, protocolo y precisión muy superiores al estándar del mercado.",
      },
      {
        t: "h2",
        text: "Por qué esta trayectoria importa si estás por mudarte",
      },
      {
        t: "p",
        text: "La pregunta que realmente deberías hacerte no es ¿quién es la opción más económica?, sino ¿quién tiene la trayectoria comprobada para hacerlo bien, sin sorpresas? Conoce cómo Transpack puede acompañarte en cada etapa de tu mudanza, con la misma experiencia que ha respaldado a las empresas y misiones diplomáticas más exigentes del mundo.",
      },
    ],
  },
];

export const readMinutes = (post: Post) => {
  const words = post.blocks
    .map((b) =>
      b.t === "ul"
        ? b.items.map((i) => (typeof i === "string" ? i : `${i.b} ${i.t}`)).join(" ")
        : b.text,
    )
    .join(" ")
    .split(/\s+/).length;
  return Math.max(2, Math.round(words / 200));
};
