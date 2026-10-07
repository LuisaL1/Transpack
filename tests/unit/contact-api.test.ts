import { afterEach, describe, expect, it, vi } from "vitest";
import { BRAND, DEFAULT_LEADS_TO, GET, POST, PRIVACY_PATH, confirmation } from "../../api/contact";
import { CONTACT } from "@/data/site";
import { LANGS, localize } from "@/i18n";

// Función /api/contact (Vercel → Brevo). No envía nada real: fetch se simula.
const req = (body: unknown, headers: Record<string, string> = {}) =>
  new Request("https://www.transpacksas.com/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", host: "www.transpacksas.com", ...headers },
    body: JSON.stringify(body),
  });
const valid = {
  kind: "contacto",
  subject: "Contacto web — Otro",
  fields: { Nombre: "Ana", Correo: "ana@empresa.com", Mensaje: "Hola <b>", "Autorización de datos": "Sí" },
  replyTo: { email: "ana@empresa.com", name: "Ana Prueba" },
};
const ok = () => new Response("{}", { status: 201 });
const sentBody = (f: ReturnType<typeof vi.fn>, call = 0) =>
  JSON.parse((f.mock.calls[call][1] as RequestInit).body as string);

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("/api/contact", () => {
  it("sin clave de Brevo responde 503 (no configurado)", async () => {
    vi.stubEnv("BREVO_API_KEY", "");
    const r = await POST(req(valid));
    expect(r.status).toBe(503);
    expect(await r.json()).toMatchObject({ error: "not-configured" });
  });

  it("exige correo válido y autorización de datos", async () => {
    vi.stubEnv("BREVO_API_KEY", "k");
    expect((await POST(req({ ...valid, replyTo: { email: "no-es-correo" } }))).status).toBe(422);
    expect(
      (await POST(req({ ...valid, fields: { ...valid.fields, "Autorización de datos": "" } }))).status,
    ).toBe(422);
    expect((await POST(req({ ...valid, fields: {} }))).status).toBe(422);
  });

  it("rechaza JSON inválido", async () => {
    vi.stubEnv("BREVO_API_KEY", "k");
    const bad = new Request("https://www.transpacksas.com/api/contact", {
      method: "POST",
      headers: { host: "www.transpacksas.com" },
      body: "{no es json",
    });
    expect((await POST(bad)).status).toBe(400);
  });

  it("rechaza envíos desde otro sitio", async () => {
    vi.stubEnv("BREVO_API_KEY", "k");
    expect((await POST(req(valid, { origin: "https://otro-sitio.com" }))).status).toBe(403);
  });

  it("el campo trampa (bots) responde OK sin enviar", async () => {
    const f = vi.fn();
    vi.stubGlobal("fetch", f);
    vi.stubEnv("BREVO_API_KEY", "k");
    expect((await POST(req({ ...valid, website: "spam" }))).status).toBe(200);
    expect(f).not.toHaveBeenCalled();
  });

  it("envía a Brevo al correo de Transpack, con respuesta al visitante y HTML escapado", async () => {
    const f = vi.fn().mockResolvedValue(ok());
    vi.stubGlobal("fetch", f);
    vi.stubEnv("BREVO_API_KEY", "k");
    const r = await POST(req(valid, { origin: "https://www.transpacksas.com" }));
    expect(r.status).toBe(200);
    const [url, init] = f.mock.calls[0] as [string, RequestInit & { headers: Record<string, string> }];
    expect(url).toBe("https://api.brevo.com/v3/smtp/email");
    expect(init.headers["api-key"]).toBe("k");
    const sent = sentBody(f);
    expect(sent.to[0].email).toBe("servicioalcliente@transpacksas.com");
    expect(sent.replyTo.email).toBe("ana@empresa.com");
    expect(sent.sender.email).toBe("no-reply@transpacksas.com");
    expect(sent.tags).toEqual(["sitio-contacto"]);
    expect(sent.htmlContent).toContain("Hola &lt;b&gt;");
    expect(sent.htmlContent).not.toContain("<b>");
    expect(sent.textContent).toContain("Mensaje: Hola <b>");
  });

  it("usa LEADS_TO, LEADS_FROM y LEADS_FROM_NAME si están definidas", async () => {
    const f = vi.fn().mockResolvedValue(ok());
    vi.stubGlobal("fetch", f);
    vi.stubEnv("BREVO_API_KEY", "k");
    vi.stubEnv("LEADS_TO", "comercial@transpacksas.com");
    vi.stubEnv("LEADS_FROM", "web@transpacksas.com");
    vi.stubEnv("LEADS_FROM_NAME", "Web");
    await POST(req(valid));
    expect(sentBody(f).to[0].email).toBe("comercial@transpacksas.com");
    expect(sentBody(f).sender).toEqual({ email: "web@transpacksas.com", name: "Web" });
    expect(sentBody(f, 1).replyTo.email).toBe("comercial@transpacksas.com");
  });

  it("envía la confirmación automática al visitante, en su idioma", async () => {
    const f = vi.fn().mockResolvedValue(ok());
    vi.stubGlobal("fetch", f);
    vi.stubEnv("BREVO_API_KEY", "k");
    await POST(req(valid));
    expect(f).toHaveBeenCalledTimes(2);
    const conf = sentBody(f, 1);
    expect(conf.to[0].email).toBe("ana@empresa.com");
    expect(conf.replyTo.email).toBe(DEFAULT_LEADS_TO);
    expect(conf.subject).toBe("Recibimos tu solicitud · Transpack");
    expect(conf.htmlContent).toContain("Hola Ana,");
    expect(conf.htmlContent).toContain("https://www.transpacksas.com/privacidad");
    expect(conf.tags).toEqual(["sitio-contacto-confirmacion"]);

    f.mockClear();
    await POST(req({ ...valid, kind: "cotizacion", lang: "de", about: "Internationaler Umzug" }));
    const de = sentBody(f, 1);
    expect(de.subject).toMatch(/Wir haben Ihre Anfrage erhalten/);
    expect(de.htmlContent).toContain("<strong>Internationaler Umzug</strong>");
    expect(de.htmlContent).toContain("https://www.transpacksas.com/de/datenschutz");
    expect(sentBody(f).tags).toEqual(["sitio-cotizacion"]);
  });

  it("si falla solo la confirmación, la solicitud igual se da por enviada", async () => {
    const f = vi.fn().mockResolvedValueOnce(ok()).mockRejectedValueOnce(new Error("x"));
    vi.stubGlobal("fetch", f);
    vi.stubEnv("BREVO_API_KEY", "k");
    expect((await POST(req(valid))).status).toBe(200);
  });

  it("si Brevo falla responde 502", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 401 })));
    vi.stubEnv("BREVO_API_KEY", "k");
    expect((await POST(req(valid))).status).toBe(502);
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("red")));
    expect((await POST(req(valid))).status).toBe(502);
  });

  it("el diagnóstico (GET) dice si falta la clave sin revelarla", async () => {
    vi.stubEnv("BREVO_API_KEY", "");
    expect(await (await GET()).json()).toEqual({ configured: false });
    vi.stubEnv("BREVO_API_KEY", "secreta");
    const text = await (await GET()).text();
    expect(text).toBe('{"configured":true}');
  });
});

describe("/api/contact · datos de la confirmación", () => {
  it("usa los mismos teléfonos, WhatsApp y razón social del sitio", () => {
    expect(BRAND.phones).toEqual(CONTACT.phones);
    expect(BRAND.whatsapp).toBe(CONTACT.whatsapp);
    expect(BRAND.legalName).toBe(CONTACT.legalName);
    expect(DEFAULT_LEADS_TO).toBe(CONTACT.email);
  });

  it("enlaza la política de datos en la ruta de cada idioma", () => {
    for (const l of LANGS) expect(PRIVACY_PATH[l], l).toBe(localize("/privacidad", l));
  });

  it("escapa el nombre y el tema del visitante", () => {
    const c = confirmation("cotizacion", "<script>x</script>", {}, "es", "<img src=x>");
    expect(c.html).not.toMatch(/<script>|<img/);
  });
});
