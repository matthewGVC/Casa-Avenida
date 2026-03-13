import type { Metadata } from "next";
import { getArticles } from "@/lib/content";
import ArticleCard from "@/components/news/ArticleCard";
import ScrollFade from "@/components/animations/ScrollFade";

export const metadata: Metadata = {
  title: "Haven — News & Updates | Casa Avenida",
  description:
    "Market insights, development progress, and lifestyle from Delray Beach. The Haven newsletter from Casa Avenida.",
  openGraph: {
    title: "Haven — News & Updates | Casa Avenida",
    description: "Market insights and development updates from the heart of Delray Beach.",
  },
};

export default function NewsPage() {
  const articles = getArticles();

  return (
    <>
      {/* Header */}
      <section className="bg-lunar pt-32 pb-16 lg:pt-40 lg:pb-20 px-6 lg:px-12 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto">
          <ScrollFade>
            <p className="font-heading text-sapling/60 text-xs tracking-heading mb-4">
              THE NEWSLETTER
            </p>
            <h1 className="font-display text-white text-[clamp(2.5rem,6vw,5rem)] leading-none mb-6">
              HAVEN
            </h1>
            <p className="font-body text-white/60 text-base lg:text-lg max-w-xl leading-relaxed">
              Market insights, design perspectives, and development updates from Casa Avenida and
              the Delray Beach community.
            </p>
          </ScrollFade>
        </div>
      </section>

      {/* Article grid */}
      <section className="bg-lunar py-16 lg:py-24 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px bg-white/10">
            {articles.map((article, i) => (
              <ScrollFade key={article.slug} delay={i * 80} className="bg-lunar">
                <ArticleCard article={article} />
              </ScrollFade>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
