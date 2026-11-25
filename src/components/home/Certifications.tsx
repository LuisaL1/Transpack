import { useRef } from "react";
import lacmaImg from "@/assets/images/lacma.jpg";
import iamImg from "@/assets/images/cert-iam.svg";
import { useLang } from "@/i18n";
import { certsText } from "@/data/home";
import { useMotion } from "@/hooks/useMotion";
import { Eyebrow } from "@/components/ui";
import { TILE, TileStripe } from "@/components/home/Hero";

// Certificaciones y membresías (nov. 2026, al pie de Contacto): LACMA, IAM y
// PAIMA, con la estética de los logos de clientes del inicio (TILE): logo en
// grises que toma sus colores al pasar el cursor, ficha que se levanta con
// sombra y franja naranja. Las fichas entran escalonadas con el scroll.
// Logos: LACMA, el sello del cliente (RecursosTranspack/Imagenes); IAM, el
// oficial de iamovers.org; PAIMA aún sin archivo (su marca registrada es la
// palabra "PAIMA"), así que va como logotipo de texto hasta que el cliente
// entregue el logo.
const LOGOS: Record<string, string> = { lacma: lacmaImg, iam: iamImg };

export function Certifications() {
  const { tr } = useLang();
  const t = certsText(tr);
  const ref = useRef<HTMLDivElement>(null);
  useMotion(ref, (m, el) => {
    const tiles = el.querySelectorAll("[data-cert]");
    m.reveal(tiles, tiles[0], { y: 28, stagger: 0.12 });
  });
  return (
    <div ref={ref} className="mt-16 border-t border-linea pt-12 lg:mt-20">
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-14">
        <div>
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h3 className="text-start font-title text-[clamp(1.35rem,1.1rem+.9vw,1.75rem)] font-semibold leading-tight text-tinta">
            {t.title}
          </h3>
        </div>
        <ul className="grid gap-3 sm:grid-cols-3">
          {t.items.map((c) => (
            <li
              key={c.key}
              data-cert
              title={`${c.name} · ${c.full}`}
              className={`${TILE} flex h-28 items-center gap-4 border-linea! px-5 shadow-[var(--shadow-card)]`}
            >
              <span className="grid h-16 w-20 shrink-0 place-items-center">
                {LOGOS[c.key] ? (
                  <img
                    src={LOGOS[c.key]}
                    alt={c.name}
                    loading="lazy"
                    decoding="async"
                    className="max-h-16 max-w-20 object-contain opacity-70 grayscale contrast-125 transition duration-300 group-hover:scale-110 group-hover:opacity-100 group-hover:grayscale-0 group-hover:contrast-100"
                  />
                ) : (
                  <span
                    role="img"
                    aria-label={c.name}
                    className="font-title text-[1.35rem] font-bold tracking-[0.04em] text-black/55 transition duration-300 group-hover:scale-110 group-hover:text-azul"
                  >
                    {c.name}
                  </span>
                )}
              </span>
              <span className="min-w-0 text-start font-title leading-tight">
                <span className="block text-[1.05rem] font-semibold text-tinta">{c.name}</span>
                <span className="mt-0.5 block text-[0.74rem] text-suave">{c.full}</span>
              </span>
              <TileStripe />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
