import type { ChatMsg } from "@/data/chat";
import { ChatAvatar } from "@/components/chat/ChatAvatar";
import { ChatList, ChatRow, chatRowCls } from "@/components/chat/ChatOptions";

// Mensaje de la ventana de respaldo (a la izquierda, con la cara de Joel) y sus
// enlaces en el formato de lista con ícono
export function ChatBubble({ msg }: { msg: ChatMsg }) {
  return (
    <div className="animate-fade-up flex items-end gap-2">
      <ChatAvatar size={24} />
      <div className="max-w-[82%]">
        <div className="inline-block whitespace-pre-line rounded-[4px_16px_16px_16px] border border-linea bg-white px-3.5 py-2.5 text-start text-[0.86rem] leading-relaxed text-texto shadow-sm">
          {msg.text}
        </div>
        {msg.actions && (
          <ChatList className="mt-2">
            {msg.actions.map((a) => (
              <a
                key={a.label}
                href={a.href}
                target={a.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener"
                className={chatRowCls}
              >
                <ChatRow icon={a.icon} label={a.label} />
              </a>
            ))}
          </ChatList>
        )}
      </div>
    </div>
  );
}
