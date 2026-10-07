// Función de Vercel: recibe las solicitudes del sitio (formulario de contacto y
// cotizador) y las envía por correo con Brevo (API transaccional). La clave
// nunca llega al navegador y el sitio no guarda copia de los datos.
// Documentación: docs/formularios.md.
//
// Variables de entorno (Vercel → Settings → Environment Variables, Production):
//   BREVO_API_KEY     clave de API de Brevo (obligatoria, secreta: nunca VITE_)
//   LEADS_TO          correo que recibe las solicitudes (por defecto servicioalcliente@transpacksas.com)
//   LEADS_FROM        remitente verificado en Brevo (por defecto no-reply@transpacksas.com)
//   LEADS_FROM_NAME   nombre del remitente (por defecto "Transpack")
//
// Este archivo no importa nada de src/ (la función se compila aparte). Los
// datos de contacto de los correos se comparan con CONTACT en las pruebas
// (tests/unit/contact-api.test.ts).
//
// Diseño de los correos: plantilla layout() con el banner de la marca en
// IMAGEN (public/brand/email-header.png, generado con `pnpm email:header`).
// Gmail en modo oscuro invierte los colores del HTML y los clientes de correo
// ignoran las transformaciones CSS, así que el encabezado no puede ser HTML.

type Lang = "es" | "en" | "fr" | "de" | "it" | "ar";
type Payload = {
  kind?: string;
  subject?: string;
  fields?: Record<string, unknown>;
  replyTo?: { email?: string; name?: string };
  website?: string;
  lang?: string;
  /** Servicio o motivo en el idioma del visitante (para su confirmación) */
  about?: string;
};

export const BRAND = {
  name: "Transpack",
  legalName: "Transpack S.A.S.",
  whatsapp: "573218115967",
  phones: ["321 811 5967", "321 811 5989", "321 811 5977"],
  address: "Cra. 40 #20A – 96, Bogotá, Colombia",
  site: "https://www.transpacksas.com",
};
/** Colores de la marca (bloque @theme de src/styles/index.css) */
const C = {
  azul: "#272B7C",
  tinta: "#1D2050",
  texto: "#3E4160",
  suave: "#6B6E8A",
  linea: "#E1E5EE",
  gris: "#F0F6F6",
};
export const DEFAULT_LEADS_TO = "servicioalcliente@transpacksas.com";
const LANGS: Lang[] = ["es", "en", "fr", "de", "it", "ar"];
/** Política de datos en cada idioma (mismas rutas que src/i18n) */
export const PRIVACY_PATH: Record<Lang, string> = {
  es: "/privacidad",
  en: "/en/privacy",
  fr: "/fr/confidentialite",
  de: "/de/datenschutz",
  it: "/it/privacy",
  ar: "/ar/privacy",
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
const EMAIL = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/;

// Textos de la confirmación al visitante, en el idioma del formulario. En
// español el correo va de "usted" (registro formal pedido para los correos).
const CONFIRM: Record<
  Lang,
  {
    subject: string;
    title: string;
    hello: (n: string) => string;
    quote: (s: string) => string;
    message: (m: string) => string;
    body: (about: string) => string;
    urgent: string;
    phones: string;
    auto: string;
    policy: string;
  }
> = {
  es: {
    subject: "Recibimos su solicitud · Transpack",
    title: "¡Recibimos su solicitud!",
    hello: (n) => `Hola${n ? ` ${n}` : ""},`,
    quote: (s) => `su solicitud de cotización de ${s}`,
    message: (m) => `su mensaje (${m})`,
    body: (a) =>
      `Gracias por escribirnos. Recibimos ${a} y un asesor le responderá a este correo a la mayor brevedad.`,
    urgent: "Si necesita atención inmediata, escríbanos por WhatsApp o llámenos:",
    phones: "Teléfonos",
    auto: "Este es un mensaje automático de confirmación. Tratamos sus datos según nuestra",
    policy: "política de privacidad y tratamiento de datos",
  },
  en: {
    subject: "We received your request · Transpack",
    title: "We received your request!",
    hello: (n) => `Hello${n ? ` ${n}` : ""},`,
    quote: (s) => `your quote request for ${s}`,
    message: (m) => `your message (${m})`,
    body: (a) =>
      `Thank you for writing to us. We received ${a} and an advisor from our team will reply to this email as soon as possible.`,
    urgent: "If you need immediate assistance, message us on WhatsApp or call us:",
    phones: "Phone",
    auto: "This is an automatic confirmation message. We process your data in accordance with our",
    policy: "data processing policy",
  },
  fr: {
    subject: "Nous avons bien reçu votre demande · Transpack",
    title: "Nous avons bien reçu votre demande !",
    hello: (n) => `Bonjour${n ? ` ${n}` : ""},`,
    quote: (s) => `votre demande de devis pour ${s}`,
    message: (m) => `votre message (${m})`,
    body: (a) =>
      `Merci de nous avoir écrit. Nous avons bien reçu ${a} et un conseiller de notre équipe vous répondra à cet e-mail dans les meilleurs délais.`,
    urgent: "Pour une aide immédiate, écrivez-nous sur WhatsApp ou appelez-nous :",
    phones: "Téléphones",
    auto: "Ceci est un message automatique de confirmation. Nous traitons vos données conformément à notre",
    policy: "politique de traitement des données",
  },
  de: {
    subject: "Wir haben Ihre Anfrage erhalten · Transpack",
    title: "Wir haben Ihre Anfrage erhalten!",
    hello: (n) => `Hallo${n ? ` ${n}` : ""},`,
    quote: (s) => `Ihre Angebotsanfrage für ${s}`,
    message: (m) => `Ihre Nachricht (${m})`,
    body: (a) =>
      `Vielen Dank für Ihre Nachricht. Wir haben ${a} erhalten, und ein Berater unseres Teams antwortet Ihnen so bald wie möglich auf diese E-Mail.`,
    urgent: "Wenn Sie sofort Hilfe brauchen, schreiben Sie uns per WhatsApp oder rufen Sie uns an:",
    phones: "Telefon",
    auto: "Dies ist eine automatische Bestätigung. Wir verarbeiten Ihre Daten gemäß unserer",
    policy: "Datenschutzrichtlinie",
  },
  it: {
    subject: "Abbiamo ricevuto la tua richiesta · Transpack",
    title: "Abbiamo ricevuto la tua richiesta!",
    hello: (n) => `Ciao${n ? ` ${n}` : ""},`,
    quote: (s) => `la tua richiesta di preventivo per ${s}`,
    message: (m) => `il tuo messaggio (${m})`,
    body: (a) =>
      `Grazie per averci scritto. Abbiamo ricevuto ${a} e un consulente del nostro team ti risponderà a questa e-mail il prima possibile.`,
    urgent: "Se hai bisogno di assistenza immediata, scrivici su WhatsApp o chiamaci:",
    phones: "Telefoni",
    auto: "Questo è un messaggio automatico di conferma. Trattiamo i tuoi dati secondo la nostra",
    policy: "informativa sul trattamento dei dati",
  },
  ar: {
    subject: "تلقّينا طلبك · ترانسباك",
    title: "تلقّينا طلبك!",
    hello: (n) => `مرحبًا${n ? ` ${n}` : ""}،`,
    quote: (s) => `طلب عرض السعر الخاص بك لخدمة ${s}`,
    message: (m) => `رسالتك (${m})`,
    body: (a) =>
      `شكرًا لتواصلك معنا. تلقّينا ${a}، وسيرد عليك أحد مستشاري فريقنا على هذا البريد الإلكتروني في أقرب وقت ممكن.`,
    urgent: "إذا كنت بحاجة إلى مساعدة فورية، راسلنا عبر واتساب أو اتصل بنا:",
    phones: "الهواتف",
    auto: "هذه رسالة تأكيد تلقائية. نعالج بياناتك وفقًا لـ",
    policy: "سياسة معالجة البيانات",
  },
};

/** Dominio desde el que llegó la solicitud: el banner carga desde ahí (producción o vista previa de Vercel). */
export function baseUrl(req: Request): string {
  const host = (req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "").trim();
  const [name, port, ...rest] = host.split(":");
  const valid =
    host.length <= 253 &&
    rest.length === 0 &&
    /^[a-z0-9.-]+$/i.test(name) &&
    (port === undefined || /^[0-9]{1,5}$/.test(port));
  if (!valid) return BRAND.site;
  return `${/^(localhost|127\.0\.0\.1)(:|$)/.test(host) ? "http" : "https"}://${host}`;
}

/**
 * Plantilla común de los correos: banner (imagen), título, contenido y pie.
 * Tablas con estilos en línea (Gmail, Outlook y Apple Mail), 560 px de ancho.
 * `content` debe venir ya escapado.
 */
export function layout(base: string, title: string, content: string, lang: Lang = "es"): string {
  const dir = lang === "ar" ? "rtl" : "ltr";
  const align = dir === "rtl" ? "right" : "left";
  return `<!doctype html>
<html lang="${lang}" dir="${dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<title>${esc(title)}</title>
</head>
<body style="margin:0;padding:0;background:${C.gris}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.gris}" style="background:${C.gris}">
<tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFFFFF" style="width:100%;max-width:560px;background:#FFFFFF;border:1px solid ${C.linea};border-radius:16px;border-collapse:separate;overflow:hidden">
<tr><td bgcolor="${C.azul}" style="background:${C.azul};padding:0;line-height:0;font-size:0;border-radius:16px 16px 0 0"><img src="${base}/brand/email-header.png" width="560" alt="${BRAND.legalName}" style="display:block;width:100%;max-width:560px;height:auto;border:0;border-radius:16px 16px 0 0"></td></tr>
<tr><td dir="${dir}" style="padding:28px 28px 4px;text-align:${align}"><h1 style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:22px;line-height:1.3;color:${C.azul}">${esc(title)}</h1></td></tr>
<tr><td dir="${dir}" style="padding:16px 28px 28px;text-align:${align};font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:${C.texto}">${content}</td></tr>
<tr><td dir="${dir}" style="padding:16px 28px;border-top:1px solid ${C.linea};background:${C.gris};text-align:${align};font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:${C.suave};border-radius:0 0 16px 16px"><strong style="color:${C.tinta}">${BRAND.legalName}</strong><br>${esc(BRAND.address)}<br>${BRAND.phones[0]}</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

/** Correo al equipo: tabla con los campos de la solicitud */
export function leadEmail(base: string, subject: string, fields: Record<string, string>) {
  const rows = Object.entries(fields)
    .map(
      ([k, v]) =>
        `<tr><td valign="top" style="padding:9px 12px;border:1px solid ${C.linea};background:${C.gris};font-weight:bold;color:${C.azul};width:34%">${esc(k)}</td><td valign="top" style="padding:9px 12px;border:1px solid ${C.linea};white-space:pre-wrap;color:${C.tinta}">${esc(v)}</td></tr>`,
    )
    .join("");
  const note =
    "Enviado desde el formulario del sitio web. Responda este correo para contestarle directamente a la persona.";
  const content = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5">${rows}</table>
<p style="margin:18px 0 0;font-size:12px;color:${C.suave}">${note}</p>`;
  const text =
    `${subject}\n\n` +
    Object.entries(fields)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n") +
    `\n\n${note}`;
  return { html: layout(base, subject, content), text };
}

/** Correo de confirmación para el visitante ("recibimos su solicitud") */
export function confirmation(
  kind: "contacto" | "cotizacion",
  name: string,
  fields: Record<string, string>,
  lang: Lang = "es",
  about?: string,
  base: string = BRAND.site,
) {
  const c = CONFIRM[lang];
  const first = name.trim().split(/\s+/)[0] ?? "";
  const topic =
    about?.trim() ||
    (kind === "cotizacion" ? fields["Servicio"] || "Transpack" : fields["Motivo"] || "contacto");
  const aboutText = kind === "cotizacion" ? c.quote(topic) : c.message(topic);
  const aboutHtml =
    kind === "cotizacion"
      ? c.quote(`<strong style="color:${C.tinta}">${esc(topic)}</strong>`)
      : c.message(esc(topic));
  const policyUrl = BRAND.site + PRIVACY_PATH[lang];
  const wa = `https://wa.me/${BRAND.whatsapp}`;
  const content = `<p style="margin:0 0 12px">${esc(c.hello(first))}</p>
<p style="margin:0 0 20px">${c.body(aboutHtml)}</p>
<p style="margin:0 0 12px">${esc(c.urgent)}</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 16px"><tr><td bgcolor="${C.azul}" style="background:${C.azul};border-radius:12px"><a href="${wa}" style="display:inline-block;padding:12px 22px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:#FFFFFF;text-decoration:none;border-radius:12px">WhatsApp ${BRAND.phones[0]}</a></td></tr></table>
<p style="margin:0 0 20px;color:${C.suave}">${esc(c.phones)}: ${BRAND.phones.join(" · ")}</p>
<p style="margin:0;font-size:12px;color:${C.suave}">${esc(c.auto)} <a href="${policyUrl}" style="color:${C.azul}">${esc(c.policy)}</a>.</p>`;
  const text = `${c.hello(first)}\n\n${c.body(aboutText)}\n\n${c.urgent}\nWhatsApp ${BRAND.phones[0]} (${wa})\n${c.phones}: ${BRAND.phones.join(" · ")}\n\n${c.auto} ${c.policy}: ${policyUrl}\n\n${BRAND.legalName} · ${BRAND.address}`;
  return { subject: c.subject, html: layout(base, c.title, content, lang), text };
}

/** Diagnóstico para el área encargada: ¿está configurada la clave? (no la revela) */
export async function GET(): Promise<Response> {
  return json({ configured: Boolean(process.env.BREVO_API_KEY) });
}

export async function POST(req: Request): Promise<Response> {
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

  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return json({ ok: false, error: "json" }, 400);
  }
  if (!body || typeof body !== "object") return json({ ok: false, error: "json" }, 400);

  // Campo trampa para bots: si viene lleno, se responde OK sin enviar nada.
  if (body.website) return json({ ok: true });

  const kind = body.kind === "cotizacion" ? "cotizacion" : "contacto";
  const lang: Lang = LANGS.includes(body.lang as Lang) ? (body.lang as Lang) : "es";
  const entries = Object.entries(body.fields ?? {});
  if (entries.length === 0 || entries.length > 40)
    return json({ ok: false, error: "fields" }, 422);
  const fields = Object.fromEntries(
    entries
      .filter(([k, v]) => typeof v === "string" && k.length > 0 && k.length <= 60)
      .map(([k, v]) => [k, (v as string).trim().slice(0, 4000)]),
  ) as Record<string, string>;
  const replyEmail = String(body.replyTo?.email ?? "").trim();
  if (replyEmail.length > 160 || !EMAIL.test(replyEmail))
    return json({ ok: false, error: "email" }, 422);
  if (fields["Autorización de datos"] !== "Sí") return json({ ok: false, error: "consent" }, 422);

  const key = process.env.BREVO_API_KEY;
  if (!key) return json({ ok: false, error: "not-configured" }, 503);

  const subject = String(
    body.subject || (kind === "cotizacion" ? "Solicitud de cotización" : "Nuevo mensaje de contacto"),
  ).slice(0, 150);
  const base = baseUrl(req);
  const { html, text } = leadEmail(base, subject, fields);

  const sender = {
    email: process.env.LEADS_FROM || "no-reply@transpacksas.com",
    name: process.env.LEADS_FROM_NAME || BRAND.name,
  };
  const leadsTo = process.env.LEADS_TO || DEFAULT_LEADS_TO;
  const send = (payload: Record<string, unknown>) =>
    fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": key, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ sender, ...payload }),
    });

  // 1) Solicitud al equipo de Transpack ("responder a" = el visitante)
  const name = String(body.replyTo?.name ?? "").slice(0, 120);
  let res: Response;
  try {
    res = await send({
      to: [{ email: leadsTo, name: "Servicio al cliente Transpack" }],
      replyTo: { email: replyEmail, name: name || replyEmail },
      subject,
      htmlContent: html,
      textContent: text,
      tags: [`sitio-${kind}`],
    });
  } catch {
    return json({ ok: false, error: "provider" }, 502);
  }
  if (!res.ok) return json({ ok: false, error: "provider", status: res.status }, 502);

  // 2) Confirmación automática al visitante (si falla, la solicitud ya llegó: no se reporta error)
  try {
    const c = confirmation(kind, name, fields, lang, String(body.about ?? "").slice(0, 200), base);
    await send({
      to: [{ email: replyEmail, name: name || replyEmail }],
      replyTo: { email: leadsTo, name: "Transpack" },
      subject: c.subject,
      htmlContent: c.html,
      textContent: c.text,
      tags: [`sitio-${kind}-confirmacion`],
    });
  } catch {
    /* sin confirmación */
  }
  return json({ ok: true });
}
