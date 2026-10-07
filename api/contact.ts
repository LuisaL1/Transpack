// Función de Vercel: recibe las solicitudes del sitio (formulario de contacto y
// cotizador) y las envía por correo con Brevo (API transaccional). La clave
// nunca llega al navegador y el sitio no guarda copia de los datos.
// Documentación: docs/formularios.md.
//
// Variables de entorno (Vercel → Settings → Environment Variables, Production):
//   BREVO_API_KEY     clave de API de Brevo (obligatoria, secreta: nunca VITE_)
//   LEADS_TO          correo que recibe las solicitudes (por defecto servicioalcliente@transpacksas.com)
//   LEADS_FROM        remitente verificado en Brevo (por defecto no-reply@transpacksas.com)
//   LEADS_FROM_NAME   nombre del remitente (por defecto "Sitio web Transpack")
//
// Este archivo no importa nada de src/ (la función se compila aparte). Los
// datos de contacto de la confirmación se comparan con CONTACT en las pruebas
// (tests/unit/contact-api.test.ts).

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
  site: "https://www.transpacksas.com",
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

// Textos de la confirmación al visitante (trato de "tú", como el sitio)
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
    subject: "Recibimos tu solicitud · Transpack",
    title: "¡Recibimos tu solicitud!",
    hello: (n) => `Hola${n ? ` ${n}` : ""},`,
    quote: (s) => `tu solicitud de cotización de ${s}`,
    message: (m) => `tu mensaje (${m})`,
    body: (a) =>
      `Gracias por escribirnos. Recibimos ${a} y un asesor de nuestro equipo te responderá a este correo a la mayor brevedad.`,
    urgent: "Si necesitas atención inmediata, escríbenos por WhatsApp o llámanos:",
    phones: "Teléfonos",
    auto: "Este es un mensaje automático de confirmación. Tratamos tus datos según nuestra",
    policy: "política de tratamiento de datos",
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

/** Correo de confirmación para el visitante ("recibimos tu solicitud") */
export function confirmation(
  kind: "contacto" | "cotizacion",
  name: string,
  fields: Record<string, string>,
  lang: Lang = "es",
  about?: string,
) {
  const c = CONFIRM[lang];
  const first = name.trim().split(/\s+/)[0] ?? "";
  const topic =
    about?.trim() ||
    (kind === "cotizacion" ? fields["Servicio"] || "Transpack" : fields["Motivo"] || "contacto");
  const aboutText = kind === "cotizacion" ? c.quote(topic) : c.message(topic);
  const aboutHtml =
    kind === "cotizacion"
      ? c.quote(`<strong>${esc(topic)}</strong>`)
      : c.message(esc(topic));
  const policyUrl = BRAND.site + PRIVACY_PATH[lang];
  const wa = `https://wa.me/${BRAND.whatsapp}`;
  const dir = lang === "ar" ? "rtl" : "ltr";
  const html = `<div dir="${dir}" style="background:#F0F6F6;padding:24px 12px;font-family:Arial,sans-serif;color:#2B2B3A">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #E3E6EE">
<div style="background:#272B7C;padding:22px 26px"><p style="margin:0;color:#FF7619;font-size:12px;font-weight:bold;letter-spacing:.12em;text-transform:uppercase">${BRAND.legalName}</p><h1 style="margin:6px 0 0;color:#fff;font-size:20px">${esc(c.title)}</h1></div>
<div style="padding:24px 26px;font-size:15px;line-height:1.6">
<p style="margin:0 0 12px">${esc(c.hello(first))}</p>
<p style="margin:0 0 12px">${c.body(aboutHtml)}</p>
<p style="margin:0 0 18px">${esc(c.urgent)}</p>
<p style="margin:0 0 6px"><a href="${wa}" style="color:#272B7C;font-weight:bold">WhatsApp ${BRAND.phones[0]}</a></p>
<p style="margin:0 0 18px;color:#5B5F73">${esc(c.phones)}: ${BRAND.phones.join(" · ")}</p>
<p style="margin:0;color:#5B5F73;font-size:12px">${esc(c.auto)} <a href="${policyUrl}" style="color:#272B7C">${esc(c.policy)}</a>.</p>
</div></div></div>`;
  const text = `${c.hello(first)}\n\n${c.body(aboutText)}\n\n${c.urgent}\nWhatsApp ${BRAND.phones[0]} (${wa})\n${c.phones}: ${BRAND.phones.join(" · ")}\n\n${c.auto} ${c.policy}: ${policyUrl}\n\n${BRAND.legalName}`;
  return { subject: c.subject, html, text };
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
  const rows = Object.entries(fields)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;border:1px solid #E3E6EE;background:#F0F6F6;font-weight:600;color:#272B7C;vertical-align:top">${esc(k)}</td><td style="padding:8px 12px;border:1px solid #E3E6EE;white-space:pre-wrap">${esc(v)}</td></tr>`,
    )
    .join("");
  const html = `<div style="font-family:Arial,sans-serif;color:#2B2B3A"><h2 style="color:#272B7C;margin:0 0 12px">${esc(subject)}</h2><table style="border-collapse:collapse;font-size:14px">${rows}</table><p style="color:#5B5F73;font-size:12px;margin-top:16px">Enviado desde el sitio web de Transpack. Responde este correo para contestarle directamente a la persona.</p></div>`;
  const text =
    `${subject}\n\n` +
    Object.entries(fields)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");

  const sender = {
    email: process.env.LEADS_FROM || "no-reply@transpacksas.com",
    name: process.env.LEADS_FROM_NAME || "Sitio web Transpack",
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
    const c = confirmation(kind, name, fields, lang, String(body.about ?? "").slice(0, 200));
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
