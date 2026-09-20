import { prisma } from "@/lib/prisma";
import { CORE_MERCHANT_NAMES } from "@/lib/merchants";
import { PerfumeForm } from "@/components/admin/perfume-form";

export default async function NewPerfumePage() {
  const [families, allNotes, coreMerchantRows] = await Promise.all([
    prisma.olfactoryFamily.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.note.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, category: true },
    }),
    prisma.merchant.findMany({
      where: { name: { in: [...CORE_MERCHANT_NAMES] } },
      select: { id: true, name: true, siteUrl: true },
    }),
  ]);

  // Same fixed roster as the edit page, just with no offer yet since the
  // perfume doesn't exist until this form is submitted.
  const coreMerchants = CORE_MERCHANT_NAMES.map((name) => {
    const merchant = coreMerchantRows.find((m) => m.name === name)!;
    return {
      merchantId: merchant.id,
      merchantName: merchant.name,
      merchantSiteUrl: merchant.siteUrl,
      offer: null,
    };
  });

  return (
    <div>
      <h2 className="font-display text-xl text-foreground">Nouveau parfum</h2>
      <div className="mt-6">
        <PerfumeForm
          mode="create"
          families={families}
          allNotes={allNotes}
          coreMerchants={coreMerchants}
        />
      </div>
    </div>
  );
}
