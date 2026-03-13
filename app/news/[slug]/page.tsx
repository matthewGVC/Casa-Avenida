import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getArticle, getArticles, BLUR_DATA_URL, encodeImagePath } from "@/lib/content";
import type { ArticleBlock } from "@/lib/types";
import SubscribeForm from "@/components/news/SubscribeForm";
import ScrollFade from "@/components/animations/ScrollFade";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticle(params.slug);
  if (!article) return { title: "Article Not Found | Casa Avenida" };

  return {
    title: `${article.title} | Casa Avenida Haven`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.coverImage ? [{ url: article.coverImage }] : [],
    },
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function ArticlePage({ params }: Props) {
  const article = getArticle(params.slug);
  if (!article) notFound();

  const allArticles = getArticles();
  const others = allArticles.filter((a) => a.slug !== article.slug).slice(0, 2);

  return (
    <>
      {/* Article header */}
      <header className="bg-lunar pt-28 lg:pt-36 pb-0 px-6 lg:px-12 border-b border-white/10">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 font-heading text-[10px] tracking-heading text-white/30">
              <li>
                <Link href="/news" className="hover:text-sapling transition-colors duration-200">
                  HAVEN
                </Link>
              </li>
              <li aria-hidden="true">·</li>
              <li className="text-white/60 truncate max-w-[200px]">{article.title.toUpperCase()}</li>
            </ol>
          </nav>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="font-heading text-[9px] tracking-heading text-sapling/60 border border-sapling/20 px-2 py-0.5"
              >
                {tag.toUpperCase()}
              </span>
            ))}
          </div>

          {/* Title — large drop-cap style */}
          <h1 className="font-display text-white text-[clamp(2rem,5vw,3.5rem)] leading-tight mb-4">
            {article.title.toUpperCase()}
          </h1>

          {/* Date */}
          <p className="font-heading text-white/30 text-[10px] tracking-heading pb-8">
            {formatDate(article.date).toUpperCase()}
          </p>
        </div>
      </header>

      {/* Cover image */}
      {article.coverImage && (
        <div className="bg-lunar px-6 lg:px-12 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="relative w-full aspect-[16/9]">
              <Image
                src={encodeImagePath(article.coverImage)}
                alt={article.title}
                fill
                className="object-cover"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>
          </div>
        </div>
      )}

      {/* Article body */}
      <article className="bg-lunar px-6 lg:px-12 pb-16">
        <div className="max-w-3xl mx-auto">
          {/* Lead excerpt */}
          <ScrollFade>
            <p className="font-body text-white/70 text-lg lg:text-xl leading-relaxed border-l-2 border-sapling pl-5 mb-10 italic">
              {article.excerpt}
            </p>
          </ScrollFade>

          {/* Body blocks */}
          {article.body?.map((block: ArticleBlock, i: number) => (
            <ScrollFade key={i} delay={i * 40}>
              {block.type === "heading" ? (
                <h2 className="font-heading text-white text-sm tracking-heading mb-4 mt-10 first:mt-0">
                  {block.text.toUpperCase()}
                </h2>
              ) : (
                <p className="font-body text-white/60 text-base leading-loose mb-5">
                  {block.text}
                </p>
              )}
            </ScrollFade>
          ))}

          {/* Subscribe form */}
          <SubscribeForm />
        </div>
      </article>

      {/* More articles */}
      {others.length > 0 && (
        <section className="bg-lunar px-6 lg:px-12 py-16 border-t border-white/10">
          <div className="max-w-3xl mx-auto">
            <ScrollFade>
              <p className="font-heading text-sapling/60 text-xs tracking-heading mb-8">
                MORE FROM HAVEN
              </p>
            </ScrollFade>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10">
              {others.map((a) => (
                <ScrollFade key={a.slug} className="bg-lunar">
                  <Link
                    href={`/news/${a.slug}`}
                    className="group block p-5 hover:bg-white/5 transition-colors duration-200"
                  >
                    <p className="font-display text-white text-lg leading-tight group-hover:text-sapling/90 transition-colors mb-2">
                      {a.title.toUpperCase()}
                    </p>
                    <p className="font-body text-white/40 text-sm line-clamp-2">{a.excerpt}</p>
                    <p className="font-heading text-sapling text-[10px] tracking-heading mt-4">
                      READ →
                    </p>
                  </Link>
                </ScrollFade>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
