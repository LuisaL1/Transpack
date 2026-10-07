import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import {
  BRAND,
  DEFAULT_LEADS_TO,
  GET,
  POST,
  PRIVACY_PATH,
  baseUrl,
  confirmation,
  layout,
} from "../../api/contact";
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
    vi.stubEnv("LEADS_FROM_NAME", "");
    f.mockClear();
    await POST(req(valid));
    // Sin LEADS_FROM_NAME, el remitente es la marca (no "Sitio web …")
    expect(sentBody(f).sender.name).toBe("Transpack");
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
    expect(conf.subject).toBe("Recibimos su solicitud · Transpack");
    expect(conf.htmlContent).toContain("le responderá a este correo a la mayor brevedad");
    expect(conf.htmlContent).toContain(`href="https://wa.me/${CONTACT.whatsapp}"`);
    expect(conf.htmlContent).toContain("Hola Ana,");
    expect(conf.htmlContent).toContain("https://www.transpacksas.com/privacidad");
    expect(conf.tags).toEqual(["sitio-contacto-confirmacion"]);

    f.mockClear();
    await POST(req({ ...valid, kind: "cotizacion", lang: "de", about: "Internationaler Umzug" }));
    const de = sentBody(f, 1);
    expect(de.subject).toMatch(/Wir haben Ihre Anfrage erhalten/);
    expect(de.htmlContent).toMatch(/<strong[^>]*>Internationaler Umzug<\/strong>/);
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
    expect(c.html).not.toMatch(/<script>|<img src=x>/);
    expect(c.html).toContain("&lt;img src=x&gt;");
  });
});

describe("/api/contact · diseño de los correos", () => {
  it("ambos correos llevan el banner de la marca desde el dominio de la solicitud", async () => {
    const f = vi.fn().mockResolvedValue(ok());
    vi.stubGlobal("fetch", f);
    vi.stubEnv("BREVO_API_KEY", "k");
    await POST(req(valid, { host: "transpack-git-main.vercel.app" }));
    for (const call of [0, 1]) {
      const html: string = sentBody(f, call).htmlContent;
      expect(html).toContain(
        '<img src="https://transpack-git-main.vercel.app/brand/email-header.png" width="560" alt="Transpack S.A.S."',
      );
      expect(html).toContain('<meta name="color-scheme" content="light only">');
      expect(html).toContain('role="presentation"');
      expect(html).toContain('bgcolor="#272B7C"');
      // Pie con razón social, dirección y teléfono del sitio
      expect(html).toContain(CONTACT.address);
      expect(html).toContain(CONTACT.phones[0]);
    }
    // Correo al equipo: título = asunto y nota para responder
    const lead = sentBody(f).htmlContent as string;
    expect(lead).toContain(">Contacto web — Otro</h1>");
    expect(lead).toContain("Responda este correo para contestarle directamente a la persona.");
  });

  it("el dominio base no acepta valores extraños", () => {
    const r = (host: string) =>
      baseUrl(new Request("https://x/api/contact", { headers: { host } }));
    expect(r("www.transpacksas.com")).toBe("https://www.transpacksas.com");
    expect(r("localhost:5173")).toBe("http://localhost:5173");
    expect(r('evil.com"><script>')).toBe(BRAND.site);
  });

  it("la plantilla escapa el título y respeta el árabe de derecha a izquierda", () => {
    expect(layout("https://a.co", "<b>x</b>", "")).toContain("&lt;b&gt;x&lt;/b&gt;");
    expect(confirmation("contacto", "Ali", {}, "ar").html).toContain('dir="rtl"');
  });

  it("el banner existe, mide 1120 × 220 px y pesa menos de 60 KB", () => {
    const png = readFileSync("public/brand/email-header.png");
    expect(png.subarray(1, 4).toString()).toBe("PNG");
    expect(png.readUInt32BE(16)).toBe(1120);
    expect(png.readUInt32BE(20)).toBe(220);
    expect(png.length).toBeLessThan(60 * 1024);
  });
});

