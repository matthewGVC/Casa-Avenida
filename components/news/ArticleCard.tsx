import Link from "next/link";
import { encodeImagePath } from '@/lib/content';
import Image from "next/image";
import type { Article } from "@/lib/types";
import { BLUR_DATA_URL } from "@/lib/content";

interface ArticleCardProps {
  article: Article;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const hasImage = Boolean(article.coverImage);

  return (
    <Link
      href={`/news/${article.slug}`}
      className="group block border border-white/10 hover:border-sapling/30 transition-colors duration-300"
      aria-label={`Read ${article.title}`}
    >
      {/* Cover image */}
      {hasImage && (
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={encodeImagePath(article.coverImage)}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            loading="lazy"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6 space-y-3">
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="font-heading text-[9px] tracking-heading text-sapling/60 border border-sapling/20 px-2 py-0.5"
            >
              {tag.toUpperCase()}
            </span>
          ))}
        </div>

        {/* Title */}
        <h2 className="font-display text-white text-xl lg:text-2xl leading-tight group-hover:text-sapling/90 transition-colors duration-200">
          {article.title.toUpperCase()}
        </h2>

        {/* Excerpt */}
        <p className="font-body text-white/50 text-sm leading-relaxed line-clamp-3">
          {article.excerpt}
        </p>

        {/* Date + read more */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <span className="font-heading text-white/30 text-[10px] tracking-heading">
            {formatDate(article.date).toUpperCase()}
          </span>
          <span className="font-heading text-sapling text-[10px] tracking-heading group-hover:tracking-nav transition-all duration-200">
            READ →
          </span>
        </div>
      </div>
    </Link>
  );
}
