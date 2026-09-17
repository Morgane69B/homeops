"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPerfume, deletePerfume, updatePerfume } from "@/lib/actions/admin";

const GENDER_OPTIONS = [
  { value: "HOMME", label: "Homme" },
  { value: "FEMME", label: "Femme" },
  { value: "MIXTE", label: "Mixte" },
];

const CONCENTRATION_OPTIONS = [
  { value: "EXTRAIT_DE_PARFUM", label: "Extrait de Parfum" },
  { value: "EAU_DE_PARFUM", label: "Eau de Parfum" },
  { value: "EAU_DE_TOILETTE", label: "Eau de Toilette" },
  { value: "EAU_DE_COLOGNE", label: "Eau de Cologne" },
];

const selectClassName =
  "h-9 w-full rounded-lg border border-white/10 bg-white/[0.03] px-2.5 text-sm text-foreground outline-none focus-visible:border-gold/40";

type Offer = { id: string; price: number; volumeMl: number; merchantName: string };

type PerfumeData = {
  id: string;
  name: string;
  brand: string;
  gender: string;
  concentration: string;
  mainFamilyId: string;
  description: string;
  imageUrl: string | null;
  offers: Offer[];
};

export function PerfumeForm({
  mode,
  families,
  perfume,
}: {
  mode: "create" | "edit";
  families: { id: string; name: string }[];
  perfume?: PerfumeData;
}) {
  const router = useRouter();
  const [name, setName] = useState(perfume?.name ?? "");
  const [brand, setBrand] = useState(perfume?.brand ?? "");
  const [gender, setGender] = useState(perfume?.gender ?? "MIXTE");
  const [concentration, setConcentration] = useState(
    perfume?.concentration ?? "EAU_DE_PARFUM",
  );
  const [mainFamilyId, setMainFamilyId] = useState(
    perfume?.mainFamilyId ?? families[0]?.id ?? "",
  );
  const [description, setDescription] = useState(perfume?.description ?? "");
  const [imageUrl, setImageUrl] = useState(perfume?.imageUrl ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);

    const result =
      mode === "create"
        ? await createPerfume(formData)
        : await updatePerfume(perfume!.id, formData);

    setIsSaving(false);

    if ("error" in result) {
      setError(result.error);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  async function handleDelete() {
    if (!perfume) return;
    if (!confirm(`Supprimer « ${perfume.name} » définitivement ?`)) return;
    setIsDeleting(true);
    await deletePerfume(perfume.id);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Nom</Label>
          <Input
            id="name"
            name="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-white/10 bg-white/[0.03]"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="brand">Marque</Label>
          <Input
            id="brand"
            name="brand"
            required
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="border-white/10 bg-white/[0.03]"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="gender">Genre</Label>
          <select
            id="gender"
            name="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className={selectClassName}
          >
            {GENDER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="concentration">Concentration</Label>
          <select
            id="concentration"
            name="concentration"
            value={concentration}
            onChange={(e) => setConcentration(e.target.value)}
            className={selectClassName}
          >
            {CONCENTRATION_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="mainFamilyId">Famille olfactive</Label>
          <select
            id="mainFamilyId"
            name="mainFamilyId"
            value={mainFamilyId}
            onChange={(e) => setMainFamilyId(e.target.value)}
            className={selectClassName}
          >
            {families.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border-white/10 bg-white/[0.03]"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="imageUrl">Photo (URL de l&apos;image)</Label>
        <Input
          id="imageUrl"
          name="imageUrl"
          type="url"
          placeholder="https://..."
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="border-white/10 bg-white/[0.03]"
        />
        <p className="text-xs text-muted-foreground">
          Laissez vide pour garder la photo générique attribuée automatiquement.
        </p>
        {imageUrl && (
          <div className="relative mt-3 h-48 w-40 overflow-hidden rounded-lg border border-white/10 bg-luxury-ink">
            {/* Live preview of a pasted URL, which may not be an allow-listed
                domain yet — a plain img avoids next/image's build-time
                domain check for this ephemeral preview. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Aperçu"
              className="size-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}
      </div>

      {mode === "edit" && perfume!.offers.length > 0 && (
        <div className="space-y-3">
          <Label>Prix par marchand</Label>
          <div className="space-y-2 rounded-lg border border-white/10 p-3">
            {perfume!.offers.map((offer) => (
              <div key={offer.id} className="flex items-center gap-3 text-sm">
                <input type="hidden" name="offerId" value={offer.id} />
                <span className="flex-1 truncate text-foreground/80">
                  {offer.merchantName} · {offer.volumeMl} ml
                </span>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  name={`offerPrice_${offer.id}`}
                  defaultValue={offer.price}
                  className="w-28 border-white/10 bg-white/[0.03]"
                />
                <span className="text-muted-foreground">€</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-center justify-between">
        <Button
          type="submit"
          disabled={isSaving}
          className="bg-gold text-gold-foreground hover:bg-gold/90"
        >
          {isSaving ? "Enregistrement..." : "Enregistrer"}
        </Button>

        {mode === "edit" && (
          <Button
            type="button"
            variant="ghost"
            disabled={isDeleting}
            onClick={handleDelete}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            {isDeleting ? "Suppression..." : "Supprimer ce parfum"}
          </Button>
        )}
      </div>
    </form>
  );
}
