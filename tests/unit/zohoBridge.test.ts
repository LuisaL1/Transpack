import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Puente con Zoho (src/lib/zohoBridge.ts) sobre una ventana de Zoho FALSA:
// nunca se carga el widget real en las pruebas.
const z = { floatwindow: { visible: vi.fn() } };
vi.mock("@/lib/crmChat", () => ({
  loadCrmChat: vi.fn(async () => z),
  setBridging: vi.fn(),
  styleChatWindow: vi.fn(),
  announce: vi.fn(),
  // La página aislada de Zoho: aquí, la misma ventana de prueba
  zohoWindow: () => window,
}));
const { startBridge } = await import("@/lib/zohoBridge");
const { setBridging } = await import("@/lib/crmChat");

let doc: Document;
const sent: string[] = [];

// Ventana falsa: inicio con "Chatee con nosotros ahora"; al pulsarlo, campo de texto
function fakeZoho() {
  const frame = document.createElement("iframe");
  frame.id = "siq_chatwindow";
  document.body.appendChild(frame);
  doc = frame.contentDocument!;
  doc.body.innerHTML = `<div class="home-icon-optns"><em class="siqico-chat-start"></em></div><div id="scroll-container"></div>`;
  doc.querySelector(".home-icon-optns")!.addEventListener("click", () => {
    const ta = doc.createElement("textarea");
    ta.className = "siqcw-textarea";
    ta.addEventListener("keydown", (e) => {
      if ((e as KeyboardEvent).key === "Enter") sent.push(ta.value);
    });
    doc.body.appendChild(ta);
  });
}

// Mensaje del bot o del asesor de Zoho (misma estructura que la ventana real)
function agentSays(id: string, name: string, text: string, extra = "") {
  const grp = doc.createElement("div");
  grp.className = "siqcw-agentmsg-grp";
  grp.innerHTML = `<div class="siqcw-name-div">${name}</div><div class="chat-bubble-cont" id="${id}" data-zsqa="agent_msg message_bubble"><span data-zsqa="msg">${text}</span>${extra}</div>`;
  doc.getElementById("scroll-container")!.appendChild(grp);
}
// El puente procesa cada mensaje cuando ya está completo (unos 700 ms)
const tick = () => new Promise((r) => setTimeout(r, 1300));

beforeEach(() => {
  sent.length = 0;
  fakeZoho();
});
afterEach(() => {
  document.getElementById("siq_chatwindow")?.remove();
  vi.clearAllMocks();
});

describe("puente con Zoho (chat con un asesor dentro de Joel)", () => {
  it("abre la conversación escondida y envía la pregunta", async () => {
    await startBridge("Necesito cotizar", { onMessage: vi.fn(), onForm: vi.fn() });
    expect(setBridging).toHaveBeenCalledWith(true);
    expect(z.floatwindow.visible).toHaveBeenCalledWith("show");
    expect(sent).toEqual(["Necesito cotizar"]);
  });

  it("pasa a Joel los mensajes nuevos con su nombre y sus opciones", async () => {
    const onMessage = vi.fn();
    const b = await startBridge("Hola", { onMessage, onForm: vi.fn() });
    agentSays("m1", "Laura", "¡Hola! ¿Qué servicio necesitas?", `<div class="tag-div">Mudanza local</div><div class="tag-div">Bodegaje</div>`);
    await tick();
    expect(onMessage).toHaveBeenCalledWith({
      id: "m1",
      name: "Laura",
      text: "¡Hola! ¿Qué servicio necesitas?",
      options: ["Mudanza local", "Bodegaje"],
    });
    // Elegir una opción pulsa el botón correspondiente en Zoho
    const clicked = vi.fn();
    doc.querySelectorAll(".tag-div")[1].addEventListener("click", clicked);
    expect(b.choose("Bodegaje")).toBe(true);
    expect(clicked).toHaveBeenCalled();
    // Lo que el visitante escribe después va a Zoho
    expect(b.send("Somos dos")).toBe(true);
    expect(sent.at(-1)).toBe("Somos dos");
  });

  it("no repite mensajes ya vistos", async () => {
    const onMessage = vi.fn();
    await startBridge("Hola", { onMessage, onForm: vi.fn() });
    agentSays("m1", "Laura", "Hola");
    await tick();
    agentSays("m2", "Laura", "¿En qué te ayudo?");
    await tick();
    await tick();
    expect(onMessage.mock.calls.map((c) => c[0].id)).toEqual(["m1", "m2"]);
  });

  it("omite solas las preguntas opcionales de datos de Zoho (para que pase a los asesores)", async () => {
    const onForm = vi.fn();
    const onMessage = vi.fn();
    await startBridge("Hola", { onMessage, onForm });
    const skipped = vi.fn();
    agentSays(
      "f1",
      "Transpack",
      "¿Cómo quiere que le contactemos?",
      `<input class="siqcw-input"><span data-zsqa="skip_btn">Omitir</span>`,
    );
    doc.querySelector('[data-zsqa="skip_btn"]')!.addEventListener("click", skipped);
    // También cuando la pregunta usa el campo de texto de Zoho (solo trae "Omitir")
    agentSays("f2", "Transpack", "¿Podemos enviarle un correo electrónico?", `<span data-zsqa="skip_btn">Omitir</span>`);
    await tick();
    expect(skipped).toHaveBeenCalled();
    expect(onMessage).not.toHaveBeenCalled();
    expect(onForm).not.toHaveBeenCalled();
  });

  it("si un formulario no se puede omitir, Joel ofrece llenarlo en la ventana de Zoho", async () => {
    const onForm = vi.fn();
    await startBridge("Hola", { onMessage: vi.fn(), onForm });
    agentSays("f3", "Transpack", "Indique su nombre", `<input class="siqcw-input">`);
    await tick();
    expect(onForm).toHaveBeenCalledWith({ canSkip: false });
  });

  it("al terminar deja de escuchar y esconde la ventana", async () => {
    const onMessage = vi.fn();
    const b = await startBridge("Hola", { onMessage, onForm: vi.fn() });
    b.stop();
    agentSays("m9", "Laura", "¿Sigues ahí?");
    await tick();
    expect(onMessage).not.toHaveBeenCalled();
    expect(z.floatwindow.visible).toHaveBeenLastCalledWith("hide");
    expect(setBridging).toHaveBeenLastCalledWith(false);
  });

  it("si la ventana de Zoho no aparece, falla y deja de esconderla", async () => {
    document.getElementById("siq_chatwindow")!.remove();
    vi.useFakeTimers();
    const p = startBridge("Hola", { onMessage: vi.fn(), onForm: vi.fn() });
    const check = expect(p).rejects.toThrow("bridge-timeout");
    await vi.advanceTimersByTimeAsync(16_000);
    await check;
    expect(setBridging).toHaveBeenLastCalledWith(false);
    vi.useRealTimers();
  });
});
