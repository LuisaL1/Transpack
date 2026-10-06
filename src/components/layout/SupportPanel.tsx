import { Link } from "react-router-dom";
import { headerText, supportFor } from "@/data/navigation";
import { useLang } from "@/i18n";
import { Bi } from "@/components/ui";
import { MenuLink } from "@/components/layout/MenuLink";

// Panel de soporte (ícono de audífonos): Joel, WhatsApp, teléfono y correo
export function SupportPanel() {
  const { lang, lp, tr } = useLang();
  const SUPPORT = supportFor(lang);
  const t = headerText(tr);
  return (
    <div className="animate-fade-up overflow-hidden rounded-[22px] bg-white shadow-[var(--shadow-float)] ring-1 ring-azul/5">
      <div className="relative overflow-hidden bg-gradient-to-br from-azul to-violeta px-5 py-4">
        <span
          aria-hidden="true"
          className="absolute -right-8 -top-8 h-20 w-20 rotate-45 bg-naranja/25"
        />
        <p className="relative flex items-center gap-2 font-title font-semibold text-white">
          <Bi n="headset" className="text-naranja" /> {t.supportTitle}
        </p>
        <p className="relative text-[0.8rem] text-white/70">{t.supportSub}</p>
      </div>
      <div className="grid gap-0.5 p-2">
        {SUPPORT.map((it) => (
          <MenuLink
            key={it.label}
            item={it}
            className="group flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-gris"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gris text-azul transition-colors group-hover:bg-azul group-hover:text-naranja">
              <Bi n={it.icon} />
            </span>
            <span className="min-w-0">
              <span className="block text-[0.88rem] font-semibold text-tinta">{it.label}</span>
              <span className="block truncate text-[0.74rem] text-suave">{it.desc}</span>
            </span>
          </MenuLink>
        ))}
      </div>
      <Link
        to={lp("/#faq")}
        className="flex items-center justify-between border-t border-linea px-5 py-3 text-[0.82rem] font-semibold text-azul hover:bg-gris"
      >
        {t.supportFaq} <Bi n="question-circle" />
      </Link>
    </div>
  );
}
