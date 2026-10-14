// ─── Joel: perfil del visitante y memoria de la conversación ────────────────
// Parte LIGERA de Joel: lo que el sitio necesita en cada página (registrar
// secciones, servicios, artículos, búsquedas y cotizaciones en el navegador)
// sin cargar el cerebro completo (src/lib/joel.ts, ~120 KB), que se descarga
// aparte solo cuando se abre el chat. Importe desde aquí, no desde joel.ts.
// Todo queda en localStorage/sessionStorage del visitante: nunca sale del equipo.

export type QuoteKind = "local" | "nacional" | "internacional" | "empresarial" | "bodegaje";

export type Profile = {
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

export function loadProfile(): Profile {
  try {
    const p = JSON.parse(localStorage.getItem(KEY) || "null");
    if (p && typeof p === "object") return { ...empty(), ...p };
  } catch {
    /* sin almacenamiento */
  }
  return empty();
}
export function saveProfile(p: Profile) {
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
  const p = loadProfile();
  p.visits += 1;
  p.last = Date.now();
  saveProfile(p);
}
/** Registra un evento: track("section", "faq"), track("service", slug)… */
export function track(kind: "section" | "service" | "article" | "quote" | "chat", key: string) {
  const p = loadProfile();
  const k = `${kind}:${key}`;
  p.counts[k] = (p.counts[k] || 0) + 1;
  p.last = Date.now();
  saveProfile(p);
}
export function trackSearch(q: string) {
  const t = q.trim();
  if (t.length < 3) return;
  const p = loadProfile();
  p.searches = [t, ...p.searches.filter((x) => x !== t)].slice(0, 15);
  saveProfile(p);
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

// ─── Memoria de la conversación (se reinicia al empezar de nuevo) ───────────

export type Memory = {
  lastService?: string;
  lastIntent?: string;
  unknownStreak: number;
  rude: number;
  pendingWords: string[];
};
export const newMemory = (): Memory => ({ unknownStreak: 0, rude: 0, pendingWords: [] });
