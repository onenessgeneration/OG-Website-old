import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { ImagePlaceholder } from "@/components/Placeholder";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Programs — Oneness Generation" },
      { name: "description", content: "Explore programs and events from Oneness Generation." },
    ],
  }),
  component: ProgramsPage,
});

const events = [
  { title: "Oneness Youth Festival", body: "Unlock your Super Brain, Super Body, and Super Heart and experience a brand new state of being.", to: "/programs" as const },
  { title: "Get trained in SFZ", body: "Become a beacon of calm and joy—lead the way to a stress-free life as an SFZ Trainer.", to: "/sfz" as const },
  { title: "SKY (monthly)", body: "Learn the wisdom from Sri Krishnaji to transform every area of your life.", to: "/programs" as const },
  { title: "Breakthrough", body: "Breakthrough the Limits — unlock your true potential and step into a life of limitless possibilities.", to: "/programs" as const },
  { title: "Summer Camp", body: "A transformative 10-day spiritual summer camp tailored for young minds.", to: "/summer-camp" as const },
  { title: "Soul Sync", body: "From Beta to Alpha — experience the beautiful state with this 9-12 minute meditation.", to: "/soul-sync" as const },
];

function ProgramsPage() {
  return (
    <>
      <PageHero eyebrow="Programs" title="Programs & Events" subtitle="Find the experience that calls to you." />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((e) => (
            <Link key={e.title} to={e.to} className="block bg-card rounded-2xl overflow-hidden shadow-card border border-border hover:shadow-soft transition">
              <ImagePlaceholder label={e.title} aspect="16/9" rounded="rounded-none" />
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">{e.title}</h3>
                <p className="text-sm text-muted-foreground">{e.body}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
