import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Créer un compte | Essence",
  description: "Créez votre compte Essence pour enregistrer vos parfums favoris.",
  robots: { index: false, follow: true },
};

export default async function RegisterPage({
  searchParams,
}: PageProps<"/register">) {
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
        Créer un compte
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Enregistrez vos parfums favoris et suivez leurs prix.
      </p>

      <div className="mt-8">
        <RegisterForm callbackUrl={callbackUrl} />
      </div>
    </div>
  );
}
