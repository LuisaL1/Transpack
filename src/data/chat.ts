// Joel, asesor virtual: chat guiado que sigue la "Lógica de Cotización" para
// perfilar la solicitud y entregarla al equipo comercial por WhatsApp. Aquí
// están los pasos de la conversación (en el idioma de la página) y los textos
// de la interfaz. La lógica está en src/hooks/useAdvisorChat.ts; en español el
// texto libre lo responde el cerebro de Joel (src/lib/joel.ts).
import { siteFor } from "@/data/content";
import { LANG_INFO, localize, makeTr, type Lang, type Tr } from "@/i18n";

export const NAME = "Joel";
// En árabe el nombre se escribe en su alfabeto
const AR_NAME = "جويل";

export type ChatData = Record<string, string>;
export type ChatAction = {
  label: string;
  icon: string;
  href?: string;
  to?: string;
  /** Evento de Google Analytics al pulsar la acción (p. ej. la solicitud enviada) */
  event?: { name: string; params?: Record<string, string> };
};
export type ChatMsg = { from: "bot" | "user"; text: string; actions?: ChatAction[] };
export type ChatOption = {
  label: string;
  next: string | ((d: ChatData) => string);
  set?: ChatData;
  icon?: string;
};
export type ChatStep = {
  say: (d: ChatData) => string[];
  options?: ChatOption[] | ((d: ChatData) => ChatOption[]);
  input?: { key: string; placeholder: string; next: (d: ChatData) => string };
  actions?: (d: ChatData) => ChatAction[];
};

const opts = (labels: string[], key: string, next: ChatOption["next"]): ChatOption[] =>
  labels.map((l) => ({ label: l, next, set: { [key]: l } }));

// ─── Conversación (en el idioma de la página) ─────────────────────────────────

export function buildChat(lang: Lang): Record<string, ChatStep> {
  const { CONTACT, FAQS, SERVICES, waLink } = siteFor(lang);
  const tr = makeTr(lang);
  const lp = (path: string) => localize(path, lang);

  const SERVICE_NAMES: ChatData = {
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

  const summary = (d: ChatData) =>
    LABELS.filter(([k]) => d[k])
      .map(([k, l]) => `• ${l}: ${k === "servicio" ? SERVICE_NAMES[d[k]] : d[k]}`)
      .join("\n");

  const waMessage = (d: ChatData) =>
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

  const quoteService = (d: ChatData) =>
    d.servicio === "empresarial" ? "empresarial" : d.servicio || "local";

  const MAIN: ChatOption[] = [
    {
      label: tr("Quiero cotizar una mudanza", "I want a moving quote"),
      next: "svc",
      icon: "card-checklist",
    },
    { label: tr("Tengo una pregunta", "I have a question"), next: "faq", icon: "question-circle" },
    {
      label: tr("Soy una empresa o embajada", "I'm a company or embassy"),
      next: "corp",
      icon: "buildings",
    },
    { label: tr("Hablar con un asesor", "Talk to an advisor"), next: "human", icon: "headset" },
  ];
  const BACK: ChatOption = {
    label: tr("Volver al inicio", "Back to start"),
    next: "start",
    icon: "house",
  };

  const STEPS: Record<string, ChatStep> = {
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
          event: {
            name: "generate_lead",
            params: { method: "chat_whatsapp", service: d.servicio ?? "", lang },
          },
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
            ar: `اتصل على \u200E+57 ${CONTACT.phones[0]}`,
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

  return STEPS;
}

// Textos de la interfaz del chat (invitación, botón, ventana y campo de texto)
export const chatText = (tr: Tr) => ({
  closeTeaser: tr("Cerrar invitación", "Close invitation"),
  teaserHello: tr(`¡Hola! Soy ${NAME}.`, `Hi! I'm ${NAME}.`, {
    fr: `Bonjour ! Je suis ${NAME}.`,
    de: `Hallo! Ich bin ${NAME}.`,
    it: `Ciao! Sono ${NAME}.`,
    ar: `مرحبًا! أنا ${AR_NAME}.`,
  }),
  teaserText: tr(
    "¿Planeas una mudanza? Te ayudo a organizarla.",
    "Planning a move? I can help you organize it.",
  ),
  talkTo: tr(`Hablar con ${NAME}`, `Talk to ${NAME}`, {
    fr: `Parler à ${NAME}`,
    de: `Mit ${NAME} sprechen`,
    it: `Parla con ${NAME}`,
    ar: `تحدث مع ${AR_NAME}`,
  }),
  closeChat: tr("Cerrar chat", "Close chat"),
  openChat: tr(`Hablar con ${NAME}, asesor virtual`, `Talk to ${NAME}, virtual advisor`, {
    fr: `Parler à ${NAME}, conseiller virtuel`,
    de: `Mit ${NAME} sprechen, virtueller Berater`,
    it: `Parla con ${NAME}, consulente virtuale`,
    ar: `تحدث مع ${AR_NAME}، المستشار الافتراضي`,
  }),
  close: tr("Cerrar", "Close"),
  ai: tr("IA", "AI"),
  online: tr("En línea", "Online"),
  window: tr(`Chat con ${NAME}`, `Chat with ${NAME}`, {
    fr: `Discussion avec ${NAME}`,
    de: `Chat mit ${NAME}`,
    it: `Chat con ${NAME}`,
    ar: `محادثة مع ${AR_NAME}`,
  }),
  role: tr("Asesor virtual", "Virtual advisor"),
  status: tr("Transpack · Responde al instante", "Transpack · Answers instantly"),
  restart: tr("Reiniciar conversación", "Restart conversation"),
  placeholder: tr("Escribe tu mensaje…", "Type your message…"),
  message: tr("Mensaje", "Message"),
  send: tr("Enviar", "Send"),
});
