import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation | Essence",
  description: "Conditions générales d'utilisation du site Essence.",
  robots: { index: true, follow: true },
};

export default function CGUPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <span className="text-xs tracking-[0.3em] text-gold uppercase">
        CGU
      </span>
      <h1 className="mt-3 font-display text-4xl text-foreground">
        Conditions Générales d&apos;Utilisation
      </h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
      </p>

      <div className="prose prose-invert mt-10 max-w-none space-y-8 text-sm text-muted-foreground">
        <section>
          <h2 className="font-display text-xl text-foreground">Objet</h2>
          <p className="mt-3">
            Essence est un service en ligne de comparaison de prix de
            parfums, accompagné d&apos;un guide olfactif et d&apos;un journal
            éditorial. L&apos;utilisation du site implique l&apos;acceptation
            pleine et entière des présentes conditions.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground">
            Nature du service
          </h2>
          <p className="mt-3">
            Essence ne vend aucun produit et n&apos;est pas un site marchand.
            Le site référence des offres de prix associées à des marchands
            tiers, à titre indicatif. Les prix, la disponibilité et les
            conditions de vente relèvent exclusivement des marchands
            concernés au moment de l&apos;achat.
          </p>
          <p className="mt-3">
            Essence s&apos;efforce de maintenir des informations à jour mais
            ne garantit pas l&apos;exactitude, l&apos;exhaustivité ou
            l&apos;actualité des prix affichés.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground">
            Création de compte
          </h2>
          <p className="mt-3">
            La création d&apos;un compte est facultative et permet
            d&apos;accéder à la fonctionnalité de wishlist. Vous vous engagez
            à fournir des informations exactes et à conserver la
            confidentialité de votre mot de passe. Vous êtes responsable de
            toute activité effectuée depuis votre compte.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground">
            Utilisation acceptable
          </h2>
          <p className="mt-3">Vous vous engagez à ne pas :</p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5">
            <li>
              utiliser le site à des fins frauduleuses ou contraires à la loi,
            </li>
            <li>
              tenter d&apos;extraire massivement le contenu du site
              (aspiration automatisée, robots non autorisés),
            </li>
            <li>
              porter atteinte au bon fonctionnement du service ou à sa
              sécurité.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground">
            Propriété intellectuelle
          </h2>
          <p className="mt-3">
            Le contenu éditorial (guide, journal, descriptions) est protégé
            par le droit d&apos;auteur. Toute reproduction sans autorisation
            est interdite. Les marques et noms de parfums cités restent la
            propriété de leurs titulaires respectifs.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground">
            Limitation de responsabilité
          </h2>
          <p className="mt-3">
            Essence ne saurait être tenu responsable des litiges liés à un
            achat effectué chez un marchand tiers référencé sur le site, ni
            des interruptions temporaires de service.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground">
            Modification des CGU
          </h2>
          <p className="mt-3">
            Ces conditions peuvent être modifiées à tout moment. La version
            en vigueur est celle publiée sur cette page à la date de votre
            visite.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground">
            Droit applicable
          </h2>
          <p className="mt-3">
            Les présentes CGU sont soumises au droit français. Tout litige
            relève, à défaut de résolution amiable, des tribunaux compétents.
          </p>
        </section>
      </div>
    </div>
  );
}
