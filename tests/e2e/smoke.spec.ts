import { expect, test } from "@playwright/test";

// Cada ruta carga sin errores de JavaScript ni recursos rotos (en español y en
// otros idiomas, incluido el árabe de derecha a izquierda).
const ROUTES = [
  "/",
  "/nosotros",
  "/servicios/mudanzas-locales",
  "/servicios/mudanzas-internacionales",
  "/servicios/bodegaje",
  "/blog/por-que-una-mudanza-maritima-internacional-puede-tardar",
  "/en",
  "/en/about",
  "/fr/services/demenagement-international",
  "/de/blog/warum-ein-internationaler-seeumzug-laenger-dauern-kann",
  "/ar",
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

test("el árabe se muestra de derecha a izquierda", async ({ page }) => {
  await page.goto("/ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator("html")).toHaveAttribute("lang", /^ar/);
});

test("una ruta inexistente muestra la página 404", async ({ page }) => {
  await page.goto("/servicios/no-existe");
  await expect(page.getByRole("heading", { name: "Esta página tomó otra ruta" })).toBeVisible();
});
