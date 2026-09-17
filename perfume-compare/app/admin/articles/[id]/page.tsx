import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArticleForm } from "@/components/admin/article-form";

export default async function EditArticlePage({
  params,
}: PageProps<"/admin/articles/[id]">) {
  const { id } = await params;

  const [article, perfumes] = await Promise.all([
    prisma.article.findUnique({
      where: { id },
      include: { perfumes: { select: { id: true } } },
    }),
    prisma.perfume.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, brand: true },
    }),
  ]);

  if (!article) notFound();

  return (
    <div>
      <h2 className="font-display text-xl text-foreground">{article.title}</h2>
      <div className="mt-6">
        <ArticleForm
          mode="edit"
          perfumes={perfumes}
          article={{
            id: article.id,
            title: article.title,
            excerpt: article.excerpt,
            content: article.content,
            coverImage: article.coverImage,
            perfumeIds: article.perfumes.map((p) => p.id),
          }}
        />
      </div>
    </div>
  );
}
