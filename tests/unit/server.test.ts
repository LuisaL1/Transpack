import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { createServer, type Server } from "node:http";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { gzipSync } from "node:zlib";
import { createHandler, MAX_BODY, sourceRegex } from "../../server/server.mjs";

// Servidor del sitio en GoDaddy (server/server.mjs) sobre un dist/ de prueba.
// Nunca envía correos: el fetch a Brevo se simula.
const root = mkdtempSync(join(tmpdir(), "tp-dist-"));
const put = (f: string, s: string) => {
  mkdirSync(join(root, f, ".."), { recursive: true });
  writeFileSync(join(root, f), s);
};
put("index.html", "<h1>Inicio</h1>");
put("nosotros.html", "<h1>Nosotros</h1>");
put("en.html", "<h1>Home</h1>");
put("en/about.html", "<h1>About</h1>");
put("404.html", "<h1>No existe</h1>");
put("chat-asesor.html", "<p>chat</p>");
put("assets/app-abc123.js", "console.log(1)");
writeFileSync(join(root, "assets/app-abc123.js.gz"), gzipSync("console.log(1)"));
put("sitemap.xml", "<urlset/>");

let server: Server;
let base = "";
const get = (path: string, init: RequestInit = {}) =>
  fetch(base + path, { redirect: "manual", ...init });

beforeAll(async () => {
  server = createServer(createHandler({ root, canonicalHost: "" }));
  await new Promise<void>((ok) => server.listen(0, ok));
  base = `http://localhost:${(server.address() as { port: number }).port}`;
});
afterAll(() => {
  server.close();
  rmSync(root, { recursive: true, force: true });
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("server · páginas (URLs limpias, como cleanUrls + trailingSlash: false)", () => {
  it("sirve cada ruta desde su HTML pre-generado", async () => {
    for (const [path, text] of [
      ["/", "Inicio"],
      ["/nosotros", "Nosotros"],
      ["/en", "Home"], // existe en.html y la carpeta en/
      ["/en/about", "About"],
    ]) {
      const r = await get(path);
      expect(r.status, path).toBe(200);
      expect(r.headers.get("content-type")).toMatch(/text\/html/);
      expect(await r.text()).toContain(text);
    }
  });

  it("redirige /x/ y /x.html a /x", async () => {
    for (const [from, to] of [
      ["/nosotros/", "/nosotros"],
      ["/nosotros.html", "/nosotros"],
      ["/index.html", "/"],
      ["/chat-asesor.html", "/chat-asesor"],
    ]) {
      const r = await get(from);
      expect(r.status, from).toBe(308);
      expect(r.headers.get("location")).toBe(to);
    }
  });

  it("responde 404.html con estado 404 en rutas desconocidas", async () => {
    const r = await get("/no-existe");
    expect(r.status).toBe(404);
    expect(await r.text()).toContain("No existe");
  });

  it("no sale de dist/ ni entrega archivos ocultos o comprimidos directamente", async () => {
    for (const p of [
      "/../package.json",
      "/%2e%2e/package.json",
      "/.env",
      "/assets/app-abc123.js.gz",
    ])
      expect((await get(p)).status, p).toBe(404);
    expect((await get("/%E0%A4%A")).status).toBe(400);
  });

  it("solo acepta GET y HEAD en las páginas", async () => {
    expect((await get("/nosotros", { method: "POST" })).status).toBe(405);
    const head = await get("/nosotros", { method: "HEAD" });
    expect(head.status).toBe(200);
    expect(await head.text()).toBe("");
  });

  it("los idiomas retirados redirigen a /en", async () => {
    for (const p of ["/fr", "/de/nosotros", "/ar/blog/x"]) {
      const r = await get(p);
      expect(r.status, p).toBe(307);
      expect(r.headers.get("location")).toBe("/en");
    }
    expect((await get("/french")).status).toBe(404);
  });
});

describe("server · cabeceras (hosting/headers.json)", () => {
  it("el sitio lleva su CSP sin Zoho y no se puede embeber", async () => {
    const h = (await get("/nosotros")).headers;
    expect(h.get("content-security-policy")).toMatch(/frame-ancestors 'none'/);
    expect(h.get("content-security-policy")).not.toMatch(/zoho/);
    expect(h.get("x-frame-options")).toBe("DENY");
    expect(h.get("strict-transport-security")).toMatch(/max-age=63072000/);
    expect(h.get("cache-control")).toMatch(/must-revalidate/);
  });

  it("la página aislada del chat lleva la CSP de Zoho", async () => {
    const h = (await get("/chat-asesor")).headers;
    expect(h.get("content-security-policy")).toMatch(/salesiq\.zohopublic\.com/);
    expect(h.get("x-frame-options")).toBe("SAMEORIGIN");
    expect(h.get("x-robots-tag")).toMatch(/noindex/);
  });

  it("los assets con hash se guardan en caché de forma inmutable", async () => {
    const h = (await get("/assets/app-abc123.js")).headers;
    expect(h.get("cache-control")).toMatch(/max-age=31536000.*immutable/);
    expect(h.get("content-type")).toMatch(/javascript/);
  });

  it("entrega la versión comprimida del build y responde 304 si no cambió", async () => {
    const r = await get("/assets/app-abc123.js", { headers: { "accept-encoding": "gzip" } });
    expect(r.headers.get("content-encoding")).toBe("gzip");
    expect(r.headers.get("vary")).toBe("Accept-Encoding");
    expect(await r.text()).toBe("console.log(1)");
    const again = await get("/assets/app-abc123.js", {
      headers: { "accept-encoding": "gzip", "if-none-match": r.headers.get("etag")! },
    });
    expect(again.status).toBe(304);
  });

  it("convierte los source (formato de Vercel) en expresiones regulares", () => {
    expect(sourceRegex("/:lang(fr|de)/:path*").exec("/fr/a/b")?.groups).toEqual({
      lang: "fr",
      path: "a/b",
    });
    expect(sourceRegex("/((?!chat-asesor).*)").test("/chat-asesor")).toBe(false);
    expect(sourceRegex("/((?!chat-asesor).*)").test("/nosotros")).toBe(true);
  });
});

describe("server · dominio canónico", () => {
  it("con SITE_CANONICAL_HOST redirige el dominio sin www y http a https", async () => {
    const h = createHandler({ root, canonicalHost: "www.transpacksas.com" });
    const s = createServer(h);
    await new Promise<void>((ok) => s.listen(0, ok));
    const url = `http://localhost:${(s.address() as { port: number }).port}`;
    const r = await fetch(`${url}/nosotros?a=1`, {
      redirect: "manual",
      headers: { "x-forwarded-host": "transpacksas.com" },
    });
    expect(r.status).toBe(301);
    expect(r.headers.get("location")).toBe("https://www.transpacksas.com/nosotros?a=1");
    const http = await fetch(url, {
      redirect: "manual",
      headers: { "x-forwarded-host": "www.transpacksas.com", "x-forwarded-proto": "http" },
    });
    expect(http.status).toBe(301);
    const ok = await fetch(url, {
      redirect: "manual",
      headers: { "x-forwarded-host": "www.transpacksas.com", "x-forwarded-proto": "https" },
    });
    expect(ok.status).toBe(200);
    s.close();
  });
});

describe("server · funciones (api/)", () => {
  const lead = {
    kind: "contacto",
    lang: "es",
    fields: { Nombre: "Ana", "Autorización de datos": "Sí" },
    replyTo: { email: "ana@example.com", name: "Ana" },
  };

  it("/api/contact llega a la función y envía con Brevo (simulado)", async () => {
    vi.stubEnv("BREVO_API_KEY", "clave-de-prueba");
    const realFetch = globalThis.fetch;
    const brevo = vi.fn(async () => new Response(JSON.stringify({ messageId: "1" })));
    // Solo se simula la llamada a Brevo; la petición al servidor de prueba es real
    vi.stubGlobal("fetch", (url: string, init?: RequestInit) =>
      String(url).includes("api.brevo.com") ? brevo() : realFetch(url, init),
    );
    const r = await get("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: base },
      body: JSON.stringify(lead),
    });
    expect(r.status).toBe(200);
    expect(await r.json()).toEqual({ ok: true });
    expect(brevo).toHaveBeenCalledTimes(2); // solicitud + confirmación
    expect(r.headers.get("x-content-type-options")).toBe("nosniff");
  });

  it("rechaza otro origen, cuerpos demasiado grandes, otros métodos y otras rutas", async () => {
    const other = await get("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "https://otro.com" },
      body: JSON.stringify(lead),
    });
    expect(other.status).toBe(403);
    const big = await get("/api/contact", { method: "POST", body: "a".repeat(MAX_BODY + 1) });
    expect(big.status).toBe(413);
    expect((await get("/api/contact", { method: "PUT" })).status).toBe(405);
    expect((await get("/api/nada")).status).toBe(404);
  });

  it("/api/ticket responde aunque Zoho no esté configurado", async () => {
    const r = await get("/api/ticket");
    expect(r.status).toBe(200);
    expect(await r.json()).toEqual({ configured: false });
  });
});
