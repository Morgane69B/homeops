"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCatalogueUrl } from "@/components/catalogue/use-catalogue-url";

const OPTIONS = [
  { value: "nouveaute", label: "Nouveautés" },
  { value: "prix-asc", label: "Prix croissant" },
  { value: "prix-desc", label: "Prix décroissant" },
  { value: "nom", label: "Nom (A-Z)" },
];

export function SortSelect() {
  const { searchParams, setParam } = useCatalogueUrl();
  const value = searchParams.get("tri") ?? "nouveaute";

  return (
    <Select
      value={value}
      items={Object.fromEntries(OPTIONS.map((o) => [o.value, o.label]))}
      onValueChange={(v) => setParam("tri", v === "nouveaute" ? null : v)}
    >
      <SelectTrigger className="h-11 w-fit border-white/10 bg-white/[0.03]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
