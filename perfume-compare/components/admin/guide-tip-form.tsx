"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createGuideTip, deleteGuideTip, updateGuideTip } from "@/lib/actions/admin";

export function GuideTipForm({
  mode,
  tip,
}: {
  mode: "create" | "edit";
  tip?: { id: string; title: string; body: string };
}) {
  const router = useRouter();
  const [title, setTitle] = useState(tip?.title ?? "");
  const [body, setBody] = useState(tip?.body ?? "");
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
        ? await createGuideTip(formData)
        : await updateGuideTip(tip!.id, formData);

    setIsSaving(false);

    if ("error" in result) {
      setError(result.error);
      return;
    }

    router.push("/admin/guide");
    router.refresh();
  }

  async function handleDelete() {
    if (!tip) return;
    if (!confirm(`Supprimer le conseil « ${tip.title} » ?`)) return;
    setIsDeleting(true);
    await deleteGuideTip(tip.id);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1.5">
        <Label htmlFor="title">Titre</Label>
        <Input
          id="title"
          name="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-white/10 bg-white/[0.03]"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="body">Texte</Label>
        <Textarea
          id="body"
          name="body"
          required
          rows={6}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="border-white/10 bg-white/[0.03]"
        />
      </div>

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
            {isDeleting ? "Suppression..." : "Supprimer ce conseil"}
          </Button>
        )}
      </div>
    </form>
  );
}
