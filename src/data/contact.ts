// Formulario de contacto (ventana emergente, components/layout/ContactModal.tsx):
// motivos, textos y el enlace que lo abre. Reemplaza los enlaces de correo (mailto) del
// sitio: cualquier enlace a "#contacto" abre el formulario. El envío va a
// /api/contact (función de Vercel → Brevo → correo de Transpack).
import { makeTr, type Tr } from "@/i18n";

export type ContactReason =
  | "cotizacion"
  | "informacion"
  | "soporte"
  | "pqrs"
  | "datos"
  | "empleo"
  | "otro";

export const CONTACT_REASONS: ContactReason[] = [
  "cotizacion",
  "informacion",
  "soporte",
  "pqrs",
  "datos",
  "empleo",
  "otro",
];

/** Nombre de cada motivo en el idioma de la página */
export const contactReasons = (tr: Tr): Record<ContactReason, string> => ({
  cotizacion: tr("Cotización de una mudanza o bodegaje", "Moving or storage quote"),
  informacion: tr("Información general", "General information"),
  soporte: tr("Soporte de un servicio en curso", "Support with an ongoing service"),
  pqrs: tr(
    "Peticiones, quejas, reclamos o sugerencias (PQRS)",
    "Requests, complaints or suggestions",
  ),
  datos: tr("Datos personales (Ley 1581)", "Personal data (Law 1581)"),
  empleo: tr("Trabajar con nosotros", "Work with us"),
  otro: tr("Otro", "Other"),
});

/** Motivo en español (el equipo de Transpack recibe los correos en español) */
export const reasonEs = (r: ContactReason) => contactReasons(makeTr("es"))[r];

export type ContactPrefill = {
  motivo?: ContactReason;
  mensaje?: string;
  nombre?: string;
  empresa?: string;
};

/** Enlace que abre el formulario de contacto, con datos precargados opcionales. */
export const contactHref = (prefill: ContactPrefill = {}) => {
  const q = new URLSearchParams(
    Object.entries(prefill).filter(([, v]) => v) as [string, string][],
  ).toString();
  return q ? `#contacto?${q}` : "#contacto";
};

/** Lee los datos precargados de un enlace "#contacto?…" */
export const parseContactHref = (href: string): ContactPrefill => {
  const p = new URLSearchParams(href.split("?")[1] ?? "");
  const motivo = p.get("motivo") as ContactReason | null;
  return {
    motivo: motivo && CONTACT_REASONS.includes(motivo) ? motivo : undefined,
    mensaje: p.get("mensaje") ?? undefined,
    nombre: p.get("nombre") ?? undefined,
    empresa: p.get("empresa") ?? undefined,
  };
};

export const contactFormText = (tr: Tr) => ({
  title: tr("Escríbenos", "Write to us"),
  subtitle: tr(
    "Déjanos tus datos y un asesor de Transpack te responde.",
    "Leave your details and a Transpack advisor will get back to you.",
  ),
  close: tr("Cerrar formulario", "Close form"),
  nombre: tr("Nombre", "Name"),
  empresa: tr("Empresa", "Company"),
  correo: tr("Correo electrónico", "Email"),
  telefono: tr("Teléfono", "Phone"),
  motivo: tr("Motivo", "Reason"),
  mensaje: tr("Mensaje", "Message"),
  mensajePlaceholder: tr("Cuéntanos qué necesitas…", "Tell us what you need…"),
  consent: tr(
    "Autorizo a Transpack S.A.S. a tratar mis datos personales para responder esta solicitud, según su",
    "I authorize Transpack S.A.S. to process my personal data to answer this request, in accordance with its",
  ),
  consentLink: tr("política de tratamiento de datos", "data processing policy"),
  send: tr("Enviar mensaje", "Send message"),
  sending: tr("Enviando…", "Sending…"),
  sentTitle: tr("¡Mensaje enviado!", "Message sent!"),
  sentText: (email: string) =>
    tr(
      `Recibimos tu solicitud. Un asesor te responderá a ${email}.`,
      `We received your request. An advisor will reply to ${email}.`,
      {
        fr: `Nous avons bien reçu votre demande. Un conseiller vous répondra à ${email}.`,
        de: `Wir haben Ihre Anfrage erhalten. Ein Berater antwortet Ihnen an ${email}.`,
        it: `Abbiamo ricevuto la tua richiesta. Un consulente ti risponderà a ${email}.`,
        ar: `تلقّينا طلبك. سيرد عليك أحد مستشارينا على ${email}.`,
      },
    ),
  closeBtn: tr("Cerrar", "Close"),
  error: tr(
    "No pudimos enviar tu mensaje en este momento. Inténtalo de nuevo o escríbenos por",
    "We couldn't send your message right now. Please try again or message us on",
  ),
});
