"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateSiteSettings } from "@/lib/actions/admin";

type Settings = {
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  pillar1Title: string;
  pillar1Description: string;
  pillar2Title: string;
  pillar2Description: string;
  pillar3Title: string;
  pillar3Description: string;
  familiesEyebrow: string;
  familiesTitle: string;
  footerTagline: string;
};

export function SiteSettingsForm({ settings }: { settings: Settings }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    const result = await updateSiteSettings(formData);

    setIsSaving(false);

    if ("error" in result) {
      setError(result.error);
      return;
    }

    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="space-y-4">
        <Label className="text-xs tracking-[0.2em] text-gold uppercase">
          En-tête (hero)
        </Label>
        <div className="space-y-1.5">
          <Label htmlFor="heroEyebrow">Petit texte au-dessus du titre</Label>
          <Input id="heroEyebrow" name="heroEyebrow" required defaultValue={settings.heroEyebrow} className="border-white/10 bg-white/[0.03]" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="heroTitle">Titre principal</Label>
          <Input id="heroTitle" name="heroTitle" required defaultValue={settings.heroTitle} className="border-white/10 bg-white/[0.03]" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="heroDescription">Description</Label>
          <Textarea id="heroDescription" name="heroDescription" required rows={3} defaultValue={settings.heroDescription} className="border-white/10 bg-white/[0.03]" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="heroCtaPrimary">Bouton principal</Label>
            <Input id="heroCtaPrimary" name="heroCtaPrimary" required defaultValue={settings.heroCtaPrimary} className="border-white/10 bg-white/[0.03]" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="heroCtaSecondary">Lien secondaire</Label>
            <Input id="heroCtaSecondary" name="heroCtaSecondary" required defaultValue={settings.heroCtaSecondary} className="border-white/10 bg-white/[0.03]" />
          </div>
        </div>
      </div>

      <div className="space-y-4 border-t border-white/10 pt-8">
        <Label className="text-xs tracking-[0.2em] text-gold uppercase">
          Les 3 blocs de mise en avant
        </Label>
        {(["1", "2", "3"] as const).map((n) => (
          <div key={n} className="grid gap-3 rounded-lg border border-white/10 p-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor={`pillar${n}Title`}>Titre {n}</Label>
              <Input
                id={`pillar${n}Title`}
                name={`pillar${n}Title`}
                required
                defaultValue={settings[`pillar${n}Title` as keyof Settings]}
                className="border-white/10 bg-white/[0.03]"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`pillar${n}Description`}>Description {n}</Label>
              <Input
                id={`pillar${n}Description`}
                name={`pillar${n}Description`}
                required
                defaultValue={settings[`pillar${n}Description` as keyof Settings]}
                className="border-white/10 bg-white/[0.03]"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4 border-t border-white/10 pt-8">
        <Label className="text-xs tracking-[0.2em] text-gold uppercase">
          Section « familles olfactives »
        </Label>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="familiesEyebrow">Petit texte</Label>
            <Input id="familiesEyebrow" name="familiesEyebrow" required defaultValue={settings.familiesEyebrow} className="border-white/10 bg-white/[0.03]" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="familiesTitle">Titre</Label>
            <Input id="familiesTitle" name="familiesTitle" required defaultValue={settings.familiesTitle} className="border-white/10 bg-white/[0.03]" />
          </div>
        </div>
      </div>

      <div className="space-y-4 border-t border-white/10 pt-8">
        <Label className="text-xs tracking-[0.2em] text-gold uppercase">
          Pied de page
        </Label>
        <div className="space-y-1.5">
          <Label htmlFor="footerTagline">Texte sous le logo</Label>
          <Textarea id="footerTagline" name="footerTagline" required rows={2} defaultValue={settings.footerTagline} className="border-white/10 bg-white/[0.03]" />
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {saved && !error && <p className="text-sm text-emerald">Enregistré.</p>}

      <Button
        type="submit"
        disabled={isSaving}
        className="bg-gold text-gold-foreground hover:bg-gold/90"
      >
        {isSaving ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  );
}
