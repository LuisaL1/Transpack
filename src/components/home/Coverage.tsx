import lacmaImg from "@/assets/images/lacma.jpg";
import imgGlobal from "@/assets/images/global.jpg";
import imgBarco from "@/assets/images/barco.jpg";
import { useLang } from "@/i18n";
import { coverageText } from "@/data/home";
import { Bi, Eyebrow, Reveal } from "@/components/ui";
import { container, section } from "@/components/ui/layout";

// Cobertura global: modalidades, certificaciones y red de agentes
export function Coverage() {
  const { tr } = useLang();
  const t = coverageText(tr);
  return (
    <section id="cobertura" className={`${section} overflow-hidden bg-violeta text-white/78`}>
      <span
        aria-hidden="true"
        className="absolute -right-[300px] -top-[200px] h-[900px] w-[900px] rotate-45 bg-gradient-to-br from-white/4 to-transparent"
      />
      <div
        className={`${container} relative grid items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16`}
      >
        <Reveal>
          <Eyebrow light>{t.eyebrow}</Eyebrow>
          <h2 className="mb-5 text-[clamp(1.9rem,1.2rem+2.4vw,3rem)] leading-[1.12] !text-white">
            {t.title}
          </h2>
          <p>{t.text}</p>
          <div className="my-8 grid gap-4 sm:grid-cols-2">
            {t.modes.map((m) => (
              <div
                key={m.title}
                className="flex gap-3.5 rounded-2xl border border-white/10 bg-white/6 p-4"
              >
                <Bi n={m.icon} className="text-[1.7rem] text-naranja" />
                <div>
                  <strong className="block font-title font-semibold text-white">{m.title}</strong>
                  <span className="text-[0.85rem] leading-snug">{m.text}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 border-t border-white/12 pt-6">
            <img
              loading="lazy"
              decoding="async"
              src={lacmaImg}
              alt={t.sealAlt}
              width={76}
              height={76}
              className="rounded-full bg-white p-1"
            />
            <div>
              <strong className="block font-title font-semibold text-white">
                {t.certificationsTitle}
              </strong>
              <span className="text-[0.9rem] tracking-[0.14em] text-beige">{t.certifications}</span>
            </div>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="relative mx-auto aspect-[1/0.9] w-full max-w-[560px]">
            <img
              loading="lazy"
              decoding="async"
              src={imgGlobal}
              alt={t.imageAlt}
              className="absolute left-0 top-0 h-[78%] w-[82%] rounded-[22px] object-cover shadow-[var(--shadow-float)]"
            />
            <img
              loading="lazy"
              decoding="async"
              src={imgBarco}
              alt={t.shipAlt}
              className="absolute bottom-0 right-0 h-[58%] w-[44%] rounded-[22px] border-[6px] border-violeta object-cover shadow-[var(--shadow-float)]"
            />
            <div className="absolute bottom-[6%] left-[4%] rounded-2xl bg-white px-5 py-4 shadow-[var(--shadow-float)]">
              <strong className="block font-title text-[2rem] leading-none text-azul">
                {t.agents}
              </strong>
              <span className="text-[0.8rem] font-medium text-texto">{t.agentsLabel}</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
