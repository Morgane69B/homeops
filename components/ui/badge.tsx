import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        indigo: "bg-indigo-soft text-indigo",
        emerald: "bg-emerald-soft text-emerald",
        coral: "bg-coral-soft text-coral",
        amber: "bg-amber/15 text-amber",
        neutral: "bg-slate-900/5 dark:bg-white/10 text-muted",
      },
    },
    defaultVariants: { variant: "neutral" },
  }
);

interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
