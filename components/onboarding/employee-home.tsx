"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Award, CheckCircle2, ChevronRight, Circle, Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { isModuleCompleted, levelForPoints, trackProgress } from "@/lib/onboarding-utils";
import type { BadgeDef, Employee, TrackColor } from "@/types/onboarding";
import { cn } from "@/lib/utils";

const colorClasses: Record<TrackColor, { text: string; bg: string; ring: string }> = {
  indigo: { text: "text-indigo", bg: "bg-indigo-soft", ring: "bg-indigo" },
  emerald: { text: "text-emerald", bg: "bg-emerald-soft", ring: "bg-emerald" },
  coral: { text: "text-coral", bg: "bg-coral-soft", ring: "bg-coral" },
  amber: { text: "text-amber", bg: "bg-amber/10", ring: "bg-amber" },
};

export function EmployeeHome({
  employee,
  allBadges,
  allEmployees,
}: {
  employee: Employee;
  allBadges: BadgeDef[];
  allEmployees: { id: string; name: string }[];
}) {
  const router = useRouter();
  const { level, label, nextThreshold } = levelForPoints(employee.points);
  const earnedBadges = allBadges.filter((b) => employee.earnedBadgeIds.includes(b.id));
  const levelFloor = nextThreshold === null ? employee.points : nextThreshold - 200;
  const levelProgress =
    nextThreshold === null
      ? 100
      : Math.round(((employee.points - levelFloor) / (nextThreshold - levelFloor)) * 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl">Mon parcours</h1>
          <p className="mt-0.5 text-sm text-muted">Continuez votre formation, module par module.</p>
        </div>
        <Select value={employee.id} onValueChange={(id) => router.push(`/employe?as=${id}`)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {allEmployees.map((e) => (
              <SelectItem key={e.id} value={e.id}>
                {e.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-soft text-lg font-semibold text-indigo">
            {employee.avatarInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{employee.name}</p>
            <p className="text-xs text-muted">{employee.role}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold tabular-nums text-indigo">{employee.points}</p>
            <p className="text-[11px] text-muted">points</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-medium">
              Niveau {level} · {label}
            </span>
            <span className="text-muted">
              {nextThreshold === null ? "Niveau max" : `${nextThreshold - employee.points} pts avant le niveau suivant`}
            </span>
          </div>
          <Progress value={levelProgress} indicatorClassName="bg-amber" />
        </div>

        {earnedBadges.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {earnedBadges.map((b) => (
              <Badge key={b.id} variant="amber" title={b.description}>
                <Award className="h-3 w-3" /> {b.title}
              </Badge>
            ))}
          </div>
        )}
      </Card>

      {employee.tracks.map((track) => {
        const progress = trackProgress(employee, track);
        const colors = colorClasses[track.color];

        return (
          <div key={track.id}>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className={cn("text-sm font-semibold", colors.text)}>{track.title}</h2>
                <p className="text-xs text-muted">{track.description}</p>
              </div>
              <span className="text-xs font-medium text-muted tabular-nums">{progress.pct}%</span>
            </div>
            <div className="space-y-2">
              {track.modules.map((m, i) => {
                const done = isModuleCompleted(employee, m.id);
                const entry = employee.moduleProgress[m.id];
                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <Link href={`/employe/module/${m.id}?as=${employee.id}`}>
                      <Card className="flex items-center gap-3 p-4 transition-shadow hover:shadow-md">
                        {done ? (
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald" />
                        ) : (
                          <Circle className="h-5 w-5 shrink-0 text-muted" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{m.title}</p>
                          <p className="text-xs text-muted">
                            {m.type === "quiz" ? "Quiz" : "Flashcards"} · {m.estimatedMinutes} min · {m.pointsReward} pts
                            {entry && ` · Meilleur score ${entry.scorePct}%`}
                          </p>
                        </div>
                        {entry?.attempts && entry.attempts > 1 && !done && (
                          <span className="flex items-center gap-1 text-xs text-coral">
                            <Flame className="h-3.5 w-3.5" /> {entry.attempts} essais
                          </span>
                        )}
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted" />
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
