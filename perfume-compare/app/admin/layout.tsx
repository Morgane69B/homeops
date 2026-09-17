import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Administration | Essence",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs tracking-[0.3em] text-gold uppercase">
            Administration
          </span>
          <h1 className="mt-2 font-display text-3xl text-foreground">
            Gérer le catalogue
          </h1>
        </div>
        <Link
          href="/parfums"
          className="text-sm text-muted-foreground hover:text-gold"
        >
          ← Retour au site
        </Link>
      </div>
      <div className="mt-10">{children}</div>
    </div>
  );
}
