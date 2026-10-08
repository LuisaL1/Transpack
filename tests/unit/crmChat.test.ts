import { afterEach, describe, expect, it, vi } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import {
  CRM_CHAT_EVENT,
  SALESIQ_SRC,
  loadCrmChat,
  openCrmChat,
  resetCrmChatForTests,
  styleChatWindow,
} from "@/lib/crmChat";

// Cargador del chat de Zoho SalesIQ (sin cargar el script real).
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
  });

  it("carga el script una sola vez, en español y sin el botón de Zoho", async () => {
    const p = loadCrmChat();
    expect(loadCrmChat()).toBe(p);
    const s = document.getElementById("zsiqscript") as HTMLScriptElement;
    expect(s.src).toBe(SALESIQ_SRC);
    expect(document.querySelectorAll("#zsiqscript")).toHaveLength(1);
    const calls = zohoLoads();
    await p;
    expect(calls).toEqual(["language:es", "button:hide"]);
  });

  it("abre la ventana y avisa al sitio", async () => {
    const events: boolean[] = [];
    const on = (e: Event) => events.push((e as CustomEvent<{ open: boolean }>).detail.open);
    window.addEventListener(CRM_CHAT_EVENT, on);
    const p = openCrmChat();
    const calls = zohoLoads();
    await p;
    expect(calls).toContain("window:show");
    expect(events).toEqual([true]);
    window.removeEventListener(CRM_CHAT_EVENT, on);
  });

  it("si el script no carga, falla y permite reintentar", async () => {
    const p = loadCrmChat();
    document.getElementById("zsiqscript")!.dispatchEvent(new Event("error"));
    await expect(p).rejects.toThrow("load");
    expect(document.getElementById("zsiqscript")).toBeNull();
    expect(loadCrmChat()).not.toBe(p);
  });

  it("si Zoho no responde a tiempo, falla", async () => {
    vi.useFakeTimers();
    const p = loadCrmChat();
    vi.advanceTimersByTime(15_000);
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
    expect(css).toMatch(/\.siqcw-bot-logo \{[^}]*url\("\/brand\/joel-avatar\.png"\)/);
    expect(existsSync("public/brand/joel-avatar.png")).toBe(true);
  });
});
