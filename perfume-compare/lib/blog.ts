import { prisma } from "@/lib/prisma";

const WORDS_PER_MINUTE = 200;

export function computeReadingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export async function getArticles() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    include: { perfumes: { select: { id: true } } },
  });

  return articles.map((article) => ({
    ...article,
    readingTime: computeReadingTime(article.content),
    perfumeCount: article.perfumes.length,
  }));
}

export async function getArticleBySlug(slug: string) {
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      perfumes: {
        include: {
          mainFamily: true,
          notes: true,
          offers: { orderBy: { price: "asc" } },
        },
      },
    },
  });

  if (!article) return null;

  return {
    ...article,
    readingTime: computeReadingTime(article.content),
    perfumes: article.perfumes.map((perfume) => ({
      ...perfume,
      minPrice: perfume.offers.length
        ? Math.min(...perfume.offers.map((o) => Number(o.price)))
        : null,
    })),
  };
}

export type ArticleSummary = Awaited<ReturnType<typeof getArticles>>[number];
export type ArticleDetail = NonNullable<
  Awaited<ReturnType<typeof getArticleBySlug>>
>;
