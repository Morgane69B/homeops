import { ManagerDashboard } from "@/components/onboarding/manager-dashboard";
import { getOnboardingData } from "@/lib/onboarding-data";

export const dynamic = "force-dynamic";

export default async function ManagerPage() {
  const { employees, allTracks, allBadges } = await getOnboardingData();
  return <ManagerDashboard employees={employees} allTracks={allTracks} allBadges={allBadges} />;
}
