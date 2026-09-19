import { GuideTipForm } from "@/components/admin/guide-tip-form";

export default function NewGuideTipPage() {
  return (
    <div>
      <h2 className="font-display text-xl text-foreground">Nouveau conseil</h2>
      <div className="mt-6">
        <GuideTipForm mode="create" />
      </div>
    </div>
  );
}
