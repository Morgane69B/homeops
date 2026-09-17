import Link from "next/link";

const COLUMNS = [
  {
    title: "Découvrir",
    links: [
      { href: "/parfums", label: "Le catalogue" },
      { href: "/guide", label: "Le guide du parfum" },
      { href: "/blog", label: "Le journal" },
    ],
  },
  {
    title: "Essence",
    links: [
      { href: "/dashboard", label: "Mon espace" },
      { href: "#", label: "Mentions légales" },
      { href: "#", label: "Confidentialité" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-luxury-black">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <span className="font-display text-xl tracking-[0.2em] text-foreground uppercase">
              Essence
            </span>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              La comparaison de prix de parfums, pensée pour les amateurs
              exigeants. Trouvez le meilleur prix, comprenez chaque note.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-xs tracking-[0.2em] text-gold uppercase">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Essence. Tous droits réservés.</p>
          <p>Les prix affichés sont fournis à titre indicatif.</p>
        </div>
      </div>
    </footer>
  );
}
