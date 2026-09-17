"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

const PerfumeSchema = z.object({
  name: z.string().min(1, "Le nom est requis."),
  brand: z.string().min(1, "La marque est requise."),
  gender: z.enum(["HOMME", "FEMME", "MIXTE"]),
  concentration: z.enum([
    "EXTRAIT_DE_PARFUM",
    "EAU_DE_PARFUM",
    "EAU_DE_TOILETTE",
    "EAU_DE_COLOGNE",
  ]),
  mainFamilyId: z.string().min(1, "La famille olfactive est requise."),
  description: z.string().min(1, "La description est requise."),
  imageUrl: z.union([z.url("URL d'image invalide."), z.literal("")]),
});

export type PerfumeFormResult = { error: string } | { success: true; id: string };

function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parsePerfumeForm(formData: FormData) {
  return PerfumeSchema.safeParse({
    name: formData.get("name"),
    brand: formData.get("brand"),
    gender: formData.get("gender"),
    concentration: formData.get("concentration"),
    mainFamilyId: formData.get("mainFamilyId"),
    description: formData.get("description"),
    imageUrl: formData.get("imageUrl") ?? "",
  });
}

export async function createPerfume(
  formData: FormData,
): Promise<PerfumeFormResult> {
  await requireAdmin();

  const parsed = parsePerfumeForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  const data = parsed.data;

  const baseSlug = slugify(`${data.brand}-${data.name}`);
  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.perfume.findUnique({ where: { slug } })) {
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  const created = await prisma.perfume.create({
    data: { ...data, slug, imageUrl: data.imageUrl || null },
  });

  revalidatePath("/parfums");
  revalidatePath("/admin");
  redirect(`/admin/parfums/${created.id}`);
}

export async function updatePerfume(
  id: string,
  formData: FormData,
): Promise<PerfumeFormResult> {
  await requireAdmin();

  const parsed = parsePerfumeForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  const data = parsed.data;

  const perfume = await prisma.perfume.update({
    where: { id },
    data: { ...data, imageUrl: data.imageUrl || null },
  });

  const offerIds = formData.getAll("offerId") as string[];
  await Promise.all(
    offerIds.map((offerId) => {
      const price = formData.get(`offerPrice_${offerId}`);
      const url = formData.get(`offerUrl_${offerId}`);
      const data: { price?: number; affiliateUrl?: string } = {};

      if (typeof price === "string" && price.trim() !== "") {
        const value = Number(price);
        if (Number.isFinite(value) && value >= 0) data.price = value;
      }
      if (typeof url === "string" && url.trim() !== "") {
        data.affiliateUrl = url.trim();
      }
      if (Object.keys(data).length === 0) return null;

      return prisma.priceOffer.update({
        where: { id: offerId },
        data,
      });
    }),
  );

  revalidatePath("/parfums");
  revalidatePath(`/parfums/${perfume.slug}`);
  revalidatePath("/admin");
  return { success: true, id: perfume.id };
}

export async function deletePerfume(id: string) {
  await requireAdmin();
  await prisma.perfume.delete({ where: { id } });
  revalidatePath("/parfums");
  revalidatePath("/admin");
  redirect("/admin");
}
