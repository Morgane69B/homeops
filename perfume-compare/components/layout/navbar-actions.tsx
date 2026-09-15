"use client";

import Link from "next/link";
import { Heart, Menu, User } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavLinks } from "@/components/layout/nav-links";

type SessionUser = { name?: string | null; email?: string | null } | undefined;

export function NavbarActions({ user }: { user: SessionUser }) {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        nativeButton={false}
        className="text-foreground/70 hover:text-gold hover:bg-white/5"
        render={<Link href="/dashboard" aria-label="Ma wishlist" />}
      >
        <Heart className="size-4" />
      </Button>

      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="hidden text-foreground/70 hover:text-gold hover:bg-white/5 sm:inline-flex"
                aria-label="Mon compte"
              />
            }
          >
            <User className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="border-white/10">
            <DropdownMenuLabel className="truncate">
              {user.name ?? user.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/dashboard" />}>
              Tableau de bord
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          nativeButton={false}
          className="hidden text-foreground/70 hover:text-gold hover:bg-white/5 sm:inline-flex"
          render={<Link href="/login" aria-label="Se connecter" />}
        >
          <User className="size-4" />
        </Button>
      )}

      <Sheet>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground/70 hover:text-gold hover:bg-white/5 md:hidden"
              aria-label="Ouvrir le menu"
            />
          }
        >
          <Menu className="size-4" />
        </SheetTrigger>
        <SheetContent
          side="right"
          className="border-white/10 bg-background/95 backdrop-blur-xl"
        >
          <SheetHeader>
            <SheetTitle className="font-display tracking-[0.2em] uppercase">
              Essence
            </SheetTitle>
          </SheetHeader>
          <Separator className="bg-white/10" />
          <NavLinks
            className="flex flex-col gap-1 px-4"
            linkClassName="rounded-md px-2 py-3 text-base hover:bg-white/5"
          />
          <Separator className="bg-white/10" />
          <div className="flex flex-col gap-1 px-4">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-md px-2 py-3 text-base text-foreground/80 transition-colors hover:bg-white/5 hover:text-gold"
                >
                  Tableau de bord
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="rounded-md px-2 py-3 text-left text-base text-foreground/80 transition-colors hover:bg-white/5 hover:text-gold"
                >
                  Se déconnecter
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-md px-2 py-3 text-base text-foreground/80 transition-colors hover:bg-white/5 hover:text-gold"
              >
                Se connecter
              </Link>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
