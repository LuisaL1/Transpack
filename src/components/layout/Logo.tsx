import { Link } from "react-router-dom";
import logoImg from "@/assets/images/logo.png";
import { headerText } from "@/data/navigation";
import { useLang } from "@/i18n";

// Logo con enlace al inicio (claro sobre fondos oscuros, azul sobre blanco)
export function Logo({ light = true, compact = false }: { light?: boolean; compact?: boolean }) {
  const { lp, tr } = useLang();
  const t = headerText(tr);
  return (
    <Link
      to={lp("/")}
      className="relative z-10 inline-flex items-center gap-3"
      aria-label={t.logoLabel}
    >
      <img
        src={logoImg}
        alt=""
        width={44}
        height={44}
        className={`h-10 w-10 rounded-[4px] md:h-11 md:w-11 ${light ? "ring-[1.5px] ring-white/50" : ""}`}
      />
      <span
        className={`${compact ? "lg:hidden xl:inline" : ""} font-title text-lg font-bold tracking-[0.08em] transition-colors md:text-[1.3rem] ${
          light ? "text-white" : "text-azul"
        }`}
      >
        {t.logoText}
      </span>
    </Link>
  );
}
