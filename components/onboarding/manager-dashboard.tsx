"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Award, TrendingUp, Users } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { overallProgress, recruitStatus, STATUS_LABELS, daysUntilOnboarding, levelForPoints } from "@/lib/onboarding-utils";
import { RecruitDetailDialog } from "@/components/onboarding/recruit-detail-dialog";
import { cn } from "@/lib/utils";
import type { BadgeDef, Employee, RecruitStatus, Track } from "@/types/onboarding";

const statusVariant: Record<RecruitStatus, "emerald" | "coral" | "indigo" | "neutral"> = {
  termine: "emerald",
  en_retard: "coral",
  en_cours: "indigo",
  pas_commence: "neutral",
};

export function ManagerDashboard({
  employees,
  allTracks,
  allBadges,
}: {
  employees: Employee[];
  allTracks: Track[];
  allBadges: BadgeDef[];
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = employees.find((e) => e.id === selectedId) ?? null;

  const stats = useMemo(() => {
    const active = employees.length;
    const avgProgress =
      active === 0 ? 0 : Math.round(employees.reduce((sum, e) => sum + overallProgress(e), 0) / active);
    const late = employees.filter((e) => recruitStatus(e) === "en_retard").length;
    const badgesThisWeek = employees.reduce((sum, e) => sum + e.earnedBadgeIds.length, 0);
    return { active, avgProgress, late, badgesThisWeek };
  }, [employees]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight md:text-2xl">Tableau de bord manager</h1>
        <p className="mt-0.5 text-sm text-muted">
          Suivez la progression de vos recrues et assignez leurs parcours d&apos;onboarding.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Recrues actives"
          value={stats.active}
          formatter={(v) => `${v}`}
          icon={Users}
          accent="indigo"
          hint="En cours d'onboarding"
          delay={0}
        />
        <KpiCard
          label="Progression moyenne"
          value={stats.avgProgress}
          formatter={(v) => `${Math.round(v)}%`}
          icon={TrendingUp}
          accent="emerald"
          hint="Tous parcours confondus"
          delay={0.05}
        />
        <KpiCard
          label="En retard"
          value={stats.late}
          formatter={(v) => `${v}`}
          icon={AlertTriangle}
          accent="coral"
          hint="Échéance dépassée"
          delay={0.1}
        />
        <KpiCard
          label="Badges débloqués"
          value={stats.badgesThisWeek}
          formatter={(v) => `${v}`}
          icon={Award}
          accent="amber"
          hint="Récompenses gagnées"
          delay={0.15}
        />
      </div>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-black/5 dark:border-white/5 p-5">
          <h2 className="text-sm font-semibold">Équipe en formation</h2>
        </div>
        <div className="divide-y divide-black/5 dark:divide-white/5">
          {employees.map((employee, i) => (
            <RecruitRow key={employee.id} employee={employee} delay={i * 0.04} onSelect={() => setSelectedId(employee.id)} />
          ))}
        </div>
      </Card>

      {selected && (
        <RecruitDetailDialog
          employee={selected}
          allTracks={allTracks}
          allBadges={allBadges}
          open={!!selected}
          onOpenChange={(open) => !open && setSelectedId(null)}
        />
      )}
    </div>
  );
}

function RecruitRow({
  employee,
  delay,
  onSelect,
}: {
  employee: Employee;
  delay: number;
  onSelect: () => void;
}) {
  const pct = overallProgress(employee);
  const status = recruitStatus(employee);
  const { level, label } = levelForPoints(employee.points);
  const due = daysUntilOnboarding(employee);
  const newBadgeCount = employee.earnedBadgeIds.length;

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex w-full flex-col gap-3 p-4 text-left transition-colors hover:bg-slate-900/[0.03] dark:hover:bg-white/[0.03] sm:flex-row sm:items-center sm:gap-4 sm:p-5"
    >
      <div className="flex items-center gap-3 sm:w-56 sm:shrink-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-soft text-sm font-semibold text-indigo">
          {employee.avatarInitials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{employee.name}</p>
          <p className="truncate text-xs text-muted">{employee.role}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 sm:w-40 sm:shrink-0">
        {employee.tracks.map((t) => (
          <Badge key={t.id} variant="neutral" className="text-[10px]">
            {t.title}
          </Badge>
        ))}
      </div>

      <div className="flex-1">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-muted">Progression</span>
          <span className="font-medium tabular-nums">{pct}%</span>
        </div>
        <Progress value={pct} />
      </div>

      <div className="flex items-center gap-4 sm:w-64 sm:shrink-0 sm:justify-end">
        <div className="text-right">
          <p className="text-xs font-medium tabular-nums">{employee.points} pts</p>
          <p className="text-[11px] text-muted">
            Niv. {level} · {label} · {newBadgeCount} 🏅
          </p>
        </div>
        <Badge variant={statusVariant[status]} className={cn(status === "en_retard" && "glow-coral")}>
          {STATUS_LABELS[status]}
        </Badge>
      </div>

      <div className="hidden text-xs text-muted sm:block sm:w-24 sm:shrink-0 sm:text-right">
        {status === "termine" ? "—" : due >= 0 ? `J-${due}` : `J+${Math.abs(due)}`}
      </div>
    </motion.button>
  );
}
