"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const navItems = [
  { href: "/onboarding-express/manager", label: "Espace Manager" },
  { href: "/onboarding-express/employe", label: "Espace Employé" },
];

export function OnboardingTopbar() {
  const pathname = usePathname();

  return (
    <header className="glass sticky top-0 z-30 border-b border-black/5 dark:border-white/5">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <Link href="/onboarding-express/manager" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo to-indigo/70 shadow-lg shadow-indigo/30">
            <GraduationCap className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">Onboarding Express</p>
            <p className="text-[11px] text-muted leading-tight">Le Petit Bouchon</p>
          </div>
        </Link>

        <nav className="relative flex items-center gap-1 rounded-xl bg-slate-900/5 dark:bg-white/5 p-1">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  active ? "text-foreground" : "text-muted hover:text-foreground"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="onboarding-nav-active"
                    className="absolute inset-0 rounded-lg bg-white shadow-sm dark:bg-slate-800"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
