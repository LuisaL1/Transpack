// Credenciales de Zoho para el chat con un asesor (api/advisor.mts). La API de
// visitante de SalesIQ exige un token de ORGANIZACIÓN ("Org OAuth"): cliente
// "Server-based Applications" + autorización en /oauth/v2/org/auth.
//
//   pnpm advisor:token --url  → muestra el enlace de autorización (abrirlo en
//                               el navegador con la cuenta administradora);
//                               con --usuario, la autorización normal (no de
//                               organización)
//   pnpm advisor:token        → cambia el código por la clave permanente
//                               (refresh token) y la guarda en .env.local, sin
//                               mostrarla. También crea ADVISOR_SECRET si falta.
//
// En .env.local: ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REDIRECT_URI y
// ZOHO_AUTH_CODE (el código, o la dirección completa a la que Zoho redirige;
// vence en unos minutos). Ver docs/chat-crm.md.
import fs from "node:fs";
import { randomBytes } from "node:crypto";

const FILE = ".env.local";
if (!fs.existsSync(FILE)) {
  console.error(`No existe ${FILE} en la carpeta del proyecto.`);
  process.exit(1);
}
let text = fs.readFileSync(FILE, "utf8");
// Lectura y escritura de "CLAVE=valor" por líneas (sin expresiones armadas con texto)
const lineOf = (k) => text.split("\n").findIndex((l) => l.trim().startsWith(`${k}=`));
const get = (k) => {
  const i = lineOf(k);
  if (i < 0) return "";
  const l = text.split("\n")[i];
  return l.slice(l.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "");
};
const set = (k, v) => {
  const lines = text.split("\n");
  const i = lineOf(k);
  if (i >= 0) lines[i] = `${k}=${v}`;
  else lines.splice(lines.length - (lines.at(-1) === "" ? 1 : 0), 0, `${k}=${v}`);
  text = lines.join("\n");
};
const remove = (k) => {
  text = text
    .split("\n")
    .filter((l) => !l.trim().startsWith(`${k}=`))
    .join("\n");
};

// Permiso de organización para abrir, escribir y leer conversaciones. La marca y
// el departamento van fijos en ZOHO_SALESIQ_APP_ID y ZOHO_SALESIQ_DEPARTMENT_ID.
const SCOPES = "SalesIQ.Conversations.ALL,SalesIQ.apps.read";
const accountsUrl = get("ZOHO_ACCOUNTS_URL") || "https://accounts.zoho.com";
if (process.argv.includes("--url")) {
  if (!get("ZOHO_CLIENT_ID") || !get("ZOHO_REDIRECT_URI")) {
    console.error(`Faltan ZOHO_CLIENT_ID o ZOHO_REDIRECT_URI en ${FILE}.`);
    process.exit(1);
  }
  const u = new URLSearchParams({
    scope: SCOPES,
    client_id: get("ZOHO_CLIENT_ID"),
    response_type: "code",
    redirect_uri: get("ZOHO_REDIRECT_URI"),
    access_type: "offline",
    prompt: "consent",
  });
  // --usuario: autorización normal (no de organización) con el mismo cliente
  const path = process.argv.includes("--usuario") ? "/oauth/v2/auth" : "/oauth/v2/org/auth";
  console.log(`${accountsUrl}${path}?${u}`);
  process.exit(0);
}

const missing = ["ZOHO_CLIENT_ID", "ZOHO_CLIENT_SECRET", "ZOHO_AUTH_CODE"].filter((k) => !get(k));
if (missing.length) {
  console.error(`Faltan en ${FILE}: ${missing.join(", ")}`);
  process.exit(1);
}

// Acepta el código solo o la dirección completa (…?code=1000.xxx&location=…)
const rawCode = get("ZOHO_AUTH_CODE");
const code = rawCode.includes("code=") ? new URL(rawCode).searchParams.get("code") ?? "" : rawCode;
const q = new URLSearchParams({
  grant_type: "authorization_code",
  client_id: get("ZOHO_CLIENT_ID"),
  client_secret: get("ZOHO_CLIENT_SECRET"),
  code,
  ...(get("ZOHO_REDIRECT_URI") ? { redirect_uri: get("ZOHO_REDIRECT_URI") } : {}),
});
const r = await fetch(`${accountsUrl}/oauth/v2/token?${q}`, { method: "POST" });
const d = await r.json().catch(() => ({}));
if (!d.refresh_token) {
  const why = {
    invalid_code: "el código venció o ya se usó: abra de nuevo el enlace de autorización (pnpm advisor:token --url) y avise enseguida",
    invalid_redirect_uri: "ZOHO_REDIRECT_URI no coincide con el 'Authorized Redirect URI' del cliente en la consola de Zoho",
    invalid_client: "el Client ID o el Client Secret no son correctos",
  }[d.error] ?? "revise los datos";
  console.error(`Zoho no entregó la clave (${d.error ?? `HTTP ${r.status}`}): ${why}.`);
  process.exit(1);
}

set("ZOHO_REFRESH_TOKEN", d.refresh_token);
if (!get("ADVISOR_SECRET")) set("ADVISOR_SECRET", randomBytes(48).toString("base64"));
// La dirección de Zoho para leer y escribir en SalesIQ (según su centro de datos)
if (d.api_domain && !get("ZOHO_ACCOUNTS_URL") && !d.api_domain.endsWith(".com"))
  console.log(`Ojo: la cuenta está en ${d.api_domain}; ajuste ZOHO_ACCOUNTS_URL y ZOHO_SALESIQ_URL.`);
// El código ya no sirve: se quita del archivo
remove("ZOHO_AUTH_CODE");
fs.writeFileSync(FILE, text, { mode: 0o600 });
console.log(`Listo: refresh token guardado en ${FILE} (alcances: ${d.scope ?? "no informados"}).`);
console.log("Siguiente paso: pnpm advisor:check");
