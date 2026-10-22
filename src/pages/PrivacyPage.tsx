import { Link } from "react-router-dom";
import { useSite } from "@/hooks/useContent";
import { useLang } from "@/i18n";
import { privacyText } from "@/data/pages";
import { contactHref } from "@/data/contact";
import type { PrivacySection } from "@/data/site";
import { analyticsEnabled, resetConsent } from "@/lib/analytics";
import { container, section } from "@/components/ui/layout";
import { Bi, btn, Eyebrow } from "@/components/ui";
import { PageHero } from "@/components/sections";

// Política de tratamiento de datos personales (/privacidad), Ley 1581 de 2012.
// El texto está en PRIVACY (src/data/site.ts y sus traducciones); los datos del
// responsable salen de CONTACT.
export function PrivacyPage() {
  const { lp, tr } = useLang();
  const t = privacyText(tr);
  const { CONTACT, PRIVACY, waLink } = useSite();
  const linkCls = "font-medium text-azul underline underline-offset-2 hover:text-naranja";

  // Datos del responsable (el NIT solo aparece cuando el cliente lo entregue)
  const owner: [string, React.ReactNode][] = [
    [t.razonSocial, CONTACT.legalName],
    ...(CONTACT.nit ? [[t.nit, CONTACT.nit] as [string, React.ReactNode]] : []),
    [t.direccion, CONTACT.address],
    [
      t.correo,
      <a key="mail" href={contactHref({ motivo: "datos" })} className={linkCls}>
        {CONTACT.email}
      </a>,
    ],
    [
      t.telefonos,
      <span key="tel" className="flex flex-wrap gap-x-2">
        {CONTACT.phones.map((p) => (
          <a key={p} href={`tel:+57${p.replace(/\s/g, "")}`} className={linkCls}>
            {p}
          </a>
        ))}
      </span>,
    ],
    [
      "WhatsApp",
      <a key="wa" href={waLink()} target="_blank" rel="noopener" className={linkCls}>
        {CONTACT.phones[0]}
      </a>,
    ],
  ];

  const extra = (s: PrivacySection) => {
    if (s.id === "responsable")
      return (
        <dl className="mt-4 grid gap-x-6 gap-y-3 rounded-2xl bg-gris p-5 sm:grid-cols-[150px_1fr]">
          {owner.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="font-title text-[0.85rem] font-semibold text-tinta">{k}</dt>
              <dd className="text-[0.95rem]">{v}</dd>
            </div>
          ))}
        </dl>
      );
    if (s.id === "cookies" && analyticsEnabled)
      return (
        <p className="mt-4 flex flex-wrap items-center gap-3">
          <span>{t.cambiarCookies}</span>
          <button type="button" onClick={resetConsent} className={`${btn.outline} ${btn.md}`}>
            <Bi n="sliders" /> {t.cambiarCookiesBtn}
          </button>
        </p>
      );
    if (s.id === "como-ejercerlos")
      return (
        <a href={contactHref({ motivo: "datos" })} className={`${btn.secondary} ${btn.md} mt-5`}>
          <Bi n="envelope-paper" /> {t.abrirFormulario}
        </a>
      );
    return null;
  };

  return (
    <>
      <PageHero>
        <nav
          aria-label={t.ruta}
          className="mb-6 flex items-center gap-2 text-[0.85rem] text-white/60"
        >
          <Link to={lp("/")} className="hover:text-white">
            {t.inicio}
          </Link>
          <Bi n="chevron-right" className="text-[0.7rem] rtl:rotate-180" />
          <span className="text-white">{PRIVACY.title}</span>
        </nav>
        <div className="animate-fade-up max-w-3xl">
          <Eyebrow light>{t.eyebrow}</Eyebrow>
          <h1 className="mb-6 text-[clamp(2rem,1.3rem+2.6vw,3.2rem)] leading-[1.1] !text-white">
            {PRIVACY.title}
          </h1>
          <p className="max-w-2xl text-[1.05rem]">{PRIVACY.intro}</p>
          <p className="mt-6 text-[0.85rem] text-white/60">{PRIVACY.updated}</p>
        </div>
      </PageHero>

      <section className={section}>
        <div className={`${container} grid items-start gap-12 lg:grid-cols-[260px_1fr] lg:gap-16`}>
          {/* Índice */}
          <nav aria-label={t.enEstaPagina} className="lg:sticky lg:top-28">
            <p className="mb-3 font-title text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-naranja">
              {t.enEstaPagina}
            </p>
            <ol className="grid gap-1.5 text-[0.9rem]">
              {PRIVACY.sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-suave transition-colors hover:text-azul">
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="min-w-0 max-w-3xl">
            {PRIVACY.notice && (
              <p className="mb-10 flex gap-3 rounded-2xl bg-gris p-4 text-[0.9rem] text-suave">
                <Bi n="translate" className="mt-0.5 text-azul" />
                {PRIVACY.notice}
              </p>
            )}
            {PRIVACY.sections.map((s) => (
              <section key={s.id} id={s.id} className="mb-10 scroll-mt-28">
                <h2 className="mb-4 text-[clamp(1.35rem,1.1rem+0.8vw,1.7rem)] text-azul">
                  {s.title}
                </h2>
                {s.text?.map((p) => (
                  <p key={p} className="mb-3">
                    {p}
                  </p>
                ))}
                {s.table && (
                  <>
                    {/* Escritorio: tabla */}
                    <table className="mb-4 hidden w-full border-collapse overflow-hidden rounded-2xl text-[0.9rem] md:table">
                      <thead>
                        <tr className="bg-azul text-start text-white">
                          {s.table.head.map((h) => (
                            <th key={h} scope="col" className="px-4 py-3 text-start font-title font-semibold">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {s.table.rows.map(([where, data, purpose]) => (
                          <tr key={where} className="border-b border-linea align-top even:bg-gris">
                            <th scope="row" className="w-[22%] px-4 py-3 text-start font-semibold text-tinta">
                              {where}
                            </th>
                            <td className="px-4 py-3">{data}</td>
                            <td className="px-4 py-3">{purpose}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {/* Celular: una tarjeta por canal */}
                    <div className="mb-4 grid gap-3 md:hidden">
                      {s.table.rows.map(([where, data, purpose]) => (
                        <dl key={where} className="rounded-2xl border border-linea p-4 text-[0.9rem]">
                          <dt className="sr-only">{s.table!.head[0]}</dt>
                          <dd className="mb-2 font-title font-semibold text-azul">{where}</dd>
                          <dt className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-naranja">
                            {s.table!.head[1]}
                          </dt>
                          <dd className="mb-2">{data}</dd>
                          <dt className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-naranja">
                            {s.table!.head[2]}
                          </dt>
                          <dd>{purpose}</dd>
                        </dl>
                      ))}
                    </div>
                  </>
                )}
                {s.items && (
                  <ul className="grid gap-2.5">
                    {s.items.map((i) => (
                      <li key={i} className="flex gap-3">
                        <span className="mt-[0.6em] h-2 w-2 shrink-0 rotate-45 rounded-[2px] bg-naranja" />
                        <span>{i}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {s.after?.map((p) => (
                  <p key={p} className="mt-3">
                    {p}
                  </p>
                ))}
                {extra(s)}
              </section>
            ))}

            <div className="mt-14 rounded-[22px] bg-azul p-8 text-white/80">
              <h2 className="mb-2 text-[1.4rem] !text-white">{t.dudas}</h2>
              <p className="mb-6">{t.escribenos}</p>
              <a href={contactHref({ motivo: "datos" })} className={`${btn.primary} ${btn.md}`}>
                <Bi n="envelope-paper" /> {t.abrirFormulario}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
