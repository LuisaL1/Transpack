// Datos de la empresa para SEO (metadatos y datos estructurados).
// Salen del contenido del sitio (CONTACT, SLOGAN y STATS en src/data/site.ts),
// que a su vez viene de los documentos del cliente. No agregar datos que no
// estén ahí (p. ej. horario de atención, precios o certificaciones).
import { CONTACT, SLOGAN } from "@/data/site";

/** Dominio canónico (sin barra final). Es el de CONTACT.web. */
export const SITE_URL = "https://www.transpacksas.com";

/**
 * Indexación: mientras sea false, todas las páginas llevan noindex y robots.txt
 * bloquea a los buscadores. Se activa en Vercel con VITE_SITE_INDEXABLE=true el
 * día en que www.transpacksas.com apunte a este sitio (ver docs/seo.md).
 */
export const INDEXABLE = import.meta.env.VITE_SITE_INDEXABLE === "true";

/** Código de verificación de Google Search Console (opcional; método "etiqueta HTML"). */
export const GOOGLE_VERIFICATION = (import.meta.env.VITE_GOOGLE_SITE_VERIFICATION ?? "").trim();

// "Cra. 40 #20A – 96, Bogotá, Colombia" → calle y ciudad
const [street, city] = CONTACT.address.split(",").map((s) => s.trim());

export const BRAND = {
  name: "Transpack",
  legalName: "Transpack S.A.S.",
  slogan: SLOGAN,
  foundingDate: "1968",
  email: CONTACT.email,
  phones: CONTACT.phones.map((p) => `+57 ${p}`),
  address: {
    streetAddress: street,
    addressLocality: city,
    addressRegion: "Bogotá D.C.",
    addressCountry: "CO",
  },
  sameAs: CONTACT.socials.map((s) => s.href),
  logo: "/brand/logo.png",
  ogImage: "/brand/og-image.jpg",
};

/** Ruta del sitio → URL absoluta. */
export const abs = (path: string) =>
  /^https?:\/\//.test(path) ? path : SITE_URL + (path.startsWith("/") ? path : "/" + path);
