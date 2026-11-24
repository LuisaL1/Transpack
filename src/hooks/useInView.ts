import { useEffect, useState, type RefObject } from "react";

/**
 * true desde que el elemento entra en pantalla (una sola vez). Sin
 * IntersectionObserver, true de una vez.
 */
export function useInView(ref: RefObject<Element | null>, threshold = 0.4) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) return setSeen(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setSeen(true);
        io.disconnect();
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);
  return seen;
}
