"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCatalogueUrl } from "@/components/catalogue/use-catalogue-url";

export function SearchBar() {
  const { searchParams, setParam } = useCatalogueUrl();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setParam("q", value || null);
    }, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    const urlValue = searchParams.get("q") ?? "";
    setValue((current) => (current === urlValue ? current : urlValue));
  }, [searchParams]);

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Rechercher un parfum ou une marque..."
        className="h-11 border-white/10 bg-white/[0.03] pl-10 focus-visible:ring-gold/40"
      />
    </div>
  );
}
