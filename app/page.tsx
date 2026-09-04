"use client";

import { Repeat, Home as HomeIcon, PiggyBank, Lock } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { CashflowChart } from "@/components/dashboard/cashflow-chart";
import { AlertBox } from "@/components/dashboard/alert-box";
import { Topbar } from "@/components/layout/topbar";
import { useHomeOpsStore } from "@/lib/store";
import { formatCurrency, toMonthlyAmount } from "@/lib/utils";

export default function Home() {
  const subscriptions = useHomeOpsStore((s) => s.subscriptions);
  const charges = useHomeOpsStore((s) => s.charges);
  const vault = useHomeOpsStore((s) => s.vault);
  const savingsLog = useHomeOpsStore((s) => s.savingsLog);

  const activeSubscriptions = subscriptions.filter((s) => s.active);
  const monthlySubTotal = activeSubscriptions.reduce(
    (sum, s) => sum + toMonthlyAmount(s.price, s.frequency),
    0
  );

  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthCharges = charges.reduce((sum, c) => {
    const entry = c.history.find((h) => h.month === currentMonth);
    return sum + (entry?.amount ?? 0);
  }, 0);

  const totalSavings = savingsLog.reduce((sum, s) => sum + s.yearlyAmount, 0);

  return (
    <>
      <Topbar
        title="Tableau de bord"
        subtitle="Vue d'ensemble de vos abonnements et charges du foyer."
      />
      <div className="space-y-6 pb-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Abonnements actifs"
          value={monthlySubTotal}
          formatter={formatCurrency}
          icon={Repeat}
          accent="indigo"
          hint={`${activeSubscriptions.length} abonnement${activeSubscriptions.length > 1 ? "s" : ""} / mois`}
          delay={0}
        />
        <KpiCard
          label="Charges du mois"
          value={currentMonthCharges}
          formatter={formatCurrency}
          icon={HomeIcon}
          accent="coral"
          hint={`${charges.length} charge${charges.length > 1 ? "s" : ""} du foyer`}
          delay={0.05}
        />
        <KpiCard
          label="Économies réalisées"
          value={totalSavings}
          formatter={formatCurrency}
          icon={PiggyBank}
          accent="emerald"
          hint={`${savingsLog.length} résiliation${savingsLog.length > 1 ? "s" : ""}`}
          delay={0.1}
        />
        <KpiCard
          label="Coffre-fort"
          value={vault.length}
          formatter={(v) => `${v} contrat${v > 1 ? "s" : ""}`}
          icon={Lock}
          accent="amber"
          hint="Documents et contacts sauvegardés"
          delay={0.15}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CashflowChart />
        </div>
        <AlertBox />
      </div>
      </div>
    </>
  );
}
