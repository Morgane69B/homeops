import Link from "next/link";
import type { Metadata } from "next";
import { getArticles } from "@/lib/blog";
import { auth } from "@/auth";
import { ArticleCard } from "@/components/blog/article-card";
import { FadeIn } from "@/components/motion/fade-in";

export const metadata: Metadata = {
  title: "Le Journal | Essence",
  description:
    "Sélections, focus ingrédients et conseils de parfumeurs pour aiguiser votre nez avant de comparer les prix.",
};

export default async function BlogPage() {
  const [articles, session] = await Promise.all([getArticles(), auth()]);
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="text-xs tracking-[0.3em] text-gold uppercase">
            Journal
          </span>
          <h1 className="mt-3 font-display text-4xl text-foreground">
            Le journal Essence
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Sélections, focus ingrédients et conseils de parfumeurs — pour
            aiguiser votre nez avant de comparer les prix.
          </p>
        </div>
        {isAdmin && (
          <Link
            href="/admin/articles/new"
            className="rounded-full bg-gold px-4 py-2 text-sm font-medium text-gold-foreground transition-colors hover:bg-gold/90"
          >
            + Nouvel article
          </Link>
        )}
      </div>

      {articles.length > 0 ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, i) => (
            <FadeIn key={article.id} delay={i * 0.08}>
              <ArticleCard article={article} />
            </FadeIn>
          ))}
        </div>
      ) : (
        <p className="mt-20 text-center text-muted-foreground">
          Aucun article publié pour le moment.
        </p>
      )}
    </div>
  );
}
