import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPerfumeBySlug, getRelatedPerfumes } from "@/lib/catalogue";
import { resolvePerfumeImage } from "@/lib/product-image";
import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { NoteInfusionIntro } from "@/components/product/note-infusion-intro";
import { OlfactoryPyramid } from "@/components/product/olfactory-pyramid";
import { PriceTable } from "@/components/product/price-table";
import { PerfumeCard } from "@/components/catalogue/perfume-card";
import { WishlistButton } from "@/components/catalogue/wishlist-button";
import { FadeIn } from "@/components/motion/fade-in";
import { getWishlistedIds } from "@/lib/actions/wishlist";

const CONCENTRATION_LABELS: Record<string, string> = {
  EXTRAIT_DE_PARFUM: "Extrait de Parfum",
  EAU_DE_PARFUM: "Eau de Parfum",
  EAU_DE_TOILETTE: "Eau de Toilette",
  EAU_DE_COLOGNE: "Eau de Cologne",
};

const GENDER_LABELS: Record<string, string> = {
  HOMME: "Homme",
  FEMME: "Femme",
  MIXTE: "Mixte",
};

export async function generateMetadata({
  params,
}: PageProps<"/parfums/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const perfume = await getPerfumeBySlug(slug);
  if (!perfume) return {};

  const image = resolvePerfumeImage(perfume);
  const title = `${perfume.name} — ${perfume.brand}`;

  return {
    title,
    description: perfume.description,
    alternates: { canonical: `/parfums/${perfume.slug}` },
    openGraph: {
      title: `${title} | Essence`,
      description: perfume.description,
      url: `/parfums/${perfume.slug}`,
      type: "website",
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Essence`,
      description: perfume.description,
      images: [image],
    },
  };
}

export default async function ParfumDetailPage({
  params,
}: PageProps<"/parfums/[slug]">) {
  const { slug } = await params;
  const perfume = await getPerfumeBySlug(slug);
  if (!perfume) notFound();

  const [related, wishlistedIds, session] = await Promise.all([
    getRelatedPerfumes(perfume.mainFamilyId, perfume.id),
    getWishlistedIds(),
    auth(),
  ]);

  const image = resolvePerfumeImage(perfume);
  const isAdmin = session?.user?.role === "ADMIN";

  const numericOffers = perfume.offers.map((o) => ({ ...o, price: Number(o.price) }));
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: perfume.name,
    brand: { "@type": "Brand", name: perfume.brand },
    description: perfume.description,
    image,
    ...(numericOffers.length > 0
      ? {
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "EUR",
            lowPrice: Math.min(...numericOffers.map((o) => o.price)),
            highPrice: Math.max(...numericOffers.map((o) => o.price)),
            offerCount: numericOffers.length,
            offers: numericOffers.map((o) => ({
              "@type": "Offer",
              price: o.price,
              priceCurrency: "EUR",
              url: o.affiliateUrl,
              availability: o.stock
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
              seller: { "@type": "Organization", name: o.merchant.name },
            })),
          },
        }
      : {}),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <nav className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/parfums" className="hover:text-gold">
          Catalogue
        </Link>
        <span>/</span>
        <span className="text-foreground/70">{perfume.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="text-xs tracking-[0.3em] text-gold uppercase">
            {perfume.brand}
          </span>
          <h1 className="mt-3 font-display text-4xl text-foreground sm:text-5xl">
            {perfume.name}
          </h1>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="secondary" className="border-white/10 bg-white/5">
              {perfume.mainFamily.name}
            </Badge>
            <Badge variant="secondary" className="border-white/10 bg-white/5">
              {CONCENTRATION_LABELS[perfume.concentration]}
            </Badge>
            <Badge variant="secondary" className="border-white/10 bg-white/5">
              {GENDER_LABELS[perfume.gender]}
            </Badge>
          </div>

          <p className="mt-6 max-w-md text-muted-foreground">
            {perfume.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {perfume.minPrice != null && (
              <span className="font-display text-2xl text-gold">
                dès {perfume.minPrice.toFixed(2)} €{" "}
                <span className="text-sm font-sans text-muted-foreground">
                  / 50 ml
                </span>
              </span>
            )}
            <WishlistButton
              perfumeId={perfume.id}
              initialWishlisted={wishlistedIds.has(perfume.id)}
              variant="label"
            />
            {isAdmin && (
              <Link
                href={`/admin/parfums/${perfume.id}`}
                className="text-xs text-muted-foreground underline-offset-2 hover:text-gold hover:underline"
              >
                Modifier
              </Link>
            )}
          </div>
        </div>

        <div>
          <div className="relative h-[320px] overflow-hidden rounded-3xl sm:h-[420px]">
            <div
              className="absolute inset-0 scale-110 bg-cover bg-center opacity-30 blur-2xl"
              style={{ backgroundImage: `url(${image})` }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background/60" />
            <div className="relative size-full">
              <Image
                src={image}
                alt={`${perfume.brand} ${perfume.name}`}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-contain p-10 sm:p-14"
                priority
              />
              <NoteInfusionIntro notes={perfume.notes} />
            </div>
          </div>
        </div>
      </div>

      <section className="mt-20">
        <FadeIn>
          <span className="text-xs tracking-[0.3em] text-gold uppercase">
            Pyramide olfactive
          </span>
          <h2 className="mt-3 font-display text-2xl text-foreground">
            La composition
          </h2>
        </FadeIn>
        <div className="mt-8">
          <OlfactoryPyramid notes={perfume.notes} />
        </div>
      </section>

      <section className="mt-20">
        <FadeIn>
          <span className="text-xs tracking-[0.3em] text-gold uppercase">
            Comparateur
          </span>
          <h2 className="mt-3 font-display text-2xl text-foreground">
            Où l&apos;acheter au meilleur prix
          </h2>
        </FadeIn>
        <div className="mt-8">
          <PriceTable
            offers={perfume.offers.map((offer) => ({
              ...offer,
              price: Number(offer.price),
            }))}
          />
        </div>
      </section>

      {perfume.articles.length > 0 && (
        <section className="mt-20">
          <span className="text-xs tracking-[0.3em] text-gold uppercase">
            À lire
          </span>
          <h2 className="mt-3 font-display text-2xl text-foreground">
            Mentionné dans le journal
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {perfume.articles.map((article) => (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-foreground/80 transition-colors hover:border-gold/30 hover:text-gold"
              >
                {article.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-20">
          <span className="text-xs tracking-[0.3em] text-gold uppercase">
            Dans la même famille
          </span>
          <h2 className="mt-3 font-display text-2xl text-foreground">
            Vous aimerez aussi
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <PerfumeCard
                key={p.id}
                perfume={p}
                isWishlisted={wishlistedIds.has(p.id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
