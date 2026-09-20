import Link from "next/link";
import type { Metadata } from "next";
import { Layers, ScanSearch, Sparkles as SparklesIcon } from "lucide-react";
import { getFilterOptions } from "@/lib/catalogue";
import { getSiteSettings } from "@/lib/site-settings";
import { auth } from "@/auth";
import { HeroCopy } from "@/components/home/hero-copy";
import { QuickFilters } from "@/components/home/quick-filters";
import { FadeIn } from "@/components/motion/fade-in";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function Home() {
  const [{ families }, settings, session] = await Promise.all([
    getFilterOptions(),
    getSiteSettings(),
    auth(),
  ]);
  const isAdmin = session?.user?.role === "ADMIN";

  const pillars = [
    { icon: ScanSearch, title: settings.pillar1Title, description: settings.pillar1Description },
    { icon: Layers, title: settings.pillar2Title, description: settings.pillar2Description },
    { icon: SparklesIcon, title: settings.pillar3Title, description: settings.pillar3Description },
  ];

  return (
    <div>
      {isAdmin && (
        <div className="border-b border-white/10 bg-luxury-black/60">
          <div className="mx-auto flex max-w-7xl justify-end px-4 py-2 sm:px-6 lg:px-8">
            <Link
              href="/admin/site"
              className="text-xs text-muted-foreground underline-offset-2 hover:text-gold hover:underline"
            >
              Modifier la page d&apos;accueil
            </Link>
          </div>
        </div>
      )}

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
          <HeroCopy
            eyebrow={settings.heroEyebrow}
            title={settings.heroTitle}
            description={settings.heroDescription}
            ctaPrimary={settings.heroCtaPrimary}
            ctaSecondary={settings.heroCtaSecondary}
          />
        </div>
      </section>

      <section className="border-b border-white/10 bg-luxury-black/40">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <FadeIn>
            <span className="text-xs tracking-[0.3em] text-gold uppercase">
              Recherche express
            </span>
            <h2 className="mt-3 font-display text-2xl text-foreground">
              Filtrez en un clic
            </h2>
          </FadeIn>
          <div className="mt-8">
            <QuickFilters />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map((pillar, i) => (
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
              {settings.familiesEyebrow}
            </span>
            <h2 className="mt-3 font-display text-3xl text-foreground">
              {settings.familiesTitle}
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
