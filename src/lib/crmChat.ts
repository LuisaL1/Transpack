// ─── Chat con un asesor: Zoho SalesIQ (CRM) ─────────────────────────────────
// Joel atiende primero. Cuando la persona elige "Chatear con un asesor" (en el
// chat de Joel), se abre el chat de Zoho SalesIQ. El script de Zoho NO se
// carga al entrar al sitio: solo en ese momento.
// Así, antes de eso Zoho no guarda cookies ni rastrea la visita (Ley 1581 de
// 2012; ver la política de datos) y la página carga más rápido.
//
// · El botón de Zoho se oculta: al cerrar su ventana vuelve el botón de Joel.
// · Diseño: la ventana de Zoho recibe los estilos del sitio (src/styles/zoho-chat.css),
//   el mismo diseño del chat de Joel. El marco y el botón de cerrar
//   están en src/styles/index.css.
// · El chat atiende solo en español (decisión de Transpack), en todos los idiomas.
// · El código del widget no es secreto: es el mismo que Zoho pide pegar en la página.
// Dominios que usa (CSP en vercel.json): salesiq.zoho.com, static.zohocdn.com y
// *.zohopublic.com. Documentación: docs/chat-crm.md.

import chatCss from "@/styles/zoho-chat.css?raw";

/** Código del widget de SalesIQ (Zoho → Configuración → Canales → Sitio web) */
export const SALESIQ_WIDGET = "siq8d38e38af4540824c78096b7725bb11aa5c42288eecc3028007e86bb9e4360dc";
export const SALESIQ_SRC = `https://salesiq.zoho.com/widget?wc=${SALESIQ_WIDGET}`;
import { CRM_CHAT_EVENT } from "@/lib/advisorEvents";
export { ADVISOR_EVENT, CRM_CHAT_EVENT, requestAdvisorChat } from "@/lib/advisorEvents";
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
  };
};
declare global {
  interface Window {
    $zoho?: { salesiq?: SalesIQ };
  }
}

let loading: Promise<SalesIQ> | null = null;
const STYLE_ID = "tp-chat-style";

/** Aplica el diseño del sitio dentro de la ventana de Zoho (iframe del mismo origen). */
export function styleChatWindow(): boolean {
  const frame = document.getElementById("siq_chatwindow") as HTMLIFrameElement | null;
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
function watchChatWindow() {
  if (styleChatWindow()) return;
  const obs = new MutationObserver(() => {
    if (styleChatWindow()) obs.disconnect();
  });
  obs.observe(document.body, { childList: true, subtree: true });
  window.setTimeout(() => obs.disconnect(), 30_000);
}
// En modo puente (src/lib/zohoBridge.ts) la ventana de Zoho trabaja escondida:
// no se avisa al sitio para que Joel siga a la vista.
let bridging = false;
export const setBridging = (on: boolean) => {
  bridging = on;
  document.documentElement.classList.toggle("tp-zoho-hidden", on);
};
const emit = (open: boolean) => {
  if (bridging) return;
  window.dispatchEvent(new CustomEvent(CRM_CHAT_EVENT, { detail: { open } }));
};

/** Carga el script de Zoho una sola vez y resuelve cuando está listo. */
export function loadCrmChat(): Promise<SalesIQ> {
  if (loading) return loading;
  loading = new Promise<SalesIQ>((resolve, reject) => {
    const timer = window.setTimeout(() => fail(new Error("timeout")), TIMEOUT_MS);
    function fail(e: Error) {
      window.clearTimeout(timer);
      loading = null; // permite reintentar
      document.getElementById("zsiqscript")?.remove();
      reject(e);
    }
    // Objeto de arranque que pide Zoho (el mismo del fragmento oficial)
    window.$zoho = window.$zoho || {};
    window.$zoho.salesiq = {
      ...window.$zoho.salesiq,
      ready() {
        window.clearTimeout(timer);
        const z = window.$zoho!.salesiq!;
        z.language?.("es");
        z.floatbutton?.visible("hide");
        z.floatwindow?.open?.(() => emit(true));
        z.floatwindow?.close?.(() => emit(false));
        z.floatwindow?.minimize?.(() => emit(false));
        watchChatWindow();
        resolve(z);
      },
    };
    const s = document.createElement("script");
    s.id = "zsiqscript";
    s.src = SALESIQ_SRC;
    s.defer = true;
    s.onerror = () => fail(new Error("load"));
    document.body.appendChild(s);
  });
  return loading;
}

/** Abre la ventana del chat (carga Zoho la primera vez). */
export async function openCrmChat(): Promise<void> {
  const z = await loadCrmChat();
  z.floatwindow?.visible("show");
  styleChatWindow();
  emit(true);
}

/** Cierra la ventana del chat si Zoho ya está cargado. */
export function closeCrmChat() {
  window.$zoho?.salesiq?.floatwindow?.visible("hide");
  emit(false);
}

/** Solo para pruebas: olvida la carga anterior. */
export function resetCrmChatForTests() {
  loading = null;
}
