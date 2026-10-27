// ─── Chat con un asesor: Zoho SalesIQ (CRM) ─────────────────────────────────
// Joel atiende primero. Cuando la persona elige "Chatear con un asesor" (en el
// chat de Joel), se carga Zoho SalesIQ. El script de Zoho NO se carga al entrar
// al sitio: solo en ese momento. Así, antes de eso Zoho no guarda cookies ni
// rastrea la visita (Ley 1581 de 2012; ver la política de datos).
//
// · Zoho vive en una PÁGINA AISLADA del sitio (public/chat-asesor.html) que se
//   carga en un iframe escondido. Esa página tiene su propia CSP (vercel.json)
//   con los scripts en línea que Zoho necesita; el resto del sitio conserva su
//   CSP estricta.
// · Normalmente trabaja escondida como puente (src/lib/zohoBridge.ts): la
//   conversación se ve en Joel. Su ventana solo se muestra como respaldo o para
//   llenar un formulario de Zoho (clase tp-zoho-open, src/styles/index.css).
// · Diseño: src/styles/zoho-chat.css (adentro de la ventana) y
//   src/styles/zoho-host.css (marco y botón de cerrar).
// · Solo en español. El código del widget no es secreto.
// Documentación: docs/chat-crm.md.
import chatCss from "@/styles/zoho-chat.css?raw";
import hostCss from "@/styles/zoho-host.css?raw";
import { CRM_CHAT_EVENT } from "@/lib/advisorEvents";

export { ADVISOR_EVENT, CRM_CHAT_EVENT, requestAdvisorChat } from "@/lib/advisorEvents";

/** Código del widget de SalesIQ (Zoho → Configuración → Canales → Sitio web) */
export const SALESIQ_WIDGET = "siq8d38e38af4540824c78096b7725bb11aa5c42288eecc3028007e86bb9e4360dc";
export const SALESIQ_SRC = `https://salesiq.zohopublic.com/widget?wc=${SALESIQ_WIDGET}`;
/** Página aislada donde vive Zoho y el iframe que la contiene */
export const HOST_SRC = "/chat-asesor.html";
export const HOST_ID = "tp-zoho-frame";
/** Acción personalizada que el sitio avisa a Zoho al abrir el chat. En Zoho se
 *  configura un disparador/bot proactivo para esta acción, de modo que el bot
 *  salude solo sin que el visitante envíe ningún mensaje (ver docs/chat-crm.md). */
export const ADVISOR_START_ACTION = "abrir_chat_asesor";
/** Pestaña con la que abre la ventana de Zoho: la conversación (no su inicio) */
const DEFAULT_VIEW = "chat";
/** Tiempo máximo para que Zoho responda antes de ofrecer otros canales */
const TIMEOUT_MS = 15_000;

type SalesIQ = {
  ready?: () => void;
  language?: (l: string) => void;
  floatbutton?: { visible: (v: "show" | "hide") => void };
  floatwindow?: {
    visible: (v: "show" | "hide") => void;
    open?: (cb: () => void) => void;
    close?: (cb: () => void) => void;
    minimize?: (cb: () => void) => void;
    /** Pestaña con la que abre la ventana ("home", "chat"…) */
    defaultview?: (view: string) => void;
  };
  /** Lo lee la ventana de Zoho para elegir la pestaña inicial */
  defaultview?: string;
  visitor?: { customaction?: (action: string) => void };
};
declare global {
  interface Window {
    $zoho?: { salesiq?: SalesIQ };
  }
}

// ─── Página aislada ─────────────────────────────────────────────────────────
let host: Promise<Window> | null = null;
let hostWin: Window | null = null;

/** Ventana de la página aislada (o null si todavía no se creó). */
export const zohoWindow = () => hostWin;

/** Crea (una vez) el iframe escondido con la página aislada y espera a que cargue. */
function zohoHost(): Promise<Window> {
  if (host) return host;
  host = new Promise<Window>((resolve, reject) => {
    const frame = document.createElement("iframe");
    frame.id = HOST_ID;
    frame.title = "Chat con un asesor de Transpack";
    frame.setAttribute("aria-hidden", "true");
    frame.tabIndex = -1;
    frame.onload = () => {
      const w = frame.contentWindow;
      if (!w?.document?.body) return reject(new Error("host"));
      // Marco y botón de cerrar de la ventana de Zoho
      const style = w.document.createElement("style");
      style.textContent = hostCss;
      w.document.head.appendChild(style);
      hostWin = w;
      resolve(w);
    };
    frame.onerror = () => reject(new Error("host"));
    frame.src = HOST_SRC;
    document.body.appendChild(frame);
  }).catch((e) => {
    host = null;
    document.getElementById(HOST_ID)?.remove();
    throw e;
  });
  return host;
}

const STYLE_ID = "tp-chat-style";

/** Aplica el diseño del sitio dentro de la ventana de Zoho (iframe del mismo origen). */
export function styleChatWindow(): boolean {
  const frame = hostWin?.document.getElementById("siq_chatwindow") as HTMLIFrameElement | null;
  const doc = frame?.contentDocument;
  if (!frame || !doc?.head) return false;
  if (!frame.dataset.tpStyled) {
    // Si Zoho vuelve a cargar la ventana, se aplica otra vez
    frame.addEventListener("load", () => styleChatWindow());
    frame.dataset.tpStyled = "1";
  }
  if (!doc.getElementById(STYLE_ID)) {
    const style = doc.createElement("style");
    style.id = STYLE_ID;
    style.textContent = chatCss;
    doc.head.appendChild(style);
  }
  return true;
}

/** Espera a que Zoho cree la ventana para darle el diseño del sitio. */
function watchChatWindow(w: Window) {
  if (styleChatWindow()) return;
  const obs = new MutationObserver(() => {
    if (styleChatWindow()) obs.disconnect();
  });
  obs.observe(w.document.body, { childList: true, subtree: true });
  window.setTimeout(() => obs.disconnect(), 30_000);
}

// ─── Visible o escondida ────────────────────────────────────────────────────
// En modo puente (src/lib/zohoBridge.ts) la ventana de Zoho trabaja escondida:
// no se muestra ni se avisa al sitio, para que Joel siga a la vista.
let bridging = false;
// Abriendo: la ventana no se muestra hasta estar dentro de una conversación
// (así no se alcanza a ver el inicio ni la lista de conversaciones de Zoho)
let opening = false;
// Precargada: la ventana quedó lista y escondida al entrar al sitio; no se
// muestra hasta que la persona abre el chat
let hidden = false;
export const setBridging = (on: boolean) => {
  bridging = on;
  if (on) document.documentElement.classList.remove("tp-zoho-open");
};
/** Muestra u oculta la ventana de Zoho y avisa al sitio (salvo en modo puente). */
export const announce = (open: boolean) => {
  if (bridging || ((opening || hidden) && open)) return;
  document.documentElement.classList.toggle("tp-zoho-open", open);
  window.dispatchEvent(new CustomEvent(CRM_CHAT_EVENT, { detail: { open } }));
};

let loading: Promise<SalesIQ> | null = null;

/** Carga el script de Zoho una sola vez (en la página aislada) y resuelve cuando está listo. */
export function loadCrmChat(): Promise<SalesIQ> {
  if (loading) return loading;
  loading = zohoHost().then(
    (w) =>
      new Promise<SalesIQ>((resolve, reject) => {
        const timer = window.setTimeout(() => fail(new Error("timeout")), TIMEOUT_MS);
        function fail(e: Error) {
          window.clearTimeout(timer);
          loading = null; // permite reintentar
          w.document.getElementById("zsiqscript")?.remove();
          reject(e);
        }
        // Objeto de arranque que pide Zoho (el mismo del fragmento oficial)
        w.$zoho = w.$zoho || {};
        w.$zoho.salesiq = {
          ...w.$zoho.salesiq,
          // Abre directo en la conversación, no en el inicio de Zoho
          defaultview: DEFAULT_VIEW,
          ready() {
            window.clearTimeout(timer);
            const z = w.$zoho!.salesiq!;
            z.language?.("es");
            z.floatbutton?.visible("hide");
            z.defaultview = DEFAULT_VIEW;
            z.floatwindow?.defaultview?.(DEFAULT_VIEW);
            z.floatwindow?.open?.(() => announce(true));
            z.floatwindow?.close?.(() => announce(false));
            z.floatwindow?.minimize?.(() => announce(false));
            watchChatWindow(w);
            resolve(z);
          },
        };
        const s = w.document.createElement("script");
        s.id = "zsiqscript";
        s.src = SALESIQ_SRC;
        s.defer = true;
        s.onerror = () => fail(new Error("load"));
        w.document.body.appendChild(s);
      }),
  );
  loading.catch(() => (loading = null));
  return loading;
}

/** Abre la ventana del chat de Zoho a la vista, ya dentro de una conversación. */
export async function openCrmChat(): Promise<void> {
  // Si la precarga sigue en curso, se termina con ella (ya entra a la conversación)
  await warm;
  const z = await loadCrmChat();
  setBridging(false);
  opening = true;
  try {
    z.floatwindow?.visible("show");
    styleChatWindow();
    await enterConversation();
  } finally {
    opening = false;
  }
  hidden = false;
  announce(true);
}

let warm: Promise<void> | null = null;

/** Precarga (al entrar al sitio, src/hooks/useAdvisorChat.ts): carga Zoho y deja
 *  su ventana armada, escondida y ya dentro de una conversación, para que abrir
 *  el chat sea inmediato. No muestra nada, no envía mensajes ni avisa la acción
 *  del bot (eso pasa solo cuando la persona abre el chat). */
export function preloadCrmChat(): Promise<void> {
  warm ??= (async () => {
    const z = await loadCrmChat();
    hidden = true;
    z.floatwindow?.visible("show");
    styleChatWindow();
    await enterConversation();
  })().catch(() => {
    // Si falla, abrir el chat lo vuelve a intentar como siempre
    hidden = false;
    warm = null;
  });
  return warm;
}

/** Documento de la ventana de Zoho (iframe del mismo origen) */
const chatDoc = () =>
  (hostWin?.document.getElementById("siq_chatwindow") as HTMLIFrameElement | null)?.contentDocument ??
  null;

/** Si Zoho muestra su lista de conversaciones ("No hay ninguna conversación en
 *  curso") o su inicio en vez de una conversación, entra a una conversación
 *  nueva: el visitante ve directo el chat. No envía ningún mensaje. */
async function enterConversation(ms = 8000) {
  const end = Date.now() + ms;
  let clicked = false;
  while (Date.now() < end) {
    const doc = chatDoc();
    // Ya en una conversación (el campo de escribir está a la vista)
    if (doc?.querySelector("textarea")) return;
    if (!clicked) {
      const start =
        doc?.querySelector<HTMLElement>('[data-zsqa="new_conversation"]') ??
        doc?.querySelector(".siqico-chat-start")?.closest<HTMLElement>(".home-icon-optns");
      if (start) {
        start.click();
        clicked = true;
      }
    }
    await new Promise((r) => setTimeout(r, 100));
  }
}

/** Avisa a Zoho que se abrió el chat mediante una acción personalizada, para que
 *  su bot proactivo salude solo, sin que el visitante envíe un mensaje. Requiere
 *  el disparador configurado en Zoho (ver docs/chat-crm.md). */
export function triggerAdvisorStart() {
  hostWin?.$zoho?.salesiq?.visitor?.customaction?.(ADVISOR_START_ACTION);
}

/** Cierra la ventana del chat si Zoho ya está cargado. */
export function closeCrmChat() {
  hostWin?.$zoho?.salesiq?.floatwindow?.visible("hide");
  announce(false);
}

/** Solo para pruebas: usa esta ventana como página aislada (jsdom no carga iframes). */
export function setZohoHostForTests(w: Window) {
  hostWin = w;
  host = Promise.resolve(w);
}

/** Solo para pruebas: olvida la carga anterior. */
export function resetCrmChatForTests() {
  loading = null;
  warm = null;
  hidden = false;
  host = null;
  hostWin = null;
  document.getElementById(HOST_ID)?.remove();
}
