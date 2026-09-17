"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateLegalPage } from "@/lib/actions/admin";

export function LegalPageForm({
  page,
}: {
  page: { id: string; title: string; content: string };
}) {
  const router = useRouter();
  const [title, setTitle] = useState(page.title);
  const [content, setContent] = useState(page.content);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    const result = await updateLegalPage(page.id, formData);

    setIsSaving(false);

    if ("error" in result) {
      setError(result.error);
      return;
    }

    router.push("/admin/legal");
    router.refresh();
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
        <Label htmlFor="content">Contenu</Label>
        <Textarea
          id="content"
          name="content"
          required
          rows={24}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border-white/10 bg-white/[0.03] font-mono text-xs"
        />
        <p className="text-xs text-muted-foreground">
          Une ligne vide sépare les paragraphes. « ## Titre » pour une section,
          « - élément » pour une liste, « [texte](url) » pour un lien.
        </p>
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
