import { Link } from "react-router-dom";
import { useSite } from "@/data/content";
import { useLang } from "@/i18n";
import { Bi, btn, Reveal } from "@/components/ui";

// Franja naranja de llamado a la acción
export function CtaBand({ title, text }: { title?: string; text?: string }) {
  const { lp, tr } = useLang();
  const { waLink } = useSite();
  title ??= tr("¿Listo para tu próximo destino?", "Ready for your next destination?");
  text ??= tr(
    "Un asesor especializado diseñará contigo el plan de tu mudanza.",
    "A specialized advisor will design your moving plan with you.",
  );
  return (
    <section className="relative overflow-hidden bg-naranja py-16 text-white">
      <span
        aria-hidden="true"
        className="absolute -top-[80%] right-[22%] h-[260%] w-[120px] rotate-[40deg] bg-white/10"
      />
      <span
        aria-hidden="true"
        className="absolute -top-[80%] right-[10%] h-[260%] w-10 rotate-[40deg] bg-white/10"
      />
      <Reveal className="relative mx-auto flex w-[min(100%-32px,1200px)] flex-wrap items-center justify-between gap-8">
        <div>
          <h2 className="mb-1 text-[clamp(1.7rem,1.2rem+1.8vw,2.6rem)] !text-white">{title}</h2>
          <p className="text-[1.05rem] text-white/90">{text}</p>
        </div>
        <div className="flex w-full flex-wrap gap-3 sm:w-auto">
          <Link to={lp("/#cotizar")} className={`${btn.light} ${btn.lg} w-full sm:w-auto`}>
            {tr("Cotizar ahora", "Get a quote")}
          </Link>
          <a
            href={waLink()}
            target="_blank"
            rel="noopener"
            className={`${btn.ghost} ${btn.lg} w-full sm:w-auto`}
          >
            <Bi n="whatsapp" /> WhatsApp
          </a>
        </div>
      </Reveal>
    </section>
  );
}

// Encabezado oscuro para páginas internas (nosotros, servicio, artículo)
export function PageHero({ children, image }: { children: React.ReactNode; image?: string }) {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#272b7c_0%,#1b1e5c_55%,#2f2959_100%)] pb-20 pt-36 text-white/80 md:pb-28 md:pt-44">
      {image && (
        <>
          <img
            src={image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-azul-900 via-azul-900/85 to-azul/40" />
        </>
      )}
      <span
        aria-hidden="true"
        className="absolute -left-[40%] top-[62%] h-[140px] w-[180%] -rotate-[38deg] bg-gradient-to-r from-transparent via-white/5 to-transparent"
      />
      <div className="relative mx-auto w-[min(100%-32px,1200px)]">{children}</div>
    </section>
  );
}
