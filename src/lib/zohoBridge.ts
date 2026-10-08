// ─── Puente con Zoho SalesIQ ─────────────────────────────────────────────────
// Chat con un asesor DENTRO de la ventana de Joel sin la API de organización de
// Zoho: el widget de SalesIQ se carga escondido (fuera de la pantalla) y este
// módulo escribe en su ventana y lee lo que responden el bot o el asesor de
// Zoho, para mostrarlo en Joel. Ver docs/chat-crm.md.
//
// · Textos y opciones (botones de sugerencia) pasan a Joel.
// · Si Zoho pide un formulario (nombre, correo, medio de contacto…), Joel ofrece
//   llenarlo en la ventana de Zoho o, si Zoho lo permite, omitirlo (onForm):
//   esos controles no se replican.
// · Depende de la estructura interna de la ventana de Zoho (clases y atributos
//   data-zsqa). Si Zoho la cambia, startBridge falla y Joel abre la ventana de
//   Zoho como respaldo.
import { CRM_CHAT_EVENT } from "@/lib/advisorEvents";
import { loadCrmChat, setBridging, styleChatWindow } from "@/lib/crmChat";

export type BridgeMessage = {
  id: string;
  /** Nombre que muestra Zoho (el bot o el asesor) */
  name: string;
  text: string;
  /** Respuestas sugeridas (botones de Zoho) */
  options: string[];
};
export type BridgeHandlers = {
  onMessage: (m: BridgeMessage) => void;
  /** Zoho pide un formulario (nombre, contacto…): Joel ofrece completarlo en
   *  la ventana de Zoho o, si Zoho lo permite, omitirlo */
  onForm: (f: { canSkip: boolean }) => void;
};
export type Bridge = {
  send: (text: string) => boolean;
  choose: (option: string) => boolean;
  /** Pulsa "Omitir" en el formulario de Zoho */
  skip: () => boolean;
  showWindow: () => void;
  /** Vuelve a esconder la ventana (sigue trabajando fuera de la pantalla) */
  hideWindow: () => void;
  stop: () => void;
};

const AGENT = '[data-zsqa="agent_msg message_bubble"]';
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function chatDoc(): Document | null {
  const f = document.getElementById("siq_chatwindow") as HTMLIFrameElement | null;
  return f?.contentDocument ?? null;
}

/** Espera hasta que `find` devuelva algo (o se acabe el tiempo). */
async function until<T>(find: () => T | null | undefined, ms = 15_000): Promise<T> {
  const end = Date.now() + ms;
  for (;;) {
    const v = find();
    if (v) return v;
    if (Date.now() > end) throw new Error("bridge-timeout");
    await wait(200);
  }
}

/** Escribe en el campo de Zoho y envía (como si la persona pulsara Enter). */
function type(doc: Document, text: string): boolean {
  const ta = doc.querySelector<HTMLTextAreaElement>("textarea.siqcw-textarea");
  const win = doc.defaultView;
  if (!ta || !win || ta.disabled) return false;
  const setter = Object.getOwnPropertyDescriptor(win.HTMLTextAreaElement.prototype, "value")?.set;
  setter?.call(ta, text);
  ta.dispatchEvent(new win.Event("input", { bubbles: true }));
  ta.dispatchEvent(
    new win.KeyboardEvent("keydown", { key: "Enter", code: "Enter", keyCode: 13, which: 13, bubbles: true }),
  );
  return true;
}

/** Abre la conversación en el Zoho escondido, envía la pregunta y empieza a escuchar. */
export async function startBridge(question: string, h: BridgeHandlers): Promise<Bridge> {
  setBridging(true);
  try {
    return await connect(question, h);
  } catch (e) {
    setBridging(false);
    throw e;
  }
}

async function connect(question: string, h: BridgeHandlers): Promise<Bridge> {
  const z = await loadCrmChat();
  z.floatwindow?.visible("show");
  styleChatWindow();

  const doc = await until(() => {
    const d = chatDoc();
    return d?.querySelector(".home-icon-optns, textarea.siqcw-textarea") ? d : null;
  });
  // Inicio de Zoho → "Chatee con nosotros ahora"
  if (!doc.querySelector("textarea.siqcw-textarea")) {
    const start =
      doc.querySelector(".siqico-chat-start")?.closest<HTMLElement>(".home-icon-optns") ??
      doc.querySelector<HTMLElement>(".home-icon-optns");
    start?.click();
  }
  await until(() => doc.querySelector("textarea.siqcw-textarea"));

  // Lo que ya estaba en la ventana (de otra visita) no se repite en Joel
  const seen = new Set<string>();
  doc.querySelectorAll<HTMLElement>(AGENT).forEach((el) => el.id && seen.add(el.id));
  let asked = false;

  const scan = () => {
    for (const el of Array.from(doc.querySelectorAll<HTMLElement>(AGENT))) {
      if (!el.id || seen.has(el.id)) continue;
      const text = el.querySelector('[data-zsqa="msg"]')?.textContent?.trim() ?? "";
      const form = el.querySelector("input, select, .siqcw-dropdown-cont, .siqcw-btn");
      // El texto llega a veces antes que las opciones: se espera al siguiente cambio
      if (!text && !form) continue;
      seen.add(el.id);
      const name =
        el.closest(".siqcw-agentmsg-grp")?.querySelector(".siqcw-name-div")?.textContent?.trim() ?? "";
      const options = Array.from(el.querySelectorAll(".tag-div"))
        .map((t) => t.textContent?.trim() ?? "")
        .filter(Boolean);
      if (text) h.onMessage({ id: el.id, name, text, options });
      if (form) h.onForm({ canSkip: !!el.querySelector('[data-zsqa="skip_btn"]') });
    }
    // La pregunta se envía cuando el campo de texto está listo
    if (!asked && type(doc, question)) asked = true;
  };
  const obs = new MutationObserver(() => scan());
  obs.observe(doc.body, { childList: true, subtree: true, characterData: true });
  scan();

  return {
    send: (text) => type(doc, text),
    choose: (option) => {
      const tag = Array.from(doc.querySelectorAll<HTMLElement>(".tag-div")).find(
        (t) => t.textContent?.trim() === option,
      );
      tag?.click();
      return !!tag;
    },
    skip: () => {
      const btns = Array.from(doc.querySelectorAll<HTMLElement>('[data-zsqa="skip_btn"]'));
      const last = btns.at(-1);
      last?.click();
      return !!last;
    },
    showWindow: () => {
      setBridging(false);
      z.floatwindow?.visible("show");
      window.dispatchEvent(new CustomEvent(CRM_CHAT_EVENT, { detail: { open: true } }));
    },
    hideWindow: () => {
      setBridging(true);
      z.floatwindow?.visible("show");
    },
    stop: () => {
      obs.disconnect();
      z.floatwindow?.visible("hide");
      setBridging(false);
    },
  };
}
