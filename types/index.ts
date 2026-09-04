export type BillingFrequency = "monthly" | "yearly" | "weekly";

export type SubscriptionCategory =
  | "entertainment"
  | "utilities"
  | "professional"
  | "insurance"
  | "fitness"
  | "cloud";

export type PaymentMethod = "cb" | "sepa" | "paypal";

export type CancellationLaw = "hamon" | "chatel" | "standard";

export interface Subscription {
  id: string;
  name: string;
  category: SubscriptionCategory;
  logo: string; // icon key or initials
  color: string; // brand hex
  price: number; // amount per billing cycle
  frequency: BillingFrequency;
  nextRenewal: string; // ISO date
  paymentMethod: PaymentMethod;
  paymentLast4?: string;
  cancellationLaw: CancellationLaw;
  noticePeriodDays: number; // days before renewal that cancellation notice is required
  contractStart: string; // ISO date
  clientNumber?: string;
  active: boolean;
}

export type ChargeType =
  | "electricity"
  | "gas"
  | "water"
  | "internet"
  | "mobile"
  | "home_insurance"
  | "property_tax"
  | "condo_fees";

export interface HouseholdCharge {
  id: string;
  type: ChargeType;
  label: string;
  provider: string;
  color: string;
  fixed: boolean; // fixed vs variable amount
  history: { month: string; amount: number }[]; // month = "2026-01"
  clientNumber?: string;
  contractNumber?: string;
  annualAmount?: number; // for once-a-year charges like property tax
  dueDate?: string; // ISO date of next annual payment
}

export interface VaultContract {
  id: string;
  serviceName: string;
  category: SubscriptionCategory | ChargeType;
  contractNumber: string;
  customerServicePhone: string;
  customerServiceEmail?: string;
  documentExpiry?: string; // ISO date
  notes?: string;
}

export interface UserProfile {
  fullName: string;
  address: string;
  postalCode: string;
  city: string;
  email: string;
}

export interface LetterTemplate {
  id: CancellationLaw;
  title: string;
  legalBasis: string;
  body: (params: {
    user: UserProfile;
    subscription: Subscription;
    date: string;
  }) => string;
}
