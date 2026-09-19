import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function AdminGuidePage() {
  const tips = await prisma.guideTip.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {tips.length} conseil{tips.length > 1 ? "s" : ""} affiché
          {tips.length > 1 ? "s" : ""} sur la page Guide
        </p>
        <Link
          href="/admin/guide/new"
          className="flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-sm font-medium text-gold-foreground transition-colors hover:bg-gold/90"
        >
          <Plus className="size-4" />
          Nouveau conseil
        </Link>
      </div>

      <div className="mt-6 divide-y divide-white/10 rounded-2xl border border-white/10">
        {tips.map((tip) => (
          <Link
            key={tip.id}
            href={`/admin/guide/${tip.id}`}
            className="flex items-center gap-4 p-4 transition-colors hover:bg-white/[0.03]"
          >
            <div className="min-w-0 flex-1">
              <p className="font-display text-lg text-foreground">{tip.title}</p>
              <p className="truncate text-xs text-muted-foreground">{tip.body}</p>
            </div>
          </Link>
        ))}
        {tips.length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">
            Aucun conseil pour le moment.
          </p>
        )}
      </div>
    </div>
  );
}
