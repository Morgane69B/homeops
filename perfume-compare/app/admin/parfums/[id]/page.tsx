import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CORE_MERCHANT_NAMES } from "@/lib/merchants";
import { PerfumeForm } from "@/components/admin/perfume-form";

export default async function EditPerfumePage({
  params,
}: PageProps<"/admin/parfums/[id]">) {
  const { id } = await params;

  const [perfume, families, allNotes, coreMerchantRows] = await Promise.all([
    prisma.perfume.findUnique({
      where: { id },
      include: {
        offers: { include: { merchant: true }, orderBy: { volumeMl: "asc" } },
        notes: { select: { id: true } },
      },
    }),
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

  if (!perfume) notFound();

  const offerByMerchantId = new Map(
    perfume.offers.map((o) => [o.merchantId, o]),
  );

  // Fixed roster, in the declared order, each paired with this perfume's
  // existing offer (if any) so the admin can add or remove it with one click.
  const coreMerchants = CORE_MERCHANT_NAMES.map((name) => {
    const merchant = coreMerchantRows.find((m) => m.name === name)!;
    const offer = offerByMerchantId.get(merchant.id);
    return {
      merchantId: merchant.id,
      merchantName: merchant.name,
      merchantSiteUrl: merchant.siteUrl,
      offer: offer
        ? {
            id: offer.id,
            price: Number(offer.price),
            volumeMl: offer.volumeMl,
            affiliateUrl: offer.affiliateUrl,
          }
        : null,
    };
  });

  // The brand's own official site, if the admin has added one: always shown
  // pinned above every other offer on the public price table.
  const officialOfferRow = perfume.offers.find((o) => o.isOfficial);
  const officialOffer = officialOfferRow
    ? {
        id: officialOfferRow.id,
        price: Number(officialOfferRow.price),
        volumeMl: officialOfferRow.volumeMl,
        affiliateUrl: officialOfferRow.affiliateUrl,
      }
    : null;

  // Anything outside the fixed roster and not the official offer (e.g. a
  // merchant seeded before this roster existed) still shows up below it.
  const extraOffers = perfume.offers
    .filter(
      (o) =>
        !o.isOfficial && !CORE_MERCHANT_NAMES.includes(o.merchant.name as never),
    )
    .map((o) => ({
      id: o.id,
      price: Number(o.price),
      volumeMl: o.volumeMl,
      merchantName: o.merchant.name,
      affiliateUrl: o.affiliateUrl,
    }));

  return (
    <div>
      <h2 className="font-display text-xl text-foreground">
        {perfume.brand} — {perfume.name}
      </h2>
      <div className="mt-6">
        <PerfumeForm
          mode="edit"
          families={families}
          allNotes={allNotes}
          coreMerchants={coreMerchants}
          perfume={{
            id: perfume.id,
            name: perfume.name,
            brand: perfume.brand,
            gender: perfume.gender,
            concentration: perfume.concentration,
            mainFamilyId: perfume.mainFamilyId,
            description: perfume.description,
            imageUrl: perfume.imageUrl,
            noteIds: perfume.notes.map((n) => n.id),
            officialOffer,
            extraOffers,
          }}
        />
      </div>
    </div>
  );
}
