import { createFileRoute } from "@tanstack/react-router";
import { ImagePlaceholder } from "@/components/Placeholder";

export const Route = createFileRoute("/summer-camp")({
  head: () => ({
    meta: [
      { title: "Summer Camp — Oneness Generation" },
      { name: "description", content: "A transformative 10-day spiritual summer camp for young minds." },
    ],
  }),
  component: SummerCampPage,
});

function SummerCampPage() {
  return (
    <>
      <section className="relative">
        <ImagePlaceholder label="Summer Camp" aspect="21/9" rounded="rounded-none" />
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="text-sm uppercase tracking-widest text-accent font-semibold mb-3">Summer Camp Events</div>
        <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">Oneness Generation Summer Camp</h1>
        <p className="text-xl text-muted-foreground italic mb-2">Winners do not happen; they are cultivated.</p>
        <p className="text-muted-foreground mb-2">Age Group: 12 to 24 years</p>
        <p className="text-muted-foreground mb-4">
          Oneness Generation presents a transformative 10-day spiritual summer camp tailored for young minds.
        </p>
        <p className="text-muted-foreground">
          OG summer camp sparks growth, fosters connection, and nurtures the mind, heart, and spirit.
        </p>
      </section>

      <section className="bg-secondary/40 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-10">
          <div className="bg-card rounded-2xl p-8 border border-border shadow-card">
            <h2 className="text-2xl font-bold mb-4 text-gradient">This immersive experience weaves together:</h2>
            <ol className="space-y-3 list-decimal list-inside text-muted-foreground">
              <li>Yoga and meditation to calm the mind and awaken the heart</li>
              <li>Spiritual lessons to inspire self-discovery and inner wisdom</li>
              <li>Outdoor activities with Mother Nature and local tribes to foster connection and appreciation</li>
            </ol>
          </div>
          <div className="bg-card rounded-2xl p-8 border border-border shadow-card">
            <h2 className="text-2xl font-bold mb-4 text-gradient">Through this holistic journey, young participants will:</h2>
            <ol className="space-y-3 list-decimal list-inside text-muted-foreground">
              <li>Open their minds and hearts to new perspectives and experiences</li>
              <li>Nurture emotional intelligence and resilience through meditation and mindfulness</li>
              <li>Exercise their brains with engaging activities and challenges</li>
              <li>Cultivate deeper connections with peers and local communities</li>
            </ol>
          </div>
        </div>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mt-10 px-4">
          Join the Oneness Generation community for an unforgettable summer of growth, connection, and inspiration.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-muted-foreground">Currently no Summer Camp Events</h2>
      </section>
    </>
  );
}
