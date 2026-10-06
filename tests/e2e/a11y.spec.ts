import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Accesibilidad automática (WCAG 2.1 A/AA) con axe.
// - Bloquean: todos los problemas críticos o graves, excepto el contraste.
// - Contraste de color: se reporta como anotación "pendiente" mientras dependa
//   de los colores del diseño (ver TESTING.md). Cuando se corrija, active el
//   modo estricto con  A11Y_STRICT=1 pnpm test:e2e  (y luego déjelo fijo aquí).
const STRICT = process.env.A11Y_STRICT === "1";

for (const route of [
  "/",
  "/nosotros",
  "/servicios/mudanzas-internacionales",
  "/blog/por-que-una-mudanza-maritima-internacional-puede-tardar",
  "/en",
  "/ar",
]) {
  test(`accesibilidad ${route}`, async ({ page }, info) => {
    // Sin animaciones: así axe revisa todo el contenido, ya visible.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(route);
    await page.waitForLoadState("load");
    await page.waitForTimeout(1000);
    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      // El mapa de Google es contenido de terceros
      .exclude('iframe[src*="google.com/maps"]')
      .analyze();
    await info.attach("axe.json", {
      body: JSON.stringify(violations, null, 2),
      contentType: "application/json",
    });
    const serious = violations.filter((v) => v.impact === "critical" || v.impact === "serious");
    const contrast = serious.find((v) => v.id === "color-contrast");
    if (contrast && !STRICT)
      info.annotations.push({
        type: "pendiente",
        description: `Contraste insuficiente en ${contrast.nodes.length} elementos (ver axe.json)`,
      });
    const blocking = serious.filter((v) => STRICT || v.id !== "color-contrast");
    expect(blocking.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`)).toEqual([]);
  });
}
