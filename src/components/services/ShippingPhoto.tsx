import type { ReactNode } from "react";
import { useLang } from "@/i18n";
import { shippingLabelText } from "@/data/pages";
import { Bi, PhotoFrame } from "@/components/ui";

// Foto del encabezado de los servicios (nov. 2026, en todos los que llevan foto;
// antes solo Mudanzas locales): la foto en un PhotoFrame con su pestaña abajo a
// la izquierda (nombre del servicio, con la animación de .hero-reveal), dos
// capas azules sólidas desplazadas detrás (como hojas apiladas, a 10 y 20 px; la
// de atrás más clara) y una etiqueta de envío compacta pegada arriba a la
// izquierda, un poco girada (ver excepciones en LABEL_BOTTOM_RIGHT). Los datos de la etiqueta son de
// muestra y van con el tipo de servicio (shippingLabelText, por `slug`): es
// decorativa y los lectores de pantalla no la leen.
export function ShippingPhoto({
  children,
  slug,
  tab,
}: {
  children: ReactNode;
  slug: string;
  tab?: ReactNode | true;
}) {
  const { tr } = useLang();
  const t = shippingLabelText(tr, slug);
  return (
    // Espacio a la derecha y abajo para los marcos desplazados
    <div className="relative h-full pb-5 pe-5">
      <div className="relative h-full">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 translate-x-5 translate-y-5 rounded-[24px] bg-azul/30"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-[24px] bg-azul"
        />
        <PhotoFrame tab={tab} className="h-full">
          {children}
        </PhotoFrame>
        <ShippingLabel t={t} bottomRight={LABEL_BOTTOM_RIGHT.has(slug)} />
      </div>
    </div>
  );
}

// La etiqueta va abajo a la derecha cuando taparía al equipo en la otra esquina.
const LABEL_BOTTOM_RIGHT = new Set(["diplomatico", "traslado-de-oficinas"]);

// Código de barras a partir del número de guía (siempre el mismo dibujo)
function bars(code: string) {
  return [...code].flatMap((ch, i) => {
    const c = ch.charCodeAt(0) + i;
    return [(c % 3) + 1, ((c >> 2) % 2) + 1, ((c >> 1) % 3) + 1];
  });
}

// Etiqueta compacta (nov. 2026: un 40 % más pequeña que la primera, de 230 a
// 138 px de ancho, con letras apenas más chicas para que los datos se sigan
// leyendo) y pegada arriba a la izquierda de la foto, un poco girada; el sello
// cuelga de su esquina inferior derecha. Con `bottomRight`, en la esquina
// inferior derecha, girada al otro lado y con el sello arriba a la izquierda.
// En celular, a 85 %.
function ShippingLabel({
  t,
  bottomRight = false,
}: {
  t: ReturnType<typeof shippingLabelText>;
  bottomRight?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={`shipping-label pointer-events-none absolute z-10 w-[138px] scale-[0.85] overflow-visible rounded-[5px] bg-white text-start shadow-[var(--shadow-float)] ring-1 ring-linea sm:scale-100 ${
        bottomRight
          ? "bottom-3 right-3 origin-bottom-right rotate-3 lg:-right-4 lg:bottom-8"
          : "left-3 top-3 origin-top-left -rotate-3 lg:-left-5 lg:top-6"
      }`}
    >
      <div className="flex items-center gap-1 rounded-t-[5px] bg-azul px-2 py-1 font-title text-[0.5rem] font-semibold uppercase leading-tight tracking-[0.12em] text-white">
        <Bi n={t.icon} className="shrink-0 text-naranja" /> {t.title}
      </div>
      <dl className="grid grid-cols-2 gap-x-2 gap-y-1 px-2 pt-1.5">
        {t.rows.map(([label, value, wide]) => (
          <div key={label} className={wide ? "col-span-2" : ""}>
            <dt className="text-[0.44rem] font-semibold uppercase tracking-[0.12em] text-suave">
              {label}
            </dt>
            <dd className="font-mono text-[0.56rem] font-semibold leading-tight text-tinta">
              {value}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mx-2 mt-1.5 flex h-4 items-stretch gap-px overflow-hidden">
        {bars(t.guide).map((w, i) => (
          <span
            key={i}
            className={i % 2 ? "bg-transparent" : "bg-tinta"}
            style={{ width: w * 0.6 }}
          />
        ))}
      </div>
      <p className="px-2 pb-1.5 pt-0.5 text-center font-mono text-[0.5rem] tracking-[0.2em] text-tinta">
        {t.guide}
      </p>
      {/* Sello */}
      <span
        className={`absolute ${bottomRight ? "-left-5 -top-3 -rotate-12" : "-bottom-3 -right-5 rotate-12"} rounded-[3px] border-[1.5px] border-naranja bg-white/85 px-1.5 py-px font-title text-[0.46rem] font-bold uppercase tracking-[0.16em] text-naranja`}
      >
        {t.stamp}
      </span>
    </div>
  );
}
