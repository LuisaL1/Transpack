// Chat de Joel en inglés, francés, alemán, italiano y árabe: el texto libre se
// lleva a un paso del chat guiado por palabras clave (en los seis idiomas; el
// texto llega sin tildes ni diéresis). En español responde el cerebro de Joel
// (src/lib/joel.ts).
import { stripAccents } from "@/lib/text";

export function routeChat(text: string): { next: string; set?: Record<string, string> } {
  const t = stripAccents(text);
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
