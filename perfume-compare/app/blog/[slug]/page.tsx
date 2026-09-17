import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticleBySlug } from "@/lib/blog";
import { getWishlistedIds } from "@/lib/actions/wishlist";
import { auth } from "@/auth";
import { PerfumeCard } from "@/components/catalogue/perfume-card";

const DATE_FORMATTER = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: `${article.title} | Essence`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const [wishlistedIds, session] = await Promise.all([
    getWishlistedIds(),
    auth(),
  ]);
  const isAdmin = session?.user?.role === "ADMIN";
  const paragraphs = article.content.split("\n\n");

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <nav className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/blog" className="hover:text-gold">
          Journal
        </Link>
        <span>/</span>
        <span className="text-foreground/70">{article.title}</span>
      </nav>

      {article.coverImage && (
        <div className="relative mt-6 aspect-[21/9] overflow-hidden rounded-2xl">
          <Image
            src={article.coverImage}
            alt=""
            fill
            sizes="(min-width: 1024px) 768px, 100vw"
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
        <time dateTime={article.createdAt.toISOString()}>
          {DATE_FORMATTER.format(article.createdAt)}
        </time>
        <span>·</span>
        <span>{article.readingTime} min de lecture</span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <h1 className="font-display text-4xl text-foreground sm:text-5xl">
          {article.title}
        </h1>
        {isAdmin && (
          <Link
            href={`/admin/articles/${article.id}`}
            className="text-xs text-muted-foreground underline-offset-2 hover:text-gold hover:underline"
          >
            Modifier
          </Link>
        )}
      </div>

      <div className="mt-10 space-y-5 text-base leading-relaxed text-foreground/80">
        {paragraphs.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {article.perfumes.length > 0 && (
        <section className="mt-16 border-t border-white/10 pt-10">
          <span className="text-xs tracking-[0.3em] text-gold uppercase">
            Cités dans cet article
          </span>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {article.perfumes.map((perfume) => (
              <PerfumeCard
                key={perfume.id}
                perfume={perfume}
                isWishlisted={wishlistedIds.has(perfume.id)}
              />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
