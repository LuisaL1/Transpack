import { test as base } from "@playwright/test";

export { expect, type Locator, type Page } from "@playwright/test";

// El sitio precarga el chat de Zoho SalesIQ al entrar (src/hooks/useAdvisorChat.ts):
// en las pruebas NUNCA se carga el real. En todas se reemplaza por un script
// vacío (Zoho nunca arranca y no quedan errores de red en la consola); las
// pruebas del chat lo simulan con su propia ruta, que tiene prioridad
// (Playwright aplica primero la última registrada).
export const test = base.extend({
  page: async ({ page }, runTest) => {
    await page.route("https://salesiq.zohopublic.com/**", (r) =>
      r.fulfill({ contentType: "text/javascript", body: "" }),
    );
    await runTest(page);
  },
});
