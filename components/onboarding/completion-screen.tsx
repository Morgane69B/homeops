"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Award, PartyPopper, RotateCcw, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { BadgeDef } from "@/types/onboarding";

export function CompletionScreen({
  moduleTitle,
  scorePct,
  passed,
  pointsEarned,
  newBadges,
  employeeId,
  onRetry,
}: {
  moduleTitle: string;
  scorePct: number;
  passed: boolean;
  pointsEarned: number;
  newBadges: BadgeDef[];
  employeeId: string;
  onRetry: () => void;
}) {
  return (
    <div className="mx-auto max-w-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", bounce: 0.35, duration: 0.6 }}
      >
        <Card className="p-6 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.15 }}
            className={
              "mx-auto flex h-16 w-16 items-center justify-center rounded-full " +
              (passed ? "bg-emerald-soft text-emerald" : "bg-coral-soft text-coral")
            }
          >
            {passed ? <PartyPopper className="h-8 w-8" /> : <RotateCcw className="h-8 w-8" />}
          </motion.div>

          <h2 className="mt-4 text-lg font-semibold">
            {passed ? "Module validé !" : "Pas encore validé"}
          </h2>
          <p className="mt-1 text-sm text-muted">{moduleTitle}</p>

          <div className="mt-5 flex items-center justify-center gap-6">
            <div>
              <p className="text-2xl font-semibold tabular-nums">{scorePct}%</p>
              <p className="text-xs text-muted">Score</p>
            </div>
            <div className="h-8 w-px bg-black/10 dark:bg-white/10" />
            <div>
              <p className="text-2xl font-semibold tabular-nums text-indigo">+{pointsEarned}</p>
              <p className="text-xs text-muted">Points</p>
            </div>
          </div>

          {newBadges.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-5 rounded-xl bg-amber/10 p-3.5"
            >
              <p className="mb-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-amber">
                <Sparkles className="h-3.5 w-3.5" /> Nouveau badge débloqué
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {newBadges.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 shadow-sm"
                  >
                    <Award className="h-3.5 w-3.5 text-amber" />
                    <span className="text-xs font-medium">{b.title}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <div className="mt-6 flex flex-col gap-2">
            {!passed && (
              <Button variant="secondary" onClick={onRetry}>
                Retenter le module
              </Button>
            )}
            <Button asChild>
              <Link href={`/employe?as=${employeeId}`}>Retour à mon parcours</Link>
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
