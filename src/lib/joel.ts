// ─── Joel: "cerebro" local del asesor virtual de Transpack ───────────────────
// Funciona sin IA externa (misma arquitectura que el de Transarchivos). Tiene
// tres partes:
//  1. Perfil del visitante: registra en el navegador (localStorage, nunca sale
//     del equipo) qué secciones, servicios y artículos ve, qué busca, qué
//     cotizaciones empieza y de qué habla en el chat. Con eso detecta si es un
//     comprador, un visitante técnico (solo consume contenido) o un explorador,
//     qué servicio le interesa más y si es recurrente.
//  2. Motor de intenciones: normaliza el texto, tolera errores de tipeo,
//     puntúa palabras clave y sinónimos, responde preguntas puntuales (FACTS),
//     recuerda de qué servicio se venía hablando, detecta el problema del
//     cliente (p. ej. "me trasladan a Alemania en dos meses") y se defiende de
//     objeciones, insultos e intentos de manipulación.
//  3. Aprendizaje: cuando no entiende algo y el visitante elige después una
//     opción, asocia esas palabras a esa opción para la próxima vez.
// El conocimiento (servicios, segmentos, niveles, preguntas frecuentes,
// contacto, destinos, blog…) lo entrega el chat al crear el motor, para que
// haya una sola fuente de verdad. Lo que no está en los datos del sitio ni en
// los documentos de la empresa (precios, pólizas, horarios de atención,
// artículos restringidos…) Joel no lo inventa: lo dice y da el contacto.
// Responde en español; en los otros idiomas el chat sigue el flujo guiado.

export type JoelAction = {
  label: string;
  icon: string;
  href?: string;
  to?: string;
  /** Abre el chat con un asesor (Zoho SalesIQ) */
  crm?: boolean;
};
export type JoelOption = {
  label: string;
  next: string;
  set?: Record<string, string>;
  icon?: string;
};
export type JoelReply = {
  say: string[];
  actions?: JoelAction[];
  options?: JoelOption[];
  intent: string;
  service?: string;
};

type QuoteKind = "local" | "nacional" | "internacional" | "empresarial" | "bodegaje";

export type JoelKB = {
  services: {
    slug: string;
    title: string;
    short: string;
    intro: string;
    includes: string[];
    steps: { title: string; text: string }[];
    note?: string;
    quote: QuoteKind;
  }[];
  segments: {
    id: string;
    kicker: string;
    title: string;
    text: string;
    points: string[];
    quote: QuoteKind;
  }[];
  levels: { title: string; text: string; points: string[] }[];
  process: { title: string; text: string }[];
  faqs: { q: string; a: string }[];
  contact: { phones: string[]; email: string; address: string };
  whatsapp: (text?: string) => string;
  stats: { value: number; suffix: string; label: string }[];
  embassies: string[];
  destinations: string[];
  clients: string[];
  posts: { slug: string; title: string; cat: string; excerpt: string }[];
};

// ─── 1. Perfil del visitante ────────────────────────────────────────────────

type Profile = {
  visits: number;
  first: number;
  last: number;
  counts: Record<string, number>; // "section:faq", "service:slug", "article:slug", "quote:tipo", "chat:intent"
  searches: string[];
  learned: Record<string, string>; // palabra → destino ("service:clave" | "intent:id")
  unknown: string[]; // preguntas que no supo responder (para revisar)
};
const KEY = "tp-joel-profile";
const empty = (): Profile => ({
  visits: 0,
  first: Date.now(),
  last: Date.now(),
  counts: {},
  searches: [],
  learned: {},
  unknown: [],
});

function load(): Profile {
  try {
    const p = JSON.parse(localStorage.getItem(KEY) || "null");
    if (p && typeof p === "object") return { ...empty(), ...p };
  } catch {
    /* sin almacenamiento */
  }
  return empty();
}
function save(p: Profile) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* sin almacenamiento */
  }
}

/** Registra una visita (una vez por sesión del navegador). */
export function trackVisit() {
  try {
    if (sessionStorage.getItem("tp-joel-visit")) return;
    sessionStorage.setItem("tp-joel-visit", "1");
  } catch {
    /* sin almacenamiento */
  }
  const p = load();
  p.visits += 1;
  p.last = Date.now();
  save(p);
}
/** Registra un evento: track("section", "faq"), track("service", slug)… */
export function track(kind: "section" | "service" | "article" | "quote" | "chat", key: string) {
  const p = load();
  const k = `${kind}:${key}`;
  p.counts[k] = (p.counts[k] || 0) + 1;
  p.last = Date.now();
  save(p);
}
export function trackSearch(q: string) {
  const t = q.trim();
  if (t.length < 3) return;
  const p = load();
  p.searches = [t, ...p.searches.filter((x) => x !== t)].slice(0, 15);
  save(p);
}

// Tipo de cotización (cotizador y chat) → tema de Joel
export const QUOTE_TOPIC: Record<QuoteKind, string> = {
  local: "mudanzas-locales",
  nacional: "mudanzas-nacionales",
  internacional: "mudanzas-internacionales",
  empresarial: "empresas",
  bodegaje: "bodegaje",
};
// Segmento de la sección "Soluciones" → tema de Joel
export const SEGMENT_TOPIC: Record<string, string> = {
  corporate: "empresas",
  diplomatic: "embajadas",
  diaspora: "mudanzas-internacionales",
};

type Insight = {
  returning: boolean;
  segment: "tecnico" | "comprador" | "explorador";
  topServices: string[];
  readArticles: string[];
};

function getInsight(
  topicOf: (text: string) => string | undefined,
  articleTopic: (slug: string) => string | undefined,
): Insight {
  const p = load();
  const c = p.counts;
  const sum = (prefix: string) =>
    Object.entries(c)
      .filter(([k]) => k.startsWith(prefix))
      .reduce((a, [, v]) => a + v, 0);
  const svc: Record<string, number> = {};
  const add = (key: string | undefined, n: number) => {
    if (key) svc[key] = (svc[key] || 0) + n;
  };
  for (const [k, v] of Object.entries(c)) {
    const i = k.indexOf(":");
    const kind = k.slice(0, i);
    const key = k.slice(i + 1);
    if (kind === "service") add(key, 3 * v);
    if (kind === "quote") add(QUOTE_TOPIC[key as QuoteKind], 4 * v);
    if (kind === "chat" && key.startsWith("svc-")) add(key.slice(4), 2 * v);
    if (kind === "article") add(articleTopic(key), v);
  }
  for (const s of p.searches) add(topicOf(s), 1);
  const articles = Object.keys(c)
    .filter((k) => k.startsWith("article:"))
    .map((k) => k.slice(8));
  // Técnico: lee contenido (blog, preguntas frecuentes, proceso, niveles) sin cotizar
  const tech =
    articles.length * 2 +
    (c["section:faq"] || 0) +
    (c["section:proceso"] || 0) +
    (c["section:blog"] || 0) +
    (c["section:niveles"] || 0) +
    (c["chat:faq"] || 0) +
    p.searches.length;
  // Comprador: empieza cotizaciones o pregunta por precios
  const buy =
    (c["section:cotizar"] || 0) +
    sum("quote:") * 3 +
    (c["chat:precio"] || 0) * 3 +
    (c["chat:cotizar"] || 0) * 3 +
    sum("chat:pain-") * 2;
  const segment = buy >= 3 && buy >= tech ? "comprador" : tech >= 3 ? "tecnico" : "explorador";
  return {
    returning: p.visits > 1,
    segment,
    topServices: Object.entries(svc)
      .sort((a, b) => b[1] - a[1])
      .filter(([, v]) => v >= 3)
      .map(([k]) => k)
      .slice(0, 2),
    readArticles: articles,
  };
}

// ─── 2. Normalización, tolerancia a errores ────────────────────────────────

export const norm = (t: string) =>
  t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9ñ\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
const STOP = new Set(
  "a al algo algun alguna alguno ante como con cual cuales de del el ella ellos en entre era es esa ese eso esta este esto estoy fue ha han hay la las le les lo los me mi mis mucho muy nada ni no nos o otra otro para pero poco por porque puede pueden que quiero quisiera se si sin sobre solo son su sus tambien tengo tiene tienen todo todos tu tus te un una uno unos usted ustedes y ya yo hola buenas buenos dias tardes noches gracias favor necesito saber ayuda mudanza mudanzas transpack hacer hacen".split(
    " ",
  ),
);
const stem = (w: string) =>
  w.length > 5
    ? w.replace(
        /(aciones|acion|amiento|mente|ciones|cion|ndo|ados|adas|ado|ada|ar|er|ir|es|s)$/,
        "",
      )
    : w.replace(/s$/, "");

function lev(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 2) return 9;
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
  return d[a.length][b.length];
}
/** ¿El texto contiene la palabra clave? Acepta frases, raíces y errores de tipeo. */
function has(text: string, words: string[], kw: string): boolean {
  const k = norm(kw);
  if (!k) return false;
  if (k.includes(" ")) return ` ${text} `.includes(` ${k} `);
  const ks = stem(k);
  return words.some((w) => {
    if (w === k || (ks.length >= 4 && stem(w) === ks)) return true;
    if (ks.length >= 5 && w.startsWith(ks)) return true;
    // Errores de tipeo: misma primera letra y tolerancia según el largo
    if (w[0] !== k[0]) return false;
    const tol = k.length >= 9 ? 2 : k.length >= 6 ? 1 : 0;
    return tol > 0 && lev(w, k) <= tol;
  });
}
const hasAny = (text: string, words: string[], kws: string[]) =>
  kws.some((k) => has(text, words, k));
const keywordsOf = (text: string) =>
  norm(text)
    .split(" ")
    .filter((w) => w.length >= 4 && !STOP.has(w));

// ─── Lugares ────────────────────────────────────────────────────────────────
// Solo sirven para reconocer a dónde va el visitante; la cobertura que se
// afirma sale de los datos del sitio (destinos, países y agentes).

const COUNTRY_EXTRA = [
  "Reino Unido",
  "Inglaterra",
  "Londres",
  "Portugal",
  "Países Bajos",
  "Holanda",
  "Bélgica",
  "Suiza",
  "Suecia",
  "Noruega",
  "Dinamarca",
  "Irlanda",
  "Australia",
  "Nueva Zelanda",
  "Japón",
  "China",
  "Corea del Sur",
  "Chile",
  "Perú",
  "Argentina",
  "Brasil",
  "Ecuador",
  "Panamá",
  "Costa Rica",
  "Venezuela",
  "Uruguay",
  "Paraguay",
  "Bolivia",
  "República Dominicana",
  "Puerto Rico",
  "Guatemala",
  "Miami",
  "Nueva York",
  "Toronto",
  "Madrid",
  "Barcelona",
  "París",
  "Berlín",
  "Roma",
  "Dubái",
  "Europa",
  "Asia",
];
const COUNTRY_ALIAS: Record<string, string> = {
  eeuu: "Estados Unidos",
  "ee uu": "Estados Unidos",
  gringolandia: "Estados Unidos",
  emiratos: "Emiratos Árabes",
};
const CITIES = [
  "Bogotá",
  "Medellín",
  "Cali",
  "Barranquilla",
  "Cartagena",
  "Bucaramanga",
  "Pereira",
  "Manizales",
  "Santa Marta",
  "Cúcuta",
  "Villavicencio",
  "Ibagué",
  "Armenia",
  "Pasto",
  "Neiva",
  "Tunja",
  "Montería",
  "Valledupar",
  "Popayán",
  "Yopal",
  "Girardot",
  "Chía",
  "Zipaquirá",
  "Rionegro",
  "Sincelejo",
  "Riohacha",
];

function placeIn(
  t: string,
  names: string[],
  alias: Record<string, string> = {},
): string | undefined {
  const s = ` ${t} `;
  for (const [a, name] of Object.entries(alias)) if (s.includes(` ${a} `)) return name;
  return names.find((n) => s.includes(` ${norm(n)} `));
}

// Plazo mencionado ("en dos meses", "la próxima semana", "mañana") → días
const NUM: Record<string, number> = {
  un: 1,
  una: 1,
  uno: 1,
  dos: 2,
  tres: 3,
  cuatro: 4,
  cinco: 5,
  seis: 6,
  siete: 7,
  ocho: 8,
  nueve: 9,
  diez: 10,
  once: 11,
  doce: 12,
  quince: 15,
  veinte: 20,
  treinta: 30,
};
const UNIT: Record<string, number> = { dia: 1, semana: 7, mes: 30, ano: 365 };
// (el texto llega normalizado por norm: un solo espacio entre palabras)
function daysIn(t: string): number | undefined {
  const m = t.match(
    /\b(\d{1,3}|un|una|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce|quince|veinte|treinta) (dia|semana|mes|ano)(s|es)?\b( y medio)?/,
  );
  if (m) {
    const n = /^\d+$/.test(m[1]) ? Number(m[1]) : NUM[m[1]];
    return Math.round(n * UNIT[m[2]] + (m[4] ? UNIT[m[2]] / 2 : 0));
  }
  if (/\bmes y medio\b/.test(t)) return 45;
  if (/\b(hoy|pasado manana|para manana|manana mismo)\b/.test(t)) return 1;
  if (/\b(esta|la proxima|proxima|la otra) semana\b|\beste fin de semana\b/.test(t)) return 7;
  if (/\b(el|este) mes\b|\b(el otro|el proximo|proximo) mes\b/.test(t)) return 30;
  return undefined;
}

// ─── 3. Motor ──────────────────────────────────────────────────────────────

export type Memory = {
  lastService?: string;
  lastIntent?: string;
  unknownStreak: number;
  rude: number;
  pendingWords: string[];
};
export const newMemory = (): Memory => ({ unknownStreak: 0, rude: 0, pendingWords: [] });

// Pasos del chat guiado (AdvisorChat) en los que empieza cada cotización
const ENTRY: Record<QuoteKind, string> = {
  local: "origen",
  nacional: "origen",
  internacional: "int_info",
  empresarial: "corp",
  bodegaje: "bod_que",
};

// Palabras clave y sinónimos por tema (servicios del sitio + segmentos B2B)
const TOPIC_KEYWORDS: Record<string, string[]> = {
  "mudanzas-locales": [
    "mudanza local",
    "trasteo",
    "trasteos",
    "trastear",
    "misma ciudad",
    "dentro de bogota",
    "en bogota",
    "otro barrio",
    "de barrio",
    "cambio de apartamento",
    "cambio de casa",
    "mudanza urbana",
    "local",
    "dentro de la ciudad",
  ],
  "mudanzas-nacionales": [
    "nacional",
    "nacionales",
    "otra ciudad",
    "entre ciudades",
    "otro departamento",
    "fuera de bogota",
    "otra parte del pais",
    "dentro de colombia",
    "ciudad a ciudad",
  ],
  "mudanzas-internacionales": [
    "internacional",
    "internacionales",
    "exterior",
    "otro pais",
    "al extranjero",
    "extranjero",
    "fuera del pais",
    "emigrar",
    "migrar",
    "contenedor",
    "maritima",
    "maritimo",
    "aerea",
    "aereo",
    "barco",
    "naviera",
    "diaspora",
  ],
  bodegaje: [
    "bodegaje",
    "bodega",
    "bodegas",
    "almacenar",
    "almacenamiento",
    "guardar",
    "guardado",
    "guardamuebles",
    "deposito",
    "storage",
    "dejar guardado",
  ],
  "embalaje-especializado": [
    "embalaje especializado",
    "guacal",
    "guacales",
    "obra de arte",
    "obras de arte",
    "arte",
    "cuadros",
    "pinturas",
    "esculturas",
    "antiguedades",
    "cristaleria",
    "porcelana",
    "coleccion",
    "alto valor",
    "fragil",
    "fragiles",
    "delicado",
    "delicados",
    "lampara",
    "marmol",
    "mobiliario de disenador",
  ],
  "gestion-aduanera": [
    "aduana",
    "aduanas",
    "aduanero",
    "aduanera",
    "dian",
    "menaje domestico",
    "declaracion",
    "nacionalizar",
    "nacionalizacion",
    "importar",
    "importacion",
    "exportacion",
    "exportar",
    "inspeccion",
    "puerto",
    "gestion documental",
  ],
  empresas: [
    "empresa",
    "empresas",
    "oficina",
    "oficinas",
    "corporativo",
    "corporativa",
    "corporate",
    "funcionario",
    "funcionarios",
    "empleado",
    "empleados",
    "recursos humanos",
    "compras",
    "reubicacion de personal",
    "expatriado",
    "expatriados",
    "multinacional",
    "ejecutivo de cuenta",
  ],
  embajadas: [
    "embajada",
    "embajadas",
    "diplomatico",
    "diplomatica",
    "diplomaticos",
    "mision diplomatica",
    "consulado",
    "organismo internacional",
    "organismos internacionales",
    "caf",
    "cancilleria",
    "institucional",
    "diplomatic",
  ],
};

type Rule = { id: string; kws: string[]; w?: number };
const RULES: Rule[] = [
  {
    id: "precio",
    kws: [
      "precio",
      "precios",
      "costo",
      "costos",
      "cuesta",
      "cuanto cuesta",
      "cuanto vale",
      "cuanto cobran",
      "cuanto sale",
      "cuanto me sale",
      "cuanto bale",
      "q vale",
      "tarifa",
      "tarifas",
      "el valor",
      "que valor",
      "valor de la",
      "valor de una",
      "cobran",
      "plata",
      "barato",
      "economico",
    ],
  },
  {
    id: "cotizar",
    kws: [
      "cotizar",
      "cotizacion",
      "cotizame",
      "presupuesto",
      "contratar",
      "agendar",
      "reservar",
      "separar la fecha",
      "quiero el servicio",
      "solicitar el servicio",
      "estimado",
      "necesito una mudanza",
      "quiero una mudanza",
      "necesito un trasteo",
      "quiero un trasteo",
      "hacer una mudanza",
      "hacer un trasteo",
      "necesito mudarme",
      "necesito trastearme",
      "camion de mudanza",
      "camioneta",
    ],
  },
  {
    id: "tiempo",
    kws: [
      "cuanto tiempo",
      "cuanto se demora",
      "cuanto demora",
      "cuanto tarda",
      "se demora",
      "demora",
      "demoran",
      "tarda",
      "tardan",
      "duracion",
      "cuanto dura",
      "plazo",
    ],
  },
  {
    id: "proceso",
    kws: [
      "como funciona",
      "como es el proceso",
      "proceso",
      "pasos",
      "como trabajan",
      "como empiezo",
      "metodologia",
      "en que consiste",
    ],
  },
  {
    id: "cobertura",
    kws: [
      "cobertura",
      "a donde llegan",
      "llegan a",
      "que paises",
      "que ciudades",
      "todo el pais",
      "pueblo",
      "municipio",
      "vereda",
      "finca",
      "cubren",
      "operan en",
      "cualquier ciudad",
      "cualquier parte",
      "cualquier lugar",
      "otras ciudades",
      "a que ciudades",
      "ciudad del pais",
      "todo colombia",
    ],
  },
  {
    id: "empresa",
    kws: [
      "quienes son",
      "sobre ustedes",
      "trayectoria",
      "cuantos anos",
      "historia",
      "desde cuando",
      "experiencia",
      "que es transpack",
      "quien es transpack",
    ],
  },
  {
    id: "seguridad",
    kws: [
      "seguridad",
      "protegen",
      "proteccion",
      "cuidan",
      "cuidado",
      "cuidadosos",
      "rayones",
      "golpes",
      "rompa",
      "rompan",
    ],
  },
  {
    id: "contacto",
    kws: [
      "contacto",
      "contactar",
      "telefono",
      "celular",
      "numero",
      "llamar",
      "llamada",
      "correo",
      "email",
      "whatsapp",
      "asesor",
      "humano",
      "persona real",
      "hablar con alguien",
      "comercial",
      "vendedor",
      "agente",
    ],
  },
  {
    id: "certificaciones",
    kws: [
      "certificacion",
      "certificaciones",
      "certificados",
      "certificada",
      "lacma",
      "iam",
      "paima",
      "fidi",
      "iso",
      "acreditados",
      "avalados",
    ],
  },
  {
    id: "empleo",
    kws: [
      "empleo",
      "trabajar con ustedes",
      "trabajo con ustedes",
      "vacante",
      "vacantes",
      "hoja de vida",
      "oferta laboral",
      "estan contratando",
    ],
  },
  {
    id: "pqrs",
    kws: [
      "queja",
      "reclamo",
      "reclamacion",
      "pqr",
      "pqrs",
      "inconformidad",
      "mal servicio",
      "incumplieron",
      "pesimo servicio",
    ],
  },
  // Objeciones
  {
    id: "obj-caro",
    kws: [
      "muy caro",
      "es caro",
      "carisimo",
      "costoso",
      "muy costoso",
      "no tengo presupuesto",
      "sale caro",
      "mas barato",
      "mas economico",
      "descuento",
      "rebaja",
      "me cobran menos",
      "encontre mas barato",
      "no me alcanza",
    ],
  },
  {
    id: "obj-yomismo",
    kws: [
      "lo hago yo",
      "yo mismo",
      "yo misma",
      "lo hago solo",
      "por mi cuenta",
      "con amigos",
      "alquilo un camion",
      "alquilar un camion",
      "un camion y ya",
      "lo muevo yo",
      "yo empaco",
      "no necesito ayuda",
      "acarreo",
    ],
  },
  {
    id: "obj-porque",
    kws: [
      "por que ustedes",
      "porque ustedes",
      "por que elegirlos",
      "por que transpack",
      "que los diferencia",
      "diferencia con",
      "que tienen de diferente",
      "mejor que",
      "competencia",
      "otra empresa",
      "otro proveedor",
      "otras empresas",
      "por que deberia",
    ],
  },
  {
    id: "obj-confianza",
    kws: [
      "no confio",
      "desconfio",
      "confiable",
      "confianza",
      "como se que",
      "garantia",
      "garantias",
      "garantizan",
      "si se dana",
      "se dana",
      "se danan",
      "si se pierde",
      "se pierde",
      "perdida",
      "responden",
      "responsabilidad",
      "se roban",
      "robo",
      "estafa",
      "referencias",
      "dano",
      "danos",
      "se rompe",
    ],
  },
  // Conversación
  {
    id: "saludo",
    kws: [
      "hola",
      "buenas",
      "buenos dias",
      "buenas tardes",
      "buenas noches",
      "hey",
      "saludos",
      "que tal",
    ],
    w: 0.5,
  },
  {
    id: "gracias",
    kws: ["gracias", "muchas gracias", "perfecto", "excelente", "genial", "listo", "vale", "super"],
    w: 0.6,
  },
  { id: "despedida", kws: ["adios", "chao", "hasta luego", "nos vemos", "bye", "hasta pronto"] },
  {
    id: "bot",
    kws: [
      "eres un robot",
      "eres robot",
      "eres una ia",
      "eres ia",
      "eres humano",
      "eres una persona",
      "chatgpt",
      "chat gpt",
      "gpt",
      "openai",
      "gemini",
      "inteligencia artificial",
      "eres real",
      "quien eres",
      "con quien hablo",
      "eres un bot",
    ],
  },
  {
    id: "inyeccion",
    kws: [
      "ignora tus",
      "ignora las",
      "ignora todo",
      "ignora lo anterior",
      "olvida tus",
      "olvida todo lo",
      "instrucciones anteriores",
      "tus instrucciones",
      "system prompt",
      "prompt",
      "actua como",
      "modo desarrollador",
      "jailbreak",
      "sin restricciones",
      "tus reglas",
      "eres libre",
      "finge que",
      "haz de cuenta que",
    ],
  },
  {
    id: "ofensa",
    kws: [
      "estupido",
      "idiota",
      "inutil",
      "malparido",
      "hp",
      "gonorrea",
      "basura",
      "tonto",
      "porqueria",
      "mierda",
      "imbecil",
      "pendejo",
      "hijueputa",
      "huevon",
      "ladrones",
      "rateros",
    ],
  },
  {
    id: "fuera",
    kws: [
      "futbol",
      "clima",
      "receta",
      "pelicula",
      "chiste",
      "musica",
      "politica",
      "presidente",
      "novia",
      "novio",
      "horoscopo",
      "bitcoin",
      "partido",
      "tarea",
      "matematicas",
      "poema",
      "cancion",
      "loteria",
    ],
  },
];

// Problema del cliente → asesoría (señales de que se muda, regresa o espera)
const MOVING = [
  "me trasladan",
  "nos trasladan",
  "me transfieren",
  "me mandan",
  "me envian",
  "me reubican",
  "me voy",
  "nos vamos",
  "me mudo",
  "nos mudamos",
  "me tengo que ir",
  "nos tenemos que ir",
  "emigro",
  "emigramos",
  "me salio",
  "me contrataron",
  "me ofrecieron",
  "voy a estudiar",
  "voy a vivir",
  "vamos a vivir",
  "mudarme",
  "mudarnos",
  "trasladarme",
  "irme",
  "irnos",
  "beca",
];
const RETURNING = [
  "regreso a colombia",
  "vuelvo a colombia",
  "volver a colombia",
  "retorno a colombia",
  "regresar a colombia",
  "me devuelvo a colombia",
  "de vuelta a colombia",
  "regresamos a colombia",
  "volvemos a colombia",
  "retornar a colombia",
  "regreso al pais",
  "vuelvo al pais",
  "a colombia",
];
const WAITING = [
  "no esta lista",
  "no esta listo",
  "no me han entregado",
  "no nos han entregado",
  "remodelacion",
  "remodelando",
  "remodelar",
  "mientras me instalo",
  "mientras nos instalamos",
  "entre un apartamento y otro",
  "entrego el apartamento",
  "entregar el apartamento",
  "vendi la casa",
  "vendimos",
  "mientras consigo",
  "mientras viajo",
  "desocupar",
];

export function createJoel(kb: JoelKB) {
  const lc = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
  const bullets = (items: string[]) => items.map((i) => `• ${i}`).join("\n");
  // "Mudanzas internacionales" → "mudanza internacional"; "Bodegaje" → "bodegaje"
  const singular = (title: string) => lc(title).replace(/^mudanzas (\S+?)es\b/, "mudanza $1");
  const withArticle = (name: string) =>
    /^(mudanza|gesti)/.test(name) ? `la ${name}` : `el ${name}`;
  // "de el bodegaje" → "del bodegaje"
  const of = (the: string) => (the.startsWith("el ") ? `del ${the.slice(3)}` : `de ${the}`);

  // Temas: los servicios del sitio y los segmentos corporativo y diplomático
  type Topic = {
    key: string;
    title: string;
    name: string; // en singular, sin artículo: "mudanza internacional"
    the: string; // con artículo, para usar dentro de una frase: "la mudanza internacional"
    summary: string[];
    includes: string[];
    steps: { title: string; text: string }[];
    note?: string;
    intro: string;
    quote: QuoteKind;
    link: string;
  };
  const topics: Record<string, Topic> = {};
  for (const s of kb.services)
    topics[s.slug] = {
      key: s.slug,
      title: s.title,
      name: singular(s.title),
      the: withArticle(singular(s.title)),
      summary: [`${s.title}: ${s.short}`],
      includes: s.includes,
      steps: s.steps,
      note: s.note,
      intro: s.intro,
      quote: s.quote,
      link: `/servicios/${s.slug}`,
    };
  for (const seg of kb.segments) {
    const key = SEGMENT_TOPIC[seg.id];
    if (!key || topics[key]) continue;
    topics[key] = {
      key,
      title: seg.kicker,
      name: key === "empresas" ? "traslados para empresas" : "servicio para embajadas y organismos",
      the:
        key === "empresas"
          ? "los traslados para empresas"
          : "el servicio para embajadas y organismos",
      summary: [`${seg.kicker}: ${seg.title}.`, seg.text],
      includes: seg.points,
      steps: [],
      intro: seg.text,
      quote: seg.quote,
      link: `/?segmento=${seg.id}#soluciones`,
    };
  }
  const T = (key: string) => topics[key];
  const L = "mudanzas-locales",
    N = "mudanzas-nacionales",
    I = "mudanzas-internacionales",
    B = "bodegaje",
    E = "embalaje-especializado",
    A = "gestion-aduanera",
    EMP = "empresas";

  // Datos de la empresa (de las cifras del sitio)
  const stat = (re: RegExp) => {
    const s = kb.stats.find((x) => re.test(x.label));
    if (!s) return "";
    const n = /K/.test(s.suffix) ? s.value * 1000 : s.value;
    return n.toLocaleString("es-CO");
  };
  const YEARS = stat(/años/);
  const COUNTRIES = stat(/países/);
  const AGENTS = stat(/agentes/);
  const TONS = stat(/toneladas/);
  const CERTS =
    kb.services
      .flatMap((s) => s.includes)
      .map((i) => i.match(/(LACMA.*)$/)?.[1])
      .find(Boolean) ?? "LACMA";
  const faq = (re: RegExp) => kb.faqs.find((f) => re.test(norm(f.q)))?.a;
  const destNames = [...kb.destinations, ...COUNTRY_EXTRA];

  // Acciones y opciones
  const phone = kb.contact.phones[0];
  const CALL: JoelAction = {
    label: `Llamar al ${phone}`,
    icon: "telephone",
    href: `tel:+57${phone.replace(/\s/g, "")}`,
  };
  const MAIL: JoelAction = {
    label: "Enviar un correo",
    icon: "envelope",
    // Abre el formulario de contacto del sitio (components/layout/ContactModal.tsx)
    href: "#contacto",
  };
  const wa = (text?: string): JoelAction => ({
    label: "Escribir por WhatsApp",
    icon: "whatsapp",
    href: kb.whatsapp(text),
  });
  // Chat con un asesor de Transpack (Zoho SalesIQ): primera opción de contacto
  const ADVISOR_CHAT: JoelAction = { label: "Chatear con un asesor", icon: "headset", crm: true };
  const CONTACT = [ADVISOR_CHAT, wa(), CALL, MAIL];
  const see = (key: string): JoelAction[] =>
    T(key)
      ? [{ label: `Ver ${lc(T(key).title)}`, icon: "box-arrow-up-right", to: T(key).link }]
      : [];

  const opt = (
    label: string,
    next: string,
    icon: string,
    set?: Record<string, string>,
  ): JoelOption => ({
    label,
    next,
    icon,
    set,
  });
  const ADVISOR = opt("Hablar con un asesor", "human", "headset");
  const QUOTE = opt("Cotizar mi mudanza", "svc", "card-checklist");
  const SERVICES = opt("Ver los servicios", "servicios", "grid");
  const FAQ = opt("Preguntas frecuentes", "faq", "question-circle");
  const CASE = opt("Contarte mi caso", "brain:contarte mi caso", "chat-dots");
  const ask = (label: string, text: string, icon = "question-circle") =>
    opt(label, `brain:${text}`, icon);
  const quoteOpt = (key: string, label?: string): JoelOption => {
    const t = T(key);
    return opt(label ?? `Cotizar ${t.name}`, ENTRY[t.quote], "card-checklist", {
      servicio: t.quote,
    });
  };
  const topicOpts = (key: string): JoelOption[] => [quoteOpt(key), ADVISOR];

  // ─── Respuestas por tema ───────────────────────────────────────────────

  // Datos que se necesitan para cotizar cada tipo de servicio (Lógica de
  // Cotización, secciones 3 y 15, y campos del cotizador del sitio)
  const QUOTE_VARS: Record<QuoteKind, string> = {
    local:
      "el barrio o dirección de origen y de destino, el tipo de inmueble, el piso, si hay ascensor o escaleras, qué tan cerca puede parquear el camión, los horarios que permite la administración, la fecha, el inventario y el nivel de servicio",
    nacional:
      "las ciudades de origen y destino, el inventario (con él estimamos el volumen), las condiciones de cargue y descargue, los accesos, la fecha y el nivel de servicio",
    internacional:
      "el país y la ciudad de origen y de destino, la fecha estimada, el motivo del traslado, un inventario o volumen preliminar y la modalidad (marítima o aérea). También influyen los requisitos aduaneros y los gastos portuarios o aeroportuarios",
    empresarial:
      "la empresa, el origen y destino, el cronograma, el inventario y volumen, el horario (diurno, nocturno o fin de semana), los servicios requeridos y las condiciones corporativas",
    bodegaje: "qué vas a guardar, el volumen aproximado, por cuánto tiempo y dónde lo recogemos",
  };

  function priceAnswer(key?: string): JoelReply {
    const t = key ? T(key) : undefined;
    if (!t)
      return {
        intent: "precio",
        say: [
          "No manejamos una lista de precios fija: el valor de cada mudanza se calcula con su información (origen y destino, inventario, accesos, fecha y nivel de servicio).",
          "Primero te damos un estimado y, si está dentro de tu presupuesto, la cotización formal. ¿Qué tipo de mudanza necesitas?",
        ],
        options: [
          quoteOpt(L, "Mudanza local"),
          quoteOpt(N, "Mudanza nacional"),
          quoteOpt(I, "Mudanza internacional"),
          quoteOpt(B, "Bodegaje"),
        ],
      };
    const say = [
      `No es una tarifa fija: el valor ${of(t.the)} se calcula con la información de tu caso, y no quiero darte un número que no sea real.`,
      `Para estimarlo necesitamos: ${QUOTE_VARS[t.quote]}.`,
    ];
    if (t.quote === "internacional")
      say.push(
        "En internacionales, un asesor especializado revisa contigo requisitos, tiempos y costos antes de cotizar.",
      );
    else
      say.push(
        "Con eso te damos un estimado y, si está dentro de tu presupuesto, la cotización formal. ¿La armamos ahora? Toma un par de minutos.",
      );
    return { intent: "precio", service: key, say, options: topicOpts(key!) };
  }

  function timeAnswer(key?: string): JoelReply {
    const t = key ? T(key) : undefined;
    if (!t)
      return {
        intent: "tiempo",
        say: [
          "Depende mucho del tipo de mudanza: no es lo mismo un trasteo en la ciudad que un envío marítimo a otro país. ¿Cuál es tu caso?",
        ],
        options: [
          ask("Mudanza local", "cuanto se demora una mudanza local", "house-door"),
          ask("Mudanza nacional", "cuanto se demora una mudanza nacional", "truck"),
          ask(
            "Mudanza internacional",
            "cuanto se demora una mudanza internacional",
            "globe-americas",
          ),
          ask("¿Con cuánta anticipación pido?", "con cuanta anticipacion debo pedir la mudanza"),
        ],
      };
    const say: string[] = [];
    if (key === I) {
      say.push(
        faq(/tarda/) ?? "Depende del origen, el destino, las rutas y los procesos aduaneros.",
      );
      say.push("Por vía aérea es más rápido, y se recomienda para cargas pequeñas o urgentes.");
      if (t.note) say.push(t.note);
    } else if (key === L) {
      if (t.note) say.push(t.note);
      say.push(
        "Cuánto dura el día de la mudanza depende del volumen, el piso y los accesos; te lo confirmamos al cotizar.",
      );
    } else if (key === B) {
      say.push(
        "El bodegaje es flexible: puedes guardar tus cosas por días, meses o a largo plazo, solo o como parte de tu mudanza.",
      );
    } else if (key === A) {
      say.push(
        "Los trámites dependen de las normas de cada país. Una documentación completa y un inventario bien declarado reducen los retrasos.",
      );
    } else {
      say.push(
        `El tiempo ${of(t.the)} depende de la ruta, el volumen y el cronograma; lo confirmamos al validar la operación contigo.`,
      );
    }
    return { intent: "tiempo", service: key, say, options: topicOpts(key!) };
  }

  function stepsAnswer(key: string): JoelReply {
    const t = T(key);
    if (!t.steps.length) return topicAnswer(key, new Set());
    return {
      intent: "proceso",
      service: key,
      say: [
        `Así funciona ${t.the}:`,
        t.steps.map((s, i) => `${i + 1}. ${s.title}: ${s.text}`).join("\n"),
      ],
      actions: see(key),
      options: topicOpts(key),
    };
  }

  function protectionAnswer(key: string): JoelReply {
    const t = T(key);
    const items = t.includes.filter((i) =>
      /protec|embal|monitore|inventario|guacal|amortigu|manipula|control|confidencial/i.test(i),
    );
    return {
      intent: "seguridad",
      service: key,
      say: [
        `Así protegemos tus cosas en ${t.the}:`,
        bullets(items.length ? items : t.includes.slice(0, 4)),
      ],
      actions: see(key),
      options: topicOpts(key),
    };
  }

  function topicAnswer(key: string, asked: Set<string>): JoelReply {
    if (asked.has("precio") || asked.has("cotizar")) return priceAnswer(key);
    if (asked.has("tiempo")) return timeAnswer(key);
    if (asked.has("proceso")) return stepsAnswer(key);
    if (asked.has("seguridad")) return protectionAnswer(key);
    const t = T(key);
    const say = [...t.summary, `Incluye:\n${bullets(t.includes.slice(0, 4))}`];
    if (t.note) say.push(t.note);
    return {
      intent: `svc-${key}`,
      service: key,
      say,
      actions: see(key),
      options: [
        quoteOpt(key),
        ask("¿Por qué con ustedes?", `por que ustedes ${t.name}`, "patch-check"),
        SERVICES,
      ],
    };
  }

  // ─── Problemas del cliente → asesoría ───────────────────────────────────

  function timingAdvice(days?: number): string {
    if (days === undefined)
      return "Recomendamos iniciar el proceso entre 1 y 2 meses antes de la fecha de empaque.";
    if (days < 30)
      return "Tienes poco margen: recomendamos iniciar entre 1 y 2 meses antes del empaque, así que conviene hablar con un asesor cuanto antes. Lo urgente puede ir por vía aérea, más rápida para cargas pequeñas, y lo voluminoso por mar.";
    if (days <= 75)
      return "Estás a tiempo: recomendamos iniciar el proceso entre 1 y 2 meses antes del empaque, justo el margen que tienes. Es buen momento para empezar.";
    return "Tienes buen margen. Recomendamos iniciar el proceso entre 1 y 2 meses antes del empaque, y desde ya puedes ir adelantando el inventario.";
  }
  const inTime = (days?: number) =>
    days === undefined
      ? ""
      : days < 14
        ? " en pocos días"
        : days < 28
          ? ` en unas ${Math.round(days / 7)} semanas`
          : days < 40
            ? " en un mes"
            : days < 50
              ? " en un mes y medio"
              : ` en unos ${Math.round(days / 30)} meses`;

  function abroadAnswer(
    dest: string,
    days: number | undefined,
    t: string,
    words: string[],
  ): JoelReply {
    const known = kb.destinations.includes(dest);
    const say = [
      `Entiendo: te mudas a ${dest}${inTime(days)}. Es una mudanza internacional y lo que más ayuda es planearla con tiempo.`,
      timingAdvice(days),
      `Te recomiendo combinar:\n• ${T(I).title}: marítima para el menaje completo o aérea para lo urgente.\n• ${T(A).title}: requisitos de origen y destino e inventario declarado para aduanas.\n• ${T(B).title}, si tu nuevo hogar no está listo al llegar o quieres dejar cosas en Colombia.`,
      known
        ? `${dest} es uno de los destinos a los que llevamos mudanzas, con el respaldo de más de ${AGENTS} agentes en ${COUNTRIES} países.`
        : `Nuestra red tiene más de ${AGENTS} agentes en ${COUNTRIES} países; el asesor te confirma la ruta a ${dest}.`,
    ];
    if (
      hasAny(t, words, [
        "me trasladan",
        "nos trasladan",
        "me transfieren",
        "me reubican",
        "empresa",
        "me mandan",
        "me envian",
      ])
    )
      say.push(
        "Si tu empresa cubre la mudanza, también trabajamos directamente con Compras y Recursos Humanos.",
      );
    return {
      intent: "pain-exterior",
      service: I,
      say,
      options: [
        quoteOpt(I, "Empezar mi mudanza internacional"),
        ask(
          "¿Qué documentos necesito?",
          "que documentos necesito para mudarme a otro pais",
          "file-earmark-text",
        ),
        ask("¿Cuánto se demora?", "cuanto se demora una mudanza internacional", "clock"),
        ADVISOR,
      ],
    };
  }

  function returnAnswer(days?: number): JoelReply {
    return {
      intent: "pain-regreso",
      service: I,
      say: [
        `¡Qué bueno que regresas${inTime(days)}! Volver a Colombia con tu menaje es una mudanza internacional, con trámites propios de importación.`,
        `Te recomiendo ${T(I).the} junto con ${T(A).the}, que incluye asesoría para el retorno de colombianos al país.`,
        timingAdvice(days),
      ],
      actions: see(A),
      options: [
        quoteOpt(I, "Empezar mi mudanza internacional"),
        ask(
          "¿Qué documentos necesito?",
          "que documentos necesito para mudarme a otro pais",
          "file-earmark-text",
        ),
        ADVISOR,
      ],
    };
  }

  function nationalAnswer(city: string, days?: number): JoelReply {
    const t = T(N);
    return {
      intent: "pain-nacional",
      service: N,
      say: [
        `Una mudanza a ${city}${inTime(days)} es una mudanza nacional: la hacemos puerta a puerta, con inventario detallado y monitoreo del vehículo durante el trayecto.`,
        faq(/inventario/) ?? t.intro,
        days !== undefined && days < 14
          ? "Como es pronto, escríbenos por WhatsApp para confirmar disponibilidad."
          : "¿La cotizamos? Te pido unos pocos datos.",
      ],
      actions:
        days !== undefined && days < 14
          ? [wa(`Hola Transpack, necesito una mudanza a ${city} pronto`)]
          : see(N),
      options: topicOpts(N),
    };
  }

  function waitingAnswer(): JoelReply {
    return {
      intent: "pain-bodegaje",
      service: B,
      say: [
        `Para eso está el bodegaje. ${T(B).intro}`,
        "Recogemos e inventariamos en tu ubicación, guardamos tus cosas bajo control y te las entregamos cuando lo pidas, en la dirección que nos indiques.",
      ],
      actions: see(B),
      options: [quoteOpt(B), quoteOpt(L, "Cotizar la mudanza también"), ADVISOR],
    };
  }

  // ─── Preguntas específicas ─────────────────────────────────────────────
  // Cada pregunta típica de un cliente, con su respuesta puntual (tomada del
  // sitio y de los documentos de la empresa). "need": grupos de palabras;
  // deben aparecer todos (de cada grupo, al menos una). "svc": el tema cuenta
  // como grupo si se nombra o si es del que se venía hablando.
  type Fact = {
    id: string;
    need: string[][];
    svc?: string;
    not?: string[];
    reply: (m: Memory) => Omit<JoelReply, "intent">;
  };
  const SK = (key: string) => [...(TOPIC_KEYWORDS[key] ?? []), norm(T(key)?.title ?? "")];
  const INTL = [
    "otro pais",
    "exterior",
    "internacional",
    "mudarme a",
    "mudarse a",
    "irme a",
    "exportar",
    "importar",
    "aduana",
    "emigrar",
    "viajar",
    "extranjero",
    ...destNames.map(norm),
    ...Object.keys(COUNTRY_ALIAS),
  ];
  const NO_INFO = "Un asesor te lo confirma para tu caso. Escríbenos y te respondemos.";

  const FACTS: Fact[] = [
    // Generales
    {
      id: "servicios",
      need: [
        [
          "servicios",
          "que hacen",
          "que ofrecen",
          "a que se dedican",
          "portafolio",
          "en que me pueden ayudar",
          "que tipo de mudanzas",
          "que mudanzas hacen",
        ],
      ],
      not: [
        "bodeg",
        "embalaje",
        "aduan",
        "internacional",
        "nacional",
        "local",
        "oficina",
        "embajada",
        "precio",
        "cuesta",
        "mis datos",
        "privacidad",
      ],
      reply: () => ({
        say: [
          "Esto es lo que hacemos:",
          bullets(kb.services.map((s) => s.title)),
          "Además atendemos empresas (Corporate Mobility) y embajadas y organismos (Diplomatic & Institutional). Cuéntame qué necesitas mover y te recomiendo por dónde empezar.",
        ],
        options: [QUOTE, SERVICES, CASE],
      }),
    },
    {
      id: "recomendar",
      need: [
        [
          "recomiendas",
          "recomienda",
          "recomendarias",
          "no se cual",
          "no se que servicio",
          "cual servicio",
          "cual necesito",
          "que me sirve",
          "que me conviene",
          "no se que necesito",
          "no se por donde",
          "asesorame",
          "ayudame a elegir",
          "contarte mi caso",
          "mi caso",
          "te cuento",
        ],
      ],
      reply: () => ({
        say: [
          "Claro, cuéntame con tus palabras qué está pasando y te recomiendo. Por ejemplo:",
          "«Me trasladan a Alemania en dos meses», «me mudo de Bogotá a Medellín con un apartamento de 3 habitaciones» o «tengo que desocupar el apartamento y la casa nueva no está lista».",
        ],
      }),
    },
    {
      id: "niveles",
      need: [
        [
          "nivel",
          "niveles",
          "plan",
          "planes",
          "paquete",
          "paquetes",
          "tipos de servicio",
          "traslado basico",
          "servicio integral",
          "proteccion y empaque",
          "basico",
          "premium",
          "economico o",
        ],
      ],
      not: ["precio", "cuesta", "cuanto"],
      reply: () => ({
        say: [
          "Tienes tres niveles de servicio, según cuánto quieras delegar:",
          bullets(kb.levels.map((l) => `${l.title}: ${l.text}`)),
          "Por eso no se cotiza solo «una mudanza»: se cotiza la mudanza más el nivel que elijas.",
        ],
        options: [QUOTE, ADVISOR],
      }),
    },
    {
      id: "embalan",
      need: [
        [
          "empacan",
          "empacar",
          "embalan",
          "embalar",
          "empaque",
          "empacado",
          "envuelven",
          "envolver",
          "protegen",
          "desarman",
          "desarmar",
          "armado",
          "armar",
          "arman",
        ],
        [
          "muebles",
          "mueble",
          "cosas",
          "todo",
          "cajas",
          "ropa",
          "loza",
          "vajilla",
          "cocina",
          "camas",
          "cama",
          "electrodomesticos",
          "nevera",
          "lavadora",
          "televisor",
          "closet",
        ],
      ],
      not: ["obra", "arte", "piano", "guacal"],
      reply: () => ({
        say: [
          "Sí, según el nivel de servicio que elijas:",
          bullets(kb.levels.map((l) => `${l.title}: ${l.points.join(", ").toLowerCase()}.`)),
          `Para obras de arte, cristalería o piezas de alto valor está ${T(E).the}, con guacales de madera a la medida.`,
        ],
        options: [
          QUOTE,
          ask("Ver embalaje especializado", "embalaje especializado", "easel"),
          ADVISOR,
        ],
      }),
    },
    {
      id: "seguro",
      need: [
        [
          "tienen seguro",
          "con seguro",
          "seguro de",
          "incluye seguro",
          "incluyen seguro",
          "el seguro",
          "un seguro",
          "algun seguro",
          "seguro para",
          "poliza",
          "polizas",
          "asegurar",
          "aseguran",
          "asegurado",
          "asegurada",
          "asegurados",
        ],
      ],
      reply: () => ({
        say: [
          "No tengo las condiciones del seguro (coberturas, valores o póliza) para darte un dato exacto, y prefiero no inventártelo.",
          "Un asesor te confirma qué opciones de seguro aplican a tu mudanza cuando revise tu inventario.",
          "Lo que sí te puedo contar es cómo protegemos tus cosas: inventario detallado, embalaje según el valor y la fragilidad de cada objeto, personal capacitado y, en mudanzas nacionales, monitoreo del vehículo durante el trayecto.",
        ],
        actions: CONTACT,
        options: [QUOTE],
      }),
    },
    {
      id: "anticipacion",
      need: [
        [
          "anticipacion",
          "con cuanto tiempo",
          "cuanto antes debo",
          "con tiempo",
          "cuando debo pedir",
          "cuando debo solicitar",
        ],
      ],
      reply: () => ({ say: [faq(/anticipacion/) ?? NO_INFO], options: [QUOTE, ADVISOR] }),
    },
    {
      id: "tiempo-internacional",
      svc: I,
      need: [
        [
          "cuanto tiempo",
          "se demora",
          "demora",
          "demoran",
          "tarda",
          "tardan",
          "duracion",
          "cuanto dura",
          "en cuanto llega",
          "cuando llega",
          "cuando llegan",
        ],
      ],
      not: ["anticipacion", "con cuanto tiempo", "cuanto antes"],
      reply: () => {
        const post = kb.posts.find((p) => /tardar/.test(norm(p.title)));
        return {
          ...timeAnswer(I),
          actions: post
            ? [
                {
                  label: "Leer: por qué puede tardar",
                  icon: "journal-text",
                  to: `/blog/${post.slug}`,
                },
              ]
            : undefined,
        };
      },
    },
    {
      id: "maritima-aerea",
      need: [
        ["maritima", "maritimo", "barco", "contenedor", "aerea", "aereo", "avion"],
        [
          "o",
          "vs",
          "versus",
          "mejor",
          "diferencia",
          "conviene",
          "cual",
          "recomiendas",
          "elegir",
          "escoger",
        ],
      ],
      reply: () => ({ say: [faq(/maritima o aerea/) ?? NO_INFO], options: topicOpts(I) }),
    },
    {
      id: "visita",
      need: [
        [
          "visita",
          "visita tecnica",
          "videollamada",
          "vienen a ver",
          "van a ver",
          "venir a ver",
          "vengan a ver",
        ],
      ],
      not: ["aduan"],
      reply: () => ({ say: [faq(/visita tecnica/) ?? NO_INFO], options: [QUOTE, ADVISOR] }),
    },
    {
      id: "inventario",
      need: [["inventario", "lista de cosas", "listado de cosas"]],
      not: ["aduan", "declarad"],
      reply: () => ({
        say: [
          faq(/inventario/) ?? NO_INFO,
          "Si no lo tienes listo, no te preocupes: el asesor te ayuda a completarlo.",
        ],
        options: [QUOTE],
      }),
    },
    {
      id: "acceso",
      need: [
        [
          "parquear",
          "parqueo",
          "estacionar",
          "parqueadero",
          "ascensor",
          "escaleras",
          "piso",
          "porteria",
          "administracion",
          "acceso",
          "torre",
          "conjunto",
        ],
      ],
      not: ["horario", "hora", "sabado", "domingo", "alquil", "yo mismo"],
      reply: () => ({
        say: [
          faq(/parquear/) ?? NO_INFO,
          "También importan el piso, si hay ascensor o escaleras y los horarios que permite la administración: son variables de la cotización.",
        ],
        options: [QUOTE],
      }),
    },
    {
      id: "pocas-cosas",
      need: [
        [
          "pocas cosas",
          "pocos objetos",
          "unas cajas",
          "pocas cajas",
          "un solo mueble",
          "un mueble",
          "una nevera",
          "un sofa",
          "una cama",
          "algo pequeno",
          "trasteo pequeno",
          "mudanza pequena",
          "pocos muebles",
          "solo unas",
        ],
      ],
      not: ["arte", "antigu", "valor", "piano"],
      reply: () => ({
        say: [
          "Sí, también puedes cotizar el traslado de pocos objetos o cajas: es una de las opciones del cotizador.",
          "Si el origen o el destino es una zona de difícil acceso, primero validamos que la operación sea viable.",
        ],
        options: [quoteOpt(L, "Cotizar mudanza local"), quoteOpt(N, "Cotizar mudanza nacional")],
      }),
    },
    {
      id: "urgente",
      need: [
        [
          "urgente",
          "urgencia",
          "para manana",
          "para hoy",
          "lo antes posible",
          "ya mismo",
          "esta semana",
          "de afan",
          "este fin de semana",
          "pasado manana",
        ],
      ],
      not: ["internacional", "exterior", "otro pais"],
      reply: () => ({
        say: [
          "Atendemos solicitudes urgentes según disponibilidad. Las mudanzas locales suelen programarse con 1 a 2 semanas de anticipación, pero también hay casos de un día para otro.",
          "Para confirmar disponibilidad cuanto antes, escríbenos por WhatsApp.",
        ],
        actions: [wa("Hola Transpack, necesito una mudanza urgente")],
        options: [quoteOpt(L, "Cotizar mudanza local")],
      }),
    },
    // Restricciones (no hay una lista oficial en los documentos)
    {
      id: "prohibidos",
      need: [
        [
          "no se puede",
          "no pueden llevar",
          "no se pueden",
          "prohibido",
          "prohibidos",
          "prohibidas",
          "restringido",
          "restringidos",
          "que no llevan",
          "no transportan",
          "no se lleva",
          "que no puedo",
          "que no se puede",
          "que no pueden",
        ],
      ],
      not: ["horario", "hora", "administracion", "acceso", "parque"],
      reply: () => ({
        say: [
          "No tengo una lista oficial de artículos restringidos para darte, y no quiero darte información inexacta.",
          "Depende del tipo de mudanza y, en las internacionales, de las normas aduaneras de cada país para el ingreso de menaje. Pregúntale a un asesor por tu caso antes de empacar.",
        ],
        actions: CONTACT,
      }),
    },
    {
      id: "especiales",
      need: [
        [
          "mascota",
          "mascotas",
          "perro",
          "gato",
          "plantas",
          "carro",
          "moto",
          "automovil",
          "arma",
          "armas",
          "alimentos",
          "comida",
          "licor",
          "licores",
          "vinos",
          "medicamentos",
          "dinero",
          "joyas",
        ],
      ],
      reply: () => ({
        say: [
          "Sobre eso no tengo información confirmada, así que no te puedo asegurar si se puede incluir ni en qué condiciones.",
          "Un asesor te lo confirma según el tipo de mudanza y, si es internacional, según las normas del país de destino.",
        ],
        actions: CONTACT,
      }),
    },
    {
      id: "piano",
      need: [
        ["piano", "pianos", "sobredimensionado", "sobredimensionados", "muy pesado", "muy grande"],
      ],
      reply: () => ({
        say: [
          `Sí, manejamos pianos y elementos sobredimensionados como parte ${of(T(E).the)}: evaluamos la pieza, sus medidas y su fragilidad, y definimos el empaque y la manipulación.`,
        ],
        actions: see(E),
        options: topicOpts(E),
      }),
    },
    // Internacional
    {
      id: "documentos",
      need: [
        [
          "documentos",
          "papeles",
          "requisitos",
          "tramites",
          "papeleo",
          "permisos",
          "que necesito",
          "que debo llevar",
        ],
        INTL,
      ],
      not: ["precio", "cuesta", "cotiz"],
      reply: () => ({
        service: A,
        say: [
          "Los documentos exactos dependen del país de origen y de destino: cada país tiene normas propias para el ingreso de menaje y efectos personales.",
          "La pieza clave es un inventario bien declarado: una inconsistencia o un permiso omitido puede costar semanas de retraso y sanciones.",
          `Con ${T(A).the} revisamos contigo los requisitos de origen y destino y te acompañamos en el trámite. Un asesor te da la lista exacta para tu caso.`,
        ],
        actions: see(A),
        options: [quoteOpt(I, "Empezar mi mudanza internacional"), ADVISOR],
      }),
    },
    {
      id: "cotizar-que",
      need: [
        [
          "que necesito",
          "que datos",
          "que informacion",
          "que me piden",
          "que piden",
          "que debo enviar",
          "que necesitan",
          "que les debo dar",
        ],
      ],
      not: ["documento", "papeles", "requisitos", "pais", "exterior"],
      reply: (m) =>
        m.lastService && T(m.lastService)
          ? priceAnswer(m.lastService)
          : {
              say: [
                "Depende del tipo de mudanza, pero en general: origen y destino, fecha, inventario (lo que vas a mover), tipo de inmueble y accesos (piso, ascensor, escaleras, dónde parquea el camión) y el nivel de servicio.",
                "Si te falta algún dato, el asesor te ayuda a completarlo.",
              ],
              options: [QUOTE],
            },
    },
    // Empresas
    {
      id: "oficinas",
      need: [
        ["oficina", "oficinas", "sede", "empresa", "bodega de la empresa"],
        [
          "trasladan",
          "trasladar",
          "mudan",
          "mudar",
          "traslado",
          "traslados",
          "trasteo",
          "mudanza",
          "mudanzas",
          "mover",
          "cambio",
          "cambiamos",
        ],
      ],
      not: ["embajada", "direccion", "donde estan"],
      reply: () => {
        const t = T(EMP);
        return {
          service: EMP,
          say: [
            "Sí. Con Transpack Corporate Mobility trasladamos oficinas y reubicamos personal, a nivel nacional e internacional.",
            bullets(t.includes),
            t.intro,
          ],
          actions: see(EMP),
          options: [quoteOpt(EMP, "Solicitar propuesta corporativa"), ADVISOR],
        };
      },
    },
    // Horarios
    {
      id: "horario-mudanza",
      need: [
        [
          "sabado",
          "sabados",
          "domingo",
          "domingos",
          "festivo",
          "festivos",
          "de noche",
          "nocturna",
          "nocturno",
          "fin de semana",
          "fines de semana",
          "horario",
          "horarios",
          "a que hora",
          "hasta que hora",
        ],
      ],
      not: ["atienden", "atencion", "abren", "cierran", "contestan", "oficina de ustedes"],
      reply: () => ({
        say: [
          "Una mudanza normal se puede programar hasta el sábado al mediodía. Para empresas hacemos jornadas nocturnas o de fin de semana cuando hacen parte del cronograma acordado, y si la operación se extiende se contemplan horas extras.",
          "Ten en cuenta también los horarios que permite la administración de tu edificio o conjunto: es una de las variables que revisamos al cotizar.",
        ],
        options: [QUOTE, ADVISOR],
      }),
    },
    {
      id: "horario-atencion",
      need: [
        [
          "horario de atencion",
          "a que hora atienden",
          "atienden",
          "abren",
          "cierran",
          "contestan",
          "atencion al cliente",
          "horario de oficina",
        ],
      ],
      reply: () => ({
        say: [
          "No tengo el horario de atención confirmado para darte un dato exacto.",
          `Escríbenos por WhatsApp o a ${kb.contact.email} y el equipo te responde.`,
        ],
        actions: CONTACT,
      }),
    },
    {
      id: "ubicacion",
      need: [
        [
          "direccion",
          "donde estan",
          "donde quedan",
          "ubicados",
          "ubicacion",
          "visitarlos",
          "ir a sus oficinas",
          "sus oficinas",
        ],
      ],
      not: ["camion", "mudanza", "trasladar"],
      reply: () => ({
        say: [
          `Estamos en ${kb.contact.address}.`,
          `También nos encuentras en los teléfonos ${kb.contact.phones.join(", ")}.`,
        ],
        actions: [
          {
            label: "Ver en el mapa",
            icon: "geo-alt",
            href: `https://maps.google.com/?q=${encodeURIComponent(kb.contact.address)}`,
          },
          ...CONTACT,
        ],
      }),
    },
    {
      id: "datos-personales",
      need: [
        [
          "datos personales",
          "habeas data",
          "politica de datos",
          "politica de privacidad",
          "privacidad",
          "proteccion de datos",
          "tratamiento de datos",
          "ley 1581",
          "con mis datos",
          "usan mis datos",
          "borrar mis datos",
          "eliminar mis datos",
        ],
      ],
      reply: () => ({
        say: [
          "Usamos tus datos solo para atender tu solicitud y prestarte el servicio; no los vendemos ni los usamos para publicidad (Ley 1581 de 2012).",
          `Puedes consultarlos, corregirlos o pedir que los borremos con el formulario de contacto (motivo «Datos personales») o escribiendo a ${kb.contact.email}. Todo el detalle está en nuestra política de datos.`,
        ],
        actions: [
          { label: "Ver la política de datos", icon: "shield-lock", to: "/privacidad" },
          { label: "Escribir sobre mis datos", icon: "envelope", href: "#contacto?motivo=datos" },
        ],
      }),
    },
    // Bodegaje
    {
      id: "bodegaje-tiempo",
      svc: B,
      need: [
        [
          "cuanto tiempo",
          "por cuanto tiempo",
          "minimo",
          "maximo",
          "dias",
          "meses",
          "largo plazo",
          "por mes",
          "mensual",
        ],
      ],
      reply: () => ({
        say: [
          "Puedes guardar tus cosas por días, meses o a largo plazo, solo o como parte de tu mudanza.",
          "Las condiciones y el valor dependen de qué guardes, el volumen y el tiempo; un asesor te confirma la disponibilidad.",
        ],
        actions: see(B),
        options: topicOpts(B),
      }),
    },
    {
      id: "bodegaje-que",
      svc: B,
      need: [
        [
          "que puedo guardar",
          "que guardan",
          "que se puede guardar",
          "que reciben",
          "archivo",
          "documentos",
          "muebles",
          "menaje",
          "mobiliario",
        ],
      ],
      reply: () => ({ say: [T(B).intro], actions: see(B), options: topicOpts(B) }),
    },
    {
      id: "bodegaje-condiciones",
      svc: B,
      need: [
        [
          "seguro",
          "segura",
          "seguridad",
          "vigilancia",
          "control",
          "visitar",
          "sacar",
          "retirar",
          "entregan",
          "donde",
        ],
      ],
      reply: () => ({
        say: [
          bullets(T(B).includes.filter((i) => /bodega|control|recogida|embalaje/i.test(i))),
          "El detalle de vigilancia y seguros de la bodega te lo confirma un asesor.",
        ],
        actions: see(B),
        options: topicOpts(B),
      }),
    },
    // Confianza y empresa
    {
      id: "clientes",
      need: [
        [
          "clientes",
          "con quien han trabajado",
          "empresas que atienden",
          "quienes confian",
          "han trabajado con",
          "para quien trabajan",
        ],
      ],
      reply: () => ({
        say: [
          `Han confiado en nosotros empresas como ${kb.clients.slice(0, 10).join(", ")}, entre otras.`,
          `Y embajadas como las de ${kb.embassies.join(", ")}.`,
        ],
        actions: [{ label: "Conocer Transpack", icon: "building", to: "/nosotros" }],
        options: [ADVISOR],
      }),
    },
    {
      id: "seguimiento",
      need: [
        [
          "seguimiento",
          "rastrear",
          "rastreo",
          "monitoreo",
          "gps",
          "donde va",
          "donde esta mi",
          "tracking",
          "estado de mi",
          "como va mi",
        ],
      ],
      reply: () => ({
        say: [
          "En mudanzas nacionales monitoreamos el vehículo durante el trayecto, y en las internacionales hacemos seguimiento hasta la entrega, con comunicación proactiva durante el proceso.",
          "Si ya tienes una mudanza en curso, tu asesor te da el estado: escríbenos por WhatsApp.",
        ],
        actions: [wa("Hola Transpack, quiero saber el estado de mi mudanza")],
      }),
    },
    {
      id: "pago",
      need: [
        [
          "formas de pago",
          "medios de pago",
          "como pago",
          "como se paga",
          "pagar con",
          "pago con",
          "pago por adelantado",
          "anticipo",
          "abono",
          "tarjeta",
          "credito",
          "cuotas",
          "transferencia",
          "factura",
          "efectivo",
        ],
      ],
      reply: () => ({
        say: [
          "No tengo las condiciones de pago (anticipos, medios o plazos) para darte un dato exacto. Se definen en la cotización formal y el asesor te las explica.",
        ],
        actions: CONTACT,
      }),
    },
    {
      id: "cambios",
      need: [
        [
          "cancelar",
          "cancelacion",
          "cambiar la fecha",
          "cambio de fecha",
          "reprogramar",
          "aplazar",
          "posponer",
          "mover la fecha",
        ],
      ],
      reply: () => ({
        say: [
          "No tengo las condiciones de cancelación o cambio de fecha para darte un dato exacto. Escríbenos y tu asesor revisa tu caso.",
        ],
        actions: CONTACT,
      }),
    },
  ];

  function matchFact(t: string, words: string[], mem: Memory): Fact | null {
    let best: Fact | null = null,
      bestScore = 0;
    for (const f of FACTS) {
      if (f.not && f.not.some((k) => has(t, words, k))) continue;
      if (!f.need.every((g) => g.some((k) => has(t, words, k)))) continue;
      let score = f.need.length * 2;
      if (f.svc) {
        const named = SK(f.svc).some((k) => k && has(t, words, k));
        if (!named && mem.lastService !== f.svc) continue;
        // Nombrarlo suma; venir hablando de él solo habilita (no compite con
        // una pregunta general que también encaje).
        score += named ? 1.5 : 0;
      }
      if (score > bestScore) {
        bestScore = score;
        best = f;
      }
    }
    return best;
  }

  // ─── Intenciones generales ──────────────────────────────────────────────

  const whyUs = () =>
    `Más de ${YEARS} años de trayectoria, más de ${AGENTS} agentes internacionales en ${COUNTRIES} países, más de ${TONS} toneladas de menaje exportadas y estándares certificados por ${CERTS} en origen y destino.`;

  type Resp = (m: Memory, asked: Set<string>, t: string, words: string[]) => JoelReply;
  const RESP: Record<string, Resp> = {
    precio: (m) => priceAnswer(m.lastService),
    cotizar: (m) =>
      m.lastService && T(m.lastService)
        ? priceAnswer(m.lastService)
        : {
            intent: "cotizar",
            say: ["Con gusto armamos tu solicitud. ¿Qué tipo de mudanza necesitas?"],
            options: priceAnswer().options,
            actions: [{ label: "Abrir el cotizador", icon: "ui-checks", to: "/#cotizar" }],
          },
    tiempo: (m) => timeAnswer(m.lastService),
    proceso: (m) =>
      m.lastService && T(m.lastService)?.steps.length
        ? stepsAnswer(m.lastService)
        : {
            intent: "proceso",
            say: [
              "Trabajamos así:",
              kb.process.map((p, i) => `${i + 1}. ${p.title}: ${p.text}`).join("\n"),
            ],
            options: [QUOTE, ADVISOR],
          },
    cobertura: (_m, _a, t) => {
      const dest = placeIn(t, destNames, COUNTRY_ALIAS);
      if (dest)
        return {
          intent: "cobertura",
          service: I,
          say: [
            `Sí, hacemos mudanzas internacionales desde y hacia Colombia, con más de ${AGENTS} agentes en ${COUNTRIES} países.`,
            kb.destinations.includes(dest)
              ? `${dest} es uno de los destinos a los que llevamos mudanzas.`
              : `El asesor te confirma la ruta a ${dest}.`,
          ],
          options: topicOpts(I),
        };
      return {
        intent: "cobertura",
        say: [
          "Hacemos mudanzas puerta a puerta en todo el país y, al exterior, con una red de más de " +
            `${AGENTS} agentes en ${COUNTRIES} países.`,
          "Si el origen o el destino es una zona de difícil acceso, primero validamos que la operación sea viable. Cuéntame a dónde vas.",
        ],
        options: [
          quoteOpt(N, "Cotizar mudanza nacional"),
          quoteOpt(I, "Cotizar mudanza internacional"),
          ADVISOR,
        ],
      };
    },
    empresa: () => ({
      intent: "empresa",
      say: [
        `Transpack tiene más de ${YEARS} años de trayectoria en mudanzas locales, nacionales e internacionales y bodegaje, desde Bogotá.`,
        `Contamos con más de ${AGENTS} agentes internacionales en ${COUNTRIES} países y más de ${TONS} toneladas de menaje exportadas.`,
        `Han confiado en nosotros empresas como ${kb.clients.slice(0, 5).join(", ")} y embajadas como las de ${kb.embassies.slice(0, 4).join(", ")}.`,
      ],
      actions: [{ label: "Conocer Transpack", icon: "building", to: "/nosotros" }],
      options: [SERVICES, QUOTE],
    }),
    seguridad: (m) =>
      m.lastService && T(m.lastService)
        ? protectionAnswer(m.lastService)
        : {
            intent: "seguridad",
            say: [
              "Protegemos cada objeto según su valor y fragilidad: inventario, embalaje profesional, personal capacitado en manipulación de muebles y, en mudanzas nacionales, monitoreo del vehículo.",
              `Para piezas de alto valor está ${T(E).the}, con guacales de madera a la medida y amortiguación de alta densidad.`,
            ],
            options: [QUOTE, ask("Ver embalaje especializado", "embalaje especializado", "easel")],
          },
    contacto: () => ({
      intent: "contacto",
      say: [
        "¡Claro! Puedes chatear ahora con un asesor de nuestro equipo o, si prefieres, escribirnos por WhatsApp, llamarnos o enviarnos un correo.",
        "El chat con un asesor se abre en nuestra plataforma de atención (Zoho SalesIQ). Tus mensajes quedan en nuestro sistema de clientes, según nuestra política de datos.",
        `También puedes visitarnos en ${kb.contact.address}.`,
      ],
      actions: CONTACT,
    }),
    certificaciones: () => ({
      intent: "certificaciones",
      say: [
        `Trabajamos con estándares certificados por ${CERTS}, que aseguran que la red de agentes en el país de destino opere con los mismos estándares que en origen.`,
        "Si tu empresa necesita otra certificación del proveedor, un asesor te confirma la documentación disponible.",
      ],
      actions: [{ label: "Conocer Transpack", icon: "building", to: "/nosotros" }],
      options: [ADVISOR],
    }),
    empleo: () => ({
      intent: "empleo",
      say: [
        `No tengo información de vacantes. Puedes escribir a ${kb.contact.email} para preguntar por oportunidades.`,
      ],
      actions: [MAIL],
    }),
    pqrs: () => ({
      intent: "pqrs",
      say: [
        "Lamento lo que pasó. Para que tu caso quede registrado y lo atiendan, escríbenos con los detalles por WhatsApp o al correo.",
      ],
      actions: CONTACT,
    }),
    // Objeciones
    "obj-caro": (m) => ({
      intent: "obj-caro",
      service: m.lastService,
      say: [
        "Entiendo, el presupuesto importa. Ten en cuenta que el valor depende de lo que elijas: si ya tienes todo empacado, el traslado básico solo incluye personal, vehículo y descargue.",
        "Un inventario preciso evita sorpresas en el costo final, y en mudanzas internacionales un inventario mal declarado o un permiso omitido puede costar semanas de retraso y sanciones.",
        "Primero te damos un estimado, sin compromiso de contratar, y solo si está dentro de tu presupuesto pasamos a la cotización formal.",
      ],
      options: [
        ...(m.lastService && T(m.lastService)
          ? [quoteOpt(m.lastService, "Pedir un estimado")]
          : [opt("Pedir un estimado", "svc", "card-checklist")]),
        ask("Ver los niveles", "niveles de servicio", "layers"),
        ADVISOR,
      ],
    }),
    "obj-yomismo": () => ({
      intent: "obj-yomismo",
      say: [
        "Tiene sentido si tienes el tiempo y la ayuda. Si lo que buscas es ahorrar, el traslado básico es un punto medio: tú empacas y nosotros ponemos el personal de cargue, el transporte y el descargue.",
        "Donde más se nota la diferencia es en lo que es difícil de hacer por cuenta propia: muebles pesados o delicados, accesos complicados y, en mudanzas internacionales, los trámites aduaneros.",
      ],
      options: [ask("Ver los niveles", "niveles de servicio", "layers"), QUOTE],
    }),
    "obj-porque": (m) => ({
      intent: "obj-porque",
      service: m.lastService,
      say: [
        `Lo que nos diferencia: ${whyUs()}`,
        `Han confiado en nosotros empresas como ${kb.clients.slice(0, 5).join(", ")} y embajadas de ${kb.embassies.length} países. Y el servicio es puerta a puerta: termina cuando tu nuevo espacio está listo para habitar.`,
        ...(m.lastService && T(m.lastService)
          ? [`En ${T(m.lastService).the}: ${T(m.lastService).intro}`]
          : []),
      ],
      options: [QUOTE, ADVISOR],
    }),
    "obj-confianza": () => ({
      intent: "obj-confianza",
      say: [
        `Es una pregunta válida: nos estás confiando tu patrimonio. Llevamos más de ${YEARS} años haciendo mudanzas, y empresas como ${kb.clients.slice(0, 4).join(", ")} y varias embajadas confían en nosotros.`,
        "Para cuidar tus cosas hacemos inventario detallado, embalaje según el valor y la fragilidad de cada objeto, y trabajamos con personal capacitado y agentes certificados en destino.",
        "Las condiciones de responsabilidad y de seguro se definen en la cotización formal: pídele al asesor que te las detalle antes de contratar.",
      ],
      options: [ADVISOR, ask("¿Tienen seguro?", "tienen seguro", "shield-check")],
    }),
    // Conversación
    saludo: () => ({
      intent: "saludo",
      say: [
        "¡Hola! ¿En qué te puedo ayudar? Puedes contarme tu caso con tus palabras o elegir una opción.",
      ],
      options: [QUOTE, SERVICES, FAQ, ADVISOR],
    }),
    gracias: () => ({
      intent: "gracias",
      say: ["¡Con gusto! Si necesitas algo más, aquí estoy."],
      options: [QUOTE, opt("Volver al inicio", "reset", "house")],
    }),
    despedida: () => ({
      intent: "despedida",
      say: [
        `¡Hasta pronto! Cuando quieras retomar, aquí estaré. También nos encuentras en WhatsApp al ${phone}.`,
      ],
    }),
    bot: () => ({
      intent: "bot",
      say: [
        "Soy Joel, el asesor virtual de Transpack. No soy ChatGPT ni una persona: respondo con la información de la empresa y de este sitio para orientarte, y te conecto con un asesor de nuestro equipo cuando lo necesites.",
      ],
      options: [ADVISOR, QUOTE],
    }),
    inyeccion: () => ({
      intent: "inyeccion",
      say: [
        "Solo puedo ayudarte con mudanzas, bodegaje y los servicios de Transpack. ¿Qué necesitas mover?",
      ],
      options: [SERVICES, FAQ],
    }),
    ofensa: (m) => ({
      intent: "ofensa",
      say:
        m.rude > 1
          ? [
              `Prefiero que mantengamos una conversación respetuosa. Si lo deseas, puedes comunicarte directamente con nuestro equipo al ${phone}.`,
            ]
          : [
              "Entiendo que puedes estar molesto. Estoy para ayudarte: cuéntame qué necesitas y buscamos la mejor solución.",
            ],
      options: [ADVISOR],
    }),
    fuera: () => ({
      intent: "fuera",
      say: [
        "Ese tema se sale de lo que manejo: soy especialista en mudanzas 📦. Puedo ayudarte con una mudanza local, nacional o internacional, bodegaje o embalaje.",
      ],
      options: [SERVICES, FAQ],
    }),
  };

  // Tema más probable de un texto (también para clasificar búsquedas y artículos)
  function topicScores(t: string, words: string[]): [string, number][] {
    const learned = load().learned;
    const s: Record<string, number> = {};
    const add = (k: string, n: number) => (s[k] = (s[k] || 0) + n);
    for (const [key, kws] of Object.entries(TOPIC_KEYWORDS))
      if (topics[key])
        for (const k of kws) if (has(t, words, k)) add(key, k.includes(" ") ? 2 : 1.4);
    for (const tp of Object.values(topics)) if (t.includes(norm(tp.title))) add(tp.key, 4);
    const dest = placeIn(t, destNames, COUNTRY_ALIAS);
    if (dest) add(I, 2);
    const city = placeIn(t, CITIES);
    if (city && city !== "Bogotá") add(N, 1.4);
    for (const w of words) {
      const d = learned[w];
      if (d?.startsWith("service:") && topics[d.slice(8)]) add(d.slice(8), 2);
    }
    return Object.entries(s).sort((a, b) => b[1] - a[1]);
  }
  const topicOf = (text: string) => {
    const t = norm(text);
    const top = topicScores(t, t.split(" "))[0];
    return top && top[1] >= 1.4 ? top[0] : undefined;
  };
  const articleTopic = (slug: string) => {
    const p = kb.posts.find((x) => x.slug === slug);
    return p ? topicOf(`${p.title} ${p.cat} ${p.excerpt}`) : undefined;
  };

  /** Responde a un texto libre del visitante (y recuerda el tema en contexto). */
  function respond(text: string, mem: Memory): JoelReply {
    const r = think(text, mem);
    if (r.service) mem.lastService = r.service;
    mem.lastIntent = r.intent;
    if (!r.intent.startsWith("fallback")) mem.unknownStreak = 0;
    return r;
  }

  function think(text: string, mem: Memory): JoelReply {
    const t = norm(text);
    const words = t.split(" ").filter(Boolean);
    const learned = load().learned;

    // Puntuar intenciones
    const scores: Record<string, number> = {};
    for (const r of RULES)
      for (const k of r.kws)
        if (has(t, words, k))
          scores[r.id] = (scores[r.id] || 0) + (r.w ?? 1) * (k.includes(" ") ? 1.5 : 1);
    for (const w of words) {
      const d = learned[w];
      if (d?.startsWith("intent:")) scores[d.slice(7)] = (scores[d.slice(7)] || 0) + 2;
    }
    const topIntent = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const asked = new Set(Object.keys(scores));
    const topSvc = topicScores(t, words);
    const refersBack =
      /\b(eso|ese|esa|este servicio|ese servicio|lo mismo|y cuanto|y el|y la|y si|y los|y las|y para|y como)\b/.test(
        t,
      );

    // Defensa primero: manipulación e insultos
    if (scores.inyeccion) return RESP.inyeccion(mem, asked, t, words);
    if (scores.ofensa) {
      mem.rude++;
      return RESP.ofensa(mem, asked, t, words);
    }

    // Pregunta específica conocida (la respuesta más precisa)
    const fact = matchFact(t, words, mem);
    if (fact) {
      const r = fact.reply(mem);
      return { service: fact.svc, ...r, intent: `fact-${fact.id}` };
    }

    // Objeciones (con el servicio en contexto, si lo hay)
    const obj = topIntent.find(([id]) => id.startsWith("obj-"));
    if (obj) {
      if (topSvc[0]) mem.lastService = topSvc[0][0];
      return RESP[obj[0]](mem, asked, t, words);
    }

    // Problema del cliente → asesoría
    const days = daysIn(t);
    if (hasAny(t, words, RETURNING)) return returnAnswer(days);
    const moving = hasAny(t, words, MOVING);
    const dest = placeIn(t, destNames, COUNTRY_ALIAS);
    if (moving && dest && !scores.precio) return abroadAnswer(dest, days, t, words);
    const city = placeIn(t, CITIES);
    if (moving && city && city !== "Bogotá" && !scores.precio) return nationalAnswer(city, days);
    if (hasAny(t, words, WAITING)) return waitingAnswer();

    // Tema(s) mencionados
    if (topSvc[0] && topSvc[0][1] >= 1.4) {
      const [first] = topSvc[0];
      const second = topSvc[1] && topSvc[1][1] >= topSvc[0][1] * 0.8 ? topSvc[1][0] : null;
      const reply = topicAnswer(first, asked);
      if (second && reply.intent.startsWith("svc-")) {
        reply.say = [
          `Veo que te interesan ${T(first).the} y ${T(second).the}; suelen trabajarse juntos.`,
          T(first).summary[0],
          T(second).summary[0],
        ];
        reply.options = [quoteOpt(first), quoteOpt(second), ADVISOR];
        reply.actions = [...see(first), ...see(second)];
      }
      return reply;
    }

    // Pregunta de seguimiento sobre el tema del que se venía hablando
    if (
      mem.lastService &&
      T(mem.lastService) &&
      (refersBack ||
        ["precio", "cotizar", "tiempo", "proceso", "seguridad"].some((k) => asked.has(k)))
    )
      return topicAnswer(mem.lastService, asked);

    // Intención general
    const general = topIntent.find(([id]) => RESP[id] && id !== "fuera");
    if (general) return RESP[general[0]](mem, asked, t, words);

    // Preguntas frecuentes por coincidencia de palabras
    const kw = keywordsOf(text);
    let bestFaq = -1,
      bestFaqScore = 0;
    kb.faqs.forEach((f, i) => {
      const fk = keywordsOf(f.q + " " + f.a);
      const sc = kw.filter((w) => fk.some((x) => stem(x) === stem(w))).length;
      if (sc > bestFaqScore) {
        bestFaqScore = sc;
        bestFaq = i;
      }
    });
    if (bestFaq >= 0 && bestFaqScore >= 2)
      return {
        intent: "faq",
        say: [kb.faqs[bestFaq].a],
        options: [opt("Otra pregunta", "faq", "question-circle"), QUOTE],
      };

    // Blog
    const post = kb.posts.find((p) => {
      const pk = keywordsOf(p.title + " " + p.excerpt);
      return kw.filter((w) => pk.some((x) => stem(x) === stem(w))).length >= 2;
    });
    if (post)
      return {
        intent: "blog",
        say: [`Tenemos un artículo sobre eso: «${post.title}».`, post.excerpt],
        actions: [{ label: "Leer el artículo", icon: "journal-text", to: `/blog/${post.slug}` }],
        options: [QUOTE, opt("Volver al inicio", "reset", "house")],
      };

    if (scores.fuera) return RESP.fuera(mem, asked, t, words);

    // No entendió: guarda la pregunta y las palabras para aprender de la siguiente elección
    mem.unknownStreak++;
    mem.pendingWords = kw;
    const p = load();
    p.unknown = [text, ...p.unknown.filter((u) => u !== text)].slice(0, 30);
    save(p);
    if (mem.unknownStreak >= 2)
      return {
        intent: "fallback2",
        say: [
          "Quiero asegurarme de ayudarte bien. ¿Te comunico con un asesor, o me cuentas tu caso en pocas palabras? Por ejemplo: «me mudo de Bogotá a Cali en dos semanas».",
        ],
        options: [ADVISOR, QUOTE, SERVICES],
      };
    return {
      intent: "fallback",
      say: [
        "No estoy seguro de haberte entendido. 🤔",
        "¿Te refieres a alguna de estas opciones? Así aprendo para la próxima.",
      ],
      options: [QUOTE, SERVICES, FAQ, ADVISOR],
    };
  }

  /** Aprende: asocia las palabras que no entendió con lo que el visitante eligió después.
   *  Una intención general ("intent:cotizar") no cierra el aprendizaje: si luego
   *  elige un servicio concreto, se queda con ese, que es más preciso. */
  function learn(mem: Memory, dest: string) {
    if (!mem.pendingWords.length) return;
    const p = load();
    for (const w of mem.pendingWords) if (w.length >= 4 && !STOP.has(w)) p.learned[w] = dest;
    save(p);
    if (dest.startsWith("service:")) mem.pendingWords = [];
    mem.unknownStreak = 0;
  }

  /** Saludo según el comportamiento del visitante en el sitio. */
  function greeting(): JoelReply {
    const ins = getInsight(topicOf, articleTopic);
    const hello = ins.returning
      ? "¡Qué bueno verte de nuevo! Soy Joel, el asesor virtual de Transpack. 👋"
      : "¡Hola! Soy Joel, el asesor virtual de Transpack. 👋";
    const base: JoelOption[] = [
      opt("Quiero cotizar una mudanza", "svc", "card-checklist"),
      opt("Tengo una pregunta", "faq", "question-circle"),
      opt("Soy una empresa o embajada", "corp", "buildings"),
      ADVISOR,
    ];
    const top = ins.topServices[0] ? T(ins.topServices[0]) : undefined;
    if (top && ins.segment === "comprador")
      return {
        intent: "saludo-comprador",
        service: top.key,
        say: [hello, `Veo que te interesa ${top.the}. ¿Te ayudo a terminar tu cotización?`],
        options: [quoteOpt(top.key, "Sí, terminar mi cotización"), ...base.slice(1)],
      };
    if (ins.segment === "tecnico")
      return {
        intent: "saludo-tecnico",
        service: top?.key,
        say: [
          hello,
          top
            ? `Veo que has estado leyendo sobre ${top.the}. Puedo resolverte dudas de tiempos, requisitos o embalaje, o ayudarte a llevarlo a la práctica.`
            : "Veo que te gusta informarte antes de decidir. Puedo resolverte dudas de tiempos, requisitos o embalaje, o ayudarte a llevarlo a la práctica.",
        ],
        options: [
          ...(top ? [ask(`¿Cuánto se demora?`, `cuanto se demora ${top.name}`, "clock")] : [FAQ]),
          CASE,
          base[0],
          ADVISOR,
        ],
      };
    if (top)
      return {
        intent: "saludo-interes",
        service: top.key,
        say: [
          hello,
          `Noto que has estado mirando ${top.the}. ¿Quieres que te cuente cómo funciona o prefieres cotizarlo?`,
        ],
        options: [
          ask("¿Cómo funciona?", `como funciona ${top.name}`, "info-circle"),
          quoteOpt(top.key),
          ...base.slice(1, 2),
          ADVISOR,
        ],
      };
    return {
      intent: "saludo",
      say: [
        hello,
        ins.returning
          ? "¿En qué te puedo ayudar hoy? Puedes elegir una opción o escribirme tu caso con tus palabras."
          : "Te ayudo a planear tu mudanza, resolver dudas o hablar con nuestro equipo. Puedes elegir una opción o contarme tu caso con tus palabras.",
      ],
      options: base,
    };
  }

  return { respond, learn, greeting };
}
