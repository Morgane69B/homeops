"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { HouseholdCharge, Subscription, UserProfile, VaultContract } from "@/types";
import { subscriptions as mockSubscriptions } from "@/data/subscriptions";
import { charges as mockCharges } from "@/data/charges";
import { vaultContracts as mockVault } from "@/data/vault";
import { defaultUser } from "@/data/user";
import { toYearlyAmount } from "@/lib/utils";

export interface SavingsEntry {
  id: string;
  subscriptionName: string;
  yearlyAmount: number;
  date: string; // ISO
}

interface HomeOpsState {
  subscriptions: Subscription[];
  charges: HouseholdCharge[];
  vault: VaultContract[];
  user: UserProfile;
  savingsLog: SavingsEntry[];
  cancelSubscription: (id: string) => void;
  addChargeEntry: (chargeId: string, month: string, amount: number) => void;
  updateUser: (partial: Partial<UserProfile>) => void;
}

const initialSavingsLog: SavingsEntry[] = [
  { id: "s1", subscriptionName: "Salle de sport ancienne formule", yearlyAmount: 480, date: "2026-02-11" },
  { id: "s2", subscriptionName: "Assurance emprunteur renégociée", yearlyAmount: 312, date: "2026-05-03" },
];

export const useHomeOpsStore = create<HomeOpsState>()(
  persist(
    (set, get) => ({
      subscriptions: mockSubscriptions,
      charges: mockCharges,
      vault: mockVault,
      user: defaultUser,
      savingsLog: initialSavingsLog,
      cancelSubscription: (id) => {
        const sub = get().subscriptions.find((s) => s.id === id);
        if (!sub) return;
        set((state) => ({
          subscriptions: state.subscriptions.map((s) =>
            s.id === id ? { ...s, active: false } : s
          ),
          savingsLog: [
            {
              id: `save-${id}-${Date.now()}`,
              subscriptionName: sub.name,
              yearlyAmount: toYearlyAmount(sub.price, sub.frequency),
              date: new Date().toISOString().slice(0, 10),
            },
            ...state.savingsLog,
          ],
        }));
      },
      addChargeEntry: (chargeId, month, amount) => {
        set((state) => ({
          charges: state.charges.map((c) => {
            if (c.id !== chargeId) return c;
            const existing = c.history.find((h) => h.month === month);
            const history = existing
              ? c.history.map((h) => (h.month === month ? { ...h, amount } : h))
              : [...c.history, { month, amount }].sort((a, b) => a.month.localeCompare(b.month));
            return { ...c, history };
          }),
        }));
      },
      updateUser: (partial) => set((state) => ({ user: { ...state.user, ...partial } })),
    }),
    {
      name: "homeops-storage",
      version: 1,
    }
  )
);
