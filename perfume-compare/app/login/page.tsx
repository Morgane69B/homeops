import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Connexion | Essence",
  description: "Connectez-vous à votre compte Essence pour retrouver votre wishlist.",
  robots: { index: false, follow: true },
};

export default async function LoginPage({
  searchParams,
}: PageProps<"/login">) {
  const session = await auth();
  const params = await searchParams;
  const callbackUrl =
    typeof params.callbackUrl === "string" ? params.callbackUrl : "/dashboard";

  if (session?.user) redirect(callbackUrl);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <span className="text-xs tracking-[0.3em] text-gold uppercase">
        Espace personnel
      </span>
      <h1 className="mt-3 font-display text-3xl text-foreground">
        Bon retour parmi nous
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Connectez-vous pour retrouver votre wishlist.
      </p>

      <div className="mt-8">
        <LoginForm
          callbackUrl={callbackUrl}
          googleEnabled={Boolean(
            process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET,
          )}
        />
      </div>
    </div>
  );
}
