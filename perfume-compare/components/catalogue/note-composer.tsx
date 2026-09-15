"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Anchor, ArrowRight, Heart, Wind, X } from "lucide-react";

type Note = { id: string; name: string; category: "HEAD" | "HEART" | "BASE" };

const CATEGORY_LABELS = {
  HEAD: "Notes de tête",
  HEART: "Notes de cœur",
  BASE: "Notes de fond",
} as const;
const CATEGORY_ICON = { HEAD: Wind, HEART: Heart, BASE: Anchor } as const;
const MAX_SLOTS = 3;

export function NoteComposer({
  notes,
  target,
}: {
  notes: Note[];
  /** When set (e.g. "/parfums" on the homepage) the composer navigates there
   *  on demand instead of filtering the page it's already on. */
  target?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion();

  const [selected, setSelected] = useState<string[]>(() =>
    (searchParams.get("notes")?.split(",").filter(Boolean) ?? []).slice(
      0,
      MAX_SLOTS,
    ),
  );

  useEffect(() => {
    if (target) return;
    const fromUrl = searchParams.get("notes")?.split(",").filter(Boolean) ?? [];
    setSelected((current) => {
      const next = fromUrl.slice(0, MAX_SLOTS);
      return next.join("|") === current.join("|") ? current : next;
    });
  }, [searchParams, target]);

  const skipNextUrlSync = useRef(true);
  useEffect(() => {
    if (target) return;
    if (skipNextUrlSync.current) {
      skipNextUrlSync.current = false;
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    if (selected.length) params.set("notes", selected.join(","));
    else params.delete("notes");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  function toggle(name: string) {
    setSelected((current) => {
      if (current.includes(name)) return current.filter((n) => n !== name);
      if (current.length < MAX_SLOTS) return [...current, name];
      return [...current.slice(1), name];
    });
  }

  function discover() {
    const params = new URLSearchParams();
    if (selected.length) params.set("notes", selected.join(","));
    router.push(`${target}?${params.toString()}`);
  }

  const fill = selected.length / MAX_SLOTS;

  return (
    <div className="grid gap-8 rounded-3xl border border-gold/20 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 shadow-[0_0_40px_-20px_rgba(212,175,55,0.5)] backdrop-blur-sm sm:p-8 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-12">
      <div className="mx-auto flex flex-col items-center gap-3">
        <svg
          viewBox="0 0 140 220"
          className="h-40 w-auto drop-shadow-[0_0_25px_rgba(212,175,55,0.25)] sm:h-48"
          role="img"
          aria-label="Flacon avec les notes sélectionnées"
        >
          <defs>
            <clipPath id="nc-bottle-clip">
              <path d="M60,64 C60,64 22,80 20,102 L20,190 Q20,202 32,202 L108,202 Q120,202 120,190 L120,102 C118,80 80,64 80,64 Z" />
            </clipPath>
            <linearGradient id="nc-liquid" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#d4af37" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#f4d998" stopOpacity="0.55" />
            </linearGradient>
            <linearGradient id="nc-glass" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          <rect x="52" y="10" width="36" height="24" rx="5" fill="#d4af37" fillOpacity="0.85" />
          <rect x="58" y="42" width="24" height="24" fill="url(#nc-glass)" stroke="#d4af37" strokeOpacity="0.3" />

          <g clipPath="url(#nc-bottle-clip)">
            <rect x="20" y="30" width="100" height="172" fill="url(#nc-glass)" />
            <motion.rect
              x="20"
              width="100"
              fill="url(#nc-liquid)"
              initial={false}
              animate={{ height: fill * 140, y: 202 - fill * 140 }}
              transition={
                reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 16 }
              }
            />
          </g>

          <path
            d="M60,64 C60,64 22,80 20,102 L20,190 Q20,202 32,202 L108,202 Q120,202 120,190 L120,102 C118,80 80,64 80,64 Z"
            fill="none"
            stroke="#d4af37"
            strokeOpacity="0.45"
            strokeWidth="1.5"
          />

          <foreignObject x="8" y="90" width="124" height="110">
            <div className="flex h-full flex-col items-center justify-center gap-1.5 px-2">
              <AnimatePresence mode="popLayout">
                {selected.map((name) => (
                  <motion.button
                    key={name}
                    type="button"
                    layoutId={`note-pill-${name}`}
                    onClick={() => toggle(name)}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    className="flex max-w-full items-center gap-1 rounded-full border border-gold/40 bg-background/70 px-2.5 py-1 text-[11px] whitespace-nowrap text-gold"
                  >
                    <span className="truncate">{name}</span>
                    <X className="size-2.5 shrink-0" />
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </foreignObject>
        </svg>

        <p className="text-center text-xs text-muted-foreground">
          {selected.length}/{MAX_SLOTS} notes choisies
        </p>

        {target && (
          <button
            type="button"
            onClick={discover}
            disabled={selected.length === 0}
            className="btn-shimmer group mt-1 flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-gold-foreground transition-all hover:bg-gold/90 disabled:pointer-events-none disabled:opacity-40"
          >
            Découvrir les parfums
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        )}
      </div>

      <div className="space-y-5">
        <div>
          <span className="text-xs tracking-[0.3em] text-gold uppercase">
            Composez votre recherche
          </span>
          <h3 className="mt-2 font-display text-xl text-foreground">
            Glissez jusqu&apos;à {MAX_SLOTS} notes dans le flacon
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Nous révélons chaque parfum du catalogue qui les réunit toutes.
          </p>
        </div>

        {(["HEAD", "HEART", "BASE"] as const).map((category) => {
          const Icon = CATEGORY_ICON[category];
          const categoryNotes = notes.filter(
            (n) => n.category === category && !selected.includes(n.name),
          );
          return (
            <div key={category}>
              <div className="flex items-center gap-1.5 text-xs tracking-[0.2em] text-muted-foreground uppercase">
                <Icon className="size-3.5 text-gold" />
                {CATEGORY_LABELS[category]}
              </div>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {categoryNotes.map((note) => (
                  <motion.button
                    key={note.id}
                    type="button"
                    layoutId={`note-pill-${note.name}`}
                    onClick={() => toggle(note.name)}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-foreground/70 transition-colors hover:border-gold/40 hover:text-gold"
                  >
                    {note.name}
                  </motion.button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
