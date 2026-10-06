import { Link } from "react-router-dom";
import { useLang } from "@/i18n";
import { blogSectionText } from "@/data/home";
import { usePosts } from "@/hooks/useContent";
import { Bi, Eyebrow, Reveal } from "@/components/ui";
import { container, section } from "@/components/ui/layout";

// Últimos artículos del blog (src/data/blogData.ts)
export function BlogSection() {
  const { lp, tr } = useLang();
  const t = blogSectionText(tr);
  const blogPosts = usePosts();
  return (
    <section id="blog" className={`${section} bg-gris`}>
      <div className={container}>
        <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-x-16 gap-y-4 md:mb-16">
          <div>
            <Eyebrow>{t.eyebrow}</Eyebrow>
            <h2 className="text-[clamp(1.9rem,1.2rem+2.4vw,3rem)] leading-[1.12]">{t.title}</h2>
          </div>
          <p className="max-w-[420px] text-[1.06rem] text-suave">{t.sub}</p>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((p, i) => (
            <Reveal key={p.slug} delay={i * 80}>
              <Link
                to={lp(`/blog/${p.slug}`)}
                className="group flex h-full flex-col overflow-hidden rounded-[22px] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-card)]"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    decoding="async"
                    src={p.cover}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2.5 px-6 pb-7 pt-6">
                  <span className="text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-naranja">
                    {p.cat}
                  </span>
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
