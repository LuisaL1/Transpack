// Lógica del chat de Joel: estado de la conversación, mensajes con indicador
// de "escribiendo", invitación una vez por sesión, apertura desde otras partes
// del sitio (evento "tp:open-chat") y, en español, el cerebro de Joel: entiende
// texto libre, saluda según el comportamiento del visitante y aprende.
// Chat con un asesor: si /api/advisor está configurado, el visitante habla con
// el asesor aquí mismo (Zoho SalesIQ por detrás); si no, se abre la ventana de
// Zoho (src/lib/crmChat.ts). Ver docs/chat-crm.md.
import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildChat,
  chatText,
  teamQuoteMessage,
  type ChatData,
  type ChatMsg,
  type ChatOption,
  type ChatStep,
} from "@/data/chat";
import { joelKnowledge } from "@/data/joelKnowledge";
import { makeTr, useLang } from "@/i18n";
import { routeChat } from "@/lib/chatRoute";
import { createJoel, newMemory, QUOTE_TOPIC, track, type JoelReply } from "@/lib/joel";
import { trackEvent } from "@/lib/analytics";
import { ADVISOR_EVENT, CRM_CHAT_EVENT, QUOTE_EVENT, requestAdvisorChat } from "@/lib/advisorEvents";
import { contactHref } from "@/data/contact";
import { siteFor } from "@/data/content";
import {
  advisorAvailable,
  loadSaved,
  pollAdvisor,
  POLL_MS,
  save,
  sendToAdvisor,
  startAdvisor,
  WAIT_MS,
} from "@/lib/advisorChat";

// El cerebro se crea al usarse por primera vez (solo en español).
let joelBrain: ReturnType<typeof createJoel> | null = null;
const getJoel = () => (joelBrain ??= createJoel(joelKnowledge()));

// Pasos que inician una cotización en el chat
const QUOTE_STEPS = new Set(["origen", "int_info", "bod_que", "empresa"]);
// Opciones que, al elegirse después de algo que Joel no entendió, le enseñan
// a qué se refería el visitante.
const LEARN_DEST: Record<string, string> = {
  svc: "intent:cotizar",
  human: "intent:contacto",
  corp: "service:empresas",
};

export function useAdvisorChat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [stepId, setStepId] = useState("start");
  const [data, setData] = useState<ChatData>({});
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState("");
  const [teaser, setTeaser] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timers = useRef<number[]>([]);
  const { lang } = useLang();
  const STEPS = useMemo(() => buildChat(lang), [lang]);
  const brain = lang === "es";
  const mem = useRef(newMemory());
  // Paso "dinámico": la respuesta que arma el cerebro de Joel a un texto libre
  const dyn = useRef<ChatStep | null>(null);

  const step = stepId === "dyn" && dyn.current ? dyn.current : STEPS[stepId];

  const toStep = (r: JoelReply): ChatStep => ({
    say: () => r.say,
    actions: r.actions ? () => r.actions! : undefined,
    options: r.options,
  });

  // Pasa un texto libre por el cerebro de Joel y muestra su respuesta
  const think = (value: string, d: ChatData) => {
    const r = getJoel().respond(value, mem.current);
    track("chat", r.intent);
    // Pidió hablar con un asesor: se le pasa de una vez
    if (r.handoff) {
      trackEvent("chat_message", { intent: r.intent, lang });
      requestAdvisorChat();
      return;
    }
    if (r.service) track("chat", `svc-${r.service}`);
    trackEvent("chat_message", { intent: r.intent, service: r.service, lang });
    dyn.current = toStep(r);
    goTo("dyn", d);
  };

  // Muestra los mensajes de un paso uno a uno, con indicador de "escribiendo"
  const goTo = (id: string, d: ChatData) => {
    // "Hablar con un asesor": se conecta de una vez, sin más explicaciones
    if (id === "human") {
      setData(d);
      requestAdvisorChat();
      return;
    }
    // Cotización nueva: su resumen se podrá enviar a un asesor
    if (id === "reset" || QUOTE_STEPS.has(id)) quoteSent.current = "";
    let target = id === "reset" ? "start" : id;
    const nextData = id === "reset" ? {} : d;
    if (id === "reset") {
      setMsgs([]);
      mem.current = newMemory();
    }
    // En español, el saludo se arma según lo que el visitante ha hecho en el sitio
    if (target === "start" && brain) {
      dyn.current = toStep(getJoel().greeting());
      target = "dyn";
    }
    setData(nextData);
    setStepId(target);
    const s = target === "dyn" && dyn.current ? dyn.current : STEPS[target];
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
    mem.current = newMemory();
    if (open) goTo("start", {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  // ─── Chat con un asesor ────────────────────────────────────────────────
  // advisor: ventana de Zoho ("loading"/"open") cuando no hay chat integrado.
  // live: chat con el asesor dentro de Joel:
  //   "ask" (Joel pide la pregunta) → "connecting" (esperando asesor) → "live".
  //   Por la API (/api/advisor) si está configurada; si no, por el puente con
  //   el widget de Zoho escondido (src/lib/zohoBridge.ts).
  const [advisor, setAdvisor] = useState<"idle" | "loading" | "open">("idle");
  const [live, setLive] = useState<"off" | "ask" | "connecting" | "live">("off");
  const pass = useRef<{ token: string; after: number } | null>(null);
  const mode = useRef<"api" | "bridge">("api");
  const bridge = useRef<import("@/lib/zohoBridge").Bridge | null>(null);
  // Respuestas sugeridas por el bot o el asesor de Zoho (modo puente)
  const [liveOptions, setLiveOptions] = useState<string[]>([]);
  // Mensajes escritos mientras el puente se conecta (se envían al estar listo)
  const pending = useRef<string[] | null>(null);
  const t = useMemo(() => chatText(makeTr(lang)), [lang]);
  const otherChannels = () => [
    { label: t.crmWhatsapp, icon: "whatsapp", href: siteFor(lang).waLink() },
    { label: t.crmForm, icon: "envelope", href: contactHref() },
  ];
  const say = (text: string, actions?: ChatMsg["actions"]) =>
    setMsgs((m) => [...m, { from: "bot", text, actions }]);

  // Ventana de Zoho (cuando el chat integrado no está configurado)
  const openZohoWindow = () => {
    setAdvisor("loading");
    // El código de Zoho se descarga solo ahora (archivo aparte)
    import("@/lib/crmChat")
      .then((m) => m.openCrmChat())
      .catch(() => {
        setAdvisor("idle");
        say(t.crmError, otherChannels());
      });
  };

  useEffect(() => {
    const onRequest = () => {
      trackEvent("contact_click", { method: "advisor_chat" });
      void advisorAvailable().then((ok) => {
        mode.current = ok ? "api" : "bridge";
        setLive("ask");
        say(t.advisorAsk);
      });
    };
    const onChange = (e: Event) => {
      const isOpen = (e as CustomEvent<{ open: boolean }>).detail.open;
      setAdvisor(isOpen ? "open" : "idle");
      if (isOpen) setOpen(false);
      // Puente: al cerrar la ventana de Zoho, vuelve a esconderse y la
      // conversación sigue en Joel
      else if (bridge.current) {
        bridge.current.hideWindow();
        setOpen(true);
      }
    };
    window.addEventListener(ADVISOR_EVENT, onRequest);
    window.addEventListener(CRM_CHAT_EVENT, onChange);
    return () => {
      window.removeEventListener(ADVISOR_EVENT, onRequest);
      window.removeEventListener(CRM_CHAT_EVENT, onChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  // Conversación en curso tras recargar o cambiar de página
  useEffect(() => {
    const s = loadSaved();
    if (!s) return;
    pass.current = s;
    setLive("live");
    say(t.advisorResume);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const endAdvisor = (text = t.advisorBack) => {
    followUp.current = false;
    pass.current = null;
    pending.current = null;
    save(null);
    bridge.current?.stop();
    bridge.current = null;
    setLiveOptions([]);
    setLive("off");
    dyn.current = {
      say: () => [text],
      options: [{ label: t.backToStart, next: "start", icon: "house" }],
    };
    goTo("dyn", data);
  };

  // Respuestas del asesor: se preguntan cada pocos segundos mientras dura el chat
  useEffect(() => {
    if (live !== "connecting" && live !== "live") return;
    let stop = false;
    const tick = async () => {
      const p = pass.current;
      if (!p || stop) return;
      const r = await pollAdvisor(p.token, p.after);
      if (stop) return;
      if (!r.ok) {
        if (r.error === "token") endAdvisor(t.advisorEnded);
        return;
      }
      for (const m of r.messages ?? []) {
        p.after = Math.max(p.after, m.seq);
        if (m.from === "system" && m.text === "joined") {
          setLive("live");
          say(t.advisorJoined(m.name));
        } else if (m.from === "system" && m.text === "ended") {
          endAdvisor(t.advisorEnded);
          return;
        } else if (m.from !== "system") {
          setLive("live");
          setMsgs((list) => [
            ...list,
            { from: "agent", text: m.text, name: m.name || t.advisorLabel },
          ]);
        }
      }
      save(p);
    };
    const id = window.setInterval(tick, POLL_MS);
    void tick();
    return () => {
      stop = true;
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live]);

  // Si nadie responde a tiempo, Joel ofrece otros canales (una vez)
  useEffect(() => {
    // En el seguimiento de una cotización el asesor contacta al cliente después
    if (live !== "connecting" || followUp.current) return;
    const id = window.setTimeout(() => say(t.advisorBusy, otherChannels()), WAIT_MS);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live]);

  // Mensaje del visitante en el chat con el asesor
  // Puente: abre la conversación en el Zoho escondido y pasa sus mensajes a Joel
  // quiet: para la cotización enviada al equipo (sin el mensaje de "ya le avisé"
  // ni la ventana de Zoho de respaldo si falla). Devuelve si se conectó.
  const startViaBridge = async (question: string, quiet = false): Promise<boolean> => {
    pending.current = [];
    setLive("connecting");
    try {
      const { startBridge } = await import("@/lib/zohoBridge");
      bridge.current = await startBridge(question, {
        onMessage: (m) => {
          setLive("live");
          setMsgs((list) => [
            ...list,
            { from: "agent", text: m.text, name: m.name || t.advisorLabel },
          ]);
          setLiveOptions(m.options);
        },
        onSendFailed: () => say(t.advisorSendError),
        onForm: ({ canSkip }) => {
          say(t.advisorForm);
          setLiveOptions(canSkip ? [t.advisorFormFill, t.advisorFormSkip] : [t.advisorFormFill]);
        },
      });
      if (!quiet) {
        trackEvent("generate_lead", { method: "advisor_chat", lang });
        say(t.advisorConnecting);
      }
      for (const text of pending.current ?? []) bridge.current.send(text);
      pending.current = null;
      return true;
    } catch {
      pending.current = null;
      setLive("off");
      // Si el puente no funciona, la ventana de Zoho de siempre
      if (!quiet) openZohoWindow();
      return false;
    }
  };

  // ─── Cotización terminada → chat de los asesores para seguimiento ────────
  // Con "Enviar a un asesor" (resumen), Joel envía la cotización (con nombre y
  // celular) a Zoho SalesIQ marcada como "NUEVA COTIZACIÓN para seguimiento", y
  // se queda escuchando por si el asesor responde mientras el cliente sigue aquí.
  const quoteSent = useRef("");
  const followUp = useRef(false);
  const sendQuoteToTeam = async (d: ChatData) => {
    const message = teamQuoteMessage(d, lang);
    const busy = !!bridge.current || !!pass.current;
    const viaApi = busy ? mode.current === "api" : await advisorAvailable();
    if (!busy) mode.current = viaApi ? "api" : "bridge";
    followUp.current = true;
    let ok = false;
    // Ya hay una conversación con un asesor abierta: la cotización va por ahí
    if (bridge.current) ok = bridge.current.send(message);
    else if (pass.current) ok = (await sendToAdvisor(pass.current.token, message)).ok;
    else if (viaApi) {
      const r = await startAdvisor(message, d.nombre);
      if (r.ok && r.token) {
        pass.current = { token: r.token, after: 0 };
        save(pass.current);
        setLive("connecting");
        ok = true;
      }
    } else ok = await startViaBridge(message, true);
    if (ok) {
      trackEvent("generate_lead", { method: "chat_advisor", service: d.servicio ?? "", lang });
      say(t.quoteSent(d.telefono ?? ""));
    } else {
      followUp.current = false;
      say(t.quoteSendFail);
    }
    return ok;
  };
  // Botón "Enviar a un asesor" del resumen: una vez por cotización (se puede
  // volver a enviar si falló o si se hace otra cotización, aunque sea igual)
  const dataRef = useRef(data);
  dataRef.current = data;
  useEffect(() => {
    const onQuote = () => {
      if (quoteSent.current) return;
      quoteSent.current = "sending";
      setMsgs((m) => [...m, { from: "user", text: t.sendToAdvisor }]);
      void sendQuoteToTeam(dataRef.current).then((ok) => {
        quoteSent.current = ok ? "sent" : "";
      });
    };
    window.addEventListener(QUOTE_EVENT, onQuote);
    return () => window.removeEventListener(QUOTE_EVENT, onQuote);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const sendLive = async (value: string) => {
    // Puente conectándose: lo que se escriba queda en cola, en orden
    if (mode.current === "bridge" && pending.current) return void pending.current.push(value);
    if (live === "ask" && mode.current === "bridge") return startViaBridge(value);
    if (mode.current === "bridge") {
      setLiveOptions([]);
      if (!bridge.current?.send(value)) say(t.advisorSendError);
      return;
    }
    if (live === "ask") {
      const r = await startAdvisor(value, data.nombre);
      if (!r.ok || !r.token) {
        setLive("off");
        say(t.crmError, otherChannels());
        return;
      }
      pass.current = { token: r.token, after: 0 };
      save(pass.current);
      trackEvent("generate_lead", { method: "advisor_chat", lang });
      setLive("connecting");
      say(t.advisorConnecting);
      return;
    }
    const p = pass.current;
    if (!p) return;
    const r = await sendToAdvisor(p.token, value);
    if (!r.ok) say(t.advisorSendError);
  };

  // Otros elementos del sitio (por ejemplo el menú) pueden abrir el chat
  useEffect(() => {
    const openChat = () => setOpen(true);
    window.addEventListener("tp:open-chat", openChat);
    return () => window.removeEventListener("tp:open-chat", openChat);
  }, []);

  // Saludo al abrir por primera vez
  useEffect(() => {
    if (open && msgs.length === 0 && !typing) goTo("start", {});
    if (open) {
      setTeaser(false);
      trackEvent("chat_open", { lang });
    }
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
    if (open && (step.input || live !== "off") && !typing) inputRef.current?.focus();
  }, [open, step, typing, live]);

  const choose = (o: ChatOption) => {
    // Respuesta sugerida por Zoho (modo puente)
    if (live !== "off" && o.next === "live") {
      setMsgs((m) => [...m, { from: "user", text: o.label }]);
      setLiveOptions([]);
      if (o.label === t.advisorFormFill) bridge.current?.showWindow();
      else if (o.label === t.advisorFormSkip) {
        if (!bridge.current?.skip()) bridge.current?.showWindow();
      } else if (!bridge.current?.choose(o.label)) say(t.advisorSendError);
      return;
    }
    const d = { ...data, ...o.set };
    setMsgs((m) => [...m, { from: "user", text: o.label }]);
    const next = typeof o.next === "function" ? o.next(d) : o.next;
    if (brain) {
      // Aprende de la elección si venía de algo que no entendió
      const svc = o.set?.servicio as keyof typeof QUOTE_TOPIC | undefined;
      const dest = svc && QUOTE_TOPIC[svc] ? `service:${QUOTE_TOPIC[svc]}` : LEARN_DEST[next];
      if (dest) getJoel().learn(mem.current, dest);
      if (next.startsWith("brain:")) {
        think(next.slice(6), d);
        return;
      }
    }
    if (QUOTE_STEPS.has(next) && d.servicio) track("quote", d.servicio);
    goTo(next, d);
  };

  const send = () => {
    const value = text.trim();
    if (!value || typing) return;
    setText("");
    setMsgs((m) => [...m, { from: "user", text: value }]);
    if (live !== "off") {
      void sendLive(value);
      return;
    }
    if (step.input) {
      const d = { ...data, [step.input.key]: value };
      goTo(step.input.next(d), d);
    } else if (brain) {
      think(value, data);
    } else {
      const r = routeChat(value);
      trackEvent("chat_message", { intent: `step-${r.next}`, lang });
      goTo(r.next, { ...data, ...r.set });
    }
  };

  // Durante el chat con un asesor no se muestran las opciones de Joel, solo las
  // respuestas sugeridas por Zoho
  const options: ChatOption[] =
    live !== "off"
      ? liveOptions.map((label) => ({ label, next: "live", icon: "chat-dots" }))
      : typeof step.options === "function"
        ? step.options(data)
        : (step.options ?? []);

  return {
    open,
    setOpen,
    advisor,
    live,
    endAdvisor: () => endAdvisor(),
    teaser,
    setTeaser,
    msgs,
    typing,
    text,
    setText,
    step,
    options,
    choose,
    send,
    restart: () => goTo("reset", {}),
    endRef,
    inputRef,
  };
}
