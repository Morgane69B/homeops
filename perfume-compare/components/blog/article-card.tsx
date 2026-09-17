import Link from "next/link";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import type { ArticleSummary } from "@/lib/blog";

const DATE_FORMATTER = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function ArticleCard({ article }: { article: ArticleSummary }) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors hover:border-gold/30"
    >
      <div className="relative flex aspect-[16/9] items-center justify-center overflow-hidden bg-gradient-to-br from-luxury-ink to-background">
        {article.coverImage ? (
          <Image
            src={article.coverImage}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <BookOpen className="size-10 text-gold/40 transition-transform duration-300 group-hover:scale-110" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <time dateTime={article.createdAt.toISOString()}>
            {DATE_FORMATTER.format(article.createdAt)}
          </time>
          <span>·</span>
          <span>{article.readingTime} min de lecture</span>
        </div>
        <h2 className="mt-3 font-display text-xl text-foreground">
          {article.title}
        </h2>
        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
          {article.excerpt}
        </p>
      </div>
    </Link>
  );
}
