import { Link } from "react-router-dom";
import logoImg from "@/assets/images/logo.png";
import { headerText } from "@/data/navigation";
import { useLang } from "@/i18n";

// Logo con enlace al inicio (claro sobre fondos oscuros, azul sobre blanco)
export function Logo({
  light = true,
  compact = false,
  className = "",
}: {
  light?: boolean;
  compact?: boolean;
  className?: string;
}) {
  const { lp, tr } = useLang();
  const t = headerText(tr);
  return (
    <Link
      to={lp("/")}
      className={`relative z-10 inline-flex shrink-0 items-center gap-3 ${className}`}
      aria-label={t.logoLabel}
    >
      <img
        src={logoImg}
        alt=""
        width={56}
        height={56}
        className={`h-12 w-12 rounded-[4px] md:h-14 md:w-14 ${light ? "ring-[1.5px] ring-white/50" : ""}`}
      />
      <span
        className={`${compact ? "lg:hidden xl:inline" : ""} font-title text-2xl font-bold tracking-[0.08em] transition-colors md:text-[1.7rem] ${
          light ? "text-white" : "text-azul"
        }`}
      >
        {t.logoText}
      </span>
    </Link>
  );
}
