import { describe, expect, it } from "vitest";
import { execSync } from "node:child_process";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

// Revisión estática de seguridad del código y la configuración (ver TESTING.md).
const files = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? files(p) : [p];
  });
const code = [...files("src"), "index.html"]
  .filter((f) => /\.(tsx?|html|css)$/.test(f))
  .map((f) => [f, readFileSync(f, "utf8")] as const);

describe("Código", () => {
  it("no inyecta HTML ni evalúa código", () => {
    for (const [f, s] of code)
      expect(s, f).not.toMatch(
        /dangerouslySetInnerHTML|\beval\(|new Function\(|\.innerHTML\s*=|\.outerHTML\s*=|insertAdjacentHTML|document\.write\(/,
      );
  });

  it("los enlaces que abren pestaña nueva llevan rel=noopener/noreferrer", () => {
    for (const [f, s] of code)
      for (const tag of s.match(/<a\b[^>]*target=(?:"_blank"|\{[^}]*"_blank"[^}]*\})[^>]*>/g) ?? [])
        expect(tag, f).toMatch(/rel="[^"]*(noreferrer|noopener)/);
  });

  it("no carga recursos por http inseguro", () => {
    for (const [f, s] of code)
      for (const u of s.match(/(?:src|href|url)\s*[=(]\s*["'`]?http:\/\/[^"'`)\s]+/g) ?? [])
        expect.fail(`${u} en ${f}`);
  });

  it("no hay credenciales ni llaves en el código", () => {
    const secret =
      /(AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{35}|sk_(live|test)_[0-9a-zA-Z]{20,}|ghp_[0-9A-Za-z]{36}|-----BEGIN [A-Z ]*PRIVATE KEY-----|xox[baprs]-[0-9A-Za-z-]{10,}|sk-[A-Za-z0-9]{32,})/;
    for (const [f, s] of code) expect(s, f).not.toMatch(secret);
  });

  it("solo usa variables de entorno públicas permitidas", () => {
    // Solo variables públicas (VITE_): no secretas, documentadas en .env.example.
    const allowed = [
      "import.meta.env.VITE_GA_MEASUREMENT_ID",
      "import.meta.env.VITE_SITE_INDEXABLE",
      "import.meta.env.VITE_GOOGLE_SITE_VERIFICATION",
      "import.meta.env.DEV",
      "import.meta.env.PROD",
      "import.meta.env.MODE",
    ];
    for (const [f, s] of code)
      for (const m of s.match(/import\.meta\.env\.(\w+)/g) ?? []) expect(allowed, f).toContain(m);
  });

  it("ningún enlace abre el programa de correo: todo pasa por el formulario (#contacto)", () => {
    for (const [f, s] of code) expect(s, f).not.toMatch(/mailto:/);
  });

  it("las funciones de Vercel (api/) son .mts: con .ts Vercel las cargaba como CommonJS y se caían (500)", () => {
    const fns = readdirSync("api");
    expect(fns.length).toBeGreaterThan(0);
    for (const f of fns) expect(f, `api/${f}`).toMatch(/\.mts$/);
  });

  it("la clave de Brevo solo existe en el servidor (api/), nunca en el navegador", () => {
    for (const [f, s] of code) expect(s, f).not.toMatch(/BREVO|api\.brevo\.com/);
    const api = readFileSync("api/contact.mts", "utf8");
    expect(api).toContain("process.env.BREVO_API_KEY");
    expect(api).not.toMatch(/VITE_BREVO/);
  });

  it("las credenciales de Zoho solo existen en el servidor (api/), nunca en el navegador", () => {
    for (const [f, s] of code)
      expect(s, f).not.toMatch(/ZOHO_(CLIENT_SECRET|REFRESH_TOKEN|CLIENT_ID)|ADVISOR_SECRET|oauth\/v2\/token/);
    const api = readFileSync("api/advisor.mts", "utf8");
    expect(api).toContain('env("ZOHO_REFRESH_TOKEN")');
    expect(api).not.toMatch(/VITE_ZOHO/);
  });

  it("el chat de Joel no ejecuta ni interpreta HTML del visitante", () => {
    for (const [f, s] of code.filter(([f]) => /chat|joel/i.test(f)))
      expect(s, f).not.toMatch(/innerHTML|dangerouslySetInnerHTML|DOMParser/);
  });
});

describe("Repositorio", () => {
  it("ningún archivo .env real está versionado", () => {
    const tracked = execSync("git ls-files", { encoding: "utf8" }).split("\n");
    expect(
      tracked.filter((f) => /(^|\/)\.env(\.|$)/.test(f) && !f.endsWith(".env.example")),
    ).toEqual([]);
  });

  it(".gitignore excluye .env, dependencias, builds y reportes de pruebas", () => {
    const gi = readFileSync(".gitignore", "utf8");
    for (const p of [
      ".env*",
      "!.env.example",
      "node_modules/",
      "dist/",
      "coverage/",
      "playwright-report/",
      "test-results/",
    ])
      expect(gi, p).toContain(p);
  });
});

describe("Cabeceras de seguridad (vercel.json)", () => {
  const cfg = JSON.parse(readFileSync("vercel.json", "utf8"));
  const block = (src: string) =>
    Object.fromEntries(
      cfg.headers
        .find((h: { source: string }) => h.source === src)
        .headers.map((h: { key: string; value: string }) => [h.key, h.value]),
    ) as Record<string, string>;
  // Todo el sitio, salvo la página aislada del chat con un asesor (abajo)
  const headers = block("/((?!chat-asesor).*)");
  const csp = headers["Content-Security-Policy"];

  it("define CSP, HSTS, nosniff, anti-clickjacking, referrer, permisos y COOP", () => {
    for (const k of [
      "Content-Security-Policy",
      "Strict-Transport-Security",
      "X-Content-Type-Options",
      "X-Frame-Options",
      "Referrer-Policy",
      "Permissions-Policy",
      "Cross-Origin-Opener-Policy",
    ])
      expect(headers[k], k).toBeTruthy();
  });

  it("la CSP no permite scripts en línea ni eval, ni objetos ni ser embebida", () => {
    const script = csp.match(/script-src ([^;]+)/)![1];
    expect(script).not.toMatch(/unsafe-inline|unsafe-eval/);
    // Ningún comodín, salvo los subdominios de Google Tag Manager (Google Analytics).
    expect(script.replace("https://*.googletagmanager.com", "")).not.toMatch(/\*/);
    // Zoho no se autoriza en el sitio: vive en la página aislada
    expect(csp).not.toMatch(/zoho/);
    expect(csp).toMatch(/default-src 'self'/);
    expect(csp).toMatch(/frame-ancestors 'none'/);
    expect(csp).toMatch(/object-src 'none'/);
    expect(csp).toMatch(/base-uri 'self'/);
  });

  it("la CSP solo autoriza los servicios externos que usa el sitio", () => {
    const hosts = [...csp.matchAll(/https:\/\/[^\s;]+/g)].map((m) => m[0]).sort();
    expect([...new Set(hosts)]).toEqual([
      "https://*.analytics.google.com", // Google Analytics 4 (src/lib/analytics.ts)
      "https://*.google-analytics.com",
      "https://*.googletagmanager.com",
      "https://fonts.googleapis.com", // tipografías (src/styles/index.css)
      "https://fonts.gstatic.com",
      "https://i.ytimg.com", // portadas de los videos
      "https://www.google.com", // mapa de contacto
      "https://www.youtube-nocookie.com", // videos (sin cookies)
    ]);
  });

  it("la página aislada del chat (Zoho) solo relaja lo que Zoho necesita", () => {
    for (const src of ["/chat-asesor", "/chat-asesor.html"]) {
      const h = block(src);
      const c = h["Content-Security-Policy"];
      const script = c.match(/script-src ([^;]+)/)![1];
      // Zoho ejecuta scripts en línea propios de cada visitante: se permiten solo aquí
      expect(script).toContain("'unsafe-inline'");
      expect(script).not.toMatch(/unsafe-eval/);
      expect(script.replace("'self' 'unsafe-inline' ", "").split(" ").sort()).toEqual([
        "https://salesiq.zoho.com",
        "https://salesiq.zohopublic.com",
        "https://static.zohocdn.com",
      ]);
      // Solo el propio sitio puede mostrarla
      expect(c).toMatch(/frame-ancestors 'self'/);
      expect(h["X-Frame-Options"]).toBe("SAMEORIGIN");
      expect(h["X-Robots-Tag"]).toMatch(/noindex/);
      expect(c).toMatch(/object-src 'none'/);
    }
    // El sitio puede mostrarla en un iframe
    expect(csp).toMatch(/frame-src 'self'/);
  });

  it("HSTS de al menos un año y la página no puede embeberse", () => {
    expect(
      Number(headers["Strict-Transport-Security"].match(/max-age=(\d+)/)![1]),
    ).toBeGreaterThanOrEqual(31536000);
    expect(headers["X-Frame-Options"]).toBe("DENY");
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
  });

  it("los assets con hash se guardan en caché de forma inmutable", () => {
    expect(block("/assets/(.*)")["Cache-Control"]).toMatch(/max-age=31536000.*immutable/);
  });

  it("cada ruta se sirve desde su HTML pre-generado (sin comodín a index.html)", () => {
    expect(cfg.cleanUrls).toBe(true);
    expect(cfg.trailingSlash).toBe(false);
    // Un rewrite comodín ocultaría las páginas pre-generadas y el 404 real
    expect(cfg.rewrites ?? []).toEqual([]);
  });
});
