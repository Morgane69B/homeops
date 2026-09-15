"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { QuizPlayer } from "@/components/onboarding/quiz-player";
import { FlashcardDeck } from "@/components/onboarding/flashcard-deck";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { modules } from "@/data/onboarding";

export default function ModulePage() {
  const params = useParams<{ moduleId: string }>();
  const router = useRouter();
  const currentEmployeeId = useOnboardingStore((s) => s.currentEmployeeId);
  const learningModule = modules.find((m) => m.id === params.moduleId);

  if (!learningModule) {
    return <p className="text-center text-sm text-muted">Module introuvable.</p>;
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => router.push("/onboarding-express/employe")}
        className="mb-5 flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Retour
      </button>

      <div className="mx-auto mb-5 max-w-sm text-center">
        <h1 className="text-lg font-semibold">{learningModule.title}</h1>
      </div>

      {learningModule.type === "quiz" ? (
        <QuizPlayer employeeId={currentEmployeeId} learningModule={learningModule} />
      ) : (
        <FlashcardDeck employeeId={currentEmployeeId} learningModule={learningModule} />
      )}
    </div>
  );
}
