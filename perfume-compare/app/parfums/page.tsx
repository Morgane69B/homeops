import type { Metadata } from "next";
import {
  getCatalogue,
  getFilterOptions,
  getPriceBounds,
  parseCatalogueParams,
} from "@/lib/catalogue";
import { SearchBar } from "@/components/catalogue/search-bar";
import { SortSelect } from "@/components/catalogue/sort-select";
import { FiltersContent } from "@/components/catalogue/filters-content";
import { MobileFilters } from "@/components/catalogue/mobile-filters";
import { PerfumeCard } from "@/components/catalogue/perfume-card";
import { getWishlistedIds } from "@/lib/actions/wishlist";

export const metadata: Metadata = {
  title: "Catalogue — Tous les parfums | Essence",
  description:
    "Comparez les prix de dizaines de parfums de grandes maisons et marques de niche. Filtrez par famille olfactive, budget ou notes de composition.",
  alternates: { canonical: "/parfums" },
};

export default async function ParfumsPage({
  searchParams,
}: PageProps<"/parfums">) {
  const params = await searchParams;
  const filters = parseCatalogueParams(params);

  const [priceBounds, { families }, perfumes, wishlistedIds] =
    await Promise.all([
      getPriceBounds(),
      getFilterOptions(),
      getCatalogue(filters),
      getWishlistedIds(),
    ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <span className="text-xs tracking-[0.3em] text-gold uppercase">
        Catalogue
      </span>
      <h1 className="mt-3 font-display text-4xl text-foreground">
        Tous les parfums
      </h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <FiltersContent families={families} priceBounds={priceBounds} />
        </aside>

        <div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <SearchBar />
            </div>
            <div className="flex gap-3">
              <MobileFilters families={families} priceBounds={priceBounds} />
              <SortSelect />
            </div>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            {perfumes.length} parfum{perfumes.length > 1 ? "s" : ""} trouvé
            {perfumes.length > 1 ? "s" : ""} · prix indiqués pour un flacon de
            50 ml
          </p>

          {perfumes.length > 0 ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {perfumes.map((perfume) => (
                <PerfumeCard
                  key={perfume.id}
                  perfume={perfume}
                  isWishlisted={wishlistedIds.has(perfume.id)}
                />
              ))}
            </div>
          ) : (
            <div className="mt-20 flex flex-col items-center gap-2 text-center">
              <p className="font-display text-xl text-foreground">
                Aucun parfum ne correspond à ces critères
              </p>
              <p className="text-sm text-muted-foreground">
                Essayez d&apos;élargir votre budget ou de retirer un filtre.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
