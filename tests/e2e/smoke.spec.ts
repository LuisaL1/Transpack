import { expect, test } from "./fixtures";

// Cada ruta carga sin errores de JavaScript ni recursos rotos (en español y en
// otros idiomas, incluido el árabe de derecha a izquierda).
const ROUTES = [
  "/",
  "/nosotros",
  "/privacidad",
  "/servicios/mudanzas-locales",
  "/servicios/mudanzas-internacionales",
  "/servicios/bodegaje",
  "/blog/por-que-una-mudanza-maritima-internacional-puede-tardar",
  "/en",
  "/en/about",
  "/en/privacy",
  "/en/services/international-moving",
  "/en/blog/why-an-international-sea-move-can-take-longer",
];

for (const route of ROUTES) {
  test(`carga ${route} sin errores`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    page.on("response", (r) => {
      const same = new URL(r.url()).origin === new URL(page.url() || "http://x").origin;
      if (r.status() >= 400 && same) errors.push(`${r.status()} ${r.url()}`);
    });
    const res = await page.goto(route);
    expect(res?.status()).toBeLessThan(400);
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page).toHaveTitle(/Transpack|ترانسباك/);
    expect(errors).toEqual([]);
  });
}

test("solo se publican español e inglés (los demás idiomas están desactivados)", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Elegir región e idioma" }).click();
  const options = page.getByRole("option");
  await expect(options).toHaveCount(2);
  await expect(options.nth(0)).toContainText("Español");
  await expect(options.nth(1)).toContainText("English");
});

test("una ruta inexistente muestra la página 404", async ({ page }) => {
  await page.goto("/servicios/no-existe");
  await expect(page.getByRole("heading", { name: "Esta página tomó otra ruta" })).toBeVisible();
});
