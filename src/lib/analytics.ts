// ─── Google Analytics 4 ─────────────────────────────────────────────────────
// Se activa solo si existe la variable de entorno VITE_GA_MEASUREMENT_ID
// (formato G-XXXXXXXXXX). Sin ella, o si no es válida, el sitio funciona igual y
// no se carga nada.
//
// · Es una SPA: las páginas vistas se envían a mano en cada cambio de ruta
//   (send_page_view: false); si no, GA solo contaría la primera página.
// · Consent Mode v2: por defecto las cookies analíticas están DENEGADAS hasta
//   que el visitante acepta en el aviso de cookies (Ley 1581 de 2012). Mientras
//   tanto GA recibe solo señales sin cookies. Nunca se usan para publicidad.
// · Eventos: ver la tabla en docs/conversion-y-analitica.md.

type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

const RAW_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID ?? "").trim();
// "G-XXXXXXXXXX" es el ejemplo de la documentación, no un ID real.
const isRealId = (id: string) => /^G-[A-Z0-9]+$/i.test(id) && !/^G-X+$/i.test(id);
export const GA_ID = isRealId(RAW_ID) ? RAW_ID.toUpperCase() : "";
export const analyticsEnabled = GA_ID !== "";

const CONSENT_KEY = "tp-analytics-consent";
export type Consent = "granted" | "denied" | null;

export function getConsent(): Consent {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

let started = false;
function gtag(...args: unknown[]) {
  if (!analyticsEnabled || typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  // gtag necesita recibir el objeto "arguments", no un arreglo.
  window.gtag =
    window.gtag ||
    function () {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
  window.gtag(...args);
}

/** Carga GA una sola vez (llamar al iniciar la app). */
export function initAnalytics() {
  if (!analyticsEnabled || started || typeof document === "undefined") return;
  started = true;
  gtag("consent", "default", {
    analytics_storage: getConsent() === "granted" ? "granted" : "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    wait_for_update: 500,
  });
  gtag("js", new Date());
  gtag("config", GA_ID, { send_page_view: false });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
}

/** Guarda la decisión del aviso de cookies y la comunica a GA. */
export function setConsent(value: "granted" | "denied") {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* sin almacenamiento */
  }
  gtag("consent", "update", { analytics_storage: value });
}

/** Evento que escucha el aviso de cookies para volver a mostrarse. */
export const CONSENT_RESET_EVENT = "tp:consent-reset";

/** Borra la decisión sobre cookies y vuelve a mostrar el aviso
 *  (botón "Cambiar mi decisión sobre cookies" de la política de datos). */
export function resetConsent() {
  try {
    localStorage.removeItem(CONSENT_KEY);
  } catch {
    /* sin almacenamiento */
  }
  gtag("consent", "update", { analytics_storage: "denied" });
  window.dispatchEvent(new Event(CONSENT_RESET_EVENT));
}

/** Página vista (se llama en cada cambio de ruta). */
export function trackPageView(path: string) {
  if (!analyticsEnabled) return;
  gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

/** Evento personalizado. Nombres en snake_case (convención de GA4). */
export function trackEvent(
  name: string,
  params: Record<string, string | number | boolean | undefined> = {},
) {
  if (!analyticsEnabled) return;
  gtag("event", name, params);
}
