"use client";

import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-indigo text-white shadow-sm hover:shadow-lg hover:shadow-indigo/25 hover:scale-[1.02]",
        secondary:
          "bg-slate-900/5 dark:bg-white/10 text-foreground hover:bg-slate-900/10 dark:hover:bg-white/15 hover:scale-[1.02]",
        outline:
          "border border-black/10 dark:border-white/15 text-foreground hover:bg-slate-900/5 dark:hover:bg-white/5 hover:scale-[1.02]",
        ghost: "text-foreground hover:bg-slate-900/5 dark:hover:bg-white/10",
        destructive: "bg-coral text-white hover:shadow-lg hover:shadow-coral/25 hover:scale-[1.02]",
        emerald: "bg-emerald text-white hover:shadow-lg hover:shadow-emerald/25 hover:scale-[1.02]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
    );
  }
);
Button.displayName = "Button";
