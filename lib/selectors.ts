import type { HouseholdCharge, Subscription } from "@/types";
import type { SavingsEntry } from "@/lib/store";
import { toMonthlyAmount, toYearlyAmount } from "@/lib/utils";

export function monthlyFixedCosts(subscriptions: Subscription[], charges: HouseholdCharge[]) {
  const subsTotal = subscriptions
    .filter((s) => s.active)
    .reduce((sum, s) => sum + toMonthlyAmount(s.price, s.frequency), 0);
  const chargesTotal = charges
    .filter((c) => c.fixed)
    .reduce((sum, c) => sum + (c.history.at(-1)?.amount ?? 0), 0);
  return subsTotal + chargesTotal;
}

export function annualProjection(subscriptions: Subscription[], charges: HouseholdCharge[]) {
  const subsTotal = subscriptions
    .filter((s) => s.active)
    .reduce((sum, s) => sum + toYearlyAmount(s.price, s.frequency), 0);
  const chargesTotal = charges.reduce((sum, c) => {
    if (c.annualAmount) return sum + c.annualAmount;
    const avg = c.history.reduce((s, h) => s + h.amount, 0) / (c.history.length || 1);
    return sum + avg * 12;
  }, 0);
  return subsTotal + chargesTotal;
}

export function moneySavedThisYear(savingsLog: SavingsEntry[]) {
  const currentYear = new Date().getFullYear();
  return savingsLog
    .filter((s) => new Date(s.date).getFullYear() === currentYear)
    .reduce((sum, s) => sum + s.yearlyAmount, 0);
}
