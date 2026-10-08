import { chatText, NAME } from "@/data/chat";
import { useLang } from "@/i18n";
import { Bi } from "@/components/ui";
import { ChatAvatar } from "@/components/chat/ChatAvatar";

// Botón flotante que abre y cierra el chat
export function ChatLauncher({
  open,
  onToggle,
  busy = false,
}: {
  open: boolean;
  onToggle: () => void;
  /** Cargando el chat (Zoho SalesIQ): muestra un indicador en lugar del avatar */
  busy?: boolean;
}) {
  const { tr } = useLang();
  const t = chatText(tr);
  return (
    <button
      onClick={onToggle}
      aria-expanded={open}
      aria-busy={busy || undefined}
      aria-label={open ? t.closeChat : t.openChat}
      data-chat-launcher
      className="group fixed bottom-4 right-4 z-[60] flex items-center gap-2.5 rounded-full bg-azul p-1.5 text-white shadow-[0_16px_34px_-10px_rgba(39,43,124,.6)] transition-transform hover:-translate-y-0.5 md:bottom-6 md:right-6 md:pr-4"
    >
      {open ? (
        <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15 text-lg">
          <Bi n="x-lg" />
        </span>
      ) : busy ? (
        <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-naranja" />
        </span>
      ) : (
        <span className="relative">
          <span className="absolute inset-0 animate-ping rounded-full bg-naranja/40 [animation-duration:2.4s]" />
          <ChatAvatar size={40} />
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-azul bg-[#22c55e]" />
        </span>
      )}
      <span className="hidden text-start md:block">
        <span className="flex items-center gap-1.5 text-[0.82rem] font-semibold leading-tight">
          {open ? t.close : NAME}
          {!open && (
            <span className="rounded-full bg-naranja px-1.5 py-px text-[0.6rem] font-bold tracking-wide text-white">
              {t.ai}
            </span>
          )}
        </span>
        {!open && (
          <span className="block text-[0.72rem] leading-tight text-white/70">{t.online}</span>
        )}
      </span>
    </button>
  );
}
