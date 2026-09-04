"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Flame, ArrowRight, PartyPopper } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useHomeOpsStore } from "@/lib/store";
import { cancellationWindow, LAW_LABELS } from "@/lib/utils";

export function AlertBox() {
  const subscriptions = useHomeOpsStore((s) => s.subscriptions);

  const urgent = subscriptions
    .filter((s) => s.active)
    .map((s) => ({ sub: s, window: cancellationWindow(s) }))
    .filter((x) => x.window.windowOpen)
    .sort((a, b) => a.window.daysLeftToCancel - b.window.daysLeftToCancel);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-foreground text-base font-semibold">
          <Flame className="h-4.5 w-4.5 text-coral" strokeWidth={2.2} />
          La boîte d&apos;alerte brûlante
        </CardTitle>
        {urgent.length > 0 && <Badge variant="coral">{urgent.length} urgent{urgent.length > 1 ? "s" : ""}</Badge>}
      </CardHeader>
      <CardContent className="space-y-2.5">
        {urgent.length === 0 && (
          <div className="flex items-center gap-3 rounded-xl bg-emerald-soft px-4 py-6 text-emerald">
            <PartyPopper className="h-5 w-5 shrink-0" />
            <p className="text-sm font-medium">
              Aucune fenêtre de résiliation urgente. Tous vos contrats sont sous contrôle.
            </p>
          </div>
        )}
        {urgent.map(({ sub, window }, i) => (
          <motion.div
            key={sub.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35 }}
          >
            <Link
              href={`/abonnements?resilier=${sub.id}`}
              className="group flex items-center justify-between gap-3 rounded-xl border border-coral/20 bg-coral-soft/60 px-4 py-3 transition-all hover:scale-[1.01] hover:border-coral/40"
            >
              <div className="flex items-center gap-3">
                <span className="glow-coral h-2 w-2 shrink-0 rounded-full bg-coral" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    ⚠️ {sub.name} : {window.daysLeftToCancel} jour{window.daysLeftToCancel > 1 ? "s" : ""} restant
                    {window.daysLeftToCancel > 1 ? "s" : ""} pour résilier sans frais
                  </p>
                  <p className="text-xs text-muted">{LAW_LABELS[sub.cancellationLaw]}</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-coral opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
