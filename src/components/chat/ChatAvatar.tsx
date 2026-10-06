import joelAvatar from "@/assets/images/joel-avatar.png";

// Cara de Joel (bubbles, botón y cabecera del chat)
export function ChatAvatar({ size = 36 }: { size?: number }) {
  return (
    <img
      decoding="async"
      src={joelAvatar}
      alt=""
      width={size}
      height={size}
      className="shrink-0 rounded-full bg-beige object-cover"
      style={{ width: size, height: size }}
    />
  );
}
