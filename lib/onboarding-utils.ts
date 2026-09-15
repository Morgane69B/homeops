import type { Employee, RecruitStatus, Track, TrackProgress } from "@/types/onboarding";

export const PASSING_SCORE = 70;

const LEVELS = [
  { threshold: 0, label: "Nouveau" },
  { threshold: 150, label: "Apprenti" },
  { threshold: 350, label: "Confirmé" },
  { threshold: 600, label: "Expert" },
  { threshold: 900, label: "Maître" },
];

export function levelForPoints(points: number): { level: number; label: string; nextThreshold: number | null } {
  let levelIndex = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (points >= LEVELS[i].threshold) levelIndex = i;
  }
  const next = LEVELS[levelIndex + 1];
  return {
    level: levelIndex + 1,
    label: LEVELS[levelIndex].label,
    nextThreshold: next ? next.threshold : null,
  };
}

export function isModuleCompleted(employee: Employee, moduleId: string): boolean {
  const entry = employee.moduleProgress[moduleId];
  return !!entry && entry.scorePct >= PASSING_SCORE;
}

export function trackProgress(employee: Employee, track: Track): TrackProgress {
  const completed = track.modules.filter((m) => isModuleCompleted(employee, m.id)).length;
  return {
    trackId: track.id,
    totalModules: track.modules.length,
    completedModules: completed,
    pct: track.modules.length === 0 ? 0 : Math.round((completed / track.modules.length) * 100),
  };
}

export function overallProgress(employee: Employee): number {
  const allModules = employee.tracks.flatMap((t) => t.modules);
  if (allModules.length === 0) return 0;
  const completed = allModules.filter((m) => isModuleCompleted(employee, m.id)).length;
  return Math.round((completed / allModules.length) * 100);
}

export function recruitStatus(employee: Employee): RecruitStatus {
  const pct = overallProgress(employee);
  if (pct >= 100) return "termine";
  const attemptsCount = Object.keys(employee.moduleProgress).length;
  if (attemptsCount === 0) return "pas_commence";
  const dueDate = new Date(employee.onboardingDueAt).getTime();
  const now = Date.now();
  if (now > dueDate) return "en_retard";
  return "en_cours";
}

export const STATUS_LABELS: Record<RecruitStatus, string> = {
  termine: "Terminé",
  en_retard: "En retard",
  en_cours: "En cours",
  pas_commence: "Pas commencé",
};

export function daysUntilOnboarding(employee: Employee): number {
  const due = new Date(employee.onboardingDueAt);
  due.setHours(0, 0, 0, 0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.round((due.getTime() - now.getTime()) / 86_400_000);
}
