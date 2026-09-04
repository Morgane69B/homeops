"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Wallet } from "lucide-react";
import { navItems } from "./nav-items";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-40 border-r border-black/5 dark:border-white/5">
      <div className="glass flex h-full flex-col px-4 py-6">
        <div className="mb-8 flex items-center gap-2.5 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo to-indigo/70 shadow-lg shadow-indigo/30">
            <Wallet className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">HomeOps</p>
            <p className="text-[11px] text-muted leading-tight">Foyer sous contrôle</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "text-indigo" : "text-muted hover:text-foreground"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-indigo-soft"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <item.icon className="relative h-4.5 w-4.5" strokeWidth={2} />
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="rounded-xl bg-gradient-to-br from-indigo/10 to-emerald/10 p-4">
          <p className="text-xs font-medium text-foreground">Astuce Loi Hamon</p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted">
            Après 12 mois d&apos;engagement, résiliez vos contrats d&apos;assurance à tout moment, sans frais.
          </p>
        </div>
      </div>
    </aside>
  );
}
