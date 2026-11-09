import { ChatAvatar } from "@/components/chat/ChatAvatar";

// Joelito "escribiendo" (tres puntos) mientras se abre el chat de Zoho. El texto
// solo lo leen los lectores de pantalla.
export function ChatTyping({ label }: { label: string }) {
  return (
    <div className="flex items-end gap-2">
      <ChatAvatar size={24} />
      <div className="inline-flex items-center gap-1.5 rounded-[4px_16px_16px_16px] border border-linea bg-white px-4 py-3.5 shadow-sm">
        {[0, 150, 300].map((d) => (
          <span
            key={d}
            aria-hidden="true"
            className="h-2 w-2 rounded-full bg-suave/60 motion-safe:animate-bounce"
            style={{ animationDelay: `${d}ms` }}
          />
        ))}
        <span className="sr-only">{label}</span>
      </div>
    </div>
  );
}
