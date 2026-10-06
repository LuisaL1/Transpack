import type { ReactNode } from "react";

// Controles del cotizador: campo con etiqueta, botones de opción y etiqueta
export const inputCls =
  "w-full rounded-xl border-[1.5px] border-linea bg-white px-4 py-3 text-[0.95rem] text-tinta outline-none transition focus:border-azul focus:ring-[3px] focus:ring-azul/12";

export function Field({
  label,
  hint,
  invalid,
  children,
  full,
}: {
  label: string;
  hint?: string;
  invalid?: boolean;
  children: ReactNode;
  full?: boolean;
}) {
  return (
    <label
      className={`flex flex-col gap-1.5 ${full ? "sm:col-span-2" : ""} ${
        invalid ? "[&_input]:!border-red-500" : ""
      }`}
    >
      <span className="text-[0.88rem] font-semibold text-tinta">
        {label} {hint && <small className="font-normal text-suave">{hint}</small>}
      </span>
      {children}
    </label>
  );
}

export function Chips({
  options,
  value,
  onChange,
  multi = false,
}: {
  options: [string, ReactNode][];
  value: string;
  onChange: (v: string) => void;
  multi?: boolean;
}) {
  const selected = multi ? value.split("|").filter(Boolean) : [value];
  return (
    <div className="mb-5 flex flex-wrap gap-2">
      {options.map(([v, label]) => {
        const on = selected.includes(v);
        return (
          <button
            type="button"
            key={v}
            aria-pressed={on}
            onClick={() => {
              if (!multi) return onChange(on ? "" : v);
              const next = on ? selected.filter((s) => s !== v) : [...selected, v];
              onChange(next.join("|"));
            }}
            className={`inline-flex items-center gap-1.5 rounded-full border-[1.5px] px-4 py-2 text-[0.9rem] font-medium transition ${
              on ? "border-azul bg-azul text-white" : "border-linea text-tinta hover:border-azul"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return <p className="mb-2 text-[0.88rem] font-semibold text-tinta">{children}</p>;
}
