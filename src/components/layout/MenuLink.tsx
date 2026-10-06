import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { MenuItem } from "@/data/navigation";

// Abre el chat de Joel desde cualquier parte del sitio
export const openChat = () => window.dispatchEvent(new Event("tp:open-chat"));

// Un enlace de menú: interno, externo o el que abre el chat
export function MenuLink({
  item,
  className,
  children,
}: {
  item: MenuItem;
  className: string;
  children: ReactNode;
}) {
  if (item.chat)
    return (
      <button type="button" onClick={openChat} className={`${className} text-start`}>
        {children}
      </button>
    );
  if (item.href)
    return (
      <a
        href={item.href}
        target={item.href.startsWith("http") ? "_blank" : undefined}
        rel="noopener"
        className={className}
      >
        {children}
      </a>
    );
  return (
    <Link to={item.to ?? "/"} className={className}>
      {children}
    </Link>
  );
}
