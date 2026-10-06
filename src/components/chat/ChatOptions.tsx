import type { ChatOption } from "@/data/chat";
import { Bi } from "@/components/ui";

// Opciones del paso actual, como lista con íconos (mismo estilo de los menús)
export function ChatOptions({
  options,
  onChoose,
}: {
  options: ChatOption[];
  onChoose: (o: ChatOption) => void;
}) {
  return (
    <div className="animate-fade-up ms-8 grid gap-0.5 rounded-2xl border border-linea bg-white p-2 shadow-sm">
      {options.map((o) => (
        <button
          key={o.label}
          onClick={() => onChoose(o)}
          className="group flex items-center gap-3 rounded-xl p-2 text-start transition-colors hover:bg-gris"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gris text-azul transition-colors group-hover:bg-azul group-hover:text-naranja">
            <Bi n={o.icon ?? "chat-left-text"} />
          </span>
          <span className="min-w-0 flex-1 text-[0.86rem] font-semibold leading-snug text-azul">
            {o.label}
          </span>
          <Bi
            n="chevron-right"
            className="shrink-0 text-[0.8rem] text-suave transition-transform group-hover:translate-x-0.5 group-hover:text-naranja rtl:rotate-180"
          />
        </button>
      ))}
    </div>
  );
}
