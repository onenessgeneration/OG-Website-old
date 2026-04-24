import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { ImagePlaceholder } from "@/components/Placeholder";

export const Route = createFileRoute("/sfz")({
  head: () => ({
    meta: [
      { title: "Stress Free Zone (SFZ) — Oneness Generation" },
      { name: "description", content: "Master your state, master your life with the SFZ program." },
    ],
  }),
  component: SfzPage,
});

const benefits = [
  { title: "Long-term solution for unwanted emotions", body: "Learn how to use awareness to dissolve unwanted emotions, instead of running away from them or hyping yourself up." },
  { title: "Self-love", body: "Build a deep, lasting relationship with yourself rooted in awareness and acceptance." },
  { title: "Uncover the secrets of focus", body: "In a truly stress-free state there's focus. Focus brings you productivity. Master your state, master your life." },
];

const modules = [
  { n: 1, title: "Nurturing a Healthy Brain", body: "In today's fast-paced world, achieving more in less time requires a brain that operates on intelligence, creativity, and efficiency. Explore the 5 distinct states of the brain. Practice techniques to shift brain functions and transform life experiences.", tools: "Oneness Yoga · Discussions · Soul Sync Meditation" },
  { n: 2, title: "An Attentive Mind", body: "Gain deep insight into the mind and learn how to cultivate attention and focus. Understand the two core states of human experience. Learn to live from a beautiful state and respond to life with clarity.", tools: "Oneness Yoga · Interactions and Challenge · Soul Sync Meditation" },
  { n: 3, title: "Being Yourself", body: "Discover how internal freedom empowers you to express your true self. Build the confidence to make informed decisions and choices. Learn to distinguish between right and wrong with clarity.", tools: "Oneness Yoga · Interactions and experiences · Special Meditation" },
  { n: 4, title: "Power over Anger", body: "Explore the nature of anger and its three distinct forms. Learn how anger affects the mind and body. Discover the pathway to liberate yourself from the hold of anger.", tools: "Oneness Yoga · Group Exercise · Soul Sync Meditation" },
  { n: 5, title: "Relieving Anxiety", body: "Gain the wisdom to not just survive but thrive, free from stress and anxiety. Learn the key differences between problems and suffering. Discover how to overcome stress and anxiety.", tools: "Oneness Yoga · Reflection Practice · Serene Mind Meditation" },
  { n: 6, title: "Calming Stress", body: "Dive deep into the nature of stress and its pre, post, and re-immersion phases. Connect with the universe's greater intelligence to detoxify stress.", tools: "Oneness Yoga · Interactions · Reflective Meditation" },
];

const team = [
  ["Leon", "Munich, Germany"], ["Jake Wilson", "Ottawa, Canada"], ["Christoph Uhl", "Seattle, WA, USA"],
  ["Pooja Jain", "Mumbai, India"], ["Mahima Akula", "Toronto, Canada"], ["Laxmi Prasad", "Visakhapatnam, India"],
  ["Tasha", "Ahmedabad, India"],
];

function SfzPage() {
  return (
    <>
      <PageHero eyebrow="Program" title="The Stress Free Zone" subtitle="Master Your State, Master Your Life" />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <ImagePlaceholder label="SFZ Program" aspect="4/3" />
        <div className="space-y-4 text-muted-foreground">
          <p>
            Why do you think stress persists? It's because somewhere in our brains we hold the belief that it's necessary or helpful to us. Otherwise, wouldn't you interrupt your stressful thoughts?
          </p>
          <p>
            The Stress Free Zone (SFZ) program teaches participants to identify and challenge these beliefs, revealing the unnecessary and counterproductive nature of stress. Paired with a simple 10-minute meditation practice, it equips individuals to shift into a calm, beautiful state with tremendous focus, clarity and capacity to enjoy life - at will!
          </p>
        </div>
      </section>

      <section className="bg-secondary/40 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gradient">Why Choose SFZ?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="bg-card rounded-2xl p-6 border border-border shadow-card">
                <div className="w-12 h-12 rounded-full bg-hero-gradient flex items-center justify-center text-primary-foreground mb-4">✦</div>
                <h3 className="font-bold mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gradient">Who can benefit?</h2>
        <p className="text-center text-muted-foreground max-w-3xl mx-auto">
          SFZ would benefit absolutely everyone, but it's specifically helpful for people who actually want to work on themselves and their inner conflicts. If you have a hard time being your authentic self around others, loving yourself, or stress about work, this course is for you.
        </p>
      </section>

      <section className="bg-soft-gradient py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-2 text-gradient">Program Structure</h2>
          <p className="text-center text-muted-foreground mb-12">SFZ contains six 50-minute modules</p>
          <div className="grid md:grid-cols-2 gap-6">
            {modules.map((m) => (
              <div key={m.n} className="bg-card rounded-2xl p-6 border border-border shadow-card">
                <div className="text-accent font-bold mb-1">Module {m.n}</div>
                <h3 className="text-xl font-bold mb-2">{m.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{m.body}</p>
                <p className="text-xs text-primary font-medium">— {m.tools}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 grid md:grid-cols-3 gap-6">
        {[
          { title: "Tools Used", body: "Breathing and meditation practices, wisdom bites, guided reflections, light yoga, group discussions." },
          { title: "What Are The Outcomes?", body: "By the end, you will easily recognize stress and be able to shift into a state of calm and focus. Remember: when you master your state, you master your life." },
          { title: "Your Teacher", body: "SFZ is taught by Oneness Generation, a group of young life-lovers with the goal of helping people reduce stress and enjoy life. The program was created with help from monks at 'Oneness' — a global spiritual movement that teaches ordinary people enlightenment." },
        ].map((c) => (
          <div key={c.title} className="bg-card rounded-2xl p-6 border border-border shadow-card">
            <h3 className="font-bold text-xl mb-3 text-gradient">{c.title}</h3>
            <p className="text-sm text-muted-foreground">{c.body}</p>
          </div>
        ))}
      </section>

      <section className="bg-secondary/40 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gradient">Our Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
            {team.map(([name, place]) => (
              <div key={name} className="text-center">
                <ImagePlaceholder label={name} aspect="1/1" rounded="rounded-full" className="mb-3" />
                <h3 className="font-bold text-sm">{name}</h3>
                <p className="text-xs text-muted-foreground">{place}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
