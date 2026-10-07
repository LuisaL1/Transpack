// ─── Formulario de contacto (ventana emergente) ─────────────────────────────
// Reemplaza los enlaces de correo (mailto) del sitio: cualquier enlace a "#contacto" (o
// "#contacto?motivo=…&mensaje=…&nombre=…&empresa=…", ver contactHref en
// src/data/contact.ts) abre esta ventana con esos datos precargados. Envía a
// /api/contact (Brevo → correo de Transpack) con la autorización de
// tratamiento de datos (Ley 1581 de 2012). Se monta una sola vez en App.
import { useEffect, useMemo, useRef, useState } from "react";
import { useSite } from "@/hooks/useContent";
import { LANG_INFO, useLang } from "@/i18n";
import {
  CONTACT_REASONS,
  contactFormText,
  contactReasons,
  parseContactHref,
  reasonEs,
  type ContactReason,
} from "@/data/contact";
import { trackEvent } from "@/lib/analytics";
import { sendLead } from "@/lib/leads";
import { Bi, btn } from "@/components/ui";
import { inputCls } from "@/components/home/QuoteFields";

type Status = "idle" | "sending" | "sent" | "error";
const EMPTY = {
  nombre: "",
  empresa: "",
  email: "",
  telefono: "",
  motivo: "informacion" as ContactReason,
  mensaje: "",
  autorizacion: false,
  website: "",
};

export function ContactModal() {
  const { lang, lp, tr } = useLang();
  const t = useMemo(() => contactFormText(tr), [tr]);
  const reasons = useMemo(() => contactReasons(tr), [tr]);
  const { waLink } = useSite();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState<Status>("idle");
  const firstRef = useRef<HTMLInputElement>(null);
  const returnRef = useRef<HTMLElement | null>(null);

  // Abre la ventana desde cualquier enlace "#contacto…" del sitio
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a");
      const href = a?.getAttribute("href") ?? "";
      if (!href.startsWith("#contacto")) return;
      e.preventDefault();
      const p = parseContactHref(href);
      returnRef.current = a;
      setForm((f) => ({
        ...f,
        ...(p.motivo ? { motivo: p.motivo } : {}),
        ...(p.mensaje ? { mensaje: p.mensaje } : {}),
        ...(p.nombre ? { nombre: p.nombre } : {}),
        ...(p.empresa ? { empresa: p.empresa } : {}),
      }));
      setStatus((s) => (s === "sent" ? "idle" : s));
      setOpen(true);
      trackEvent("contact_click", { method: "form" });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Foco inicial, Esc para cerrar y sin desplazamiento de fondo
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const id = requestAnimationFrame(() => firstRef.current?.focus());
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const back = returnRef.current;
    return () => {
      cancelAnimationFrame(id);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      back?.focus?.();
    };
  }, [open]);

  if (!open) return null;
  const set = (k: keyof typeof form, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));
  const close = () => {
    if (status === "sent") setForm(EMPTY);
    setOpen(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const motivo = reasonEs(form.motivo);
    const r = await sendLead(
      "contacto",
      `Contacto web — ${motivo}`,
      {
        Motivo: motivo,
        Nombre: form.nombre.trim(),
        Empresa: form.empresa.trim() || "—",
        Correo: form.email.trim(),
        Teléfono: form.telefono.trim() || "—",
        Mensaje: form.mensaje.trim(),
        ...(lang !== "es" ? { "Idioma del cliente": LANG_INFO[lang].name } : {}),
        "Autorización de datos": "Sí",
      },
      { email: form.email.trim(), name: form.nombre.trim() },
      form.website,
      { lang, about: reasons[form.motivo] },
    );
    setStatus(r.ok ? "sent" : "error");
    if (r.ok) trackEvent("generate_lead", { method: "form", reason: form.motivo, lang });
  };

  const label = "mb-1.5 block text-[0.85rem] font-semibold text-tinta";

  return (
    // Clic en el fondo oscuro cierra (con teclado: Esc o el botón Cerrar)
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-tinta/55 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-title"
    >
      <div className="animate-fade-up max-h-[100dvh] w-full overflow-y-auto rounded-t-[24px] bg-white shadow-[var(--shadow-float)] sm:max-h-[92vh] sm:max-w-[560px] sm:rounded-[24px]">
        {/* Cabecera: azul sólido con el cuadrado naranja girado (estilo de los menús y el chat) */}
        <header className="relative overflow-hidden bg-azul px-6 pb-5 pt-5">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rotate-45 rounded-[22%] bg-naranja/25"
          />
          <p className="relative font-title text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-naranja">
            Transpack
          </p>
          <h2
            id="contact-title"
            className="relative flex items-center gap-2 text-xl font-semibold !text-white"
          >
            <Bi n="envelope-paper" className="text-naranja" /> {t.title}
          </h2>
          <p className="relative mt-1 text-[0.88rem] text-white/75">{t.subtitle}</p>
          <button
            type="button"
            onClick={close}
            aria-label={t.close}
            className="absolute end-4 top-4 grid h-8 w-8 place-items-center rounded-lg bg-white/10 text-white/80 transition-colors hover:bg-white hover:text-azul"
          >
            <Bi n="x-lg" />
          </button>
        </header>

        {status === "sent" ? (
          <div className="px-6 py-10 text-center" role="status">
            <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-naranja text-2xl text-white shadow-[0_0_0_8px_rgba(255,118,25,.15)]">
              <Bi n="check-lg" />
            </span>
            <p className="mb-1 font-title text-lg font-semibold text-azul">{t.sentTitle}</p>
            <p className="mb-6 text-[0.92rem] text-suave">{t.sentText(form.email)}</p>
            <button type="button" onClick={close} className={`${btn.secondary} ${btn.md}`}>
              {t.closeBtn}
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="relative px-6 py-5">
            <div className="grid gap-x-4 gap-y-3.5 sm:grid-cols-2">
              <div>
                <label htmlFor="ct-nombre" className={label}>
                  {t.nombre} *
                </label>
                <input
                  ref={firstRef}
                  id="ct-nombre"
                  required
                  maxLength={120}
                  autoComplete="name"
                  value={form.nombre}
                  onChange={(e) => set("nombre", e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="ct-empresa" className={label}>
                  {t.empresa}
                </label>
                <input
                  id="ct-empresa"
                  maxLength={120}
                  autoComplete="organization"
                  value={form.empresa}
                  onChange={(e) => set("empresa", e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="ct-email" className={label}>
                  {t.correo} *
                </label>
                <input
                  id="ct-email"
                  type="email"
                  required
                  maxLength={160}
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="ct-telefono" className={label}>
                  {t.telefono}
                </label>
                <input
                  id="ct-telefono"
                  type="tel"
                  maxLength={40}
                  autoComplete="tel"
                  value={form.telefono}
                  onChange={(e) => set("telefono", e.target.value)}
                  className={inputCls}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="ct-motivo" className={label}>
                  {t.motivo} *
                </label>
                <select
                  id="ct-motivo"
                  required
                  value={form.motivo}
                  onChange={(e) => set("motivo", e.target.value)}
                  className={inputCls}
                >
                  {CONTACT_REASONS.map((m) => (
                    <option key={m} value={m}>
                      {reasons[m]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="ct-mensaje" className={label}>
                  {t.mensaje} *
                </label>
                <textarea
                  id="ct-mensaje"
                  required
                  rows={4}
                  maxLength={3000}
                  value={form.mensaje}
                  onChange={(e) => set("mensaje", e.target.value)}
                  placeholder={t.mensajePlaceholder}
                  className={`${inputCls} resize-y`}
                />
              </div>
            </div>
            {/* Campo trampa para bots (oculto a las personas y a los lectores de pantalla) */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={(e) => set("website", e.target.value)}
              aria-hidden="true"
              className="absolute -start-[9999px] h-0 w-0 opacity-0"
            />
            <label
              htmlFor="ct-autorizacion"
              className="mt-4 flex cursor-pointer items-start gap-2.5 text-[0.82rem] leading-relaxed text-suave"
            >
              <input
                id="ct-autorizacion"
                type="checkbox"
                required
                checked={form.autorizacion}
                onChange={(e) => set("autorizacion", e.target.checked)}
                className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-naranja"
              />
              <span>
                {t.consent}{" "}
                {/* En otra pestaña, para no perder lo que ya se escribió */}
                <a
                  href={lp("/privacidad")}
                  target="_blank"
                  rel="noopener"
                  className="font-medium text-azul underline underline-offset-2 hover:text-naranja"
                >
                  {t.consentLink}
                </a>
                .
              </span>
            </label>
            {status === "error" && (
              <p
                role="alert"
                className="mt-4 rounded-xl bg-beige px-4 py-3 text-[0.85rem] font-medium text-violeta"
              >
                {t.error}{" "}
                <a
                  href={waLink()}
                  target="_blank"
                  rel="noopener"
                  className="font-semibold text-azul underline underline-offset-2"
                >
                  WhatsApp
                </a>
                .
              </p>
            )}
            <button
              type="submit"
              disabled={status === "sending"}
              className={`${btn.primary} ${btn.lg} mt-5 w-full disabled:opacity-60`}
            >
              {status === "sending" ? (
                t.sending
              ) : (
                <>
                  {t.send} <Bi n="send" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
