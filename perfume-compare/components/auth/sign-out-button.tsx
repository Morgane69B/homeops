"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export function SignOutButton({ className }: { className?: string }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className={cn(
        "flex items-center gap-2 text-sm text-foreground/70 hover:text-gold",
        className,
      )}
    >
      <LogOut className="size-4" />
      Se déconnecter
    </button>
  );
}
