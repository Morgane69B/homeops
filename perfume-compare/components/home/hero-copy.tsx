"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroCopy({
  eyebrow,
  title,
  description,
  ctaPrimary,
  ctaSecondary,
}: {
  eyebrow: string;
  title: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="mx-auto max-w-2xl text-center"
    >
      <span className="text-xs tracking-[0.35em] text-gold uppercase">
        {eyebrow}
      </span>
      <h1 className="mt-6 font-display text-5xl leading-[1.05] text-foreground sm:text-6xl lg:text-7xl">
        {title}
      </h1>
      <p className="mx-auto mt-6 max-w-lg text-base text-muted-foreground">
        {description}
      </p>
      <div className="mt-10 flex flex-col items-center gap-4">
        <Button
          size="lg"
          nativeButton={false}
          className="btn-shimmer bg-gold text-gold-foreground hover:bg-gold/90"
          render={<Link href="/parfums" />}
        >
          {ctaPrimary}
          <ArrowRight className="size-4" />
        </Button>
        <Link
          href="/guide"
          className="text-sm text-muted-foreground underline-offset-4 hover:text-gold hover:underline"
        >
          {ctaSecondary}
        </Link>
      </div>
    </motion.div>
  );
}
