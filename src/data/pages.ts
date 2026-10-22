// Textos de las páginas internas: detalle de servicio, artículo del blog y
// página no encontrada (404).
import type { Tr } from "@/i18n";

export const serviceDetailText = (tr: Tr) => ({
  cotizar: tr("Cotizar", "Get a quote"),
  ruta: tr("Ruta", "Breadcrumb"),
  inicio: tr("Inicio", "Home"),
  servicios: tr("Servicios", "Services"),
  escribenos: tr("Escríbenos", "Message us"),
  servicio: tr("El servicio", "The service"),
  comoHacemos: tr("¿Cómo lo hacemos?", "How do we do it?"),
  incluye: tr("Qué incluye", "What's included"),
  pasoPaso: tr("Paso a paso", "Step by step"),
  asiSeraProceso: tr("Así será tu proceso", "What your process looks like"),
  preguntasFrecuentes: tr("Preguntas frecuentes", "Frequently asked questions"),
  antesCotizar: tr("Antes de cotizar", "Before you get a quote"),
  siTienesOtraDuda: tr(
    "Si tienes otra duda, escríbenos y un asesor te responde.",
    "If you have another question, message us and an advisor will answer.",
  ),
  otrosServicios: tr("Otros servicios", "Other services"),
  complementaTraslado: tr("Complementa tu traslado", "Complete your move"),
  quoteService: (title: string) =>
    tr(`Cotizar ${title.toLowerCase()}`, `Get a ${title.toLowerCase()} quote`, {
      fr: "Demander un devis",
      de: "Angebot anfordern",
      it: "Richiedi un preventivo",
      ar: "اطلب عرض سعر",
    }),
  whatsappAbout: (title: string) =>
    tr(
      `Hola Transpack, quiero información sobre: ${title}`,
      `Hello Transpack, I would like information about: ${title}`,
      {
        fr: `Bonjour Transpack, je souhaite des informations sur : ${title}`,
        de: `Hallo Transpack, ich hätte gern Informationen zu: ${title}`,
        it: `Ciao Transpack, vorrei informazioni su: ${title}`,
        ar: `مرحبًا ترانسباك، أود الحصول على معلومات حول: ${title}`,
      },
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
  quote: tr("Cotiza tu mudanza", "Get a moving quote"),
  services: tr("Servicios", "Services"),
});

// Franja naranja de llamado a la acción (al final de varias páginas)
export const ctaBandText = (tr: Tr) => ({
  title: tr("¿Listo para tu próximo destino?", "Ready for your next destination?"),
  text: tr(
    "Un asesor especializado diseñará contigo el plan de tu mudanza.",
    "A specialized advisor will design your moving plan with you.",
  ),
  cta: tr("Cotizar ahora", "Get a quote"),
});

// Política de tratamiento de datos (/privacidad). El texto legal está en
// PRIVACY (src/data/site.ts y sus traducciones).
export const privacyText = (tr: Tr) => ({
  eyebrow: tr("Protección de datos", "Data protection"),
  ruta: tr("Ruta", "Breadcrumb"),
  inicio: tr("Inicio", "Home"),
  enEstaPagina: tr("En esta página", "On this page"),
  dudas: tr("¿Preguntas sobre tus datos?", "Questions about your data?"),
  escribenos: tr(
    "Escríbenos y te ayudamos a ejercer tus derechos.",
    "Write to us and we will help you exercise your rights.",
  ),
  abrirFormulario: tr("Abrir el formulario de contacto", "Open the contact form"),
  // Datos del responsable
  razonSocial: tr("Razón social", "Company name"),
  nit: "NIT",
  direccion: tr("Dirección", "Address"),
  correo: tr("Correo", "Email"),
  telefonos: tr("Teléfonos", "Phone numbers"),
  cambiarCookies: tr("Puedes cambiar tu decisión cuando quieras.", "You can change your choice at any time."),
  cambiarCookiesBtn: tr("Cambiar mi decisión sobre cookies", "Change my cookie choice"),
});

/** Nombre corto del enlace a la política (pie, cotizador, chat y aviso de cookies) */
export const privacyLink = (tr: Tr) => tr("Política de datos", "Privacy policy");
