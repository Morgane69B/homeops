import Link from "next/link";

const GENRES = [
  { label: "Homme", href: "/parfums?genre=HOMME" },
  { label: "Femme", href: "/parfums?genre=FEMME" },
  { label: "Mixte", href: "/parfums?genre=MIXTE" },
];

const CONCENTRATIONS = [
  { label: "Extrait de Parfum", href: "/parfums?concentration=EXTRAIT_DE_PARFUM" },
  { label: "Eau de Parfum", href: "/parfums?concentration=EAU_DE_PARFUM" },
  { label: "Eau de Toilette", href: "/parfums?concentration=EAU_DE_TOILETTE" },
  { label: "Eau de Cologne", href: "/parfums?concentration=EAU_DE_COLOGNE" },
];

const BUDGETS = [
  { label: "Jusqu'à 50 €", href: "/parfums?prixMax=50" },
  { label: "50 – 100 €", href: "/parfums?prixMin=50&prixMax=100" },
  { label: "100 – 200 €", href: "/parfums?prixMin=100&prixMax=200" },
  { label: "200 € et plus", href: "/parfums?prixMin=200" },
];

function PillGroup({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div>
      <span className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
        {title}
      </span>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-foreground/80 transition-colors hover:border-gold/40 hover:text-gold"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function QuickFilters() {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      <PillGroup title="Genre" items={GENRES} />
      <PillGroup title="Concentration" items={CONCENTRATIONS} />
      <PillGroup title="Budget" items={BUDGETS} />
    </div>
  );
}
