import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { ImagePlaceholder } from "@/components/Placeholder";

export const Route = createFileRoute("/about-us")({
  head: () => ({
    meta: [
      { title: "About Us — Oneness Generation" },
      { name: "description", content: "A movement, a generation of young people moving towards Oneness." },
    ],
  }),
  component: AboutPage,
});

const sections = [
  {
    title: "Who We Are",
    eyebrow: "The Oneness Generation",
    body: "Oneness Generation is founded by Sri Preethaji and Sri Krishnaji, enlightened leaders, and co-creators of the Oneness Movement. Oneness Generation is a non-profit initiative of Oneness, driven by volunteers. We are a community of young people who share a common passion - to live a life of connection, joy, and wholeness. We're a movement for anyone who's ready to shift out of stress and live life deeply.",
  },
  {
    title: "Vision",
    eyebrow: "Empowering Young Minds",
    body: "Empowering young people to break free of stress and find a calm, centered state of mind. We are a community of youth who work together to become free of the shackles of everyday stress and shift from a distressed beta state of mind (cause who likes that!) to a calm and centered alpha state. Our mission is to make stress-free living a reality for young people.",
  },
  {
    title: "The Magic Switch: Beta to Alpha",
    eyebrow: "Transform Your State of Mind",
    body: "The beta brain wave state is where most of us spend much of our time. In beta, the brain operates at a fast frequency—13 to 30 Hz—and the mind becomes like a 'monkey mind': anxious, constantly swinging from one thought to another, distracted by every worry, task, or notification. Just like a monkey leaping from branch to branch, the mind in beta doesn't rest; it keeps moving, searching for something new. Through Oneness practices, we learn to gently shift into the alpha state — calm, centered, and present.",
  },
  {
    title: "Oneness",
    eyebrow: "Guided by Wisdom",
    body: "To fulfil our vision, we seek guidance, spiritual wisdom, and insights from the Oneness movement. Oneness is a global movement in consciousness, founded by Sri Preethaji and Sri Krishnaji, with a presence in over 100 countries. This transformative spiritual movement has guided millions towards profound healing, a direct experience of their inner divinity, and the manifestation of awe-inspiring miracles in their lives.",
  },
];

function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About Us" title="A Movement Towards Oneness" subtitle="A generation of young people moving towards Oneness." />
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 space-y-20">
        {sections.map((s, i) => (
          <div key={s.title} className={`grid md:grid-cols-2 gap-10 items-center ${i % 2 === 1 ? "md:[direction:rtl]" : ""}`}>
            <div className="md:[direction:ltr]">
              <ImagePlaceholder label={s.title} aspect="4/3" />
            </div>
            <div className="md:[direction:ltr]">
              <div className="text-sm uppercase tracking-widest text-accent font-semibold mb-2">{s.eyebrow}</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">{s.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{s.body}</p>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
