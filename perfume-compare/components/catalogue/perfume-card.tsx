import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CataloguePerfume } from "@/lib/catalogue";
import { resolvePerfumeImage } from "@/lib/product-image";
import { WishlistButton } from "@/components/catalogue/wishlist-button";

const CONCENTRATION_LABELS: Record<string, string> = {
  EXTRAIT_DE_PARFUM: "Extrait",
  EAU_DE_PARFUM: "Eau de Parfum",
  EAU_DE_TOILETTE: "Eau de Toilette",
  EAU_DE_COLOGNE: "Eau de Cologne",
};

export function PerfumeCard({
  perfume,
  isWishlisted = false,
}: {
  perfume: CataloguePerfume;
  isWishlisted?: boolean;
}) {
  const image = resolvePerfumeImage(perfume);

  return (
    <Link
      href={`/parfums/${perfume.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors hover:border-gold/30"
    >
      <div className="relative aspect-square overflow-hidden bg-luxury-ink">
        <Image
          src={image}
          alt={`${perfume.name} — ${perfume.brand}`}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 640px) 40vw, 90vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.08]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-luxury-black/70 via-transparent to-luxury-black/10" />

        <span className="absolute top-3 left-3 rounded-full bg-background/70 px-2.5 py-1 text-[10px] tracking-wide text-foreground/90 uppercase backdrop-blur-sm">
          {perfume.brand}
        </span>
        <div className="absolute top-3 right-3">
          <WishlistButton perfumeId={perfume.id} initialWishlisted={isWishlisted} />
        </div>

        <div className="absolute inset-x-3 bottom-3 flex translate-y-2 items-center gap-1 text-xs text-gold opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          Voir la fiche
          <ArrowUpRight className="size-3.5" />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs tracking-wide text-muted-foreground uppercase">
          {perfume.brand}
        </span>
        <h3 className="mt-1 font-display text-lg text-foreground">
          {perfume.name}
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <span>{perfume.mainFamily.name}</span>
          <span>·</span>
          <span>{CONCENTRATION_LABELS[perfume.concentration]}</span>
        </div>
        <div className="mt-auto flex items-baseline gap-1.5 pt-4">
          {perfume.minPrice != null ? (
            <>
              <span className="text-xs text-muted-foreground">dès</span>
              <span className="font-display text-xl text-gold">
                {perfume.minPrice.toFixed(2)} €
              </span>
            </>
          ) : (
            <span className="text-xs text-muted-foreground">
              Aucune offre disponible
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
