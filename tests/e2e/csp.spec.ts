import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

// Aplica las cabeceras de vercel.json (que `vite preview` no envía) y verifica
// que la Política de Seguridad de Contenido no bloquee nada del sitio.
const cfg = JSON.parse(readFileSync("vercel.json", "utf8"));
const headers: Record<string, string> = Object.fromEntries(
  cfg.headers
    .find((h: { source: string }) => h.source === "/(.*)")
    .headers.filter((h: { key: string }) => h.key !== "Strict-Transport-Security")
    .map((h: { key: string; value: string }) => [
      h.key,
      // En local se sirve por http: esta directiva no aplica aquí
      h.key === "Content-Security-Policy"
        ? h.value.replace("; upgrade-insecure-requests", "")
        : h.value,
    ]),
);

for (const route of [
  "/",
  "/nosotros",
  "/servicios/mudanzas-internacionales",
  "/blog/por-que-una-mudanza-maritima-internacional-puede-tardar",
]) {
  test(`CSP no bloquea recursos en ${route}`, async ({ page }) => {
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
      await r.fulfill({ response: res, headers: { ...res.headers(), ...headers } });
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
    await r.fulfill({ response: res, headers: { ...res.headers(), ...headers } });
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

test("CSP permite cargar el chat con un asesor (Zoho SalesIQ)", async ({ page, isMobile }) => {
  test.skip(isMobile, "Basta con revisarlo una vez");
  const blocked: string[] = [];
  page.on("console", (m) => {
    if (/Content Security Policy|Refused to/i.test(m.text())) blocked.push(m.text());
  });
  let loaded = false;
  await page.route("**/*", async (r) => {
    const url = r.request().url();
    // Script de Zoho simulado (no se carga el real en las pruebas)
    if (url.startsWith("https://salesiq.zoho.com/")) {
      loaded = true;
      return r.fulfill({
        contentType: "text/javascript",
        body: "window.$zoho.salesiq.floatwindow={visible(){}};window.$zoho.salesiq.ready();",
      });
    }
    if (r.request().resourceType() !== "document" || !url.startsWith("http://localhost"))
      return r.continue();
    const res = await r.fetch();
    await r.fulfill({ response: res, headers: { ...res.headers(), ...headers } });
  });
  await page.goto("/");
  await page.getByRole("button", { name: /Hablar con Joel, asesor virtual/ }).click();
  const chat = page.getByRole("region", { name: "Chat con Joel" });
  await chat.getByRole("button", { name: "Hablar con un asesor" }).click({ timeout: 10_000 });
  await chat.getByRole("button", { name: "Chatear con un asesor" }).click({ timeout: 10_000 });
  await expect.poll(() => loaded).toBe(true);
  await page.waitForTimeout(500);
  expect(blocked).toEqual([]);
});
