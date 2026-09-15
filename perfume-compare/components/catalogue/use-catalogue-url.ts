"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useCatalogueUrl() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const toggleListValue = useCallback(
    (key: string, value: string) => {
      const current = searchParams.get(key);
      const values = current ? current.split(",").filter(Boolean) : [];
      const next = values.includes(value)
        ? values.filter((v) => v !== value)
        : [...values, value];
      setParam(key, next.length ? next.join(",") : null);
    },
    [searchParams, setParam],
  );

  const clearAll = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  return { searchParams, setParam, toggleListValue, clearAll };
}
