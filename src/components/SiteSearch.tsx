// Buscador del sitio: servicios, soluciones, artículos, preguntas frecuentes y
// páginas. Busca sin tildes y exige que aparezcan todas las palabras escritas.
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postsFor, siteFor, DESTINATION_NAMES } from "@/data/content";
import { Bi } from "@/components/ui";
import { DESTINATIONS } from "@/data/worldMap";
import { localize, makeTr, useLang, type Lang } from "@/i18n";

type Entry = {
  kind: string;
  icon: string;
  title: string;
  desc: string;
  to: string;
  extra?: string;
};

// Índice de búsqueda en el idioma pedido (las rutas ya salen localizadas)
function buildIndex(lang: Lang): Entry[] {
  const { FAQS, SEGMENTS, SERVICES } = siteFor(lang);
  const posts = postsFor(lang);
  const tr = makeTr(lang);
  const lp = (path: string) => localize(path, lang);
  // Países y términos que deben llevar a la mudanza internacional (en ambos idiomas)
  const countries = `${DESTINATIONS.map((d) => `${d.name} ${Object.values(DESTINATION_NAMES[d.name] ?? {}).join(" ")}`).join(" ")} exterior extranjero otro pais emigrar abroad overseas relocate etranger expatriation ausland auswandern estero espatrio الخارج`;
  const page = (icon: string, title: string, desc: string, to: string, extra = "") => ({
    kind: tr("Página", "Page"),
    icon,
    title,
    desc,
    to: lp(to),
    extra,
  });
  return [
    ...SERVICES.map((s) => ({
      kind: tr("Servicio", "Service"),
      icon: s.icon,
      title: s.title,
      desc: s.short,
      to: lp(`/servicios/${s.slug}`),
      extra: `${s.kicker} ${s.intro} ${s.includes.join(" ")} ${s.quote === "internacional" ? countries : ""}`,
    })),
    ...SEGMENTS.map((s) => ({
      kind: tr("Solución", "Solution"),
      icon: s.icon,
      title: s.tab,
      desc: s.title,
      to: lp(`/?segmento=${s.id}#soluciones`),
      extra: `${s.kicker} ${s.text} ${s.points.join(" ")}`,
    })),
    ...posts.map((p) => ({
      kind: tr("Artículo", "Article"),
      icon: "journal-text",
      title: p.title,
      desc: p.excerpt,
      to: lp(`/blog/${p.slug}`),
      extra: p.cat,
    })),
    ...FAQS.map((f) => ({
      kind: tr("Pregunta", "Question"),
      icon: "question-circle",
      title: f.q,
      desc: f.a,
      to: lp("/#faq"),
    })),
    page(
      "ui-checks",
      tr("Cotiza tu mudanza", "Get a moving quote"),
      tr("Cotizador en 6 pasos, sin compromiso", "6-step quote form, no commitment"),
      "/#cotizar",
      "precio cotizacion presupuesto valor price quote cost estimate",
    ),
    page(
      "people",
      tr("Quiénes somos", "About us"),
      tr(
        "Historia, misión, visión y valores de Transpack desde 1968",
        "Transpack's history, mission, vision and values since 1968",
      ),
      "/nosotros",
      "empresa trayectoria company history",
    ),
    page(
      "award",
      tr("Certificaciones", "Certifications"),
      "LACMA · IAM · PAIMA",
      "/nosotros#certificaciones",
      "certificados calidad quality",
    ),
    page(
      "buildings",
      tr("Clientes y embajadas", "Clients and embassies"),
      tr(
        "Empresas y misiones diplomáticas que confían en Transpack",
        "Companies and diplomatic missions that trust Transpack",
      ),
      "/nosotros#clientes",
    ),
    page(
      "globe2",
      tr("Cobertura global", "Global coverage"),
      tr(
        "2.000+ agentes en 176 países, vía marítima o aérea",
        "2,000+ agents in 176 countries, by sea or air",
      ),
      "/#cobertura",
      "paises red agentes destinos countries network agents destinations",
    ),
    page(
      "layers",
      tr("Niveles de servicio", "Service levels"),
      tr("Básico, protección e integral", "Basic, protection and full service"),
      "/#niveles",
      "empaque proteccion integral packing",
    ),
    page(
      "play-btn",
      tr("Transpack en video", "Transpack on video"),
      tr("Shorts de nuestro canal de YouTube", "Shorts from our YouTube channel"),
      "/#videos",
      "youtube videos",
    ),
    page(
      "geo-alt",
      tr("Contacto", "Contact"),
      tr("Dirección, teléfonos, WhatsApp y correo", "Address, phone, WhatsApp and email"),
      "/#contacto",
      "telefono whatsapp correo direccion ubicacion mapa phone email address location map",
    ),
  ];
}

const norm = (t: string) =>
  t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

function search(index: Entry[], query: string): Entry[] {
  const words = norm(query)
    .split(/\s+/)
    .filter((w) => w.length > 1);
  if (!words.length) return [];
  return index
    .map((e) => {
      const title = norm(e.title);
      const all = norm(`${e.title} ${e.desc} ${e.kind} ${e.extra ?? ""}`);
      if (!words.every((w) => all.includes(w))) return null;
      const score =
        words.reduce((n, w) => n + (title.includes(w) ? 3 : 1), 0) +
        (title.startsWith(words[0]) ? 2 : 0);
      return { e, score };
    })
    .filter((r): r is { e: Entry; score: number } => r !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((r) => r.e);
}

export default function SiteSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lang, tr } = useLang();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const index = useMemo(() => buildIndex(lang), [lang]);
  const results = useMemo(() => search(index, q), [index, q]);
  const SUGGESTIONS: Record<Lang, string[]> = {
    es: [
      "Mudanza internacional",
      "Bodegaje",
      "Cuánto tarda",
      "Embajadas",
      "Obras de arte",
      "Canadá",
    ],
    en: ["International moving", "Storage", "How long", "Embassies", "Artwork", "Canada"],
    fr: [
      "Déménagement international",
      "Garde-meubles",
      "Combien de temps",
      "Ambassades",
      "Œuvres d'art",
      "Canada",
    ],
    de: [
      "Internationaler Umzug",
      "Einlagerung",
      "Wie lange",
      "Botschaften",
      "Kunstwerke",
      "Kanada",
    ],
    it: [
      "Trasloco internazionale",
      "Deposito mobili",
      "Quanto dura",
      "Ambasciate",
      "Opere d'arte",
      "Canada",
    ],
    ar: ["النقل الدولي", "التخزين", "كم يستغرق", "السفارات", "الأعمال الفنية", "كندا"],
  };

  useEffect(() => {
    if (!open) return;
    setQ("");
    setSel(0);
    const id = window.setTimeout(() => inputRef.current?.focus(), 30);
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(id);
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => setSel(0), [q]);

  if (!open) return null;

  const go = (e: Entry) => {
    onClose();
    navigate(e.to);
  };

  const onKey = (ev: React.KeyboardEvent) => {
    if (ev.key === "Escape") onClose();
    if (!results.length) return;
    if (ev.key === "ArrowDown") {
      ev.preventDefault();
      setSel((s) => (s + 1) % results.length);
    } else if (ev.key === "ArrowUp") {
      ev.preventDefault();
      setSel((s) => (s - 1 + results.length) % results.length);
    } else if (ev.key === "Enter") {
      ev.preventDefault();
      const r = results.at(sel);
      if (r) go(r);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center bg-tinta/55 px-3 pt-[10vh] backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={tr("Buscar en el sitio", "Search the site")}
    >
      <div
        className="animate-fade-up w-full max-w-[640px] overflow-hidden rounded-[22px] bg-white shadow-[var(--shadow-float)]"
        onKeyDown={onKey}
      >
        <div className="flex items-center gap-3 border-b border-linea px-5">
          <Bi n="search" className="text-lg text-azul" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={tr(
              "Busca un servicio, un destino o una pregunta…",
              "Search for a service, a destination or a question…",
            )}
            aria-label={tr("Buscar", "Search")}
            className="no-ring h-16 min-w-0 flex-1 bg-transparent text-[1rem] text-tinta outline-none placeholder:text-suave"
          />
          <button
            onClick={onClose}
            className="rounded-md border border-linea px-2 py-1 text-[0.7rem] font-semibold text-suave hover:text-azul"
          >
            Esc
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {!q.trim() && (
            <div className="p-3">
              <p className="mb-3 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-suave">
                {tr("Búsquedas frecuentes", "Popular searches")}
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS[lang].map((s) => (
                  <button
                    key={s}
                    onClick={() => setQ(s)}
                    className="rounded-full border border-linea px-3.5 py-1.5 text-[0.85rem] font-medium text-tinta transition-colors hover:border-azul hover:text-azul"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {q.trim() && results.length === 0 && (
            <div className="p-6 text-center">
              <p className="mb-1 font-title font-semibold text-tinta">
                {tr("No encontramos resultados para", "No results for")} “{q}”
              </p>
              <p className="mb-4 text-[0.88rem] text-suave">
                {tr(
                  "Prueba con otra palabra o pregúntale a Joel.",
                  "Try another word or ask Joel.",
                )}
              </p>
              <button
                onClick={() => {
                  onClose();
                  window.dispatchEvent(new Event("tp:open-chat"));
                }}
                className="inline-flex items-center gap-2 rounded-full bg-azul px-4 py-2 text-[0.85rem] font-semibold text-white hover:bg-azul-700"
              >
                <Bi n="chat-dots" /> {tr("Hablar con Joel", "Talk to Joel")}
              </button>
            </div>
          )}

          {results.map((r, i) => (
            <button
              key={`${r.kind}-${r.title}`}
              onClick={() => go(r)}
              onMouseEnter={() => setSel(i)}
              className={`flex w-full items-start gap-3 rounded-xl p-3 text-start transition-colors ${i === sel ? "bg-gris" : ""}`}
            >
              <span
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg text-lg transition-colors ${
                  i === sel ? "bg-azul text-naranja" : "bg-gris text-azul"
                }`}
              >
                <Bi n={r.icon} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate font-title text-[0.94rem] font-semibold text-tinta">
                    {r.title}
                  </span>
                  <span className="shrink-0 rounded-full bg-naranja/10 px-2 py-px text-[0.66rem] font-semibold text-naranja-600">
                    {r.kind}
                  </span>
                </span>
                <span className="line-clamp-1 text-[0.8rem] text-suave">{r.desc}</span>
              </span>
              {i === sel && <Bi n="arrow-return-left" className="mt-3 text-suave" />}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-4 border-t border-linea bg-gris/60 px-5 py-2.5 text-[0.72rem] text-suave sm:flex">
          <span>
            <kbd className="font-semibold">↑↓</kbd> {tr("moverse", "navigate")}
          </span>
          <span>
            <kbd className="font-semibold">Enter</kbd> {tr("abrir", "open")}
          </span>
          <span>
            <kbd className="font-semibold">Esc</kbd> {tr("cerrar", "close")}
          </span>
        </div>
      </div>
    </div>
  );
}
