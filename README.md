# Transpack — sitio web

React 19 + TypeScript + Vite 8 + Tailwind CSS v4 + React Router 7. Íconos de Bootstrap Icons (`bi bi-*`).

## Comandos

```bash
pnpm install     # instalar dependencias
pnpm dev         # servidor de desarrollo → http://localhost:5173
pnpm build       # verificación de tipos + build de producción en dist/
pnpm preview     # ver el build de producción
pnpm format      # formatear con oxfmt
```

## Rutas

| Ruta               | Página                                            |
| ------------------ | ------------------------------------------------- |
| `/`                | Landing (incluye el cotizador en `#cotizar`)      |
| `/nosotros`        | Quiénes somos                                     |
| `/servicios/:slug` | Detalle de servicio (slugs en `src/data/site.ts`) |
| `/blog/:slug`      | Artículo (contenido en `src/data/blogData.ts`)    |

El cotizador acepta preselección por URL: `/?servicio=internacional&nivel=2#cotizar`
(`servicio`: local, nacional, internacional, empresarial, bodegaje · `nivel`: 1, 2, 3).

## Idiomas (es / en / fr / de / it / ar)

- Español en la raíz (`/`, `/nosotros`, `/servicios/...`); los demás idiomas con prefijo y URLs traducidas:
  `/en/about`, `/fr/a-propos`, `/de/ueber-uns`, `/it/chi-siamo`, `/ar/about`
  (servicios: `/fr/services/...`, `/de/leistungen/...`, `/it/servizi/...`). El árabe se muestra de derecha a izquierda.
- Rutas, slugs e información de cada idioma: `src/i18n/index.ts` (`SECTIONS`, `SLUGS`, `LANG_INFO`).
- Textos cortos de la interfaz: en cada componente, como `tr("texto en español", "English text")`.
  El francés, alemán, italiano y árabe se buscan por el texto en inglés en `src/i18n/dict/{fr,de,it,ar}.ts`.
- Contenido largo: `src/data/site.{en,fr,de,it,ar}.ts` y `src/data/blogData.{en,fr,de,it,ar}.ts`.
  **Si cambias un texto en español, actualiza también sus traducciones.**
- La franja superior (`src/components/LangBar.tsx`) tiene una opción por idioma, nombrada por región:
  Latinoamérica y España (Español), International (English), France et Canada (Français),
  Deutschland (Deutsch), Italia (Italiano), الشرق الأوسط (العربية). Las regiones están en `REGIONS`.

## Dónde editar

- **Textos, servicios, contacto, cifras:** `src/data/site.ts`
- **Blog:** `src/data/blogData.ts`
- **Colores y tipografías de marca:** bloque `@theme` en `src/index.css`
  (azul `#272b7c`, naranja `#ff7619`, beige, violeta, gris; IBM Plex Sans + Montserrat, según el Manual de Marca)
- **Imágenes:** `src/imports/`
- **Mapamundi del hero:** los países resaltados y sus capitales están en la lista `DEST` de
  `scripts/generate-world-map.mjs` (código ISO numérico + coordenadas). Después de editarla,
  ejecutar `pnpm map` para regenerar `src/data/worldMap.ts` (datos reales de Natural Earth).

## Publicación

Es una SPA: el hosting debe redirigir todas las rutas a `index.html`
(en Netlify/Vercel/Cloudflare Pages es la opción "SPA fallback" o un rewrite `/* → /index.html`).
