// Chat de Joel en inglés: el texto libre se lleva a un paso del chat guiado
// por palabras clave (en español e inglés; el texto llega sin tildes). En
// español responde el cerebro de Joel (src/lib/joel.ts).
import { stripAccents } from "@/lib/text";

export function routeChat(text: string): { next: string; set?: Record<string, string> } {
  const t = stripAccents(text);
  if (
    /asesor|humano|persona|llamar|telefono|whatsapp|contact|advisor|human|agent|call|phone/.test(t)
  )
    return { next: "human" };
  if (
    /embajada|empresa|oficina|corporativ|funcionario|organismo|embassy|company|office|corporate|employee/.test(
      t,
    )
  )
    return { next: "corp" };
  if (/bodeg|guardar|almacen|storage|store|warehouse/.test(t))
    return { next: "bod_que", set: { servicio: "bodegaje" } };
  if (/tarda|demora|tiempo|cuanto dura|how long|take|time/.test(t))
    return { next: "faq_answer", set: { faq: "1" } };
  if (/maritim|aere|avion|barco|sea|air|ship|plane/.test(t))
    return { next: "faq_answer", set: { faq: "2" } };
  if (/anticipacion|cuando debo|con cuanto tiempo|advance|book/.test(t))
    return { next: "faq_answer", set: { faq: "0" } };
  if (/visita|survey|visit/.test(t)) return { next: "faq_answer", set: { faq: "3" } };
  if (/inventario|inventory/.test(t)) return { next: "faq_answer", set: { faq: "4" } };
  if (
    /internacional|exterior|otro pais|extranjero|canada|espana|spain|estados unidos|united states|usa|europa|europe|miami|international|abroad|overseas/.test(
      t,
    )
  )
    return { next: "int_info", set: { servicio: "internacional" } };
  if (
    /nacional|otra ciudad|medellin|cali|barranquilla|cartagena|bucaramanga|national|another city/.test(
      t,
    )
  )
    return { next: "origen", set: { servicio: "nacional" } };
  if (
    /precio|cuesta|valor|cotiz|tarifa|mudanza|trasteo|mudar|price|cost|quote|rate|move|moving/.test(
      t,
    )
  )
    return { next: "svc" };
  if (/servicio|service/.test(t)) return { next: "servicios" };
  if (/^(hola|buen|hey|saludos|hi|hello|good)/.test(t)) return { next: "menu" };
  return { next: "fallback" };
}
