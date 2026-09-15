export type OrgType = "restaurant" | "hotel" | "retail";

export type TrackColor = "indigo" | "emerald" | "coral" | "amber";

export interface Organization {
  id: string;
  name: string;
  type: OrgType;
}

export type ModuleType = "quiz" | "flashcard";

export interface QuizQuestion {
  id: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation?: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface LearningModule {
  id: string;
  trackId: string;
  title: string;
  type: ModuleType;
  estimatedMinutes: number;
  pointsReward: number;
  questions?: QuizQuestion[];
  flashcards?: Flashcard[];
}

export interface Track {
  id: string;
  title: string;
  description: string;
  targetRole: string;
  color: TrackColor;
  modules: LearningModule[];
}

export interface BadgeDef {
  id: string;
  code: string;
  title: string;
  description: string;
}

export interface ModuleProgressEntry {
  scorePct: number;
  pointsEarned: number;
  completedAt: string;
  attempts: number;
}

export interface Employee {
  id: string;
  name: string;
  avatarInitials: string;
  role: string;
  hiredAt: string;
  onboardingDueAt: string;
  tracks: Track[];
  points: number;
  earnedBadgeIds: string[];
  moduleProgress: Record<string, ModuleProgressEntry>;
}

export type RecruitStatus = "termine" | "en_retard" | "en_cours" | "pas_commence";

export interface TrackProgress {
  trackId: string;
  totalModules: number;
  completedModules: number;
  pct: number;
}
