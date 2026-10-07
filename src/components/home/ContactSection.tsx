import { useLang } from "@/i18n";
import { contactText } from "@/data/home";
import { useSite } from "@/hooks/useContent";
import { contactHref } from "@/data/contact";
import { Bi, Eyebrow, Reveal } from "@/components/ui";
import { container, section } from "@/components/ui/layout";

// Contacto: dirección, teléfonos, correo, redes y mapa
export function ContactSection() {
  const { tr } = useLang();
  const t = contactText(tr);
  const { CONTACT } = useSite();
  const items = [
    {
      icon: "geo-alt",
      title: t.address,
      body: <span>{CONTACT.address}</span>,
    },
    {
      icon: "telephone",
      title: t.phones,
      body: (
        <span className="flex flex-wrap gap-x-2">
          {CONTACT.phones.map((p, i) => (
            <a
              key={p}
              href={`tel:+57${p.replace(/\s/g, "")}`}
              className="whitespace-nowrap hover:text-naranja"
            >
              {p}
              {i < CONTACT.phones.length - 1 && " ·"}
            </a>
          ))}
        </span>
      ),
    },
    {
      icon: "envelope",
      title: t.email,
      body: (
        <a href={contactHref()} className="break-all hover:text-naranja">
          {CONTACT.email}
        </a>
      ),
    },
  ];
  return (
    <section id="contacto" className={section}>
      <div className={`${container} grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16`}>
        <Reveal>
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h2 className="mb-6 text-[clamp(1.9rem,1.2rem+2.4vw,3rem)] leading-[1.12]">{t.title}</h2>
          <ul className="mb-8 grid gap-6">
            {items.map((it) => (
              <li key={it.title} className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gris text-xl text-azul">
                  <Bi n={it.icon} />
                </span>
                <div>
                  <strong className="block font-title font-semibold text-tinta">{it.title}</strong>
                  {it.body}
                </div>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-2.5">
            {CONTACT.socials.map((s) => (
              <a
                key={s.icon}
                href={s.href}
                target="_blank"
                rel="noopener"
                aria-label={s.label}
                className="grid h-11 w-11 place-items-center rounded-full bg-azul text-white transition-all hover:-translate-y-0.5 hover:bg-naranja"
              >
                <Bi n={s.icon} />
              </a>
            ))}
            <span className="ms-1 text-[0.9rem] font-semibold text-azul">{CONTACT.handle}</span>
          </div>
        </Reveal>
        <Reveal
          delay={100}
          className="min-h-[380px] overflow-hidden rounded-[22px] bg-gris shadow-[var(--shadow-card)]"
        >
          <iframe
            title={t.mapTitle}
            src={t.mapSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block h-full min-h-[380px] w-full border-0"
          />
        </Reveal>
      </div>
    </section>
  );
}
