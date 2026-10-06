import { useSearchParams } from "react-router-dom";
import { useLang } from "@/i18n";
import { quoteSectionText } from "@/data/home";
import { Reveal, SectionHead } from "@/components/ui";
import { QuoteWizard } from "@/components/home/QuoteWizard";
import { container, section } from "@/components/ui/layout";

// Sección #cotizar con el cotizador. Acepta preselección por URL:
// ?servicio=<local|nacional|internacional|empresarial|bodegaje>&nivel=<1-3>
export function QuoteSection() {
  const { tr } = useLang();
  const t = quoteSectionText(tr);
  const [params] = useSearchParams();
  return (
    <section id="cotizar" className={`${section} bg-gradient-to-b from-white to-gris`}>
      <div className={container}>
        <SectionHead center eyebrow={t.eyebrow} title={t.title} sub={t.sub} />
        <Reveal>
          <QuoteWizard initialService={params.get("servicio")} initialLevel={params.get("nivel")} />
        </Reveal>
      </div>
    </section>
  );
}
