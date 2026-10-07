import { expect, test } from "@playwright/test";

// SEO en el navegador: contenido sin JavaScript (lo que ve un rastreador
// simple o una red social) y etiquetas que se actualizan al navegar.
const SITE = "https://www.transpacksas.com";

test.describe("sin JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  for (const [route, h1, lang] of [
    ["/", /Movemos lo que más importa/, "es-CO"],
    ["/nosotros", /cinco décadas/, "es-CO"],
    ["/servicios/mudanzas-internacionales", /otro país/, "es-CO"],
    ["/blog/por-que-una-mudanza-maritima-internacional-puede-tardar", /tardar/, "es-CO"],
    ["/en/services/international-moving", /abroad/, "en-US"],
    ["/privacidad", /Política de tratamiento de datos personales/, "es-CO"],
    ["/de/datenschutz", /personenbezogener Daten/, "de-DE"],
    ["/ar", /.+/, "ar"],
  ] as const) {
    test(`${route} trae idioma, título, H1, canónica y JSON-LD en el HTML`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator("html")).toHaveAttribute("lang", lang);
      await expect(page.locator("h1")).toHaveText(h1);
      await expect(page).toHaveTitle(/Transpack|ترانسباك/);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        route === "/" ? `${SITE}/` : `${SITE}${route}`,
      );
      expect(await page.locator('script[type="application/ld+json"]').count()).toBeGreaterThan(0);
      expect(await page.locator('link[rel="alternate"][hreflang]').count()).toBe(7);
    });
  }
});

test("al navegar se actualizan título, descripción, canónica e idioma", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("link", { name: /Ver servicio/ })
    .first()
    .click();
  await expect(page).toHaveURL(/\/servicios\//);
  const path = new URL(page.url()).pathname;
  await expect(page).toHaveTitle(/Bogotá.*\| Transpack/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${SITE}${path}`);
  await expect(page.locator('head meta[name="description"]')).toHaveCount(1);
  await expect(page.locator("head title")).toHaveCount(1);
  await expect(page.locator('head link[rel="alternate"][hreflang]')).toHaveCount(7);
});

test("una ruta desconocida muestra la 404 útil (inicio, cotizar y servicios) con noindex", async ({
  page,
}) => {
  await page.goto("/esta-pagina-no-existe");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Esta página tomó otra ruta");
  await expect(page.getByRole("link", { name: "Ir al inicio" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Cotiza tu mudanza" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Bodegaje/ }).last()).toBeVisible();
  await expect(page.locator('head meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});
