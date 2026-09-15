import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="text-xs tracking-[0.3em] text-gold uppercase">404</span>
      <h1 className="font-display text-4xl text-foreground sm:text-5xl">
        Cette page s&apos;est évaporée
      </h1>
      <p className="max-w-md text-muted-foreground">
        Le flacon que vous cherchez n&apos;existe pas, ou a changé d&apos;adresse.
      </p>
      <Button
        className="mt-4 bg-gold text-gold-foreground hover:bg-gold/90"
        nativeButton={false}
        render={<Link href="/parfums" />}
      >
        Retour au catalogue
      </Button>
    </section>
  );
}
