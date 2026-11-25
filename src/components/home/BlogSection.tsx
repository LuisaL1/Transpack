import { useRef } from "react";
import { Link } from "react-router-dom";
import { useLang } from "@/i18n";
import { blogSectionText } from "@/data/home";
import { usePosts } from "@/hooks/useContent";
import { useMotion } from "@/hooks/useMotion";
import { Bi, Eyebrow, PhotoFrame, Reveal } from "@/components/ui";
import { container, section } from "@/components/ui/layout";

// Últimos artículos del blog (src/data/blogData.ts). Las tarjetas se inclinan
// y brillan siguiendo al puntero (tilt y .spotlight; nov. 2026). Bloque en azul
// corporativo (ritmo de fondos del inicio, ver LandingPage): tarjetas blancas.
export function BlogSection() {
  const { lp, tr } = useLang();
  const t = blogSectionText(tr);
  const blogPosts = usePosts();
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (m, el) => {
    const off = [...el.querySelectorAll<HTMLElement>("[data-blog-card]")].map((c) => m.tilt(c, 3));
    return () => off.forEach((f) => f());
  });
  return (
    <section id="blog" ref={ref} className={`${section} bg-azul`}>
      <div className={container}>
        <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-x-16 gap-y-4 md:mb-16">
          <div>
            <Eyebrow light>{t.eyebrow}</Eyebrow>
            <h2 className="text-[clamp(1.9rem,1.2rem+2.4vw,3rem)] leading-[1.12] !text-white">
              {t.title}
            </h2>
          </div>
          <p className="max-w-[420px] text-start text-[1.06rem] text-white/75">{t.sub}</p>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2">
          {blogPosts.map((p, i) => (
            <Reveal key={p.slug} delay={i * 80}>
              <Link
                to={lp(`/blog/${p.slug}`)}
                data-blog-card
                className="spotlight group relative flex h-full flex-col rounded-[28px] border border-white/10 bg-white p-2 transition-[translate,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:border-transparent hover:shadow-[0_28px_56px_-20px_rgba(13,15,51,.75)]"
              >
                {/* La categoría va en la pestaña de la foto, unida al texto */}
                <PhotoFrame
                  className="aspect-[16/10]"
                  tab={
                    <span className="text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-naranja">
                      {p.cat}
                    </span>
                  }
                >
                  <img
                    decoding="async"
                    src={p.cover}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </PhotoFrame>
                <div className="flex flex-1 flex-col gap-2.5 px-4 pb-5 pt-4">
                  <h3 className="flex-1 text-[1.12rem] leading-snug">{p.title}</h3>
                  <span className="inline-flex items-center gap-1.5 text-[0.93rem] font-semibold text-azul">
                    {t.read}{" "}
                    <Bi
                      n="arrow-right"
                      className="text-naranja transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
