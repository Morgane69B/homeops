import type { LetterTemplate } from "@/types";
import { formatDateFr } from "@/lib/utils";

const header = (user: { fullName: string; address: string; postalCode: string; city: string; email: string }, date: string) => `${user.fullName}
${user.address}
${user.postalCode} ${user.city}
${user.email}

${user.city}, le ${formatDateFr(date)}`;

export const letterTemplates: LetterTemplate[] = [
  {
    id: "hamon",
    title: "Résiliation — Loi Hamon",
    legalBasis:
      "Article L215-1 du Code de la consommation — résiliation à tout moment après 12 mois d'engagement, sans frais ni pénalité, pour les contrats d'assurance et certains services (téléphonie, internet).",
    body: ({ user, subscription, date }) => `${header(user, date)}

Objet : Demande de résiliation de mon contrat n° ${subscription.clientNumber ?? "—"} — Loi Hamon
Lettre recommandée avec accusé de réception

Madame, Monsieur,

Par la présente lettre, je vous notifie ma décision de résilier le contrat n° ${subscription.clientNumber ?? "—"} me liant à ${subscription.name}, conformément aux dispositions de l'article L215-1 du Code de la consommation issu de la loi Hamon du 17 mars 2014, qui m'autorise à résilier ce contrat à tout moment dès lors qu'il a été souscrit depuis plus de douze mois, sans frais ni pénalité.

Je vous prie de bien vouloir prendre en compte cette résiliation dans les meilleurs délais et de me confirmer par écrit la date effective de fin de contrat, ainsi que, le cas échéant, le remboursement au prorata des sommes déjà versées.

Je vous remercie de m'adresser toute confirmation utile à l'adresse mentionnée ci-dessus.

Veuillez agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

${user.fullName}`,
  },
  {
    id: "chatel",
    title: "Résiliation — Loi Chatel",
    legalBasis:
      "Article L215-1 et L136-1 du Code de la consommation — droit de ne pas reconduire tacitement un contrat, ou résiliation sans pénalité si l'avis d'échéance n'a pas été envoyé dans les délais légaux.",
    body: ({ user, subscription, date }) => `${header(user, date)}

Objet : Non-reconduction / résiliation du contrat n° ${subscription.clientNumber ?? "—"} — Loi Chatel
Lettre recommandée avec accusé de réception

Madame, Monsieur,

Titulaire du contrat n° ${subscription.clientNumber ?? "—"} auprès de ${subscription.name}, je vous informe par la présente de ma volonté de ne pas reconduire tacitement ce contrat à sa prochaine échéance, prévue le ${formatDateFr(subscription.nextRenewal)}, conformément à l'article L215-1 du Code de la consommation (loi Chatel du 3 janvier 2008).

Je vous rappelle qu'à défaut de m'avoir informé(e) de la possibilité de ne pas reconduire le contrat dans les conditions prévues par la loi, je suis en droit de résilier celui-ci à tout moment à compter de la date de reconduction, sans pénalité.

Je vous saurais gré de bien vouloir m'adresser une confirmation écrite de la prise en compte de cette résiliation.

Veuillez agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

${user.fullName}`,
  },
  {
    id: "standard",
    title: "Résiliation standard",
    legalBasis:
      "Résiliation de droit commun, selon les conditions générales de vente du service concerné.",
    body: ({ user, subscription, date }) => `${header(user, date)}

Objet : Résiliation de mon abonnement — ${subscription.name}

Madame, Monsieur,

Je vous informe par la présente de ma décision de résilier mon abonnement ${subscription.name}${
      subscription.clientNumber ? ` (référence client n° ${subscription.clientNumber})` : ""
    }, à effet à la date la plus proche autorisée par nos conditions contractuelles.

Je vous remercie de bien vouloir m'adresser une confirmation écrite de cette résiliation ainsi que la date effective de fin de service.

Veuillez agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

${user.fullName}`,
  },
];

export function getTemplate(id: string) {
  return letterTemplates.find((t) => t.id === id) ?? letterTemplates[2];
}
