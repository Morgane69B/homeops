import { CONCENTRATIONS } from "@/lib/guide-content";

const MAX_SCALE = 30;

export function ConcentrationChart() {
  return (
    <div className="space-y-5">
      {CONCENTRATIONS.map((c) => {
        const [min, max] = c.oilRange;
        return (
          <div
            key={c.key}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-lg text-foreground">
                {c.label}
              </h3>
              <span className="text-sm text-gold">
                {min}–{max}% d&apos;huile parfumée
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold/60 to-gold"
                style={{ width: `${(max / MAX_SCALE) * 100}%` }}
              />
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="text-muted-foreground">{c.description}</span>
              <span className="shrink-0 text-foreground/70">
                Tenue : {c.tenue}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
