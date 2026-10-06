import { describe, expect, it } from "vitest";
import { routeChat } from "@/lib/chatRoute";
import { buildChat } from "@/data/chat";
import { LANGS } from "@/i18n";

// Chat en inglés, francés, alemán, italiano y árabe: palabras clave → paso del chat guiado
describe("Chat en otros idiomas", () => {
  it("lleva cada intención al paso correcto", () => {
    expect(routeChat("I need to talk to an advisor").next).toBe("human");
    expect(routeChat("We are an embassy").next).toBe("corp");
    expect(routeChat("Je cherche un garde-meuble").next).toBe("bod_que");
    expect(routeChat("Umzug ins Ausland").set?.servicio).toBe("internacional");
    expect(routeChat("كم يستغرق").next).toBe("faq_answer");
    expect(routeChat("asdfgh").next).toBe("fallback");
  });

  it("cada paso al que lleva existe en la conversación de cada idioma", () => {
    const targets = [
      "human",
      "corp",
      "bod_que",
      "faq_answer",
      "int_info",
      "origen",
      "svc",
      "servicios",
      "menu",
      "fallback",
    ];
    for (const lang of LANGS) {
      const steps = buildChat(lang);
      for (const t of targets) expect(steps[t], `${lang}: ${t}`).toBeDefined();
    }
  });

  it("todas las opciones del chat guiado llevan a un paso que existe", () => {
    for (const lang of LANGS) {
      const steps = buildChat(lang);
      for (const [id, s] of Object.entries(steps)) {
        const options =
          typeof s.options === "function" ? s.options({ servicio: "local" }) : (s.options ?? []);
        for (const o of options) {
          const next = typeof o.next === "function" ? o.next({ servicio: "local" }) : o.next;
          if (next !== "reset") expect(steps[next], `${lang}: ${id} → ${next}`).toBeDefined();
        }
      }
    }
  });
});
