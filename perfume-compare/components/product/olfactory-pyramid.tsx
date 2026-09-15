import { Anchor, Heart, Wind } from "lucide-react";
import { cn } from "@/lib/utils";

type Note = { id: string; name: string; category: "HEAD" | "HEART" | "BASE" };

const TIERS: {
  category: Note["category"];
  label: string;
  description: string;
  widthClass: string;
  icon: typeof Wind;
}[] = [
  {
    category: "HEAD",
    label: "Notes de tête",
    description: "Les premières minutes",
    widthClass: "max-w-[38%]",
    icon: Wind,
  },
  {
    category: "HEART",
    label: "Notes de cœur",
    description: "Le cœur du parfum",
    widthClass: "max-w-[68%]",
    icon: Heart,
  },
  {
    category: "BASE",
    label: "Notes de fond",
    description: "Le sillage final",
    widthClass: "max-w-full",
    icon: Anchor,
  },
];

export function OlfactoryPyramid({ notes }: { notes: Note[] }) {
  const tiers = TIERS.filter(
    (tier) => notes.filter((n) => n.category === tier.category).length > 0,
  );

  return (
    <div className="relative mx-auto max-w-2xl px-2 py-6">
      {/* Halo doré */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-[radial-gradient(ellipse_60%_50%_at_50%_10%,rgba(212,175,55,0.12),transparent_70%)]"
        aria-hidden="true"
      />

      {/* Silhouette de pyramide */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="pyramid-edge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        <polygon
          points="50,2 98,98 2,98"
          fill="none"
          stroke="url(#pyramid-edge)"
          strokeWidth="0.4"
          vectorEffect="non-scaling-stroke"
        />
        <line
          x1="50"
          y1="2"
          x2="50"
          y2="98"
          stroke="#d4af37"
          strokeOpacity="0.25"
          strokeWidth="0.3"
          strokeDasharray="1 2.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Sommet */}
      <div className="mb-6 flex justify-center">
        <div className="size-2.5 rotate-45 bg-gold shadow-[0_0_16px_2px_rgba(212,175,55,0.6)]" />
      </div>

      <div className="space-y-6">
        {tiers.map((tier) => {
          const tierNotes = notes.filter((n) => n.category === tier.category);
          const Icon = tier.icon;

          return (
            <div
              key={tier.category}
              className={cn(
                "mx-auto rounded-2xl border border-gold/20 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 text-center shadow-[0_0_30px_-15px_rgba(212,175,55,0.5)] backdrop-blur-sm transition-colors hover:border-gold/40 sm:p-8",
                tier.widthClass,
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <Icon className="size-4 text-gold" />
                <span className="text-xs tracking-[0.3em] text-gold uppercase">
                  {tier.label}
                </span>
              </div>
              <p className="mt-1 font-display text-sm text-muted-foreground italic">
                {tier.description}
              </p>
              <div className="mx-auto mt-4 h-px w-12 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {tierNotes.map((note) => (
                  <span
                    key={note.id}
                    className="rounded-full border border-white/10 bg-background/60 px-3 py-1 text-xs text-foreground/80 transition-colors hover:border-gold/30 hover:text-gold"
                  >
                    {note.name}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
