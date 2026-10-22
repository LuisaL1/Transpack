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
        width={76}
        height={76}
        className={`h-12 w-12 rounded-[4px] md:h-16 md:w-16 wide:h-[76px] wide:w-[76px] ${light ? "ring-[1.5px] ring-white/50" : ""}`}
      />
      <span
        className={`${compact ? "lg:hidden xl:inline" : ""} font-title text-xl font-bold tracking-[0.08em] transition-colors md:text-[1.7rem] wide:text-[2.2rem] ${
          light ? "text-white" : "text-azul"
        }`}
      >
        {t.logoText}
      </span>
    </Link>
  );
}
