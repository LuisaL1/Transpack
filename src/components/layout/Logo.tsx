import { Link } from "react-router-dom";
import logoImg from "@/assets/images/logo.png";
import { headerText } from "@/data/navigation";
import { useLang } from "@/i18n";

// Logo con enlace al inicio (claro sobre fondos oscuros, azul sobre blanco).
// Tamaño: 20 % más grande que la primera versión, a pedido del cliente (oct. 2026).
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
        width={91}
        height={91}
        className={`h-[48px] w-[48px] rounded-[4px] min-[375px]:h-[58px] min-[375px]:w-[58px] md:h-[77px] md:w-[77px] wide:h-[91px] wide:w-[91px] ${light ? "ring-[1.5px] ring-white/50" : ""}`}
      />
      <span
        className={`${compact ? "lg:hidden xl:inline" : ""} font-title text-xl font-bold min-[375px]:text-[1.5rem] tracking-[0.08em] transition-colors md:text-[2.04rem] wide:text-[2.64rem] ${
          light ? "text-white" : "text-azul"
        }`}
      >
        {t.logoText}
      </span>
    </Link>
  );
}
