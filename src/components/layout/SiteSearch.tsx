// Cuadro de búsqueda del sitio (Ctrl/⌘ + K). El contenido que se busca está en
// src/data/search.ts y el motor en src/lib/search.ts.
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { SEARCH_SUGGESTIONS, searchIndex, searchText } from "@/data/search";
import { search, type SearchEntry } from "@/lib/search";
import { useLang } from "@/i18n";
import { Bi } from "@/components/ui";
import { trackSearch } from "@/lib/joel";
import { trackEvent } from "@/lib/analytics";
import { openChat } from "@/components/layout/MenuLink";

export function SiteSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lang, tr } = useLang();
  const t = searchText(tr);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const index = useMemo(() => searchIndex(lang), [lang]);
  const results = useMemo(() => search(index, q), [index, q]);
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

  const go = (e: SearchEntry) => {
    trackSearch(q);
    trackEvent("search", { search_term: q.trim(), result: e.to, lang });
    onClose();
    navigate(e.to);
  };

  const onKey = (ev: KeyboardEvent) => {
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
    // Clic en el fondo oscuro cierra (con teclado: Esc o el botón Esc)
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center bg-tinta/55 px-3 pt-[10vh] backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={t.dialog}
    >
      {/* Delegación: flechas, Enter y Esc funcionan desde el campo o los resultados */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
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
            placeholder={t.placeholder}
            aria-label={t.input}
            className="no-ring h-16 min-w-0 flex-1 bg-transparent text-[1rem] text-tinta outline-none placeholder:text-suave"
          />
          <button
            onClick={onClose}
            className="rounded-md border border-linea px-2 py-1 text-[0.7rem] font-semibold text-suave hover:text-azul"
          >
            {t.close}
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {!q.trim() && (
            <div className="p-3">
              <p className="mb-3 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-suave">
                {t.popular}
              </p>
              <div className="flex flex-wrap gap-2">
                {SEARCH_SUGGESTIONS[lang].map((s) => (
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
                {t.noResults} “{q}”
              </p>
              <p className="mb-4 text-[0.88rem] text-suave">{t.tryAgain}</p>
              <button
                onClick={() => {
                  trackSearch(q);
                  onClose();
                  openChat();
                }}
                className="inline-flex items-center gap-2 rounded-full bg-azul px-4 py-2 text-[0.85rem] font-semibold text-white hover:bg-azul-700"
              >
                <Bi n="chat-dots" /> {t.askJoel}
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
            <kbd className="font-semibold">↑↓</kbd> {t.navigate}
          </span>
          <span>
            <kbd className="font-semibold">Enter</kbd> {t.open}
          </span>
          <span>
            <kbd className="font-semibold">Esc</kbd> {t.closeHint}
          </span>
        </div>
      </div>
    </div>
  );
}
