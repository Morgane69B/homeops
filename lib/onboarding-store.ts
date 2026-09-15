"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { badges, employees as mockEmployees, modules, tracks } from "@/data/onboarding";
import { isModuleCompleted, overallProgress, trackProgress, PASSING_SCORE } from "@/lib/onboarding-utils";
import type { Employee } from "@/types/onboarding";

interface OnboardingState {
  employees: Employee[];
  currentEmployeeId: string;
  setCurrentEmployeeId: (id: string) => void;
  assignTrack: (employeeId: string, trackId: string) => void;
  submitModuleAttempt: (
    employeeId: string,
    moduleId: string,
    scorePct: number
  ) => { pointsEarned: number; newlyEarnedBadgeIds: string[]; passed: boolean };
}

function checkNewBadges(employee: Employee, justCompletedModuleId: string, scorePct: number): string[] {
  const earned = new Set(employee.earnedBadgeIds);
  const newly: string[] = [];

  const completedCount = Object.keys(employee.moduleProgress).filter((id) =>
    isModuleCompleted(employee, id)
  ).length;

  if (completedCount >= 1 && !earned.has("badge-premier-module")) {
    newly.push("badge-premier-module");
  }
  if (scorePct === 100 && !earned.has("badge-sans-faute")) {
    newly.push("badge-sans-faute");
  }
  if (completedCount >= 3 && !earned.has("badge-assidu")) {
    newly.push("badge-assidu");
  }
  const haccpTrack = tracks.find((t) => t.id === "track-haccp");
  if (
    haccpTrack &&
    employee.trackIds.includes("track-haccp") &&
    !earned.has("badge-haccp-master") &&
    haccpTrack.moduleIds.every((id) => isModuleCompleted(employee, id) || id === justCompletedModuleId)
  ) {
    const allHaccpDone = haccpTrack.moduleIds.every((id) =>
      id === justCompletedModuleId ? scorePct >= PASSING_SCORE : isModuleCompleted(employee, id)
    );
    if (allHaccpDone) newly.push("badge-haccp-master");
  }

  return newly.filter((code) => badges.some((b) => b.id === code));
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      employees: mockEmployees,
      currentEmployeeId: mockEmployees[0].id,
      setCurrentEmployeeId: (id) => set({ currentEmployeeId: id }),
      assignTrack: (employeeId, trackId) => {
        set((state) => ({
          employees: state.employees.map((e) =>
            e.id === employeeId && !e.trackIds.includes(trackId)
              ? { ...e, trackIds: [...e.trackIds, trackId] }
              : e
          ),
        }));
      },
      submitModuleAttempt: (employeeId, moduleId, scorePct) => {
        const employee = get().employees.find((e) => e.id === employeeId);
        const learningModule = modules.find((m) => m.id === moduleId);
        if (!employee || !learningModule) {
          return { pointsEarned: 0, newlyEarnedBadgeIds: [], passed: false };
        }

        const passed = scorePct >= PASSING_SCORE;
        const pointsEarned = Math.round((scorePct / 100) * learningModule.pointsReward);
        const previousAttempts = employee.moduleProgress[moduleId]?.attempts ?? 0;
        const previousBest = employee.moduleProgress[moduleId]?.scorePct ?? 0;

        const updatedEmployee: Employee = {
          ...employee,
          points: employee.points + (scorePct > previousBest ? pointsEarned : 0),
          moduleProgress: {
            ...employee.moduleProgress,
            [moduleId]: {
              scorePct: Math.max(scorePct, previousBest),
              pointsEarned: Math.max(pointsEarned, employee.moduleProgress[moduleId]?.pointsEarned ?? 0),
              completedAt: new Date().toISOString(),
              attempts: previousAttempts + 1,
            },
          },
        };

        const newlyEarnedBadgeIds = passed ? checkNewBadges(updatedEmployee, moduleId, scorePct) : [];
        updatedEmployee.earnedBadgeIds = [...employee.earnedBadgeIds, ...newlyEarnedBadgeIds];

        set((state) => ({
          employees: state.employees.map((e) => (e.id === employeeId ? updatedEmployee : e)),
        }));

        return { pointsEarned: scorePct > previousBest ? pointsEarned : 0, newlyEarnedBadgeIds, passed };
      },
    }),
    { name: "onboarding-express-storage", version: 1 }
  )
);

export { modules, tracks, badges };
export { overallProgress, trackProgress };
