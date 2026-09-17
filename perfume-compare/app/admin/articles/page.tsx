import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { perfumes: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {articles.length} article{articles.length > 1 ? "s" : ""}
        </p>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-sm font-medium text-gold-foreground transition-colors hover:bg-gold/90"
        >
          <Plus className="size-4" />
          Nouvel article
        </Link>
      </div>

      <div className="mt-6 divide-y divide-white/10 rounded-2xl border border-white/10">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/admin/articles/${article.id}`}
            className="flex items-center gap-4 p-4 transition-colors hover:bg-white/[0.03]"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-lg text-foreground">
                {article.title}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {article.excerpt}
              </p>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">
              {article._count.perfumes} parfum
              {article._count.perfumes > 1 ? "s" : ""} lié
              {article._count.perfumes > 1 ? "s" : ""}
            </span>
          </Link>
        ))}
        {articles.length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">
            Aucun article pour le moment.
          </p>
        )}
      </div>
    </div>
  );
}
