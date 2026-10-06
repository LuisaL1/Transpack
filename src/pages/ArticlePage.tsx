import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { readMinutes, type Item } from "@/data/blogData";
import { usePosts } from "@/hooks/useContent";
import { slugEs, useLang } from "@/i18n";
import { Bi, btn, Reveal } from "@/components/ui";
import { CtaBand, PageHero } from "@/components/sections";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { track } from "@/lib/joel";

function ListItem({ item }: { item: Item }) {
  if (typeof item === "string") return <li>{item}</li>;
  return (
    <li>
      <strong>{item.b}</strong> {item.t}
    </li>
  );
}
import { articleText } from "@/data/pages";

// Artículo del blog (/blog/:slug). Contenido en src/data/blogData.ts; los
// textos de la página están en src/data/pages.ts.
export function ArticlePage() {
  const { slug } = useParams();
  const { lang, lp, tr } = useLang();
  const t = articleText(tr);
  const blogPosts = usePosts();
  const post = blogPosts.find((p) => p.slug === slugEs(slug ?? "", lang));
  // Artículo leído (perfil del visitante para Joel)
  const postSlug = post?.slug;
  useEffect(() => {
    if (postSlug) track("article", postSlug);
  }, [postSlug]);
  if (!post) return <NotFoundPage />;

  const others = blogPosts.filter((p) => p.slug !== post.slug);

  return (
    <>
      <PageHero image={post.cover}>
        <div className="animate-fade-up mx-auto max-w-3xl">
          <Link
            to={lp("/#blog")}
            className="mb-6 inline-flex items-center gap-2 text-[0.88rem] text-white/70 hover:text-white"
          >
            <Bi n="arrow-left" /> {t.volverBlog}
          </Link>
          <p className="mb-4 flex flex-wrap items-center gap-3 text-[0.8rem] font-semibold uppercase tracking-[0.12em]">
            <span className="text-naranja">{post.cat}</span>
            <span className="text-white/40">•</span>
            <span className="text-beige">
              {readMinutes(post)} {t.minLectura}
            </span>
          </p>
          <h1 className="text-[clamp(1.9rem,1.3rem+2.4vw,3.2rem)] leading-[1.12] !text-white">
            {post.title}
          </h1>
        </div>
      </PageHero>

      <article className="mx-auto w-[min(100%-32px,760px)] py-16 md:py-20">
        <p className="mb-8 border-s-[3px] border-naranja ps-5 text-[1.15rem] font-medium leading-relaxed text-tinta">
          {post.excerpt}
        </p>
        <div className="prose-tp text-[1.03rem] leading-[1.75]">
          {post.blocks.map((b, i) => {
            if (b.t === "h2") return <h2 key={i}>{b.text}</h2>;
            if (b.t === "p") return <p key={i}>{b.text}</p>;
            return (
              <ul key={i}>
                {b.items.map((it, j) => (
                  <ListItem key={j} item={it} />
                ))}
              </ul>
            );
          })}
        </div>
        <div className="mt-12 flex flex-col items-start gap-5 rounded-[22px] bg-azul p-8 text-white/80 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <strong className="mb-1 block font-title text-xl font-semibold text-white">
              {t.planeasMudanza}
            </strong>
            <span>{t.asesorTeAcompanaDesde}</span>
          </div>
          <Link to={lp("/?servicio=internacional#cotizar")} className={`${btn.primary} ${btn.md}`}>
            {post.cta}
          </Link>
        </div>
      </article>

      <section className="bg-gris py-16 md:py-24">
        <div className="mx-auto w-[min(100%-32px,1200px)]">
          <h2 className="mb-8 text-[clamp(1.6rem,1.2rem+1.4vw,2.2rem)]">{t.sigueLeyendo}</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {others.map((o, i) => (
              <Reveal key={o.slug} delay={i * 80}>
                <Link
                  to={lp(`/blog/${o.slug}`)}
                  className="group grid h-full overflow-hidden rounded-[22px] bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-card)] sm:grid-cols-[200px_1fr]"
                >
                  <div className="aspect-[16/10] overflow-hidden sm:aspect-auto">
                    <img
                      loading="lazy"
                      decoding="async"
                      src={o.cover}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col gap-2 p-6">
                    <span className="text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-naranja">
                      {o.cat}
                    </span>
                    <h3 className="flex-1 text-[1.08rem] leading-snug">{o.title}</h3>
                    <span className="inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-azul">
                      {t.leerArticulo}{" "}
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

      <CtaBand />
    </>
  );
}
