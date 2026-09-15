import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { QuizPlayer } from "@/components/onboarding/quiz-player";
import { FlashcardDeck } from "@/components/onboarding/flashcard-deck";
import { getModuleById, getOnboardingData } from "@/lib/onboarding-data";

export const dynamic = "force-dynamic";

export default async function ModulePage({
  params,
  searchParams,
}: {
  params: Promise<{ moduleId: string }>;
  searchParams: Promise<{ as?: string }>;
}) {
  const { moduleId } = await params;
  const { as } = await searchParams;
  const [learningModule, { employees }] = await Promise.all([getModuleById(moduleId), getOnboardingData()]);
  const employee = employees.find((e) => e.id === as) ?? employees[0];

  if (!learningModule) {
    return <p className="text-center text-sm text-muted">Module introuvable.</p>;
  }

  return (
    <div>
      <Link
        href={`/onboarding-express/employe?as=${employee.id}`}
        className="mb-5 flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Retour
      </Link>

      <div className="mx-auto mb-5 max-w-sm text-center">
        <h1 className="text-lg font-semibold">{learningModule.title}</h1>
      </div>

      {learningModule.type === "quiz" ? (
        <QuizPlayer employeeId={employee.id} learningModule={learningModule} />
      ) : (
        <FlashcardDeck employeeId={employee.id} learningModule={learningModule} />
      )}
    </div>
  );
}
