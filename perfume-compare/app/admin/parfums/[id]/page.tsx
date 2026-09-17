import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PerfumeForm } from "@/components/admin/perfume-form";

export default async function EditPerfumePage({
  params,
}: PageProps<"/admin/parfums/[id]">) {
  const { id } = await params;

  const [perfume, families] = await Promise.all([
    prisma.perfume.findUnique({
      where: { id },
      include: { offers: { include: { merchant: true }, orderBy: { volumeMl: "asc" } } },
    }),
    prisma.olfactoryFamily.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!perfume) notFound();

  return (
    <div>
      <h2 className="font-display text-xl text-foreground">
        {perfume.brand} — {perfume.name}
      </h2>
      <div className="mt-6">
        <PerfumeForm
          mode="edit"
          families={families}
          perfume={{
            id: perfume.id,
            name: perfume.name,
            brand: perfume.brand,
            gender: perfume.gender,
            concentration: perfume.concentration,
            mainFamilyId: perfume.mainFamilyId,
            description: perfume.description,
            imageUrl: perfume.imageUrl,
            offers: perfume.offers.map((o) => ({
              id: o.id,
              price: Number(o.price),
              volumeMl: o.volumeMl,
              merchantName: o.merchant.name,
              affiliateUrl: o.affiliateUrl,
            })),
          }}
        />
      </div>
    </div>
  );
}
