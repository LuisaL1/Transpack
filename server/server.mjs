// Servidor del sitio en GoDaddy (hosting Node.js; arranca con `pnpm start`).
// Hace lo que antes hacía Vercel, solo con módulos de Node (sin dependencias, sin
// `npm install` en el hosting):
//  · /api/contact y /api/ticket → las funciones de api/ (Request → Response).
//  · Lo demás → los archivos de dist/ con URLs limpias: /nosotros sirve
//    nosotros.html, /x/ y /x.html redirigen a /x, y lo que no existe responde
//    404.html con estado 404 (equivale a cleanUrls + trailingSlash: false).
//  · Cabeceras y redirecciones de hosting/headers.json (CSP, HSTS, caché…).
//  · Entrega la versión .br o .gz que deja `pnpm build` (scripts/precompress.mjs).
//
// Variables de entorno (GoDaddy → My Apps → Transpack → Settings):
//   las de api/ (BREVO_API_KEY, LEADS_*, ZOHO_*) y
//   SITE_CANONICAL_HOST  p. ej. www.transpacksas.com: redirige el dominio sin www
//                        y http → https. Vacía (URL temporal, local), no redirige.
//   SITE_DIST            carpeta del build (por defecto ../dist)
// Local: `pnpm build && pnpm start`. Documentación: docs/godaddy.md.
//
// La ruta pedida se valida y nunca sale de dist/ (resolve + prefijo): por eso se
// desactiva la regla de nombres de archivo no literales.
/* eslint-disable security/detect-non-literal-fs-filename */
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync, createReadStream } from "node:fs";
import { dirname, extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import * as contact from "../api/contact.mjs";
import * as ticket from "../api/ticket.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const API = { "/api/contact": contact, "/api/ticket": ticket };
/** Cabeceras de la conexión con Node que no pasan a la función */
const HOP = new Set(["connection", "keep-alive", "transfer-encoding", "upgrade", "content-length"]);
/** Tamaño máximo del cuerpo de un formulario */
export const MAX_BODY = 64 * 1024;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".pdf": "application/pdf",
  ".webmanifest": "application/manifest+json",
};

/** source de hosting/headers.json (formato de Vercel) → expresión regular */
export function sourceRegex(source) {
  const re = source
    .replace(/:(\w+)\*/g, "(?<$1>.*)")
    .replace(/:(\w+)\(/g, "(?<$1>")
    .replace(/:(\w+)/g, "(?<$1>[^/]+)");
  // eslint-disable-next-line security/detect-non-literal-regexp -- viene de hosting/headers.json
  return new RegExp(`^${re}$`);
}

/** Crea el manejador de peticiones (las pruebas lo usan con otra carpeta) */
export function createHandler({
  root = resolve(HERE, "..", process.env.SITE_DIST || "dist"),
  config = JSON.parse(readFileSync(join(HERE, "..", "hosting", "headers.json"), "utf8")),
  canonicalHost = (process.env.SITE_CANONICAL_HOST ?? "").trim(),
} = {}) {
  root = resolve(root);
  const redirects = config.redirects.map((r) => ({ ...r, re: sourceRegex(r.source) }));
  const rules = config.headers.map((h) => ({ re: sourceRegex(h.source), headers: h.headers }));
  /** Cabeceras de hosting/headers.json para la ruta (las últimas reglas mandan) */
  const headersFor = (pathname) => {
    const out = {};
    for (const r of rules) if (r.re.test(pathname)) for (const h of r.headers) out[h.key] = h.value;
    return out;
  };

  return async function handler(req, res) {
    const host = String(req.headers["x-forwarded-host"] ?? req.headers.host ?? "localhost");
    let url;
    try {
      url = new URL(req.url ?? "/", `http://${host}`);
      decodeURIComponent(url.pathname);
    } catch {
      return send(res, 400, { "Content-Type": "text/plain; charset=utf-8" }, "Bad Request");
    }
    const { pathname, search } = url;
    const base = headersFor(pathname);

    // 1) Dominio canónico y https (solo si SITE_CANONICAL_HOST está configurada)
    if (canonicalHost) {
      const proto = String(req.headers["x-forwarded-proto"] ?? "")
        .split(",")[0]
        .trim();
      if (host !== canonicalHost || proto === "http")
        return redirect(res, 301, `https://${canonicalHost}${pathname}${search}`, base);
    }

    // 2) Redirecciones de hosting/headers.json
    for (const r of redirects)
      if (r.re.test(pathname)) return redirect(res, r.permanent ? 308 : 307, r.destination, base);

    // 3) Funciones de api/
    if (pathname === "/api" || pathname.startsWith("/api/")) {
      const mod = API[pathname];
      const fn = mod && (req.method === "HEAD" ? mod.GET : mod[req.method ?? "GET"]);
      if (!mod) return sendJson(res, 404, { ok: false, error: "not-found" }, base);
      if (typeof fn !== "function")
        return sendJson(res, 405, { ok: false, error: "method" }, { ...base, Allow: "GET, POST" });
      return runApi(req, res, fn, `http://${host}${pathname}${search}`, base);
    }

    // 4) Archivos de dist/
    if (req.method !== "GET" && req.method !== "HEAD")
      return send(res, 405, { ...base, Allow: "GET, HEAD" }, "");
    if (pathname.length > 1 && pathname.endsWith("/"))
      return redirect(res, 308, `${pathname.replace(/\/+$/, "") || "/"}${search}`, base);
    if (pathname.endsWith(".html")) {
      const clean = pathname.slice(0, -5);
      return redirect(res, 308, `${clean === "/index" ? "/" : clean}${search}`, base);
    }
    const file = lookup(root, decodeURIComponent(pathname));
    if (file) return serveFile(req, res, file, 200, base);
    const notFound = join(root, "404.html");
    if (existsSync(notFound)) return serveFile(req, res, notFound, 404, headersFor("/404"));
    return send(res, 404, { "Content-Type": "text/plain; charset=utf-8" }, "Not Found");
  };
}

/** Archivo de dist/ para la ruta (o null). Nunca sale de root. */
function lookup(root, pathname) {
  if (pathname.includes("\0")) return null;
  // Las versiones comprimidas y los archivos ocultos no se piden directamente
  if (/\.(br|gz)$/.test(pathname) || /(^|\/)\./.test(pathname)) return null;
  const candidates = pathname === "/" ? ["/index.html"] : [`${pathname}.html`, pathname];
  for (const c of candidates) {
    const f = resolve(root, `.${c}`);
    if (!f.startsWith(root + sep)) return null;
    try {
      if (statSync(f).isFile()) return f;
    } catch {
      /* no existe */
    }
  }
  return null;
}

function serveFile(req, res, file, status, base) {
  const ext = extname(file);
  const type = MIME[ext] ?? "application/octet-stream";
  const headers = {
    "Content-Type": type,
    // Por defecto (HTML incluido) se revalida siempre; /assets/ (con hash) trae
    // su caché inmutable de hosting/headers.json
    "Cache-Control": "public, max-age=0, must-revalidate",
    ...base,
  };

  // Versión ya comprimida en el build, si el navegador la acepta
  let served = file;
  const accept = String(req.headers["accept-encoding"] ?? "");
  if (/^(text\/|application\/(json|xml|manifest)|image\/svg)/.test(type)) {
    headers.Vary = "Accept-Encoding";
    for (const [enc, re, suffix] of [
      ["br", /\bbr\b/, ".br"],
      ["gzip", /\bgzip\b/, ".gz"],
    ])
      if (re.test(accept) && existsSync(file + suffix)) {
        served = file + suffix;
        headers["Content-Encoding"] = enc;
        break;
      }
  }

  const st = statSync(served);
  const etag = `W/"${st.size.toString(16)}-${Math.floor(st.mtimeMs).toString(16)}"`;
  headers.ETag = etag;
  headers["Last-Modified"] = st.mtime.toUTCString();
  if (status === 200 && req.headers["if-none-match"] === etag) {
    delete headers["Content-Encoding"];
    return send(res, 304, headers, "");
  }
  headers["Content-Length"] = String(st.size);
  res.writeHead(status, headers);
  if (req.method === "HEAD") return res.end();
  createReadStream(served).pipe(res);
}

/** Petición de Node → Request web → función de api/ → respuesta de Node */
async function runApi(req, res, fn, url, base) {
  let body;
  if (req.method !== "GET" && req.method !== "HEAD") {
    try {
      body = await readBody(req);
    } catch {
      return sendJson(res, 413, { ok: false, error: "too-large" }, base);
    }
  }
  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers))
    if (v !== undefined && !HOP.has(k)) headers.set(k, Array.isArray(v) ? v.join(", ") : v);
  let out;
  try {
    out = await fn(new Request(url, { method: req.method, headers, body }));
  } catch (e) {
    console.error("[server] Error en", url, e);
    return sendJson(res, 500, { ok: false, error: "server" }, base);
  }
  const buf = Buffer.from(await out.arrayBuffer());
  const h = { ...base };
  out.headers.forEach((v, k) => (h[k] = v));
  h["Content-Length"] = String(buf.length);
  res.writeHead(out.status, h);
  res.end(req.method === "HEAD" ? undefined : buf);
}

function readBody(req) {
  return new Promise((ok, fail) => {
    const chunks = [];
    let size = 0;
    // Si es demasiado grande se sigue leyendo (sin guardar) para poder responder 413
    req.on("data", (c) => {
      size += c.length;
      if (size <= MAX_BODY) chunks.push(c);
    });
    req.on("end", () =>
      size > MAX_BODY ? fail(new Error("too-large")) : ok(Buffer.concat(chunks)),
    );
    req.on("error", fail);
  });
}

function send(res, status, headers, body) {
  res.writeHead(status, headers);
  res.end(body);
}
function sendJson(res, status, data, base) {
  send(
    res,
    status,
    { ...base, "Content-Type": "application/json", "Cache-Control": "no-store" },
    JSON.stringify(data),
  );
}
function redirect(res, status, location, base) {
  send(res, status, { ...base, Location: location }, "");
}

/** Arranca el servidor en el puerto que asigna el hosting (PORT) */
export function start(port = Number(process.env.PORT) || 3000) {
  const server = createServer(createHandler());
  // 0.0.0.0: el hosting llega a la app desde fuera del contenedor
  server.listen(port, process.env.HOST || "0.0.0.0", () => {
    console.log(`[server] Sitio en http://localhost:${port}`);
    // Qué variables de los formularios ve la app (solo el nombre, nunca el valor)
    const vars = [
      "BREVO_API_KEY",
      "ZOHO_CLIENT_ID",
      "ZOHO_CLIENT_SECRET",
      "ZOHO_REFRESH_TOKEN",
      "ZOHO_DESK_CLIENT_ID",
      "ZOHO_DESK_CLIENT_SECRET",
      "ZOHO_DESK_REFRESH_TOKEN",
      "ZOHO_ORG_ID",
      "ZOHO_DEPARTMENT_ID",
    ];
    const has = (k) => Boolean((process.env[k] ?? "").trim());
    console.log(`[server] Variables: ${vars.map((k) => `${k} ${has(k) ? "✓" : "✗"}`).join(" · ")}`);
  });
  return server;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) start();
