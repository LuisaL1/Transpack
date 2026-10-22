// Verifica la conexión con Zoho SalesIQ para el chat con un asesor dentro de Joel
// (api/advisor.mjs). Lee las credenciales de .env.local (NO versionado).
//
//   pnpm advisor:check                 → token, marcas (app_id) y departamentos
//   pnpm advisor:check --conversacion  → además abre una conversación DE PRUEBA,
//                                        envía un mensaje y lee los mensajes
//                                        (le llega a los asesores en SalesIQ)
//
// No imprime las credenciales. Ver docs/chat-crm.md.
import fs from "node:fs";

const env = Object.fromEntries(
  (fs.existsSync(".env.local") ? fs.readFileSync(".env.local", "utf8") : "")
    .split("\n")
    .map((l) => l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/))
    .filter(Boolean)
    .map((m) => [m[1], m[2].replace(/^["']|["']$/g, "")]),
);
const get = (k, d = "") => process.env[k] || env[k] || d;
const accounts = get("ZOHO_ACCOUNTS_URL", "https://accounts.zoho.com");
const salesiq = get("ZOHO_SALESIQ_URL", "https://salesiq.zoho.com");
const screen = get("ZOHO_SALESIQ_SCREEN", "transpacksas");
for (const k of ["ZOHO_CLIENT_ID", "ZOHO_CLIENT_SECRET", "ZOHO_REFRESH_TOKEN"])
  if (!get(k)) {
    console.error(`Falta ${k} en .env.local (ver .env.example).`);
    process.exit(1);
  }

const show = (title, data) => console.log(`\n── ${title}\n${JSON.stringify(data, null, 2).slice(0, 3000)}`);

const q = new URLSearchParams({
  refresh_token: get("ZOHO_REFRESH_TOKEN"),
  client_id: get("ZOHO_CLIENT_ID"),
  client_secret: get("ZOHO_CLIENT_SECRET"),
  grant_type: "refresh_token",
});
const t = await (await fetch(`${accounts}/oauth/v2/token?${q}`, { method: "POST" })).json();
if (!t.access_token) {
  show("Error al obtener el token (revise credenciales, alcances y centro de datos)", t);
  process.exit(1);
}
console.log(`Token OK (vence en ${t.expires_in} s; alcances: ${t.scope ?? "no informados"})`);
const zoho = async (path, init = {}) => {
  const r = await fetch(`${salesiq}${path}`, {
    ...init,
    headers: { Authorization: `Zoho-oauthtoken ${t.access_token}`, "Content-Type": "application/json" },
  });
  const d = await r.json().catch(() => ({}));
  return { status: r.status, data: d };
};

const apps = await zoho(`/api/v2/${screen}/apps`);
show(`Marcas (apps) · HTTP ${apps.status} → use el id como ZOHO_SALESIQ_APP_ID`, (apps.data.data ?? apps.data).map?.((a) => ({ id: a.id, name: a.name })) ?? apps.data);
const deps = await zoho(`/api/v2/${screen}/departments`);
show(`Departamentos · HTTP ${deps.status} → use el id como ZOHO_SALESIQ_DEPARTMENT_ID`, (deps.data.data ?? deps.data).map?.((d) => ({ id: d.id, name: d.name })) ?? deps.data);

if (process.argv.includes("--conversacion")) {
  const appId = get("ZOHO_SALESIQ_APP_ID", apps.data.data?.[0]?.id);
  const departmentId = get("ZOHO_SALESIQ_DEPARTMENT_ID", deps.data.data?.[0]?.id);
  const open = await zoho(`/api/visitor/v1/${screen}/conversations`, {
    method: "POST",
    body: JSON.stringify({
      app_id: appId,
      department_id: departmentId,
      question: "PRUEBA del sitio web: por favor ignore este mensaje.",
      visitor: { user_id: `web-prueba-${Date.now()}`, name: "Prueba del sitio web" },
    }),
  });
  show(`Abrir conversación · HTTP ${open.status}`, open.data);
  const id = open.data.data?.id;
  if (id) {
    const send = await zoho(`/api/visitor/v1/${screen}/conversations/${id}/messages`, {
      method: "POST",
      body: JSON.stringify({ text: "Segundo mensaje de PRUEBA." }),
    });
    show(`Enviar mensaje · HTTP ${send.status}`, send.data);
    const msgs = await zoho(`/api/v2/${screen}/conversations/${id}/messages?limit=20`);
    show(`Leer mensajes (con el id de la API de visitante) · HTTP ${msgs.status}`, msgs.data);
    if (msgs.status >= 400)
      console.log(
        "\n⚠ La API v2 no aceptó el id de la API de visitante: hay que ajustar la lectura de mensajes en api/advisor.mjs (ver docs/chat-crm.md).",
      );
  }
}
