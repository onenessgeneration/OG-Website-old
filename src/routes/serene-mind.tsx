import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { ImagePlaceholder } from "@/components/Placeholder";

export const Route = createFileRoute("/serene-mind")({
  head: () => ({
    meta: [
      { title: "Serene Mind — Oneness Generation" },
      { name: "description", content: "A three-minute meditation to release stress and foster inner harmony." },
    ],
  }),
  component: SereneMindPage,
});

function SereneMindPage() {
  return (
    <>
      <PageHero eyebrow="Practice" title="Serene Mind" subtitle="Achieve instant peace and clarity with the Serene Mind Practice — a three-minute meditation to release stress and foster inner harmony. Find peace in the moment from anywhere." />
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 grid md:grid-cols-2 gap-12 items-start">
        <ImagePlaceholder label="Serene Mind Practice" aspect="3/4" />
        <div className="space-y-5 text-muted-foreground leading-relaxed">
          <h2 className="text-3xl md:text-4xl font-bold text-gradient">The Serene Mind Practice: A Path to Cultivate Peace Within</h2>
          <p>
            The Serene Mind Practice is a transformative meditation designed by Sri Preethaji, co-founder of The Oneness Movement, to help individuals shift from inner disturbance to a state of peace and clarity. This simple yet powerful practice offers a profound way to step out of mental chaos and suffering in just three minutes, bringing you back to balance and harmony.
          </p>
          <p>
            When individuals are trapped in disturbed states, they spread that suffering into their families, workplaces, and communities. These inner disturbances are often at the root of the world's problems. The Serene Mind Practice is a solution—to step out of this cycle of suffering and stress.
          </p>
          <p>
            When regularly practiced, the Serene Mind empowers you to make conscious decisions with clarity, rather than being driven by emotional turmoil or stress. It cultivates a sense of calm and focus, allowing one to emerge stronger, more self-aware, and capable of navigating challenges with greater wisdom and confidence.
          </p>
          <p>
            The practice is quick, but its effects are lasting, making it an essential tool for anyone seeking personal peace and collective transformation.
          </p>
        </div>
      </section>
    </>
  );
}
