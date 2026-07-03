import { createFileRoute } from "@tanstack/react-router";
import { EventsListPage } from "./allUpcoming-sfz-events";

export const Route = createFileRoute("/allPast-sfz-events")({
  head: () => ({
    meta: [
      { title: "All Past SFZ Events — Oneness Generation" },
      { name: "description", content: "Browse past Stress Free Zone events and workshops." },
      { property: "og:title", content: "All Past SFZ Events — Oneness Generation" },
      { property: "og:description", content: "Browse past Stress Free Zone events and workshops." },
    ],
  }),
  component: () => <EventsListPage type="past" title="Past SFZ Events" />,
});
