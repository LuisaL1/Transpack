import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { DESTINATION_NAMES, postsFor, siteFor } from "@/data/content";
import { menusFor } from "@/data/navigation";
import { serviceOptions } from "@/data/quote";
import { DESTINATIONS } from "@/data/worldMap";
import { LANGS, localize, makeTr, toSpanish, type Lang } from "@/i18n";
import fr from "@/i18n/dict/fr";
import de from "@/i18n/dict/de";
import itDict from "@/i18n/dict/it";
import ar from "@/i18n/dict/ar";

// Integridad del contenido (src/data), traducciones y reglas de negocio y de
// diseño de AGENTS.md.
const files = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? files(p) : [p];
  });
const SRC = files("src").filter((f) => /\.(tsx?|css)$/.test(f));
const read = (f: string) => readFileSync(f, "utf8");
const ALL = SRC.map((f) => [f, read(f)] as const);
// Contenido en español (lo que afirma la empresa)
const es = siteFor("es");
const OTHERS = LANGS.filter((l) => l !== "es") as Exclude<Lang, "es">[];

describe("Servicios", () => {
  const slugs = es.SERVICES.map((s) => s.slug);
  it("tienen slugs únicos", () => expect(new Set(slugs).size).toBe(slugs.length));

  it("cada servicio tiene página en cada idioma (URL traducida que vuelve al español)", () => {
    for (const s of slugs)
      for (const l of OTHERS) {
        const url = localize(`/servicios/${s}`, l);
        expect(url.startsWith(`/${l}/`), `${s} en ${l}: ${url}`).toBe(true);
        expect(toSpanish(url)).toBe(`/servicios/${s}`);
      }
  });

  it("cada servicio y segmento lleva a un tipo de cotización que existe", () => {
    const quoteTypes = serviceOptions(makeTr("es")).map((o) => o.value);
    for (const s of es.SERVICES) expect(quoteTypes, s.slug).toContain(s.quote);
    for (const s of es.SEGMENTS) expect(quoteTypes, s.id).toContain(s.quote);
  });

  it("el menú apunta a servicios y segmentos que existen", () => {
    for (const m of menusFor("es"))
      for (const i of m.items) {
        const svc = i.to?.match(/^\/servicios\/([\w-]+)/)?.[1];
        if (svc) expect(slugs, `${m.key}: ${i.label}`).toContain(svc);
        const seg = i.to?.match(/segmento=([\w-]+)/)?.[1];
        if (seg) expect(es.SEGMENTS.map((s) => s.id)).toContain(seg);
      }
  });
});

describe("Traducciones", () => {
  it("la política de datos tiene las mismas secciones en cada idioma y la versión en español es la oficial", () => {
    for (const l of OTHERS) {
      const p = siteFor(l).PRIVACY;
      expect(
        p.sections.map((s) => s.id),
        l,
      ).toEqual(es.PRIVACY.sections.map((s) => s.id));
      p.sections.forEach((s, i) => {
        expect(s.text?.length ?? 0, `${l} ${s.id}`).toBe(es.PRIVACY.sections[i].text?.length ?? 0);
        expect(s.items?.length ?? 0, `${l} ${s.id}`).toBe(
          es.PRIVACY.sections[i].items?.length ?? 0,
        );
        expect(s.after?.length ?? 0, `${l} ${s.id}`).toBe(es.PRIVACY.sections[i].after?.length ?? 0);
        expect(s.table?.rows.length ?? 0, `${l} ${s.id}`).toBe(
          es.PRIVACY.sections[i].table?.rows.length ?? 0,
        );
      });
      expect(p.notice, l).not.toBe("");
      // Mismo correo de contacto que el resto del sitio (la dirección y los
      // teléfonos los muestra la página desde CONTACT)
      expect(JSON.stringify(p), l).toContain(es.CONTACT.email);
    }
  });

  it("la política de datos cubre todos los canales del sitio y no inventa el NIT", () => {
    const table = es.PRIVACY.sections.find((s) => s.id === "datos")!.table!;
    const where = table.rows.map((r) => r[0]).join(" ");
    for (const c of [
      "Formulario de contacto",
      "Cotizador",
      "Joel",
      "Chat con un asesor (Zoho SalesIQ)",
      "WhatsApp",
      "Analítica",
    ])
      expect(where).toContain(c);
    const all = JSON.stringify(es.PRIVACY);
    for (const k of ["Brevo", "Zoho", "Meta", "navegador", "Superintendencia", "10 días hábiles", "15 días hábiles"])
      expect(all).toContain(k);
    // El NIT no está en los documentos del cliente: queda vacío hasta que lo entreguen
    expect(es.CONTACT.nit).toMatch(/^(\d{3}\.?\d{3}\.?\d{3}-\d)?$/);
  });

  it("cada idioma tiene los mismos servicios, segmentos, niveles, pasos y preguntas", () => {
    for (const l of OTHERS) {
      const s = siteFor(l);
      expect(
        s.SERVICES.map((x) => x.slug),
        l,
      ).toEqual(es.SERVICES.map((x) => x.slug));
      expect(
        s.SEGMENTS.map((x) => x.id),
        l,
      ).toEqual(es.SEGMENTS.map((x) => x.id));
      expect(s.LEVELS.length, l).toBe(es.LEVELS.length);
      expect(s.PROCESS.length, l).toBe(es.PROCESS.length);
      expect(s.FAQS.length, l).toBe(es.FAQS.length);
      expect(
        s.STATS.map((x) => x.value),
        l,
      ).toEqual(es.STATS.map((x) => x.value));
    }
  });

  it("cada idioma tiene los mismos artículos del blog", () => {
    const slugs = postsFor("es").map((p) => p.slug);
    for (const l of OTHERS)
      expect(
        postsFor(l).map((p) => p.slug),
        l,
      ).toEqual(slugs);
  });

  it("la galería tiene las mismas fotos, en el mismo orden, con pie de foto en cada idioma", () => {
    for (const l of OTHERS) {
      const g = siteFor(l).GALLERY;
      expect(
        g.map((x) => [x.src, !!x.tall]),
        l,
      ).toEqual(es.GALLERY.map((x) => [x.src, !!x.tall]));
      for (const x of g) expect(x.caption.trim().length, l).toBeGreaterThan(3);
    }
  });

  it("el mosaico de la galería no deja huecos (celdas múltiplo de 4)", () => {
    const cells = es.GALLERY.reduce((n, x) => n + (x.tall ? 2 : 1), 0);
    expect(cells % 4).toBe(0);
  });

  it("cada destino del mapa tiene su nombre en todos los idiomas", () => {
    for (const d of DESTINATIONS)
      for (const l of OTHERS)
        expect(DESTINATION_NAMES[d.name]?.[l], `${d.name} en ${l}`).toBeTruthy();
  });

  // Textos cortos tr("es", "en"): el francés, alemán, italiano y árabe se buscan
  // por el texto en inglés en src/i18n/dict. Pendientes conocidos (ver TESTING.md):
  const PENDING = new Set(["Choose region and language", "Region and language"]);
  it("todos los textos cortos están traducidos (salvo los pendientes conocidos)", () => {
    const CALL = /\btr\(\s*"(?:[^"\\]|\\.)*"\s*,\s*("(?:[^"\\]|\\.)*")\s*(,\s*\{)?/g;
    const missing: string[] = [];
    for (const [f, s] of ALL.filter(([f]) => /\.tsx?$/.test(f) && !f.includes("dict"))) {
      const code = s.replace(/^\s*\/\/.*$/gm, "");
      for (const m of code.matchAll(CALL)) {
        if (m[2]) continue; // trae sus propias traducciones
        const en = JSON.parse(m[1]) as string;
        if (!en || PENDING.has(en)) continue;
        for (const [l, d] of Object.entries({ fr, de, it: itDict, ar }))
          if (!(en in d)) missing.push(`${l}: "${en}" (${f})`);
      }
    }
    expect(missing).toEqual([]);
  });
});

describe("Mapa y embajadas", () => {
  it("los países marcados como embajada son exactamente los de EMBASSIES", () => {
    expect(
      DESTINATIONS.filter((d) => d.embassy)
        .map((d) => d.name)
        .sort(),
    ).toEqual([...es.EMBASSIES].sort());
  });
});

describe("Reglas de contenido (lo que la empresa no puede afirmar)", () => {
  const content = ALL.filter(([f]) => f.includes("src/data") || f.includes("src/lib"));

  it("no publica precios ni tarifas", () => {
    for (const [f, s] of content)
      expect(s, f).not.toMatch(/\$\s?\d{2,}|\d[\d.,]{0,12}\s?(COP|USD|pesos|d[oó]lares)\b/);
  });

  it("solo afirma las certificaciones reales: LACMA, IAM y PAIMA", () => {
    for (const [f, s] of ALL) {
      // El cerebro de Joel las nombra solo para reconocer la pregunta
      const code = f.endsWith("lib/joel.ts") ? s.replace(/"(iso|fidi|9001)"/g, "") : s;
      expect(code, f).not.toMatch(/ISO\s?9001|\bFIDI\b|\bBASC\b|\bOEA\b/i);
    }
  });

  it("las cifras de la empresa coinciden con STATS (58 años, 176 países, 2.000 agentes)", () => {
    const stat = (re: RegExp) => es.STATS.find((s) => re.test(s.label))!.value;
    const years = stat(/años/);
    const countries = stat(/países/);
    for (const [f, s] of content) {
      for (const m of s.matchAll(/(\d+) años de (experiencia|trayectoria)/g))
        expect(Number(m[1]), f).toBe(years);
      for (const m of s.matchAll(/(\d+) países/g)) expect(Number(m[1]), f).toBe(countries);
      for (const m of s.matchAll(/([\d.]+)\+? agentes/g))
        expect(m[1].replace(".", ""), f).toBe(String(stat(/agentes/)));
    }
  });

  it("no quedan textos de relleno", () => {
    for (const [f, s] of ALL) {
      expect(s, f).not.toMatch(/lorem ipsum/i);
      expect(s, f).not.toMatch(/\b(TODO|FIXME|XXX)\b/);
    }
  });

  it("las preguntas frecuentes tienen pregunta y respuesta", () => {
    for (const l of LANGS)
      for (const f of siteFor(l).FAQS) {
        expect(f.q.trim().length, l).toBeGreaterThan(5);
        expect(f.a.length, l).toBeGreaterThan(20);
      }
  });
});

describe("Diseño", () => {
  const styles = ALL.filter(([f]) => /src\/(components|pages|styles)\//.test(f));

  // Paleta del Manual de Marca (bloque @theme de src/styles/index.css) y los
  // acentos funcionales ya usados. Para añadir un color, agréguelo aquí a
  // propósito (y en AGENTS.md).
  const ALLOWED = new Set([
    // Marca
    "#272B7C",
    "#FF7619",
    "#FAEED9",
    "#2F2959",
    "#F0F6F6",
    // Derivados de marca (@theme)
    "#1B1E5C",
    "#34399A",
    "#E8620A",
    "#1D2050",
    "#3E4160",
    "#6B6E8A",
    "#E1E5EE",
    "#0D0F33",
    "#FFB27A",
    "#FFA15C",
    "#FFF7F0",
    // Funcionales: WhatsApp, YouTube, punto "en línea"
    "#25D366",
    "#FF3D3D",
    "#22C55E",
    // Neutros
    "#FFFFFF",
    "#FFF",
    "#000",
  ]);
  it("solo se usan colores de la paleta", () => {
    for (const [f, s] of styles)
      for (const c of s.match(/#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g) ?? [])
        expect(ALLOWED.has(c.toUpperCase()), `${c} en ${f}`).toBe(true);
  });

  it("el chat de Joel no usa degradados (mismo estilo de los menús)", () => {
    for (const [f, s] of ALL.filter(([f]) => f.includes("components/chat/")))
      expect(s, f).not.toMatch(/gradient/);
  });
});
