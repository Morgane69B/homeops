export function ComingSoon({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="text-xs tracking-[0.3em] text-muted-foreground uppercase">
        {eyebrow}
      </span>
      <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
        {title}
      </h1>
      <p className="max-w-md text-muted-foreground">{description}</p>
    </section>
  );
}
