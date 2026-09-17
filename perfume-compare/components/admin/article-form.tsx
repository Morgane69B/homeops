"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createArticle, deleteArticle, updateArticle } from "@/lib/actions/admin";

type ArticleData = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  perfumeIds: string[];
};

export function ArticleForm({
  mode,
  perfumes,
  article,
}: {
  mode: "create" | "edit";
  perfumes: { id: string; name: string; brand: string }[];
  article?: ArticleData;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(article?.title ?? "");
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
  const [content, setContent] = useState(article?.content ?? "");
  const [coverImage, setCoverImage] = useState(article?.coverImage ?? "");
  const [selectedPerfumeIds, setSelectedPerfumeIds] = useState<Set<string>>(
    () => new Set(article?.perfumeIds ?? []),
  );
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  function togglePerfume(id: string) {
    setSelectedPerfumeIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);

    const result =
      mode === "create"
        ? await createArticle(formData)
        : await updateArticle(article!.id, formData);

    setIsSaving(false);

    if ("error" in result) {
      setError(result.error);
      return;
    }

    router.push("/admin/articles");
    router.refresh();
  }

  async function handleDelete() {
    if (!article) return;
    if (!confirm(`Supprimer « ${article.title} » définitivement ?`)) return;
    setIsDeleting(true);
    await deleteArticle(article.id);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
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
        <Label htmlFor="excerpt">Résumé</Label>
        <Textarea
          id="excerpt"
          name="excerpt"
          required
          rows={2}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="border-white/10 bg-white/[0.03]"
        />
        <p className="text-xs text-muted-foreground">
          Affiché sur la vignette dans le journal.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="content">Contenu</Label>
        <Textarea
          id="content"
          name="content"
          required
          rows={14}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border-white/10 bg-white/[0.03]"
        />
        <p className="text-xs text-muted-foreground">
          Séparez les paragraphes par une ligne vide.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="coverImage">Photo de couverture (URL)</Label>
        <Input
          id="coverImage"
          name="coverImage"
          type="url"
          placeholder="https://..."
          value={coverImage ?? ""}
          onChange={(e) => setCoverImage(e.target.value)}
          className="border-white/10 bg-white/[0.03]"
        />
      </div>

      <div className="space-y-1.5">
        <Label>Parfums cités</Label>
        <div className="max-h-64 space-y-1 overflow-y-auto rounded-lg border border-white/10 p-3">
          {perfumes.map((perfume) => (
            <label
              key={perfume.id}
              className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-white/[0.03]"
            >
              <input
                type="checkbox"
                name="perfumeId"
                value={perfume.id}
                checked={selectedPerfumeIds.has(perfume.id)}
                onChange={() => togglePerfume(perfume.id)}
                className="accent-gold"
              />
              <span className="text-foreground/80">
                {perfume.brand} — {perfume.name}
              </span>
            </label>
          ))}
        </div>
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
            {isDeleting ? "Suppression..." : "Supprimer cet article"}
          </Button>
        )}
      </div>
    </form>
  );
}
