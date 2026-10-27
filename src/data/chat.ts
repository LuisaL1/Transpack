// Chat del sitio: textos del botón flotante, la invitación y la ventana de
// respaldo (si Zoho SalesIQ no carga). La conversación la atiende el widget de
// Zoho (src/lib/crmChat.ts); la lógica está en src/hooks/useAdvisorChat.ts.
import type { Tr } from "@/i18n";

/** Nombre y cara del chat (también es el bot de Zoho) */
export const NAME = "Joel";
// En árabe el nombre se escribe en su alfabeto
const AR_NAME = "جويل";

/** Acción de un mensaje de la ventana de respaldo: un enlace con ícono */
export type ChatAction = { label: string; icon: string; href: string };
/** Mensaje de la ventana de respaldo */
export type ChatMsg = { text: string; actions?: ChatAction[] };

// Textos de la interfaz del chat (invitación, botón y ventana de respaldo)
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
  // Ventana de respaldo: Zoho SalesIQ no cargó
  crmError: tr(
    "No pudimos abrir el chat con un asesor en este momento. Escríbenos por otro canal:",
    "We couldn't open the advisor chat right now. Reach us another way:",
  ),
  crmWhatsapp: tr("Escribir por WhatsApp", "Message on WhatsApp"),
  crmForm: tr("Dejar un mensaje", "Leave a message"),
});
