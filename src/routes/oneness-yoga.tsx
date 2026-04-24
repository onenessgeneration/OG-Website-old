import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { ImagePlaceholder } from "@/components/Placeholder";

export const Route = createFileRoute("/oneness-yoga")({
  head: () => ({
    meta: [
      { title: "Oneness Yoga — Oneness Generation" },
      { name: "description", content: "Awaken to body bliss with Oneness Yoga." },
    ],
  }),
  component: OnenessYogaPage,
});

const benefits = [
  ["Build strength & stability", "Feel more grounded on your mat and in life."],
  ["Boost energy", "Bring vitality into every move and every day."],
  ["Release stress", "Melt away tension and invite relaxation."],
  ["Embrace love & care", "Cultivate love and care for your body."],
  ["Stay mindful", "Experience awareness through movement and stillness."],
  ["Live in oneness", "Connect deeply with your body, consciousness, and everything around you."],
];

function OnenessYogaPage() {
  return (
    <>
      <PageHero eyebrow="Yoga" title="Oneness Yoga" subtitle="Awaken to body bliss with Oneness Yoga — a harmonious blend of movement and mindfulness, perfect for cultivating strength, energy, and inner calm." />
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
        <ImagePlaceholder label="Oneness Yoga" aspect="4/3" />
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">Discover Oneness Yoga: Unlock Your Body Bliss</h2>
          <p className="text-muted-foreground mb-4">
            Oneness Yoga is more than just a practice—it's a journey into the mystique of your body and consciousness. Created by Sri Preethaji, inspired by the ancient Himalayan Yogis' quest for enlightenment, Oneness Yoga blends the timeless wisdom of yoga with a modern approach to vitality and connection.
          </p>
          <p className="text-muted-foreground">
            This unique experience helps you awaken to the magic of your body, cultivating balance, energy, and a deep sense of inner peace. Whether you're seeking health, relaxation, or simply a way to feel more present, Oneness Yoga guides you toward a state of harmony between body and mind.
          </p>
        </div>
      </section>

      <section className="bg-secondary/40 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-3 text-gradient">What makes it even more exciting?</h2>
          <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-10">
            Oneness Yoga can be practiced anywhere! Join in from the comfort of your home or as part of a community, making it accessible to individuals, families, and groups—whether in schools, workspaces, or organizations.
          </p>
          <h3 className="text-2xl font-bold text-center mb-8">Why Oneness Yoga?</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map(([title, body]) => (
              <div key={title} className="bg-card rounded-2xl p-6 border border-border shadow-card">
                <div className="w-12 h-12 rounded-full bg-hero-gradient flex items-center justify-center text-primary-foreground mb-4">✦</div>
                <h4 className="font-bold mb-2">{title}</h4>
                <p className="text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-muted-foreground mt-10 max-w-3xl mx-auto">
            Oneness Yoga is for everyone, whether you're an experienced yogi, a seasonal enthusiast, or a complete beginner. Ready to unlock your body bliss?
          </p>
        </div>
      </section>
    </>
  );
}
