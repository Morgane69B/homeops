import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Heart } from "lucide-react";
import { auth } from "@/auth";
import { getWishlistByFamily } from "@/lib/dashboard";
import { PerfumeCard } from "@/components/catalogue/perfume-card";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Mon espace | Essence",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/dashboard");

  const groups = await getWishlistByFamily(session.user.id);
  const totalCount = groups.reduce((sum, g) => sum + g.perfumes.length, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs tracking-[0.3em] text-gold uppercase">
            Espace personnel
          </span>
          <h1 className="mt-3 font-display text-4xl text-foreground">
            Bonjour {session.user.name ?? session.user.email}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {totalCount} parfum{totalCount > 1 ? "s" : ""} dans votre
            wishlist, {groups.length} famille{groups.length > 1 ? "s" : ""}{" "}
            olfactive{groups.length > 1 ? "s" : ""}.
          </p>
        </div>
        <SignOutButton />
      </div>

      {groups.length === 0 ? (
        <div className="mt-20 flex flex-col items-center gap-4 text-center">
          <Heart className="size-10 text-gold/40" />
          <p className="font-display text-xl text-foreground">
            Votre wishlist est vide
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Parcourez le catalogue et cliquez sur le cœur d&apos;un parfum
            pour le retrouver ici, trié automatiquement par famille
            olfactive.
          </p>
          <Button
            className="mt-2 bg-gold text-gold-foreground hover:bg-gold/90"
            nativeButton={false}
            render={<Link href="/parfums" />}
          >
            Explorer le catalogue
          </Button>
        </div>
      ) : (
        <div className="mt-14 space-y-16">
          {groups.map((group) => (
            <section key={group.family.id}>
              <div className="flex items-baseline justify-between">
                <h2 className="font-display text-2xl text-foreground">
                  {group.family.name}
                </h2>
                <span className="text-sm text-muted-foreground">
                  {group.perfumes.length} parfum
                  {group.perfumes.length > 1 ? "s" : ""}
                </span>
              </div>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {group.perfumes.map((perfume) => (
                  <PerfumeCard
                    key={perfume.id}
                    perfume={perfume}
                    isWishlisted
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
