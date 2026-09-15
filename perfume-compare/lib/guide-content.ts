export const CONCENTRATIONS = [
  {
    key: "EXTRAIT_DE_PARFUM",
    label: "Extrait de Parfum",
    oilRange: [20, 30] as const,
    tenue: "8 à 12h, souvent plus",
    description:
      "La concentration la plus riche. Peu de projection, mais un sillage proche de la peau qui dure toute la journée.",
  },
  {
    key: "EAU_DE_PARFUM",
    label: "Eau de Parfum",
    oilRange: [15, 20] as const,
    tenue: "6 à 8h",
    description:
      "Le meilleur équilibre entre tenue et prix pour la majorité des usages quotidiens.",
  },
  {
    key: "EAU_DE_TOILETTE",
    label: "Eau de Toilette",
    oilRange: [5, 15] as const,
    tenue: "3 à 5h",
    description:
      "Plus légère et fraîche, elle se réapplique volontiers en journée — parfaite pour le bureau ou l'été.",
  },
  {
    key: "EAU_DE_COLOGNE",
    label: "Eau de Cologne",
    oilRange: [2, 5] as const,
    tenue: "2 à 3h",
    description:
      "Très diluée, hespéridée et vive. Historiquement pensée comme un geste de fraîcheur plus qu'un vrai parfum.",
  },
];

export const FAMILY_SUBFAMILIES: Record<string, string[]> = {
  florale: ["Florale fraîche", "Florale poudrée", "Florale aldéhydée"],
  boisee: ["Boisée mousse", "Boisée sèche", "Boisée aromatique"],
  "orientale-ambree": ["Ambrée épicée", "Ambrée vanillée", "Ambrée boisée"],
  "hesperidee-agrumes": ["Hespéridée classique", "Hespéridée boisée"],
  fougere: ["Fougère aromatique", "Fougère ambrée", "Fougère fraîche"],
  chypree: ["Chypre floral", "Chypre fruité", "Chypre cuiré"],
  cuir: ["Cuir floral", "Cuir tabac", "Cuir animal"],
};

export const TIPS = [
  {
    title: "Où appliquer",
    body: "Sur les points de pulsation — poignets, cou, intérieur des coudes — où la chaleur du corps diffuse le parfum. Ne frottez jamais les poignets l'un contre l'autre : cela casse les molécules de tête.",
  },
  {
    title: "Comment conserver",
    body: "À l'abri de la lumière et des variations de température, idéalement dans sa boîte. La salle de bain, humide et chaude, est le pire endroit pour un flacon.",
  },
  {
    title: "Selon la saison",
    body: "Les agrumes et notes fraîches tiennent mieux la chaleur estivale ; les orientaux et boisés denses révèlent toute leur profondeur par temps froid.",
  },
  {
    title: "Selon l'occasion",
    body: "Une Eau de Toilette légère convient au bureau ; réservez les Extraits et compositions plus denses aux soirées, où un sillage plus affirmé a sa place.",
  },
];
