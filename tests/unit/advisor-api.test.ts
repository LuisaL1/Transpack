import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET, POST, makePass, mapMessages, readPass, resetZohoCache } from "../../api/advisor.mjs";

// Función /api/advisor (chat con un asesor dentro de Joel → Zoho SalesIQ).
// Nunca se llama a Zoho de verdad: fetch se simula.
const req = (body: unknown, headers: Record<string, string> = {}) =>
  new Request("https://www.transpacksas.com/api/advisor", {
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
  vi.stubEnv("ADVISOR_SECRET", "clave-de-prueba");
  vi.stubEnv("ZOHO_SALESIQ_APP_ID", "app1");
  vi.stubEnv("ZOHO_SALESIQ_DEPARTMENT_ID", "dep1");
}

// Zoho simulado: token OAuth, abrir conversación, enviar y leer mensajes
function zohoMock(messages: unknown[] = []) {
  return vi.fn(async (url: string, init?: RequestInit) => {
    if (url.includes("/oauth/v2/token")) return res({ access_token: "tok", expires_in: 3600 });
    if (url.endsWith("/api/visitor/v1/transpacksas/conversations"))
      return res({ data: { id: "conv123", start_time: "1700000000000" } });
    if (url.includes("/conversations/conv123/messages") && init?.method === "POST")
      return res({ data: {} });
    if (url.includes("/api/v2/transpacksas/conversations/conv123/messages"))
      return res({ data: messages });
    return res({}, 404);
  });
}

beforeEach(() => resetZohoCache());
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("/api/advisor", () => {
  it("sin credenciales responde 503 y el GET dice que no está configurado", async () => {
    expect(await (await GET()).json()).toEqual({ configured: false });
    expect((await POST(req({ action: "start", question: "Hola" }))).status).toBe(503);
  });

  it("con credenciales, el GET lo indica sin revelarlas", async () => {
    configure();
    expect(await (await GET()).text()).toBe('{"configured":true}');
  });

  it("rechaza envíos desde otro sitio", async () => {
    configure();
    const r = await POST(req({ action: "start", question: "Hola" }, { origin: "https://otro.com" }));
    expect(r.status).toBe(403);
  });

  it("abre la conversación en Zoho y entrega un pase firmado", async () => {
    configure();
    const f = zohoMock();
    vi.stubGlobal("fetch", f);
    const r = await POST(req({ action: "start", question: "Necesito cotizar", name: "Ana" }));
    expect(r.status).toBe(200);
    const { token } = (await r.json()) as { token: string };
    expect(readPass(token)?.c).toBe("conv123");
    const [url, init] = f.mock.calls[1] as [string, RequestInit & { headers: Record<string, string> }];
    expect(url).toBe("https://salesiq.zoho.com/api/visitor/v1/transpacksas/conversations");
    expect(init.headers.Authorization).toBe("Zoho-oauthtoken tok");
    const sent = JSON.parse(init.body as string);
    expect(sent).toMatchObject({
      app_id: "app1",
      department_id: "dep1",
      question: "Necesito cotizar",
      visitor: { name: "Ana" },
    });
    expect(sent.visitor.user_id).toMatch(/^web-/);
  });

  it("valida la pregunta y el mensaje", async () => {
    configure();
    vi.stubGlobal("fetch", zohoMock());
    expect((await POST(req({ action: "start", question: "" }))).status).toBe(422);
    expect((await POST(req({ action: "start", question: "x".repeat(2001) }))).status).toBe(422);
    const token = makePass({ c: "conv123", u: "web-1", t: 1, exp: Date.now() + 60_000 });
    expect((await POST(req({ action: "send", token, text: " " }))).status).toBe(422);
  });

  it("sin pase válido no deja leer ni escribir en una conversación", async () => {
    configure();
    const f = zohoMock();
    vi.stubGlobal("fetch", f);
    expect((await POST(req({ action: "send", token: "falso.pase", text: "hola" }))).status).toBe(403);
    // Pase alterado (otra conversación con la firma original)
    const good = makePass({ c: "conv123", u: "web-1", t: 1, exp: Date.now() + 60_000 });
    const forged = `${Buffer.from(JSON.stringify({ c: "otra", u: "x", t: 1, exp: Date.now() + 60_000 })).toString("base64url")}.${good.split(".")[1]}`;
    expect((await POST(req({ action: "poll", token: forged }))).status).toBe(403);
    // Pase vencido
    const old = makePass({ c: "conv123", u: "web-1", t: 1, exp: Date.now() - 1 });
    expect((await POST(req({ action: "poll", token: old }))).status).toBe(403);
    expect(f).not.toHaveBeenCalled();
  });

  it("envía el mensaje del visitante a su conversación", async () => {
    configure();
    const f = zohoMock();
    vi.stubGlobal("fetch", f);
    const token = makePass({ c: "conv123", u: "web-1", t: 1, exp: Date.now() + 60_000 });
    expect((await POST(req({ action: "send", token, text: "¿Siguen ahí?" }))).status).toBe(200);
    const [url, init] = f.mock.calls[1] as [string, RequestInit];
    expect(url).toBe(
      "https://salesiq.zoho.com/api/visitor/v1/transpacksas/conversations/conv123/messages",
    );
    expect(JSON.parse(init.body as string)).toEqual({ text: "¿Siguen ahí?" });
  });

  it("devuelve solo las respuestas nuevas del asesor (no las del visitante)", async () => {
    configure();
    vi.stubGlobal(
      "fetch",
      zohoMock([
        { sequence_id: "1", sender: { name: "Ana", id: "$v1" }, type: "text", message: { text: "Hola" } },
        {
          sequence_id: "2",
          sender: { name: "Laura", id: "830000001" },
          type: "info",
          message: { mode: "accepttransfer", operation_user: { name: "Laura" } },
        },
        { sequence_id: "3", sender: { name: "Laura", id: "830000001" }, type: "text", message: { text: "¡Hola Ana!" } },
      ]),
    );
    const token = makePass({ c: "conv123", u: "web-1", t: 1, exp: Date.now() + 60_000 });
    const r = await POST(req({ action: "poll", token, after: 1 }));
    const { messages } = (await r.json()) as { messages: { from: string; text: string; name: string }[] };
    expect(messages).toEqual([
      expect.objectContaining({ from: "system", text: "joined", name: "Laura" }),
      expect.objectContaining({ from: "operator", text: "¡Hola Ana!", name: "Laura" }),
    ]);
  });

  it("si Zoho falla responde 502 sin revelar el detalle", async () => {
    configure();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(res({ error: "detalle interno" }, 401)));
    const r = await POST(req({ action: "start", question: "Hola" }));
    expect(r.status).toBe(502);
    expect(await r.text()).not.toContain("detalle interno");
  });

  it("si faltan la marca o el departamento, usa los primeros del portal", async () => {
    configure();
    vi.stubEnv("ZOHO_SALESIQ_APP_ID", "");
    vi.stubEnv("ZOHO_SALESIQ_DEPARTMENT_ID", "");
    const base = zohoMock();
    const f = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.endsWith("/apps")) return res({ data: [{ id: "appX" }] });
      if (url.endsWith("/departments")) return res({ data: [{ id: "depX" }] });
      return base(url, init);
    });
    vi.stubGlobal("fetch", f);
    await POST(req({ action: "start", question: "Hola" }));
    const open = f.mock.calls.find(([u]) => String(u).endsWith("/conversations"))!;
    expect(JSON.parse((open[1] as RequestInit).body as string)).toMatchObject({
      app_id: "appX",
      department_id: "depX",
    });
  });
});

describe("/api/advisor · mensajes", () => {
  it("marca el fin de la conversación", () => {
    expect(
      mapMessages([{ sequence_id: "9", type: "info", message: { mode: "endchat" } }]),
    ).toEqual([expect.objectContaining({ from: "system", text: "ended" })]);
  });
});
