import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET, POST, isConfigured, resetTokenCache } from "../../api/ticket.mjs";

// Función /api/ticket (crea un ticket en Zoho Desk). Nunca se llama a Zoho de
// verdad: fetch se simula.
const req = (body: unknown, headers: Record<string, string> = {}) =>
  new Request("https://www.transpacksas.com/api/ticket", {
    method: "POST",
    headers: { "Content-Type": "application/json", host: "www.transpacksas.com", ...headers },
    body: JSON.stringify(body),
  });
const res = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

function configure() {
  vi.stubEnv("ZOHO_CLIENT_ID", "id");
  vi.stubEnv("ZOHO_CLIENT_SECRET", "secret");
  vi.stubEnv("ZOHO_REFRESH_TOKEN", "refresh");
  vi.stubEnv("ZOHO_ORG_ID", "99999");
  vi.stubEnv("ZOHO_DEPARTMENT_ID", "dep1");
}

// Zoho Desk simulado: token OAuth, búsqueda de contacto, crear contacto y ticket.
// `contactHit` permite simular que el contacto ya existe (reutiliza su id).
function deskMock(contactHit: { id: string } | null = null) {
  return vi.fn(async (url: string, init?: RequestInit) => {
    if (url.includes("/oauth/v2/token")) return res({ access_token: "tok", expires_in: 3600 });
    if (url.includes("/api/v1/contacts/search"))
      return res({ data: contactHit ? [contactHit] : [] });
    if (url.endsWith("/api/v1/contacts") && init?.method === "POST")
      return res({ id: "contact-new" });
    if (url.endsWith("/api/v1/tickets") && init?.method === "POST")
      return res({ id: "ticket-1", ticketNumber: "101" });
    return res({}, 404);
  });
}

const okBody = { name: "Juan Pérez", email: "juan@example.com", subject: "Prueba", message: "Hola" };

beforeEach(() => resetTokenCache());
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("/api/ticket", () => {
  it("sin credenciales responde 503 y el GET dice que no está configurado", async () => {
    expect(isConfigured()).toBe(false);
    expect(await (await GET()).json()).toEqual({ configured: false });
    expect((await POST(req(okBody))).status).toBe(503);
  });

  it("con credenciales, el GET lo indica sin revelarlas", async () => {
    configure();
    expect(await (await GET()).text()).toBe('{"configured":true}');
  });

  it("rechaza envíos desde otro sitio", async () => {
    configure();
    const r = await POST(req(okBody, { origin: "https://otro.com" }));
    expect(r.status).toBe(403);
  });

  it("valida el asunto, el formato del correo y que haya algún contacto", async () => {
    configure();
    vi.stubGlobal("fetch", deskMock());
    expect((await POST(req({ ...okBody, subject: "" }))).status).toBe(422);
    expect((await POST(req({ ...okBody, email: "no-es-correo" }))).status).toBe(422);
    // Sin correo NI teléfono: no hay a quién contactar
    expect((await POST(req({ ...okBody, email: "" }))).status).toBe(422);
  });

  it("crea el ticket solo con teléfono (correo opcional, como el cotizador)", async () => {
    configure();
    vi.stubGlobal("fetch", deskMock());
    const r = await POST(req({ name: "Ana", phone: "3001234567", subject: "Cotización", message: "Hola" }));
    expect(r.status).toBe(200);
    expect(((await r.json()) as { ok: boolean }).ok).toBe(true);
  });

  it("crea el contacto y el ticket, y devuelve su número", async () => {
    configure();
    const f = deskMock();
    vi.stubGlobal("fetch", f);
    const r = await POST(req(okBody));
    expect(r.status).toBe(200);
    expect(await r.json()).toEqual({ ok: true, id: "ticket-1", ticketNumber: "101" });

    // La última llamada es la creación del ticket, con los campos correctos
    const [url, init] = f.mock.calls.at(-1) as [
      string,
      RequestInit & { headers: Record<string, string> },
    ];
    expect(url).toBe("https://desk.zoho.com/api/v1/tickets");
    expect(init.headers.orgId).toBe("99999");
    expect(init.headers.Authorization).toBe("Zoho-oauthtoken tok");
    expect(JSON.parse(init.body as string)).toMatchObject({
      subject: "Prueba",
      departmentId: "dep1",
      contactId: "contact-new",
      description: "Hola",
      email: "juan@example.com",
    });
  });

  it("reutiliza el contacto si ya existe (no lo crea de nuevo)", async () => {
    configure();
    const f = deskMock({ id: "contact-existing" });
    vi.stubGlobal("fetch", f);
    const r = await POST(req(okBody));
    expect(r.status).toBe(200);
    // No hubo POST a /contacts (solo la búsqueda), y el ticket usa el id hallado
    const createdContact = f.mock.calls.some(
      ([u, i]) => String(u).endsWith("/api/v1/contacts") && (i as RequestInit)?.method === "POST",
    );
    expect(createdContact).toBe(false);
    const ticketCall = f.mock.calls.find(([u]) => String(u).endsWith("/api/v1/tickets"));
    expect(JSON.parse((ticketCall![1] as RequestInit).body as string).contactId).toBe(
      "contact-existing",
    );
  });

  it("si Zoho falla, responde 502 sin filtrar el detalle", async () => {
    configure();
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) =>
        url.includes("/oauth/v2/token")
          ? res({ access_token: "tok", expires_in: 3600 })
          : res({ message: "INVALID_OAUTH", errorCode: "scope" }, 401),
      ),
    );
    const r = await POST(req(okBody));
    expect(r.status).toBe(502);
    expect(await r.json()).toMatchObject({ ok: false, error: "provider" });
  });
});
