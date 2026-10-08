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
    {
      // En desarrollo, /api/advisor se simula: un "asesor" de prueba responde a
      // los pocos segundos. No se conecta con Zoho (ver docs/chat-crm.md).
      name: "dev-advisor-mock",
      configureServer(server) {
        let started = 0;
        let sent = false;
        server.middlewares.use("/api/advisor", (req, res) => {
          res.setHeader("Content-Type", "application/json");
          if (req.method === "GET") return res.end(JSON.stringify({ configured: true }));
          let body = "";
          req.on("data", (c) => (body += c));
          req.on("end", () => {
            const b = JSON.parse(body || "{}") as { action?: string; after?: number };
            console.log("[dev] /api/advisor (simulado):", body.slice(0, 300));
            if (b.action === "start") {
              started = Date.now();
              sent = false;
              return res.end(JSON.stringify({ ok: true, token: "dev.token" }));
            }
            if (b.action === "poll" && !sent && Date.now() - started > 5000) {
              sent = true;
              const now = Date.now();
              return res.end(
                JSON.stringify({
                  ok: true,
                  messages: [
                    { id: "1", seq: 1, from: "system", name: "Laura (prueba)", text: "joined", time: now },
                    { id: "2", seq: 2, from: "operator", name: "Laura (prueba)", text: "¡Hola! Soy Laura, asesora de Transpack (mensaje simulado). ¿En qué te ayudo?", time: now },
                  ],
                }),
              );
            }
            res.end(JSON.stringify({ ok: true, messages: [] }));
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
  build: {
    rolldownOptions: {
      output: {
        // Librerías (React y React Router) en un archivo aparte: el navegador
        // las guarda en caché entre versiones del sitio y el JS principal
        // queda bajo el límite del CI (.github/workflows/ci.yml).
        codeSplitting: {
          groups: [
            {
              name: "vendor",
              test: /node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/,
            },
          ],
        },
      },
    },
  },
});
