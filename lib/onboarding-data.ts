import "server-only";
import { prisma } from "@/lib/prisma";
import type {
  Attempt as PrismaAttempt,
  Badge as PrismaBadge,
  Module as PrismaModule,
  Question as PrismaQuestion,
  Track as PrismaTrack,
  User as PrismaUser,
} from "@prisma/client";
import type { BadgeDef, Employee, Flashcard, LearningModule, ModuleProgressEntry, Track, TrackColor } from "@/types/onboarding";

type ModuleWithQuestions = PrismaModule & { questions: PrismaQuestion[] };
type TrackWithModules = PrismaTrack & { modules: ModuleWithQuestions[] };
type UserWithRelations = PrismaUser & {
  assignments: { trackId: string; dueDate: Date | null }[];
  attempts: PrismaAttempt[];
  userBadges: { badgeId: string }[];
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function mapModule(m: ModuleWithQuestions): LearningModule {
  return {
    id: m.id,
    trackId: m.trackId,
    title: m.title,
    type: m.type === "QUIZ" ? "quiz" : "flashcard",
    estimatedMinutes: m.estimatedMinutes,
    pointsReward: m.pointsReward,
    questions:
      m.type === "QUIZ"
        ? m.questions.map((q) => ({
            id: q.id,
            prompt: q.prompt,
            choices: q.choices as string[],
            correctIndex: q.correctIndex,
            explanation: q.explanation ?? undefined,
          }))
        : undefined,
    flashcards: m.type === "FLASHCARD" ? ((m.content as unknown as Flashcard[]) ?? []) : undefined,
  };
}

export function mapTrack(t: TrackWithModules): Track {
  return {
    id: t.id,
    title: t.title,
    description: t.description ?? "",
    targetRole: t.targetJobTitle ?? "Tous postes",
    color: t.color as TrackColor,
    modules: t.modules.map(mapModule),
  };
}

export function mapBadge(b: PrismaBadge): BadgeDef {
  return { id: b.id, code: b.code, title: b.title, description: b.description };
}

function buildModuleProgress(attempts: PrismaAttempt[]): Record<string, ModuleProgressEntry> {
  const byModule = new Map<string, PrismaAttempt[]>();
  for (const a of attempts) {
    const arr = byModule.get(a.moduleId) ?? [];
    arr.push(a);
    byModule.set(a.moduleId, arr);
  }
  const result: Record<string, ModuleProgressEntry> = {};
  for (const [moduleId, arr] of byModule) {
    const best = arr.reduce((b, a) => (a.scorePct > b.scorePct ? a : b));
    result[moduleId] = {
      scorePct: best.scorePct,
      pointsEarned: best.pointsEarned,
      completedAt: best.completedAt.toISOString(),
      attempts: arr.length,
    };
  }
  return result;
}

function mapEmployee(u: UserWithRelations, tracksById: Map<string, Track>): Employee {
  const tracks = u.assignments.map((a) => tracksById.get(a.trackId)).filter((t): t is Track => !!t);
  const dueDates = u.assignments.map((a) => a.dueDate).filter((d): d is Date => !!d);
  const onboardingDueAt = dueDates.length
    ? new Date(Math.min(...dueDates.map((d) => d.getTime()))).toISOString()
    : new Date(u.hiredAt.getTime() + 14 * 86_400_000).toISOString();

  return {
    id: u.id,
    name: u.name,
    avatarInitials: initials(u.name),
    role: u.jobTitle ?? "Employé",
    hiredAt: u.hiredAt.toISOString(),
    onboardingDueAt,
    tracks,
    points: u.points,
    earnedBadgeIds: u.userBadges.map((ub) => ub.badgeId),
    moduleProgress: buildModuleProgress(u.attempts),
  };
}

export async function getOnboardingData() {
  const org = await prisma.organization.findFirstOrThrow();

  const trackRows = await prisma.track.findMany({
    where: { organizationId: org.id },
    orderBy: { order: "asc" },
    include: { modules: { orderBy: { order: "asc" }, include: { questions: { orderBy: { order: "asc" } } } } },
  });
  const allTracks = trackRows.map(mapTrack);
  const tracksById = new Map(allTracks.map((t) => [t.id, t]));

  const badgeRows = await prisma.badge.findMany({ where: { organizationId: org.id } });
  const allBadges = badgeRows.map(mapBadge);

  const userRows = await prisma.user.findMany({
    where: { organizationId: org.id, role: "EMPLOYEE" },
    include: { assignments: true, attempts: true, userBadges: true },
    orderBy: { hiredAt: "asc" },
  });
  const employees = userRows.map((u) => mapEmployee(u, tracksById));

  return {
    organization: { id: org.id, name: org.name, type: org.type.toLowerCase() as "restaurant" | "hotel" | "retail" },
    allTracks,
    allBadges,
    employees,
  };
}

export async function getModuleById(moduleId: string): Promise<LearningModule | null> {
  const m = await prisma.module.findUnique({
    where: { id: moduleId },
    include: { questions: { orderBy: { order: "asc" } } },
  });
  return m ? mapModule(m) : null;
}
