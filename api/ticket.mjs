// Función de Vercel: crea un ticket en Zoho Desk a partir de los datos del
// visitante (nombre, correo, asunto, mensaje). El navegador nunca habla con
// Zoho: esta función canjea el refresh token por un access token (OAuth) y llama
// a la API de Zoho Desk. Este archivo no importa nada de src/.
//
// JavaScript .mjs (no TypeScript): Node lo carga como módulo ES, igual que
// api/advisor.mjs y api/contact.mjs.
//
// Zoho Desk EXIGE un contacto para cada ticket: la función primero busca el
// contacto por su correo (o lo crea) y luego crea el ticket con ese contactId.
//
// Variables de entorno (Vercel → Settings → Environment Variables, Production):
//   ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN  credenciales OAuth
//       (Self Client de api-console.zoho.com). SECRETAS: nunca con prefijo VITE_.
//       El refresh token debe tener los alcances (scopes) de DESK:
//         Desk.tickets.CREATE, Desk.contacts.CREATE, Desk.contacts.READ
//       (un token hecho para SalesIQ NO sirve para Desk).
//   ZOHO_ORG_ID         id de la organización de Zoho Desk (cabecera orgId)
//   ZOHO_DEPARTMENT_ID  departamento que recibe el ticket
//   ZOHO_ACCOUNTS_URL   por defecto https://accounts.zoho.com (cambia según el
//                       centro de datos: .eu, .in, .com.au, .com.cn…)
//   ZOHO_DESK_URL       por defecto https://desk.zoho.com (mismo centro de datos)
//
// Sin credenciales responde "not-configured" (503).

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
  orgId: env("ZOHO_ORG_ID"),
  departmentId: env("ZOHO_DEPARTMENT_ID"),
  accounts: env("ZOHO_ACCOUNTS_URL") || "https://accounts.zoho.com",
  desk: env("ZOHO_DESK_URL") || "https://desk.zoho.com",
});

export const isConfigured = () => {
  const c = cfg();
  return Boolean(
    c.clientId && c.clientSecret && c.refreshToken && c.orgId && c.departmentId,
  );
};

// ─── OAuth: refresh token → access token ────────────────────────────────────
// El token de acceso dura ~1 h: se guarda mientras la función sigue viva.
let cached = null;
export const resetTokenCache = () => {
  cached = null;
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

// ─── Cliente de Zoho Desk ───────────────────────────────────────────────────
async function desk(path, init = {}) {
  const c = cfg();
  const r = await fetch(`${c.desk}/api/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Zoho-oauthtoken ${await accessToken()}`,
      orgId: c.orgId,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) {
    const e = new Error(`desk-${r.status}`);
    e.detail = d; // se registra en el servidor, nunca se devuelve al navegador
    throw e;
  }
  return d;
}

/** Busca el contacto por correo (si hay permiso) o lo crea; devuelve su id. */
export async function contactId({ name, email, phone }) {
  // Mejor esfuerzo: buscar por correo para no duplicar (requiere Desk.contacts.READ)
  if (email) {
    try {
      const found = await desk(`/contacts/search?email=${encodeURIComponent(email)}`);
      const hit = (found.data ?? [])[0];
      if (hit?.id) return hit.id;
    } catch {
      /* sin permiso de búsqueda o sin resultados: se crea abajo */
    }
  }
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  const lastName = parts.length > 1 ? parts.slice(1).join(" ") : parts[0] || "Visitante";
  const firstName = parts.length > 1 ? parts[0] : "";
  const created = await desk("/contacts", {
    method: "POST",
    body: JSON.stringify({
      lastName,
      ...(firstName ? { firstName } : {}),
      ...(email ? { email } : {}),
      ...(phone ? { phone } : {}),
    }),
  });
  if (!created.id) throw new Error("no-contact");
  return created.id;
}

// ─── Manejadores ────────────────────────────────────────────────────────────

/** ¿Está configurado? (útil para que el frontend lo consulte antes de ofrecerlo) */
export async function GET() {
  return json({ configured: isConfigured() });
}

export async function POST(req) {
  // Solo desde el propio sitio (mismo chequeo que api/advisor.mjs)
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

  const name = String(body.name ?? "").trim().slice(0, 120);
  const email = String(body.email ?? "").trim().slice(0, 160);
  const subject = String(body.subject ?? "").trim().slice(0, 255);
  const description = String(body.message ?? body.description ?? "").trim().slice(0, 5000);
  const phone = String(body.phone ?? "").trim().slice(0, 40);

  if (!subject) return json({ ok: false, error: "subject" }, 422);
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ ok: false, error: "email" }, 422);
  // Necesita al menos un medio de contacto (el cotizador siempre trae teléfono;
  // el correo es opcional). Zoho Desk crea el contacto con lo que haya.
  if (!email && !phone) return json({ ok: false, error: "contact" }, 422);

  const c = cfg();
  try {
    const contact = await contactId({ name, email, phone });
    const ticket = await desk("/tickets", {
      method: "POST",
      body: JSON.stringify({
        subject,
        departmentId: c.departmentId,
        contactId: contact,
        description: description || subject,
        email,
        ...(phone ? { phone } : {}),
        channel: "Web",
        status: "Open",
      }),
    });
    return json({ ok: true, id: ticket.id ?? null, ticketNumber: ticket.ticketNumber ?? null });
  } catch (e) {
    // No se reenvía el detalle de Zoho al navegador
    console.error("[ticket]", e instanceof Error ? e.message : e, e?.detail ?? "");
    return json({ ok: false, error: "provider" }, 502);
  }
}
