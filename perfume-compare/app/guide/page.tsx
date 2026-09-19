import Link from "next/link";
import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { ConcentrationChart } from "@/components/guide/concentration-chart";
import { FamilyGrid } from "@/components/guide/family-grid";
import { FadeIn } from "@/components/motion/fade-in";

export const metadata: Metadata = {
  title: "Le Guide du Parfum | Essence",
  description:
    "Concentrations, familles olfactives et bons gestes d'usage : tout comprendre avant de choisir votre prochain parfum.",
  alternates: { canonical: "/guide" },
};

export default async function GuidePage() {
  const [families, tips, session] = await Promise.all([
    prisma.olfactoryFamily.findMany({ orderBy: { name: "asc" } }),
    prisma.guideTip.findMany({ orderBy: { order: "asc" } }),
    auth(),
  ]);
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div>
      <section className="border-b border-white/10 bg-luxury-ink/40">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:py-20">
          <span className="text-xs tracking-[0.3em] text-gold uppercase">
            Le Guide du Parfum
          </span>
          <h1 className="mt-4 font-display text-4xl text-foreground sm:text-5xl">
            Comprendre avant de choisir
          </h1>
          <p className="mt-4 text-muted-foreground">
            Concentrations, familles olfactives, gestes d&apos;usage — de
            quoi affiner votre nez avant de comparer les prix.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn>
          <span className="text-xs tracking-[0.3em] text-gold uppercase">
            Les concentrations
          </span>
          <h2 className="mt-3 font-display text-3xl text-foreground">
            Extrait, Eau de Parfum, de Toilette, de Cologne
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            La différence tient à une seule chose : la proportion d&apos;huile
            parfumée diluée dans l&apos;alcool. Plus elle est élevée, plus la
            tenue est longue et le sillage riche.
          </p>
        </FadeIn>
        <div className="mt-10">
          <ConcentrationChart />
        </div>
      </section>

      <section className="border-t border-white/10 bg-luxury-black/40">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <FadeIn>
            <span className="text-xs tracking-[0.3em] text-gold uppercase">
              Les 7 familles olfactives
            </span>
            <h2 className="mt-3 font-display text-3xl text-foreground">
              Trouver sa signature
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Toute composition appartient à une famille dominante, elle-même
              divisée en sous-familles plus précises.
            </p>
          </FadeIn>
          <div className="mt-10">
            <FamilyGrid families={families} isAdmin={isAdmin} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <FadeIn>
            <span className="text-xs tracking-[0.3em] text-gold uppercase">
              Tout savoir
            </span>
            <h2 className="mt-3 font-display text-3xl text-foreground">
              Appliquer, conserver, choisir
            </h2>
          </FadeIn>
          {isAdmin && (
            <Link
              href="/admin/guide/new"
              className="flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-sm font-medium text-gold-foreground transition-colors hover:bg-gold/90"
            >
              <Plus className="size-4" />
              Nouveau conseil
            </Link>
          )}
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {tips.map((tip, i) => (
            <FadeIn key={tip.id} delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-lg text-foreground">
                    {tip.title}
                  </h3>
                  {isAdmin && (
                    <Link
                      href={`/admin/guide/${tip.id}`}
                      className="shrink-0 text-xs text-muted-foreground underline-offset-2 hover:text-gold hover:underline"
                    >
                      Modifier
                    </Link>
                  )}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {tip.body}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
    </div>
  );
}
