"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function toggleWishlist(
  perfumeId: string,
): Promise<{ ok: true; wishlisted: boolean } | { ok: false; requiresAuth: true }> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { ok: false, requiresAuth: true };
  }

  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_perfumeId: { userId, perfumeId } },
  });

  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
    revalidatePath("/dashboard");
    return { ok: true, wishlisted: false };
  }

  await prisma.wishlistItem.create({ data: { userId, perfumeId } });
  revalidatePath("/dashboard");
  return { ok: true, wishlisted: true };
}

export async function getWishlistedIds(): Promise<Set<string>> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return new Set();

  const items = await prisma.wishlistItem.findMany({
    where: { userId },
    select: { perfumeId: true },
  });
  return new Set(items.map((i) => i.perfumeId));
}
