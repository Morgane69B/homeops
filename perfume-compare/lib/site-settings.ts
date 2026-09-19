import { prisma } from "@/lib/prisma";

const FALLBACK = {
  id: "singleton",
  heroEyebrow: "Comparateur de parfums premium",
  heroTitle: "L'exception, au meilleur prix.",
  heroDescription:
    "Comparez les prix des plus grandes maisons de parfumerie chez tous les marchands, explorez leur pyramide olfactive et composez une wishlist triée par famille.",
  heroCtaPrimary: "Explorer le catalogue",
  heroCtaSecondary: "Découvrir le guide du parfum",
  pillar1Title: "Comparateur en direct",
  pillar1Description:
    "Tous les marchands, un seul tableau : prix, formats et disponibilité en un coup d'œil.",
  pillar2Title: "Pyramide olfactive",
  pillar2Description:
    "Notes de tête, de cœur et de fond détaillées pour chaque parfum de notre catalogue.",
  pillar3Title: "Wishlist intelligente",
  pillar3Description:
    "Vos coups de cœur triés automatiquement par famille olfactive dans votre espace.",
  familiesEyebrow: "Les 7 familles",
  familiesTitle: "Trouvez votre signature olfactive",
  footerTagline:
    "La comparaison de prix de parfums, pensée pour les amateurs exigeants. Trouvez le meilleur prix, comprenez chaque note.",
};

export async function getSiteSettings() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });
  return settings ?? FALLBACK;
}
