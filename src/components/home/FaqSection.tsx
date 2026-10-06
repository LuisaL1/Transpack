import { useLang } from "@/i18n";
import { faqText } from "@/data/home";
import { useSite } from "@/hooks/useContent";
import { Bi, Reveal, SectionHead } from "@/components/ui";
import { container, section } from "@/components/ui/layout";

// Preguntas frecuentes (FAQS de src/data/site.ts), con <details>
export function FaqSection() {
  const { tr } = useLang();
  const t = faqText(tr);
  const { FAQS } = useSite();
  return (
    <section id="faq" className={section}>
      <div className={`${container} grid items-start gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-20`}>
        <SectionHead eyebrow={t.eyebrow} title={t.title} sub={t.sub} />
        <Reveal className="faq">
          {FAQS.map((f) => (
            <details key={f.q} className="group border-b border-linea">
              <summary className="flex cursor-pointer items-center justify-between gap-4 py-5 font-title text-[1.08rem] font-semibold text-tinta hover:text-azul">
                {f.q}
                <span className="faq-icon grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-gris text-azul transition-all duration-300">
                  <Bi n="plus-lg" />
                </span>
              </summary>
              <p className="animate-fade-up pb-6 text-suave lg:pr-12">{f.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
