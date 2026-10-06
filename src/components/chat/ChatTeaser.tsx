import joelFull from "@/assets/images/joel.png";
import { chatText } from "@/data/chat";
import { useLang } from "@/i18n";
import { Bi } from "@/components/ui";

// Invitación: Joel se asoma junto al botón (una vez por sesión)
export function ChatTeaser({ onOpen, onClose }: { onOpen: () => void; onClose: () => void }) {
  const { tr } = useLang();
  const t = chatText(tr);
  return (
    <div
      data-chat-launcher
      className="animate-fade-up fixed bottom-[76px] right-3 z-[60] flex items-end md:bottom-[88px] md:right-6"
    >
      <div className="relative mb-16 mr-[-18px] max-w-[220px] rounded-2xl rounded-br-sm bg-white px-4 py-3 text-[0.85rem] text-texto shadow-[var(--shadow-float)]">
        <button
          onClick={onClose}
          className="absolute right-1.5 top-1 text-xs text-suave hover:text-azul"
          aria-label={t.closeTeaser}
        >
          <Bi n="x-lg" />
        </button>
        <button onClick={onOpen} className="pr-3 text-start">
          <b className="text-tinta">{t.teaserHello}</b> {t.teaserText}
        </button>
      </div>
      <button onClick={onOpen} aria-label={t.talkTo} className="shrink-0">
        <img
          loading="lazy"
          decoding="async"
          src={joelFull}
          alt=""
          className="h-[150px] w-auto drop-shadow-[0_12px_18px_rgba(29,32,80,.25)] md:h-[170px]"
        />
      </button>
    </div>
  );
}
