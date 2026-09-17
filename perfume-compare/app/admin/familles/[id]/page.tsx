import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { FamilyForm } from "@/components/admin/family-form";

export default async function EditFamilyPage({
  params,
}: PageProps<"/admin/familles/[id]">) {
  const { id } = await params;
  const family = await prisma.olfactoryFamily.findUnique({ where: { id } });
  if (!family) notFound();

  return (
    <div>
      <h2 className="font-display text-xl text-foreground">{family.name}</h2>
      <div className="mt-6">
        <FamilyForm
          family={{
            id: family.id,
            name: family.name,
            description: family.description,
          }}
        />
      </div>
    </div>
  );
}
