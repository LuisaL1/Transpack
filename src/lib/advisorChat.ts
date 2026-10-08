// Chat con un asesor dentro de la ventana de Joel: habla solo con /api/advisor
// (función del sitio → Zoho SalesIQ). El navegador nunca carga Zoho en este modo.
// Ver docs/chat-crm.md.

export type AdvisorMessage = {
  id: string;
  seq: number;
  from: "operator" | "bot" | "system";
  name: string;
  /** Texto del asesor; en los avisos del sistema: "joined" o "ended" */
  text: string;
  time: number;
};

/** Cada cuánto se preguntan las respuestas del asesor */
export const POLL_MS = 3500;
/** Si en este tiempo no responde nadie, Joel ofrece otros canales */
export const WAIT_MS = 120_000;
/** Conversación en curso (sobrevive a la navegación y a recargar la página) */
const KEY = "tp-advisor";

type Saved = { token: string; after: number };

async function call<T>(body: Record<string, unknown>): Promise<T & { ok: boolean; error?: string }> {
  try {
    const r = await fetch("/api/advisor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const d = (await r.json().catch(() => ({}))) as T & { ok?: boolean; error?: string };
    return { ...d, ok: r.ok && !!d.ok, error: d.error ?? (r.ok ? undefined : `http-${r.status}`) };
  } catch {
    return { ok: false, error: "network" } as T & { ok: boolean; error?: string };
  }
}

/** ¿El chat dentro de Joel está configurado? Si no, se usa la ventana de Zoho. */
export async function advisorAvailable(): Promise<boolean> {
  try {
    const r = await fetch("/api/advisor", { headers: { Accept: "application/json" } });
    const d = (await r.json().catch(() => ({}))) as { configured?: boolean };
    return r.ok && d.configured === true;
  } catch {
    return false;
  }
}

export const startAdvisor = (question: string, name?: string) =>
  call<{ token?: string }>({
    action: "start",
    question,
    name,
    page: typeof location !== "undefined" ? location.pathname : undefined,
  });

export const sendToAdvisor = (token: string, text: string) => call({ action: "send", token, text });

export const pollAdvisor = (token: string, after: number) =>
  call<{ messages?: AdvisorMessage[] }>({ action: "poll", token, after });

export function loadSaved(): Saved | null {
  try {
    const s = JSON.parse(sessionStorage.getItem(KEY) ?? "null") as Saved | null;
    return s && typeof s.token === "string" ? s : null;
  } catch {
    return null;
  }
}

export function save(s: Saved | null) {
  try {
    if (s) sessionStorage.setItem(KEY, JSON.stringify(s));
    else sessionStorage.removeItem(KEY);
  } catch {
    /* sin almacenamiento */
  }
}
