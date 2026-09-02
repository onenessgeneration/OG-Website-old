import { createFileRoute, Link } from "@tanstack/react-router";
import { EventForm, emptyEvent } from "@/components/admin/EventForm";

export const Route = createFileRoute("/admin/events/new")({
  head: () => ({
    meta: [
      { title: "New event — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: NewEventPage,
});

function NewEventPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-darkGreyBrown">New event</h2>
        <Link to="/admin/events" className="text-sm text-brown hover:underline">
          ← Back
        </Link>
      </div>
      <EventForm initial={emptyEvent} />
    </div>
  );
}
