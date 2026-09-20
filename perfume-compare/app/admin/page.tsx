import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { resolvePerfumeImage } from "@/lib/product-image";

export default async function AdminPerfumesPage() {
  const perfumes = await prisma.perfume.findMany({
    include: { mainFamily: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {perfumes.length} parfum{perfumes.length > 1 ? "s" : ""}
        </p>
        <Link
          href="/admin/parfums/new"
          className="flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-sm font-medium text-gold-foreground transition-colors hover:bg-gold/90"
        >
          <Plus className="size-4" />
          Nouveau parfum
        </Link>
      </div>

      <div className="mt-6 divide-y divide-white/10 rounded-2xl border border-white/10">
        {perfumes.map((perfume) => (
          <Link
            key={perfume.id}
            href={`/admin/parfums/${perfume.id}`}
            className="flex items-center gap-4 p-4 transition-colors hover:bg-white/[0.03]"
          >
            <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-luxury-ink">
              <Image
                src={resolvePerfumeImage(perfume)}
                alt={perfume.name}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs tracking-wide text-muted-foreground uppercase">
                {perfume.brand}
              </p>
              <p className="truncate font-display text-lg text-foreground">
                {perfume.name}
              </p>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">
              {perfume.mainFamily.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
