// Entrada para la pre-generación de HTML en el build (scripts/prerender.mjs).
// No se usa en el navegador.
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { App } from "./App";

export { getPageMeta, renderHeadTags, PUBLIC_ROUTES } from "@/seo/meta";
export { INDEXABLE, SITE_URL } from "@/seo/site";
export { LANG_INFO } from "@/i18n";

export function render(url: string) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
}
