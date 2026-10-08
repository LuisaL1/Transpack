import { Link } from "react-router-dom";
import type { ChatMsg } from "@/data/chat";
import { trackEvent } from "@/lib/analytics";
import { ChatAvatar } from "@/components/chat/ChatAvatar";
import { ChatList, ChatRow, chatRowCls } from "@/components/chat/ChatOptions";
import { requestAdvisorChat } from "@/lib/advisorEvents";

// Mensaje del chat: de Joel (izquierda, con acciones opcionales en el mismo
// formato de lista con ícono que las opciones) o del visitante
export function ChatBubble({ msg }: { msg: ChatMsg }) {
  const bot = msg.from === "bot";
  return (
    <div
      className={`animate-fade-up flex items-end gap-2 ${bot ? "justify-start" : "justify-end"}`}
    >
      {bot && <ChatAvatar size={24} />}
      <div className={`max-w-[82%] ${bot ? "" : "text-end"}`}>
        <div
          className={`inline-block whitespace-pre-line px-3.5 py-2.5 text-start text-[0.86rem] leading-relaxed ${
            bot
              ? "rounded-[4px_16px_16px_16px] border border-linea bg-white text-texto shadow-sm"
              : "rounded-[16px_16px_4px_16px] bg-azul text-white"
          }`}
        >
          {msg.text}
        </div>
        {msg.actions && (
          <ChatList className="mt-2">
            {msg.actions.map((a) =>
              a.crm ? (
                // Chat con un asesor (Zoho SalesIQ): lo abre useAdvisorChat
                <button
                  key={a.label}
                  type="button"
                  onClick={requestAdvisorChat}
                  className={`${chatRowCls} w-full`}
                >
                  <ChatRow icon={a.icon} label={a.label} />
                </button>
              ) : a.to ? (
                <Link key={a.label} to={a.to} className={chatRowCls}>
                  <ChatRow icon={a.icon} label={a.label} />
                </Link>
              ) : (
                <a
                  key={a.label}
                  href={a.href}
                  onClick={() => a.event && trackEvent(a.event.name, a.event.params)}
                  target={a.href?.startsWith("http") ? "_blank" : undefined}
                  rel="noopener"
                  className={chatRowCls}
                >
                  <ChatRow icon={a.icon} label={a.label} />
                </a>
              ),
            )}
          </ChatList>
        )}
      </div>
    </div>
  );
}

// Indicador de "Joel está escribiendo"
export function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <ChatAvatar size={24} />
      <div className="flex gap-1 rounded-[4px_16px_16px_16px] border border-linea bg-white px-3.5 py-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-azul/60"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
