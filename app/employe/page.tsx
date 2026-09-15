import { EmployeeHome } from "@/components/onboarding/employee-home";
import { getOnboardingData } from "@/lib/onboarding-data";

export const dynamic = "force-dynamic";

export default async function EmployeePage({
  searchParams,
}: {
  searchParams: Promise<{ as?: string }>;
}) {
  const { as } = await searchParams;
  const { employees, allBadges } = await getOnboardingData();
  const employee = employees.find((e) => e.id === as) ?? employees[0];

  return (
    <EmployeeHome
      employee={employee}
      allBadges={allBadges}
      allEmployees={employees.map((e) => ({ id: e.id, name: e.name }))}
    />
  );
}
