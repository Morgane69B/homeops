"use client";

import dynamic from "next/dynamic";
import type { BottleStyle } from "@/lib/bottle-style";

const ProductCanvas = dynamic(
  () => import("@/components/three/product-canvas").then((m) => m.ProductCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="size-full animate-pulse rounded-full bg-gradient-to-br from-gold/10 via-transparent to-emerald/10" />
    ),
  },
);

export function ProductScene({ style }: { style: BottleStyle }) {
  return (
    <div className="size-full cursor-grab active:cursor-grabbing" aria-hidden="true">
      <ProductCanvas style={style} />
    </div>
  );
}
