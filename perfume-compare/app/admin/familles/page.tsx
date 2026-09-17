import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminFamiliesPage() {
  const families = await prisma.olfactoryFamily.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { perfumes: true } } },
  });

  return (
    <div>
      <p className="text-sm text-muted-foreground">
        Les familles olfactives utilisées pour classer les parfums et sur la
        page Guide. Le nom et la description sont modifiables ci-dessous.
      </p>

      <div className="mt-6 divide-y divide-white/10 rounded-2xl border border-white/10">
        {families.map((family) => (
          <Link
            key={family.id}
            href={`/admin/familles/${family.id}`}
            className="flex items-center gap-4 p-4 transition-colors hover:bg-white/[0.03]"
          >
            <div className="min-w-0 flex-1">
              <p className="font-display text-lg text-foreground">
                {family.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {family.description}
              </p>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">
              {family._count.perfumes} parfum
              {family._count.perfumes > 1 ? "s" : ""}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
