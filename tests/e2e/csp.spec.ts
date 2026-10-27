import { readFileSync } from "node:fs";
import { expect, test } from "./fixtures";

// Aplica las cabeceras de vercel.json (que `vite preview` no envía) y verifica
// que la Política de Seguridad de Contenido no bloquee nada del sitio.
const cfg = JSON.parse(readFileSync("vercel.json", "utf8"));
const pick = (src: string): Record<string, string> =>
  Object.fromEntries(
    cfg.headers
      .find((h: { source: string }) => h.source === src)
      .headers.filter((h: { key: string }) => h.key !== "Strict-Transport-Security")
      .map((h: { key: string; value: string }) => [
        h.key,
        // En local se sirve por http: esta directiva no aplica aquí
        h.key === "Content-Security-Policy"
          ? h.value.replace("; upgrade-insecure-requests", "")
          : h.value,
      ]),
  );
// El sitio y la página aislada del chat con un asesor tienen cabeceras distintas
const site = pick("/((?!chat-asesor).*)");
const helper = pick("/chat-asesor.html");
const headersFor = (url: string) => (url.includes("/chat-asesor") ? helper : site);

for (const route of [
  "/",
  "/nosotros",
  "/servicios/mudanzas-internacionales",
  "/blog/por-que-una-mudanza-maritima-internacional-puede-tardar",
]) {
  test(`CSP no bloquea recursos en ${route}`, async ({ page }) => {
    // Recorre toda la página (imágenes diferidas, mapa y videos)
    test.slow();
    const blocked: string[] = [];
    page.on("console", (m) => {
      if (/Content Security Policy|Refused to/i.test(m.text())) blocked.push(m.text());
    });
    await page.route("**/*", async (r) => {
      // Solo las páginas del sitio (los iframes de Google y YouTube traen sus propias cabeceras)
      if (
        r.request().resourceType() !== "document" ||
        !r.request().url().startsWith("http://localhost")
      )
        return r.continue();
      const res = await r.fetch();
      await r.fulfill({ response: res, headers: { ...res.headers(), ...headersFor(r.request().url()) } });
    });
    await page.goto(route);
    // Recorre la página para cargar imágenes diferidas, mapa y videos
    for (let y = 0; y < 12; y++) {
      await page.mouse.wheel(0, 1500);
      await page.waitForTimeout(150);
    }
    await page.waitForTimeout(800);
    expect(blocked).toEqual([]);
  });
}

test("CSP permite reproducir un video de YouTube", async ({ page, isMobile }) => {
  test.skip(isMobile, "Basta con revisarlo una vez");
  const blocked: string[] = [];
  page.on("console", (m) => {
    if (/Content Security Policy|Refused to/i.test(m.text())) blocked.push(m.text());
  });
  await page.route("**/*", async (r) => {
    if (
      r.request().resourceType() !== "document" ||
      !r.request().url().startsWith("http://localhost")
    )
      return r.continue();
    const res = await r.fetch();
    await r.fulfill({ response: res, headers: { ...res.headers(), ...headersFor(r.request().url()) } });
  });
  await page.goto("/#videos");
  await page
    .getByRole("button", { name: /Reproducir video/ })
    .first()
    .click();
  await expect(page.locator('iframe[src*="youtube-nocookie.com"]')).toBeAttached();
  await page.waitForTimeout(1000);
  expect(blocked).toEqual([]);
});

test("CSP permite cargar el chat con un asesor (Zoho SalesIQ) y su diseño", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Basta con revisarlo una vez");
  const blocked: string[] = [];
  page.on("console", (m) => {
    if (/Content Security Policy|Refused to/i.test(m.text())) blocked.push(m.text());
  });
  let loaded = false;
  await page.route("**/*", async (r) => {
    const url = r.request().url();
    // Script de Zoho simulado (no se carga el real en las pruebas): crea su
    // ventana ya en una conversación, a la que el sitio le inyecta su diseño
    // (estilos en línea, foto embebida y tipografías)
    if (url.startsWith("https://salesiq.zohopublic.com/")) {
      loaded = true;
      return r.fulfill({
        contentType: "text/javascript",
        body: `(() => {
          const z = window.$zoho.salesiq;
          z.floatwindow = { visible() {} };
          const f = document.createElement("iframe"); f.id = "siq_chatwindow"; document.body.appendChild(f);
          f.contentDocument.body.innerHTML = '<header class="siqcw-header"><div class="embed-prof-cont"><em class="siqcw-bot-logo"></em></div></header><textarea class="siqcw-textarea"></textarea>';
          z.ready();
        })();`,
      });
    }
    if (r.request().resourceType() !== "document" || !url.startsWith("http://localhost"))
      return r.continue();
    const res = await r.fetch();
    await r.fulfill({ response: res, headers: { ...res.headers(), ...headersFor(r.request().url()) } });
  });
  await page.goto("/");
  await page.getByRole("button", { name: /Hablar con Joel, asesor virtual/ }).click();
  await expect(page.locator("html")).toHaveClass(/tp-zoho-open/, { timeout: 15_000 });
  expect(loaded).toBe(true);
  await page.waitForTimeout(1000);
  expect(blocked).toEqual([]);
});
