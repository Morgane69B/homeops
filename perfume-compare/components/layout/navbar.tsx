import Link from "next/link";
import { auth } from "@/auth";
import { NavLinks } from "@/components/layout/nav-links";
import { NavbarActions } from "@/components/layout/navbar-actions";

export async function Navbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-display text-xl tracking-[0.2em] text-foreground uppercase"
        >
          Essence
        </Link>

        <NavLinks
          className="hidden items-center gap-8 md:flex"
          linkClassName="text-sm tracking-wide"
        />

        <NavbarActions user={session?.user} />
      </div>
    </header>
  );
}
