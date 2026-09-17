import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LegalPageForm } from "@/components/admin/legal-page-form";

export default async function EditLegalPage({
  params,
}: PageProps<"/admin/legal/[id]">) {
  const { id } = await params;
  const page = await prisma.legalPage.findUnique({ where: { id } });
  if (!page) notFound();

  return (
    <div>
      <h2 className="font-display text-xl text-foreground">{page.title}</h2>
      <div className="mt-6">
        <LegalPageForm
          page={{ id: page.id, title: page.title, content: page.content }}
        />
      </div>
    </div>
  );
}
