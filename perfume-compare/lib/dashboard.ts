import { prisma } from "@/lib/prisma";

export async function getWishlistByFamily(userId: string) {
  const items = await prisma.wishlistItem.findMany({
    where: { userId },
    include: {
      perfume: {
        include: {
          mainFamily: true,
          notes: true,
          offers: { orderBy: { price: "asc" } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const groups = new Map<
    string,
    { family: { id: string; name: string; slug: string }; perfumes: typeof items }
  >();

  for (const item of items) {
    const family = item.perfume.mainFamily;
    if (!groups.has(family.id)) {
      groups.set(family.id, { family, perfumes: [] });
    }
    groups.get(family.id)!.perfumes.push(item);
  }

  return Array.from(groups.values())
    .map((group) => ({
      family: group.family,
      perfumes: group.perfumes.map(({ perfume }) => ({
        ...perfume,
        minPrice: perfume.offers.length
          ? Math.min(...perfume.offers.map((o) => Number(o.price)))
          : null,
      })),
    }))
    .sort((a, b) => a.family.name.localeCompare(b.family.name));
}
