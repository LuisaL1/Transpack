// Eventos del chat con un asesor (Zoho SalesIQ). Van aparte de src/lib/crmChat.ts
// para que el código de Zoho se descargue aparte (con import()) y el resto del
// sitio pueda escucharlos sin cargarlo.

/** Evento con { open: boolean } cuando la ventana de Zoho se muestra o se cierra */
export const CRM_CHAT_EVENT = "tp:crm-chat";
/** El visitante inició una conversación en Zoho (para la analítica: generate_lead) */
export const CHAT_LEAD_EVENT = "tp:chat-lead";
