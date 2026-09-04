"use client";

import { Bell } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useHomeOpsStore } from "@/lib/store";
import { cancellationWindow } from "@/lib/utils";

export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  const subscriptions = useHomeOpsStore((s) => s.subscriptions);
  const urgentCount = subscriptions.filter(
    (s) => s.active && cancellationWindow(s).windowOpen
  ).length;

  return (
    <header className="sticky top-0 z-30 -mx-5 flex items-center justify-between gap-4 bg-background/80 px-5 py-4 backdrop-blur-md md:-mx-8 md:px-8 md:py-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight md:text-2xl">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 dark:border-white/15">
          <Bell className="h-4 w-4 text-muted" />
          {urgentCount > 0 && (
            <span className="glow-coral absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-coral px-1 text-[10px] font-semibold text-white">
              {urgentCount}
            </span>
          )}
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
