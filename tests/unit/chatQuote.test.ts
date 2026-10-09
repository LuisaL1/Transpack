import { describe, expect, it } from "vitest";
import { buildChat, teamQuoteMessage, validPhone } from "@/data/chat";

// Cotización hecha con Joel → mensaje para el chat de los asesores (seguimiento)
const d = {
  servicio: "internacional",
  pais_origen: "Colombia",
  pais_destino: "Estados Unidos",
  cuando: "Urgent (next few days)",
  nombre: "Luisa",
  telefono: "+57 300 123 4567",
};

describe("cotización del chat → equipo comercial", () => {
  it("el mensaje para el equipo va en español, marcado como nueva cotización, con nombre y celular", () => {
    const m = teamQuoteMessage(d, "en");
    expect(m).toMatch(/^🆕 NUEVA COTIZACIÓN para seguimiento/);
    expect(m).toContain("Cliente: Luisa");
    expect(m).toContain("Celular / WhatsApp: +57 300 123 4567");
    expect(m).toContain("• Servicio: Mudanza internacional");
    expect(m).toContain("• País de destino: Estados Unidos");
    expect(m).toContain("[Idioma del cliente: English]");
    expect(m).toContain("contactar al cliente");
    // El celular no se repite dentro del resumen
    expect(m.match(/\+57 300 123 4567/g)).toHaveLength(1);
  });

  it("pide el celular después del nombre y valida que esté completo", () => {
    const steps = buildChat("es");
    expect(steps.nombre.input!.next({ nombre: "Luisa" })).toBe("telefono");
    expect(steps.telefono.input!.next({ telefono: "300 123 4567" })).toBe("resumen");
    expect(steps.telefono.input!.next({ telefono: "123" })).toBe("telefono_otra");
    expect(validPhone("+1 (555) 123-4567")).toBe(true);
    expect(validPhone("abc")).toBe(false);
  });
});
