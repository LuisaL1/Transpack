import type { ReactNode } from "react";
import { useLang } from "@/i18n";
import { shippingLabelText } from "@/data/pages";
import { Bi } from "@/components/ui";

// Prueba de diseño (nov. 2026), solo en la foto de Mudanzas locales
// (`imageShipping` en SERVICES): la foto con dos capas azules sólidas
// desplazadas detrás (como hojas apiladas, a 10 y 20 px; la de atrás más clara) y una etiqueta de envío pegada
// en su esquina, un poco girada (en celular, reducida a 2/3). Los datos de la etiqueta son de muestra
// (shippingLabelText): es decorativa y los lectores de pantalla no la leen.
export function ShippingPhoto({ children }: { children: ReactNode }) {
  const { tr } = useLang();
  const t = shippingLabelText(tr);
  return (
    // Espacio a la derecha y abajo para los marcos desplazados
    <div className="relative h-full pb-5 pe-5">
      <div className="relative h-full">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 translate-x-5 translate-y-5 rounded-[22px] bg-azul/30"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-[22px] bg-azul"
        />
        <div className="relative h-full overflow-hidden rounded-[22px]">{children}</div>
        <ShippingLabel t={t} />
      </div>
    </div>
  );
}

// Código de barras a partir del número de guía (siempre el mismo dibujo)
function bars(code: string) {
  return [...code].flatMap((ch, i) => {
    const c = ch.charCodeAt(0) + i;
    return [(c % 3) + 1, ((c >> 2) % 2) + 1, ((c >> 1) % 3) + 1];
  });
}

function ShippingLabel({ t }: { t: ReturnType<typeof shippingLabelText> }) {
  const row = (label: string, value: string, wide = false) => (
    <div className={wide ? "col-span-2" : ""}>
      <dt className="text-[0.52rem] font-semibold uppercase tracking-[0.14em] text-suave">
        {label}
      </dt>
      <dd className="font-mono text-[0.66rem] font-semibold leading-tight text-tinta">{value}</dd>
    </div>
  );
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-3 left-3 w-[230px] origin-bottom-left -rotate-3 scale-[0.66] overflow-visible rounded-md bg-white text-start shadow-[var(--shadow-float)] ring-1 ring-linea sm:scale-100 lg:-left-10 lg:bottom-8"
    >
      <div className="flex items-center gap-1.5 rounded-t-md bg-azul px-3 py-1.5 font-title text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-white">
        <Bi n="truck" className="text-naranja" /> Transpack · {t.title}
      </div>
      <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 px-3 pt-2.5">
        {row(t.from, t.fromValue, true)}
        {row(t.to, t.toValue, true)}
        {row(t.weight, t.weightValue)}
        {row(t.date, t.dateValue)}
      </dl>
      <div className="mx-3 mt-2.5 flex h-7 items-stretch gap-[1.5px] sm:h-8">
        {bars(t.guideValue).map((w, i) => (
          <span key={i} className={i % 2 ? "bg-transparent" : "bg-tinta"} style={{ width: w }} />
        ))}
      </div>
      <p className="px-3 pb-2 pt-1 text-center font-mono text-[0.6rem] tracking-[0.28em] text-tinta">
        {t.guideValue}
      </p>
      {/* Sello */}
      <span className="absolute -right-3 top-8 rotate-12 rounded border-2 border-naranja bg-white/85 px-2 py-0.5 font-title text-[0.62rem] font-bold uppercase tracking-[0.2em] text-naranja">
        {t.fragile}
      </span>
    </div>
  );
}
