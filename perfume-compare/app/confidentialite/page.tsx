import Link from "next/link";
import type { Metadata } from "next";
import { getLegalPage } from "@/lib/legal";
import { auth } from "@/auth";
import { LegalContent } from "@/components/legal/legal-content";

const DATE_FORMATTER = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export const metadata: Metadata = {
  title: "Politique de confidentialité | Essence",
  description:
    "Comment Essence collecte, utilise et protège vos données personnelles, conformément au RGPD.",
  robots: { index: true, follow: true },
};

export default async function ConfidentialitePage() {
  const [page, session] = await Promise.all([
    getLegalPage("confidentialite"),
    auth(),
  ]);
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <span className="text-xs tracking-[0.3em] text-gold uppercase">RGPD</span>
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <h1 className="font-display text-4xl text-foreground">
          {page?.title ?? "Politique de confidentialité"}
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
      {page && (
        <p className="mt-4 text-sm text-muted-foreground">
          Dernière mise à jour : {DATE_FORMATTER.format(page.updatedAt)}
        </p>
      )}

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
