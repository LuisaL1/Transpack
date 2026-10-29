import { Link } from "react-router-dom";
import logoImg from "@/assets/images/logo.png";
import { headerText } from "@/data/navigation";
import { useLang } from "@/i18n";

// Logo con enlace al inicio, sin el nombre escrito al lado (a pedido del
// cliente, oct. 2026): el nombre queda en la etiqueta para lectores de pantalla.
// Tamaño: 44 % más grande que la primera versión (dos aumentos del 20 %); con
// `small` (cabecera compacta al desplazar la página), el tamaño anterior.
export function Logo({
  light = true,
  small = false,
  className = "",
}: {
  light?: boolean;
  small?: boolean;
  className?: string;
}) {
  const { lp, tr } = useLang();
  const t = headerText(tr);
  return (
    <Link
      to={lp("/")}
      className={`relative z-10 inline-flex shrink-0 items-center ${className}`}
      aria-label={t.logoLabel}
    >
      <img
        src={logoImg}
        alt=""
        width={109}
        height={109}
        className={`rounded-[4px] transition-all duration-300 ${
          small
            ? "h-[48px] w-[48px] min-[375px]:h-[58px] min-[375px]:w-[58px] md:h-[77px] md:w-[77px] wide:h-[91px] wide:w-[91px]"
            : "h-[58px] w-[58px] min-[375px]:h-[70px] min-[375px]:w-[70px] md:h-[92px] md:w-[92px] wide:h-[109px] wide:w-[109px]"
        } ${light ? "ring-[1.5px] ring-white/50" : ""}`}
      />
    </Link>
  );
}
