import { getArticles } from "@/lib/blog";
import { ArticleCard } from "@/components/blog/article-card";
import { FadeIn } from "@/components/motion/fade-in";

export default async function BlogPage() {
  const articles = await getArticles();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
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
