// Genera src/data/countryPhotos.ts con una foto de cada destino del mapa de la
// portada (pnpm fotos): la foto principal de su capital en Wikidata (P18),
// servida desde Wikimedia Commons; y de cada ciudad del recorrido por Colombia
// (CITIES), la del municipio más poblado junto a su punto en el mapa; y de cada
// localidad de Bogotá (src/data/bogotaMap.ts), la de su elemento en Wikidata. NO descarga imágenes: guarda solo el enlace a
// la miniatura, el autor y la licencia (se muestran al tocar el país en el mapa).
// También genera RecursosTranspack/fotos-paises.html, una hoja con todas las
// fotos para que el cliente las apruebe. Necesita internet.
import { readFile, writeFile } from "node:fs/promises";

const out = process.argv[2] ?? "src/data/countryPhotos.ts";
const sheet = process.argv[3] ?? "RecursosTranspack/fotos-paises.html";
// Wikimedia pide identificarse en las consultas automáticas
const HEADERS = { "user-agent": "TranspackSite/1.0 (https://transpacksas.com) pnpm-fotos" };

// Si la foto de un país o de una ciudad de Colombia no gusta, ponga aquí otro archivo de Wikimedia Commons
// (el nombre tal como aparece en commons.wikimedia.org/wiki/File:…)
const OVERRIDES = {
  // La capital de Nicaragua en Wikidata no tiene foto ni artículo en Wikipedia
  Nicaragua: "Кафедральный собор в Манагуа (cropped).jpg",
};

// Destinos del mapa: código ISO numérico, nombre y coordenadas de la capital
// (los mismos de scripts/generate-world-map.mjs, leídos de ahí)
const source = await readFile(new URL("./generate-world-map.mjs", import.meta.url), "utf8");
const DEST = [
  ...source.matchAll(/id: "(\d{3})", name: "([^"]+)", lonlat: \[(-?[\d.]+), (-?[\d.]+)\]/g),
]
  .map(([, id, name, lon, lat]) => ({ id, name, lon: +lon, lat: +lat }))
  .filter((d) => d.id !== "170"); // sin Colombia (el origen)
if (DEST.length < 40) throw new Error(`Solo se leyeron ${DEST.length} destinos`);
// Ciudades del recorrido por Colombia (CITIES del mismo archivo)
const CITIES = [
  ...source.matchAll(/\{ name: "([^"]+)", lonlat: \[(-?[\d.]+), (-?[\d.]+)\], side/g),
].map(([, name, lon, lat]) => ({ name, lon: +lon, lat: +lat }));
if (CITIES.length < 10) throw new Error(`Solo se leyeron ${CITIES.length} ciudades`);
// Localidades de Bogotá (generadas con pnpm map:bogota)
const LOCALITIES = [
  ...(await readFile(new URL("../src/data/bogotaMap.ts", import.meta.url), "utf8")).matchAll(
    /"name":"([^"]+)"/g,
  ),
].map(([, name]) => name);
if (LOCALITIES.length !== 20) throw new Error(`Se esperaban 20 localidades: ${LOCALITIES.length}`);

async function json(url, init) {
  const res = await fetch(url, { ...init, headers: { ...HEADERS, ...init?.headers } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}
const sparql = (query) =>
  json("https://query.wikidata.org/sparql", {
    method: "POST",
    headers: {
      accept: "application/sparql-results+json",
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ query }),
  });
const fileOf = (image) =>
  decodeURIComponent(image.value.split("/Special:FilePath/")[1]).replace(/_/g, " ");

// 1. Wikidata: país (código ISO, P299) → capital (P36), con su foto (P18),
// coordenadas (P625), nombre en español e inglés y artículo en Wikipedia
const query = `
SELECT ?iso ?capital ?es ?en ?coord ?image ?wiki WHERE {
  VALUES ?iso { ${DEST.map((d) => `"${d.id}"`).join(" ")} }
  ?country wdt:P299 ?iso; wdt:P36 ?capital.
  OPTIONAL { ?capital wdt:P18 ?image }
  OPTIONAL { ?capital wdt:P625 ?coord }
  OPTIONAL { ?wiki schema:about ?capital; schema:isPartOf <https://en.wikipedia.org/> }
  OPTIONAL { ?capital rdfs:label ?es FILTER(LANG(?es) = "es") }
  OPTIONAL { ?capital rdfs:label ?en FILTER(LANG(?en) = "en") }
}`;
const wd = await sparql(query);

// Algunos países tienen varias capitales (Sudáfrica, Bolivia…): se queda la más
// cercana al punto del mapa
const dist = (d, lon, lat) => (d.lon - lon) ** 2 + (d.lat - lat) ** 2;
const best = new Map();
for (const r of wd.results.bindings) {
  const d = DEST.find((x) => x.id === r.iso.value);
  const [lon, lat] = (r.coord?.value.match(/-?[\d.]+/g) ?? [d.lon, d.lat]).map(Number);
  const prev = best.get(d.name);
  const row = {
    d: dist(d, lon, lat),
    capital: r.capital.value,
    es: r.es?.value ?? r.en?.value,
    en: r.en?.value ?? r.es?.value,
    file: r.image && fileOf(r.image),
    wiki: r.wiki && decodeURIComponent(r.wiki.value.split("/wiki/")[1]),
  };
  // Entre varias fotos de la misma capital, la primera
  if (!prev || row.d < prev.d - 1e-9) best.set(d.name, row);
}

// Capitales sin foto en Wikidata: la foto principal (libre) de su artículo en
// Wikipedia
const noPhoto = [...best.values()].filter((r) => !r.file && r.wiki);
if (noPhoto.length) {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    formatversion: "2",
    prop: "pageimages",
    piprop: "name",
    pilicense: "free",
    titles: noPhoto.map((r) => r.wiki).join("|"),
  });
  const data = await json(`https://en.wikipedia.org/w/api.php?${params}`);
  const norm = new Map((data.query.normalized ?? []).map((n) => [n.to, n.from]));
  for (const p of data.query.pages) {
    const r = noPhoto.find((x) => x.wiki === (norm.get(p.title) ?? p.title));
    if (r && p.pageimage) r.file = p.pageimage.replace(/_/g, " ");
  }
}

// Ciudades de Colombia: el municipio con foto más poblado a menos de 12 km del
// punto del mapa (así no hace falta saber su código en Wikidata)
const cityFile = new Map();
for (const c of CITIES) {
  const r = await sparql(`
SELECT ?image WHERE {
  SERVICE wikibase:around {
    ?item wdt:P625 ?loc.
    bd:serviceParam wikibase:center "Point(${c.lon} ${c.lat})"^^geo:wktLiteral; wikibase:radius "12".
  }
  ?item wdt:P17 wd:Q739; wdt:P1082 ?pop; wdt:P18 ?image.
} ORDER BY DESC(?pop) LIMIT 1`);
  const image = r.results.bindings[0]?.image;
  if (image) cityFile.set(c.name, fileOf(image));
}

// Localidades: el elemento de Wikidata con su nombre dentro de Bogotá (Q2841),
// preferido el que es una localidad (Q3257686). Si dos comparten foto, la
// segunda usa la de su artículo en Wikipedia (en español).
const loc = await sparql(`
SELECT ?name ?image ?wiki ?isLoc WHERE {
  VALUES ?name { ${LOCALITIES.map((n) => `"${n}"@es`).join(" ")} }
  ?item rdfs:label ?name; wdt:P131 wd:Q2841.
  OPTIONAL { ?item wdt:P18 ?image }
  OPTIONAL { ?wiki schema:about ?item; schema:isPartOf <https://es.wikipedia.org/> }
  BIND(EXISTS { ?item wdt:P31 wd:Q3257686 } AS ?isLoc)
}`);
const locRow = new Map();
for (const r of loc.results.bindings) {
  const name = r.name.value;
  const row = {
    loc: r.isLoc.value === "true",
    file: r.image && fileOf(r.image),
    wiki: r.wiki && decodeURIComponent(r.wiki.value.split("/wiki/")[1]),
  };
  const prev = locRow.get(name);
  if (!prev || (row.loc && !prev.loc) || (row.loc === prev.loc && !prev.file && row.file))
    locRow.set(name, row);
}
const used = new Set();
const needWiki = [];
for (const name of LOCALITIES) {
  const r = locRow.get(name);
  if (!r) continue;
  if (!r.file || used.has(r.file)) {
    r.file = undefined;
    if (r.wiki) needWiki.push(r);
  } else used.add(r.file);
}
if (needWiki.length) {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    formatversion: "2",
    prop: "pageimages",
    piprop: "name",
    pilicense: "free",
    titles: needWiki.map((r) => r.wiki).join("|"),
  });
  const data = await json(`https://es.wikipedia.org/w/api.php?${params}`);
  const norm = new Map((data.query.normalized ?? []).map((n) => [n.to, n.from]));
  for (const p of data.query.pages) {
    const r = needWiki.find((x) => x.wiki === (norm.get(p.title) ?? p.title));
    const file = p.pageimage?.replace(/_/g, " ");
    if (!r || !file || used.has(file)) continue;
    r.file = file;
    used.add(file);
  }
}

// 2. Commons: miniatura de 500 px, autor y licencia (de 50 en 50)
const files = [
  ...DEST.map((d) => OVERRIDES[d.name] ?? best.get(d.name)?.file),
  ...CITIES.map((c) => OVERRIDES[c.name] ?? cityFile.get(c.name)),
  ...LOCALITIES.map((n) => OVERRIDES[n] ?? locRow.get(n)?.file),
].filter(Boolean);
const info = new Map();
for (let i = 0; i < files.length; i += 50) {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    formatversion: "2",
    prop: "imageinfo",
    iiprop: "url|extmetadata",
    iiurlwidth: "500",
    titles: files
      .slice(i, i + 50)
      .map((f) => `File:${f}`)
      .join("|"),
  });
  const data = await json(`https://commons.wikimedia.org/w/api.php?${params}`);
  const norm = new Map((data.query.normalized ?? []).map((n) => [n.to, n.from]));
  for (const p of data.query.pages) {
    const ii = p.imageinfo?.[0];
    if (!ii) continue;
    const m = ii.extmetadata ?? {};
    const text = (v) =>
      (v?.value ?? "")
        .replace(/<[^>]+>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#0?39;/g, "'")
        .replace(/\s+/g, " ")
        .trim();
    info.set((norm.get(p.title) ?? p.title).replace(/^File:/, ""), {
      // Sin los parámetros de seguimiento que agrega Commons
      src: ii.thumburl.split("?")[0],
      width: ii.thumbwidth,
      height: ii.thumbheight,
      page: ii.descriptionurl,
      author: text(m.Artist).slice(0, 80) || "Wikimedia Commons",
      license: text(m.LicenseShortName) || "Wikimedia Commons",
    });
  }
}

const photos = {};
const missing = [];
for (const d of DEST) {
  const row = best.get(d.name);
  const file = OVERRIDES[d.name] ?? row?.file;
  const img = file && info.get(file);
  if (!row || !img || !/^https:\/\/(upload|thumb)\.wikimedia\.org\//.test(img.src)) {
    missing.push(d.name);
    continue;
  }
  photos[d.name] = { capital: { es: row.es, en: row.en }, ...img };
}
const cityPhotos = {};
for (const c of CITIES) {
  const img = info.get(OVERRIDES[c.name] ?? cityFile.get(c.name));
  if (img && /^https:\/\/(upload|thumb)\.wikimedia\.org\//.test(img.src)) cityPhotos[c.name] = img;
  else missing.push(c.name);
}
const localityPhotos = {};
for (const n of LOCALITIES) {
  const img = info.get(OVERRIDES[n] ?? locRow.get(n)?.file);
  if (img && /^https:\/\/(upload|thumb)\.wikimedia\.org\//.test(img.src)) localityPhotos[n] = img;
  else missing.push(n);
}
if (missing.length) console.warn(`Sin foto: ${missing.join(", ")}`);

await writeFile(
  out,
  `// Foto de la capital de cada destino del mapa de la portada (se muestra al
// tocar el país). GENERADO con \`pnpm fotos\` (scripts/fetch-country-photos.mjs):
// no editar a mano. Las imágenes NO están en el proyecto: se cargan desde
// Wikimedia Commons (thumb.wikimedia.org, o upload.wikimedia.org si ya es
// pequeña), con su autor y licencia.

export type PlacePhoto = {
  src: string;
  width: number;
  height: number;
  /** Página del archivo en Wikimedia Commons */
  page: string;
  author: string;
  license: string;
};
export type CountryPhoto = PlacePhoto & { capital: { es: string; en: string } };

/** Por nombre del destino (el de DESTINATIONS en worldMap.ts) */
export const COUNTRY_PHOTOS: Record<string, CountryPhoto> = ${JSON.stringify(photos, null, 2)};

/** Ciudades del recorrido por Colombia, por nombre (el de CITIES en worldMap.ts) */
export const CITY_PHOTOS: Record<string, PlacePhoto> = ${JSON.stringify(cityPhotos, null, 2)};

/** Localidades de Bogotá, por nombre (el de LOCALITIES en bogotaMap.ts) */
export const LOCALITY_PHOTOS: Record<string, PlacePhoto> = ${JSON.stringify(localityPhotos, null, 2)};
`,
);

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const grid = (rows) =>
  rows
    .map(
      ([name, sub, p]) =>
        `<figure><img src="${esc(p.src)}" alt="" loading="lazy"><figcaption><b>${esc(name)}</b>${sub ? ` · ${esc(sub)}` : ""}<br><small>${esc(p.author)} · ${esc(p.license)}</small></figcaption></figure>`,
    )
    .join("\n");
await writeFile(
  sheet,
  `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>Fotos del mapa de la portada</title>
<style>body{font-family:system-ui,sans-serif;margin:24px;color:#3e4160}
main{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px}
figure{margin:0}img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:8px}
figcaption{font-size:13px;margin-top:6px}small{color:#6b6e8a}</style></head>
<body><h1>Fotos del mapa de la portada</h1>
<p>Se muestran al tocar cada localidad, ciudad o país en el mapa. Para cambiar una, indique el lugar y
el archivo de Wikimedia Commons que prefiere (OVERRIDES en scripts/fetch-country-photos.mjs).</p>
<h2>Localidades de Bogotá</h2>
<main>${grid(Object.entries(localityPhotos).map(([name, p]) => [name, "", p]))}</main>
<h2>Colombia</h2>
<main>${grid(Object.entries(cityPhotos).map(([name, p]) => [name, "", p]))}</main>
<h2>Países</h2>
<main>${grid(Object.entries(photos).map(([name, p]) => [name, p.capital.es, p]))}</main></body></html>
`,
);
console.log(
  `${Object.keys(photos).length} países, ${Object.keys(cityPhotos).length} ciudades y ${Object.keys(localityPhotos).length} localidades → ${out} y ${sheet}`,
);
