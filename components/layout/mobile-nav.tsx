"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { navItems } from "./nav-items";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="glass fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-black/5 dark:border-white/5 px-2 py-2 md:hidden">
      {navItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[11px] font-medium transition-colors",
              active ? "text-indigo" : "text-muted"
            )}
          >
            {active && (
              <motion.div
                layoutId="mobile-active"
                className="absolute inset-0 rounded-xl bg-indigo-soft"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
            <item.icon className="relative h-5 w-5" strokeWidth={2} />
            <span className="relative">{item.label.split(" ")[0]}</span>
          </Link>
        );
      })}
    </nav>
  );
}
