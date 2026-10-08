// Joel, asesor virtual de Transpack: invitación, botón flotante y ventana del
// chat. La conversación está en src/data/chat.ts y la lógica en
// src/hooks/useAdvisorChat.ts.
import { chatText, NAME } from "@/data/chat";
import { useAdvisorChat } from "@/hooks/useAdvisorChat";
import { useLang } from "@/i18n";
import { Bi } from "@/components/ui";
import { ChatAvatar } from "@/components/chat/ChatAvatar";
import { ChatBubble, TypingIndicator } from "@/components/chat/ChatBubble";
import { ChatLauncher } from "@/components/chat/ChatLauncher";
import { ChatOptions } from "@/components/chat/ChatOptions";
import { ChatTeaser } from "@/components/chat/ChatTeaser";

export function AdvisorChat() {
  const { tr } = useLang();
  const t = chatText(tr);
  const {
    open,
    setOpen,
    advisor,
    teaser,
    setTeaser,
    msgs,
    typing,
    text,
    setText,
    step,
    options,
    choose,
    send,
    restart,
    endRef,
    inputRef,
  } = useAdvisorChat();

  return (
    <>
      {teaser && !open && advisor === "idle" && (
        <ChatTeaser onOpen={() => setOpen(true)} onClose={() => setTeaser(false)} />
      )}
      {/* Con el chat de un asesor (Zoho) abierto se usa su propio botón de cierre */}
      {advisor !== "open" && (
        <ChatLauncher
          open={open}
          busy={advisor === "loading"}
          onToggle={() => setOpen((o) => !o)}
        />
      )}

      {/* Ventana */}
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
              onClick={restart}
              className="relative grid h-8 w-8 place-items-center rounded-lg bg-white/10 text-white/80 transition-colors hover:bg-white hover:text-azul"
              aria-label={t.restart}
              title={t.restart}
            >
              <Bi n="arrow-counterclockwise" />
            </button>
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
            {typing && <TypingIndicator />}
            {!typing && options.length > 0 && <ChatOptions options={options} onChoose={choose} />}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-center gap-2 border-t border-linea bg-white p-3"
          >
            <input
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={step.input?.placeholder ?? t.placeholder}
              aria-label={t.message}
              className="no-ring min-w-0 flex-1 rounded-xl border border-linea bg-gris px-4 py-2.5 text-[0.88rem] text-tinta outline-none transition focus:border-azul focus:bg-white"
            />
            <button
              type="submit"
              disabled={!text.trim() || typing}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-azul text-naranja transition-colors hover:bg-naranja hover:text-white disabled:bg-gris disabled:text-suave"
              aria-label={t.send}
            >
              <Bi n="send-fill" />
            </button>
          </form>
        </section>
      )}
    </>
  );
}
