import {
  Briefcase,
  Building2,
  Clapperboard,
  Cloud,
  Droplet,
  Dumbbell,
  Flame,
  Landmark,
  Router,
  ShieldCheck,
  Smartphone,
  Wifi,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { ChargeType, SubscriptionCategory } from "@/types";

export const CATEGORY_ICONS: Record<SubscriptionCategory | ChargeType, LucideIcon> = {
  entertainment: Clapperboard,
  utilities: Router,
  professional: Briefcase,
  insurance: ShieldCheck,
  fitness: Dumbbell,
  cloud: Cloud,
  electricity: Zap,
  gas: Flame,
  water: Droplet,
  internet: Wifi,
  mobile: Smartphone,
  home_insurance: ShieldCheck,
  property_tax: Landmark,
  condo_fees: Building2,
};
