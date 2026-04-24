import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { ImagePlaceholder } from "@/components/Placeholder";

export const Route = createFileRoute("/soul-sync")({
  head: () => ({
    meta: [
      { title: "Soul Sync — Oneness Generation" },
      { name: "description", content: "The science and ancient wisdom of Soul Sync — a transformative meditation." },
    ],
  }),
  component: SoulSyncPage,
});

const pillars = [
  { title: "Mudra", subtitle: "Hand Pose", body: "The different touches of our hand in soul sync while counting breaths. Performing them stimulates specific areas of the brain, leading to changes in our mood and consciousness." },
  { title: "Mantra", subtitle: "Chant", body: "Chants in meditation. Everything in the universe vibrates at a frequency. When we chant a mantra, we produce sound waves that can influence cellular processes, reduce stress, and enhance relaxation." },
  { title: "Asana", subtitle: "Posture", body: "Just as mental state impacts physical state, physical state too impacts mental state. Asana refers to postures that can improve brain state. They reduce anxiety and stress, and enhance mindfulness and emotional well-being." },
  { title: "Pranayama", subtitle: "Regulation of Breath", body: "Pranayama is the art and practice of regulating the flow of oxygen and blood through your body. Breathing in the right ways can improve oxygenation of blood and clear out toxins." },
  { title: "Dharana", subtitle: "Embody", body: "Dharana refers to focused concentration on a single point or object. Benefits include enhanced mental clarity, improved focus, reduced stress, and fostered emotional balance." },
  { title: "Bhavana", subtitle: "Visualization", body: "Bhavana, or visualization, uses mental imagery to shape thoughts and intentions. It boosts positive emotions, enhances focus, strengthens creativity, and helps manifest desires." },
];

function SoulSyncPage() {
  return (
    <>
      <PageHero eyebrow="Meditation" title="Science and Ancient Wisdom of Soul Sync" />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((p) => (
            <div key={p.title} className="bg-card rounded-2xl overflow-hidden shadow-card border border-border">
              <ImagePlaceholder label={p.title} aspect="4/3" rounded="rounded-none" />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gradient">{p.title}</h3>
                <div className="text-sm text-accent font-semibold mb-3">{p.subtitle}</div>
                <p className="text-sm text-muted-foreground">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-soft-gradient py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-10 items-center">
          <ImagePlaceholder label="Soul Sync" aspect="4/5" />
          <div>
            <div className="text-sm uppercase tracking-widest text-accent font-semibold mb-2">Soul Sync</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">From Beta to Alpha: Experience the Beautiful State</h2>
            <p className="text-muted-foreground mb-4">
              Unlock inner peace and creativity with Soul Sync, a transformative meditation designed to calm your mind and open your consciousness in just minutes.
            </p>
            <p className="text-muted-foreground mb-4">
              Soul Sync, created by Sri Preethaji, is a 9–12 minute meditation designed to calm your mind, expand awareness, and manifest heartfelt intentions. This transformative practice blends ancient wisdom with modern neuroscience to create a powerful shift from mental chaos to clarity and purpose.
            </p>
            <p className="text-muted-foreground mb-4">
              The six-step process aligns your breath, mind, and heart, guiding you from a restless beta state to a calm, creative alpha state.
            </p>
            <p className="text-muted-foreground">
              Whether practiced solo or in a group, this meditation is a gateway to effortless living, connecting you deeply with life and setting you on a path of clarity, grace, and purpose.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
