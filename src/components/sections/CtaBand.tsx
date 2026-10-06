import { Link } from "react-router-dom";
import { useSite } from "@/hooks/useContent";
import { useLang } from "@/i18n";
import { Bi, btn, Reveal } from "@/components/ui";
import { ctaBandText } from "@/data/pages";

// Franja naranja de llamado a la acción
export function CtaBand({ title, text }: { title?: string; text?: string }) {
  const { lp, tr } = useLang();
  const { waLink } = useSite();
  const t = ctaBandText(tr);
  title ??= t.title;
  text ??= t.text;
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
            {t.cta}
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
