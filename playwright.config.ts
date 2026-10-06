import { defineConfig, devices } from "@playwright/test";

// Pruebas de extremo a extremo sobre el build de producción (ver TESTING.md).
// Local: `pnpm test:e2e`. Para apuntar a otro entorno (p. ej. una URL de
// Vercel Preview): `BASE_URL=https://... pnpm test:e2e`.
const BASE_URL = process.env.BASE_URL ?? "http://localhost:4173";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 45_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "escritorio",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    { name: "celular", use: { ...devices["Pixel 7"] } },
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        // Por defecto se compila SIN Google Analytics para no enviar visitas de
        // prueba a la propiedad real. `pnpm test:ga` (GA_E2E=1) compila con el ID
        // (variable de entorno o .env.production.local) para verificar GA.
        command:
          process.env.GA_E2E === "1"
            ? "pnpm build && pnpm preview --port 4173 --strictPort"
            : "VITE_GA_MEASUREMENT_ID= pnpm build && pnpm preview --port 4173 --strictPort",
        url: BASE_URL,
        // Nunca reutilizar un servidor: podría ser un build con otra configuración de GA
        reuseExistingServer: false,
        timeout: 180_000,
      },
});
