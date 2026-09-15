import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

type NoteCategory = "HEAD" | "HEART" | "BASE";

const FAMILIES = [
  {
    slug: "florale",
    name: "Florale",
    description:
      "Bouquets de fleurs fraîches ou poudrées — rose, jasmin, muguet, iris — au cœur du parfum classique.",
  },
  {
    slug: "boisee",
    name: "Boisée",
    description:
      "Bois précieux (santal, cèdre, vétiver, oud) qui apportent chaleur, profondeur et sillage.",
  },
  {
    slug: "orientale-ambree",
    name: "Orientale / Ambrée",
    description:
      "Vanille, résines, épices et ambre pour des compositions enveloppantes et sensuelles.",
  },
  {
    slug: "hesperidee-agrumes",
    name: "Hespéridée / Agrumes",
    description:
      "Bergamote, citron, pamplemousse : fraîcheur pétillante en tête de composition.",
  },
  {
    slug: "fougere",
    name: "Fougère",
    description:
      "Lavande, mousse de chêne et coumarine — l'accord fougère, pilier de la parfumerie masculine.",
  },
  {
    slug: "chypree",
    name: "Chyprée",
    description:
      "Bergamote en tête, patchouli et mousse en fond : élégance et sophistication intemporelles.",
  },
  {
    slug: "cuir",
    name: "Cuir",
    description:
      "Accords animaliers et fumés qui rappellent le cuir tanné — caractère et intensité.",
  },
] as const;

const MERCHANTS = [
  { name: "Sephora", siteUrl: "https://www.sephora.fr" },
  { name: "Parfum et Moi", siteUrl: "https://www.parfumetmoi.com" },
  { name: "Parfumdreams", siteUrl: "https://www.parfumdreams.fr" },
  { name: "Flaconi", siteUrl: "https://www.flaconi.fr" },
  { name: "Primor", siteUrl: "https://www.primor.eu" },
  { name: "Nocibé", siteUrl: "https://www.nocibe.fr" },
] as const;

type PerfumeSeed = {
  slug: string;
  name: string;
  brand: string;
  gender: "HOMME" | "FEMME" | "MIXTE";
  concentration:
    | "EXTRAIT_DE_PARFUM"
    | "EAU_DE_PARFUM"
    | "EAU_DE_TOILETTE"
    | "EAU_DE_COLOGNE";
  family: (typeof FAMILIES)[number]["slug"];
  description: string;
  notes: { head: string[]; heart: string[]; base: string[] };
  basePrice: number;
  volumeMl: number;
};

const PERFUMES: PerfumeSeed[] = [
  {
    slug: "creed-aventus",
    name: "Aventus",
    brand: "Creed",
    gender: "HOMME",
    concentration: "EAU_DE_PARFUM",
    family: "chypree",
    description:
      "Un chypre fruité devenu culte, entre ananas croquant et fond boisé-musqué.",
    notes: {
      head: ["Bergamote", "Pomme", "Cassis", "Ananas"],
      heart: ["Bouleau", "Jasmin", "Rose"],
      base: ["Musc", "Chêne", "Ambre gris", "Vanille", "Patchouli"],
    },
    basePrice: 189,
    volumeMl: 100,
  },
  {
    slug: "dior-sauvage",
    name: "Sauvage",
    brand: "Dior",
    gender: "HOMME",
    concentration: "EAU_DE_TOILETTE",
    family: "fougere",
    description:
      "Fraîcheur poivrée et sillage ambré-boisé, best-seller de la parfumerie masculine.",
    notes: {
      head: ["Bergamote", "Poivre"],
      heart: ["Lavande", "Poivre de Sichuan", "Géranium"],
      base: ["Ambroxan", "Cèdre", "Vétiver", "Labdanum"],
    },
    basePrice: 79,
    volumeMl: 100,
  },
  {
    slug: "chanel-n5",
    name: "N°5",
    brand: "Chanel",
    gender: "FEMME",
    concentration: "EXTRAIT_DE_PARFUM",
    family: "florale",
    description:
      "L'aldéhydé fondateur de la haute parfumerie moderne, floral et poudré.",
    notes: {
      head: ["Aldéhydes", "Ylang-Ylang", "Néroli"],
      heart: ["Rose de Mai", "Jasmin", "Muguet", "Iris"],
      base: ["Bois de Santal", "Vanille", "Vétiver", "Musc"],
    },
    basePrice: 245,
    volumeMl: 60,
  },
  {
    slug: "ysl-black-opium",
    name: "Black Opium",
    brand: "Yves Saint Laurent",
    gender: "FEMME",
    concentration: "EAU_DE_PARFUM",
    family: "orientale-ambree",
    description: "Café noir et vanille gourmande pour un oriental addictif.",
    notes: {
      head: ["Poire", "Mandarine", "Poivre Rose"],
      heart: ["Jasmin", "Fleur d'Oranger", "Café"],
      base: ["Vanille", "Patchouli", "Cèdre"],
    },
    basePrice: 99,
    volumeMl: 90,
  },
  {
    slug: "tom-ford-tuscan-leather",
    name: "Tuscan Leather",
    brand: "Tom Ford",
    gender: "MIXTE",
    concentration: "EAU_DE_PARFUM",
    family: "cuir",
    description:
      "Cuir brut et framboise épicée — signature intense de la Private Blend.",
    notes: {
      head: ["Framboise", "Safran"],
      heart: ["Cuir", "Jasmin", "Thym"],
      base: ["Bois Ambré", "Daim", "Oliban"],
    },
    basePrice: 285,
    volumeMl: 50,
  },
  {
    slug: "guerlain-shalimar",
    name: "Shalimar",
    brand: "Guerlain",
    gender: "FEMME",
    concentration: "EAU_DE_PARFUM",
    family: "orientale-ambree",
    description:
      "L'oriental historique de Guerlain, vanille et opoponax enveloppants.",
    notes: {
      head: ["Bergamote", "Citron"],
      heart: ["Iris", "Jasmin", "Rose"],
      base: ["Vanille", "Opoponax", "Fève Tonka", "Ambre"],
    },
    basePrice: 92,
    volumeMl: 90,
  },
  {
    slug: "maison-margiela-jazz-club",
    name: "Jazz Club",
    brand: "Maison Margiela",
    gender: "HOMME",
    concentration: "EAU_DE_TOILETTE",
    family: "boisee",
    description: "Ambiance de fumoir feutré : rhum, tabac blond et cacao.",
    notes: {
      head: ["Rhum", "Pamplemousse Rose"],
      heart: ["Tabac", "Cacao"],
      base: ["Bois de Gaïac", "Vétiver"],
    },
    basePrice: 68,
    volumeMl: 100,
  },
  {
    slug: "jean-paul-gaultier-le-male",
    name: "Le Mâle",
    brand: "Jean Paul Gaultier",
    gender: "HOMME",
    concentration: "EAU_DE_TOILETTE",
    family: "fougere",
    description:
      "Fougère orientale épicée à la vanille, un classique iconique.",
    notes: {
      head: ["Menthe", "Bergamote"],
      heart: ["Lavande", "Cannelle", "Cumin", "Fleur d'Oranger"],
      base: ["Vanille", "Ambre", "Bois de Santal", "Cèdre"],
    },
    basePrice: 65,
    volumeMl: 125,
  },
  {
    slug: "chanel-coco-mademoiselle",
    name: "Coco Mademoiselle",
    brand: "Chanel",
    gender: "FEMME",
    concentration: "EAU_DE_PARFUM",
    family: "chypree",
    description:
      "Chypre floral pétillant, moderne et vibrant, signature Chanel.",
    notes: {
      head: ["Orange", "Bergamote"],
      heart: ["Rose", "Jasmin", "Litchi"],
      base: ["Patchouli", "Vétiver", "Musc Blanc"],
    },
    basePrice: 139,
    volumeMl: 100,
  },
  {
    slug: "creed-green-irish-tweed",
    name: "Green Irish Tweed",
    brand: "Creed",
    gender: "HOMME",
    concentration: "EAU_DE_PARFUM",
    family: "hesperidee-agrumes",
    description:
      "Fraîcheur verte et florale, élégance britannique intemporelle.",
    notes: {
      head: ["Citron", "Verveine", "Bergamote"],
      heart: ["Violette", "Iris"],
      base: ["Ambre gris", "Bois de Santal", "Mousse de Chêne"],
    },
    basePrice: 215,
    volumeMl: 100,
  },
  {
    slug: "mfk-baccarat-rouge-540",
    name: "Baccarat Rouge 540",
    brand: "Maison Francis Kurkdjian",
    gender: "MIXTE",
    concentration: "EAU_DE_PARFUM",
    family: "orientale-ambree",
    description:
      "Safran et fleur d'oranger sur fond ambré-boisé, best-seller de niche.",
    notes: {
      head: ["Safran"],
      heart: ["Jasmin", "Fleur d'Oranger"],
      base: ["Ambre gris", "Cèdre", "Sapin Baumier"],
    },
    basePrice: 275,
    volumeMl: 70,
  },
  {
    slug: "byredo-gypsy-water",
    name: "Gypsy Water",
    brand: "Byredo",
    gender: "MIXTE",
    concentration: "EAU_DE_PARFUM",
    family: "boisee",
    description:
      "Bois de santal et vanille sur une ouverture pin-encens, esprit bohème.",
    notes: {
      head: ["Bergamote", "Citron", "Poivre"],
      heart: ["Pin", "Encens", "Genièvre"],
      base: ["Vanille", "Bois de Santal", "Ambre", "Vétiver"],
    },
    basePrice: 165,
    volumeMl: 100,
  },
  {
    slug: "hermes-terre-dhermes",
    name: "Terre d'Hermès",
    brand: "Hermès",
    gender: "HOMME",
    concentration: "EAU_DE_TOILETTE",
    family: "boisee",
    description:
      "Minéral et boisé, un dialogue entre terre et agrumes signé Hermès.",
    notes: {
      head: ["Pamplemousse", "Orange", "Poivre Rose"],
      heart: ["Géranium"],
      base: ["Vétiver", "Patchouli", "Cèdre"],
    },
    basePrice: 89,
    volumeMl: 100,
  },
  {
    slug: "lancome-la-vie-est-belle",
    name: "La Vie Est Belle",
    brand: "Lancôme",
    gender: "FEMME",
    concentration: "EAU_DE_PARFUM",
    family: "florale",
    description:
      "Iris gourmand et praline, un floral doux devenu un grand classique.",
    notes: {
      head: ["Poire", "Cassis"],
      heart: ["Iris", "Jasmin", "Fleur d'Oranger"],
      base: ["Praline", "Vanille", "Patchouli", "Fève Tonka"],
    },
    basePrice: 84,
    volumeMl: 100,
  },
  {
    slug: "azzaro-pour-homme",
    name: "Azzaro Pour Homme",
    brand: "Azzaro",
    gender: "HOMME",
    concentration: "EAU_DE_TOILETTE",
    family: "fougere",
    description:
      "La fougère classique par excellence, fraîche, épicée et boisée.",
    notes: {
      head: ["Citron", "Basilic"],
      heart: ["Lavande", "Romarin", "Genièvre", "Muscade", "Cuir"],
      base: ["Bois de Santal", "Cèdre", "Mousse de Chêne"],
    },
    basePrice: 52,
    volumeMl: 100,
  },
  {
    slug: "chanel-bleu-de-chanel",
    name: "Bleu de Chanel",
    brand: "Chanel",
    gender: "HOMME",
    concentration: "EAU_DE_TOILETTE",
    family: "boisee",
    description:
      "Un boisé-aromatique net et incisif, signature masculine intemporelle de Chanel.",
    notes: {
      head: ["Citron", "Pamplemousse", "Menthe"],
      heart: ["Muscade", "Jasmin", "Encens"],
      base: ["Cèdre", "Bois de Santal", "Labdanum", "Musc Blanc", "Vétiver"],
    },
    basePrice: 85,
    volumeMl: 100,
  },
  {
    slug: "dior-dior-homme",
    name: "Dior Homme",
    brand: "Dior",
    gender: "HOMME",
    concentration: "EAU_DE_TOILETTE",
    family: "boisee",
    description:
      "Iris poudré et cuir : une relecture moderne et élégante du masculin boisé.",
    notes: {
      head: ["Bergamote", "Poire"],
      heart: ["Iris", "Cacao", "Cuir"],
      base: ["Vétiver", "Patchouli"],
    },
    basePrice: 75,
    volumeMl: 100,
  },
  {
    slug: "dior-jadore",
    name: "J'adore",
    brand: "Dior",
    gender: "FEMME",
    concentration: "EAU_DE_PARFUM",
    family: "florale",
    description:
      "Un bouquet floral somptueux, symbole de féminité absolue chez Dior.",
    notes: {
      head: ["Bergamote", "Poire", "Mandarine"],
      heart: ["Magnolia", "Rose de Mai", "Freesia", "Muguet"],
      base: ["Bois de Santal", "Musc", "Vanille"],
    },
    basePrice: 110,
    volumeMl: 100,
  },
  {
    slug: "ysl-y",
    name: "Y Eau de Parfum",
    brand: "Yves Saint Laurent",
    gender: "HOMME",
    concentration: "EAU_DE_PARFUM",
    family: "fougere",
    description:
      "Une fougère aromatique ambrée, portrait d'une masculinité conquérante.",
    notes: {
      head: ["Pamplemousse", "Poivre", "Sauge"],
      heart: ["Genièvre", "Géranium"],
      base: ["Cèdre", "Ambroxan", "Fève Tonka"],
    },
    basePrice: 78,
    volumeMl: 100,
  },
  {
    slug: "ysl-libre",
    name: "Libre",
    brand: "Yves Saint Laurent",
    gender: "FEMME",
    concentration: "EAU_DE_PARFUM",
    family: "orientale-ambree",
    description:
      "La tension entre la lavande masculine et la fleur d'oranger sensuelle.",
    notes: {
      head: ["Mandarine", "Cassis"],
      heart: ["Lavande", "Fleur d'Oranger"],
      base: ["Vanille", "Musc", "Fève Tonka"],
    },
    basePrice: 95,
    volumeMl: 90,
  },
  {
    slug: "tom-ford-oud-wood",
    name: "Oud Wood",
    brand: "Tom Ford",
    gender: "MIXTE",
    concentration: "EAU_DE_PARFUM",
    family: "boisee",
    description:
      "L'oud rare et précieux, sublimé par le bois de rose et une base ambrée.",
    notes: {
      head: ["Bois de Rose", "Cardamome"],
      heart: ["Oud", "Palissandre"],
      base: ["Bois de Santal", "Ambre", "Vanille", "Fève Tonka"],
    },
    basePrice: 250,
    volumeMl: 50,
  },
  {
    slug: "tom-ford-black-orchid",
    name: "Black Orchid",
    brand: "Tom Ford",
    gender: "MIXTE",
    concentration: "EAU_DE_PARFUM",
    family: "orientale-ambree",
    description:
      "Un oriental somptueux et sombre, truffe noire et orchidée sur fond résineux.",
    notes: {
      head: ["Truffe Noire", "Ylang-Ylang", "Cassis"],
      heart: ["Orchidée Noire", "Épices", "Chocolat"],
      base: ["Patchouli", "Vanille", "Oliban", "Bois de Santal"],
    },
    basePrice: 135,
    volumeMl: 50,
  },
  {
    slug: "versace-eros",
    name: "Eros",
    brand: "Versace",
    gender: "HOMME",
    concentration: "EAU_DE_TOILETTE",
    family: "fougere",
    description:
      "Une fougère fraîche et gourmande à la tenue redoutable, sillage puissant.",
    notes: {
      head: ["Menthe", "Pomme Verte", "Citron"],
      heart: ["Géranium", "Cannelle"],
      base: ["Vanille", "Fève Tonka", "Bois de Santal", "Cèdre"],
    },
    basePrice: 68,
    volumeMl: 100,
  },
  {
    slug: "armani-acqua-di-gio",
    name: "Acqua di Gio",
    brand: "Giorgio Armani",
    gender: "HOMME",
    concentration: "EAU_DE_TOILETTE",
    family: "hesperidee-agrumes",
    description:
      "L'aquatique fondateur, entre embruns marins et fraîcheur méditerranéenne.",
    notes: {
      head: ["Bergamote", "Citron", "Notes Marines"],
      heart: ["Genièvre", "Romarin", "Jasmin"],
      base: ["Musc Blanc", "Cèdre", "Patchouli"],
    },
    basePrice: 65,
    volumeMl: 100,
  },
  {
    slug: "armani-si",
    name: "Si",
    brand: "Giorgio Armani",
    gender: "FEMME",
    concentration: "EAU_DE_PARFUM",
    family: "chypree",
    description:
      "Un chypre fruité moderne, cassis pétillant et fond gourmand assumé.",
    notes: {
      head: ["Cassis", "Poire"],
      heart: ["Rose", "Freesia"],
      base: ["Patchouli", "Vanille", "Musc", "Bois de Santal"],
    },
    basePrice: 90,
    volumeMl: 100,
  },
  {
    slug: "paco-rabanne-1-million",
    name: "1 Million",
    brand: "Paco Rabanne",
    gender: "HOMME",
    concentration: "EAU_DE_TOILETTE",
    family: "orientale-ambree",
    description:
      "Un oriental épicé et doré, aussi tapageur que son fameux flacon lingot.",
    notes: {
      head: ["Pamplemousse", "Menthe", "Mandarine"],
      heart: ["Cannelle", "Rose", "Épices", "Cuir"],
      base: ["Ambre", "Patchouli", "Bois Ambré"],
    },
    basePrice: 62,
    volumeMl: 100,
  },
  {
    slug: "viktor-rolf-flowerbomb",
    name: "Flowerbomb",
    brand: "Viktor&Rolf",
    gender: "FEMME",
    concentration: "EAU_DE_PARFUM",
    family: "florale",
    description:
      "Une explosion florale gourmande devenue un classique instantané des années 2000.",
    notes: {
      head: ["Thé", "Bergamote"],
      heart: ["Jasmin", "Rose", "Orchidée"],
      base: ["Patchouli", "Vanille", "Musc"],
    },
    basePrice: 105,
    volumeMl: 100,
  },
  {
    slug: "lancome-idole",
    name: "Idôle",
    brand: "Lancôme",
    gender: "FEMME",
    concentration: "EAU_DE_PARFUM",
    family: "florale",
    description:
      "Un floral musqué épuré, rose et jasmin sur un fond de bois clair.",
    notes: {
      head: ["Poire", "Bergamote"],
      heart: ["Rose", "Jasmin"],
      base: ["Musc Blanc", "Vanille", "Bois de Cachemire"],
    },
    basePrice: 88,
    volumeMl: 75,
  },
  {
    slug: "givenchy-linterdit",
    name: "L'Interdit",
    brand: "Givenchy",
    gender: "FEMME",
    concentration: "EAU_DE_PARFUM",
    family: "florale",
    description:
      "Un floral blanc rebelle, tubéreuse et jasmin sur une base boisée franche.",
    notes: {
      head: ["Poire", "Bergamote"],
      heart: ["Tubéreuse", "Jasmin", "Fleur d'Oranger"],
      base: ["Vétiver", "Patchouli", "Musc"],
    },
    basePrice: 98,
    volumeMl: 80,
  },
  {
    slug: "prada-luna-rossa",
    name: "Luna Rossa",
    brand: "Prada",
    gender: "HOMME",
    concentration: "EAU_DE_TOILETTE",
    family: "hesperidee-agrumes",
    description:
      "Un aromatique marin élégant, lavande et genièvre sur fond musqué.",
    notes: {
      head: ["Bergamote", "Basilic"],
      heart: ["Genièvre", "Lavande"],
      base: ["Ambroxan", "Musc"],
    },
    basePrice: 70,
    volumeMl: 100,
  },
  {
    slug: "gucci-bloom",
    name: "Bloom",
    brand: "Gucci",
    gender: "FEMME",
    concentration: "EAU_DE_PARFUM",
    family: "florale",
    description:
      "Un bouquet blanc dense et linéaire, tubéreuse et jasmin sambac en cœur.",
    notes: {
      head: ["Néroli"],
      heart: ["Tubéreuse", "Jasmin", "Muguet"],
      base: ["Musc Blanc"],
    },
    basePrice: 99,
    volumeMl: 100,
  },
  {
    slug: "bvlgari-omnia",
    name: "Omnia",
    brand: "Bvlgari",
    gender: "FEMME",
    concentration: "EAU_DE_TOILETTE",
    family: "orientale-ambree",
    description:
      "Un oriental précieux aux épices chaudes et au chocolat noir subtil.",
    notes: {
      head: ["Thé", "Cardamome"],
      heart: ["Chocolat", "Épices"],
      base: ["Bois Ambré"],
    },
    basePrice: 58,
    volumeMl: 65,
  },
  {
    slug: "ck-one",
    name: "CK One",
    brand: "Calvin Klein",
    gender: "MIXTE",
    concentration: "EAU_DE_TOILETTE",
    family: "hesperidee-agrumes",
    description:
      "Le premier grand parfum unisexe, fraîcheur minimaliste et transparente.",
    notes: {
      head: ["Bergamote", "Citron", "Ananas", "Thé"],
      heart: ["Muguet", "Rose"],
      base: ["Musc", "Bois de Santal"],
    },
    basePrice: 45,
    volumeMl: 100,
  },
  {
    slug: "issey-miyake-leau-dissey",
    name: "L'Eau d'Issey",
    brand: "Issey Miyake",
    gender: "FEMME",
    concentration: "EAU_DE_TOILETTE",
    family: "florale",
    description:
      "Un floral aquatique épuré, pureté cristalline devenue une référence des années 90.",
    notes: {
      head: ["Cyclamen", "Pamplemousse"],
      heart: ["Muguet", "Lys", "Pivoine"],
      base: ["Bois de Santal", "Musc"],
    },
    basePrice: 64,
    volumeMl: 100,
  },
  {
    slug: "montblanc-legend",
    name: "Legend",
    brand: "Montblanc",
    gender: "HOMME",
    concentration: "EAU_DE_TOILETTE",
    family: "boisee",
    description:
      "Un boisé aromatique accessible et bien élevé, lavande et fève tonka en fond.",
    notes: {
      head: ["Bergamote", "Pamplemousse"],
      heart: ["Lavande", "Géranium"],
      base: ["Bois de Santal", "Fève Tonka", "Ambre"],
    },
    basePrice: 48,
    volumeMl: 100,
  },
  {
    slug: "byredo-mojave-ghost",
    name: "Mojave Ghost",
    brand: "Byredo",
    gender: "MIXTE",
    concentration: "EAU_DE_PARFUM",
    family: "florale",
    description:
      "Un musc floral désertique, épuré et fantomatique, signature Byredo.",
    notes: {
      head: ["Fleur de Coton"],
      heart: ["Violette", "Magnolia"],
      base: ["Ambre gris", "Bois de Santal", "Musc"],
    },
    basePrice: 175,
    volumeMl: 100,
  },
  {
    slug: "mfk-grand-soir",
    name: "Grand Soir",
    brand: "Maison Francis Kurkdjian",
    gender: "MIXTE",
    concentration: "EAU_DE_PARFUM",
    family: "orientale-ambree",
    description:
      "Un ambré soliflore somptueux, résines et vanille pour les soirs d'exception.",
    notes: {
      head: ["Mandarine"],
      heart: ["Encens", "Rose"],
      base: ["Vanille", "Ambre gris", "Fève Tonka"],
    },
    basePrice: 245,
    volumeMl: 70,
  },
  {
    slug: "le-labo-santal-33",
    name: "Santal 33",
    brand: "Le Labo",
    gender: "MIXTE",
    concentration: "EAU_DE_PARFUM",
    family: "boisee",
    description:
      "Le bois de santal culte des créatifs new-yorkais, cuir et cardamome.",
    notes: {
      head: ["Cardamome"],
      heart: ["Iris", "Violette", "Cuir"],
      base: ["Bois de Santal", "Ambroxan", "Cèdre"],
    },
    basePrice: 210,
    volumeMl: 100,
  },
  {
    slug: "nishane-ani",
    name: "Ani",
    brand: "Nishane",
    gender: "MIXTE",
    concentration: "EAU_DE_PARFUM",
    family: "fougere",
    description:
      "Une fougère gourmande turque, lavande et fève tonka en habit de niche.",
    notes: {
      head: ["Bergamote", "Poivre Rose"],
      heart: ["Lavande", "Géranium"],
      base: ["Fève Tonka", "Vanille", "Musc"],
    },
    basePrice: 195,
    volumeMl: 100,
  },
  {
    slug: "amouage-interlude-man",
    name: "Interlude Man",
    brand: "Amouage",
    gender: "HOMME",
    concentration: "EAU_DE_PARFUM",
    family: "orientale-ambree",
    description:
      "Un oriental fumé et complexe, encens et cuir pour un sillage puissant.",
    notes: {
      head: ["Poivre Noir", "Pamplemousse"],
      heart: ["Encens", "Cannelle", "Cuir"],
      base: ["Oliban", "Patchouli", "Ambre"],
    },
    basePrice: 220,
    volumeMl: 100,
  },
  {
    slug: "parfums-de-marly-layton",
    name: "Layton",
    brand: "Parfums de Marly",
    gender: "HOMME",
    concentration: "EAU_DE_PARFUM",
    family: "fougere",
    description:
      "Une fougère fruitée et vanillée très portée, pomme croquante et sillage doux.",
    notes: {
      head: ["Pomme", "Bergamote"],
      heart: ["Lavande", "Géranium"],
      base: ["Vanille", "Fève Tonka", "Ambre"],
    },
    basePrice: 165,
    volumeMl: 125,
  },
  {
    slug: "narciso-rodriguez-for-her",
    name: "For Her",
    brand: "Narciso Rodriguez",
    gender: "FEMME",
    concentration: "EAU_DE_PARFUM",
    family: "chypree",
    description:
      "Un musc floral chypré intime et sensuel, devenu un classique moderne.",
    notes: {
      head: ["Pêche", "Cassis"],
      heart: ["Rose", "Fleur d'Oranger"],
      base: ["Musc", "Bois de Santal", "Ambre"],
    },
    basePrice: 92,
    volumeMl: 100,
  },
  {
    slug: "mugler-angel",
    name: "Angel",
    brand: "Thierry Mugler",
    gender: "FEMME",
    concentration: "EAU_DE_PARFUM",
    family: "orientale-ambree",
    description:
      "Le gourmand fondateur, patchouli et praline en un contraste inédit à sa sortie.",
    notes: {
      head: ["Cassis", "Mandarine"],
      heart: ["Miel", "Fruits Rouges"],
      base: ["Patchouli", "Vanille", "Caramel"],
    },
    basePrice: 85,
    volumeMl: 50,
  },
];

const ARTICLES = [
  {
    slug: "meilleurs-parfums-vanille-hiver",
    title: "Les 10 meilleurs parfums à la vanille pour l'hiver",
    excerpt:
      "La vanille réchauffe les compositions hivernales : sélection de fonds gourmands à porter dès les premiers frimas.",
    coverImage: null,
    content: [
      "Quand les températures baissent, les parfums gourmands et ambrés prennent le dessus. La vanille, note de fond par excellence, apporte chaleur et rondeur à une composition — elle fixe le sillage et prolonge sa tenue bien après les notes de tête et de cœur.",
      "On la retrouve dans des registres très différents : gourmande et café chez Black Opium, poudrée et pralinée chez La Vie Est Belle, résineuse et orientale chez Shalimar. Elle sait aussi se faire plus boisée, comme dans Gypsy Water, où elle se marie au santal et au vétiver pour un sillage feutré, presque fumé.",
      "Pour l'hiver, privilégiez une concentration Eau de Parfum ou Extrait : l'huile parfumée y est plus dense et la vanille prend le temps de se déployer sur la peau, plutôt que de s'évaporer en une heure comme certaines Eaux de Toilette légères.",
    ].join("\n\n"),
    perfumeSlugs: [
      "ysl-black-opium",
      "lancome-la-vie-est-belle",
      "guerlain-shalimar",
      "byredo-gypsy-water",
    ],
  },
  {
    slug: "focus-bois-de-santal",
    title: "Focus sur le Bois de Santal",
    excerpt:
      "Note de fond crémeuse et boisée, le santal structure quelques-uns des parfums les plus élégants du marché.",
    coverImage: null,
    content: [
      "Le bois de santal apporte une onctuosité chaude et laiteuse qui prolonge le sillage bien après le départ des notes de tête. Contrairement à des bois plus secs comme le cèdre, le santal a une texture presque crémeuse — c'est ce qui en fait l'une des notes de fond les plus recherchées de la parfumerie fine.",
      "On le retrouve en fond de N°5, où il souligne l'aldéhydé floral d'une base chaude et poudrée, mais aussi dans des compositions plus fraîches comme Green Irish Tweed, où il tempère la verdeur des agrumes et de la violette. Chez Azzaro Pour Homme, il ancre la fougère classique dans quelque chose de plus doux, presque cosmétique.",
      "Le vrai santal (Santalum album, originaire de Mysore) se fait rare et coûteux ; la plupart des parfums actuels recomposent son profil à partir d'autres bois ou de molécules de synthèse comme le Javanol — sans que l'effet sur la peau en soit moins convaincant.",
    ].join("\n\n"),
    perfumeSlugs: [
      "chanel-n5",
      "creed-green-irish-tweed",
      "azzaro-pour-homme",
    ],
  },
  {
    slug: "parfums-ete-fraicheur-tenue",
    title: "Parfums d'été : la fraîcheur qui tient la chaleur",
    excerpt:
      "Agrumes, vétiver, poivre : comment choisir un parfum qui reste net sous 30 degrés sans s'évaporer en une heure.",
    coverImage: null,
    content: [
      "En été, la chaleur accélère l'évaporation des notes de tête — un parfum trop hespéridé peut disparaître en quelques dizaines de minutes. La solution n'est pas d'éviter les agrumes, mais de choisir des compositions qui les ancrent sur une base solide : bois secs, mousses, muscs propres.",
      "Sauvage joue cette carte avec une bergamote vive posée sur un fond d'ambroxan et de vétiver, qui tient bien mieux la chaleur que sa fraîcheur de tête ne le laisse deviner. Terre d'Hermès va plus loin en construisant tout son propos autour du dialogue entre pamplemousse et minéralité boisée.",
      "Autre option : les fougères fraîches comme Azzaro Pour Homme, où la lavande et le citron sont soutenus par une mousse de chêne qui évite l'effet \"évaporé\" en fin de journée. Dans tous les cas, privilégiez une application sur peau hydratée : la peau sèche retient beaucoup moins bien les notes de fond.",
    ].join("\n\n"),
    perfumeSlugs: ["dior-sauvage", "hermes-terre-dhermes", "azzaro-pour-homme"],
  },
];

async function main() {
  console.log("Seeding olfactory families...");
  const familyBySlug = new Map<string, string>();
  for (const family of FAMILIES) {
    const created = await prisma.olfactoryFamily.upsert({
      where: { slug: family.slug },
      update: { name: family.name, description: family.description },
      create: family,
    });
    familyBySlug.set(family.slug, created.id);
  }

  console.log("Seeding merchants...");
  const merchantByName = new Map<string, string>();
  for (const merchant of MERCHANTS) {
    const created = await prisma.merchant.upsert({
      where: { name: merchant.name },
      update: { siteUrl: merchant.siteUrl },
      create: merchant,
    });
    merchantByName.set(merchant.name, created.id);
  }
  const merchantNames = MERCHANTS.map((m) => m.name);

  console.log("Seeding notes and perfumes...");
  const noteCache = new Map<string, string>();
  async function getOrCreateNote(name: string, category: NoteCategory) {
    const cached = noteCache.get(name);
    if (cached) return cached;
    const note = await prisma.note.upsert({
      where: { name },
      update: {},
      create: { name, category },
    });
    noteCache.set(name, note.id);
    return note.id;
  }

  const perfumeIdBySlug = new Map<string, string>();

  for (const [index, perfume] of PERFUMES.entries()) {
    const headIds = await Promise.all(
      perfume.notes.head.map((n) => getOrCreateNote(n, "HEAD")),
    );
    const heartIds = await Promise.all(
      perfume.notes.heart.map((n) => getOrCreateNote(n, "HEART")),
    );
    const baseIds = await Promise.all(
      perfume.notes.base.map((n) => getOrCreateNote(n, "BASE")),
    );

    const created = await prisma.perfume.upsert({
      where: { slug: perfume.slug },
      update: {},
      create: {
        slug: perfume.slug,
        name: perfume.name,
        brand: perfume.brand,
        gender: perfume.gender,
        concentration: perfume.concentration,
        description: perfume.description,
        mainFamilyId: familyBySlug.get(perfume.family)!,
        notes: {
          connect: [...headIds, ...heartIds, ...baseIds].map((id) => ({
            id,
          })),
        },
      },
    });
    perfumeIdBySlug.set(perfume.slug, created.id);

    // Three rotating merchant offers per perfume, with small price variance.
    const offerMerchants = [
      merchantNames[index % merchantNames.length],
      merchantNames[(index + 2) % merchantNames.length],
      merchantNames[(index + 4) % merchantNames.length],
    ];

    for (const [offerIndex, merchantName] of offerMerchants.entries()) {
      const variance = [1, 0.93, 1.08][offerIndex];
      const price = Math.round(perfume.basePrice * variance * 100) / 100;
      await prisma.priceOffer.upsert({
        where: {
          perfumeId_merchantId_volumeMl: {
            perfumeId: created.id,
            merchantId: merchantByName.get(merchantName)!,
            volumeMl: perfume.volumeMl,
          },
        },
        update: { price, stock: offerIndex !== 1 },
        create: {
          perfumeId: created.id,
          merchantId: merchantByName.get(merchantName)!,
          price,
          volumeMl: perfume.volumeMl,
          stock: offerIndex !== 1,
          affiliateUrl: `${MERCHANTS.find((m) => m.name === merchantName)!.siteUrl}/redirect?ref=essence&offer=${perfume.slug}`,
        },
      });
    }
  }

  console.log("Seeding articles...");
  for (const article of ARTICLES) {
    const perfumeConnect = article.perfumeSlugs.map((slug) => ({
      id: perfumeIdBySlug.get(slug)!,
    }));
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        coverImage: article.coverImage,
        perfumes: { set: perfumeConnect },
      },
      create: {
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        coverImage: article.coverImage,
        perfumes: { connect: perfumeConnect },
      },
    });
  }

  console.log(
    `Done: ${FAMILIES.length} familles, ${MERCHANTS.length} marchands, ${PERFUMES.length} parfums, ${noteCache.size} notes, ${ARTICLES.length} articles.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
