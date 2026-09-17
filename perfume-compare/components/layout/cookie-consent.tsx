"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "essence-cookie-consent";

type Consent = "accepted" | "declined" | null;

export function CookieConsent() {
  const [consent, setConsent] = useState<Consent>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "accepted" || stored === "declined") setConsent(stored);
    } catch {
      // localStorage unavailable (private browsing, etc.) — treat as undecided.
    }
    setReady(true);
  }, []);

  function choose(value: "accepted" | "declined") {
    setConsent(value);
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Ignore — the choice still applies for this page view.
    }
  }

  return (
    <>
      {consent === "accepted" && <Analytics />}

      {ready && consent === null && (
        <div className="fixed inset-x-0 bottom-0 z-[100] border-t border-white/10 bg-luxury-black/95 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <p className="text-sm text-muted-foreground">
              Essence utilise un cookie de session indispensable à la
              connexion, et — avec votre accord — une mesure d&apos;audience
              anonyme pour améliorer le site. En savoir plus dans notre{" "}
              <Link href="/confidentialite" className="text-gold hover:underline">
                politique de confidentialité
              </Link>
              .
            </p>
            <div className="flex shrink-0 gap-3">
              <Button
                variant="ghost"
                onClick={() => choose("declined")}
                className="text-foreground/70 hover:bg-white/5"
              >
                Refuser
              </Button>
              <Button
                onClick={() => choose("accepted")}
                className="bg-gold text-gold-foreground hover:bg-gold/90"
              >
                Accepter
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
