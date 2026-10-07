import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cookieText } from "@/data/consent";
import { useLang } from "@/i18n";
import {
  analyticsEnabled,
  CONSENT_RESET_EVENT,
  getConsent,
  initAnalytics,
  setConsent,
  trackEvent,
  trackPageView,
} from "@/lib/analytics";
import { btn } from "@/components/ui";

// ─── Seguimiento de Google Analytics ───────────────────────────────────────
// Página vista en cada cambio de ruta y clics en teléfono y WhatsApp en
// todo el sitio. No dibuja nada. Va después de SeoHead (el título ya es el de
// la página nueva cuando se envía page_view).
export function AnalyticsTracker() {
  const { pathname, search } = useLocation();
  useEffect(() => initAnalytics(), []);
  useEffect(() => trackPageView(pathname + search), [pathname, search]);
  useEffect(() => {
    if (!analyticsEnabled) return;
    const onClick = (e: MouseEvent) => {
      const href = (e.target as HTMLElement).closest("a")?.getAttribute("href") ?? "";
      // El correo va por el formulario: ContactModal registra method "form"
      if (href.startsWith("tel:")) trackEvent("contact_click", { method: "phone" });
      else if (href.startsWith("https://wa.me/"))
        trackEvent("contact_click", { method: "whatsapp" });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}

// ─── Aviso de cookies ──────────────────────────────────────────────────────
// Solo aparece si Google Analytics está configurado y el visitante aún no ha
// decidido. Mientras está visible, en celular se oculta el botón de Joel para
// que no lo tape (clase "consent-open" en el body, ver styles/index.css).
export function CookieBanner() {
  const { tr, lp } = useLang();
  const t = cookieText(tr);
  // Se decide en el navegador, después de montar (el HTML pre-generado no lo incluye).
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(analyticsEnabled && getConsent() === null);
    // "Cambiar mi decisión sobre cookies" (resetConsent) vuelve a mostrar el aviso
    const onReset = () => setVisible(analyticsEnabled);
    window.addEventListener(CONSENT_RESET_EVENT, onReset);
    return () => window.removeEventListener(CONSENT_RESET_EVENT, onReset);
  }, []);
  useEffect(() => {
    document.body.classList.toggle("consent-open", visible);
    return () => document.body.classList.remove("consent-open");
  }, [visible]);
  if (!visible) return null;
  const decide = (v: "granted" | "denied") => {
    setConsent(v);
    setVisible(false);
  };
  return (
    <div
      role="dialog"
      aria-label={t.label}
      className="animate-fade-up fixed inset-x-4 bottom-4 z-[65] rounded-[22px] bg-white p-5 shadow-[var(--shadow-float)] ring-1 ring-azul/10 sm:end-auto sm:start-6 sm:max-w-md"
    >
      <p className="mb-1 font-title font-semibold text-tinta">{t.title}</p>
      <p className="mb-4 text-[0.85rem] leading-relaxed text-suave">
        {t.text}{" "}
        <Link
          to={lp("/privacidad")}
          className="font-medium text-azul underline underline-offset-2 hover:text-naranja"
        >
          {t.policy}
        </Link>
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => decide("granted")}
          className={`${btn.secondary} flex-1 px-4 py-2.5 text-[0.88rem]`}
        >
          {t.accept}
        </button>
        <button
          type="button"
          onClick={() => decide("denied")}
          className={`${btn.outline} flex-1 px-4 py-2.5 text-[0.88rem]`}
        >
          {t.reject}
        </button>
      </div>
    </div>
  );
}
