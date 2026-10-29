# Cómo agregar (o cambiar) un servicio

Guía para el equipo de desarrollo y para el cliente. Cada servicio vive en **un
solo lugar** del código; a partir de ahí el sitio genera solo su página, sus
enlaces y su información para Google y para Joel.

## 1. Qué debe entregar Transpack

Antes de tocar el código, reunir (idealmente en un documento en `RecursosTranspack/`):

| Dato                                         | Ejemplo                                                                       | Dónde se ve                                      |
| -------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------ |
| Nombre                                       | "Mudanzas de oficina"                                                         | Tarjeta, menú, página, pie, buscador             |
| Descripción corta (1–2 líneas)               | "Traslado de puestos de trabajo, archivo y equipos sin detener tu operación." | Tarjeta del inicio, menú, selector de la portada |
| Frase destacada de la página                 | "Tu oficina en su nuevo lugar, lista para trabajar"                           | Portada de la página del servicio                |
| Introducción (un párrafo)                    | —                                                                             | Página del servicio                              |
| Qué incluye (4–6 puntos)                     | "Inventario por puesto", "Desarme y armado de mobiliario"…                    | Página del servicio y Joel                       |
| Cómo se hace (3–4 pasos, título + una línea) | "Visita técnica", "Plan por fases"…                                           | Página del servicio y Joel                       |
| Foto                                         | JPG horizontal, buena resolución                                              | Página del servicio                              |
| Textos en inglés                             | Los mismos datos traducidos                                                   | Versión `/en`                                    |

**Reglas de contenido** (`AGENTS.md`): no se publican precios, tiempos exactos,
pólizas ni certificaciones que la empresa no haya confirmado. Lenguaje claro y
trato de "tú".

## 2. Paso obligatorio: agregarlo a la lista de servicios

Archivo [`src/data/site.ts`](../src/data/site.ts), lista `SERVICES`. Copiar un
servicio existente y cambiar sus datos:

```ts
{
  slug: "mudanzas-de-oficina",       // dirección de la página: /servicios/mudanzas-de-oficina
  icon: "building",                  // ícono de https://icons.getbootstrap.com
  title: "Mudanzas de oficina",
  short: "Traslado de puestos de trabajo, archivo y equipos sin detener tu operación.",
  quote: "empresarial",              // a qué tipo de cotización lleva (ver paso 4)
  cta: "Cotizar",
  image: imgOficina,                 // foto importada arriba en el mismo archivo
  kicker: "Traslados corporativos",
  headline: "Tu oficina en su nuevo lugar, lista para trabajar",
  intro: "…",
  includes: ["…", "…"],
  steps: [
    { title: "…", text: "…" },
  ],
},
```

- **Foto:** guardarla en `src/assets/images/` (JPG de máximo 1200 px en el lado
  largo, idealmente menos de 200 KB) e importarla arriba del archivo:
  `import imgOficina from "@/assets/images/oficina.jpg";`. El original del
  cliente va en `RecursosTranspack/Imagenes/`.
- **Inglés:** agregar el mismo servicio, con el **mismo `slug`**, en
  [`src/data/site.en.ts`](../src/data/site.en.ts) con los textos traducidos.
- **Orden:** el orden de la lista es el orden en que aparece en el inicio, el
  menú y el pie de página.

### Con solo este paso, el servicio aparece automáticamente en

- la sección **Servicios** del inicio y su **página propia** (`/servicios/<slug>`);
- el **menú Servicios**, el **pie de página** y el **buscador**;
- el **SEO**: título y descripción de la página, mapa del sitio y datos para Google;
- el **conocimiento de Joel**: puede describirlo, decir qué incluye y cómo se hace.

## 3. Ajustes recomendados

| Qué                                   | Archivo                                                                                                                      | Para qué                                                                                      |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Dirección en inglés                   | `SLUGS` en [`src/i18n/index.ts`](../src/i18n/index.ts): `"mudanzas-de-oficina": { en: "office-moving", … }`                  | Que la página en inglés sea `/en/services/office-moving` (si no, usa la dirección en español) |
| Palabras con las que Joel lo reconoce | Lista de palabras clave por servicio en [`src/lib/joel.ts`](../src/lib/joel.ts) (busque `bodegaje: [` como ejemplo)          | Que entienda "quiero mover mi oficina" y no solo el nombre exacto                             |
| Conteo de servicios en las pruebas    | [`tests/unit/seo.test.ts`](../tests/unit/seo.test.ts): `toHaveLength(6)` → `7`                                               | La prueba de rutas cuenta los servicios publicados                                            |

## 4. La cotización

Cada servicio lleva a uno de los **cinco tipos de cotización** que ya existen
(`quote`): `local`, `nacional`, `internacional`, `empresarial` o `bodegaje`. Cada
tipo tiene sus propias preguntas en el cotizador y en el chat de Joel.

- **Si el servicio nuevo se cotiza con las mismas preguntas** que uno existente
  (lo más común), basta con elegir ese tipo en `quote`. No hay que tocar nada más.
- **Si necesita preguntas propias** (por ejemplo, número de puestos de trabajo),
  hay que crear un tipo nuevo. Eso implica cambiar el cotizador
  ([`src/data/quote.ts`](../src/data/quote.ts) y
  [`QuoteWizard.tsx`](../src/components/home/QuoteWizard.tsx)), el chat guiado
  ([`src/data/chat.ts`](../src/data/chat.ts)) y el cerebro de Joel
  ([`src/lib/joel.ts`](../src/lib/joel.ts)). Es un trabajo de desarrollo:
  pedirlo con las preguntas que se quieren hacer.

## 5. Verificar y publicar

```
pnpm dev          # revisar en http://localhost:5173: inicio, menú, página del servicio, /en
pnpm check        # tipos, reglas, pruebas, build y SEO: debe quedar en verde
git add -A
git commit -m "Nuevo servicio: Mudanzas de oficina"
git push origin main
```

Vercel publica el cambio en uno o dos minutos. Las pruebas avisan si algo quedó
incompleto: un enlace del menú a un servicio que no existe, un tipo de
cotización que no existe, textos en inglés faltantes o un título de página
fuera del largo recomendado para Google.

## Cambiar o quitar un servicio

- **Cambiar textos o foto:** editar el servicio en `site.ts` y `site.en.ts`. La
  página, el menú, Google y Joel se actualizan solos.
- **Cambiar el `slug` (la dirección):** la dirección anterior dejará de
  funcionar. Si ya se compartió o está indexada en Google, pedir una redirección
  en [`vercel.json`](../vercel.json) de la dirección vieja a la nueva.
- **Quitar un servicio:** borrarlo de `SERVICES` en ambos idiomas, ajustar el
  conteo de la prueba y revisar que ningún otro texto lo mencione (preguntas
  frecuentes, soluciones, blog). Pedir también una redirección de su dirección.
