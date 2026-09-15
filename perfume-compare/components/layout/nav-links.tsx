"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const NAV_LINKS = [
  { href: "/parfums", label: "Parfums" },
  { href: "/guide", label: "Le Guide" },
  { href: "/blog", label: "Journal" },
];

export function NavLinks({
  className,
  linkClassName,
  onNavigate,
}: {
  className?: string;
  linkClassName?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className={className}>
      {NAV_LINKS.map((link) => {
        const active = pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              linkClassName,
              "transition-colors hover:text-gold",
              active ? "text-gold" : "text-foreground/70",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
