import { Link } from "react-router-dom";
import type { ChatMsg } from "@/data/chat";
import { trackEvent } from "@/lib/analytics";
import { ChatAvatar } from "@/components/chat/ChatAvatar";
import { Bi } from "@/components/ui";
import { ChatList, ChatRow, chatRowCls } from "@/components/chat/ChatOptions";
import { requestAdvisorChat } from "@/lib/advisorEvents";

// Mensaje del chat: de Joel o de un asesor (izquierda, con acciones opcionales
// en el mismo formato de lista con ícono que las opciones) o del visitante
export function ChatBubble({ msg }: { msg: ChatMsg }) {
  const agent = msg.from === "agent";
  const bot = msg.from === "bot" || agent;
  return (
    <div
      className={`animate-fade-up flex items-end gap-2 ${bot ? "justify-start" : "justify-end"}`}
    >
      {agent ? (
        // Asesor de Transpack: ícono de audífonos en lugar de la foto de Joel
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-azul text-[0.7rem] text-naranja">
          <Bi n="headset" />
        </span>
      ) : (
        bot && <ChatAvatar size={24} />
      )}
      <div className={`max-w-[82%] ${bot ? "" : "text-end"}`}>
        {agent && msg.name && (
          <p className="mb-1 font-title text-[0.72rem] font-semibold text-azul">{msg.name}</p>
        )}
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
