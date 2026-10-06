import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config.ts";

// Pruebas unitarias, de contenido y de seguridad estática (ver TESTING.md).
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      setupFiles: ["./tests/setup.ts"],
      // tests/seo revisa dist/ y solo corre con `pnpm test:seo` (después del build).
      include:
        process.env.SEO_DIST === "1"
          ? ["tests/seo/**/*.test.ts"]
          : ["tests/unit/**/*.test.{ts,tsx}", "tests/security/**/*.test.ts"],
      css: false,
      coverage: {
        provider: "v8",
        include: ["src/lib/**", "src/data/**", "src/hooks/**"],
        reporter: ["text", "html"],
      },
    },
  }),
);
