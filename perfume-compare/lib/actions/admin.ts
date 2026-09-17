"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { CORE_MERCHANT_NAMES } from "@/lib/merchants";

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

  function readOfferFields(prefixId: string) {
    const price = formData.get(`offerPrice_${prefixId}`) ?? formData.get(`corePrice_${prefixId}`);
    const url = formData.get(`offerUrl_${prefixId}`) ?? formData.get(`coreUrl_${prefixId}`);
    const volume = formData.get(`offerVolume_${prefixId}`) ?? formData.get(`coreVolume_${prefixId}`);
    const fields: { price?: number; affiliateUrl?: string; volumeMl?: number } = {};
    if (typeof price === "string" && price.trim() !== "") {
      const value = Number(price);
      if (Number.isFinite(value) && value >= 0) fields.price = value;
    }
    if (typeof url === "string" && url.trim() !== "") {
      fields.affiliateUrl = url.trim();
    }
    if (typeof volume === "string" && volume.trim() !== "") {
      const value = Number(volume);
      if (Number.isInteger(value) && value > 0) fields.volumeMl = value;
    }
    return fields;
  }

  // Fixed roster (Sephora, Nocibé, Parfumdreams, Parfum et Moi, Primor,
  // MyOrigines): the admin toggles each on/off per perfume with +/×.
  const coreMerchants = await prisma.merchant.findMany({
    where: { name: { in: [...CORE_MERCHANT_NAMES] } },
  });
  const activeCoreMerchantIds = new Set(formData.getAll("activeCoreMerchantId"));
  const currentOffers = await prisma.priceOffer.findMany({ where: { perfumeId: id } });
  const currentOfferByMerchantId = new Map(currentOffers.map((o) => [o.merchantId, o]));

  await Promise.all(
    coreMerchants.map((merchant) => {
      const existing = currentOfferByMerchantId.get(merchant.id);
      const isActive = activeCoreMerchantIds.has(merchant.id);

      if (!isActive) {
        return existing ? prisma.priceOffer.delete({ where: { id: existing.id } }) : null;
      }

      const fields = readOfferFields(merchant.id);
      if (existing) {
        return Object.keys(fields).length
          ? prisma.priceOffer.update({ where: { id: existing.id }, data: fields })
          : null;
      }
      return prisma.priceOffer.create({
        data: {
          perfumeId: id,
          merchantId: merchant.id,
          price: fields.price ?? 0,
          volumeMl: fields.volumeMl ?? 50,
          stock: true,
          affiliateUrl: fields.affiliateUrl || merchant.siteUrl,
        },
      });
    }),
  );

  // Anything outside the fixed roster (e.g. a merchant seeded before it
  // existed): still editable, and removed if its row was deleted client-side.
  const extraOfferIds = formData.getAll("offerId") as string[];
  const coreMerchantIds = new Set(coreMerchants.map((m) => m.id));
  const extraCurrentOffers = currentOffers.filter((o) => !coreMerchantIds.has(o.merchantId));

  await Promise.all([
    ...extraOfferIds.map((offerId) => {
      const fields = readOfferFields(offerId);
      if (Object.keys(fields).length === 0) return null;
      return prisma.priceOffer.update({ where: { id: offerId }, data: fields });
    }),
    ...extraCurrentOffers
      .filter((o) => !extraOfferIds.includes(o.id))
      .map((o) => prisma.priceOffer.delete({ where: { id: o.id } })),
  ]);

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

const ArticleSchema = z.object({
  title: z.string().min(1, "Le titre est requis."),
  excerpt: z.string().min(1, "Le résumé est requis."),
  content: z.string().min(1, "Le contenu est requis."),
  coverImage: z.union([z.url("URL d'image invalide."), z.literal("")]),
});

export type ArticleFormResult = { error: string } | { success: true; id: string };

function parseArticleForm(formData: FormData) {
  return ArticleSchema.safeParse({
    title: formData.get("title"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    coverImage: formData.get("coverImage") ?? "",
  });
}

export async function createArticle(
  formData: FormData,
): Promise<ArticleFormResult> {
  await requireAdmin();

  const parsed = parseArticleForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  const data = parsed.data;

  const baseSlug = slugify(data.title);
  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.article.findUnique({ where: { slug } })) {
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  const perfumeIds = formData.getAll("perfumeId") as string[];

  const created = await prisma.article.create({
    data: {
      ...data,
      slug,
      coverImage: data.coverImage || null,
      perfumes: { connect: perfumeIds.map((id) => ({ id })) },
    },
  });

  revalidatePath("/blog");
  revalidatePath("/admin/articles");
  redirect(`/admin/articles/${created.id}`);
}

export async function updateArticle(
  id: string,
  formData: FormData,
): Promise<ArticleFormResult> {
  await requireAdmin();

  const parsed = parseArticleForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  const data = parsed.data;
  const perfumeIds = formData.getAll("perfumeId") as string[];

  const updated = await prisma.article.update({
    where: { id },
    data: {
      ...data,
      coverImage: data.coverImage || null,
      perfumes: { set: perfumeIds.map((perfumeId) => ({ id: perfumeId })) },
    },
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${updated.slug}`);
  revalidatePath("/admin/articles");
  return { success: true, id: updated.id };
}

export async function deleteArticle(id: string) {
  await requireAdmin();
  await prisma.article.delete({ where: { id } });
  revalidatePath("/blog");
  revalidatePath("/admin/articles");
  redirect("/admin/articles");
}

const FamilySchema = z.object({
  name: z.string().min(1, "Le nom est requis."),
  description: z.string().min(1, "La description est requise."),
});

export type FamilyFormResult = { error: string } | { success: true; id: string };

export async function updateFamily(
  id: string,
  formData: FormData,
): Promise<FamilyFormResult> {
  await requireAdmin();

  const parsed = FamilySchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const updated = await prisma.olfactoryFamily.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath("/guide");
  revalidatePath("/parfums");
  revalidatePath("/admin/familles");
  return { success: true, id: updated.id };
}
