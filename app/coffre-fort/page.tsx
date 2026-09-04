"use client";

import { Mail, Phone, TriangleAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Topbar } from "@/components/layout/topbar";
import { useHomeOpsStore } from "@/lib/store";
import { CATEGORY_ICONS } from "@/lib/category-icons";
import { CATEGORY_LABELS, daysUntil, formatDateFr } from "@/lib/utils";
import type { VaultContract } from "@/types";

function VaultCard({ contract }: { contract: VaultContract }) {
  const Icon = CATEGORY_ICONS[contract.category];
  const expiryDays = contract.documentExpiry ? daysUntil(contract.documentExpiry) : null;
  const expirySoon = expiryDays !== null && expiryDays <= 90;

  return (
    <Card className="flex h-full flex-col gap-3 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-soft text-indigo">
          <Icon className="h-5 w-5" strokeWidth={2.2} />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{contract.serviceName}</p>
          <p className="text-xs text-muted">{CATEGORY_LABELS[contract.category] ?? contract.category}</p>
        </div>
      </div>

      <p className="text-xs text-muted">
        N° contrat : <span className="text-foreground">{contract.contractNumber}</span>
      </p>

      <div className="flex flex-col gap-1.5 text-xs">
        <a
          href={`tel:${contract.customerServicePhone.replace(/\s+/g, "")}`}
          className="flex items-center gap-2 text-foreground hover:text-indigo"
        >
          <Phone className="h-3.5 w-3.5 shrink-0 text-muted" />
          {contract.customerServicePhone}
        </a>
        {contract.customerServiceEmail && (
          <a
            href={`mailto:${contract.customerServiceEmail}`}
            className="flex items-center gap-2 text-foreground hover:text-indigo"
          >
            <Mail className="h-3.5 w-3.5 shrink-0 text-muted" />
            {contract.customerServiceEmail}
          </a>
        )}
      </div>

      {contract.documentExpiry && (
        <Badge variant={expirySoon ? "coral" : "neutral"} className="w-fit">
          {expirySoon && <TriangleAlert className="h-3 w-3" />}
          {expirySoon
            ? `Expire dans ${expiryDays} j`
            : `Valide jusqu'au ${formatDateFr(contract.documentExpiry)}`}
        </Badge>
      )}

      {contract.notes && <p className="mt-auto text-xs italic text-muted">{contract.notes}</p>}
    </Card>
  );
}

export default function CoffreFortPage() {
  const vault = useHomeOpsStore((s) => s.vault);
  const expiringSoon = vault.filter(
    (v) => v.documentExpiry && daysUntil(v.documentExpiry) <= 90
  ).length;

  return (
    <>
      <Topbar
        title="Coffre-fort"
        subtitle={`${vault.length} contrats et documents${expiringSoon > 0 ? ` · ${expiringSoon} à renouveler bientôt` : ""}`}
      />
      <div className="space-y-6 pb-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {vault.map((contract) => (
            <VaultCard key={contract.id} contract={contract} />
          ))}
        </div>
      </div>
    </>
  );
}
