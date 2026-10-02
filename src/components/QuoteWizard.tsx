// Cotizador por pasos. Sigue la "Lógica de Cotización" de Transpack:
// servicio → origen/destino → fecha/urgencia → inmueble o detalles → volumen/nivel → contacto.
// No calcula precios (el documento no los define): perfila la solicitud y la envía
// al equipo comercial por WhatsApp o correo.
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { QuoteService } from "@/data/site";
import { useSite } from "@/data/content";
import { LANG_INFO, useLang, type Tr } from "@/i18n";
import { Bi, btn } from "@/components/ui";

type Form = Record<string, string>;

const serviceOptions = (
  tr: Tr,
): { value: QuoteService; icon: string; title: string; sub: string }[] => [
  {
    value: "local",
    icon: "house-door",
    title: tr("Mudanza local", "Local move"),
    sub: tr("Dentro de la misma ciudad", "Within the same city"),
  },
  {
    value: "nacional",
    icon: "truck",
    title: tr("Mudanza nacional", "National move"),
    sub: tr("Entre ciudades de Colombia", "Between Colombian cities"),
  },
  {
    value: "internacional",
    icon: "globe-americas",
    title: tr("Mudanza internacional", "International move"),
    sub: tr("Desde o hacia otro país", "To or from another country"),
  },
  {
    value: "empresarial",
    icon: "buildings",
    title: tr("Traslado empresarial", "Corporate move"),
    sub: tr("Oficinas o funcionarios", "Offices or employees"),
  },
  {
    value: "bodegaje",
    icon: "boxes",
    title: tr("Bodegaje", "Storage"),
    sub: tr("Almacenamiento seguro", "Secure storage"),
  },
];

const serviceNames = (tr: Tr): Record<QuoteService, string> => ({
  local: tr("Mudanza local", "Local move"),
  nacional: tr("Mudanza nacional", "National move"),
  internacional: tr("Mudanza internacional", "International move"),
  empresarial: tr("Traslado empresarial", "Corporate move"),
  bodegaje: tr("Bodegaje", "Storage"),
});

const placeLabels = (tr: Tr): Record<QuoteService, [string, string, string, string]> => ({
  local: [
    tr("Barrio o dirección de origen", "Origin neighborhood or address"),
    tr("Barrio o dirección de destino", "Destination neighborhood or address"),
    tr("Ej. Bogotá, Chapinero", "E.g. Bogotá, Chapinero"),
    tr("Ej. Bogotá, Cedritos", "E.g. Bogotá, Cedritos"),
  ],
  nacional: [
    tr("Ciudad de origen", "Origin city"),
    tr("Ciudad de destino", "Destination city"),
    tr("Ej. Bogotá", "E.g. Bogotá"),
    tr("Ej. Medellín", "E.g. Medellín"),
  ],
  internacional: [
    tr("Ciudad de origen", "Origin city"),
    tr("Ciudad de destino", "Destination city"),
    tr("Ej. Bogotá", "E.g. Bogotá"),
    tr("Ej. Toronto", "E.g. Toronto"),
  ],
  empresarial: [
    tr("Ciudad o país de origen", "Origin city or country"),
    tr("Ciudad o país de destino", "Destination city or country"),
    tr("Ej. Bogotá", "E.g. Bogotá"),
    tr("Ej. Ciudad de México", "E.g. Mexico City"),
  ],
  bodegaje: [
    tr("¿En qué ciudad o barrio recogemos?", "Which city or neighborhood do we pick up from?"),
    "",
    tr("Ej. Bogotá, Usaquén", "E.g. Bogotá, Usaquén"),
    "",
  ],
});

const step4Title = (tr: Tr): Record<QuoteService, string> => ({
  local: tr("Cuéntanos sobre el inmueble", "Tell us about the property"),
  nacional: tr("Cuéntanos sobre el inmueble", "Tell us about the property"),
  internacional: tr("Cuéntanos sobre tu traslado", "Tell us about your move"),
  empresarial: tr("Datos de la empresa", "Company details"),
  bodegaje: tr("¿Qué vas a almacenar?", "What will you store?"),
});

const doneMsg = (tr: Tr): Partial<Record<QuoteService, string>> => ({
  internacional: tr(
    "Por tratarse de una mudanza internacional, un asesor especializado revisará contigo requisitos, tiempos y costos antes de la cotización formal. Envía tu solicitud por WhatsApp para agilizar el contacto.",
    "Since this is an international move, a specialized advisor will review requirements, timelines and costs with you before the formal quote. Send your request on WhatsApp to speed things up.",
  ),
  empresarial: tr(
    "Un ejecutivo de cuenta revisará las condiciones corporativas y te enviará una propuesta. Envía tu solicitud por WhatsApp o correo.",
    "An account executive will review the corporate terms and send you a proposal. Send your request on WhatsApp or by email.",
  ),
  bodegaje: tr(
    "Un asesor te confirmará disponibilidad y condiciones de almacenamiento. Envía tu solicitud por WhatsApp.",
    "An advisor will confirm availability and storage terms. Send your request on WhatsApp.",
  ),
});

const extrasFor = (tr: Tr): [string, string][] => [
  [
    tr("Objetos delicados / obras de arte", "Fragile items / artwork"),
    tr("Objetos delicados o arte", "Fragile items or art"),
  ],
  [
    tr("Desarme y armado", "Disassembly and reassembly"),
    tr("Desarme y armado", "Disassembly and reassembly"),
  ],
  [tr("Bodegaje temporal", "Temporary storage"), tr("Bodegaje temporal", "Temporary storage")],
  [
    tr("Elementos sobredimensionados", "Oversized items"),
    tr("Piano o sobredimensionados", "Piano or oversized items"),
  ],
  [
    tr("Visita técnica", "On-site survey"),
    tr("Quiero visita técnica", "I'd like an on-site survey"),
  ],
];

const TOTAL = 6;

// ─── Controles ────────────────────────────────────────────────────────────────

const inputCls =
  "w-full rounded-xl border-[1.5px] border-linea bg-white px-4 py-3 text-[0.95rem] text-tinta outline-none transition focus:border-azul focus:ring-[3px] focus:ring-azul/12";

function Field({
  label,
  hint,
  invalid,
  children,
  full,
}: {
  label: string;
  hint?: string;
  invalid?: boolean;
  children: ReactNode;
  full?: boolean;
}) {
  return (
    <label
      className={`flex flex-col gap-1.5 ${full ? "sm:col-span-2" : ""} ${
        invalid ? "[&_input]:!border-red-500" : ""
      }`}
    >
      <span className="text-[0.88rem] font-semibold text-tinta">
        {label} {hint && <small className="font-normal text-suave">{hint}</small>}
      </span>
      {children}
    </label>
  );
}

function Chips({
  options,
  value,
  onChange,
  multi = false,
}: {
  options: [string, ReactNode][];
  value: string;
  onChange: (v: string) => void;
  multi?: boolean;
}) {
  const selected = multi ? value.split("|").filter(Boolean) : [value];
  return (
    <div className="mb-5 flex flex-wrap gap-2">
      {options.map(([v, label]) => {
        const on = selected.includes(v);
        return (
          <button
            type="button"
            key={v}
            aria-pressed={on}
            onClick={() => {
              if (!multi) return onChange(on ? "" : v);
              const next = on ? selected.filter((s) => s !== v) : [...selected, v];
              onChange(next.join("|"));
            }}
            className={`inline-flex items-center gap-1.5 rounded-full border-[1.5px] px-4 py-2 text-[0.9rem] font-medium transition ${
              on ? "border-azul bg-azul text-white" : "border-linea text-tinta hover:border-azul"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <p className="mb-2 text-[0.88rem] font-semibold text-tinta">{children}</p>;
}

// ─── Cotizador ────────────────────────────────────────────────────────────────

export default function QuoteWizard({
  initialService,
  initialLevel,
}: {
  initialService?: string | null;
  initialLevel?: string | null;
}) {
  const { tr, lang } = useLang();
  const { CONTACT, LEVELS } = useSite();
  const SERVICE_OPTIONS = serviceOptions(tr);
  const SERVICE_NAMES = serviceNames(tr);
  const PLACE_LABELS = placeLabels(tr);
  const STEP4_TITLE = step4Title(tr);
  const DONE_MSG = doneMsg(tr);
  const EXTRAS = extrasFor(tr);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<Form>({});
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
    if (valid) setStep((s) => (s === 1 ? 2 : s));
  }, [initialService, initialLevel]);

  const pickService = (v: QuoteService) => {
    set("servicio", v);
    setError(null);
    setTimeout(() => setStep(2), 220);
  };

  const validate = (): boolean => {
    const fail = (msg: string, field?: string) => {
      setError({ msg, field });
      return false;
    };
    const v = (k: string) => (form[k] || "").trim();
    if (step === 1 && !service)
      return fail(
        tr("Elige el tipo de servicio para continuar.", "Choose the type of service to continue."),
      );
    if (step === 2) {
      if (service === "internacional") {
        if (!v("pais_origen"))
          return fail(tr("Indica el país de origen.", "Enter the origin country."), "pais_origen");
        if (!v("pais_destino"))
          return fail(
            tr("Indica el país de destino.", "Enter the destination country."),
            "pais_destino",
          );
      }
      if (!v("origen"))
        return fail(tr("Indica el lugar de origen.", "Enter the origin location."), "origen");
      if (service !== "bodegaje" && !v("destino"))
        return fail(
          tr("Indica el lugar de destino.", "Enter the destination location."),
          "destino",
        );
    }
    if (step === 3 && !v("urgencia"))
      return fail(tr("Cuéntanos para cuándo lo necesitas.", "Tell us when you need it."));
    if (step === 6) {
      if (!v("nombre")) return fail(tr("Escribe tu nombre.", "Enter your name."), "nombre");
      if (v("telefono").replace(/\D/g, "").length < 7)
        return fail(
          tr("Escribe un número de celular válido.", "Enter a valid mobile number."),
          "telefono",
        );
      if (v("email") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("email")))
        return fail(tr("Revisa el correo electrónico.", "Check your email address."), "email");
      if (form.consent !== "1")
        return fail(
          tr(
            "Debes autorizar el tratamiento de datos para enviar la solicitud.",
            "You must authorize data processing to send the request.",
          ),
        );
    }
    setError(null);
    return true;
  };

  const next = () => {
    if (!validate()) return;
    if (step < TOTAL) setStep(step + 1);
    else setDone(true);
  };

  const reset = () => {
    setForm({});
    setDone(false);
    setStep(1);
    setError(null);
  };

  // Filas del resumen (también arman el mensaje de WhatsApp)
  const rows = useMemo(() => {
    const out: [string, string][] = [];
    const add = (l: string, val?: string) => val && out.push([l, val]);
    const v = (k: string) => (form[k] || "").trim();
    if (!service) return out;
    add(tr("Servicio", "Service"), SERVICE_NAMES[service]);
    if (service === "internacional") {
      add(tr("Origen", "Origin"), [v("origen"), v("pais_origen")].filter(Boolean).join(", "));
      add(
        tr("Destino", "Destination"),
        [v("destino"), v("pais_destino")].filter(Boolean).join(", "),
      );
    } else {
      add(tr("Origen", "Origin"), v("origen"));
      if (service !== "bodegaje") add(tr("Destino", "Destination"), v("destino"));
    }
    if (service === "bodegaje") add(tr("Tiempo de bodegaje", "Storage time"), v("tiempo_bodegaje"));
    const fecha = v("fecha")
      ? new Date(v("fecha") + "T12:00:00").toLocaleDateString(LANG_INFO[lang].locale, {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "";
    add(
      tr("Cuándo", "When"),
      [v("urgencia"), fecha, form.flexible === "1" ? tr("fecha flexible", "flexible date") : ""]
        .filter(Boolean)
        .join(" · "),
    );
    if (service === "local" || service === "nacional") {
      add(
        "Inmueble",
        [v("inmueble"), v("piso") ? `${tr("piso", "floor")} ${v("piso")}` : ""]
          .filter(Boolean)
          .join(", "),
      );
      add(tr("Ascensor", "Elevator"), v("ascensor"));
      add(tr("Parqueo del camión", "Truck parking"), v("acceso"));
    }
    if (service === "internacional") {
      add(tr("Motivo", "Reason"), v("motivo"));
      add(tr("Modalidad", "Mode"), v("modalidad"));
    }
    if (service === "empresarial") {
      add(tr("Empresa", "Company"), v("empresa"));
      add(tr("Tipo de traslado", "Type of move"), v("tipo_empresarial"));
      add(tr("Cargo del funcionario", "Employee's position"), v("cargo"));
      add(tr("Horario", "Schedule"), v("horario"));
    }
    if (service === "bodegaje") {
      add(tr("Qué se almacena", "What is stored"), v("bodegaje_tipo"));
      add(tr("Recogida", "Pickup"), v("bodegaje_recogida"));
    }
    add(tr("Volumen", "Volume"), v("volumen"));
    if (service !== "bodegaje") add(tr("Nivel de servicio", "Service level"), v("nivel"));
    add(tr("Adicionales", "Extras"), v("extras").split("|").filter(Boolean).join(", "));
    add(tr("Inventario / comentarios", "Inventory / comments"), v("inventario"));
    return out;
  }, [form, service, tr, lang, SERVICE_NAMES]);

  const message = useMemo(() => {
    const lines = [
      tr(
        "Hola Transpack, quiero solicitar una cotización:",
        "Hello Transpack, I would like to request a quote:",
      ),
      "",
      ...rows.map(([l, v]) => `• ${l}: ${v}`),
      "",
    ];
    lines.push(
      `${tr("Nombre", "Name")}: ${form.nombre || ""}`,
      `${tr("Celular", "Mobile")}: ${form.telefono || ""}`,
    );
    if (form.email) lines.push(`${tr("Correo", "Email")}: ${form.email}`);
    // El equipo comercial atiende en español: se indica el idioma del cliente
    if (lang !== "es") lines.push("", `[Idioma del cliente: ${LANG_INFO[lang].name}]`);
    return lines.join("\n");
  }, [rows, form.nombre, form.telefono, form.email, tr, lang]);

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
      <option value="">{tr("Selecciona", "Select")}</option>
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
      <form
        ref={formRef}
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          next();
        }}
        onKeyDown={(e) => {
          const t = e.target as HTMLElement;
          if (e.key === "Enter" && t.tagName === "INPUT") {
            e.preventDefault();
            next();
          }
        }}
        className="relative overflow-hidden rounded-[22px] bg-white p-6 shadow-[var(--shadow-card)] sm:p-10 lg:p-12"
      >
        <div className="absolute inset-x-0 top-0 h-[5px] bg-gris" aria-hidden="true">
          <span
            className="block h-full bg-gradient-to-r from-naranja to-[#ffa15c] transition-[width] duration-500"
            style={{ width: `${done ? 100 : (step / TOTAL) * 100}%` }}
          />
        </div>

        {done ? (
          <div className="animate-fade-up py-4 text-center">
            <div className="mx-auto mb-5 grid h-[72px] w-[72px] place-items-center rounded-full bg-naranja text-4xl text-white shadow-[0_0_0_10px_rgba(255,118,25,.15)]">
              <Bi n="check-lg" />
            </div>
            <h3 className="mb-2 text-xl">
              {tr("¡Listo! Tu solicitud está preparada", "Done! Your request is ready")}
            </h3>
            <p className="mx-auto max-w-xl">
              {(service && DONE_MSG[service]) ||
                tr(
                  "Envíala por WhatsApp y un asesor te responderá con un estimado. Si hace falta, coordinaremos una visita técnica.",
                  "Send it on WhatsApp and an advisor will reply with an estimate. If needed, we'll arrange an on-site survey.",
                )}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                className={`${btn.whatsapp} ${btn.lg}`}
                href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`}
                target="_blank"
                rel="noopener"
              >
                <Bi n="whatsapp" /> {tr("Enviar por WhatsApp", "Send on WhatsApp")}
              </a>
              <a
                className={`${btn.outline} ${btn.md}`}
                href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(`${tr("Solicitud de cotización", "Quote request")} · ${service ? SERVICE_NAMES[service] : ""} · ${form.nombre || ""}`)}&body=${encodeURIComponent(message)}`}
              >
                {tr("Enviar por correo", "Send by email")}
              </a>
            </div>
            <button type="button" onClick={reset} className="mt-5 text-suave underline">
              {tr("Hacer otra solicitud", "Start a new request")}
            </button>
          </div>
        ) : (
          <>
            <p className="mb-1.5 text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-naranja">
              {tr("Paso", "Step")} {step} {tr("de", "of")} {TOTAL}
            </p>

            <fieldset key={step} className="animate-fade-up m-0 min-w-0 border-0 p-0">
              {step === 1 && (
                <>
                  {legend(tr("¿Qué necesitas trasladar?", "What do you need to move?"))}
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
                  {legend(tr("¿Desde dónde y hacia dónde?", "From where and to where?"))}
                  <div className="grid gap-4 sm:grid-cols-2">
                    {service === "internacional" && (
                      <>
                        <Field
                          label={tr("País de origen", "Origin country")}
                          invalid={error?.field === "pais_origen"}
                        >
                          {inp("pais_origen", { placeholder: tr("Ej. Colombia", "E.g. Colombia") })}
                        </Field>
                        <Field
                          label={tr("País de destino", "Destination country")}
                          invalid={error?.field === "pais_destino"}
                        >
                          {inp("pais_destino", { placeholder: tr("Ej. Canadá", "E.g. Canada") })}
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
                      <Field label={tr("¿Por cuánto tiempo?", "For how long?")}>
                        {sel("tiempo_bodegaje", [
                          tr("Menos de 1 mes", "Less than 1 month"),
                          tr("1 a 3 meses", "1 to 3 months"),
                          tr("3 a 6 meses", "3 to 6 months"),
                          tr("Más de 6 meses", "More than 6 months"),
                          tr("Aún no lo sé", "I don't know yet"),
                        ])}
                      </Field>
                    )}
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  {legend(tr("¿Cuándo lo necesitas?", "When do you need it?"))}
                  <Chips
                    value={form.urgencia || ""}
                    onChange={(v) => {
                      set("urgencia", v);
                      setError(null);
                    }}
                    options={[
                      [
                        tr("Urgente (próximos días)", "Urgent (next few days)"),
                        tr("Urgente · próximos días", "Urgent · next few days"),
                      ],
                      [
                        tr("Corto plazo (1–2 semanas)", "Short term (1–2 weeks)"),
                        tr("En 1–2 semanas", "In 1–2 weeks"),
                      ],
                      [
                        tr("Programado (varias semanas)", "Scheduled (several weeks)"),
                        tr("En varias semanas", "In several weeks"),
                      ],
                      [
                        tr("Planificado (1 mes o más)", "Planned (1 month or more)"),
                        tr("En 1 mes o más", "In 1 month or more"),
                      ],
                    ]}
                  />
                  <div className="grid items-end gap-4 sm:grid-cols-2">
                    <Field
                      label={tr("Fecha aproximada", "Approximate date")}
                      hint={tr("(opcional)", "(optional)")}
                    >
                      {inp("fecha", { type: "date" })}
                    </Field>
                    <label className="flex items-center gap-2.5 pb-3 font-medium text-tinta">
                      <input
                        type="checkbox"
                        checked={form.flexible === "1"}
                        onChange={(e) => set("flexible", e.target.checked ? "1" : "")}
                        className="h-[18px] w-[18px] accent-naranja"
                      />
                      {tr("Mi fecha es flexible", "My date is flexible")}
                    </label>
                  </div>
                  {service === "internacional" && (
                    <p className="mt-5 flex items-start gap-2.5 rounded-xl bg-beige px-4 py-3.5 text-[0.9rem] font-medium text-violeta">
                      <Bi n="clock" className="mt-0.5 text-naranja" />{" "}
                      {tr(
                        "Para mudanzas internacionales recomendamos iniciar el proceso entre 1 y 2 meses antes del empaque.",
                        "For international moves we recommend starting the process 1 to 2 months before packing.",
                      )}
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
                        <Field label={tr("Tipo de inmueble", "Type of property")}>
                          {sel("inmueble", [
                            tr("Apartamento", "Apartment"),
                            tr("Casa", "House"),
                            tr("Oficina", "Office"),
                            tr("Local comercial", "Retail space"),
                          ])}
                        </Field>
                        <Field label={tr("Piso", "Floor")}>
                          {inp("piso", {
                            type: "number",
                            min: 0,
                            max: 80,
                            placeholder: tr("Ej. 5", "E.g. 5"),
                          })}
                        </Field>
                      </div>
                      <Label>{tr("¿Tiene ascensor?", "Is there an elevator?")}</Label>
                      <Chips
                        value={form.ascensor || ""}
                        onChange={(v) => set("ascensor", v)}
                        options={[
                          [tr("Sí", "Yes"), tr("Sí", "Yes")],
                          [
                            tr("No, solo escaleras", "No, stairs only"),
                            tr("No, solo escaleras", "No, stairs only"),
                          ],
                        ]}
                      />
                      <Label>
                        {tr(
                          "¿Qué tan cerca puede parquear el camión?",
                          "How close can the truck park?",
                        )}
                      </Label>
                      <Chips
                        value={form.acceso || ""}
                        onChange={(v) => set("acceso", v)}
                        options={[
                          [
                            tr("Frente al inmueble", "Right in front"),
                            tr("Frente al inmueble", "Right in front"),
                          ],
                          [
                            tr("A menos de 50 m", "Less than 50 m away"),
                            tr("A menos de 50 m", "Less than 50 m away"),
                          ],
                          [
                            tr(
                              "A más de 50 m / fuera del conjunto",
                              "More than 50 m / outside the complex",
                            ),
                            tr(
                              "A más de 50 m o fuera del conjunto",
                              "More than 50 m or outside the complex",
                            ),
                          ],
                        ]}
                      />
                    </>
                  )}
                  {service === "internacional" && (
                    <>
                      <Label>
                        {tr("¿Cuál es el motivo del traslado?", "What is the reason for the move?")}
                      </Label>
                      <Chips
                        value={form.motivo || ""}
                        onChange={(v) => set("motivo", v)}
                        options={[
                          tr("Trabajo", "Work"),
                          tr("Estudio", "Study"),
                          tr("Me radico en otro país", "Settling in another country"),
                          tr("Regreso a Colombia", "Returning to Colombia"),
                          tr("Misión diplomática", "Diplomatic mission"),
                        ].map((o) => [o, o])}
                      />
                      <Label>{tr("Modalidad preferida", "Preferred mode")}</Label>
                      <Chips
                        value={form.modalidad || ""}
                        onChange={(v) => set("modalidad", v)}
                        options={[
                          [
                            tr("Marítima", "Sea"),
                            <>
                              <Bi n="water" /> {tr("Marítima", "Sea")}
                            </>,
                          ],
                          [
                            tr("Aérea", "Air"),
                            <>
                              <Bi n="airplane" /> {tr("Aérea", "Air")}
                            </>,
                          ],
                          [
                            tr("Necesito asesoría", "I need advice"),
                            tr("Necesito asesoría", "I need advice"),
                          ],
                        ]}
                      />
                    </>
                  )}
                  {service === "empresarial" && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label={tr("Empresa", "Company")}>
                        {inp("empresa", {
                          placeholder: tr("Nombre de la empresa", "Company name"),
                        })}
                      </Field>
                      <Field label={tr("Tipo de traslado", "Type of move")}>
                        {sel("tipo_empresarial", [
                          tr("Traslado de oficina", "Office move"),
                          tr("Reubicación de un funcionario", "Relocation of one employee"),
                          tr("Varios funcionarios", "Several employees"),
                          tr("Acuerdo corporativo recurrente", "Recurring corporate agreement"),
                        ])}
                      </Field>
                      <Field
                        label={tr("Cargo del funcionario", "Employee's position")}
                        hint={tr("(si aplica)", "(if applicable)")}
                      >
                        {inp("cargo", {
                          placeholder: tr("Ej. Gerente regional", "E.g. Regional manager"),
                        })}
                      </Field>
                      <Field label={tr("Horario de operación", "Operating hours")}>
                        {sel("horario", [
                          tr("Diurno, entre semana", "Daytime, weekdays"),
                          tr("Nocturno", "Night"),
                          tr("Fin de semana", "Weekend"),
                          tr("Por definir", "To be defined"),
                        ])}
                      </Field>
                    </div>
                  )}
                  {service === "bodegaje" && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label={tr("¿Qué deseas almacenar?", "What do you want to store?")}>
                        {sel("bodegaje_tipo", [
                          tr("Menaje de hogar", "Household goods"),
                          tr("Mobiliario de oficina", "Office furniture"),
                          tr("Archivo / documentos", "Files / documents"),
                          tr("Obras de arte u objetos de valor", "Artwork or valuables"),
                          tr("Otro", "Other"),
                        ])}
                      </Field>
                      <Field label={tr("¿Necesitas que recojamos?", "Do you need a pickup?")}>
                        {sel("bodegaje_recogida", [
                          tr("Sí, recoger en mi ubicación", "Yes, pick up at my location"),
                          tr("No, yo lo llevo", "No, I'll bring it"),
                        ])}
                      </Field>
                    </div>
                  )}
                </>
              )}

              {step === 5 && (
                <>
                  {legend(tr("¿Qué tanto vas a mover?", "How much are you moving?"))}
                  <Label>{tr("Volumen aproximado", "Approximate volume")}</Label>
                  <Chips
                    value={form.volumen || ""}
                    onChange={(v) => set("volumen", v)}
                    options={[
                      [
                        tr("Pocos objetos / cajas", "A few items / boxes"),
                        tr("Pocos objetos", "A few items"),
                      ],
                      [tr("Apartaestudio", "Studio apartment"), tr("Apartaestudio", "Studio")],
                      [
                        tr("Apartamento 2–3 habitaciones", "2–3 bedroom apartment"),
                        tr("2–3 habitaciones", "2–3 bedrooms"),
                      ],
                      [
                        tr("Casa grande (4+ habitaciones)", "Large house (4+ bedrooms)"),
                        tr("Casa grande", "Large house"),
                      ],
                      [tr("Oficina", "Office"), tr("Oficina", "Office")],
                    ]}
                  />
                  {service !== "bodegaje" && (
                    <>
                      <Label>{tr("Nivel de servicio", "Service level")}</Label>
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
                  <Label>{tr("Servicios adicionales", "Additional services")}</Label>
                  <Chips
                    multi
                    value={form.extras || ""}
                    onChange={(v) => set("extras", v)}
                    options={EXTRAS}
                  />
                  <Field
                    label={tr("Inventario o comentarios", "Inventory or comments")}
                    hint={tr(
                      "(entre más preciso, mejor la cotización)",
                      "(the more accurate, the better the quote)",
                    )}
                  >
                    <textarea
                      rows={3}
                      value={form.inventario || ""}
                      onChange={(e) => set("inventario", e.target.value)}
                      placeholder={tr(
                        "Ej. 1 sofá de 3 puestos, 2 camas dobles, comedor de 6, nevera, lavadora, 20 cajas, 3 cuadros…",
                        "E.g. 1 three-seat sofa, 2 double beds, 6-seat dining table, fridge, washer, 20 boxes, 3 paintings…",
                      )}
                      className={`${inputCls} resize-y`}
                    />
                  </Field>
                </>
              )}

              {step === 6 && (
                <>
                  {legend(tr("¿Cómo te contactamos?", "How can we reach you?"))}
                  <div className="mb-5 grid gap-4 sm:grid-cols-2">
                    <Field
                      label={tr("Nombre completo", "Full name")}
                      invalid={error?.field === "nombre"}
                    >
                      {inp("nombre", { autoComplete: "name", autoFocus: true })}
                    </Field>
                    <Field
                      label={tr("Celular / WhatsApp", "Mobile / WhatsApp")}
                      invalid={error?.field === "telefono"}
                    >
                      {inp("telefono", {
                        type: "tel",
                        autoComplete: "tel",
                        placeholder: "+57 300 000 0000",
                      })}
                    </Field>
                    <Field
                      label={tr("Correo electrónico", "Email")}
                      hint={tr("(opcional)", "(optional)")}
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
                    {tr(
                      "Autorizo a Transpack S.A.S. a tratar mis datos para gestionar esta solicitud.",
                      "I authorize Transpack S.A.S. to process my data to handle this request.",
                    )}
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
                  <Bi n="arrow-left" /> {tr("Atrás", "Back")}
                </button>
              ) : (
                <span />
              )}
              <button type="submit" className={`${btn.primary} ${btn.md}`}>
                {step === TOTAL
                  ? tr("Ver mi solicitud", "Review my request")
                  : tr("Continuar", "Continue")}
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
          className="absolute -bottom-20 -right-20 h-40 w-40 rotate-45 bg-naranja/90"
        />
        <h3 className="mb-5 text-lg !text-white">{tr("Tu solicitud", "Your request")}</h3>
        <dl className="relative z-10 mb-6 grid gap-3">
          {rows.length === 0 ? (
            <p className="text-[0.92rem] opacity-80">
              {tr("Elige un servicio para comenzar.", "Choose a service to get started.")}
            </p>
          ) : (
            rows.map(([l, v]) => (
              <div key={l} className="animate-fade-up">
                <dt className="text-[0.72rem] uppercase tracking-[0.12em] text-beige/80">{l}</dt>
                <dd className="font-medium text-white">
                  {v.length > 90 ? v.slice(0, 90) + "…" : v}
                </dd>
              </div>
            ))
          )}
        </dl>
        <div className="relative z-10 border-t border-white/15 pt-5">
          <p className="mb-1 text-[0.85rem]">
            {tr("¿Prefieres hablar con alguien?", "Prefer to talk to someone?")}
          </p>
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
