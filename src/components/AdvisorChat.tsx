// Joel, asesor virtual de Transpack. Es un chat guiado (no usa IA): sigue la
// "Lógica de Cotización" para perfilar la solicitud y la entrega al equipo
// comercial por WhatsApp. También responde preguntas frecuentes y reconoce
// algunas palabras clave cuando el visitante escribe libremente.
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { siteFor } from "@/data/content";
import { LANG_INFO, localize, makeTr, useLang, type Lang } from "@/i18n";
import { Bi } from "@/components/ui";
import joelAvatar from "@/imports/joel-avatar.png";
import joelFull from "@/imports/joel.png";

const NAME = "Joel";

type Data = Record<string, string>;
type Action = { label: string; icon: string; href?: string; to?: string };
type Msg = { from: "bot" | "user"; text: string; actions?: Action[] };
type Option = { label: string; next: string | ((d: Data) => string); set?: Data };
type Step = {
  say: (d: Data) => string[];
  options?: Option[] | ((d: Data) => Option[]);
  input?: { key: string; placeholder: string; next: (d: Data) => string };
  actions?: (d: Data) => Action[];
};

const opts = (labels: string[], key: string, next: Option["next"]): Option[] =>
  labels.map((l) => ({ label: l, next, set: { [key]: l } }));

const norm = (t: string) =>
  t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

// ─── Conversación (en el idioma de la página) ─────────────────────────────────

function buildChat(lang: Lang) {
  const { CONTACT, FAQS, SERVICES, waLink } = siteFor(lang);
  const tr = makeTr(lang);
  // En árabe el nombre se escribe en su alfabeto
  const AR_NAME = "جويل";
  const lp = (path: string) => localize(path, lang);

  const SERVICE_NAMES: Data = {
    local: tr("Mudanza local", "Local move"),
    nacional: tr("Mudanza nacional", "National move"),
    internacional: tr("Mudanza internacional", "International move"),
    bodegaje: tr("Bodegaje", "Storage"),
    empresarial: tr("Traslado empresarial / institucional", "Corporate / institutional move"),
  };

  const LABELS: [string, string][] = [
    ["servicio", tr("Servicio", "Service")],
    ["tipo_corp", tr("Tipo de solicitud", "Type of request")],
    ["empresa", tr("Empresa o entidad", "Company or institution")],
    ["pais_origen", tr("País de origen", "Origin country")],
    ["pais_destino", tr("País de destino", "Destination country")],
    ["origen", tr("Origen", "Origin")],
    ["destino", tr("Destino", "Destination")],
    ["cuando", tr("Cuándo", "When")],
    ["motivo", tr("Motivo", "Reason")],
    ["modalidad", tr("Modalidad", "Mode")],
    ["bodega_que", tr("Qué se almacena", "What is stored")],
    ["bodega_tiempo", tr("Tiempo de bodegaje", "Storage time")],
    ["volumen", tr("Volumen", "Volume")],
    ["nivel", tr("Nivel de servicio", "Service level")],
  ];

  const summary = (d: Data) =>
    LABELS.filter(([k]) => d[k])
      .map(([k, l]) => `• ${l}: ${k === "servicio" ? SERVICE_NAMES[d[k]] : d[k]}`)
      .join("\n");

  const waMessage = (d: Data) =>
    [
      tr(
        `Hola Transpack, soy ${d.nombre || ""}. ${NAME} (asesor virtual) me ayudó a preparar esta solicitud:`,
        `Hello Transpack, I'm ${d.nombre || ""}. ${NAME} (virtual advisor) helped me prepare this request:`,
        {
          fr: `Bonjour Transpack, je suis ${d.nombre || ""}. ${NAME} (conseiller virtuel) m'a aidé à préparer cette demande :`,
          de: `Hallo Transpack, ich bin ${d.nombre || ""}. ${NAME} (virtueller Berater) hat mir geholfen, diese Anfrage vorzubereiten:`,
          it: `Ciao Transpack, sono ${d.nombre || ""}. ${NAME} (consulente virtuale) mi ha aiutato a preparare questa richiesta:`,
          ar: `مرحبًا ترانسباك، أنا ${d.nombre || ""}. ساعدني ${AR_NAME} (المستشار الافتراضي) في إعداد هذا الطلب:`,
        },
      ),
      "",
      summary(d),
      ...(lang !== "es" ? ["", `[Idioma del cliente: ${LANG_INFO[lang].name}]`] : []),
    ].join("\n");

  const quoteService = (d: Data) =>
    d.servicio === "empresarial" ? "empresarial" : d.servicio || "local";

  const MAIN: Option[] = [
    { label: tr("Quiero cotizar una mudanza", "I want a moving quote"), next: "svc" },
    { label: tr("Tengo una pregunta", "I have a question"), next: "faq" },
    { label: tr("Soy una empresa o embajada", "I'm a company or embassy"), next: "corp" },
    { label: tr("Hablar con un asesor", "Talk to an advisor"), next: "human" },
  ];
  const BACK: Option = { label: tr("Volver al inicio", "Back to start"), next: "start" };

  const STEPS: Record<string, Step> = {
    start: {
      say: () => [
        tr(
          `¡Hola! Soy ${NAME}, el asesor virtual de Transpack.`,
          `Hi! I'm ${NAME}, Transpack's virtual advisor.`,
          {
            fr: `Bonjour ! Je suis ${NAME}, le conseiller virtuel de Transpack.`,
            de: `Hallo! Ich bin ${NAME}, der virtuelle Berater von Transpack.`,
            it: `Ciao! Sono ${NAME}, il consulente virtuale di Transpack.`,
            ar: `مرحبًا! أنا ${AR_NAME}، المستشار الافتراضي لترانسباك.`,
          },
        ),
        tr(
          "Te ayudo a planear tu mudanza, resolver dudas o hablar con nuestro equipo. ¿Qué necesitas?",
          "I can help you plan your move, answer questions or connect you with our team. What do you need?",
        ),
      ],
      options: MAIN,
    },
    menu: {
      say: () => [tr("¿En qué más te puedo ayudar?", "What else can I help you with?")],
      options: MAIN,
    },
    svc: {
      say: () => [
        tr(
          "¡Con gusto! ¿Qué tipo de traslado necesitas?",
          "Happy to help! What kind of move do you need?",
        ),
      ],
      options: [
        {
          label: tr("Mudanza local (en la misma ciudad)", "Local move (same city)"),
          next: "origen",
          set: { servicio: "local" },
        },
        {
          label: tr("Mudanza nacional (entre ciudades)", "National move (between cities)"),
          next: "origen",
          set: { servicio: "nacional" },
        },
        {
          label: tr("Mudanza internacional", "International move"),
          next: "int_info",
          set: { servicio: "internacional" },
        },
        { label: tr("Bodegaje", "Storage"), next: "bod_que", set: { servicio: "bodegaje" } },
      ],
    },

    // Internacional: primero orientar, luego perfilar (no se cotiza igual que una urbana)
    int_info: {
      say: () => [
        tr(
          "Las mudanzas internacionales necesitan planeación: te recomendamos empezar entre 1 y 2 meses antes del empaque. Un asesor especializado revisará contigo requisitos, tiempos y costos.",
          "International moves need planning: we recommend starting 1 to 2 months before packing. A specialized advisor will review requirements, timelines and costs with you.",
        ),
        tr("Para empezar, ¿desde qué país sales?", "To start, which country are you moving from?"),
      ],
      input: {
        key: "pais_origen",
        placeholder: tr("Ej. Colombia", "E.g. United States"),
        next: () => "int_destino",
      },
    },
    int_destino: {
      say: () => [
        tr("¿Y a qué país y ciudad vas?", "And which country and city are you moving to?"),
      ],
      input: {
        key: "pais_destino",
        placeholder: tr("Ej. Canadá, Toronto", "E.g. Colombia, Bogotá"),
        next: () => "cuando",
      },
    },

    origen: {
      say: (d) => [
        d.servicio === "local"
          ? tr(
              "¿En qué barrio o dirección está el inmueble de origen?",
              "What neighborhood or address are you moving from?",
            )
          : d.servicio === "bodegaje"
            ? tr(
                "¿En qué ciudad o barrio recogemos tus cosas?",
                "Which city or neighborhood should we pick up from?",
              )
            : tr("¿Desde qué ciudad te mudas?", "Which city are you moving from?"),
      ],
      input: {
        key: "origen",
        placeholder: tr("Ej. Bogotá, Chapinero", "E.g. Bogotá, Chapinero"),
        next: (d) => (d.servicio === "bodegaje" ? "nombre" : "destino"),
      },
    },
    destino: {
      say: (d) => [
        d.servicio === "local"
          ? tr(
              "¿Y a qué barrio o dirección vas?",
              "And what neighborhood or address are you moving to?",
            )
          : tr("¿A qué ciudad te mudas?", "Which city are you moving to?"),
      ],
      input: {
        key: "destino",
        placeholder: tr("Ej. Medellín", "E.g. Medellín"),
        next: () => "cuando",
      },
    },
    cuando: {
      say: () => [tr("¿Para cuándo lo necesitas?", "When do you need it?")],
      options: opts(
        [
          tr("Urgente (próximos días)", "Urgent (next few days)"),
          tr("En 1–2 semanas", "In 1–2 weeks"),
          tr("En varias semanas", "In several weeks"),
          tr("En 1 mes o más", "In 1 month or more"),
        ],
        "cuando",
        (d) => (d.servicio === "internacional" ? "motivo" : "volumen"),
      ),
    },
    motivo: {
      say: () => [tr("¿Cuál es el motivo del traslado?", "What is the reason for the move?")],
      options: opts(
        [
          tr("Trabajo", "Work"),
          tr("Estudio", "Study"),
          tr("Me radico en otro país", "Settling in another country"),
          tr("Regreso a Colombia", "Returning to Colombia"),
          tr("Misión diplomática", "Diplomatic mission"),
        ],
        "motivo",
        "modalidad",
      ),
    },
    modalidad: {
      say: () => [
        tr(
          "¿Tienes preferencia de modalidad? La marítima es ideal para grandes volúmenes; la aérea es más rápida, para cargas pequeñas o urgentes.",
          "Do you have a preferred mode? Sea freight is ideal for large volumes; air freight is faster, for small or urgent shipments.",
        ),
      ],
      options: opts(
        [
          tr("Marítima", "Sea"),
          tr("Aérea", "Air"),
          tr("No sé, necesito asesoría", "Not sure, I need advice"),
        ],
        "modalidad",
        "volumen",
      ),
    },
    volumen: {
      say: () => [
        tr("¿Qué tanto vas a mover, aproximadamente?", "Roughly how much are you moving?"),
      ],
      options: opts(
        [
          tr("Pocos objetos o cajas", "A few items or boxes"),
          tr("Apartaestudio", "Studio apartment"),
          tr("Apartamento de 2–3 habitaciones", "2–3 bedroom apartment"),
          tr("Casa grande", "Large house"),
          tr("Oficina", "Office"),
        ],
        "volumen",
        (d) => (d.servicio === "internacional" ? "nombre" : "nivel"),
      ),
    },
    nivel: {
      say: () => [tr("¿Cuánto quieres delegar?", "How much do you want to hand over?")],
      options: opts(
        [
          tr("Básico: ya tengo todo empacado", "Basic: everything is already packed"),
          tr("Protección: empaquen y protejan", "Protection: pack and protect my things"),
          tr("Integral: que se encarguen de todo", "Full service: take care of everything"),
          tr("No estoy seguro", "I'm not sure"),
        ],
        "nivel",
        "nombre",
      ),
    },

    bod_que: {
      say: () => [tr("¿Qué deseas almacenar?", "What do you want to store?")],
      options: opts(
        [
          tr("Menaje de hogar", "Household goods"),
          tr("Mobiliario de oficina", "Office furniture"),
          tr("Archivo o documentos", "Files or documents"),
          tr("Obras de arte u objetos de valor", "Artwork or valuables"),
          tr("Otro", "Other"),
        ],
        "bodega_que",
        "bod_tiempo",
      ),
    },
    bod_tiempo: {
      say: () => [tr("¿Por cuánto tiempo, aproximadamente?", "For roughly how long?")],
      options: opts(
        [
          tr("Menos de 1 mes", "Less than 1 month"),
          tr("1 a 3 meses", "1 to 3 months"),
          tr("3 a 6 meses", "3 to 6 months"),
          tr("Más de 6 meses", "More than 6 months"),
          tr("Aún no lo sé", "I don't know yet"),
        ],
        "bodega_tiempo",
        "origen",
      ),
    },

    corp: {
      say: () => [
        tr(
          "Con gusto. Nuestras unidades Corporate Mobility y Diplomatic & Institutional atienden empresas, embajadas y organismos con un ejecutivo de cuenta dedicado.",
          "Of course. Our Corporate Mobility and Diplomatic & Institutional units serve companies, embassies and institutions with a dedicated account executive.",
        ),
        tr("¿Qué necesitas?", "What do you need?"),
      ],
      options: [
        {
          label: tr("Trasladar una oficina", "Move an office"),
          next: "empresa",
          set: { servicio: "empresarial", tipo_corp: tr("Traslado de oficina", "Office move") },
        },
        {
          label: tr("Reubicar funcionarios", "Relocate employees"),
          next: "empresa",
          set: {
            servicio: "empresarial",
            tipo_corp: tr("Reubicación de funcionarios", "Employee relocation"),
          },
        },
        {
          label: tr("Un acuerdo corporativo", "A corporate agreement"),
          next: "empresa",
          set: {
            servicio: "empresarial",
            tipo_corp: tr("Acuerdo corporativo recurrente", "Recurring corporate agreement"),
          },
        },
        {
          label: tr("Somos embajada u organismo", "We are an embassy or institution"),
          next: "empresa",
          set: {
            servicio: "empresarial",
            tipo_corp: tr(
              "Embajada / organismo internacional",
              "Embassy / international institution",
            ),
          },
        },
      ],
    },
    empresa: {
      say: () => [
        tr(
          "¿Cuál es el nombre de la empresa o entidad?",
          "What is the name of the company or institution?",
        ),
      ],
      input: {
        key: "empresa",
        placeholder: tr("Nombre de la empresa", "Company name"),
        next: () => "nombre",
      },
    },

    nombre: {
      say: () => [
        tr("¡Perfecto! Por último, ¿cómo te llamas?", "Perfect! Lastly, what's your name?"),
      ],
      input: { key: "nombre", placeholder: tr("Tu nombre", "Your name"), next: () => "resumen" },
    },
    resumen: {
      say: (d) => [
        tr(
          `¡Gracias, ${d.nombre}! Este es el resumen de tu solicitud:`,
          `Thank you, ${d.nombre}! Here is a summary of your request:`,
          {
            fr: `Merci, ${d.nombre} ! Voici le récapitulatif de votre demande :`,
            de: `Vielen Dank, ${d.nombre}! Hier ist die Zusammenfassung Ihrer Anfrage:`,
            it: `Grazie, ${d.nombre}! Ecco il riepilogo della tua richiesta:`,
            ar: `شكرًا لك يا ${d.nombre}! إليك ملخص طلبك:`,
          },
        ),
        summary(d),
        d.servicio === "internacional"
          ? tr(
              "Envíala por WhatsApp y un asesor especializado en mudanzas internacionales te contactará para revisar tu caso.",
              "Send it on WhatsApp and an international moving specialist will contact you to review your case.",
            )
          : d.servicio === "empresarial"
            ? tr(
                "Envíala por WhatsApp y un ejecutivo de cuenta te contactará con una propuesta.",
                "Send it on WhatsApp and an account executive will contact you with a proposal.",
              )
            : tr(
                "Envíala por WhatsApp y un asesor te responderá con un estimado. Si hace falta, coordinamos una visita técnica.",
                "Send it on WhatsApp and an advisor will reply with an estimate. If needed, we'll arrange an on-site survey.",
              ),
      ],
      actions: (d) => [
        {
          label: tr("Enviar por WhatsApp", "Send on WhatsApp"),
          icon: "whatsapp",
          href: waLink(waMessage(d)),
        },
        {
          label: tr("Completar en el cotizador", "Complete it in the quote form"),
          icon: "ui-checks",
          to: lp(`/?servicio=${quoteService(d)}#cotizar`),
        },
      ],
      options: [{ label: tr("Empezar de nuevo", "Start over"), next: "reset" }],
    },

    faq: {
      say: () => [
        tr(
          "Estas son las preguntas que más nos hacen:",
          "These are the questions we're asked most often:",
        ),
      ],
      options: () => [
        ...FAQS.map((f, i) => ({ label: f.q, next: "faq_answer", set: { faq: String(i) } })),
        { label: tr("¿Qué servicios ofrecen?", "What services do you offer?"), next: "servicios" },
      ],
    },
    faq_answer: {
      say: (d) => [FAQS[Number(d.faq)]?.a ?? ""],
      options: [
        { label: tr("Tengo otra pregunta", "I have another question"), next: "faq" },
        { label: tr("Quiero cotizar", "I want a quote"), next: "svc" },
        BACK,
      ],
    },
    servicios: {
      say: () => [
        tr(
          "Hacemos mudanzas locales, nacionales e internacionales (marítimas y aéreas), bodegaje, embalaje especializado para objetos de valor y gestión documental y aduanera. Puedes ver el detalle de cada uno:",
          "We handle local, national and international moves (by sea and air), storage, specialized packing for valuables, and customs and documentation. You can see the details of each one:",
        ),
      ],
      actions: () =>
        SERVICES.map((s) => ({ label: s.title, icon: s.icon, to: lp(`/servicios/${s.slug}`) })),
      options: [{ label: tr("Quiero cotizar", "I want a quote"), next: "svc" }, BACK],
    },
    human: {
      say: () => [
        tr(
          "¡Claro! Nuestro equipo te atiende por WhatsApp, teléfono o correo.",
          "Of course! Our team is available on WhatsApp, by phone or by email.",
        ),
        tr(
          `También puedes visitarnos en ${CONTACT.address}.`,
          `You can also visit us at ${CONTACT.address}.`,
          {
            fr: `Vous pouvez aussi nous rendre visite : ${CONTACT.address}.`,
            de: `Sie können uns auch besuchen: ${CONTACT.address}.`,
            it: `Puoi anche venirci a trovare: ${CONTACT.address}.`,
            ar: `يمكنك أيضًا زيارتنا في: ${CONTACT.address}.`,
          },
        ),
      ],
      actions: () => [
        {
          label: tr("Escribir por WhatsApp", "Message on WhatsApp"),
          icon: "whatsapp",
          href: waLink(),
        },
        {
          label: tr(`Llamar al ${CONTACT.phones[0]}`, `Call +57 ${CONTACT.phones[0]}`, {
            fr: `Appeler le +57 ${CONTACT.phones[0]}`,
            de: `+57 ${CONTACT.phones[0]} anrufen`,
            it: `Chiama il +57 ${CONTACT.phones[0]}`,
            ar: `اتصل على ‎+57 ${CONTACT.phones[0]}`,
          }),
          icon: "telephone",
          href: `tel:+57${CONTACT.phones[0].replace(/\s/g, "")}`,
        },
        {
          label: tr("Enviar un correo", "Send an email"),
          icon: "envelope",
          href: `mailto:${CONTACT.email}`,
        },
      ],
      options: [BACK],
    },
    fallback: {
      say: () => [
        tr(
          "No estoy seguro de haberte entendido. Puedo ayudarte con alguna de estas opciones:",
          "I'm not sure I understood. I can help you with one of these options:",
        ),
      ],
      options: MAIN,
    },
  };

  // Texto libre fuera de un paso de escritura → intención por palabras clave
  // (en los seis idiomas; el texto llega sin tildes ni diéresis por norm)
  function route(text: string): { next: string; set?: Data } {
    const t = norm(text);
    if (
      /asesor|humano|persona|llamar|telefono|whatsapp|contact|advisor|human|agent|call|phone|conseiller|appeler|telephone|berater|mensch|anrufen|telefon|consulente|chiamare|telefono|umano|مستشار|اتصال|هاتف|واتساب|شخص/.test(
        t,
      )
    )
      return { next: "human" };
    if (
      /embajada|empresa|oficina|corporativ|funcionario|organismo|embassy|company|office|corporate|employee|ambassade|entreprise|societe|bureau|botschaft|firma|unternehmen|buro|ambasciata|azienda|ufficio|سفارة|شركة|مكتب|موظف/.test(
        t,
      )
    )
      return { next: "corp" };
    if (
      /bodeg|guardar|almacen|storage|store|warehouse|garde-meuble|stockage|entrepos|lager|einlager|deposito|magazzin|custodia|تخزين|مستودع|حفظ/.test(
        t,
      )
    )
      return { next: "bod_que", set: { servicio: "bodegaje" } };
    if (
      /tarda|demora|tiempo|cuanto dura|how long|take|time|combien de temps|delai|duree|wie lange|dauer|dauert|quanto tempo|quanto dura|tempi|كم يستغرق|مدة|وقت/.test(
        t,
      )
    )
      return { next: "faq_answer", set: { faq: "1" } };
    if (
      /maritim|aere|avion|barco|sea|air|ship|plane|bateau|avion|aerien|schiff|flug|luft|seefracht|nave|aereo|barca|بحري|جوي|طائرة|سفينة/.test(
        t,
      )
    )
      return { next: "faq_answer", set: { faq: "2" } };
    if (
      /anticipacion|cuando debo|con cuanto tiempo|advance|book|a l'avance|reserver|im voraus|buchen|in anticipo|prenotare|مسبق|حجز/.test(
        t,
      )
    )
      return { next: "faq_answer", set: { faq: "0" } };
    if (/visita|survey|visit|besichtigung|sopralluogo|زيارة|معاينة/.test(t))
      return { next: "faq_answer", set: { faq: "3" } };
    if (/inventario|inventory|inventaire|inventar|inventario|جرد/.test(t))
      return { next: "faq_answer", set: { faq: "4" } };
    if (
      /internacional|exterior|otro pais|extranjero|canada|espana|spain|estados unidos|united states|usa|europa|europe|miami|international|abroad|overseas|etranger|ausland|international|estero|internazional|دولي|الخارج|بلد آخر/.test(
        t,
      )
    )
      return { next: "int_info", set: { servicio: "internacional" } };
    if (
      /nacional|otra ciudad|medellin|cali|barranquilla|cartagena|bucaramanga|national|another city|autre ville|andere stadt|innerhalb kolumbiens|altra citta|نقل داخلي|مدينة أخرى/.test(
        t,
      )
    )
      return { next: "origen", set: { servicio: "nacional" } };
    if (
      /precio|cuesta|valor|cotiz|tarifa|mudanza|trasteo|mudar|price|cost|quote|rate|move|moving|prix|tarif|devis|demenag|preis|kosten|angebot|umzug|prezzo|costo|preventivo|traslo|سعر|تكلفة|عرض|نقل|انتقال/.test(
        t,
      )
    )
      return { next: "svc" };
    if (/servicio|service|leistung|servizi|خدمة|خدمات/.test(t)) return { next: "servicios" };
    if (
      /^(hola|buen|hey|saludos|hi|hello|good|bonjour|salut|hallo|guten|ciao|salve|مرحبا|السلام|أهلا|اهلا)/.test(
        t,
      )
    )
      return { next: "menu" };
    return { next: "fallback" };
  }

  return { STEPS, route };
}

// ─── UI ───────────────────────────────────────────────────────────────────────

function Avatar({ size = 36 }: { size?: number }) {
  return (
    <img
      src={joelAvatar}
      alt=""
      width={size}
      height={size}
      className="shrink-0 rounded-full bg-gradient-to-br from-beige to-[#ffd2ad] object-cover"
      style={{ width: size, height: size }}
    />
  );
}

function Bubble({ msg }: { msg: Msg }) {
  const bot = msg.from === "bot";
  return (
    <div
      className={`animate-fade-up flex items-end gap-2 ${bot ? "justify-start" : "justify-end"}`}
    >
      {bot && <Avatar size={24} />}
      <div className={`max-w-[82%] ${bot ? "" : "text-end"}`}>
        <div
          className={`inline-block whitespace-pre-line px-3.5 py-2.5 text-start text-[0.86rem] leading-relaxed ${
            bot
              ? "rounded-[4px_16px_16px_16px] border border-linea bg-white text-texto shadow-sm"
              : "rounded-[16px_16px_4px_16px] bg-azul text-white"
          }`}
        >
          {msg.text}
        </div>
        {msg.actions && (
          <div className="mt-2 flex flex-col gap-1.5">
            {msg.actions.map((a) => {
              const cls = `inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-[0.84rem] font-semibold transition-colors ${
                a.icon === "whatsapp"
                  ? "bg-whatsapp text-white hover:brightness-95"
                  : "bg-azul/8 text-azul hover:bg-azul hover:text-white"
              }`;
              return a.to ? (
                <Link key={a.label} to={a.to} className={cls}>
                  <Bi n={a.icon} /> {a.label}
                </Link>
              ) : (
                <a
                  key={a.label}
                  href={a.href}
                  target={a.href?.startsWith("http") ? "_blank" : undefined}
                  rel="noopener"
                  className={cls}
                >
                  <Bi n={a.icon} /> {a.label}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdvisorChat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [stepId, setStepId] = useState("start");
  const [data, setData] = useState<Data>({});
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState("");
  const [teaser, setTeaser] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timers = useRef<number[]>([]);
  const { lang, tr } = useLang();
  const { STEPS, route } = useMemo(() => buildChat(lang), [lang]);

  const step = STEPS[stepId];

  // Muestra los mensajes de un paso uno a uno, con indicador de "escribiendo"
  const goTo = (id: string, d: Data) => {
    const target = id === "reset" ? "start" : id;
    const nextData = id === "reset" ? {} : d;
    if (id === "reset") setMsgs([]);
    setData(nextData);
    setStepId(target);
    const s = STEPS[target];
    const lines = s.say(nextData);
    setTyping(true);
    let delay = 0;
    lines.forEach((line, i) => {
      delay += Math.min(1100, 450 + line.length * 6);
      const last = i === lines.length - 1;
      timers.current.push(
        window.setTimeout(() => {
          setMsgs((m) => [
            ...m,
            { from: "bot", text: line, actions: last ? s.actions?.(nextData) : undefined },
          ]);
          if (last) setTyping(false);
        }, delay),
      );
    });
  };

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Si cambia el idioma, la conversación se reinicia en el idioma nuevo
  const firstLang = useRef(lang);
  useEffect(() => {
    if (firstLang.current === lang) return;
    firstLang.current = lang;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setTyping(false);
    setData({});
    setStepId("start");
    setMsgs([]);
    if (open) goTo("start", {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  // Otros elementos del sitio (por ejemplo el menú) pueden abrir el chat
  useEffect(() => {
    const openChat = () => setOpen(true);
    window.addEventListener("tp:open-chat", openChat);
    return () => window.removeEventListener("tp:open-chat", openChat);
  }, []);

  // Saludo al abrir por primera vez
  useEffect(() => {
    if (open && msgs.length === 0 && !typing) goTo("start", {});
    if (open) setTeaser(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Invitación discreta una sola vez por sesión
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("tp-chat-teaser") === "1";
    } catch {
      /* sin almacenamiento disponible */
    }
    if (seen) return;
    const id = window.setTimeout(() => {
      setTeaser(true);
      try {
        sessionStorage.setItem("tp-chat-teaser", "1");
      } catch {
        /* sin almacenamiento disponible */
      }
    }, 7000);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, typing]);

  useEffect(() => {
    if (open && step.input && !typing) inputRef.current?.focus();
  }, [open, step, typing]);

  const choose = (o: Option) => {
    const d = { ...data, ...o.set };
    setMsgs((m) => [...m, { from: "user", text: o.label }]);
    goTo(typeof o.next === "function" ? o.next(d) : o.next, d);
  };

  const send = () => {
    const value = text.trim();
    if (!value || typing) return;
    setText("");
    setMsgs((m) => [...m, { from: "user", text: value }]);
    if (step.input) {
      const d = { ...data, [step.input.key]: value };
      goTo(step.input.next(d), d);
    } else {
      const r = route(value);
      goTo(r.next, { ...data, ...r.set });
    }
  };

  const options = typeof step.options === "function" ? step.options(data) : (step.options ?? []);

  return (
    <>
      {/* Invitación: Joel se asoma junto al botón */}
      {teaser && !open && (
        <div className="animate-fade-up fixed bottom-[76px] right-3 z-[60] flex items-end md:bottom-[88px] md:right-6">
          <div className="relative mb-16 mr-[-18px] max-w-[220px] rounded-2xl rounded-br-sm bg-white px-4 py-3 text-[0.85rem] text-texto shadow-[var(--shadow-float)]">
            <button
              onClick={() => setTeaser(false)}
              className="absolute right-1.5 top-1 text-xs text-suave hover:text-azul"
              aria-label={tr("Cerrar invitación", "Close invitation")}
            >
              <Bi n="x-lg" />
            </button>
            <button onClick={() => setOpen(true)} className="pr-3 text-start">
              <b className="text-tinta">
                {tr(`¡Hola! Soy ${NAME}.`, `Hi! I'm ${NAME}.`, {
                  fr: `Bonjour ! Je suis ${NAME}.`,
                  de: `Hallo! Ich bin ${NAME}.`,
                  it: `Ciao! Sono ${NAME}.`,
                  ar: `مرحبًا! أنا ${"جويل"}.`,
                })}
              </b>{" "}
              {tr(
                "¿Planeas una mudanza? Te ayudo a organizarla.",
                "Planning a move? I can help you organize it.",
              )}
            </button>
          </div>
          <button
            onClick={() => setOpen(true)}
            aria-label={tr(`Hablar con ${NAME}`, `Talk to ${NAME}`, {
              fr: `Parler à ${NAME}`,
              de: `Mit ${NAME} sprechen`,
              it: `Parla con ${NAME}`,
              ar: `تحدث مع ${"جويل"}`,
            })}
            className="shrink-0"
          >
            <img
              src={joelFull}
              alt=""
              className="h-[150px] w-auto drop-shadow-[0_12px_18px_rgba(29,32,80,.25)] md:h-[170px]"
            />
          </button>
        </div>
      )}

      {/* Lanzador */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={
          open
            ? tr("Cerrar chat", "Close chat")
            : tr(`Hablar con ${NAME}, asesor virtual`, `Talk to ${NAME}, virtual advisor`, {
                fr: `Parler à ${NAME}, conseiller virtuel`,
                de: `Mit ${NAME} sprechen, virtueller Berater`,
                it: `Parla con ${NAME}, consulente virtuale`,
                ar: `تحدث مع ${"جويل"}، المستشار الافتراضي`,
              })
        }
        className="group fixed bottom-4 right-4 z-[60] flex items-center gap-2.5 rounded-full bg-gradient-to-br from-azul to-violeta p-1.5 text-white shadow-[0_16px_34px_-10px_rgba(39,43,124,.6)] transition-transform hover:-translate-y-0.5 md:bottom-6 md:right-6 md:pr-4"
      >
        {open ? (
          <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15 text-lg">
            <Bi n="x-lg" />
          </span>
        ) : (
          <span className="relative">
            <span className="absolute inset-0 animate-ping rounded-full bg-naranja/40 [animation-duration:2.4s]" />
            <Avatar size={40} />
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-azul bg-[#22c55e]" />
          </span>
        )}
        <span className="hidden text-start md:block">
          <span className="flex items-center gap-1.5 text-[0.82rem] font-semibold leading-tight">
            {open ? tr("Cerrar", "Close") : NAME}
            {!open && (
              <span className="rounded-full bg-naranja px-1.5 py-px text-[0.6rem] font-bold tracking-wide text-white">
                {tr("IA", "AI")}
              </span>
            )}
          </span>
          {!open && (
            <span className="block text-[0.72rem] leading-tight text-white/70">
              {tr("En línea", "Online")}
            </span>
          )}
        </span>
      </button>

      {/* Ventana */}
      {open && (
        <section
          aria-label={tr(`Chat con ${NAME}`, `Chat with ${NAME}`, {
            fr: `Discussion avec ${NAME}`,
            de: `Chat mit ${NAME}`,
            it: `Chat con ${NAME}`,
            ar: `محادثة مع ${"جويل"}`,
          })}
          className="animate-fade-up fixed inset-x-3 bottom-[76px] top-20 z-[60] flex flex-col overflow-hidden rounded-[24px] border border-azul/10 bg-white shadow-[0_40px_80px_-30px_rgba(39,43,124,.5)] sm:inset-x-auto sm:right-6 sm:top-auto sm:h-[min(620px,calc(100vh-130px))] sm:w-[400px] md:bottom-[92px]"
        >
          <header className="relative flex items-center gap-3 overflow-hidden bg-gradient-to-br from-azul to-violeta px-5 py-4">
            <span className="pointer-events-none absolute -right-14 -top-20 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(255,118,25,.3),transparent_70%)]" />
            <span className="relative">
              <Avatar size={42} />
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-azul bg-[#22c55e]" />
            </span>
            <div className="relative flex-1">
              <p className="flex items-center gap-2 font-title font-semibold text-white">
                {NAME}
                <span className="rounded-full bg-white/15 px-2 py-px text-[0.62rem] font-semibold uppercase tracking-wider text-beige">
                  {tr("Asesor virtual", "Virtual advisor")}
                </span>
              </p>
              <p className="text-[0.75rem] text-white/70">
                {tr("Transpack · Responde al instante", "Transpack · Answers instantly")}
              </p>
            </div>
            <button
              onClick={() => goTo("reset", {})}
              className="relative grid h-8 w-8 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white"
              aria-label={tr("Reiniciar conversación", "Restart conversation")}
              title={tr("Reiniciar conversación", "Restart conversation")}
            >
              <Bi n="arrow-counterclockwise" />
            </button>
            <button
              onClick={() => setOpen(false)}
              className="relative grid h-8 w-8 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white"
              aria-label={tr("Cerrar chat", "Close chat")}
            >
              <Bi n="x-lg" />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-[#f6f7fd] p-4" aria-live="polite">
            {msgs.map((m, i) => (
              <Bubble key={i} msg={m} />
            ))}
            {typing && (
              <div className="flex items-end gap-2">
                <Avatar size={24} />
                <div className="flex gap-1 rounded-[4px_16px_16px_16px] border border-linea bg-white px-3.5 py-3">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-azul/60"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
            {!typing && options.length > 0 && (
              <div className="flex flex-wrap justify-end gap-1.5 pt-1">
                {options.map((o) => (
                  <button
                    key={o.label}
                    onClick={() => choose(o)}
                    className="animate-fade-up rounded-full border border-azul/25 bg-white px-3.5 py-2 text-start text-[0.82rem] font-semibold text-azul transition-colors hover:border-azul hover:bg-azul hover:text-white"
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-center gap-2 border-t border-linea bg-white p-3"
          >
            <input
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                step.input?.placeholder ?? tr("Escribe tu mensaje…", "Type your message…")
              }
              aria-label={tr("Mensaje", "Message")}
              className="no-ring min-w-0 flex-1 rounded-full border border-linea bg-gris px-4 py-2.5 text-[0.88rem] text-tinta outline-none transition focus:border-azul focus:bg-white"
            />
            <button
              type="submit"
              disabled={!text.trim() || typing}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-naranja text-white transition-opacity disabled:opacity-40"
              aria-label={tr("Enviar", "Send")}
            >
              <Bi n="send-fill" />
            </button>
          </form>
        </section>
      )}
    </>
  );
}
