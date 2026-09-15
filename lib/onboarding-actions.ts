"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { mapBadge } from "@/lib/onboarding-data";
import { PASSING_SCORE } from "@/lib/onboarding-utils";
import type { BadgeDef } from "@/types/onboarding";

export async function assignTrackAction(employeeId: string, trackId: string): Promise<void> {
  const employee = await prisma.user.findUniqueOrThrow({ where: { id: employeeId } });
  const manager = await prisma.user.findFirstOrThrow({
    where: { organizationId: employee.organizationId, role: { in: ["OWNER", "MANAGER"] } },
  });

  await prisma.assignment.upsert({
    where: { userId_trackId: { userId: employeeId, trackId } },
    update: {},
    create: { userId: employeeId, trackId, assignedById: manager.id, status: "NOT_STARTED" },
  });

  revalidatePath("/manager");
  revalidatePath("/employe");
}

async function checkAndAwardBadges(employeeId: string, justCompletedModuleId: string, scorePct: number): Promise<BadgeDef[]> {
  const employee = await prisma.user.findUniqueOrThrow({ where: { id: employeeId } });
  const [badgeRows, existingUserBadges, allAttempts] = await Promise.all([
    prisma.badge.findMany({ where: { organizationId: employee.organizationId } }),
    prisma.userBadge.findMany({ where: { userId: employeeId } }),
    prisma.attempt.findMany({ where: { userId: employeeId } }),
  ]);
  const earnedBadgeIds = new Set(existingUserBadges.map((ub) => ub.badgeId));

  const bestByModule = new Map<string, number>();
  for (const a of allAttempts) {
    bestByModule.set(a.moduleId, Math.max(bestByModule.get(a.moduleId) ?? 0, a.scorePct));
  }
  const completedModuleIds = new Set(
    [...bestByModule.entries()].filter(([, best]) => best >= PASSING_SCORE).map(([moduleId]) => moduleId)
  );

  const findBadge = (code: string) => badgeRows.find((b) => b.code === code);
  const toAward: string[] = [];

  const premier = findBadge("premier-module");
  if (premier && completedModuleIds.size >= 1 && !earnedBadgeIds.has(premier.id)) toAward.push(premier.id);

  const sansFaute = findBadge("sans-faute");
  if (sansFaute && scorePct === 100 && !earnedBadgeIds.has(sansFaute.id)) toAward.push(sansFaute.id);

  const assidu = findBadge("assidu");
  if (assidu && completedModuleIds.size >= 3 && !earnedBadgeIds.has(assidu.id)) toAward.push(assidu.id);

  const haccpMaster = findBadge("haccp-master");
  if (haccpMaster && !earnedBadgeIds.has(haccpMaster.id)) {
    const haccpTrack = await prisma.track.findUnique({ where: { slug: "haccp" }, include: { modules: true } });
    if (haccpTrack && haccpTrack.modules.length > 0 && haccpTrack.modules.every((m) => completedModuleIds.has(m.id))) {
      toAward.push(haccpMaster.id);
    }
  }

  if (toAward.length === 0) return [];

  await prisma.userBadge.createMany({
    data: toAward.map((badgeId) => ({ userId: employeeId, badgeId })),
    skipDuplicates: true,
  });

  void justCompletedModuleId;
  return badgeRows.filter((b) => toAward.includes(b.id)).map(mapBadge);
}

export async function submitModuleAttemptAction(
  employeeId: string,
  moduleId: string,
  scorePct: number
): Promise<{ pointsEarned: number; newBadges: BadgeDef[]; passed: boolean; scorePct: number }> {
  const learningModule = await prisma.module.findUniqueOrThrow({ where: { id: moduleId } });
  const passed = scorePct >= PASSING_SCORE;
  const pointsEarned = Math.round((scorePct / 100) * learningModule.pointsReward);

  const previousAttempts = await prisma.attempt.findMany({ where: { userId: employeeId, moduleId } });
  const previousBest = previousAttempts.reduce((max, a) => Math.max(max, a.scorePct), 0);
  const isNewBest = scorePct > previousBest;

  await prisma.attempt.create({ data: { userId: employeeId, moduleId, scorePct, pointsEarned } });

  if (isNewBest) {
    await prisma.user.update({ where: { id: employeeId }, data: { points: { increment: pointsEarned } } });
  }

  const newBadges = passed ? await checkAndAwardBadges(employeeId, moduleId, scorePct) : [];

  revalidatePath("/employe");
  revalidatePath("/manager");

  return { pointsEarned: isNewBest ? pointsEarned : 0, newBadges, passed, scorePct };
}
