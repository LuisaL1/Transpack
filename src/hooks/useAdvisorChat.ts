// Lógica del chat del sitio. El botón flotante (y cualquier "tp:open-chat" del
// sitio) abre el widget de Zoho SalesIQ ya dentro de una conversación
// (src/lib/crmChat.ts); el bot saluda solo si la conversación está vacía. Si
// Zoho no carga, se muestra la ventana del sitio con otros canales (respaldo).
// Además: invitación una vez por sesión, precarga de Zoho si el visitante
// aceptó las cookies (o si el sitio no muestra el aviso) y la conversión
// (generate_lead) cuando el visitante inicia un chat. Ver docs/chat-crm.md.
import { useEffect, useMemo, useRef, useState } from "react";
import { chatText, type ChatMsg } from "@/data/chat";
import { makeTr, useLang } from "@/i18n";
import { analyticsEnabled, CONSENT_EVENT, getConsent, trackEvent } from "@/lib/analytics";
import { CHAT_LEAD_EVENT, CRM_CHAT_EVENT } from "@/lib/advisorEvents";
import { contactHref } from "@/data/contact";
import { siteFor } from "@/data/content";

export function useAdvisorChat() {
  // open: ventana del sitio (solo como respaldo si Zoho no carga)
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [teaser, setTeaser] = useState(false);
  // Ventana de Zoho: cargando (el botón muestra que espera) o a la vista
  const [advisor, setAdvisor] = useState<"idle" | "loading" | "open">("idle");
  const { lang } = useLang();
  const t = useMemo(() => chatText(makeTr(lang)), [lang]);
  // Si Zoho no cargó, la ventana del sitio se muestra con el aviso y no se
  // vuelve a intentar hasta cerrarla y abrirla de nuevo
  const widgetFailed = useRef(false);
  // La conversión se registra una vez por visita a la página
  const leadSent = useRef(false);
  // Si la persona ya abrió el chat, la invitación no vuelve a aparecer
  const used = useRef(false);

  const openZohoWindow = () => {
    trackEvent("contact_click", { method: "advisor_chat" });
    setAdvisor("loading");
    // El código de Zoho va aparte (archivo que se descarga con import())
    import("@/lib/crmChat")
      .then(async (m) => {
        // El bot saluda solo en una conversación vacía (no al reabrir)
        if (await m.openCrmChat()) m.triggerAdvisorStart();
      })
      .catch(() => {
        setAdvisor("idle");
        widgetFailed.current = true;
        setMsgs([
          {
            text: t.crmError,
            actions: [
              { label: t.crmWhatsapp, icon: "whatsapp", href: siteFor(lang).waLink() },
              { label: t.crmForm, icon: "envelope", href: contactHref() },
            ],
          },
        ]);
        setOpen(true);
      });
  };

  // Cierra la ventana de Zoho (la X del botón flotante)
  const closeAdvisorWindow = () => {
    void import("@/lib/crmChat").then((m) => m.closeCrmChat());
  };

  // Ventana de Zoho a la vista o cerrada; conversación iniciada (conversión)
  useEffect(() => {
    const onChange = (e: Event) => {
      const isOpen = (e as CustomEvent<{ open: boolean }>).detail.open;
      setAdvisor(isOpen ? "open" : "idle");
      if (isOpen) setOpen(false);
    };
    const onLead = () => {
      if (leadSent.current) return;
      leadSent.current = true;
      trackEvent("generate_lead", { method: "advisor_chat", lang });
    };
    window.addEventListener(CRM_CHAT_EVENT, onChange);
    window.addEventListener(CHAT_LEAD_EVENT, onLead);
    return () => {
      window.removeEventListener(CRM_CHAT_EVENT, onChange);
      window.removeEventListener(CHAT_LEAD_EVENT, onLead);
    };
  }, [lang]);

  // Precarga de Zoho cuando el navegador está libre, solo si el visitante aceptó
  // las cookies (también si las acepta después) o si el sitio no muestra el
  // aviso. Si rechaza o no responde, Zoho se carga al abrir el chat.
  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const ids: number[] = [];
    const preload = () => {
      const run = () => void import("@/lib/crmChat").then((m) => m.preloadCrmChat());
      ids.push(w.requestIdleCallback ? w.requestIdleCallback(run, { timeout: 3000 }) : window.setTimeout(run, 2000));
    };
    if (!analyticsEnabled || getConsent() === "granted") preload();
    const onConsent = (e: Event) => {
      if ((e as CustomEvent<string>).detail === "granted") preload();
    };
    window.addEventListener(CONSENT_EVENT, onConsent);
    return () => {
      window.removeEventListener(CONSENT_EVENT, onConsent);
      ids.forEach((id) => (w.cancelIdleCallback ? w.cancelIdleCallback(id) : clearTimeout(id)));
    };
  }, []);

  // El antiguo asesor virtual guardaba un perfil del visitante en el navegador:
  // ya no se usa, así que se borra
  useEffect(() => {
    try {
      localStorage.removeItem("tp-joel-profile");
      sessionStorage.removeItem("tp-joel-visit");
    } catch {
      /* sin almacenamiento disponible */
    }
  }, []);

  // Otros elementos del sitio (por ejemplo el menú) pueden abrir el chat
  useEffect(() => {
    const openChat = () => setOpen(true);
    window.addEventListener("tp:open-chat", openChat);
    return () => window.removeEventListener("tp:open-chat", openChat);
  }, []);

  // Al abrir: la ventana de Zoho reemplaza a la del sitio (salvo si no cargó)
  useEffect(() => {
    if (!open) {
      widgetFailed.current = false;
      return;
    }
    setTeaser(false);
    used.current = true;
    try {
      sessionStorage.setItem("tp-chat-teaser", "1");
    } catch {
      /* sin almacenamiento disponible */
    }
    if (widgetFailed.current) return;
    trackEvent("chat_open", { lang });
    setOpen(false);
    openZohoWindow();
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
      if (used.current) return;
      setTeaser(true);
      try {
        sessionStorage.setItem("tp-chat-teaser", "1");
      } catch {
        /* sin almacenamiento disponible */
      }
    }, 7000);
    return () => clearTimeout(id);
  }, []);

  return { open, setOpen, advisor, closeAdvisorWindow, teaser, setTeaser, msgs };
}
