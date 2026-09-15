"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CompletionScreen } from "@/components/onboarding/completion-screen";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { badges as badgeDefs } from "@/data/onboarding";
import { cn } from "@/lib/utils";
import type { LearningModule } from "@/types/onboarding";

export function FlashcardDeck({ employeeId, learningModule }: { employeeId: string; learningModule: LearningModule }) {
  const cards = learningModule.flashcards ?? [];
  const submitModuleAttempt = useOnboardingStore((s) => s.submitModuleAttempt);

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<{ pointsEarned: number; newlyEarnedBadgeIds: string[] } | null>(null);

  const card = cards[index];
  const isLast = index === cards.length - 1;

  function reset() {
    setIndex(0);
    setFlipped(false);
    setFinished(false);
    setResult(null);
  }

  function handleNext() {
    if (isLast) {
      const res = submitModuleAttempt(employeeId, learningModule.id, 100);
      setResult(res);
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setFlipped(false);
  }

  if (finished && result) {
    return (
      <CompletionScreen
        moduleTitle={learningModule.title}
        scorePct={100}
        passed
        pointsEarned={result.pointsEarned}
        newBadges={badgeDefs.filter((b) => result.newlyEarnedBadgeIds.includes(b.id))}
        onRetry={reset}
      />
    );
  }

  return (
    <div className="mx-auto max-w-sm">
      <div className="mb-4 flex items-center justify-center gap-1.5">
        {cards.map((c, i) => (
          <span
            key={c.id}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === index ? "w-6 bg-indigo" : i < index ? "w-1.5 bg-indigo/40" : "w-1.5 bg-slate-900/10 dark:bg-white/10"
            )}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={card.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <button type="button" onClick={() => setFlipped((f) => !f)} className="block w-full" style={{ perspective: 1200 }}>
            <motion.div
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              style={{ transformStyle: "preserve-3d" }}
              className="relative"
            >
              <Card
                style={{ backfaceVisibility: "hidden" }}
                className="flex min-h-[220px] flex-col items-center justify-center gap-3 p-6 text-center"
              >
                <span className="text-[11px] font-medium uppercase tracking-wide text-muted">Question</span>
                <p className="text-base font-semibold leading-snug">{card.front}</p>
                <span className="mt-2 flex items-center gap-1.5 text-xs text-muted">
                  <RotateCw className="h-3.5 w-3.5" /> Toucher pour retourner
                </span>
              </Card>
              <Card
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                className="absolute inset-0 flex min-h-[220px] flex-col items-center justify-center gap-3 bg-indigo-soft p-6 text-center"
              >
                <span className="text-[11px] font-medium uppercase tracking-wide text-indigo">Réponse</span>
                <p className="text-base font-semibold leading-snug text-indigo">{card.back}</p>
              </Card>
            </motion.div>
          </button>
        </motion.div>
      </AnimatePresence>

      <Button className="mt-4 w-full" size="lg" onClick={handleNext}>
        {isLast ? "Terminer le module" : "Carte suivante"}
      </Button>
    </div>
  );
}
