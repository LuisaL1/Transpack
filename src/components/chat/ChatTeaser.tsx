import joelFull from "@/assets/images/joel.png";
import { chatText } from "@/data/chat";
import { useLang } from "@/i18n";
import { Bi } from "@/components/ui";

// Invitación: Joel se asoma junto al botón (una vez por sesión). El muñeco
// baja un poco (translate-y), más cerca del botón (pedido del equipo, nov. 2026);
// un 40 % más pequeño desde nov. 2026 (de 150/170 px de alto a 90/102); la
// burbuja queda a su izquierda, sin taparlo
export function ChatTeaser({ onOpen, onClose }: { onOpen: () => void; onClose: () => void }) {
  const { tr } = useLang();
  const t = chatText(tr);
  return (
    <div
      data-chat-launcher
      className="animate-fade-up fixed bottom-[56px] right-3 z-[60] flex items-end md:bottom-[64px] md:right-6"
    >
      <div className="relative mb-12 mr-1 max-w-[220px] rounded-2xl rounded-br-sm bg-white px-4 py-3 text-[0.85rem] text-texto shadow-[var(--shadow-float)]">
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
      <button onClick={onOpen} aria-label={t.talkTo} className="relative z-10 shrink-0">
        <img
          loading="lazy"
          decoding="async"
          src={joelFull}
          alt=""
          className="h-[90px] w-auto translate-y-2 drop-shadow-[0_8px_12px_rgba(29,32,80,.25)] md:h-[102px] md:translate-y-2.5"
        />
      </button>
    </div>
  );
}
