import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { GuideTipForm } from "@/components/admin/guide-tip-form";

export default async function EditGuideTipPage({
  params,
}: PageProps<"/admin/guide/[id]">) {
  const { id } = await params;
  const tip = await prisma.guideTip.findUnique({ where: { id } });
  if (!tip) notFound();

  return (
    <div>
      <h2 className="font-display text-xl text-foreground">{tip.title}</h2>
      <div className="mt-6">
        <GuideTipForm
          mode="edit"
          tip={{ id: tip.id, title: tip.title, body: tip.body }}
        />
      </div>
    </div>
  );
}
