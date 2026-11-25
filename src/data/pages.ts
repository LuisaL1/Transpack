// Textos de las páginas internas: detalle de servicio, artículo del blog y
// página no encontrada (404).
import type { Tr } from "@/i18n";

export const serviceDetailText = (tr: Tr) => ({
  cotizar: tr("Cotizar", "Get a quote"),
  ruta: tr("Ruta", "Breadcrumb"),
  inicio: tr("Inicio", "Home"),
  servicios: tr("Servicios", "Services"),
  escribenos: tr("WhatsApp", "WhatsApp"),
  servicio: tr("El servicio", "The service"),
  comoHacemos: tr("¿Cómo lo hacemos?", "How do we do it?"),
  incluye: tr("Qué incluye", "What's included"),
  compromiso: tr("Nuestro compromiso:", "Our commitment:"),
  pasoPaso: tr("Paso a paso", "Step by step"),
  asiSeraProceso: tr("Así será su proceso", "What your process looks like"),
  // Carrusel de fotos que reemplaza los pasos (Embalaje especializado)
  nuestroTrabajo: tr("Nuestro trabajo", "Our work"),
  asiProtegemos: tr("Así protegemos sus piezas de valor", "How we protect your valuables"),
  preguntasFrecuentes: tr("Preguntas frecuentes", "Frequently asked questions"),
  antesCotizar: tr("Antes de cotizar", "Before you get a quote"),
  siTienesOtraDuda: tr(
    "Si tiene otra duda, escríbanos y un asesor le responde.",
    "If you have another question, message us and an advisor will answer.",
  ),
  otrosServicios: tr("Otros servicios", "Other services"),
  // Mapa animado de Mudanzas nacionales (ColombiaRoutesMap)
  mapaRutas: tr(
    "Mapa de Colombia con las carreteras entre las principales ciudades y un camión de Transpack viajando de una a otra",
    "Map of Colombia with the roads between its main cities and a Transpack truck travelling from one to another",
  ),
  // Avisos del mapa: al salir hacia un destino nuevo y al llegar
  mapaProximo: (city: string) => tr(`Próximo destino: ${city}`, `Next stop: ${city}`),
  // Chapa del panel del mapa en el encabezado (ServiceMapPanel): qué muestra.
  // 20 localidades (src/data/bogotaMap.ts) y 14 ciudades (src/data/colombiaMap.ts);
  // los países salen de STATS
  mapChipBogota: tr("Bogotá · 20 localidades", "Bogotá · 20 localities"),
  mapChipColombia: tr("Colombia · 14 ciudades", "Colombia · 14 cities"),
  mapChipMundo: (n: number) => tr(`Desde Bogotá · ${n}+ países`, `From Bogotá · ${n}+ countries`),
  mapLegendColombia: tr("Recorrido del camión", "Truck route"),
  mapaLlegamos: (city: string) => tr(`¡Llegamos a ${city}!`, `We made it to ${city}!`),
  complementaTraslado: tr("Complementa su traslado", "Complete your move"),
  verServicio: tr("Ver servicio", "View service"),
  quoteService: (title: string) =>
    tr(`Cotizar ${title.toLowerCase()}`, `Get a ${title.toLowerCase()} quote`),
  whatsappAbout: (title: string) =>
    tr(
      `Hola Transpack, quiero información sobre: ${title}`,
      `Hello Transpack, I would like information about: ${title}`,
    ),
});

export const articleText = (tr: Tr) => ({
  volverBlog: tr("Volver al blog", "Back to the blog"),
  minLectura: tr("min de lectura", "min read"),
  planeasMudanza: tr("¿Planeas una mudanza?", "Planning a move?"),
  asesorTeAcompanaDesde: tr(
    "Un asesor te acompaña desde el primer paso.",
    "An advisor will guide you from the very first step.",
  ),
  sigueLeyendo: tr("Sigue leyendo", "Keep reading"),
  leerArticulo: tr("Leer artículo", "Read article"),
});

export const notFoundText = (tr: Tr) => ({
  eyebrow: "Error 404",
  title: tr("Esta página tomó otra ruta", "This page took another route"),
  text: tr(
    "No encontramos lo que buscabas. Te llevamos de vuelta al inicio.",
    "We couldn't find what you were looking for. Let us take you back home.",
  ),
  cta: tr("Ir al inicio", "Go to home"),
  quote: tr("Cotice su mudanza", "Get a moving quote"),
  services: tr("Servicios", "Services"),
});

// Franja naranja de llamado a la acción (al final de varias páginas)
export const ctaBandText = (tr: Tr) => ({
  title: tr("¿Listo para su próximo destino?", "Ready for your next destination?"),
  text: tr(
    "Un asesor especializado diseñará con usted el plan de su mudanza.",
    "A specialized advisor will design your moving plan with you.",
  ),
  cta: tr("Cotizar ahora", "Get a quote"),
  // Marquesina gigante con contorno arriba de la franja (decorativa)
  marquee: tr("Cotice su mudanza", "Get your moving quote"),
});

// Política de tratamiento de datos (/privacidad). El texto legal está en
// PRIVACY (src/data/site.ts y sus traducciones).
export const privacyText = (tr: Tr) => ({
  eyebrow: tr("Protección de datos", "Data protection"),
  ruta: tr("Ruta", "Breadcrumb"),
  inicio: tr("Inicio", "Home"),
  enEstaPagina: tr("En esta página", "On this page"),
  dudas: tr("¿Preguntas sobre sus datos?", "Questions about your data?"),
  escribenos: tr(
    "Escríbenos y te ayudamos a ejercer sus derechos.",
    "Write to us and we will help you exercise your rights.",
  ),
  abrirFormulario: tr("Abrir el formulario de contacto", "Open the contact form"),
  // Datos del responsable
  razonSocial: tr("Razón social", "Company name"),
  nit: "NIT",
  direccion: tr("Dirección", "Address"),
  correo: tr("Correo", "Email"),
  telefonos: tr("Teléfonos", "Phone numbers"),
  cambiarCookies: tr(
    "Puedes cambiar su decisión cuando quieras.",
    "You can change your choice at any time.",
  ),
  cambiarCookiesBtn: tr("Cambiar mi decisión sobre cookies", "Change my cookie choice"),
});

/** Nombre corto del enlace a la política (pie, cotizador, chat y aviso de cookies) */
export const privacyLink = (tr: Tr) => tr("Política de datos", "Privacy policy");

// Etiqueta de envío sobre la foto del encabezado de cada servicio (ShippingPhoto,
// nov. 2026). DATOS DE MUESTRA, no son de un cliente real (la etiqueta es
// decorativa y los lectores de pantalla no la leen); van con el tipo de servicio.
// Filas: [rótulo, valor, ocupa las dos columnas]
type LabelRow = [string, string, boolean?];
export const shippingLabelText = (tr: Tr, slug: string) => {
  const from = tr("Remitente", "From");
  const to = tr("Destino", "To");
  const weight = tr("Peso", "Weight");
  const date = tr("Fecha", "Date");
  const day = tr("24 NOV 2026", "NOV 24 2026");
  const fragile = tr("Frágil", "Fragile");
  const guideTitle = tr("Guía de envío", "Shipping label");
  const labels: Record<
    string,
    { title: string; icon: string; rows: LabelRow[]; guide: string; stamp: string }
  > = {
    "mudanzas-locales": {
      title: guideTitle,
      icon: "house-door",
      rows: [
        [from, "Familia Rodríguez · Usaquén", true],
        [to, "Cra. 11 #93-27 · Chapinero", true],
        [weight, "840 kg"],
        [date, day],
      ],
      guide: "TP-BOG-0458",
      stamp: fragile,
    },
    "mudanzas-nacionales": {
      title: guideTitle,
      icon: "truck",
      rows: [
        [from, "Bogotá D.C.", true],
        [to, "Medellín, Antioquia", true],
        [weight, "1.320 kg"],
        [date, day],
      ],
      guide: "TP-NAL-2231",
      stamp: fragile,
    },
    "mudanzas-internacionales": {
      title: tr("Envío internacional", "International shipment"),
      icon: "globe-americas",
      rows: [
        [from, "Bogotá, Colombia (BOG)", true],
        [to, tr("Madrid, España (MAD)", "Madrid, Spain (MAD)"), true],
        [tr("Vía", "Via"), tr("Marítima · 20'", "Sea · 20'")],
        [weight, "2.450 kg"],
      ],
      guide: "TP-INT-7342",
      stamp: fragile,
    },
    bodegaje: {
      title: tr("Orden de bodegaje", "Storage tag"),
      icon: "boxes",
      rows: [
        [tr("Cliente", "Client"), "Familia Gómez · Chicó", true],
        [tr("Ubicación", "Location"), tr("Bodega Bogotá · B-14", "Bogotá warehouse · B-14"), true],
        [tr("Volumen", "Volume"), "18 m³"],
        [tr("Ingreso", "In"), day],
      ],
      guide: "TP-BDG-1140",
      stamp: tr("Almacenado", "Stored"),
    },
    "embalaje-especializado": {
      title: tr("Embalaje especial", "Special packing"),
      icon: "easel",
      rows: [
        [tr("Pieza", "Item"), tr("Óleo sobre lienzo", "Oil on canvas"), true],
        [tr("Embalaje", "Packing"), tr("Guacal de madera a medida", "Custom wooden crate"), true],
        [tr("Medidas", "Size"), "120 × 90 cm"],
        [weight, "38 kg"],
      ],
      guide: "TP-EMB-0612",
      stamp: tr("Este lado arriba", "This side up"),
    },
    "gestion-aduanera": {
      title: tr("Documento aduanero", "Customs document"),
      icon: "file-earmark-text",
      rows: [
        [tr("Trámite", "Procedure"), tr("Exportación de menaje", "Household goods export"), true],
        [tr("Ruta", "Route"), tr("Bogotá → Miami, EE. UU.", "Bogotá → Miami, USA"), true],
        [weight, "1.200 kg"],
        [date, day],
      ],
      guide: "TP-ADU-3087",
      stamp: tr("Revisado", "Checked"),
    },
    "movilidad-corporativa": {
      title: tr("Traslado de oficina", "Office move"),
      icon: "buildings",
      rows: [
        [from, tr("Sede actual · Piso 12", "Current office · Floor 12"), true],
        [to, tr("Nueva sede · Calle 100", "New office · Calle 100"), true],
        [tr("Puestos", "Desks"), "45"],
        [date, day],
      ],
      guide: "TP-CORP-0915",
      stamp: tr("Prioritario", "Priority"),
    },
    diplomatico: {
      title: tr("Envío diplomático", "Diplomatic shipment"),
      icon: "flag",
      rows: [
        [from, tr("Misión diplomática · Bogotá", "Diplomatic mission · Bogotá"), true],
        [to, tr("París, Francia (CDG)", "Paris, France (CDG)"), true],
        [tr("Tipo", "Type"), tr("Menaje", "Household")],
        [weight, "1.800 kg"],
      ],
      guide: "TP-DIP-0507",
      stamp: tr("Diplomático", "Diplomatic"),
    },
  };
  return labels[slug] ?? labels["mudanzas-locales"];
};
