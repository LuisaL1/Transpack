// Función de Vercel: chat con un asesor de Transpack DENTRO de la ventana de Joel.
// El navegador nunca habla con Zoho: esta función abre la conversación en
// Zoho SalesIQ (API REST), envía los mensajes del visitante y devuelve las
// respuestas del asesor. El asesor atiende desde su panel de SalesIQ como
// cualquier otro chat. Documentación: docs/chat-crm.md.
//
// JavaScript .mjs (no TypeScript): Node siempre lo carga como módulo ES. Con
// .ts, Vercel lo compilaba a ES pero lo cargaba como CommonJS y la función se
// caía al arrancar ("Unexpected token 'export'", error 500); .mts no lo
// reconoce como función (404). Las pruebas la verifican (tests/unit).
//
// Variables de entorno (Vercel → Settings → Environment Variables, Production):
//   ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN  credenciales OAuth
//       (Self Client de api-console.zoho.com). SECRETAS: nunca con prefijo VITE_.
//   ADVISOR_SECRET              clave para firmar el acceso a cada conversación (larga y aleatoria)
//   ZOHO_SALESIQ_SCREEN         nombre del portal (por defecto "transpacksas")
//   ZOHO_SALESIQ_APP_ID         id de la marca (si falta, se usa la primera)
//   ZOHO_SALESIQ_DEPARTMENT_ID  departamento que atiende (si falta, el primero)
//   ZOHO_ACCOUNTS_URL           por defecto https://accounts.zoho.com
//   ZOHO_SALESIQ_URL            por defecto https://salesiq.zoho.com
//
// Sin credenciales responde "not-configured" y el sitio abre la ventana de
// Zoho como antes (src/lib/crmChat.ts). Este archivo no importa nada de src/.
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

/** Mensaje del asesor (o del sistema) tal como lo recibe el chat de Joel */

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

const env = (k) => (process.env[k] ?? "").trim();
const cfg = () => ({
  clientId: env("ZOHO_CLIENT_ID"),
  clientSecret: env("ZOHO_CLIENT_SECRET"),
  refreshToken: env("ZOHO_REFRESH_TOKEN"),
  secret: env("ADVISOR_SECRET"),
  screen: env("ZOHO_SALESIQ_SCREEN") || "transpacksas",
  appId: env("ZOHO_SALESIQ_APP_ID"),
  departmentId: env("ZOHO_SALESIQ_DEPARTMENT_ID"),
  accounts: env("ZOHO_ACCOUNTS_URL") || "https://accounts.zoho.com",
  salesiq: env("ZOHO_SALESIQ_URL") || "https://salesiq.zoho.com",
});
export const isConfigured = () => {
  const c = cfg();
  return Boolean(c.clientId && c.clientSecret && c.refreshToken && c.secret);
};

// ─── Acceso firmado a cada conversación ─────────────────────────────────────
// El navegador recibe un "pase" firmado con ADVISOR_SECRET que solo sirve para
// SU conversación: nadie puede leer ni escribir en la de otra persona.

const b64 = (s) => Buffer.from(s).toString("base64url");
const sign = (data) => createHmac("sha256", cfg().secret).update(data).digest("base64url");

export function makePass(p) {
  const data = b64(JSON.stringify(p));
  return `${data}.${sign(data)}`;
}

export function readPass(token) {
  if (typeof token !== "string" || token.length > 1000) return null;
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;
  const good = Buffer.from(sign(data));
  const given = Buffer.from(sig);
  if (good.length !== given.length || !timingSafeEqual(good, given)) return null;
  try {
    const p = JSON.parse(Buffer.from(data, "base64url").toString());
    return p.exp > Date.now() ? p : null;
  } catch {
    return null;
  }
}

// ─── Cliente de Zoho ────────────────────────────────────────────────────────
// El token de acceso dura una hora: se guarda mientras la función sigue viva.
let cached = null;
export const resetZohoCache = () => {
  cached = null;
  ids = null;
};

async function accessToken() {
  if (cached && cached.exp > Date.now() + 60_000) return cached.token;
  const c = cfg();
  const q = new URLSearchParams({
    refresh_token: c.refreshToken,
    client_id: c.clientId,
    client_secret: c.clientSecret,
    grant_type: "refresh_token",
  });
  const r = await fetch(`${c.accounts}/oauth/v2/token?${q}`, { method: "POST" });
  const d = await r.json().catch(() => ({}));
  if (!r.ok || !d.access_token) throw new Error(`oauth-${r.status}`);
  cached = { token: d.access_token, exp: Date.now() + (d.expires_in ?? 3600) * 1000 };
  return d.access_token;
}

async function zoho(path, init = {}) {
  const c = cfg();
  const r = await fetch(`${c.salesiq}${path}`, {
    ...init,
    headers: {
      Authorization: `Zoho-oauthtoken ${await accessToken()}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`zoho-${r.status}`);
  return d;
}

// Marca y departamento: de las variables o, si faltan, los primeros del portal
let ids = null;
async function appAndDepartment() {
  if (ids) return ids;
  const c = cfg();
  const first = async (kind) => {
    const d = await zoho(`/api/v2/${c.screen}/${kind}`);
    const list = d.data ?? [];
    if (!list[0]?.id) throw new Error(`no-${kind}`);
    return String(list[0].id);
  };
  ids = {
    appId: c.appId || (await first("apps")),
    departmentId: c.departmentId || (await first("departments")),
  };
  return ids;
}

/** Convierte los mensajes de Zoho en mensajes para el chat de Joel. */
export function mapMessages(data, after = 0) {
  const out = [];
  for (const raw of Array.isArray(data) ? data : []) {
    const seq = Number(raw.sequence_id ?? 0);
    if (!(seq > after)) continue;
    const sender = raw.sender ?? {};
    const sid = String(sender.id ?? "");
    const msg = raw.message ?? {};
    // Los mensajes del visitante (id con "$") ya están en su pantalla
    if (sid.startsWith("$")) continue;
    if (raw.type === "text" && typeof msg.text === "string" && msg.text.trim()) {
      out.push({
        id: String(raw.id ?? seq),
        seq,
        from: sid.startsWith("b") ? "bot" : "operator",
        name: String(sender.name ?? ""),
        text: msg.text.slice(0, 4000),
        time: Number(raw.time ?? 0),
      });
    } else if (raw.type === "info") {
      // Un asesor tomó el chat: se avisa al visitante con su nombre
      const mode = String(msg.mode ?? "");
      const who = String((msg.operation_user ?? {}).name ?? sender.name ?? "");
      if (/accept|attend|join/i.test(mode) && who) {
        out.push({
          id: String(raw.id ?? seq),
          seq,
          from: "system",
          name: who,
          text: "joined",
          time: Number(raw.time ?? 0),
        });
      } else if (/end|close|missed/i.test(mode)) {
        out.push({
          id: String(raw.id ?? seq),
          seq,
          from: "system",
          name: who,
          text: "ended",
          time: Number(raw.time ?? 0),
        });
      }
    }
  }
  return out;
}

// ─── Manejadores ───────────────────────────────────────────────────────────

/** ¿Está configurado? (el chat de Joel lo pregunta antes de ofrecer el chat aquí) */
export async function GET() {
  return json({ configured: isConfigured() });
}

export async function POST(req) {
  // Solo desde el propio sitio
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (origin && host) {
    let originHost = "";
    try {
      originHost = new URL(origin).host;
    } catch {
      /* origen inválido */
    }
    if (originHost !== host) return json({ ok: false, error: "origin" }, 403);
  }
  if (!isConfigured()) return json({ ok: false, error: "not-configured" }, 503);

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: "json" }, 400);
  }
  const c = cfg();

  try {
    // 1) Abrir la conversación con la primera pregunta
    if (body.action === "start") {
      const question = String(body.question ?? "").trim();
      if (!question || question.length > 2000) return json({ ok: false, error: "question" }, 422);
      const { appId, departmentId } = await appAndDepartment();
      const userId = `web-${randomUUID()}`;
      const name =
        String(body.name ?? "")
          .trim()
          .slice(0, 80) || "Visitante del sitio";
      const d = await zoho(`/api/visitor/v1/${c.screen}/conversations`, {
        method: "POST",
        body: JSON.stringify({
          app_id: appId,
          department_id: departmentId,
          question,
          visitor: {
            user_id: userId,
            name,
            ...(body.page ? { current_page: String(body.page).slice(0, 300) } : {}),
          },
        }),
      });
      const conv = d.data ?? {};
      if (!conv.id) throw new Error("no-conversation");
      const now = Date.now();
      const pass = makePass({
        c: String(conv.id),
        u: userId,
        t: Number(conv.start_time ?? now),
        exp: now + 12 * 3600_000,
      });
      return json({ ok: true, token: pass });
    }

    // Lo demás exige el pase de la conversación
    const p = readPass(body.token);
    if (!p) return json({ ok: false, error: "token" }, 403);

    // 2) Mensaje del visitante
    if (body.action === "send") {
      const text = String(body.text ?? "").trim();
      if (!text || text.length > 2000) return json({ ok: false, error: "text" }, 422);
      await zoho(`/api/visitor/v1/${c.screen}/conversations/${encodeURIComponent(p.c)}/messages`, {
        method: "POST",
        body: JSON.stringify({ text }),
      });
      return json({ ok: true });
    }

    // 3) Respuestas nuevas del asesor (el chat de Joel pregunta cada pocos segundos)
    if (body.action === "poll") {
      const after = Number(body.after ?? 0) || 0;
      const q = new URLSearchParams({ limit: "50", from_time: String(p.t - 60_000) });
      const d = await zoho(
        `/api/v2/${c.screen}/conversations/${encodeURIComponent(p.c)}/messages?${q}`,
      );
      return json({ ok: true, messages: mapMessages(d.data, after) });
    }

    return json({ ok: false, error: "action" }, 400);
  } catch (e) {
    // No se reenvía el detalle de Zoho al navegador
    console.error("[advisor]", e instanceof Error ? e.message : e);
    return json({ ok: false, error: "provider" }, 502);
  }
}
