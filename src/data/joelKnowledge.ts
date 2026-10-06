// Conocimiento que recibe el cerebro de Joel (src/lib/joel.ts): se arma con
// los mismos datos del sitio en español, para que haya una sola fuente de
// verdad (servicios, segmentos, niveles, preguntas frecuentes, contacto,
// cifras, embajadas, destinos del mapa, clientes y blog).
import { postsFor, siteFor } from "@/data/content";
import { CLIENT_LOGOS } from "@/data/clientLogos";
import { DESTINATIONS } from "@/data/worldMap";
import type { JoelKB } from "@/lib/joel";

export function joelKnowledge(): JoelKB {
  const es = siteFor("es");
  return {
    services: es.SERVICES,
    segments: es.SEGMENTS,
    levels: es.LEVELS,
    process: es.PROCESS,
    faqs: es.FAQS,
    contact: es.CONTACT,
    whatsapp: es.waLink,
    stats: es.STATS,
    embassies: es.EMBASSIES,
    destinations: DESTINATIONS.map((d) => d.name),
    clients: CLIENT_LOGOS.map((c) => c.name),
    posts: postsFor("es"),
  };
}
