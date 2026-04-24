interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

export function PageHero({ eyebrow, title, subtitle }: Props) {
  return (
    <section className="bg-soft-gradient border-b border-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-24 text-center">
        {eyebrow && <div className="text-sm uppercase tracking-widest text-accent font-semibold mb-3">{eyebrow}</div>}
        <h1 className="text-4xl md:text-6xl font-bold text-gradient">{title}</h1>
        {subtitle && <p className="mt-5 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>}
      </div>
    </section>
  );
}
