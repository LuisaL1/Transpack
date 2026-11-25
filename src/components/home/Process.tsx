import { useLang } from "@/i18n";
import { processText } from "@/data/home";
import { useSite } from "@/hooks/useContent";
import { SectionHead } from "@/components/ui";
import { container, section } from "@/components/ui/layout";
import { StepsTimeline } from "@/components/sections";

// Pasos del proceso (PROCESS de src/data/site.ts). Movimiento (nov. 2026): en
// escritorio la línea punteada se dibuja con el scroll y cada paso se enciende
// (rombo y texto) cuando la línea llega a él; al subir, retrocede. En celular
// y tableta los pasos entran escalonados (StepsTimeline, el mismo de las
// páginas de servicio).
export function Process() {
  const { tr } = useLang();
  const t = processText(tr);
  const { PROCESS } = useSite();
  return (
    <section id="proceso" className={section}>
      <div className={container}>
        <SectionHead eyebrow={t.eyebrow} title={t.title} sub={t.sub} />
        <StepsTimeline items={PROCESS} />
      </div>
    </section>
  );
}
