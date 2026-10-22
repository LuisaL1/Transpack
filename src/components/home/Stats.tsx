import { useLang } from "@/i18n";
import { statsText } from "@/data/home";
import { useSite } from "@/hooks/useContent";
import { StatValue } from "@/components/ui";
import { container } from "@/components/ui/layout";

// Franja de cifras bajo el hero (datos en STATS de src/data/site.ts)
export function Stats() {
  const { tr } = useLang();
  const t = statsText(tr);
  const { STATS } = useSite();
  return (
    <section className="pb-4 pt-6" aria-label={t.label}>
      <div
        className={`${container} grid grid-cols-2 overflow-hidden rounded-[22px] bg-white shadow-[var(--shadow-float)] lg:grid-cols-4`}
      >
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={`flex flex-col gap-2.5 px-5 py-8 sm:px-9 sm:py-11 ${i % 2 ? "border-s border-linea" : ""} ${
              i >= 2 ? "border-t border-linea lg:border-s lg:border-t-0" : ""
            }`}
          >
            <span className="font-title text-[clamp(2.6rem,1.9rem+2.4vw,4rem)] font-bold leading-none text-azul">
              <StatValue value={s.value} suffix={s.suffix} />
            </span>
            <span className="text-[0.98rem] font-medium text-suave sm:text-[1.08rem]">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
