// Diagnóstico de envíos de Brevo (api/contact.mjs): muestra los eventos de los
// correos transaccionales recientes y, en los errores, el motivo que da Brevo.
// Sirve cuando no se puede abrir el detalle en el panel de Brevo.
//
//   pnpm brevo:events          → eventos del último día
//   pnpm brevo:events 3        → eventos de los últimos 3 días
//
// Lee BREVO_API_KEY de .env.local (NO versionado). Nunca muestra la clave.
// Ver docs/formularios.md.
import fs from "node:fs";

const FILE = ".env.local";
const line = fs.existsSync(FILE)
  ? fs
      .readFileSync(FILE, "utf8")
      .split("\n")
      .find((l) => l.trim().startsWith("BREVO_API_KEY="))
  : undefined;
const key = line?.slice(line.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "");
if (!key) {
  console.error(`Falta BREVO_API_KEY en ${FILE} (cópiela de Vercel → Settings → Environment Variables).`);
  process.exit(1);
}

const days = Math.min(Math.max(Number(process.argv[2]) || 1, 1), 30);
const r = await fetch(`https://api.brevo.com/v3/smtp/statistics/events?limit=100&days=${days}&sort=desc`, {
  headers: { "api-key": key, Accept: "application/json" },
});
const d = await r.json().catch(() => ({}));
if (!r.ok) {
  console.error(`Brevo respondió HTTP ${r.status}: ${d.code ?? ""} ${d.message ?? ""}`);
  process.exit(1);
}
const events = d.events ?? [];
if (!events.length) {
  console.log(`Sin eventos en ${days} día(s).`);
  process.exit(0);
}
for (const e of events) {
  const when = new Date(e.date).toLocaleString("es-CO", { timeZone: "America/Bogota" });
  console.log(
    `${when} · ${String(e.event).padEnd(12)} · ${e.subject ?? ""} · de ${e.from ?? "?"} a ${e.email ?? "?"}` +
      (e.reason ? `\n    Motivo: ${e.reason}` : ""),
  );
}
