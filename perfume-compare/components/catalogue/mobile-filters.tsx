"use client";

import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FiltersContent } from "@/components/catalogue/filters-content";

type Family = { id: string; slug: string; name: string };

export function MobileFilters({
  families,
  priceBounds,
}: {
  families: Family[];
  priceBounds: { min: number; max: number };
}) {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            className="h-11 gap-2 border-white/10 bg-white/[0.03] lg:hidden"
          />
        }
      >
        <SlidersHorizontal className="size-4" />
        Filtres
      </SheetTrigger>
      <SheetContent
        side="left"
        className="overflow-y-auto border-white/10 bg-background/95 backdrop-blur-xl"
      >
        <SheetHeader>
          <SheetTitle className="font-display">Filtres</SheetTitle>
        </SheetHeader>
        <div className="px-4 pb-8">
          <FiltersContent families={families} priceBounds={priceBounds} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
