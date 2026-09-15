"use client";

import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useCatalogueUrl } from "@/components/catalogue/use-catalogue-url";

type Family = { id: string; slug: string; name: string };

export function FiltersContent({
  families,
  priceBounds,
}: {
  families: Family[];
  priceBounds: { min: number; max: number };
}) {
  const { searchParams, setParam, toggleListValue, clearAll } = useCatalogueUrl();

  const activeFamilies = searchParams.get("familles")?.split(",").filter(Boolean) ?? [];
  const activeNotes = searchParams.get("notes")?.split(",").filter(Boolean) ?? [];

  const urlMin = searchParams.get("prixMin");
  const urlMax = searchParams.get("prixMax");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    urlMin ? Number(urlMin) : priceBounds.min,
    urlMax ? Number(urlMax) : priceBounds.max,
  ]);

  useEffect(() => {
    setPriceRange([
      urlMin ? Number(urlMin) : priceBounds.min,
      urlMax ? Number(urlMax) : priceBounds.max,
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlMin, urlMax]);

  function commitPriceRange(next: [number, number]) {
    setParam("prixMin", next[0] > priceBounds.min ? String(next[0]) : null);
    setParam("prixMax", next[1] < priceBounds.max ? String(next[1]) : null);
  }

  const hasActiveFilters =
    activeFamilies.length > 0 ||
    activeNotes.length > 0 ||
    urlMin !== null ||
    urlMax !== null ||
    !!searchParams.get("q");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-foreground">Filtres</h2>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-muted-foreground underline-offset-2 hover:text-gold hover:underline"
          >
            Réinitialiser
          </button>
        )}
      </div>

      <div>
        <h3 className="text-xs tracking-[0.2em] text-gold uppercase">Budget</h3>
        <div className="mt-5 px-1">
          <Slider
            min={priceBounds.min}
            max={priceBounds.max}
            step={5}
            value={priceRange}
            onValueChange={(v) => setPriceRange(v as [number, number])}
            onValueCommitted={(v) => commitPriceRange(v as [number, number])}
          />
          <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
            <span>{priceRange[0]} €</span>
            <span>{priceRange[1]} €</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs tracking-[0.2em] text-gold uppercase">
          Familles olfactives
        </h3>
        <div className="mt-4 space-y-3">
          {families.map((family) => (
            <Label
              key={family.id}
              className="flex items-center gap-2.5 text-sm font-normal text-foreground/80"
            >
              <Checkbox
                checked={activeFamilies.includes(family.slug)}
                onCheckedChange={() => toggleListValue("familles", family.slug)}
              />
              {family.name}
            </Label>
          ))}
        </div>
      </div>

      {activeNotes.length > 0 && (
        <div>
          <h3 className="text-xs tracking-[0.2em] text-gold uppercase">
            Notes choisies
          </h3>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {activeNotes.map((note) => (
              <Badge
                key={note}
                variant="secondary"
                className="cursor-pointer gap-1 border-white/10 bg-white/5 text-foreground/70 hover:text-gold"
                onClick={() => toggleListValue("notes", note)}
              >
                {note} ×
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
