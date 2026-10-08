// Eventos del chat con un asesor (Zoho SalesIQ). Van aparte de src/lib/crmChat.ts
// para que el código de Zoho (y su hoja de estilos) se descargue solo cuando
// alguien elige "Chatear con un asesor".

/** Evento con { open: boolean } cuando la ventana de Zoho se abre o se cierra */
export const CRM_CHAT_EVENT = "tp:crm-chat";
/** Pedido de abrir el chat con un asesor (botón en el chat de Joel; lo atiende useAdvisorChat) */
export const ADVISOR_EVENT = "tp:open-advisor";
export const requestAdvisorChat = () => window.dispatchEvent(new Event(ADVISOR_EVENT));
