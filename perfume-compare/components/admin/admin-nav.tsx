"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/admin", label: "Parfums", match: (path: string) => path === "/admin" || path.startsWith("/admin/parfums") },
  { href: "/admin/articles", label: "Journal", match: (path: string) => path.startsWith("/admin/articles") },
  { href: "/admin/familles", label: "Guide", match: (path: string) => path.startsWith("/admin/familles") },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 border-b border-white/10">
      {TABS.map((tab) => {
        const active = tab.match(pathname);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "border-b-2 px-4 py-2.5 text-sm transition-colors",
              active
                ? "border-gold text-gold"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
