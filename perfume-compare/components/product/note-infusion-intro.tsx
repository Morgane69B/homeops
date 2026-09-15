"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Anchor, Heart, RotateCcw, Wind } from "lucide-react";

type Note = { id: string; name: string; category: "HEAD" | "HEART" | "BASE" };

const CATEGORY_ORDER = { HEAD: 0, HEART: 1, BASE: 2 } as const;
const CATEGORY_ICON = { HEAD: Wind, HEART: Heart, BASE: Anchor } as const;
const CATEGORY_COLOR = {
  HEAD: "text-gold",
  HEART: "text-rose-300",
  BASE: "text-emerald",
} as const;

const MAX_NOTES = 9;
const RADIUS = 170;
const NOTE_STAGGER = 0.13;
const NOTE_START_DELAY = 1;
const NOTE_DURATION = 1.5;

export function NoteInfusionIntro({ notes }: { notes: Note[] }) {
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [runId, setRunId] = useState(0);

  const shown = useMemo(
    () =>
      [...notes]
        .sort((a, b) => CATEGORY_ORDER[a.category] - CATEGORY_ORDER[b.category])
        .slice(0, MAX_NOTES),
    [notes],
  );

  const lastLanding = NOTE_START_DELAY + (shown.length - 1) * NOTE_STAGGER + NOTE_DURATION;
  const flashAt = lastLanding + 0.1;
  const totalMs = (flashAt + 0.9) * 1000;

  const play = useCallback(() => {
    if (shown.length === 0) return;
    setPhase("playing");
    setRunId((id) => id + 1);
  }, [shown.length]);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion || shown.length === 0) {
      setPhase("done");
      return;
    }
    setPhase("playing");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;
    const timeout = setTimeout(() => setPhase("done"), totalMs);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, runId]);

  return (
    <>
      <AnimatePresence>
        {phase === "playing" && (
          <motion.div
            key={runId}
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-hidden"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="absolute inset-0 bg-[radial-gradient(ellipse_55%_55%_at_50%_50%,rgba(212,175,55,0.18),transparent_70%)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            />

            <motion.div
              className="absolute flex flex-col items-center gap-2 text-center"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: [0, 1, 1, 0], y: 0 }}
              transition={{ duration: 1.1, times: [0, 0.3, 0.75, 1], ease: "easeInOut" }}
            >
              <span className="h-px w-10 bg-gold/50" />
              <span className="text-xs tracking-[0.3em] text-gold uppercase">
                La composition prend vie
              </span>
            </motion.div>

            {shown.map((note, i) => {
              const angle = (i / shown.length) * Math.PI * 2;
              const spin = 1.1;
              const x0 = Math.cos(angle) * RADIUS;
              const y0 = Math.sin(angle) * RADIUS;
              const x1 = Math.cos(angle + spin) * RADIUS * 0.5;
              const y1 = Math.sin(angle + spin) * RADIUS * 0.5;
              const Icon = CATEGORY_ICON[note.category];
              const delay = NOTE_START_DELAY + i * NOTE_STAGGER;

              return (
                <motion.div
                  key={note.id}
                  className={`absolute flex items-center gap-1.5 rounded-full border border-gold/30 bg-background/80 px-3 py-1.5 text-xs whitespace-nowrap text-foreground/90 shadow-[0_0_20px_-6px_rgba(212,175,55,0.6)] backdrop-blur-sm`}
                  initial={{ x: x0, y: y0, opacity: 0, scale: 0.6, rotate: -12 }}
                  animate={{
                    x: [x0, x1, 0],
                    y: [y0, y1, 0],
                    opacity: [0, 1, 1, 0],
                    scale: [0.6, 1, 1, 0.25],
                    rotate: [-12, 6, 0],
                  }}
                  transition={{
                    duration: NOTE_DURATION,
                    delay,
                    ease: "easeInOut",
                    times: [0, 0.55, 0.85, 1],
                  }}
                >
                  <Icon className={`size-3 ${CATEGORY_COLOR[note.category]}`} />
                  {note.name}
                </motion.div>
              );
            })}

            <motion.div
              className="absolute size-24 rounded-full bg-gold"
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: [0, 0.55, 0], scale: [0.3, 2.4, 3] }}
              transition={{ duration: 0.8, delay: flashAt, ease: "easeOut" }}
              style={{ filter: "blur(20px)" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {phase === "done" && shown.length > 0 && (
        <motion.button
          type="button"
          onClick={play}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="absolute right-3 bottom-3 z-10 flex items-center gap-1.5 rounded-full border border-white/10 bg-background/70 px-3 py-1.5 text-[11px] text-foreground/70 backdrop-blur-sm transition-colors hover:border-gold/40 hover:text-gold"
        >
          <RotateCcw className="size-3" />
          Revoir la composition
        </motion.button>
      )}
    </>
  );
}
