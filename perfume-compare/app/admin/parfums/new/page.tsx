import { prisma } from "@/lib/prisma";
import { PerfumeForm } from "@/components/admin/perfume-form";

export default async function NewPerfumePage() {
  const families = await prisma.olfactoryFamily.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div>
      <h2 className="font-display text-xl text-foreground">Nouveau parfum</h2>
      <div className="mt-6">
        <PerfumeForm mode="create" families={families} />
      </div>
    </div>
  );
}
