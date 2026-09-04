import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { BillingFrequency, Subscription } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function formatDateFr(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export function toMonthlyAmount(price: number, frequency: BillingFrequency): number {
  if (frequency === "yearly") return price / 12;
  if (frequency === "weekly") return (price * 52) / 12;
  return price;
}

export function toYearlyAmount(price: number, frequency: BillingFrequency): number {
  if (frequency === "monthly") return price * 12;
  if (frequency === "weekly") return price * 52;
  return price;
}

export function daysUntil(dateIso: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateIso);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * The cancellation window opens `noticePeriodDays` before renewal.
 * Returns days remaining inside that window (0 once passed, negative once the
 * renewal itself has passed) alongside whether the window is currently open.
 */
export function cancellationWindow(sub: Subscription): {
  windowOpen: boolean;
  daysLeftToCancel: number;
  windowOpensIn: number;
} {
  const daysToRenewal = daysUntil(sub.nextRenewal);
  const windowOpensIn = daysToRenewal - sub.noticePeriodDays;
  const windowOpen = windowOpensIn <= 0 && daysToRenewal >= 0;
  return {
    windowOpen,
    daysLeftToCancel: windowOpen ? daysToRenewal : 0,
    windowOpensIn: windowOpensIn > 0 ? windowOpensIn : 0,
  };
}

export const CATEGORY_LABELS: Record<string, string> = {
  entertainment: "Divertissement",
  utilities: "Services",
  professional: "Professionnel",
  insurance: "Assurance",
  fitness: "Sport & Bien-être",
  cloud: "Cloud & Stockage",
  electricity: "Électricité",
  gas: "Gaz",
  water: "Eau",
  internet: "Internet & Mobile",
  mobile: "Mobile",
  home_insurance: "Assurance habitation",
  property_tax: "Taxe foncière",
  condo_fees: "Charges de copropriété",
};

export const LAW_LABELS: Record<string, string> = {
  hamon: "Loi Hamon",
  chatel: "Loi Chatel",
  standard: "Résiliation standard",
};
