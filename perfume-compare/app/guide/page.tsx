import { prisma } from "@/lib/prisma";
import { ConcentrationChart } from "@/components/guide/concentration-chart";
import { FamilyGrid } from "@/components/guide/family-grid";
import { TIPS } from "@/lib/guide-content";
import { FadeIn } from "@/components/motion/fade-in";

export default async function GuidePage() {
  const families = await prisma.olfactoryFamily.findMany({
    orderBy: { name: "asc" },
  });

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
            <FamilyGrid families={families} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn>
          <span className="text-xs tracking-[0.3em] text-gold uppercase">
            Bon usage
          </span>
          <h2 className="mt-3 font-display text-3xl text-foreground">
            Appliquer, conserver, choisir
          </h2>
        </FadeIn>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {TIPS.map((tip, i) => (
            <FadeIn key={tip.title} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <h3 className="font-display text-lg text-foreground">
                  {tip.title}
                </h3>
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
