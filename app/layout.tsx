import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { PageTransition } from "@/components/layout/page-transition";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HomeOps — Vos abonnements et charges, sous contrôle",
  description:
    "Tableau de bord premium pour piloter les abonnements et charges du foyer, conforme aux lois Hamon et Chatel.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <TooltipProvider delayDuration={150}>
            <div className="relative min-h-screen">
              <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_15%_-10%,rgba(99,102,241,0.14),transparent_45%),radial-gradient(circle_at_85%_10%,rgba(16,185,129,0.10),transparent_40%)]" />
              <Sidebar />
              <div className="md:pl-64">
                <main className="mx-auto max-w-7xl px-5 pb-24 md:px-8 md:pb-10">
                  <PageTransition>{children}</PageTransition>
                </main>
              </div>
              <MobileNav />
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
