import { Link } from "react-router-dom";
import imgEquipo from "@/imports/equipo.jpg";
import imgEmbalaje from "@/imports/embalaje-sala.jpg";
import imgGuacales from "@/imports/guacales.jpg";
import lacmaImg from "@/imports/lacma.jpg";
import { useSite } from "@/data/content";
import { useLang, type Tr } from "@/i18n";
import { CLIENT_LOGOS, logoHeight } from "@/data/clientLogos";
import { Bi, btn, StatValue, Eyebrow, Reveal, SectionHead } from "@/components/ui";
import { CtaBand, PageHero } from "@/components/sections";

const container = "mx-auto w-[min(100%-32px,1200px)]";
const section = "relative py-[clamp(72px,9vw,128px)]";

const values = (tr: Tr) => [
  {
    icon: "people",
    title: tr("Confianza", "Trust"),
    text: tr(
      "Empresas, embajadas y familias nos confían su patrimonio desde hace casi seis décadas.",
      "Companies, embassies and families have trusted us with their belongings for almost six decades.",
    ),
  },
  {
    icon: "shield-check",
    title: tr("Seguridad", "Security"),
    text: tr(
      "Embalaje técnico, inventarios precisos y trazabilidad en cada etapa del traslado.",
      "Technical packing, accurate inventories and traceability at every stage of the move.",
    ),
  },
  {
    icon: "award",
    title: tr("Experiencia", "Experience"),
    text: tr(
      "Más de 60 mil toneladas de menaje exportadas a 176 países.",
      "More than 60,000 tons of household goods exported to 176 countries.",
    ),
  },
  {
    icon: "patch-check",
    title: tr("Excelencia", "Excellence"),
    text: tr(
      "Estándares certificados por LACMA, IAM y PAIMA en origen y destino.",
      "Standards certified by LACMA, IAM and PAIMA at origin and destination.",
    ),
  },
];

const timeline = (tr: Tr) => [
  {
    year: "1968",
    text: tr(
      "Nace Transpack en Bogotá, especializada en trasteos y mudanzas.",
      "Transpack is founded in Bogotá, specializing in moving services.",
    ),
  },
  {
    year: tr("Décadas de red", "Decades of network"),
    text: tr(
      "Construimos una red de más de 2.000 agentes internacionales en 176 países.",
      "We built a network of more than 2,000 international agents in 176 countries.",
    ),
  },
  {
    year: tr("Hoy", "Today"),
    text: tr(
      "Operamos mudanzas locales, nacionales, internacionales, bodegaje y movilidad corporativa.",
      "We run local, national and international moves, storage and corporate mobility.",
    ),
  },
  {
    year: "2028",
    text: tr(
      "Visión: ser una de las compañías líderes en trasteos, mudanzas y bodegaje en Bogotá.",
      "Vision: to be one of the leading moving and storage companies in Bogotá.",
    ),
  },
];

export default function NosotrosPage() {
  const { lp, tr } = useLang();
  const { EMBASSIES, SLOGAN, STATS } = useSite();
  const VALUES = values(tr);
  const TIMELINE = timeline(tr);
  return (
    <>
      <PageHero image={imgEquipo}>
        <div className="animate-fade-up max-w-3xl">
          <Eyebrow light>{tr("Quiénes somos", "About us")}</Eyebrow>
          <h1 className="mb-6 text-[clamp(2.2rem,1.4rem+3vw,3.8rem)] leading-[1.08] !text-white">
            {tr("Más de cinco décadas moviendo", "More than five decades moving")}{" "}
            <span className="text-naranja">{tr("lo que más quieres", "what you love most")}</span>
          </h1>
          <p className="max-w-2xl text-[1.1rem]">
            {tr(
              "Somos una organización consolidada desde 1968, especializada en trasteos locales, mudanzas nacionales e internacionales y bodegaje, con alta calidad en embalaje y traslados a cualquier parte de Colombia y el mundo.",
              "We are an established company founded in 1968, specialized in local, national and international moving and storage, with high-quality packing and moves to anywhere in Colombia and the world.",
            )}
          </p>
          <p className="mt-8 border-s-[3px] border-naranja ps-4 font-title text-[0.78rem] font-medium uppercase tracking-[0.14em] text-beige">
            {SLOGAN}
          </p>
        </div>
      </PageHero>

      {/* Cifras */}
      <section className="relative z-10 -mt-12">
        <div
          className={`${container} grid grid-cols-2 overflow-hidden rounded-[22px] bg-white shadow-[var(--shadow-float)] lg:grid-cols-4`}
        >
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col gap-1.5 px-6 py-7 ${i % 2 ? "border-s border-linea" : ""} ${
                i >= 2 ? "border-t border-linea lg:border-t-0 lg:border-s" : ""
              }`}
            >
              <span className="font-title text-[clamp(2rem,1.6rem+1.4vw,2.8rem)] font-semibold leading-none text-azul">
                <StatValue value={s.value} suffix={s.suffix} />
              </span>
              <span className="text-[0.88rem] font-medium text-suave">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Historia */}
      <section id="historia" className={section}>
        <div className={`${container} grid items-start gap-14 lg:grid-cols-2 lg:gap-20`}>
          <Reveal>
            <Eyebrow>{tr("Nuestra historia", "Our story")}</Eyebrow>
            <h2 className="mb-6 text-[clamp(1.9rem,1.2rem+2.4vw,3rem)] leading-[1.12]">
              {tr(
                "Una red operativa global que no se improvisa",
                "A global operating network you can't improvise",
              )}
            </h2>
            <p className="mb-4">
              {tr(
                "Nuestra historia empezó hace 58 años, en un momento en el que el comercio internacional era más lento, más manual y con muchas más incertidumbres logísticas. Con el paso de las décadas construimos algo que no se improvisa: una red operativa global.",
                "Our story began 58 years ago, when international trade was slower, more manual and far more uncertain. Over the decades we built something you can't improvise: a global operating network.",
              )}
            </p>
            <p>
              {tr(
                "Hoy, esa red nos permite operar mudanzas marítimas y aéreas hacia Estados Unidos, Canadá, la Unión Europea, Asia y toda Latinoamérica, con los mismos estándares en origen y en destino.",
                "Today that network lets us run sea and air moves to the United States, Canada, the European Union, Asia and all of Latin America, with the same standards at origin and destination.",
              )}
            </p>
          </Reveal>
          <ol className="relative grid gap-8 border-s-2 border-dashed border-naranja/50 ps-8">
            {TIMELINE.map((t, i) => (
              <Reveal as="li" key={t.year} delay={i * 80} className="relative">
                <span className="absolute -start-[41px] top-1 h-4 w-4 rotate-45 rounded-[3px] bg-azul ring-4 ring-white" />
                <strong className="mb-1 block font-title text-xl font-semibold text-azul">
                  {t.year}
                </strong>
                <p className="text-suave">{t.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Misión y visión */}
      <section id="mision-vision" className={`${section} bg-gris`}>
        <div className={`${container} grid gap-6 md:grid-cols-2`}>
          {[
            {
              icon: "bullseye",
              title: tr("Misión", "Mission"),
              text: tr(
                "Queremos mantener el compromiso con nuestros clientes ofreciéndoles siempre lo mejor de nosotros en la prestación de servicios de trasteos, mudanzas y transporte a nivel local, nacional e internacional; soportado con una experiencia de más de cinco décadas, donde la atención personalizada, dedicación, cumplimiento y protección al medio ambiente son el fundamento pleno de nuestra gestión.",
                "To keep our commitment to our clients by always giving our best in local, national and international moving and transport services, backed by more than five decades of experience, with personalized attention, dedication, reliability and environmental protection as the foundation of everything we do.",
              ),
            },
            {
              icon: "eye",
              title: tr("Visión", "Vision"),
              text: tr(
                "Para el año 2028 TRANSPACK SAS se perfila como una de las compañías líderes en trasteos locales y mudanzas nacionales e internacionales, así como servicios de bodegaje en Bogotá, reconocida por nuestra excelencia, calidad, experiencia y profesionalismo; permaneciendo siempre a la vanguardia, ofreciendo soluciones a las necesidades de logística de transporte y traslado en Colombia y en el mundo.",
                "By 2028, TRANSPACK SAS aims to be one of the leading local, national and international moving and storage companies in Bogotá, recognized for its excellence, quality, experience and professionalism, always at the forefront and offering solutions to transport and relocation logistics needs in Colombia and around the world.",
              ),
            },
          ].map((b, i) => (
            <Reveal
              key={b.title}
              delay={i * 100}
              className="rounded-[22px] border-t-[3px] border-naranja bg-white p-8 md:p-10"
            >
              <span className="mb-5 grid h-14 w-14 place-items-center rounded-[14px] bg-azul text-2xl text-naranja">
                <Bi n={b.icon} />
              </span>
              <h3 className="mb-3 text-2xl text-azul">{b.title}</h3>
              <p>{b.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Valores */}
      <section id="valores" className={section}>
        <div className={container}>
          <SectionHead
            center
            eyebrow={tr("Valores", "Values")}
            title={tr("Lo que nos mueve", "What drives us")}
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <Reveal
                key={v.title}
                delay={i * 80}
                className="group rounded-[22px] border border-linea p-7 transition-all hover:-translate-y-1.5 hover:shadow-[var(--shadow-card)]"
              >
                <span className="mb-5 grid h-14 w-14 place-items-center rounded-[14px] bg-gris text-2xl text-azul transition-colors group-hover:bg-azul group-hover:text-naranja">
                  <Bi n={v.icon} />
                </span>
                <h3 className="mb-2 text-xl">{v.title}</h3>
                <p className="text-[0.93rem] text-suave">{v.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Clientes y embajadas */}
      <section id="clientes" className={`${section} overflow-hidden bg-violeta text-white/78`}>
        <div className={`${container} grid gap-14 lg:grid-cols-2`}>
          <Reveal>
            <Eyebrow light>{tr("Estándar corporativo", "Corporate standard")}</Eyebrow>
            <h2 className="mb-6 text-[clamp(1.7rem,1.2rem+1.8vw,2.5rem)] leading-[1.15] !text-white">
              {tr(
                "La confianza de las marcas más exigentes",
                "Trusted by the most demanding brands",
              )}
            </h2>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {CLIENT_LOGOS.map((c) => (
                <div
                  key={c.name}
                  title={c.name}
                  className="grid h-[76px] place-items-center rounded-2xl border border-white/10 bg-white/5 px-4 transition-colors hover:bg-white/10"
                >
                  <img
                    src={c.src}
                    alt={c.name}
                    loading="lazy"
                    style={{
                      height: Math.round(logoHeight(c.ratio) * 0.8),
                      width: Math.round(logoHeight(c.ratio) * 0.8 * c.ratio),
                    }}
                    className="max-w-full object-contain opacity-80 brightness-0 invert"
                  />
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={100}>
            <Eyebrow light>{tr("Estándar diplomático", "Diplomatic standard")}</Eyebrow>
            <h2 className="mb-6 text-[clamp(1.7rem,1.2rem+1.8vw,2.5rem)] leading-[1.15] !text-white">
              {tr("Embajadas que han confiado en nosotros", "Embassies that have trusted us")}
            </h2>
            <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {EMBASSIES.map((e) => (
                <span key={e} className="flex items-center gap-2 text-[0.92rem] text-white">
                  <Bi n="flag" className="text-naranja" /> {e}
                </span>
              ))}
            </div>
            <p className="text-[0.95rem]">
              {tr(
                "Además de entidades como la CAF y funcionarios de las Fuerzas Militares de Colombia y Estados Unidos: operaciones que exigen discreción, protocolo y absoluta confidencialidad.",
                "As well as institutions such as CAF and personnel of the Colombian and United States Armed Forces: operations that demand discretion, protocol and complete confidentiality.",
              )}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Certificaciones y forma de trabajo */}
      <section id="certificaciones" className={section}>
        <div className={`${container} grid items-center gap-14 lg:grid-cols-2 lg:gap-20`}>
          <Reveal className="grid grid-cols-2 gap-3">
            <img
              src={imgEmbalaje}
              alt={tr(
                "Equipo de Transpack empacando en una sala",
                "Transpack crew packing in a living room",
              )}
              className="aspect-[3/4] h-full w-full rounded-[22px] object-cover"
            />
            <img
              src={imgGuacales}
              alt={tr("Guacales de madera para exportación", "Wooden export crates")}
              className="mt-10 aspect-[3/4] h-full w-full rounded-[22px] object-cover"
            />
          </Reveal>
          <Reveal delay={100}>
            <Eyebrow>{tr("Certificaciones", "Certifications")}</Eyebrow>
            <h2 className="mb-5 text-[clamp(1.9rem,1.2rem+2.4vw,3rem)] leading-[1.12]">
              {tr("Procesos reales, cuidado experto", "Real processes, expert care")}
            </h2>
            <p className="mb-6">
              {tr(
                "Nuestro trabajo se basa en la precisión, el cuidado y la metodología: inventarios detallados, embalaje técnico y una operación estructurada de principio a fin. Las certificaciones internacionales respaldan que tu mudanza se opera con el mismo estándar en cualquier parte del mundo.",
                "Our work is built on precision, care and method: detailed inventories, technical packing and a structured operation from start to finish. International certifications ensure your move runs to the same standard anywhere in the world.",
              )}
            </p>
            <div className="mb-8 flex items-center gap-4 rounded-2xl bg-gris p-4">
              <img
                src={lacmaImg}
                alt={tr("Sello LACMA Certified Packers", "LACMA Certified Packers seal")}
                width={68}
                height={68}
                className="rounded-full bg-white p-1"
              />
              <div>
                <strong className="block font-title font-semibold text-tinta">
                  LACMA · IAM · PAIMA
                </strong>
                <span className="text-[0.88rem] text-suave">
                  {tr(
                    "Asociaciones internacionales de empresas de mudanzas",
                    "International associations of moving companies",
                  )}
                </span>
              </div>
            </div>
            <Link to={lp("/#cotizar")} className={`${btn.primary} ${btn.md}`}>
              {tr("Cotiza tu mudanza", "Get a moving quote")}
            </Link>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
