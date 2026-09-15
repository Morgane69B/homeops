"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroCopy() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="mx-auto max-w-2xl text-center"
    >
      <span className="text-xs tracking-[0.35em] text-gold uppercase">
        Comparateur de parfums premium
      </span>
      <h1 className="mt-6 font-display text-5xl leading-[1.05] text-foreground sm:text-6xl lg:text-7xl">
        L&apos;exception, au meilleur prix.
      </h1>
      <p className="mx-auto mt-6 max-w-lg text-base text-muted-foreground">
        Comparez les prix des plus grandes maisons de parfumerie chez tous
        les marchands, explorez leur pyramide olfactive et composez une
        wishlist triée par famille.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Button
          size="lg"
          nativeButton={false}
          className="btn-shimmer bg-gold text-gold-foreground hover:bg-gold/90"
          render={<Link href="/parfums" />}
        >
          Explorer le catalogue
          <ArrowRight className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="lg"
          nativeButton={false}
          className="text-foreground/80 hover:bg-white/5 hover:text-gold"
          render={<Link href="/guide" />}
        >
          Découvrir le guide
        </Button>
      </div>
    </motion.div>
  );
}
