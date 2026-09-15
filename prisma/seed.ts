import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);
const daysFromNow = (n: number) => new Date(Date.now() + n * 86_400_000);

async function main() {
  const org = await prisma.organization.upsert({
    where: { id: "seed-org-petit-bouchon" },
    update: {},
    create: {
      id: "seed-org-petit-bouchon",
      name: "Le Petit Bouchon",
      type: "RESTAURANT",
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: "camille@lepetitbouchon.fr" },
    update: {},
    create: {
      organizationId: org.id,
      email: "camille@lepetitbouchon.fr",
      name: "Camille Moreau",
      role: "OWNER",
      jobTitle: "Propriétaire",
    },
  });

  const badgeDefs = [
    { code: "premier-module", title: "Premier pas", description: "Premier module terminé" },
    { code: "sans-faute", title: "Sans faute", description: "100% de bonnes réponses sur un quiz" },
    { code: "haccp-master", title: "Maître HACCP", description: "Parcours Hygiène & sécurité HACCP entièrement validé" },
    { code: "assidu", title: "Assidu", description: "3 modules terminés" },
  ];
  const badges = new Map<string, { id: string; code: string; title: string; description: string }>();
  for (const b of badgeDefs) {
    const badge = await prisma.badge.upsert({
      where: { code: b.code },
      update: {},
      create: { ...b, organizationId: org.id },
    });
    badges.set(b.code, badge);
  }

  const salleTrack = await prisma.track.upsert({
    where: { slug: "service-salle" },
    update: {},
    create: {
      organizationId: org.id,
      slug: "service-salle",
      title: "Service en salle",
      description: "Accueil, prise de commande et encaissement.",
      targetJobTitle: "Serveur / Serveuse",
      color: "indigo",
      order: 0,
    },
  });

  const haccpTrack = await prisma.track.upsert({
    where: { slug: "haccp" },
    update: {},
    create: {
      organizationId: org.id,
      slug: "haccp",
      title: "Hygiène & sécurité HACCP",
      description: "Les fondamentaux obligatoires pour tous les postes.",
      targetJobTitle: "Tous postes",
      color: "coral",
      order: 1,
    },
  });

  const cuisineTrack = await prisma.track.upsert({
    where: { slug: "cuisine" },
    update: {},
    create: {
      organizationId: org.id,
      slug: "cuisine",
      title: "Cuisine",
      description: "Mise en place, fiches techniques et sécurité.",
      targetJobTitle: "Commis de cuisine",
      color: "emerald",
      order: 2,
    },
  });

  async function upsertQuizModule(
    slug: string,
    trackId: string,
    order: number,
    title: string,
    estimatedMinutes: number,
    pointsReward: number,
    questions: { prompt: string; choices: string[]; correctIndex: number; explanation?: string }[]
  ) {
    const mod = await prisma.module.upsert({
      where: { id: slug },
      update: {},
      create: { id: slug, trackId, order, title, type: "QUIZ", estimatedMinutes, pointsReward },
    });
    await prisma.question.deleteMany({ where: { moduleId: mod.id } });
    await prisma.question.createMany({
      data: questions.map((q, i) => ({ moduleId: mod.id, order: i, ...q })),
    });
    return mod;
  }

  async function upsertFlashcardModule(
    slug: string,
    trackId: string,
    order: number,
    title: string,
    estimatedMinutes: number,
    pointsReward: number,
    flashcards: { id: string; front: string; back: string }[]
  ) {
    return prisma.module.upsert({
      where: { id: slug },
      update: { content: flashcards },
      create: { id: slug, trackId, order, title, type: "FLASHCARD", estimatedMinutes, pointsReward, content: flashcards },
    });
  }

  const modAccueil = await upsertQuizModule(
    "mod-accueil",
    salleTrack.id,
    0,
    "Standards d'accueil client",
    4,
    100,
    [
      {
        prompt: "Un client entre dans le restaurant. Que faites-vous en premier ?",
        choices: [
          "Vous continuez à débarrasser une table",
          "Vous le saluez dans les 30 secondes et l'installez",
          "Vous attendez qu'il vous appelle",
          "Vous lui donnez directement la carte sans un mot",
        ],
        correctIndex: 1,
        explanation: "L'accueil doit se faire dans les 30 secondes, sourire inclus.",
      },
      {
        prompt: "Un client signale une allergie au gluten. Quelle est la bonne attitude ?",
        choices: [
          "Vous lui dites que ça devrait aller",
          "Vous notez l'allergie et vérifiez la fiche allergènes avec la cuisine",
          "Vous l'ignorez, ce n'est pas votre rôle",
          "Vous proposez uniquement les desserts",
        ],
        correctIndex: 1,
        explanation: "Toute allergie déclarée doit être relayée et vérifiée avant la prise de commande.",
      },
      {
        prompt: "Quelle formule de politesse ouvre l'accueil selon nos standards ?",
        choices: [
          "\"Vous êtes combien ?\"",
          "\"Bonjour, bienvenue chez nous, une table pour combien de personnes ?\"",
          "\"C'est pour manger ?\"",
          "Rien, vous attendez qu'ils parlent",
        ],
        correctIndex: 1,
      },
      {
        prompt: "Un client attend au bar que sa table soit prête. Que faites-vous ?",
        choices: [
          "Vous le prévenez du temps d'attente estimé",
          "Vous ne dites rien pour ne pas le déranger",
          "Vous lui dites de revenir plus tard",
          "Vous l'installez à une table déjà occupée",
        ],
        correctIndex: 0,
      },
      {
        prompt: "En fin de repas, quel est le bon réflexe avant l'addition ?",
        choices: [
          "Demander si tout s'est bien passé",
          "Apporter l'addition sans un mot",
          "Débarrasser en plein repas",
          "Proposer l'addition avant le dessert",
        ],
        correctIndex: 0,
      },
    ]
  );

  const modCommande = await upsertFlashcardModule("mod-commande", salleTrack.id, 1, "Prise de commande & upsell", 5, 80, [
    { id: "f1", front: "Comment suggérer une entrée sans être insistant ?", back: "Proposez le plat signature du chef en une phrase courte, jamais plus de 2 suggestions." },
    { id: "f2", front: "Un client hésite entre deux plats.", back: "Décrivez la différence en une phrase, ne choisissez jamais à sa place." },
    { id: "f3", front: "Comment proposer une boisson en accompagnement ?", back: "Proposez toujours un accord au moment de la commande du plat, pas après." },
    { id: "f4", front: "Un client commande un plat en rupture.", back: "Excusez-vous, proposez immédiatement 2 alternatives proches." },
    { id: "f5", front: "Comment noter une commande avec modifications (sans oignon, cuisson...) ?", back: "Répétez la commande à voix haute au client avant de valider en cuisine." },
    { id: "f6", front: "Bonne pratique pour l'upsell dessert ?", back: "Présentez le dessert du jour avec une phrase gourmande, jamais un simple \"Un dessert ?\"." },
  ]);

  const modEncaissement = await upsertQuizModule(
    "mod-encaissement",
    salleTrack.id,
    2,
    "Procédure d'encaissement",
    4,
    100,
    [
      {
        prompt: "Un client souhaite payer en deux fois sur deux cartes différentes. Que faites-vous ?",
        choices: [
          "Vous refusez, ce n'est pas possible",
          "Vous utilisez la fonction \"paiement partagé\" de la caisse",
          "Vous demandez à un collègue de payer pour lui",
          "Vous encaissez tout sur une seule carte",
        ],
        correctIndex: 1,
      },
      {
        prompt: "Une erreur de caisse est détectée après le départ du client. Premier réflexe ?",
        choices: [
          "Vous ne dites rien",
          "Vous signalez immédiatement au manager et notez l'écart",
          "Vous corrigez seul le lendemain",
          "Vous payez la différence de votre poche",
        ],
        correctIndex: 1,
      },
      {
        prompt: "À quel moment proposez-vous l'addition ?",
        choices: [
          "Dès que le client s'assoit",
          "Uniquement quand le client la demande ou en fin de repas visible",
          "Toutes les 10 minutes",
          "Jamais, le client doit venir en caisse",
        ],
        correctIndex: 1,
      },
      {
        prompt: "Un pourboire est laissé en espèces. Que faites-vous ?",
        choices: [
          "Vous le gardez immédiatement",
          "Vous le déposez dans la caisse commune selon la procédure de l'établissement",
          "Vous le partagez au hasard",
          "Vous le donnez au premier collègue croisé",
        ],
        correctIndex: 1,
      },
      {
        prompt: "La caisse ne correspond pas en fin de service. Que faites-vous ?",
        choices: [
          "Vous recomptez et remplissez la fiche d'écart de caisse",
          "Vous partez, ce n'est pas grave",
          "Vous ajustez les chiffres pour que ça corresponde",
          "Vous accusez un collègue",
        ],
        correctIndex: 0,
      },
    ]
  );

  const modHaccpBases = await upsertQuizModule(
    "mod-haccp-bases",
    haccpTrack.id,
    0,
    "Les bases HACCP",
    5,
    120,
    [
      {
        prompt: "Que signifie HACCP ?",
        choices: [
          "Une norme de décoration de salle",
          "Une méthode de maîtrise des points critiques pour la sécurité alimentaire",
          "Un logiciel de caisse",
          "Un label de qualité du vin",
        ],
        correctIndex: 1,
      },
      {
        prompt: "Avant de manipuler des aliments, que devez-vous faire ?",
        choices: ["Vous laver les mains", "Rien de particulier", "Mettre du parfum", "Attendre la pause"],
        correctIndex: 0,
      },
      {
        prompt: "Un aliment tombé au sol en cuisine doit être :",
        choices: [
          "Rincé rapidement et resservi",
          "Jeté immédiatement",
          "Resservi si c'est un aliment sec",
          "Donné au personnel",
        ],
        correctIndex: 1,
      },
      {
        prompt: "La zone de stockage des produits chimiques doit être :",
        choices: [
          "Séparée des denrées alimentaires",
          "Juste à côté des légumes",
          "Dans le même placard que la vaisselle propre",
          "Peu importe",
        ],
        correctIndex: 0,
      },
      {
        prompt: "Une planche à découper doit être changée entre :",
        choices: [
          "Chaque type d'aliment (viande, légume, poisson)",
          "Uniquement en fin de service",
          "Jamais si elle est en bois",
          "Une fois par semaine",
        ],
        correctIndex: 0,
      },
      {
        prompt: "Qui est responsable du respect des règles HACCP au quotidien ?",
        choices: [
          "Uniquement le chef",
          "Chaque membre de l'équipe à son poste",
          "Uniquement le propriétaire",
          "Personne, c'est automatique",
        ],
        correctIndex: 1,
      },
    ]
  );

  const modTemperatures = await upsertFlashcardModule("mod-temperatures", haccpTrack.id, 1, "Température & conservation", 4, 90, [
    { id: "f1", front: "Température maximale d'un réfrigérateur pour denrées fraîches ?", back: "4°C maximum, contrôlée et relevée chaque jour." },
    { id: "f2", front: "Température d'un congélateur ?", back: "-18°C ou moins." },
    { id: "f3", front: "Un plat chaud doit être maintenu à quelle température ?", back: "63°C minimum jusqu'au service." },
    { id: "f4", front: "Comment refroidir rapidement un plat cuisiné ?", back: "De 63°C à 10°C en moins de 2 heures, idéalement en cellule de refroidissement." },
    { id: "f5", front: "Durée de conservation d'un produit ouvert au réfrigérateur ?", back: "Selon l'étiquette, généralement 72h maximum, daté à l'ouverture." },
    { id: "f6", front: "Que faire si une chambre froide dépasse la température limite ?", back: "Alerter immédiatement le responsable et isoler les denrées concernées." },
  ]);

  const modNettoyage = await upsertQuizModule(
    "mod-nettoyage",
    haccpTrack.id,
    2,
    "Plan de nettoyage",
    4,
    100,
    [
      {
        prompt: "Le plan de nettoyage affiché en cuisine sert à :",
        choices: [
          "Décorer le mur",
          "Définir qui nettoie quoi, quand et avec quel produit",
          "Remplacer les contrôles d'hygiène",
          "Rien d'obligatoire",
        ],
        correctIndex: 1,
      },
      {
        prompt: "Un produit désinfectant doit toujours être :",
        choices: [
          "Utilisé selon le dosage indiqué sur l'étiquette",
          "Mélangé avec d'autres produits pour plus d'efficacité",
          "Utilisé en grande quantité toujours",
          "Stocké dans une bouteille d'eau",
        ],
        correctIndex: 0,
      },
      {
        prompt: "Après le nettoyage d'un plan de travail, que faut-il faire avant utilisation ?",
        choices: ["Rien, c'est prêt", "Rincer et laisser sécher à l'air libre", "Recouvrir de farine", "Utiliser immédiatement mouillé"],
        correctIndex: 1,
      },
      {
        prompt: "Qui doit signer la fiche de traçabilité du nettoyage ?",
        choices: [
          "La personne qui a réalisé la tâche",
          "Personne, c'est informatif",
          "Uniquement le manager en fin de semaine",
          "Le premier arrivé le matin",
        ],
        correctIndex: 0,
      },
      {
        prompt: "Une éponge de nettoyage doit être changée :",
        choices: [
          "Jamais, elle s'use naturellement",
          "Très régulièrement, dès qu'elle est usée ou sale",
          "Une fois par an",
          "Seulement si elle est visible par un client",
        ],
        correctIndex: 1,
      },
    ]
  );

  const modMiseEnPlace = await upsertFlashcardModule("mod-mise-en-place", cuisineTrack.id, 0, "Fiches techniques & mise en place", 5, 90, [
    { id: "f1", front: "À quoi sert une fiche technique de plat ?", back: "Garantir un dressage et un grammage identiques à chaque service, quel que soit le cuisinier." },
    { id: "f2", front: "Que vérifier en premier en arrivant au poste ?", back: "Les stocks de mise en place et les DLC des produits déjà entamés." },
    { id: "f3", front: "Comment organiser son poste (méthode FIFO) ?", back: "First In, First Out : toujours utiliser d'abord les produits arrivés en premier." },
    { id: "f4", front: "Un grammage indiqué sur une fiche technique n'est pas respecté, pourquoi c'est un problème ?", back: "Ça impacte la marge, la régularité du goût et l'expérience client." },
    { id: "f5", front: "Comment étiqueter un produit préparé à l'avance ?", back: "Nom du produit, date de production et DLC, toujours visible." },
    { id: "f6", front: "Que faire en fin de service sur son poste ?", back: "Nettoyer, ranger les produits, remplir la fiche de mise en place pour le service suivant." },
  ]);

  const modSecuriteCuisine = await upsertQuizModule(
    "mod-securite-cuisine",
    cuisineTrack.id,
    1,
    "Sécurité en cuisine",
    4,
    100,
    [
      {
        prompt: "Vous transportez un couteau en cuisine. Comment le tenez-vous ?",
        choices: [
          "Lame vers le bas, le long de la jambe, en prévenant les collègues",
          "Lame vers le haut, à hauteur de visage",
          "Peu importe tant que vous allez vite",
          "Dans la poche du tablier",
        ],
        correctIndex: 0,
      },
      {
        prompt: "Une friteuse prend feu légèrement. Premier réflexe ?",
        choices: [
          "Jeter de l'eau dessus",
          "Couper le gaz/l'électricité et étouffer avec un couvercle ou une couverture anti-feu",
          "Courir chercher de l'aide sans rien faire",
          "Souffler dessus",
        ],
        correctIndex: 1,
      },
      {
        prompt: "Le port de chaussures antidérapantes en cuisine est :",
        choices: ["Optionnel", "Obligatoire", "Uniquement pour le chef", "Utile seulement l'hiver"],
        correctIndex: 1,
      },
      {
        prompt: "Vous vous coupez légèrement en poste. Que faites-vous ?",
        choices: [
          "Vous continuez, ce n'est rien",
          "Vous arrêtez, désinfectez, protégez avec un pansement bleu détectable et prévenez le responsable",
          "Vous essuyez avec le torchon de service",
          "Vous cachez la coupure",
        ],
        correctIndex: 1,
      },
      {
        prompt: "Pour soulever une charge lourde (bac, carton), il faut :",
        choices: [
          "Plier le dos et tirer avec les bras",
          "Plier les genoux et garder le dos droit",
          "Demander à quelqu'un de vous regarder faire",
          "Porter le plus vite possible",
        ],
        correctIndex: 1,
      },
    ]
  );

  const employeesSeed = [
    {
      email: "lea.martin@lepetitbouchon.fr",
      name: "Léa Martin",
      jobTitle: "Serveuse",
      hiredAt: daysAgo(14),
      trackIds: [salleTrack.id, haccpTrack.id],
      dueAt: daysAgo(4),
      badgeCodes: ["premier-module", "assidu"],
      attempts: [
        { moduleId: modAccueil.id, scorePct: 100, pointsEarned: 100, completedAt: daysAgo(13) },
        { moduleId: modCommande.id, scorePct: 100, pointsEarned: 80, completedAt: daysAgo(12) },
        { moduleId: modHaccpBases.id, scorePct: 67, pointsEarned: 80, completedAt: daysAgo(10) },
      ],
    },
    {
      email: "yanis.dubois@lepetitbouchon.fr",
      name: "Yanis Dubois",
      jobTitle: "Serveur",
      hiredAt: daysAgo(5),
      trackIds: [salleTrack.id],
      dueAt: daysFromNow(5),
      badgeCodes: ["premier-module"],
      attempts: [{ moduleId: modAccueil.id, scorePct: 80, pointsEarned: 100, completedAt: daysAgo(3) }],
    },
    {
      email: "chloe.bernard@lepetitbouchon.fr",
      name: "Chloé Bernard",
      jobTitle: "Commis de cuisine",
      hiredAt: daysAgo(3),
      trackIds: [cuisineTrack.id, haccpTrack.id],
      dueAt: daysFromNow(7),
      badgeCodes: [] as string[],
      attempts: [] as { moduleId: string; scorePct: number; pointsEarned: number; completedAt: Date }[],
    },
    {
      email: "marco.rossi@lepetitbouchon.fr",
      name: "Marco Rossi",
      jobTitle: "Plongeur / Cuisine",
      hiredAt: daysAgo(26),
      trackIds: [haccpTrack.id, cuisineTrack.id],
      dueAt: daysAgo(16),
      badgeCodes: ["premier-module"],
      attempts: [
        { moduleId: modHaccpBases.id, scorePct: 83, pointsEarned: 120, completedAt: daysAgo(24) },
        { moduleId: modTemperatures.id, scorePct: 70, pointsEarned: 70, completedAt: daysAgo(20) },
      ],
    },
    {
      email: "sofia.nguyen@lepetitbouchon.fr",
      name: "Sofia Nguyen",
      jobTitle: "Serveuse",
      hiredAt: daysAgo(9),
      trackIds: [salleTrack.id],
      dueAt: daysFromNow(1),
      badgeCodes: ["premier-module", "sans-faute", "assidu"],
      attempts: [
        { moduleId: modAccueil.id, scorePct: 100, pointsEarned: 100, completedAt: daysAgo(8) },
        { moduleId: modCommande.id, scorePct: 100, pointsEarned: 80, completedAt: daysAgo(7) },
        { moduleId: modEncaissement.id, scorePct: 100, pointsEarned: 100, completedAt: daysAgo(6) },
      ],
    },
    {
      email: "tom.legrand@lepetitbouchon.fr",
      name: "Tom Legrand",
      jobTitle: "Commis de cuisine",
      hiredAt: daysAgo(10),
      trackIds: [cuisineTrack.id, haccpTrack.id],
      dueAt: daysAgo(0),
      badgeCodes: [] as string[],
      attempts: [{ moduleId: modMiseEnPlace.id, scorePct: 60, pointsEarned: 90, completedAt: daysAgo(5) }],
    },
  ];

  void modNettoyage;
  void modSecuriteCuisine;

  for (const e of employeesSeed) {
    const points = e.attempts.reduce((sum, a) => sum + a.pointsEarned, 0);
    const user = await prisma.user.upsert({
      where: { email: e.email },
      update: { points, hiredAt: e.hiredAt },
      create: {
        organizationId: org.id,
        email: e.email,
        name: e.name,
        role: "EMPLOYEE",
        jobTitle: e.jobTitle,
        hiredAt: e.hiredAt,
        points,
      },
    });

    for (const trackId of e.trackIds) {
      await prisma.assignment.upsert({
        where: { userId_trackId: { userId: user.id, trackId } },
        update: {},
        create: { userId: user.id, trackId, assignedById: manager.id, dueDate: e.dueAt, status: "IN_PROGRESS" },
      });
    }

    await prisma.attempt.deleteMany({ where: { userId: user.id } });
    if (e.attempts.length > 0) {
      await prisma.attempt.createMany({
        data: e.attempts.map((a) => ({
          userId: user.id,
          moduleId: a.moduleId,
          scorePct: a.scorePct,
          pointsEarned: a.pointsEarned,
          completedAt: a.completedAt,
        })),
      });
    }

    for (const code of e.badgeCodes) {
      const badge = badges.get(code)!;
      await prisma.userBadge.upsert({
        where: { userId_badgeId: { userId: user.id, badgeId: badge.id } },
        update: {},
        create: { userId: user.id, badgeId: badge.id },
      });
    }
  }

  console.log(`Seed complete for organization "${org.name}".`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
