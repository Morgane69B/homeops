import Link from "next/link";
import { Layers, ScanSearch, Sparkles as SparklesIcon } from "lucide-react";
import { getFilterOptions } from "@/lib/catalogue";
import { HeroCopy } from "@/components/home/hero-copy";
import { NoteComposer } from "@/components/catalogue/note-composer";
import { FadeIn } from "@/components/motion/fade-in";

const PILLARS = [
  {
    icon: ScanSearch,
    title: "Comparateur en direct",
    description:
      "Tous les marchands, un seul tableau : prix, formats et disponibilité en un coup d'œil.",
  },
  {
    icon: Layers,
    title: "Pyramide olfactive",
    description:
      "Notes de tête, de cœur et de fond détaillées pour chaque parfum de notre catalogue.",
  },
  {
    icon: SparklesIcon,
    title: "Wishlist intelligente",
    description:
      "Vos coups de cœur triés automatiquement par famille olfactive dans votre espace.",
  },
];

export default async function Home() {
  const { families, notes } = await getFilterOptions();

  return (
    <div>
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-ink via-background to-background" />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #d4af37 0, transparent 45%), radial-gradient(circle at 80% 0%, #10a56f 0, transparent 40%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <HeroCopy />

          <FadeIn delay={0.15} className="mt-14">
            <NoteComposer notes={notes} target="/parfums" />
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {PILLARS.map((pillar, i) => (
            <FadeIn key={pillar.title} delay={i * 0.1}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm transition-colors hover:border-gold/30">
                <pillar.icon className="size-6 text-gold" />
                <h3 className="mt-5 font-display text-xl text-foreground">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  {pillar.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 bg-luxury-black/40">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <FadeIn>
            <span className="text-xs tracking-[0.3em] text-gold uppercase">
              Les 7 familles
            </span>
            <h2 className="mt-3 font-display text-3xl text-foreground">
              Trouvez votre signature olfactive
            </h2>
          </FadeIn>
          <div className="mt-10 flex flex-wrap gap-3">
            {families.map((family, i) => (
              <FadeIn key={family.id} delay={i * 0.05}>
                <Link
                  href="/guide"
                  className="group inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm text-foreground/80 transition-colors hover:border-gold/40 hover:text-gold"
                >
                  {family.name}
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
