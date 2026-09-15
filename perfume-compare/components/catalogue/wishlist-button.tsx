"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toggleWishlist } from "@/lib/actions/wishlist";

export function WishlistButton({
  perfumeId,
  initialWishlisted,
  variant = "icon",
}: {
  perfumeId: string;
  initialWishlisted: boolean;
  variant?: "icon" | "label";
}) {
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    startTransition(async () => {
      const result = await toggleWishlist(perfumeId);
      if (!result.ok) {
        router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
        return;
      }
      setWishlisted(result.wishlisted);
    });
  }

  if (variant === "label") {
    return (
      <Button
        variant="outline"
        disabled={isPending}
        onClick={handleClick}
        className={cn(
          "gap-2 border-white/10",
          wishlisted && "border-gold/40 text-gold",
        )}
      >
        <Heart className={cn("size-4", wishlisted && "fill-gold")} />
        {wishlisted ? "Dans ma wishlist" : "Wishlist"}
      </Button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      aria-label={
        wishlisted ? "Retirer de la wishlist" : "Ajouter à la wishlist"
      }
      className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-background/60 backdrop-blur-sm transition-colors hover:border-gold/40 disabled:opacity-50"
    >
      <Heart
        className={cn(
          "size-4 text-foreground/70 transition-colors",
          wishlisted && "fill-gold text-gold",
        )}
      />
    </button>
  );
}
