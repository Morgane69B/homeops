import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://essence-opal.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [perfumes, articles] = await Promise.all([
    prisma.perfume.findMany({ select: { slug: true, createdAt: true } }),
    prisma.article.findMany({ select: { slug: true, createdAt: true } }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/parfums`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/guide`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/blog`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/mentions-legales`, changeFrequency: "yearly", priority: 0.1 },
    { url: `${BASE_URL}/confidentialite`, changeFrequency: "yearly", priority: 0.1 },
    { url: `${BASE_URL}/cgu`, changeFrequency: "yearly", priority: 0.1 },
  ];

  const perfumeRoutes: MetadataRoute.Sitemap = perfumes.map((p) => ({
    url: `${BASE_URL}/parfums/${p.slug}`,
    lastModified: p.createdAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${BASE_URL}/blog/${a.slug}`,
    lastModified: a.createdAt,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...perfumeRoutes, ...articleRoutes];
}
