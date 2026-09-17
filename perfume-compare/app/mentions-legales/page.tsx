import Link from "next/link";
import type { Metadata } from "next";
import { getLegalPage } from "@/lib/legal";
import { auth } from "@/auth";
import { LegalContent } from "@/components/legal/legal-content";

export const metadata: Metadata = {
  title: "Mentions légales | Essence",
  description: "Mentions légales du site Essence, comparateur de prix de parfums.",
  robots: { index: true, follow: true },
};

export default async function MentionsLegalesPage() {
  const [page, session] = await Promise.all([
    getLegalPage("mentions-legales"),
    auth(),
  ]);
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <span className="text-xs tracking-[0.3em] text-gold uppercase">
        Informations légales
      </span>
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <h1 className="font-display text-4xl text-foreground">
          {page?.title ?? "Mentions légales"}
        </h1>
        {isAdmin && page && (
          <Link
            href={`/admin/legal/${page.id}`}
            className="text-xs text-muted-foreground underline-offset-2 hover:text-gold hover:underline"
          >
            Modifier
          </Link>
        )}
      </div>

      {page ? (
        <LegalContent content={page.content} />
      ) : (
        <p className="mt-10 text-sm text-muted-foreground">
          Ce contenu n&apos;est pas encore disponible.
        </p>
      )}
    </div>
  );
}
