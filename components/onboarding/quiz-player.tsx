"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CompletionScreen } from "@/components/onboarding/completion-screen";
import { submitModuleAttemptAction } from "@/lib/onboarding-actions";
import { cn } from "@/lib/utils";
import type { BadgeDef, LearningModule } from "@/types/onboarding";

export function QuizPlayer({ employeeId, learningModule }: { employeeId: string; learningModule: LearningModule }) {
  const questions = learningModule.questions ?? [];

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<{
    pointsEarned: number;
    newBadges: BadgeDef[];
    passed: boolean;
    scorePct: number;
  } | null>(null);

  const question = questions[index];
  const isLast = index === questions.length - 1;
  const hasAnswered = selected !== null;

  function reset() {
    setIndex(0);
    setSelected(null);
    setCorrectCount(0);
    setFinished(false);
    setResult(null);
  }

  async function handleSelect(choiceIndex: number) {
    if (hasAnswered || submitting) return;
    setSelected(choiceIndex);
    const isCorrect = choiceIndex === question.correctIndex;
    const nextCorrect = correctCount + (isCorrect ? 1 : 0);
    setCorrectCount(nextCorrect);

    if (isLast) {
      const scorePct = Math.round((nextCorrect / questions.length) * 100);
      setSubmitting(true);
      const res = await submitModuleAttemptAction(employeeId, learningModule.id, scorePct);
      setSubmitting(false);
      setResult(res);
    }
  }

  function handleNext() {
    if (isLast) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  }

  if (finished && result) {
    return (
      <CompletionScreen
        moduleTitle={learningModule.title}
        scorePct={result.scorePct}
        passed={result.passed}
        pointsEarned={result.pointsEarned}
        newBadges={result.newBadges}
        employeeId={employeeId}
        onRetry={reset}
      />
    );
  }

  return (
    <div className="mx-auto max-w-sm">
      <div className="mb-4 flex items-center gap-3">
        <Progress value={((index + (hasAnswered ? 1 : 0)) / questions.length) * 100} className="flex-1" />
        <span className="shrink-0 text-xs font-medium text-muted tabular-nums">
          {index + 1}/{questions.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <Card className="p-5">
            <p className="text-base font-semibold leading-snug">{question.prompt}</p>

            <div className="mt-4 space-y-2.5">
              {question.choices.map((choice, i) => {
                const isCorrectChoice = i === question.correctIndex;
                const isSelected = i === selected;
                const showState = hasAnswered && (isSelected || isCorrectChoice);

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelect(i)}
                    disabled={hasAnswered}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all",
                      "border-black/10 dark:border-white/15",
                      !hasAnswered && "hover:border-indigo/50 hover:bg-indigo-soft active:scale-[0.99]",
                      showState && isCorrectChoice && "border-emerald bg-emerald-soft text-emerald",
                      showState && isSelected && !isCorrectChoice && "border-coral bg-coral-soft text-coral",
                      hasAnswered && !showState && "opacity-50"
                    )}
                  >
                    <span>{choice}</span>
                    {showState && isCorrectChoice && <Check className="h-4 w-4 shrink-0" />}
                    {showState && isSelected && !isCorrectChoice && <X className="h-4 w-4 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {hasAnswered && question.explanation && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3 text-xs leading-relaxed text-muted"
              >
                {question.explanation}
              </motion.p>
            )}
          </Card>
        </motion.div>
      </AnimatePresence>

      <Button className="mt-4 w-full" size="lg" disabled={!hasAnswered || submitting} onClick={handleNext}>
        {submitting ? "Enregistrement…" : isLast ? "Voir mes résultats" : "Question suivante"}
      </Button>
    </div>
  );
}
