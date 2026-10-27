// Chat del sitio: invitación, botón flotante y ventana de respaldo. La
// conversación la atiende el widget de Zoho SalesIQ (src/lib/crmChat.ts); la
// ventana del sitio solo se muestra si Zoho no carga, con otros canales. Textos
// en src/data/chat.ts y lógica en src/hooks/useAdvisorChat.ts.
import { chatText, NAME } from "@/data/chat";
import { useAdvisorChat } from "@/hooks/useAdvisorChat";
import { useLang } from "@/i18n";
import { Bi } from "@/components/ui";
import { ChatAvatar } from "@/components/chat/ChatAvatar";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { ChatLauncher } from "@/components/chat/ChatLauncher";
import { ChatTeaser } from "@/components/chat/ChatTeaser";

export function AdvisorChat() {
  const { tr } = useLang();
  const t = chatText(tr);
  const { open, setOpen, advisor, closeAdvisorWindow, teaser, setTeaser, msgs } =
    useAdvisorChat();

  return (
    <>
      {teaser && !open && advisor === "idle" && (
        <ChatTeaser onOpen={() => setOpen(true)} onClose={() => setTeaser(false)} />
      )}
      {/* Con la ventana de Zoho a la vista, el botón muestra la X y la cierra */}
      <ChatLauncher
        open={open || advisor === "open"}
        busy={advisor === "loading"}
        onToggle={() => (advisor === "open" ? closeAdvisorWindow() : setOpen((o) => !o))}
      />

      {/* Ventana de respaldo (Zoho no cargó) */}
      {open && (
        <section
          aria-label={t.window}
          className="animate-fade-up fixed inset-x-3 bottom-[76px] top-20 z-[60] flex flex-col overflow-hidden rounded-[24px] border border-azul/10 bg-white shadow-[0_40px_80px_-30px_rgba(39,43,124,.5)] sm:inset-x-auto sm:right-6 sm:top-auto sm:h-[min(620px,calc(100vh-130px))] sm:w-[400px] md:bottom-[92px]"
        >
          <header className="relative flex items-center gap-3 overflow-hidden bg-azul px-5 py-4">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rotate-45 rounded-[22%] bg-naranja/25"
            />
            <span className="relative">
              <ChatAvatar size={42} />
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-azul bg-[#22c55e]" />
            </span>
            <div className="relative flex-1">
              <p className="font-title text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-naranja">
                {t.role}
              </p>
              <p className="font-title font-semibold leading-tight text-white">{NAME}</p>
              <p className="text-[0.75rem] text-white/70">{t.status}</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="relative grid h-8 w-8 place-items-center rounded-lg bg-white/10 text-white/80 transition-colors hover:bg-white hover:text-azul"
              aria-label={t.closeChat}
            >
              <Bi n="x-lg" />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-gris p-4" aria-live="polite">
            {msgs.map((m, i) => (
              <ChatBubble key={i} msg={m} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
