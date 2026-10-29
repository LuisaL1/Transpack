import lacmaImg from "@/assets/images/lacma.jpg";
import imgGlobal from "@/assets/images/global.jpg";
import { useLang } from "@/i18n";
import { coverageText } from "@/data/home";
import { useSite } from "@/hooks/useContent";
import { Bi, Eyebrow, Reveal, StatValue } from "@/components/ui";
import { container, section } from "@/components/ui/layout";

// Cobertura global: la foto del avión y el buque con efecto de velocidad
// (editada por el cliente, oct. 2026) es la protagonista: ocupa toda la
// sección de borde a borde. El texto va a la izquierda sobre un degradado azul
// que se abre hacia la derecha; la foto empieza a un tercio del ancho para que
// el avión quede a la vista en el centro y el buque a la derecha; abajo, las
// cifras de la red sobre tarjetas translúcidas. En celular la foto va arriba,
// completa, y el texto debajo sobre azul.
export function Coverage() {
  const { tr } = useLang();
  const t = coverageText(tr);
  const { STATS } = useSite();
  // Cifras reales del sitio (STATS): agentes y aliados, y países
  const chips = [STATS[3], STATS[1]];
  return (
    <section
      id="cobertura"
      className={`${section} overflow-hidden bg-azul-900 text-white/80 lg:min-h-[720px]`}
    >
      <img
        loading="lazy"
        decoding="async"
        src={imgGlobal}
        alt={t.imageAlt}
        className="absolute inset-y-0 left-[28%] hidden h-full w-[72%] object-cover object-left lg:block"
      />
      {/* Azul a la izquierda (texto legible) que se abre hacia la foto */}
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden bg-[linear-gradient(90deg,#0d0f33_0%,#0d0f33_26%,rgba(27,30,92,.9)_34%,rgba(27,30,92,.5)_44%,rgba(27,30,92,.12)_56%,transparent_66%)] lg:block"
      />
      <div className={`${container} relative grid items-end gap-12 lg:grid-cols-[minmax(0,500px)_1fr] lg:gap-16`}>
        {/* Celular y tableta: la foto completa, arriba */}
        <Reveal className="lg:hidden">
          <img
            loading="lazy"
            decoding="async"
            src={imgGlobal}
            alt={t.imageAlt}
            className="aspect-[16/10] w-full object-cover shadow-[var(--shadow-float)]"
          />
        </Reveal>
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
                className="flex gap-3.5 rounded-2xl border border-white/12 bg-white/8 p-4 backdrop-blur-sm"
              >
                <Bi n={m.icon} className="text-[1.7rem] text-naranja" />
                <div>
                  <strong className="block font-title font-semibold text-white">{m.title}</strong>
                  <span className="text-[0.85rem] leading-snug">{m.text}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 border-t border-white/15 pt-6">
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

        {/* Cifras de la red, sobre la foto */}
        <Reveal delay={120} className="flex flex-wrap gap-4 lg:justify-end">
          {chips.map((c) => (
            <div
              key={c.label}
              className="min-w-[200px] rounded-2xl border border-white/15 bg-white/10 px-6 py-5 shadow-[0_24px_50px_-20px_rgba(13,15,51,.8)] backdrop-blur-md"
            >
              <strong className="block font-title text-[2.4rem] leading-none text-white">
                <StatValue value={c.value} suffix={c.suffix} />
              </strong>
              <span className="mt-1.5 block text-[0.85rem] font-medium text-white/85">
                {c.short ?? c.label}
              </span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
