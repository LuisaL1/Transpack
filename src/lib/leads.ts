// Envía una solicitud del sitio a /api/contact (función de Vercel → Brevo →
// correo de Transpack). `fields` llega como tabla en el correo. Nunca se envía
// a servicios de formularios de terceros.
import type { Lang } from "@/i18n";

export type LeadKind = "contacto" | "cotizacion";
export type LeadResult = { ok: true } | { ok: false; error: string };

export async function sendLead(
  kind: LeadKind,
  subject: string,
  fields: Record<string, string>,
  replyTo: { email: string; name?: string },
  website = "",
  // Idioma del visitante y servicio o motivo en ese idioma: la confirmación
  // automática que recibe sale en su idioma.
  { lang = "es", about = "" }: { lang?: Lang; about?: string } = {},
): Promise<LeadResult> {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, subject, fields, replyTo, website, lang, about }),
    });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    return res.ok && data.ok ? { ok: true } : { ok: false, error: data.error || `http-${res.status}` };
  } catch {
    return { ok: false, error: "network" };
  }
}
