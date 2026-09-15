"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Circle, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { isModuleCompleted, trackProgress } from "@/lib/onboarding-utils";
import { assignTrackAction } from "@/lib/onboarding-actions";
import type { BadgeDef, Employee, Track, TrackColor } from "@/types/onboarding";
import { cn } from "@/lib/utils";

const colorText: Record<TrackColor, string> = {
  indigo: "text-indigo",
  emerald: "text-emerald",
  coral: "text-coral",
  amber: "text-amber",
};

export function RecruitDetailDialog({
  employee,
  allTracks,
  allBadges,
  open,
  onOpenChange,
}: {
  employee: Employee;
  allTracks: Track[];
  allBadges: BadgeDef[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [trackToAssign, setTrackToAssign] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const assignedTrackIds = new Set(employee.tracks.map((t) => t.id));
  const assignableTracks = allTracks.filter((t) => !assignedTrackIds.has(t.id));
  const earnedBadges = allBadges.filter((b) => employee.earnedBadgeIds.includes(b.id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{employee.name}</DialogTitle>
          <DialogDescription>
            {employee.role} · {employee.points} pts · {earnedBadges.length} badge
            {earnedBadges.length > 1 ? "s" : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {employee.tracks.map((track) => {
            const progress = trackProgress(employee, track);

            return (
              <div key={track.id}>
                <div className="mb-2 flex items-center justify-between">
                  <p className={cn("text-sm font-semibold", colorText[track.color])}>{track.title}</p>
                  <span className="text-xs text-muted">
                    {progress.completedModules}/{progress.totalModules} modules
                  </span>
                </div>
                <Progress value={progress.pct} className="mb-2.5" />
                <ul className="space-y-1.5">
                  {track.modules.map((m) => {
                    const done = isModuleCompleted(employee, m.id);
                    const entry = employee.moduleProgress[m.id];
                    return (
                      <li key={m.id} className="flex items-center gap-2 text-sm">
                        {done ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald" />
                        ) : (
                          <Circle className="h-4 w-4 shrink-0 text-muted" />
                        )}
                        <span className={done ? "text-foreground" : "text-muted"}>{m.title}</span>
                        {entry && (
                          <span className="ml-auto text-xs text-muted tabular-nums">{entry.scorePct}%</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}

          {earnedBadges.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-semibold">Badges obtenus</p>
              <div className="flex flex-wrap gap-1.5">
                {earnedBadges.map((b) => (
                  <Badge key={b.id} variant="amber" title={b.description}>
                    {b.title}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {assignableTracks.length > 0 && (
            <div className="rounded-xl border border-black/10 dark:border-white/10 p-3.5">
              <p className="mb-2 text-sm font-semibold">Assigner un nouveau parcours</p>
              <div className="flex gap-2">
                <Select value={trackToAssign} onValueChange={setTrackToAssign}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Choisir un parcours" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignableTracks.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  size="default"
                  disabled={!trackToAssign || isPending}
                  onClick={() => {
                    if (!trackToAssign) return;
                    const trackId = trackToAssign;
                    startTransition(async () => {
                      await assignTrackAction(employee.id, trackId);
                      setTrackToAssign("");
                    });
                  }}
                >
                  <Send className="h-4 w-4" />
                  Assigner
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
