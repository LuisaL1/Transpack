// ─── Puente con Zoho SalesIQ ─────────────────────────────────────────────────
// Chat con un asesor DENTRO de la ventana de Joel sin la API de organización de
// Zoho: el widget de SalesIQ se carga escondido (en la página aislada
// public/chat-asesor.html, fuera de la pantalla) y este
// módulo escribe en su ventana y lee lo que responden el bot o el asesor de
// Zoho, para mostrarlo en Joel. Ver docs/chat-crm.md.
//
// · Textos y opciones (botones de sugerencia) pasan a Joel.
// · Las preguntas opcionales de datos del visitante que hace Zoho (nombre,
//   correo, teléfono) se omiten solas: Joel ya tiene la consulta y así Zoho
//   pasa la conversación a los asesores. Si un formulario no se puede omitir,
//   Joel ofrece llenarlo en la ventana de Zoho (onForm).
// · Depende de la estructura interna de la ventana de Zoho (clases y atributos
//   data-zsqa). Si Zoho la cambia, startBridge falla y Joel abre la ventana de
//   Zoho como respaldo.
import { announce, loadCrmChat, setBridging, styleChatWindow, zohoWindow } from "@/lib/crmChat";

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
  /** Un mensaje no se pudo entregar a Zoho en un minuto */
  onSendFailed?: (text: string) => void;
};
export type Bridge = {
  /** Envía (o deja en cola si Zoho tiene el campo bloqueado un momento) */
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

/** Documento de la ventana de Zoho (dentro de la página aislada) */
function chatDoc(): Document | null {
  const f = zohoWindow()?.document.getElementById("siq_chatwindow") as HTMLIFrameElement | null;
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

  // Mensajes del visitante en cola: después del primero, Zoho bloquea su campo
  // de texto unos segundos mientras pasa la conversación a los asesores.
  // Se envía uno a la vez y se confirma que aparezca en la conversación de Zoho
  // antes de seguir (Zoho pierde envíos muy seguidos).
  const queue: { text: string; at: number }[] = [{ text: question, at: Date.now() }];
  const QUEUE_MS = 60_000;
  const VISITOR = '[data-zsqa="visitor_msg message_bubble"]';
  // Zoho cambia el texto al mostrarlo (saltos de línea, emojis como imagen…):
  // se compara solo con letras y números.
  const norm = (text: string) => text.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
  // Cuántas veces aparece un texto entre los mensajes del visitante en Zoho
  const shown = (text: string) =>
    Array.from(doc.querySelectorAll(VISITOR)).filter(
      (el) => norm(el.querySelector('[data-zsqa="msg"]')?.textContent ?? "") === norm(text),
    ).length;
  const visitorCount = () => doc.querySelectorAll(VISITOR).length;
  // El campo de Zoho en su estado normal (no pidiendo nombre, correo o teléfono)
  const ta = doc.querySelector<HTMLTextAreaElement>("textarea.siqcw-textarea");
  const normalPlaceholder = ta?.placeholder ?? "";
  const ready = () => {
    const t = doc.querySelector<HTMLTextAreaElement>("textarea.siqcw-textarea");
    return !!t && !t.disabled && (!normalPlaceholder || t.placeholder === normalPlaceholder);
  };
  // Un envío no confirmado se reintenta, pero pocas veces: si Zoho lo recibió y
  // no se pudo confirmar, reintentar sin límite lo repetiría sin fin.
  const MAX_TRIES = 3;
  let tries = 0;
  // El primer mensaje (la pregunta): startBridge espera a que Zoho lo confirme
  let first: "pending" | "ok" | "failed" = "pending";
  let inFlight: { before: number; total: number; at: number } | null = null;
  const flush = () => {
    if (!queue.length) return;
    // Esperando que Zoho muestre el último envío: aparece su texto o, al
    // menos, un mensaje nuevo del visitante
    if (inFlight) {
      if (shown(queue[0].text) > inFlight.before || visitorCount() > inFlight.total) {
        queue.shift();
        inFlight = null;
        tries = 0;
        if (first === "pending") first = "ok";
      } else if (Date.now() - inFlight.at > 5000) {
        inFlight = null;
        if (tries >= MAX_TRIES) {
          tries = 0;
          fail(queue.shift()!.text);
        }
      } else return;
      if (!queue.length) return;
    }
    if (ready()) {
      const before = shown(queue[0].text);
      const total = visitorCount();
      if (type(doc, queue[0].text)) {
        tries++;
        inFlight = { before, total, at: Date.now() };
      }
    } else if (Date.now() - queue[0].at > QUEUE_MS) fail(queue.shift()!.text);
  };
  const fail = (text: string) => {
    if (first === "pending") first = "failed";
    else h.onSendFailed?.(text);
  };

  // Un mensaje de Zoho se procesa cuando ya está completo: el texto llega a
  // veces antes que sus botones o su formulario.
  const firstSeen = new Map<string, number>();
  const STABLE_MS = 700;

  const scan = () => {
    for (const el of Array.from(doc.querySelectorAll<HTMLElement>(AGENT))) {
      if (!el.id || seen.has(el.id)) continue;
      const t0 = firstSeen.get(el.id) ?? Date.now();
      firstSeen.set(el.id, t0);
      if (Date.now() - t0 < STABLE_MS) continue;
      seen.add(el.id);
      const text = el.querySelector('[data-zsqa="msg"]')?.textContent?.trim() ?? "";
      const form = el.querySelector("input, select, .siqcw-dropdown-cont, .siqcw-btn");
      const skip = el.querySelector<HTMLElement>('[data-zsqa="skip_btn"]');
      // Preguntas opcionales de datos del visitante (nombre, correo, teléfono):
      // Joel ya tiene la consulta, así que se omiten para que Zoho pase la
      // conversación a los asesores sin esperar.
      // (a veces con formulario, a veces en el campo de texto de Zoho)
      if (skip) {
        skip.click();
        continue;
      }
      const name =
        el.closest(".siqcw-agentmsg-grp")?.querySelector(".siqcw-name-div")?.textContent?.trim() ?? "";
      const options = Array.from(el.querySelectorAll(".tag-div"))
        .map((t) => t.textContent?.trim() ?? "")
        .filter(Boolean);
      if (text) h.onMessage({ id: el.id, name, text, options });
      // Un formulario obligatorio (sin "Omitir") solo se puede llenar en la ventana de Zoho
      if (form) h.onForm({ canSkip: false });
    }
    // Lo que esté en cola se envía cuando el campo de texto está libre
    flush();
  };
  const obs = new MutationObserver(() => scan());
  obs.observe(doc.body, { childList: true, subtree: true, characterData: true });
  // Revisión periódica: procesa los mensajes que ya quedaron completos
  const timer = window.setInterval(scan, 400);
  scan();

  // Solo hay conversación si Zoho recibió la pregunta: si no, se deja todo
  // como estaba y Joel ofrece otro canal (en vez de decir "Listo").
  const stopAll = () => {
    obs.disconnect();
    window.clearInterval(timer);
    queue.length = 0;
  };
  try {
    await until(() => (first === "pending" ? null : first), 30_000);
  } catch {
    first = "failed";
  }
  if (first === "failed") {
    stopAll();
    throw new Error("bridge-send");
  }

  return {
    send: (text) => {
      queue.push({ text, at: Date.now() });
      flush();
      return true;
    },
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
      announce(true);
    },
    hideWindow: () => {
      setBridging(true);
      z.floatwindow?.visible("show");
    },
    stop: () => {
      stopAll();
      z.floatwindow?.visible("hide");
      setBridging(false);
      document.documentElement.classList.remove("tp-zoho-open");
    },
  };
}
