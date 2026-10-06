// Franja superior: selector de región e idioma. Hay una opción por idioma del
// sitio, nombrada por la región que lo usa (todos los países hispanohablantes
// ven la misma versión en español, y así con cada idioma).
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LANG_INFO, LANGS, useLang, type Lang } from "@/i18n";
import { langBarText, REGIONS, regionLabel as optionLabel } from "@/data/navigation";
import { Bi } from "@/components/ui";

export function LangBar({ hidden }: { hidden: boolean }) {
  const { lang, tr, switchTo } = useLang();
  const t = langBarText(tr);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (hidden) setOpen(false);
  }, [hidden]);

  const choose = (l: Lang) => {
    setOpen(false);
    if (l !== lang) navigate(switchTo(l));
  };

  return (
    <div
      className={`relative z-[60] bg-[#0d0f33] text-[0.78rem] text-white/65 transition-[max-height,opacity] duration-300 ${
        hidden ? "max-h-0 overflow-hidden opacity-0" : "max-h-10 opacity-100"
      }`}
      aria-hidden={hidden}
    >
      <div className="mx-auto flex h-9 w-[min(100%-32px,1200px)] items-center justify-end gap-5">
        <div ref={ref} className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-label={t.choose}
            tabIndex={hidden ? -1 : 0}
            className="inline-flex items-center gap-2 rounded-full px-2 py-1 text-white/90 transition-colors hover:bg-white/10"
          >
            <Bi n="globe2" className="text-naranja" />
            <span>
              {REGIONS[lang]} <span className="text-white/60">({LANG_INFO[lang].name})</span>
            </span>
            <Bi
              n="chevron-down"
              className={`text-[0.6rem] transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>

          {open && (
            <div
              role="listbox"
              aria-label={t.list}
              className="animate-fade-up absolute end-0 top-[calc(100%+8px)] w-max min-w-[270px] rounded-xl bg-white py-1.5 shadow-[var(--shadow-float)] ring-1 ring-azul/5"
            >
              {LANGS.map((l) => {
                const on = l === lang;
                return (
                  <button
                    key={l}
                    role="option"
                    aria-selected={on}
                    lang={LANG_INFO[l].locale}
                    onClick={() => choose(l)}
                    className={`block w-full px-6 py-3 text-start font-title text-[0.95rem] font-semibold transition-colors ${
                      on
                        ? "bg-azul/[0.07] text-azul underline decoration-2 underline-offset-4"
                        : "text-tinta hover:bg-gris"
                    }`}
                  >
                    {/* Cada opción se nombra en su propio idioma, como es habitual en los selectores */}
                    <bdi>{optionLabel(l)}</bdi>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
