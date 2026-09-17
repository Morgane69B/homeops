import Link from "next/link";
import { getAllLegalPages } from "@/lib/legal";

const PUBLIC_PATHS: Record<string, string> = {
  "mentions-legales": "/mentions-legales",
  confidentialite: "/confidentialite",
  cgu: "/cgu",
};

export default async function AdminLegalPage() {
  const pages = await getAllLegalPages();

  return (
    <div>
      <p className="text-sm text-muted-foreground">
        Mentions légales, politique de confidentialité et CGU. Utilisez{" "}
        <code className="rounded bg-white/10 px-1 py-0.5 text-xs">## Titre</code>{" "}
        pour une section, <code className="rounded bg-white/10 px-1 py-0.5 text-xs">- élément</code>{" "}
        pour une liste, et{" "}
        <code className="rounded bg-white/10 px-1 py-0.5 text-xs">[texte](url)</code> pour un
        lien.
      </p>

      <div className="mt-6 divide-y divide-white/10 rounded-2xl border border-white/10">
        {pages.map((page) => (
          <Link
            key={page.id}
            href={`/admin/legal/${page.id}`}
            className="flex items-center gap-4 p-4 transition-colors hover:bg-white/[0.03]"
          >
            <div className="min-w-0 flex-1">
              <p className="font-display text-lg text-foreground">{page.title}</p>
              <p className="text-xs text-muted-foreground">
                {PUBLIC_PATHS[page.slug] ?? `/${page.slug}`}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
