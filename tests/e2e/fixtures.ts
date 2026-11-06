import { test as base } from "@playwright/test";

export { expect, type Locator, type Page } from "@playwright/test";

// El sitio precarga el chat de Zoho SalesIQ al entrar (src/hooks/useAdvisorChat.ts):
// en las pruebas NUNCA se carga el real. En todas se reemplaza por un script
// vacío (Zoho nunca arranca y no quedan errores de red en la consola); las
// pruebas del chat lo simulan con su propia ruta, que tiene prioridad
// (Playwright aplica primero la última registrada). Las fotos de los países del
// mapa (Wikimedia) también se simulan: las pruebas no salen a internet.
const PIXEL = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  "base64",
);
export const test = base.extend({
  page: async ({ page }, runTest) => {
    await page.route("https://salesiq.zohopublic.com/**", (r) =>
      r.fulfill({ contentType: "text/javascript", body: "" }),
    );
    for (const host of ["thumb", "upload"])
      await page.route(`https://${host}.wikimedia.org/**`, (r) =>
        r.fulfill({ contentType: "image/png", body: PIXEL }),
      );
    await runTest(page);
  },
});
