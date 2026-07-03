import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { EventCard, type SfzEvent } from "@/components/sfz/EventCard";
import { getAllSfzEvents } from "@/lib/sfz.functions";

export const Route = createFileRoute("/allUpcoming-sfz-events")({
  head: () => ({
    meta: [
      { title: "All Upcoming SFZ Events — Oneness Generation" },
      { name: "description", content: "Browse all upcoming Stress Free Zone events and workshops." },
      { property: "og:title", content: "All Upcoming SFZ Events — Oneness Generation" },
      { property: "og:description", content: "Browse all upcoming Stress Free Zone events and workshops." },
    ],
  }),
  component: AllUpcomingPage,
});

function AllUpcomingPage() {
  return <EventsListPage type="upcoming" title="Upcoming SFZ Events" />;
}

export function EventsListPage({ type, title }: { type: "upcoming" | "past"; title: string }) {
  const [events, setEvents] = useState<SfzEvent[]>([]);
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState<"all" | "in_person" | "online">("all");

  useEffect(() => {
    let alive = true;
    getAllSfzEvents({ data: { type } })
      .then((rows) => alive && setEvents(rows as SfzEvent[]))
      .catch(() => alive && setEvents([]));
    return () => {
      alive = false;
    };
  }, [type]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return events.filter((e) => {
      if (loc !== "all" && (e.location_type ?? "") !== loc) return false;
      if (!needle) return true;
      return (
        e.event_name.toLowerCase().includes(needle) ||
        (e.location ?? "").toLowerCase().includes(needle) ||
        (e.event_short_description ?? "").toLowerCase().includes(needle)
      );
    });
  }, [events, q, loc]);

  return (
    <>
      <PageHero title={title} subtitle="Search and filter to find the session that fits you." />
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, location, or keyword..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-brown/40"
              />
            </div>
            <select
              value={loc}
              onChange={(e) => setLoc(e.target.value as typeof loc)}
              className="px-4 py-3 rounded-full border border-border bg-white focus:outline-none focus:ring-2 focus:ring-brown/40"
            >
              <option value="all">All locations</option>
              <option value="in_person">In-person</option>
              <option value="online">Online</option>
            </select>
          </div>
          {filtered.length === 0 ? (
            <p className="text-center text-brown py-16">No events match your search.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((e) => (
                <EventCard key={e.id} e={e} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
