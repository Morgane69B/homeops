"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TooltipContentProps } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHomeOpsStore } from "@/lib/store";
import { formatCurrency, toMonthlyAmount } from "@/lib/utils";

const MONTH_LABELS: Record<string, string> = {
  "01": "Jan", "02": "Fév", "03": "Mar", "04": "Avr", "05": "Mai", "06": "Juin",
  "07": "Juil", "08": "Août", "09": "Sept", "10": "Oct", "11": "Nov", "12": "Déc",
};

function CustomTooltip({ active, payload, label }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-3.5 py-2.5 shadow-xl">
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="text-sm font-semibold text-foreground">{formatCurrency(Number(payload[0].value ?? 0))}</p>
    </div>
  );
}

export function CashflowChart() {
  const subscriptions = useHomeOpsStore((s) => s.subscriptions);
  const charges = useHomeOpsStore((s) => s.charges);

  const monthlySubTotal = subscriptions
    .filter((s) => s.active)
    .reduce((sum, s) => sum + toMonthlyAmount(s.price, s.frequency), 0);

  const months = charges[0]?.history.map((h) => h.month) ?? [];
  const currentMonth = new Date().toISOString().slice(0, 7);

  const data = months.map((month) => {
    const chargesTotal = charges.reduce((sum, c) => {
      const entry = c.history.find((h) => h.month === month);
      return sum + (entry?.amount ?? 0);
    }, 0);
    const [, mm] = month.split("-");
    return {
      month: MONTH_LABELS[mm] ?? month,
      total: Math.round((chargesTotal + monthlySubTotal) * 100) / 100,
      isCurrent: month === currentMonth,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground text-base font-semibold">
          Trésorerie — 6 derniers mois
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
              accessibilityLayer
              role="img"
              aria-label={`Trésorerie mensuelle, 6 derniers mois. Dernier mois : ${formatCurrency(data.at(-1)?.total ?? 0)}.`}
            >
              <defs>
                <linearGradient id="cashflowGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-black/5 dark:text-white/10" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "var(--muted)" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "var(--muted)" }}
                tickFormatter={(v) => `${v}€`}
                width={48}
              />
              <Tooltip content={CustomTooltip} cursor={{ stroke: "#6366f1", strokeWidth: 1, strokeDasharray: "4 4" }} />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#6366f1"
                strokeWidth={2.5}
                fill="url(#cashflowGradient)"
                dot={{ r: 3, fill: "#6366f1", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
