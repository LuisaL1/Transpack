import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

// Ícono de Bootstrap Icons (solo se usa la fuente de íconos, no los componentes)
export function Bi({
  n,
  className = "",
  style,
}: {
  n: string;
  className?: string;
  style?: CSSProperties;
}) {
  return <i className={`bi bi-${n} ${className}`} style={style} aria-hidden="true" />;
}

// Botones — clases compartidas para <a>, <Link> y <button>
const btnBase =
  "group inline-flex items-center justify-center gap-2 rounded-full border-2 font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer";
export const btn = {
  primary: `${btnBase} border-transparent bg-naranja text-white shadow-[0_10px_24px_-10px_rgba(255,118,25,.7)] hover:bg-naranja-600 hover:-translate-y-0.5`,
  secondary: `${btnBase} border-transparent bg-azul text-white hover:bg-azul-700 hover:-translate-y-0.5`,
  outline: `${btnBase} border-azul text-azul hover:bg-azul hover:text-white`,
  ghost: `${btnBase} border-white/45 bg-white/5 text-white backdrop-blur hover:bg-white/15 hover:border-white`,
  light: `${btnBase} border-transparent bg-white text-azul hover:bg-beige hover:-translate-y-0.5`,
  whatsapp: `${btnBase} border-transparent bg-whatsapp text-white hover:brightness-95 hover:-translate-y-0.5`,
  md: "px-5 py-2.5 text-[0.9rem]",
  lg: "px-6 py-3 text-[0.95rem]",
};

// Etiqueta superior de sección con los chevrons naranja del manual (›››)
export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <p
      className={`mb-4 inline-flex items-center gap-2 font-title text-[0.8rem] font-semibold uppercase tracking-[0.18em] ${
        light ? "text-beige" : "text-azul"
      }`}
    >
      <span
        aria-hidden="true"
        className="text-[1.5em] font-bold leading-none tracking-[-0.12em] text-naranja"
      >
        ›››
      </span>
      {children}
    </p>
  );
}

export function SectionHead({
  eyebrow,
  title,
  sub,
  center = false,
  light = false,
}: {
  eyebrow: string;
  title: ReactNode;
  sub?: ReactNode;
  center?: boolean;
  light?: boolean;
}) {
  return (
    <Reveal className={`mb-12 max-w-3xl md:mb-16 ${center ? "mx-auto text-center" : ""}`}>
      <Eyebrow light={light}>{eyebrow}</Eyebrow>
      <h2
        className={`mb-4 text-[clamp(1.9rem,1.2rem+2.4vw,3rem)] leading-[1.12] ${
          light ? "!text-white" : ""
        }`}
      >
        {title}
      </h2>
      {sub && <p className={`text-[1.06rem] ${light ? "text-white/75" : "text-suave"}`}>{sub}</p>}
    </Reveal>
  );
}

// Aparece con un desplazamiento suave cuando entra en pantalla
export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "article" | "section";
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) return setVisible(true);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

// Cifra con sufijo en naranja (ej. 2.000+)
export function StatValue({ value, suffix }: { value: number; suffix: string }) {
  return (
    <span>
      {value.toLocaleString("es-CO")}
      <span className="text-naranja">{suffix}</span>
    </span>
  );
}

// Lista con checks naranja
export function Checks({
  items,
  light = false,
  small = false,
}: {
  items: string[];
  light?: boolean;
  small?: boolean;
}) {
  return (
    <ul className={`grid ${small ? "gap-2.5" : "gap-3"}`}>
      {items.map((it) => (
        <li
          key={it}
          className={`flex items-start gap-3 font-medium ${
            small ? "text-[0.92rem]" : ""
          } ${light ? "text-white" : "text-tinta"}`}
        >
          <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-naranja text-[0.8rem] text-white">
            <Bi n="check-lg" />
          </span>
          {it}
        </li>
      ))}
    </ul>
  );
}
