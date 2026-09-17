import { prisma } from "@/lib/prisma";
import { ArticleForm } from "@/components/admin/article-form";

export default async function NewArticlePage() {
  const perfumes = await prisma.perfume.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, brand: true },
  });

  return (
    <div>
      <h2 className="font-display text-xl text-foreground">Nouvel article</h2>
      <div className="mt-6">
        <ArticleForm mode="create" perfumes={perfumes} />
      </div>
    </div>
  );
}
