"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CountUp } from "@/components/ui/count-up";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: number;
  formatter: (v: number) => string;
  icon: LucideIcon;
  accent: "indigo" | "emerald" | "coral" | "amber";
  hint?: string;
  delay?: number;
}

const accentClasses: Record<KpiCardProps["accent"], string> = {
  indigo: "text-indigo bg-indigo-soft",
  emerald: "text-emerald bg-emerald-soft",
  coral: "text-coral bg-coral-soft",
  amber: "text-amber bg-amber/10",
};

export function KpiCard({ label, value, formatter, icon: Icon, accent, hint, delay = 0 }: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -3 }}
    >
      <Card className="h-full p-5 transition-shadow hover:shadow-xl">
        <div className="flex items-start justify-between">
          <p className="text-sm font-medium text-muted">{label}</p>
          <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", accentClasses[accent])}>
            <Icon className="h-4.5 w-4.5" strokeWidth={2.2} />
          </div>
        </div>
        <p className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">
          <CountUp value={value} formatter={formatter} />
        </p>
        {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
      </Card>
    </motion.div>
  );
}
