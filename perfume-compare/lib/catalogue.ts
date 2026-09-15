import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/lib/generated/prisma/client";

export type SortOption = "prix-asc" | "prix-desc" | "nouveaute" | "nom";

export type CatalogueSearchParams = {
  [key: string]: string | string[] | undefined;
};

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export type ParsedCatalogueFilters = {
  q: string;
  familles: string[];
  notes: string[];
  prixMin: number | null;
  prixMax: number | null;
  tri: SortOption;
};

const SORT_OPTIONS: SortOption[] = ["prix-asc", "prix-desc", "nouveaute", "nom"];

export function parseCatalogueParams(
  params: CatalogueSearchParams,
): ParsedCatalogueFilters {
  const q = first(params.q);
  const familles = first(params.familles);
  const notes = first(params.notes);
  const prixMin = first(params.prixMin);
  const prixMax = first(params.prixMax);
  const triRaw = first(params.tri);

  const tri = SORT_OPTIONS.includes(triRaw as SortOption)
    ? (triRaw as SortOption)
    : "nouveaute";

  return {
    q: q?.trim() ?? "",
    familles: familles ? familles.split(",").filter(Boolean) : [],
    notes: notes ? notes.split(",").filter(Boolean) : [],
    prixMin: prixMin ? Number(prixMin) : null,
    prixMax: prixMax ? Number(prixMax) : null,
    tri,
  };
}

export async function getPriceBounds() {
  const result = await prisma.priceOffer.aggregate({
    _min: { price: true },
    _max: { price: true },
  });
  return {
    min: result._min.price ? Math.floor(Number(result._min.price)) : 0,
    max: result._max.price ? Math.ceil(Number(result._max.price)) : 500,
  };
}

export async function getFilterOptions() {
  const [families, notes] = await Promise.all([
    prisma.olfactoryFamily.findMany({ orderBy: { name: "asc" } }),
    prisma.note.findMany({ orderBy: { name: "asc" } }),
  ]);
  return { families, notes };
}

export async function getCatalogue(filters: ParsedCatalogueFilters) {
  const where: Prisma.PerfumeWhereInput = {
    AND: [
      filters.q
        ? {
            OR: [
              { name: { contains: filters.q, mode: "insensitive" } },
              { brand: { contains: filters.q, mode: "insensitive" } },
            ],
          }
        : {},
      filters.familles.length
        ? { mainFamily: { slug: { in: filters.familles } } }
        : {},
      filters.notes.length
        ? {
            AND: filters.notes.map((name) => ({
              notes: { some: { name } },
            })),
          }
        : {},
      filters.prixMin != null || filters.prixMax != null
        ? {
            offers: {
              some: {
                price: {
                  ...(filters.prixMin != null ? { gte: filters.prixMin } : {}),
                  ...(filters.prixMax != null ? { lte: filters.prixMax } : {}),
                },
              },
            },
          }
        : {},
    ],
  };

  const perfumes = await prisma.perfume.findMany({
    where,
    include: {
      mainFamily: true,
      notes: true,
      offers: { orderBy: { price: "asc" } },
    },
    orderBy: filters.tri === "nom" ? { name: "asc" } : { createdAt: "desc" },
  });

  const withPrice = perfumes.map((perfume) => ({
    ...perfume,
    minPrice: perfume.offers.length
      ? Math.min(...perfume.offers.map((o) => Number(o.price)))
      : null,
  }));

  if (filters.tri === "prix-asc") {
    withPrice.sort((a, b) => (a.minPrice ?? Infinity) - (b.minPrice ?? Infinity));
  } else if (filters.tri === "prix-desc") {
    withPrice.sort((a, b) => (b.minPrice ?? -Infinity) - (a.minPrice ?? -Infinity));
  }

  return withPrice;
}

export type CataloguePerfume = Awaited<ReturnType<typeof getCatalogue>>[number];

export async function getPerfumeBySlug(slug: string) {
  const perfume = await prisma.perfume.findUnique({
    where: { slug },
    include: {
      mainFamily: true,
      notes: true,
      articles: { orderBy: { createdAt: "desc" } },
      offers: {
        orderBy: { price: "asc" },
        include: { merchant: true },
      },
    },
  });

  if (!perfume) return null;

  return {
    ...perfume,
    minPrice: perfume.offers.length
      ? Math.min(...perfume.offers.map((o) => Number(o.price)))
      : null,
  };
}

export type PerfumeDetail = NonNullable<
  Awaited<ReturnType<typeof getPerfumeBySlug>>
>;

export async function getRelatedPerfumes(
  familyId: string,
  excludeId: string,
  take = 3,
) {
  const perfumes = await prisma.perfume.findMany({
    where: { mainFamilyId: familyId, id: { not: excludeId } },
    include: { mainFamily: true, notes: true, offers: { orderBy: { price: "asc" } } },
    take,
  });

  return perfumes.map((perfume) => ({
    ...perfume,
    minPrice: perfume.offers.length
      ? Math.min(...perfume.offers.map((o) => Number(o.price)))
      : null,
  }));
}
