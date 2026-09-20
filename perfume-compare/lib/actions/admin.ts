"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { CORE_MERCHANT_NAMES } from "@/lib/merchants";

// <textarea> values are normalized to CRLF by the browser on form submit
// (per the HTML form-data-set spec); multi-line fields are later split on
// bare "\n\n", so every one of them needs this before it's stored.
function normalizeNewlines(value: string) {
  return value.replace(/\r\n/g, "\n");
}

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
  description: z.string().min(1, "La description est requise.").transform(normalizeNewlines),
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

function readOfferFields(formData: FormData, prefixId: string) {
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

/**
 * Applies the merchants section (fixed roster + official brand site + any
 * extra/legacy offers) of the perfume form to a perfume that already has an
 * id — used by both create (right after the row is inserted) and update.
 */
async function applyOfferChanges(perfumeId: string, brand: string, formData: FormData) {
  const coreMerchants = await prisma.merchant.findMany({
    where: { name: { in: [...CORE_MERCHANT_NAMES] } },
  });
  const activeCoreMerchantIds = new Set(formData.getAll("activeCoreMerchantId"));
  const currentOffers = await prisma.priceOffer.findMany({ where: { perfumeId } });
  const currentOfferByMerchantId = new Map(currentOffers.map((o) => [o.merchantId, o]));

  await Promise.all(
    coreMerchants.map((merchant) => {
      const existing = currentOfferByMerchantId.get(merchant.id);
      const isActive = activeCoreMerchantIds.has(merchant.id);

      if (!isActive) {
        return existing ? prisma.priceOffer.delete({ where: { id: existing.id } }) : null;
      }

      const fields = readOfferFields(formData, merchant.id);
      if (existing) {
        return Object.keys(fields).length
          ? prisma.priceOffer.update({ where: { id: existing.id }, data: fields })
          : null;
      }
      return prisma.priceOffer.create({
        data: {
          perfumeId,
          merchantId: merchant.id,
          price: fields.price ?? 0,
          volumeMl: fields.volumeMl ?? 50,
          stock: true,
          affiliateUrl: fields.affiliateUrl || merchant.siteUrl,
        },
      });
    }),
  );

  // The brand's own official site: always pinned first on the public price
  // table (see PriceTable), independent of the fixed roster and its price.
  const officialActive = formData.get("officialActive") === "1";
  const existingOfficial = currentOffers.find((o) => o.isOfficial);
  if (!officialActive) {
    if (existingOfficial) {
      await prisma.priceOffer.delete({ where: { id: existingOfficial.id } });
    }
  } else {
    const officialFields = {
      price: (() => {
        const v = formData.get("officialPrice");
        const n = typeof v === "string" ? Number(v) : NaN;
        return Number.isFinite(n) && n >= 0 ? n : (existingOfficial ? undefined : 0);
      })(),
      affiliateUrl: (() => {
        const v = formData.get("officialUrl");
        return typeof v === "string" && v.trim() !== "" ? v.trim() : undefined;
      })(),
      volumeMl: (() => {
        const v = formData.get("officialVolume");
        const n = typeof v === "string" ? Number(v) : NaN;
        return Number.isInteger(n) && n > 0 ? n : (existingOfficial ? undefined : 50);
      })(),
    };
    const officialMerchant = await prisma.merchant.upsert({
      where: { name: brand },
      update: {},
      create: { name: brand, siteUrl: officialFields.affiliateUrl ?? "" },
    });
    if (existingOfficial) {
      const updateData = Object.fromEntries(
        Object.entries(officialFields).filter(([, v]) => v !== undefined),
      );
      if (Object.keys(updateData).length) {
        await prisma.priceOffer.update({ where: { id: existingOfficial.id }, data: updateData });
      }
    } else {
      await prisma.priceOffer.create({
        data: {
          perfumeId,
          merchantId: officialMerchant.id,
          price: officialFields.price ?? 0,
          volumeMl: officialFields.volumeMl ?? 50,
          stock: true,
          isOfficial: true,
          affiliateUrl: officialFields.affiliateUrl || officialMerchant.siteUrl,
        },
      });
    }
  }

  // Anything outside the fixed roster and the official offer (e.g. a
  // merchant seeded before it existed): still editable, removed if its row
  // was deleted client-side.
  const extraOfferIds = formData.getAll("offerId") as string[];
  const coreMerchantIds = new Set(coreMerchants.map((m) => m.id));
  const extraCurrentOffers = currentOffers.filter(
    (o) => !o.isOfficial && !coreMerchantIds.has(o.merchantId),
  );

  await Promise.all([
    ...extraOfferIds.map((offerId) => {
      const fields = readOfferFields(formData, offerId);
      if (Object.keys(fields).length === 0) return null;
      return prisma.priceOffer.update({ where: { id: offerId }, data: fields });
    }),
    ...extraCurrentOffers
      .filter((o) => !extraOfferIds.includes(o.id))
      .map((o) => prisma.priceOffer.delete({ where: { id: o.id } })),
  ]);
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

  const noteIds = formData.getAll("noteId") as string[];

  const created = await prisma.perfume.create({
    data: {
      ...data,
      slug,
      imageUrl: data.imageUrl || null,
      notes: { connect: noteIds.map((noteId) => ({ id: noteId })) },
    },
  });

  await applyOfferChanges(created.id, data.brand, formData);

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
  const noteIds = formData.getAll("noteId") as string[];

  const perfume = await prisma.perfume.update({
    where: { id },
    data: {
      ...data,
      imageUrl: data.imageUrl || null,
      notes: { set: noteIds.map((noteId) => ({ id: noteId })) },
    },
  });

  await applyOfferChanges(id, data.brand, formData);

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
  excerpt: z.string().min(1, "Le résumé est requis.").transform(normalizeNewlines),
  content: z.string().min(1, "Le contenu est requis.").transform(normalizeNewlines),
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
  description: z.string().min(1, "La description est requise.").transform(normalizeNewlines),
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

const LEGAL_PATHS: Record<string, string> = {
  "mentions-legales": "/mentions-legales",
  confidentialite: "/confidentialite",
  cgu: "/cgu",
};

const LegalPageSchema = z.object({
  title: z.string().min(1, "Le titre est requis."),
  content: z.string().min(1, "Le contenu est requis.").transform(normalizeNewlines),
});

export type LegalPageFormResult = { error: string } | { success: true; id: string };

export async function updateLegalPage(
  id: string,
  formData: FormData,
): Promise<LegalPageFormResult> {
  await requireAdmin();

  const parsed = LegalPageSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const updated = await prisma.legalPage.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath(LEGAL_PATHS[updated.slug] ?? "/");
  revalidatePath("/admin/legal");
  return { success: true, id: updated.id };
}

const GuideTipSchema = z.object({
  title: z.string().min(1, "Le titre est requis."),
  body: z.string().min(1, "Le texte est requis.").transform(normalizeNewlines),
});

export type GuideTipFormResult = { error: string } | { success: true; id: string };

export async function createGuideTip(
  formData: FormData,
): Promise<GuideTipFormResult> {
  await requireAdmin();

  const parsed = GuideTipSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const maxOrder = await prisma.guideTip.aggregate({ _max: { order: true } });
  const created = await prisma.guideTip.create({
    data: { ...parsed.data, order: (maxOrder._max.order ?? -1) + 1 },
  });

  revalidatePath("/guide");
  revalidatePath("/admin/guide");
  redirect("/admin/guide");
}

export async function updateGuideTip(
  id: string,
  formData: FormData,
): Promise<GuideTipFormResult> {
  await requireAdmin();

  const parsed = GuideTipSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const updated = await prisma.guideTip.update({ where: { id }, data: parsed.data });

  revalidatePath("/guide");
  revalidatePath("/admin/guide");
  return { success: true, id: updated.id };
}

export async function deleteGuideTip(id: string) {
  await requireAdmin();
  await prisma.guideTip.delete({ where: { id } });
  revalidatePath("/guide");
  revalidatePath("/admin/guide");
  redirect("/admin/guide");
}

const SiteSettingsSchema = z.object({
  heroEyebrow: z.string().min(1, "Requis."),
  heroTitle: z.string().min(1, "Requis."),
  heroDescription: z.string().min(1, "Requis.").transform(normalizeNewlines),
  heroCtaPrimary: z.string().min(1, "Requis."),
  heroCtaSecondary: z.string().min(1, "Requis."),
  pillar1Title: z.string().min(1, "Requis."),
  pillar1Description: z.string().min(1, "Requis.").transform(normalizeNewlines),
  pillar2Title: z.string().min(1, "Requis."),
  pillar2Description: z.string().min(1, "Requis.").transform(normalizeNewlines),
  pillar3Title: z.string().min(1, "Requis."),
  pillar3Description: z.string().min(1, "Requis.").transform(normalizeNewlines),
  familiesEyebrow: z.string().min(1, "Requis."),
  familiesTitle: z.string().min(1, "Requis."),
  footerTagline: z.string().min(1, "Requis.").transform(normalizeNewlines),
});

export type SiteSettingsFormResult = { error: string } | { success: true };

export async function updateSiteSettings(
  formData: FormData,
): Promise<SiteSettingsFormResult> {
  await requireAdmin();

  const parsed = SiteSettingsSchema.safeParse(
    Object.fromEntries(SiteSettingsSchema.keyof().options.map((key) => [key, formData.get(key)])),
  );
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: parsed.data,
    create: { id: "singleton", ...parsed.data },
  });

  revalidatePath("/");
  revalidatePath("/admin/site");
  return { success: true };
}
