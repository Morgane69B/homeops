"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateFamily } from "@/lib/actions/admin";

export function FamilyForm({
  family,
}: {
  family: { id: string; name: string; description: string };
}) {
  const router = useRouter();
  const [name, setName] = useState(family.name);
  const [description, setDescription] = useState(family.description);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    const result = await updateFamily(family.id, formData);

    setIsSaving(false);

    if ("error" in result) {
      setError(result.error);
      return;
    }

    router.push("/admin/familles");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      {error && <p className="text-sm text-destructive">{error}</p>}

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
