import { getSiteSettings } from "@/lib/site-settings";
import { SiteSettingsForm } from "@/components/admin/site-settings-form";

export default async function AdminSitePage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <p className="text-sm text-muted-foreground">
        Le texte de la page d&apos;accueil : titre, description, boutons, les
        3 blocs de mise en avant et le petit texte du pied de page.
      </p>
      <div className="mt-6">
        <SiteSettingsForm settings={settings} />
      </div>
    </div>
  );
}
