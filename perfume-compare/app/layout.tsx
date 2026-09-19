import type { Metadata } from "next";
import { Geist_Mono, Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CookieConsent } from "@/components/layout/cookie-consent";
import { SessionProvider } from "@/components/providers/session-provider";

const montserrat = Montserrat({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const SITE_URL = "https://essence-opal.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Essence — Comparateur de Parfums",
    template: "%s | Essence",
  },
  description:
    "Plateforme premium de comparaison de prix de parfums, guide olfactif et blog.",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Essence",
    title: "Essence — Comparateur de Parfums",
    description:
      "Plateforme premium de comparaison de prix de parfums, guide olfactif et blog.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Essence — Comparateur de Parfums",
    description:
      "Plateforme premium de comparaison de prix de parfums, guide olfactif et blog.",
  },
  robots: { index: true, follow: true },
};

const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Essence",
  url: SITE_URL,
  description:
    "Plateforme premium de comparaison de prix de parfums, guide olfactif et blog.",
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/parfums?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`dark ${montserrat.variable} ${geistMono.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSON_LD) }}
        />
        <SessionProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieConsent />
        </SessionProvider>
      </body>
    </html>
  );
}
