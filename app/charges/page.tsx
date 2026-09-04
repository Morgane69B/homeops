"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import type { TooltipContentProps } from "recharts";
import { Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Topbar } from "@/components/layout/topbar";
import { useHomeOpsStore } from "@/lib/store";
import { CATEGORY_ICONS } from "@/lib/category-icons";
import { formatCurrency, formatDateFr } from "@/lib/utils";
import type { HouseholdCharge } from "@/types";

function MiniTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload as { month: string; amount: number };
  return (
    <div className="glass rounded-lg px-2.5 py-1.5 text-xs font-medium text-foreground shadow-lg">
      {point.month} · {formatCurrency(point.amount)}
    </div>
  );
}

function ChargeCard({ charge, currentMonth }: { charge: HouseholdCharge; currentMonth: string }) {
  const Icon = CATEGORY_ICONS[charge.type];
  const currentEntry = charge.history.find((h) => h.month === currentMonth);
  const hasAnnual = charge.annualAmount != null;

  return (
    <Card className="flex h-full flex-col p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${charge.color}1A`, color: charge.color }}
          >
            <Icon className="h-5 w-5" strokeWidth={2.2} />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{charge.label}</p>
            <p className="text-xs text-muted">{charge.provider}</p>
          </div>
        </div>
        <Badge variant={charge.fixed ? "neutral" : "indigo"}>{charge.fixed ? "Fixe" : "Variable"}</Badge>
      </div>

      {hasAnnual ? (
        <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-slate-900/5 px-3.5 py-3 dark:bg-white/5">
          <Calendar className="h-4 w-4 shrink-0 text-muted" />
          <div>
            <p className="text-sm font-semibold text-foreground">{formatCurrency(charge.annualAmount!)}</p>
            <p className="text-xs text-muted">
              Échéance {charge.dueDate ? formatDateFr(charge.dueDate) : "à venir"}
            </p>
          </div>
        </div>
      ) : (
        <>
          <p className="mt-4 text-2xl font-semibold tabular-nums text-foreground">
            {formatCurrency(currentEntry?.amount ?? 0)}
            <span className="ml-1 text-xs font-normal text-muted">ce mois-ci</span>
          </p>
          <div
            className="mt-2 h-14 w-full"
            role="img"
            aria-label={`Historique 6 mois de ${charge.label}, dernier montant ${formatCurrency(currentEntry?.amount ?? 0)}`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charge.history} accessibilityLayer margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={`grad-${charge.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={charge.color} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={charge.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip content={MiniTooltip} />
                <Area type="monotone" dataKey="amount" stroke={charge.color} strokeWidth={2} fill={`url(#grad-${charge.id})`} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      <p className="mt-3 text-xs text-muted">
        {charge.clientNumber && <>N° client : {charge.clientNumber}</>}
        {charge.contractNumber && <>N° contrat : {charge.contractNumber}</>}
      </p>
    </Card>
  );
}

export default function ChargesPage() {
  const charges = useHomeOpsStore((s) => s.charges);
  const currentMonth = new Date().toISOString().slice(0, 7);

  const monthlyTotal = charges.reduce((sum, c) => {
    const entry = c.history.find((h) => h.month === currentMonth);
    return sum + (entry?.amount ?? 0);
  }, 0);

  return (
    <>
      <Topbar
        title="Charges du foyer"
        subtitle={`${charges.length} charges · ${formatCurrency(monthlyTotal)} ce mois-ci`}
      />
      <div className="space-y-6 pb-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {charges.map((charge) => (
            <ChargeCard key={charge.id} charge={charge} currentMonth={currentMonth} />
          ))}
        </div>
      </div>
    </>
  );
}
