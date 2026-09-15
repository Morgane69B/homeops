import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OnboardingTopbar } from "@/components/onboarding/onboarding-topbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Onboarding Express — Formez vos équipes en un temps record",
  description:
    "Onboarding gamifié et micro-learning mobile pour restaurants, hôtels et commerces : rendez vos nouvelles recrues opérationnelles en quelques jours.",
};

export default function OnboardingExpressLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <TooltipProvider delayDuration={150}>
            <div className="relative min-h-screen">
              <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_15%_-10%,rgba(99,102,241,0.12),transparent_45%),radial-gradient(circle_at_85%_10%,rgba(244,63,94,0.08),transparent_40%)]" />
              <OnboardingTopbar />
              <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">{children}</main>
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
