import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { buildChat, optionIcon, type ChatOption } from "@/data/chat";
import { joelKnowledge } from "@/data/joelKnowledge";
import { createJoel, newMemory } from "@/lib/joel";
import { LANGS } from "@/i18n";

// Todas las opciones del chat se muestran como lista con ícono: cada una debe
// tener el suyo y debe existir en Bootstrap Icons (si no, se ve un recuadro vacío).
const CSS = readFileSync("node_modules/bootstrap-icons/font/bootstrap-icons.css", "utf8");
const exists = (icon: string) => CSS.includes(`.bi-${icon}::before`);
const DATA = { servicio: "local" };
const optionsOf = (o: ChatOption[] | ((d: Record<string, string>) => ChatOption[]) | undefined) =>
  typeof o === "function" ? o(DATA) : (o ?? []);

describe("Íconos del chat", () => {
  it("cada opción del chat guiado tiene un ícono propio que existe, en los seis idiomas", () => {
    for (const lang of LANGS)
      for (const [id, step] of Object.entries(buildChat(lang))) {
        for (const o of optionsOf(step.options)) {
          const icon = optionIcon(o);
          expect(icon, `${lang} · ${id} · ${o.label}`).not.toBe("chat-dots");
          expect(exists(icon), `${lang} · ${id} · ${icon}`).toBe(true);
        }
        for (const a of step.actions?.(DATA) ?? [])
          expect(exists(a.icon), `${lang} · ${id} · acción ${a.icon}`).toBe(true);
      }
  });

  it("los servicios usan el mismo ícono de su tarjeta en el sitio", () => {
    const svc = buildChat("es").svc;
    const icons = optionsOf(svc.options).map(optionIcon);
    expect(icons).toEqual(["house-door", "truck", "globe-americas", "boxes"]);
  });

  it("las opciones y acciones que arma Joel también tienen ícono existente", () => {
    const joel = createJoel(joelKnowledge());
    const preguntas = [
      "hola",
      "cuanto cuesta una mudanza internacional",
      "me trasladan a Alemania en dos meses",
      "¿tienen seguro?",
      "es muy caro",
      "xyzzy",
      "eres chatgpt?",
      "¿hacen mudanzas de oficina?",
    ];
    for (const r of [joel.greeting(), ...preguntas.map((q) => joel.respond(q, newMemory()))]) {
      for (const o of r.options ?? [])
        expect(exists(optionIcon(o)), `${r.intent} · ${o.label}`).toBe(true);
      for (const a of r.actions ?? []) expect(exists(a.icon), `${r.intent} · ${a.icon}`).toBe(true);
    }
  });

  it("toda opción recibe un ícono, aunque no traiga uno (nunca vacío)", () => {
    expect(optionIcon({ label: "¿Algo nuevo?", next: "x" })).toBe("question-circle");
    expect(optionIcon({ label: "Cotizar bodegaje", next: "x" })).toBe("card-checklist");
    expect(optionIcon({ label: "Ver el blog", next: "x" })).toBe("box-arrow-up-right");
    expect(optionIcon({ label: "Hablar con alguien", next: "x" })).toBe("headset");
    expect(optionIcon({ label: "Algo imprevisto", next: "x" })).toBe("chat-dots");
    expect(optionIcon({ label: "x", next: "x", set: { servicio: "empresarial" } })).toBe(
      "buildings",
    );
  });
});
