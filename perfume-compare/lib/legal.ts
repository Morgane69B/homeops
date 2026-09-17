import { prisma } from "@/lib/prisma";

export async function getLegalPage(slug: string) {
  return prisma.legalPage.findUnique({ where: { slug } });
}

export async function getAllLegalPages() {
  return prisma.legalPage.findMany({ orderBy: { title: "asc" } });
}
