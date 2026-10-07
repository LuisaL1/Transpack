// Cotizador por pasos. Sigue la "Lógica de Cotización" de Transpack:
// servicio → origen/destino → fecha/urgencia → inmueble o detalles → volumen/nivel → contacto.
// No calcula precios (el documento no los define): perfila la solicitud y la envía
// al equipo comercial por WhatsApp o correo. Opciones y textos: src/data/quote.ts.
import { useEffect, useMemo, useRef, useState } from "react";
import type { QuoteService } from "@/data/site";
import {
  doneMsg,
  extrasFor,
  placeLabels,
  QUOTE_STEPS_TOTAL,
  quoteText,
  serviceNames,
  serviceOptions,
  step4Title,
  type QuoteForm,
} from "@/data/quote";
import { useSite } from "@/hooks/useContent";
import { LANG_INFO, makeTr, useLang, type Lang } from "@/i18n";
import { Bi, btn } from "@/components/ui";
import { Chips, Field, inputCls, Label } from "@/components/home/QuoteFields";
import { track } from "@/lib/joel";
import { trackEvent } from "@/lib/analytics";
import { sendLead } from "@/lib/leads";
import { contactFormText } from "@/data/contact";

type QuoteText = ReturnType<typeof quoteText>;

// Filas del resumen de la solicitud con los textos de un idioma (en el del
// cliente para la pantalla y WhatsApp; en español para el correo al equipo)
function summaryRows(
  form: QuoteForm,
  service: QuoteService | "",
  t: QuoteText,
  SERVICE_NAMES: Record<QuoteService, string>,
  lang: Lang,
): [string, string][] {
  const out: [string, string][] = [];
  const add = (l: string, val?: string) => val && out.push([l, val]);
  const v = (k: string) => (form[k] || "").trim();
  if (!service) return out;
  add(t.servicio, SERVICE_NAMES[service]);
  if (service === "internacional") {
    add(t.origen, [v("origen"), v("pais_origen")].filter(Boolean).join(", "));
    add(t.destino, [v("destino"), v("pais_destino")].filter(Boolean).join(", "));
  } else {
    add(t.origen, v("origen"));
    if (service !== "bodegaje") add(t.destino, v("destino"));
  }
  if (service === "bodegaje") add(t.tiempoBodegaje, v("tiempo_bodegaje"));
  const fecha = v("fecha")
    ? new Date(v("fecha") + "T12:00:00").toLocaleDateString(LANG_INFO[lang].locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";
  add(
    t.cuando,
    [v("urgencia"), fecha, form.flexible === "1" ? t.fechaFlexible : ""]
      .filter(Boolean)
      .join(" · "),
  );
  if (service === "local" || service === "nacional") {
    add(
      "Inmueble",
      [v("inmueble"), v("piso") ? `${t.piso} ${v("piso")}` : ""].filter(Boolean).join(", "),
    );
    add(t.ascensor, v("ascensor"));
    add(t.parqueoCamion, v("acceso"));
  }
  if (service === "internacional") {
    add(t.motivo, v("motivo"));
    add(t.modalidad, v("modalidad"));
  }
  if (service === "empresarial") {
    add(t.empresa, v("empresa"));
    add(t.tipoTraslado, v("tipo_empresarial"));
    add(t.cargoFuncionario, v("cargo"));
    add(t.horario, v("horario"));
  }
  if (service === "bodegaje") {
    add(t.almacena, v("bodegaje_tipo"));
    add(t.recogida, v("bodegaje_recogida"));
  }
  add(t.volumen, v("volumen"));
  if (service !== "bodegaje") add(t.nivelServicio, v("nivel"));
  add(t.adicionales, v("extras").split("|").filter(Boolean).join(", "));
  add(t.inventarioComentarios, v("inventario"));
  return out;
}

// ─── Cotizador ────────────────────────────────────────────────────────────────

export function QuoteWizard({
  initialService,
  initialLevel,
}: {
  initialService?: string | null;
  initialLevel?: string | null;
}) {
  const { tr, lang, lp } = useLang();
  const { CONTACT, LEVELS } = useSite();
  // Opciones y textos en el idioma de la página (se recalculan solo si cambia)
  const t = useMemo(() => quoteText(tr), [tr]);
  const SERVICE_OPTIONS = useMemo(() => serviceOptions(tr), [tr]);
  const SERVICE_NAMES = useMemo(() => serviceNames(tr), [tr]);
  const PLACE_LABELS = placeLabels(tr);
  const STEP4_TITLE = step4Title(tr);
  const DONE_MSG = doneMsg(tr);
  const EXTRAS = extrasFor(tr);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<QuoteForm>({});
  const [error, setError] = useState<{ msg: string; field?: string } | null>(null);
  const [done, setDone] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const service = (form.servicio || "") as QuoteService | "";
  const set = (k: string, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (error?.field === k) setError(null);
  };

  // Preselección desde otros botones del sitio (?servicio=...&nivel=...)
  useEffect(() => {
    const valid = SERVICE_OPTIONS.some((o) => o.value === initialService);
    const lvl = initialLevel ? LEVELS[Number(initialLevel) - 1]?.value : undefined;
    if (!valid && !lvl) return;
    setForm((f) => ({
      ...f,
      ...(valid ? { servicio: initialService! } : {}),
      ...(lvl ? { nivel: lvl } : {}),
    }));
    setDone(false);
    if (valid) {
      setStep((s) => (s === 1 ? 2 : s));
      track("quote", initialService!);
    }
  }, [initialService, initialLevel, SERVICE_OPTIONS, LEVELS]);

  const pickService = (v: QuoteService) => {
    set("servicio", v);
    track("quote", v);
    setError(null);
    setTimeout(() => setStep(2), 220);
  };

  const validate = (): boolean => {
    const fail = (msg: string, field?: string) => {
      setError({ msg, field });
      return false;
    };
    const v = (k: string) => (form[k] || "").trim();
    if (step === 1 && !service) return fail(t.eligeTipoServicioContinuar);
    if (step === 2) {
      if (service === "internacional") {
        if (!v("pais_origen")) return fail(t.indicaPaisOrigen, "pais_origen");
        if (!v("pais_destino")) return fail(t.indicaPaisDestino, "pais_destino");
      }
      if (!v("origen")) return fail(t.indicaLugarOrigen, "origen");
      if (service !== "bodegaje" && !v("destino")) return fail(t.indicaLugarDestino, "destino");
    }
    if (step === 3 && !v("urgencia")) return fail(t.cuentanosCuandoNecesitas);
    if (step === 6) {
      if (!v("nombre")) return fail(t.escribeNombre, "nombre");
      if (v("telefono").replace(/\D/g, "").length < 7)
        return fail(t.escribeNumeroCelularValido, "telefono");
      if (v("email") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("email")))
        return fail(t.revisaCorreoElectronico, "email");
      if (form.consent !== "1") return fail(t.debesAutorizarTratamientoDatos);
    }
    setError(null);
    return true;
  };

  // Pasos del cotizador en Google Analytics (para medir en qué paso se abandona)
  const firstStep = useRef(true);
  useEffect(() => {
    if (firstStep.current) {
      firstStep.current = false;
      return;
    }
    trackEvent("quote_step", { step: done ? "resumen" : step, service: form.servicio });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, done]);
  const lead = (method: "whatsapp" | "email") =>
    trackEvent("generate_lead", { method, service, level: form.nivel, lang });

  // Envío directo por correo (función /api/contact → Brevo → Transpack)
  const ct = contactFormText(tr);
  const [mail, setMail] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [mailTo, setMailTo] = useState("");
  const sendEmail = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const email = (form.email || mailTo).trim();
    if (!service || !email) return;
    setMail("sending");
    // El equipo comercial recibe la solicitud en español
    const es = makeTr("es");
    const fields: Record<string, string> = Object.fromEntries(
      summaryRows(form, service, quoteText(es), serviceNames(es), "es"),
    );
    fields["Nombre"] = (form.nombre || "").trim();
    fields["Celular"] = (form.telefono || "").trim();
    fields["Correo"] = email;
    if (lang !== "es") fields["Idioma del cliente"] = LANG_INFO[lang].name;
    fields["Autorización de datos"] = "Sí";
    const r = await sendLead(
      "cotizacion",
      `Solicitud de cotización — ${serviceNames(es)[service]}`,
      fields,
      { email, name: fields["Nombre"] },
      "",
      { lang, about: SERVICE_NAMES[service] },
    );
    setMail(r.ok ? "sent" : "error");
    if (r.ok) lead("email");
  };

  const next = () => {
    if (!validate()) return;
    if (step < QUOTE_STEPS_TOTAL) setStep(step + 1);
    else setDone(true);
  };

  const reset = () => {
    setMail("idle");
    setMailTo("");
    setForm({});
    setDone(false);
    setStep(1);
    setError(null);
  };

  // Filas del resumen (también arman el mensaje de WhatsApp)
  const rows = useMemo(
    () => summaryRows(form, service, t, SERVICE_NAMES, lang),
    [form, service, t, lang, SERVICE_NAMES],
  );

  const message = useMemo(() => {
    // *texto* = negrita en WhatsApp
    const lines = [
      `*${t.holaTranspackQuieroSolicitar}*`,
      "",
      ...rows.map(([l, v]) => `• *${l}:* ${v}`),
      "",
    ];
    lines.push(`*${t.nombre}:* ${form.nombre || ""}`, `*${t.celular}:* ${form.telefono || ""}`);
    if (form.email) lines.push(`*${t.correo}:* ${form.email}`);
    lines.push(`*${t.autorizacionDatos}:* ${t.si}`);
    // El equipo comercial atiende en español: se indica el idioma del cliente
    if (lang !== "es") lines.push("", `[Idioma del cliente: ${LANG_INFO[lang].name}]`);
    return lines.join("\n");
  }, [rows, form.nombre, form.telefono, form.email, t, lang]);

  const L = service ? PLACE_LABELS[service] : PLACE_LABELS.local;
  const inp = (k: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <input
      {...props}
      name={k}
      value={form[k] || ""}
      onChange={(e) => set(k, e.target.value)}
      className={inputCls}
      aria-invalid={error?.field === k || undefined}
    />
  );
  const sel = (k: string, options: string[]) => (
    <select
      name={k}
      value={form[k] || ""}
      onChange={(e) => set(k, e.target.value)}
      className={inputCls}
    >
      <option value="">{t.selecciona}</option>
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
  const legend = (text: string) => (
    <legend className="mb-6 p-0 font-title text-[clamp(1.4rem,1.2rem+.8vw,1.85rem)] font-semibold tracking-[0.02em] text-tinta">
      {text}
    </legend>
  );

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
      {/* Delegación: Enter en cualquier campo avanza de paso (los campos y los
          botones Atrás/Continuar son los elementos interactivos). */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <form
        ref={formRef}
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          next();
        }}
        onKeyDown={(e) => {
          const el = e.target as HTMLElement;
          if (e.key === "Enter" && el.tagName === "INPUT") {
            e.preventDefault();
            next();
          }
        }}
        className="relative overflow-hidden rounded-[22px] bg-white p-6 shadow-[var(--shadow-card)] sm:p-10 lg:p-12"
      >
        <div className="absolute inset-x-0 top-0 h-[5px] bg-gris" aria-hidden="true">
          <span
            className="block h-full bg-gradient-to-r from-naranja to-[#ffa15c] transition-[width] duration-500"
            style={{ width: `${done ? 100 : (step / QUOTE_STEPS_TOTAL) * 100}%` }}
          />
        </div>

        {done ? (
          <div className="animate-fade-up py-4 text-center">
            <div className="mx-auto mb-5 grid h-[72px] w-[72px] place-items-center rounded-full bg-naranja text-4xl text-white shadow-[0_0_0_10px_rgba(255,118,25,.15)]">
              <Bi n="check-lg" />
            </div>
            <h3 className="mb-2 text-xl">{t.listoSolicitudEstaPreparada}</h3>
            <p className="mx-auto max-w-xl">
              {(service && DONE_MSG[service]) || t.envialaWhatsappAsesorTe}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                className={`${btn.whatsapp} ${btn.lg}`}
                href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`}
                onClick={() => lead("whatsapp")}
                target="_blank"
                rel="noopener"
              >
                <Bi n="whatsapp" /> {t.enviarWhatsapp}
              </a>
              {mail !== "sent" && form.email && (
                <button
                  type="button"
                  className={`${btn.outline} ${btn.lg} disabled:opacity-60`}
                  disabled={mail === "sending"}
                  onClick={sendEmail}
                >
                  <Bi n="envelope" /> {mail === "sending" ? ct.sending : t.enviarCorreo}
                </button>
              )}
            </div>
            {/* Sin correo en el paso de contacto: se pide aquí para poder responder */}
            {mail !== "sent" && !form.email && (
              <div className="mx-auto mt-4 flex max-w-md flex-col gap-2 text-start">
                <label htmlFor="quote-mail" className="text-[0.85rem] font-semibold text-tinta">
                  {t.tuCorreoParaEnviar}
                </label>
                <div className="flex gap-2">
                  <input
                    id="quote-mail"
                    type="email"
                    autoComplete="email"
                    value={mailTo}
                    onChange={(e) => setMailTo(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key !== "Enter") return;
                      e.stopPropagation(); // no avanza el cotizador
                      sendEmail(e);
                    }}
                    className={inputCls}
                  />
                  <button
                    type="button"
                    className={`${btn.outline} ${btn.md} shrink-0 disabled:opacity-60`}
                    disabled={mail === "sending" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mailTo.trim())}
                    onClick={sendEmail}
                  >
                    <Bi n="envelope" /> {mail === "sending" ? ct.sending : t.enviarCorreo}
                  </button>
                </div>
              </div>
            )}
            {mail === "sent" && (
              <p
                role="status"
                className="mx-auto mt-5 flex max-w-xl items-start justify-center gap-2 rounded-xl bg-gris px-4 py-3 text-[0.9rem] font-medium text-azul"
              >
                <Bi n="check-circle" className="mt-0.5 text-naranja" />
                {ct.sentText((form.email || mailTo).trim())}
              </p>
            )}
            {mail === "error" && (
              <p
                role="alert"
                className="mx-auto mt-5 max-w-xl rounded-xl bg-beige px-4 py-3 text-[0.88rem] font-medium text-violeta"
              >
                {ct.error}{" "}
                <a
                  href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`}
                  onClick={() => lead("whatsapp")}
                  target="_blank"
                  rel="noopener"
                  className="font-semibold text-azul underline underline-offset-2"
                >
                  WhatsApp
                </a>
                .
              </p>
            )}
            <button type="button" onClick={reset} className="mt-5 text-suave underline">
              {t.hacerOtraSolicitud}
            </button>
          </div>
        ) : (
          <>
            <p className="mb-1.5 text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-naranja">
              {t.paso} {step} {t.stepOf} {QUOTE_STEPS_TOTAL}
            </p>

            <fieldset key={step} className="animate-fade-up m-0 min-w-0 border-0 p-0">
              {step === 1 && (
                <>
                  {legend(t.necesitasTrasladar)}
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                    {SERVICE_OPTIONS.map((o) => {
                      const on = service === o.value;
                      return (
                        <button
                          type="button"
                          key={o.value}
                          aria-pressed={on}
                          onClick={() => pickService(o.value)}
                          className={`flex flex-col gap-0.5 rounded-2xl border-[1.5px] p-4 text-start transition ${
                            on
                              ? "border-naranja bg-[#fff7f0] shadow-[0_0_0_3px_rgba(255,118,25,.15)]"
                              : "border-linea hover:border-azul"
                          }`}
                        >
                          <Bi
                            n={o.icon}
                            className={`mb-2 text-2xl ${on ? "text-naranja" : "text-azul"}`}
                          />
                          <b className="font-title font-semibold text-tinta">{o.title}</b>
                          <small className="text-[0.82rem] text-suave">{o.sub}</small>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  {legend(t.desdeDondeHaciaDonde)}
                  <div className="grid gap-4 sm:grid-cols-2">
                    {service === "internacional" && (
                      <>
                        <Field label={t.paisOrigen} invalid={error?.field === "pais_origen"}>
                          {inp("pais_origen", { placeholder: t.ejColombia })}
                        </Field>
                        <Field label={t.paisDestino} invalid={error?.field === "pais_destino"}>
                          {inp("pais_destino", { placeholder: t.ejCanada })}
                        </Field>
                      </>
                    )}
                    <Field label={L[0]} invalid={error?.field === "origen"}>
                      {inp("origen", { placeholder: L[2], autoFocus: true })}
                    </Field>
                    {service !== "bodegaje" ? (
                      <Field label={L[1]} invalid={error?.field === "destino"}>
                        {inp("destino", { placeholder: L[3] })}
                      </Field>
                    ) : (
                      <Field label={t.cuantoTiempo}>
                        {sel("tiempo_bodegaje", [
                          t.menos1Mes,
                          t.n13Meses,
                          t.n36Meses,
                          t.mas6Meses,
                          t.aunNo,
                        ])}
                      </Field>
                    )}
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  {legend(t.cuandoNecesitas)}
                  <Chips
                    value={form.urgencia || ""}
                    onChange={(v) => {
                      set("urgencia", v);
                      setError(null);
                    }}
                    options={[
                      [t.urgenteProximosDias, t.urgenteProximosDias2],
                      [t.cortoPlazo12, t.n12Semanas],
                      [t.programadoVariasSemanas, t.variasSemanas],
                      [t.planificado1MesMas, t.n1MesMas],
                    ]}
                  />
                  <div className="grid items-end gap-4 sm:grid-cols-2">
                    <Field label={t.fechaAproximada} hint={t.opcional}>
                      {inp("fecha", { type: "date" })}
                    </Field>
                    <label className="flex items-center gap-2.5 pb-3 font-medium text-tinta">
                      <input
                        type="checkbox"
                        checked={form.flexible === "1"}
                        onChange={(e) => set("flexible", e.target.checked ? "1" : "")}
                        className="h-[18px] w-[18px] accent-naranja"
                      />
                      {t.fechaFlexible2}
                    </label>
                  </div>
                  {service === "internacional" && (
                    <p className="mt-5 flex items-start gap-2.5 rounded-xl bg-beige px-4 py-3.5 text-[0.9rem] font-medium text-violeta">
                      <Bi n="clock" className="mt-0.5 text-naranja" />{" "}
                      {t.mudanzasInternacionalesRecomendamosIniciar}
                    </p>
                  )}
                </>
              )}

              {step === 4 && service && (
                <>
                  {legend(STEP4_TITLE[service])}
                  {(service === "local" || service === "nacional") && (
                    <>
                      <div className="mb-5 grid gap-4 sm:grid-cols-2">
                        <Field label={t.tipoInmueble}>
                          {sel("inmueble", [t.apartamento, t.casa, t.oficina, t.localComercial])}
                        </Field>
                        <Field label={t.piso2}>
                          {inp("piso", {
                            type: "number",
                            min: 0,
                            max: 80,
                            placeholder: t.ej5,
                          })}
                        </Field>
                      </div>
                      <Label>{t.tieneAscensor}</Label>
                      <Chips
                        value={form.ascensor || ""}
                        onChange={(v) => set("ascensor", v)}
                        options={[
                          [t.si, t.si],
                          [t.noSoloEscaleras, t.noSoloEscaleras],
                        ]}
                      />
                      <Label>{t.tanCercaPuedeParquear}</Label>
                      <Chips
                        value={form.acceso || ""}
                        onChange={(v) => set("acceso", v)}
                        options={[
                          [t.frenteInmueble, t.frenteInmueble],
                          [t.menos50M, t.menos50M],
                          [t.mas50MFuera, t.mas50MFuera2],
                        ]}
                      />
                    </>
                  )}
                  {service === "internacional" && (
                    <>
                      <Label>{t.cualMotivoTraslado}</Label>
                      <Chips
                        value={form.motivo || ""}
                        onChange={(v) => set("motivo", v)}
                        options={[
                          t.trabajo,
                          t.estudio,
                          t.meRadicoOtroPais,
                          t.regresoColombia,
                          t.misionDiplomatica,
                        ].map((o) => [o, o])}
                      />
                      <Label>{t.modalidadPreferida}</Label>
                      <Chips
                        value={form.modalidad || ""}
                        onChange={(v) => set("modalidad", v)}
                        options={[
                          [
                            t.maritima,
                            <>
                              <Bi n="water" /> {t.maritima}
                            </>,
                          ],
                          [
                            t.aerea,
                            <>
                              <Bi n="airplane" /> {t.aerea}
                            </>,
                          ],
                          [t.necesitoAsesoria, t.necesitoAsesoria],
                        ]}
                      />
                    </>
                  )}
                  {service === "empresarial" && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label={t.empresa}>
                        {inp("empresa", {
                          placeholder: t.nombreEmpresa,
                        })}
                      </Field>
                      <Field label={t.tipoTraslado}>
                        {sel("tipo_empresarial", [
                          t.trasladoOficina,
                          t.reubicacionFuncionario,
                          t.variosFuncionarios,
                          t.acuerdoCorporativoRecurrente,
                        ])}
                      </Field>
                      <Field label={t.cargoFuncionario} hint={t.siAplica}>
                        {inp("cargo", {
                          placeholder: t.ejGerenteRegional,
                        })}
                      </Field>
                      <Field label={t.horarioOperacion}>
                        {sel("horario", [t.diurnoEntreSemana, t.nocturno, t.finSemana, t.definir])}
                      </Field>
                    </div>
                  )}
                  {service === "bodegaje" && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label={t.deseasAlmacenar}>
                        {sel("bodegaje_tipo", [
                          t.menajeHogar,
                          t.mobiliarioOficina,
                          t.archivoDocumentos,
                          t.obrasArteUObjetos,
                          t.otro,
                        ])}
                      </Field>
                      <Field label={t.necesitasRecojamos}>
                        {sel("bodegaje_recogida", [t.siRecogerUbicacion, t.noYoLlevo])}
                      </Field>
                    </div>
                  )}
                </>
              )}

              {step === 5 && (
                <>
                  {legend(t.tantoVasMover)}
                  <Label>{t.volumenAproximado}</Label>
                  <Chips
                    value={form.volumen || ""}
                    onChange={(v) => set("volumen", v)}
                    options={[
                      [t.pocosObjetosCajas, t.pocosObjetos],
                      [t.apartaestudio, t.apartaestudio2],
                      [t.apartamento23Habitaciones, t.n23Habitaciones],
                      [t.casaGrande4Habitaciones, t.casaGrande],
                      [t.oficina, t.oficina],
                    ]}
                  />
                  {service !== "bodegaje" && (
                    <>
                      <Label>{t.nivelServicio}</Label>
                      <div className="mb-5 grid gap-3 sm:grid-cols-3">
                        {LEVELS.map((l) => {
                          const on = form.nivel === l.value;
                          return (
                            <button
                              type="button"
                              key={l.value}
                              aria-pressed={on}
                              onClick={() => set("nivel", on ? "" : l.value)}
                              className={`rounded-2xl border-[1.5px] px-4 py-3.5 text-start transition ${
                                on
                                  ? "border-naranja bg-[#fff7f0] shadow-[0_0_0_3px_rgba(255,118,25,.15)]"
                                  : "border-linea hover:border-azul"
                              }`}
                            >
                              <b className="block font-title font-semibold text-tinta">{l.title}</b>
                              <small className="text-[0.8rem] leading-snug text-suave">
                                {l.text}
                              </small>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                  <Label>{t.serviciosAdicionales}</Label>
                  <Chips
                    multi
                    value={form.extras || ""}
                    onChange={(v) => set("extras", v)}
                    options={EXTRAS}
                  />
                  <Field label={t.inventarioComentarios2} hint={t.entreMasPrecisoMejor}>
                    <textarea
                      rows={3}
                      value={form.inventario || ""}
                      onChange={(e) => set("inventario", e.target.value)}
                      placeholder={t.ej1Sofa3}
                      className={`${inputCls} resize-y`}
                    />
                  </Field>
                </>
              )}

              {step === 6 && (
                <>
                  {legend(t.comoTeContactamos)}
                  <div className="mb-5 grid gap-4 sm:grid-cols-2">
                    <Field label={t.nombreCompleto} invalid={error?.field === "nombre"}>
                      {inp("nombre", { autoComplete: "name", autoFocus: true })}
                    </Field>
                    <Field label={t.celularWhatsapp} invalid={error?.field === "telefono"}>
                      {inp("telefono", {
                        type: "tel",
                        autoComplete: "tel",
                        placeholder: "+57 300 000 0000",
                      })}
                    </Field>
                    <Field
                      label={t.correoElectronico}
                      hint={t.opcional}
                      full
                      invalid={error?.field === "email"}
                    >
                      {inp("email", { type: "email", autoComplete: "email" })}
                    </Field>
                  </div>
                  <label className="flex items-start gap-2.5 text-[0.85rem] text-suave">
                    <input
                      type="checkbox"
                      checked={form.consent === "1"}
                      onChange={(e) => {
                        set("consent", e.target.checked ? "1" : "");
                        setError(null);
                      }}
                      className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-naranja"
                    />
                    <span>
                      {t.autorizoTranspackSS}{" "}
                      {/* En otra pestaña, para no perder lo que ya se escribió */}
                      <a
                        href={lp("/privacidad")}
                        target="_blank"
                        rel="noopener"
                        className="font-medium text-azul underline underline-offset-2 hover:text-naranja"
                      >
                        {t.leerPoliticaDatos}
                      </a>
                    </span>
                  </label>
                </>
              )}
            </fieldset>

            {error && (
              <p role="alert" className="mt-4 text-[0.88rem] font-medium text-red-600">
                {error.msg}
              </p>
            )}

            <div className="mt-8 flex items-center justify-between border-t border-linea pt-6">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setStep(step - 1);
                  }}
                  className="px-2 font-semibold text-suave hover:text-azul"
                >
                  <Bi n="arrow-left" /> {t.atras}
                </button>
              ) : (
                <span />
              )}
              <button type="submit" className={`${btn.primary} ${btn.md}`}>
                {step === QUOTE_STEPS_TOTAL ? t.verSolicitud : t.continuar}
              </button>
            </div>
          </>
        )}
      </form>

      <aside
        aria-live="polite"
        className="relative overflow-hidden rounded-[22px] bg-azul p-7 text-white/80 lg:sticky lg:top-24"
      >
        <span
          aria-hidden="true"
          className="absolute -bottom-20 -right-20 h-40 w-40 rotate-45 rounded-[22%] bg-naranja/90"
        />
        <h3 className="mb-5 text-lg !text-white">{t.solicitud}</h3>
        {/* Sin datos todavía: el aviso va fuera de la lista (<dl> solo admite <dt>/<dd>) */}
        {rows.length === 0 ? (
          <div className="relative z-10 mb-6 grid gap-3">
            <p className="text-[0.92rem] opacity-80">{t.eligeServicioComenzar}</p>
          </div>
        ) : (
          <dl className="relative z-10 mb-6 grid gap-3">
            {rows.map(([l, v]) => (
              <div key={l} className="animate-fade-up">
                <dt className="text-[0.72rem] uppercase tracking-[0.12em] text-beige/80">{l}</dt>
                <dd className="font-medium text-white">
                  {v.length > 90 ? v.slice(0, 90) + "…" : v}
                </dd>
              </div>
            ))}
          </dl>
        )}
        <div className="relative z-10 border-t border-white/15 pt-5">
          <p className="mb-1 text-[0.85rem]">{t.prefieresHablarAlguien}</p>
          <a
            href={`tel:+57${CONTACT.phones[0].replace(/\s/g, "")}`}
            className="inline-flex items-center gap-2 font-title text-lg font-semibold text-white"
          >
            <Bi n="telephone" /> {CONTACT.phones[0]}
          </a>
        </div>
      </aside>
    </div>
  );
}
