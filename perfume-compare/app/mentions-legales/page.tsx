import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales | Essence",
  description: "Mentions légales du site Essence, comparateur de prix de parfums.",
  robots: { index: true, follow: true },
};

export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <span className="text-xs tracking-[0.3em] text-gold uppercase">
        Informations légales
      </span>
      <h1 className="mt-3 font-display text-4xl text-foreground">
        Mentions légales
      </h1>

      <div className="prose prose-invert mt-10 max-w-none space-y-8 text-sm text-muted-foreground">
        <section>
          <h2 className="font-display text-xl text-foreground">Éditeur du site</h2>
          <p className="mt-3">
            Le site Essence est édité par :{" "}
            <strong className="text-foreground">
              [Nom et prénom, ou raison sociale à compléter]
            </strong>
            , [statut : entrepreneur individuel / société — à compléter],
            domicilié·e à [adresse à compléter].
          </p>
          <p className="mt-2">
            Contact :{" "}
            <a
              href="mailto:morganebertin69@hotmail.com"
              className="text-gold hover:underline"
            >
              morganebertin69@hotmail.com
            </a>
          </p>
          <p className="mt-2">
            Directeur·rice de la publication : [nom à compléter].
          </p>
          <p className="mt-4 rounded-lg border border-gold/20 bg-gold/5 p-4 text-xs text-foreground/70">
            Les informations entre crochets doivent être complétées avec
            l&apos;identité réelle de l&apos;exploitant·e du site avant mise
            en production commerciale, conformément à l&apos;article 6-III de
            la loi n° 2004-575 du 21 juin 2004 (LCEN).
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground">Hébergement</h2>
          <p className="mt-3">
            Le site est hébergé par :<br />
            Vercel Inc.
            <br />
            440 N Barranca Ave #4133, Covina, CA 91723, États-Unis
            <br />
            <a
              href="https://vercel.com"
              className="text-gold hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              vercel.com
            </a>
          </p>
          <p className="mt-3">
            La base de données est hébergée par Neon Inc. (Lakebase Postgres),
            infrastructure AWS, région Europe (Francfort).
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground">
            Propriété intellectuelle
          </h2>
          <p className="mt-3">
            L&apos;ensemble des éléments du site (textes, mises en page,
            graphismes, logo) sont, sauf mention contraire, la propriété de
            l&apos;éditeur du site. Les noms de marques et de parfums cités
            sont la propriété de leurs détenteurs respectifs et sont mentionnés
            à titre purement informatif, dans le cadre d&apos;un service de
            comparaison de prix.
          </p>
          <p className="mt-3">
            Les photographies illustrant les parfums proviennent de banques
            d&apos;images libres de droits (licence Pexels) et ne représentent
            pas nécessairement le flacon réel du produit décrit.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground">
            Responsabilité
          </h2>
          <p className="mt-3">
            Les prix affichés sur Essence sont fournis à titre indicatif et
            peuvent différer du prix réellement pratiqué par les marchands au
            moment de l&apos;achat. Essence ne vend aucun produit directement
            et n&apos;est pas responsable des transactions effectuées auprès
            des marchands tiers référencés.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground">Contact</h2>
          <p className="mt-3">
            Pour toute question relative aux présentes mentions légales,
            écrivez à{" "}
            <a
              href="mailto:morganebertin69@hotmail.com"
              className="text-gold hover:underline"
            >
              morganebertin69@hotmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
