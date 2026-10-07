import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// Vite config — https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      // En desarrollo (pnpm dev) /api/contact se simula: no envía correos y
      // muestra en la terminal lo que se habría enviado (ver docs/formularios.md).
      name: "dev-contact-mock",
      configureServer(server) {
        server.middlewares.use("/api/contact", (req, res) => {
          let body = "";
          req.on("data", (c) => (body += c));
          req.on("end", () => {
            console.log("[dev] /api/contact (simulado, no se envió nada):", body.slice(0, 600));
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: true, simulated: true }));
          });
        });
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
