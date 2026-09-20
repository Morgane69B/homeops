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
  isOfficial: boolean;
  updatedAt: Date | string;
  merchant: { id: string; name: string; siteUrl: string };
};

function formatRelativeTime(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  const seconds = Math.max(0, Math.round((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return "à l'instant";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.round(hours / 24);
  if (days === 1) return "hier";
  if (days < 30) return `il y a ${days} j`;
  const months = Math.round(days / 30);
  if (months < 12) return `il y a ${months} mois`;
  const years = Math.round(days / 365);
  return `il y a ${years} an${years > 1 ? "s" : ""}`;
}

export function PriceTable({ offers }: { offers: Offer[] }) {
  const [sortBy, setSortBy] = useState<"prix" | "disponibilite">("prix");

  const mostRecentUpdate = useMemo(() => {
    if (offers.length === 0) return null;
    const times = offers.map((o) =>
      (o.updatedAt instanceof Date ? o.updatedAt : new Date(o.updatedAt)).getTime(),
    );
    return new Date(Math.max(...times));
  }, [offers]);

  const sorted = useMemo(() => {
    const official = offers.filter((o) => o.isOfficial);
    const rest = offers.filter((o) => !o.isOfficial);
    if (sortBy === "prix") {
      rest.sort((a, b) => Number(a.price) - Number(b.price));
    } else {
      rest.sort((a, b) => Number(b.stock) - Number(a.stock));
    }
    // The official brand site always leads the list, regardless of price.
    return [...official, ...rest];
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
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-white/10 bg-white/[0.03] px-5 py-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
            {offers.length} marchand{offers.length > 1 ? "s" : ""}
          </span>
          {mostRecentUpdate && (
            <span className="text-xs text-muted-foreground">
              · Prix mis à jour {formatRelativeTime(mostRecentUpdate)}
            </span>
          )}
        </div>
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
            className={cn(
              "flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between",
              offer.isOfficial ? "bg-gold/[0.06]" : "bg-white/[0.02]",
            )}
          >
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-background/60">
                <Store className="size-4 text-muted-foreground" />
              </span>
              <div>
                <p className="text-sm text-foreground">{offer.merchant.name}</p>
                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>{offer.volumeMl} ml</span>
                  <span>·</span>
                  <span
                    className={
                      offer.stock ? "text-emerald" : "text-muted-foreground"
                    }
                  >
                    {offer.stock ? "En stock" : "Rupture de stock"}
                  </span>
                  <span>·</span>
                  <span title={new Date(offer.updatedAt).toLocaleString("fr-FR")}>
                    {formatRelativeTime(offer.updatedAt)}
                  </span>
                  {offer.isOfficial && (
                    <Badge className="border-gold/30 bg-gold/10 text-gold">
                      Site officiel de la marque
                    </Badge>
                  )}
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
