import { expect, test } from "@playwright/test";

// Google Analytics 4 con Consent Mode v2. Se ejecuta con `pnpm test:ga`
// (compila con VITE_GA_MEASUREMENT_ID); en `pnpm test:e2e` se omite porque el
// build de pruebas no lleva GA.
test("GA4: respeta el consentimiento y envía datos al aceptar", async ({ page }) => {
  const hits: string[] = [];
  page.on("request", (r) => {
    if (/google-analytics\.com\/(g\/)?collect/.test(r.url())) hits.push(r.url());
  });
  await page.goto("/");
  const gaId = await page.evaluate(
    () =>
      (
        document.querySelector(
          'script[src*="googletagmanager.com/gtag/js"]',
        ) as HTMLScriptElement | null
      )?.src.split("id=")[1],
  );
  test.skip(!gaId, "Build sin VITE_GA_MEASUREMENT_ID");

  // Antes de decidir: aviso visible, almacenamiento analítico denegado y sin cookie _ga
  const banner = page.getByRole("dialog", { name: "Aviso de cookies" });
  await expect(banner).toBeVisible();
  const consentDefault = await page.evaluate(() =>
    JSON.stringify(
      Array.from((window.dataLayer ?? []) as ArrayLike<unknown>[]).find(
        (e) => e[0] === "consent" && e[1] === "default",
      ),
    ),
  );
  expect(consentDefault).toContain('"analytics_storage":"denied"');
  expect(consentDefault).toContain('"ad_storage":"denied"');
  expect(await page.evaluate(() => document.cookie)).not.toMatch(/_ga=/);

  // Al aceptar: se crean las cookies y se envían datos al navegar
  await banner.getByRole("button", { name: "Aceptar" }).click();
  await expect(banner).toBeHidden();
  // "Ver servicio" está visible en escritorio y en celular
  await page
    .getByRole("link", { name: /Ver servicio/ })
    .first()
    .click();
  await expect(page).toHaveURL(/\/servicios\//);
  await expect
    .poll(() => page.evaluate(() => document.cookie), { timeout: 15_000 })
    .toMatch(/_ga=/);
  await expect.poll(() => hits.length, { timeout: 15_000 }).toBeGreaterThan(0);
  expect(hits.some((u) => u.includes(`tid=${gaId}`))).toBe(true);
});

test("GA4: al rechazar no se crean cookies de Google Analytics", async ({ page }) => {
  await page.goto("/");
  const banner = page.getByRole("dialog", { name: "Aviso de cookies" });
  test.skip(!(await banner.isVisible().catch(() => false)), "Build sin VITE_GA_MEASUREMENT_ID");
  await banner.getByRole("button", { name: "Rechazar" }).click();
  await expect(banner).toBeHidden();
  await page
    .getByRole("link", { name: /Ver servicio/ })
    .first()
    .click();
  await page.waitForTimeout(2000);
  expect(await page.evaluate(() => document.cookie)).not.toMatch(/_ga=/);
  // La decisión se recuerda: el aviso no vuelve a aparecer
  await page.goto("/nosotros");
  await expect(page.getByRole("dialog", { name: "Aviso de cookies" })).toHaveCount(0);
});
