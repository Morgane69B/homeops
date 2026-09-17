import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité | Essence",
  description:
    "Comment Essence collecte, utilise et protège vos données personnelles, conformément au RGPD.",
  robots: { index: true, follow: true },
};

export default function ConfidentialitePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <span className="text-xs tracking-[0.3em] text-gold uppercase">
        RGPD
      </span>
      <h1 className="mt-3 font-display text-4xl text-foreground">
        Politique de confidentialité
      </h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
      </p>

      <div className="prose prose-invert mt-10 max-w-none space-y-8 text-sm text-muted-foreground">
        <section>
          <h2 className="font-display text-xl text-foreground">
            Quelles données sont collectées ?
          </h2>
          <p className="mt-3">
            Lorsque vous créez un compte sur Essence, nous collectons :
          </p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5">
            <li>votre nom (tel que vous le renseignez),</li>
            <li>votre adresse email,</li>
            <li>votre mot de passe, stocké sous forme chiffrée (hashée), jamais en clair,</li>
            <li>votre liste de parfums en wishlist.</li>
          </ul>
          <p className="mt-3">
            Si vous vous connectez avec Google, nous recevons uniquement votre
            nom, votre email et votre photo de profil Google, selon les
            informations que vous autorisez à ce moment-là.
          </p>
          <p className="mt-3">
            Naviguer sur le catalogue, le guide ou le journal sans créer de
            compte ne génère aucune collecte de données personnelles.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground">
            Pourquoi ces données sont-elles collectées ?
          </h2>
          <p className="mt-3">
            Ces données servent exclusivement à :
          </p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5">
            <li>créer et sécuriser votre compte (base légale : exécution du contrat),</li>
            <li>afficher et sauvegarder votre wishlist,</li>
            <li>vous permettre de vous reconnecter.</li>
          </ul>
          <p className="mt-3">
            Nous ne revendons ni ne partageons vos données avec des tiers à
            des fins commerciales.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground">Cookies</h2>
          <p className="mt-3">
            Essence utilise un cookie de session, strictement nécessaire au
            fonctionnement du site (rester connecté·e à votre compte). Ce
            cookie ne nécessite pas de consentement préalable au titre de la
            réglementation applicable, car il est indispensable au service
            demandé.
          </p>
          <p className="mt-3">
            Si des cookies ou technologies de mesure d&apos;audience
            supplémentaires sont utilisés, ils ne sont déposés qu&apos;après
            votre consentement explicite, recueilli via le bandeau affiché
            lors de votre première visite. Vous pouvez modifier votre choix à
            tout moment en effaçant les cookies de votre navigateur.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground">
            Durée de conservation
          </h2>
          <p className="mt-3">
            Vos données de compte sont conservées tant que votre compte est
            actif. Vous pouvez demander leur suppression à tout moment (voir
            « Vos droits » ci-dessous).
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground">
            Hébergement des données
          </h2>
          <p className="mt-3">
            Vos données sont hébergées au sein de l&apos;Union européenne
            (infrastructure AWS, région Francfort, via Neon Inc.). Le site lui
            -même est hébergé par Vercel Inc. (États-Unis).
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground">Vos droits</h2>
          <p className="mt-3">
            Conformément au Règlement Général sur la Protection des Données
            (RGPD) et à la loi Informatique et Libertés, vous disposez d&apos;un
            droit d&apos;accès, de rectification, d&apos;effacement, de
            limitation et de portabilité de vos données, ainsi que du droit de
            retirer votre consentement à tout moment.
          </p>
          <p className="mt-3">
            Pour exercer ces droits, écrivez à{" "}
            <a
              href="mailto:morganebertin69@hotmail.com"
              className="text-gold hover:underline"
            >
              morganebertin69@hotmail.com
            </a>
            . Vous pouvez également introduire une réclamation auprès de la
            CNIL (
            <a
              href="https://www.cnil.fr"
              className="text-gold hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              cnil.fr
            </a>
            ).
          </p>
        </section>
      </div>
    </div>
  );
}
