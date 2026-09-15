import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FAMILY_SUBFAMILIES } from "@/lib/guide-content";

type Family = { id: string; slug: string; name: string; description: string };

export function FamilyGrid({ families }: { families: Family[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {families.map((family) => (
        <div
          key={family.id}
          className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6"
        >
          <h3 className="font-display text-xl text-foreground">
            {family.name}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {family.description}
          </p>

          {FAMILY_SUBFAMILIES[family.slug] && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {FAMILY_SUBFAMILIES[family.slug].map((sub) => (
                <span
                  key={sub}
                  className="rounded-full border border-white/10 bg-background/60 px-3 py-1 text-xs text-foreground/70"
                >
                  {sub}
                </span>
              ))}
            </div>
          )}

          <Link
            href={`/parfums?familles=${family.slug}`}
            className="mt-5 inline-flex items-center gap-1.5 text-sm text-gold hover:underline"
          >
            Explorer les parfums {family.name.toLowerCase()}
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      ))}
    </div>
  );
}
