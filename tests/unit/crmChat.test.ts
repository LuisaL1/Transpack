import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import {
  CRM_CHAT_EVENT,
  SALESIQ_SRC,
  loadCrmChat,
  openCrmChat,
  resetCrmChatForTests,
  setZohoHostForTests,
  styleChatWindow,
} from "@/lib/crmChat";

// Cargador del chat de Zoho SalesIQ (sin cargar el script real). En el sitio,
// Zoho vive en una página aislada (iframe); aquí esa página es la ventana de
// prueba (jsdom no carga iframes).
beforeEach(() => setZohoHostForTests(window));
afterEach(() => {
  resetCrmChatForTests();
  document.getElementById("zsiqscript")?.remove();
  delete window.$zoho;
  document.getElementById("siq_chatwindow")?.remove();
});

// Simula lo que hace el script de Zoho al cargar: completa la API y llama a ready()
function zohoLoads() {
  const calls: string[] = [];
  const z = window.$zoho!.salesiq!;
  Object.assign(z, {
    language: (l: string) => calls.push(`language:${l}`),
    floatbutton: { visible: (v: string) => calls.push(`button:${v}`) },
    floatwindow: {
      visible: (v: string) => calls.push(`window:${v}`),
      open: () => {},
      close: () => {},
      minimize: () => {},
    },
  });
  z.ready!();
  return calls;
}

describe("chat de Zoho SalesIQ", () => {
  it("no hace nada hasta que se pide abrir el chat", () => {
    expect(document.getElementById("zsiqscript")).toBeNull();
    expect(window.$zoho).toBeUndefined();
    expect(document.getElementById("tp-zoho-frame")).toBeNull();
  });

  it("carga el script una sola vez, en español y sin el botón de Zoho", async () => {
    const p = loadCrmChat();
    expect(loadCrmChat()).toBe(p);
    await Promise.resolve();
    await Promise.resolve();
    const s = document.getElementById("zsiqscript") as HTMLScriptElement;
    expect(s.src).toBe(SALESIQ_SRC);
    expect(document.querySelectorAll("#zsiqscript")).toHaveLength(1);
    const calls = zohoLoads();
    await p;
    expect(calls).toEqual(["language:es", "button:hide"]);
  });

  it("abre la ventana, avisa al sitio y entra directo a una conversación nueva", async () => {
    const events: boolean[] = [];
    const on = (e: Event) => events.push((e as CustomEvent<{ open: boolean }>).detail.open);
    window.addEventListener(CRM_CHAT_EVENT, on);
    // Ventana de Zoho falsa en su lista de conversaciones (sin ninguna en curso)
    const frame = document.createElement("iframe");
    frame.id = "siq_chatwindow";
    document.body.appendChild(frame);
    frame.contentDocument!.body.innerHTML = `<div data-zsqa="new_conversation" role="button">Conversación nueva</div>`;
    // Al tocar "Conversación nueva", Zoho muestra la conversación (campo de escribir)
    const newChat = vi.fn(() => {
      frame.contentDocument!.body.innerHTML = `<textarea class="siqcw-textarea"></textarea>`;
    });
    frame.contentDocument!.querySelector("[data-zsqa=new_conversation]")!.addEventListener("click", newChat);
    const p = openCrmChat();
    await Promise.resolve();
    await Promise.resolve();
    const calls = zohoLoads();
    await p;
    expect(calls).toContain("window:show");
    expect(events).toEqual([true]);
    expect(newChat).toHaveBeenCalledTimes(1);
    // Se avisa al sitio (se muestra la ventana) solo ya dentro de la conversación
    expect(events).toEqual([true]);
    window.removeEventListener(CRM_CHAT_EVENT, on);
    frame.remove();
  });

  it("si el script no carga, falla y permite reintentar", async () => {
    const p = loadCrmChat();
    await Promise.resolve();
    await Promise.resolve();
    document.getElementById("zsiqscript")!.dispatchEvent(new Event("error"));
    await expect(p).rejects.toThrow("load");
    expect(document.getElementById("zsiqscript")).toBeNull();
    expect(loadCrmChat()).not.toBe(p);
  });

  it("si Zoho no responde a tiempo, falla", async () => {
    vi.useFakeTimers();
    const p = loadCrmChat();
    await vi.advanceTimersByTimeAsync(15_000);
    await expect(p).rejects.toThrow("timeout");
    vi.useRealTimers();
  });
});

describe("chat de Zoho SalesIQ · diseño del sitio", () => {
  it("aplica los estilos del sitio dentro de la ventana de Zoho, una sola vez", () => {
    expect(styleChatWindow()).toBe(false); // todavía no existe la ventana
    const frame = document.createElement("iframe");
    frame.id = "siq_chatwindow";
    document.body.appendChild(frame);
    expect(styleChatWindow()).toBe(true);
    styleChatWindow();
    const styles = frame.contentDocument!.querySelectorAll("#tp-chat-style");
    expect(styles).toHaveLength(1);
  });

  it("la hoja de estilos usa la marca: azul, cuadrado naranja girado y la foto de Joel", () => {
    // Vitest no procesa CSS (css: false): se revisa el archivo directamente
    const css = readFileSync("src/styles/zoho-chat.css", "utf8");
    // Azul de la marca en lugar del verde de Zoho y cuadrado naranja girado
    expect(css).toContain("--siqcw-custom-bg-color: #272b7c");
    expect(css).toContain("rgba(255, 118, 25, 0.25)");
    expect(css).toContain("rotate(45deg)");
    expect(css).not.toMatch(/#356b58/i);
    // Foto de Joel embebida en el avatar (robot del bot, logo de marca y espera)
    expect(css).toMatch(
      /\.siqcw-bot-logo,\n\.siqcw-header \.embed-prof-cont,\n\.embed-prof-cont:has\([^)]*\.siqico-brand[^)]*\) \{[^}]*url\("data:image\/png;base64,/,
    );
    expect(existsSync("public/brand/joel-avatar.png")).toBe(true);
  });
});

describe("CSS para subir a Zoho (public/zoho-salesiq.css)", () => {
  // Cuerpo del CSS sin su comentario de cabecera
  const body = (path: string) => readFileSync(path, "utf8").replace(/^\/\*[\s\S]*?\*\/\s*/, "");

  it("es el mismo diseño que se inyecta en el sitio (src/styles/zoho-chat.css)", () => {
    const site = body("src/styles/zoho-chat.css");
    const zoho = body("public/zoho-salesiq.css");
    expect(zoho).toBe(site);
  });

  it("no usa rutas relativas (Zoho no conoce las del sitio): la foto va embebida", () => {
    const css = body("public/zoho-salesiq.css");
    expect(css).not.toMatch(/url\(["']?\//);
    expect(css).toContain("data:image/png;base64,");
  });
});
