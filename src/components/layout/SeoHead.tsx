import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { LANG_INFO } from "@/i18n";
import { BRAND } from "@/seo/site";
import { getPageMeta, OG_LOCALE } from "@/seo/meta";

// Actualiza idioma, título, descripción, canónica, hreflang, Open Graph y
// JSON-LD al navegar dentro del sitio. En la primera carga el HTML ya viene con
// estas etiquetas (pre-generadas en el build); aquí se reemplazan por las de la
// nueva ruta. Se crean con createElement/textContent (sin innerHTML).
// Debe montarse antes de AnalyticsTracker para que page_view lleve el título correcto.
export function SeoHead() {
  const { pathname } = useLocation();
  useEffect(() => {
    const m = getPageMeta(pathname);
    const html = document.documentElement;
    html.lang = LANG_INFO[m.lang].locale;
    html.dir = LANG_INFO[m.lang].dir;
    document.head.querySelectorAll("[data-seo]").forEach((el) => el.remove());
    const add = <K extends keyof HTMLElementTagNameMap>(
      tag: K,
      attrs: Record<string, string>,
      text?: string,
    ) => {
      const el = document.createElement(tag);
      el.setAttribute("data-seo", "");
      for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
      if (text !== undefined) el.textContent = text;
      document.head.appendChild(el);
    };
    document.title = m.title;
    add("meta", { name: "description", content: m.description });
    add("meta", { name: "robots", content: m.robots });
    add("link", { rel: "canonical", href: m.canonical });
    m.alternates.forEach((a) =>
      add("link", { rel: "alternate", hreflang: a.hreflang, href: a.href }),
    );
    const og: [string, string][] = [
      ["og:site_name", BRAND.name],
      ["og:locale", OG_LOCALE[m.lang]],
      ["og:type", m.ogType],
      ["og:title", m.title],
      ["og:description", m.description],
      ["og:url", m.canonical],
      ["og:image", m.image],
      ["og:image:alt", m.imageAlt],
    ];
    og.forEach(([property, content]) => add("meta", { property, content }));
    const tw: [string, string][] = [
      ["twitter:card", "summary_large_image"],
      ["twitter:title", m.title],
      ["twitter:description", m.description],
      ["twitter:image", m.image],
    ];
    tw.forEach(([name, content]) => add("meta", { name, content }));
    m.jsonLd.forEach((o) => add("script", { type: "application/ld+json" }, JSON.stringify(o)));
  }, [pathname]);
  return null;
}
