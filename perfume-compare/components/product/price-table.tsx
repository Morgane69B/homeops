"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Offer = {
  id: string;
  price: number;
  volumeMl: number;
  stock: boolean;
  affiliateUrl: string;
  merchant: { id: string; name: string; siteUrl: string };
};

export function PriceTable({ offers }: { offers: Offer[] }) {
  const [sortBy, setSortBy] = useState<"prix" | "disponibilite">("prix");

  const sorted = useMemo(() => {
    const copy = [...offers];
    if (sortBy === "prix") {
      copy.sort((a, b) => Number(a.price) - Number(b.price));
    } else {
      copy.sort((a, b) => Number(b.stock) - Number(a.stock));
    }
    return copy;
  }, [offers, sortBy]);

  const bestPriceId = useMemo(() => {
    const candidates = offers.filter((o) => o.stock);
    const pool = candidates.length ? candidates : offers;
    return pool.length
      ? pool.reduce((best, o) => (o.price < best.price ? o : best)).id
      : null;
  }, [offers]);

  if (offers.length === 0) {
    return (
      <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-muted-foreground">
        Aucune offre disponible pour ce parfum actuellement.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-5 py-3">
        <span className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
          {offers.length} marchand{offers.length > 1 ? "s" : ""}
        </span>
        <div className="flex gap-1 text-xs">
          <button
            onClick={() => setSortBy("prix")}
            className={cn(
              "rounded-full px-3 py-1 transition-colors",
              sortBy === "prix"
                ? "bg-gold text-gold-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Meilleur prix
          </button>
          <button
            onClick={() => setSortBy("disponibilite")}
            className={cn(
              "rounded-full px-3 py-1 transition-colors",
              sortBy === "disponibilite"
                ? "bg-gold text-gold-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Disponibilité
          </button>
        </div>
      </div>

      <div className="divide-y divide-white/10">
        {sorted.map((offer) => (
          <div
            key={offer.id}
            className="flex flex-col gap-3 bg-white/[0.02] p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-background/60">
                <Store className="size-4 text-muted-foreground" />
              </span>
              <div>
                <p className="text-sm text-foreground">{offer.merchant.name}</p>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{offer.volumeMl} ml</span>
                  <span>·</span>
                  <span
                    className={
                      offer.stock ? "text-emerald" : "text-muted-foreground"
                    }
                  >
                    {offer.stock ? "En stock" : "Rupture de stock"}
                  </span>
                  {offer.id === bestPriceId && (
                    <Badge className="border-gold/30 bg-gold/10 text-gold">
                      Meilleur prix
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <span className="font-display text-xl text-foreground">
                {Number(offer.price).toFixed(2)} €
              </span>
              {offer.stock ? (
                <Button
                  className="gap-1.5 bg-gold text-gold-foreground hover:bg-gold/90"
                  nativeButton={false}
                  render={
                    <a
                      href={offer.affiliateUrl}
                      target="_blank"
                      rel="nofollow noopener noreferrer sponsored"
                    />
                  }
                >
                  Voir l&apos;offre
                  <ExternalLink className="size-3.5" />
                </Button>
              ) : (
                <Button disabled variant="outline" className="gap-1.5">
                  Indisponible
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
