"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Car,
  Clapperboard,
  Cloud,
  CloudCog,
  Copy,
  Dumbbell,
  type LucideIcon,
  Music,
  Package,
  PenTool,
  Router,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Topbar } from "@/components/layout/topbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useHomeOpsStore } from "@/lib/store";
import {
  CATEGORY_LABELS,
  LAW_LABELS,
  cancellationWindow,
  formatCurrency,
  formatDateFr,
  toMonthlyAmount,
} from "@/lib/utils";
import { getTemplate } from "@/data/letter-templates";
import type { Subscription } from "@/types";

const SUBSCRIPTION_ICONS: Record<string, LucideIcon> = {
  Clapperboard,
  Music,
  Sparkles,
  Package,
  Router,
  Smartphone,
  Dumbbell,
  ShieldCheck,
  Car,
  PenTool,
  Cloud,
  CloudCog,
};

function SubscriptionCard({
  subscription,
  onCancelRequest,
}: {
  subscription: Subscription;
  onCancelRequest: (sub: Subscription) => void;
}) {
  const Icon = SUBSCRIPTION_ICONS[subscription.logo] ?? Package;
  const { windowOpen, daysLeftToCancel, windowOpensIn } = cancellationWindow(subscription);
  const monthly = toMonthlyAmount(subscription.price, subscription.frequency);

  return (
    <Card className="flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${subscription.color}1A`, color: subscription.color }}
          >
            <Icon className="h-5 w-5" strokeWidth={2.2} />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{subscription.name}</p>
            <p className="text-xs text-muted">{CATEGORY_LABELS[subscription.category]}</p>
          </div>
        </div>
        {!subscription.active && <Badge variant="neutral">Résilié</Badge>}
      </div>

      <div className="mt-4 flex items-baseline gap-1.5">
        <span className="text-2xl font-semibold tabular-nums text-foreground">
          {formatCurrency(subscription.price)}
        </span>
        <span className="text-xs text-muted">
          / {subscription.frequency === "monthly" ? "mois" : subscription.frequency === "yearly" ? "an" : "semaine"}
        </span>
      </div>
      {subscription.frequency !== "monthly" && (
        <p className="text-xs text-muted">≈ {formatCurrency(monthly)} / mois</p>
      )}

      <div className="mt-4 flex flex-1 flex-col justify-end gap-2.5">
        <p className="text-xs text-muted">
          Prochain renouvellement : <span className="text-foreground">{formatDateFr(subscription.nextRenewal)}</span>
        </p>

        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="neutral">{LAW_LABELS[subscription.cancellationLaw]}</Badge>
          {subscription.active && windowOpen && (
            <Badge variant="coral">
              Résiliable maintenant · {daysLeftToCancel} j
            </Badge>
          )}
          {subscription.active && !windowOpen && subscription.noticePeriodDays === 0 && (
            <Badge variant="emerald">Résiliable à tout moment</Badge>
          )}
          {subscription.active && !windowOpen && subscription.noticePeriodDays > 0 && windowOpensIn > 0 && (
            <Badge variant="neutral">Fenêtre dans {windowOpensIn} j</Badge>
          )}
        </div>

        {subscription.active && (
          <Button variant="destructive" size="sm" onClick={() => onCancelRequest(subscription)}>
            Résilier
          </Button>
        )}
      </div>
    </Card>
  );
}

export function AbonnementsView() {
  const searchParams = useSearchParams();
  const subscriptions = useHomeOpsStore((s) => s.subscriptions);
  const user = useHomeOpsStore((s) => s.user);
  const cancelSubscription = useHomeOpsStore((s) => s.cancelSubscription);

  const requestedId = searchParams.get("resilier");
  const requestedSub = requestedId
    ? subscriptions.find((s) => s.id === requestedId && s.active) ?? null
    : null;

  const [selected, setSelected] = useState<Subscription | null>(() => requestedSub);
  const [open, setOpen] = useState(() => requestedSub !== null);
  const [copied, setCopied] = useState(false);

  const active = subscriptions
    .filter((s) => s.active)
    .sort((a, b) => cancellationWindow(b).windowOpen === cancellationWindow(a).windowOpen
      ? a.nextRenewal.localeCompare(b.nextRenewal)
      : cancellationWindow(b).windowOpen ? 1 : -1);
  const cancelled = subscriptions.filter((s) => !s.active);

  const monthlyTotal = active.reduce((sum, s) => sum + toMonthlyAmount(s.price, s.frequency), 0);

  const template = selected ? getTemplate(selected.cancellationLaw) : null;
  const letterText =
    selected && template
      ? template.body({ user, subscription: selected, date: new Date().toISOString().slice(0, 10) })
      : "";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(letterText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable — user can still select the text manually
    }
  }

  function handleConfirmCancel() {
    if (!selected) return;
    cancelSubscription(selected.id);
    setOpen(false);
  }

  return (
    <>
      <Topbar
        title="Abonnements"
        subtitle={`${active.length} abonnement${active.length > 1 ? "s" : ""} actif${active.length > 1 ? "s" : ""} · ${formatCurrency(monthlyTotal)} / mois`}
      />
      <div className="space-y-6 pb-6">
      <Tabs defaultValue="actifs">
        <TabsList>
          <TabsTrigger value="actifs">Actifs ({active.length})</TabsTrigger>
          <TabsTrigger value="resilies">Résiliés ({cancelled.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="actifs" className="mt-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {active.map((sub, i) => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
              >
                <SubscriptionCard subscription={sub} onCancelRequest={(s) => { setSelected(s); setOpen(true); }} />
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resilies" className="mt-5">
          {cancelled.length === 0 ? (
            <p className="text-sm text-muted">Aucun abonnement résilié pour le moment.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cancelled.map((sub) => (
                <SubscriptionCard key={sub.id} subscription={sub} onCancelRequest={() => {}} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          {selected && template && (
            <>
              <DialogHeader>
                <DialogTitle>{template.title}</DialogTitle>
                <DialogDescription>{template.legalBasis}</DialogDescription>
              </DialogHeader>

              <p className="mb-2 text-sm font-medium text-foreground">
                Lettre de résiliation — {selected.name}
              </p>
              <pre className="max-h-64 overflow-y-auto whitespace-pre-wrap rounded-xl bg-slate-900/5 p-4 text-xs leading-relaxed text-foreground dark:bg-white/5">
                {letterText}
              </pre>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Copy className="h-3.5 w-3.5" />
                  {copied ? "Copié !" : "Copier le texte"}
                </Button>
                <Button variant="destructive" size="sm" onClick={handleConfirmCancel}>
                  Confirmer la résiliation
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
