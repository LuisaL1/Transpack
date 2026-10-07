import { Link } from "react-router-dom";
import { useSite } from "@/hooks/useContent";
import { useLang } from "@/i18n";
import { footerText } from "@/data/navigation";
import { contactHref } from "@/data/contact";
import { Bi } from "@/components/ui";
import { Logo } from "@/components/layout/Logo";

// Pie de página: logo, eslogan, redes, servicios, soluciones y contacto
export function Footer() {
  const linkCls = "transition-colors hover:text-naranja";
  const { CONTACT, SEGMENTS, SERVICES, SLOGAN, waLink } = useSite();
  const { lp, tr } = useLang();
  const t = footerText(tr);
  return (
    <footer className="bg-azul-900 pb-7 pt-18 text-[0.92rem] text-white/65">
      <div className="mx-auto grid w-[min(100%-32px,1200px)] gap-10 border-b border-white/10 pb-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo />
          <p className="mt-6 max-w-xs font-title text-[0.78rem] font-medium uppercase leading-[1.8] tracking-[0.12em] text-beige">
            {SLOGAN}
          </p>
          <div className="mt-6 flex gap-2">
            {CONTACT.socials.map((s) => (
              <a
                key={s.icon}
                href={s.href}
                target="_blank"
                rel="noopener"
                aria-label={s.label}
                className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-naranja"
              >
                <Bi n={s.icon} />
              </a>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2.5">
          <h4 className="mb-2 text-[0.82rem] uppercase tracking-[0.14em] !text-white">
            {t.services}
          </h4>
          {SERVICES.map((s) => (
            <Link key={s.slug} to={lp(`/servicios/${s.slug}`)} className={linkCls}>
              {s.title}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-2.5">
          <h4 className="mb-2 text-[0.82rem] uppercase tracking-[0.14em] !text-white">
            {t.solutions}
          </h4>
          {SEGMENTS.map((s) => (
            <Link key={s.id} to={lp(`/?segmento=${s.id}#soluciones`)} className={linkCls}>
              {s.tab}
            </Link>
          ))}
          <Link to={lp("/nosotros")} className={linkCls}>
            {t.about}
          </Link>
        </div>
        <div className="flex flex-col gap-2.5">
          <h4 className="mb-2 text-[0.82rem] uppercase tracking-[0.14em] !text-white">
            {t.contact}
          </h4>
          <span>{CONTACT.address}</span>
          <a href={waLink()} target="_blank" rel="noopener" className={linkCls}>
            {CONTACT.phones[0]}
          </a>
          <a href={contactHref()} className={`${linkCls} break-all`}>
            {CONTACT.email}
          </a>
        </div>
      </div>
      <div className="mx-auto flex w-[min(100%-32px,1200px)] flex-wrap justify-between gap-4 pt-6 text-[0.82rem]">
        <span>
          © {new Date().getFullYear()} {t.legal}
        </span>
        <span className="flex flex-wrap gap-x-5 gap-y-2">
          <Link to={lp("/privacidad")} className={linkCls}>
            {t.privacy}
          </Link>
          <span>{CONTACT.web}</span>
        </span>
      </div>
    </footer>
  );
}
