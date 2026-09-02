import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/app-client";
import { EventForm, rowToForm, type EventFormValues } from "@/components/admin/EventForm";

export const Route = createFileRoute("/admin/events/$id")({
  head: () => ({
    meta: [
      { title: "Edit event — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: EditEventPage,
});

function EditEventPage() {
  const { id } = Route.useParams();
  const [initial, setInitial] = useState<EventFormValues | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let alive = true;
    supabase
      .from("sfz_events")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!alive) return;
        if (error) {
          toast.error(error.message);
          setNotFound(true);
          return;
        }
        if (!data) {
          setNotFound(true);
          return;
        }
        setInitial(rowToForm(data as Record<string, unknown>));
      });
    return () => {
      alive = false;
    };
  }, [id]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-darkGreyBrown">Edit event</h2>
        <Link to="/admin/events" className="text-sm text-brown hover:underline">
          ← Back
        </Link>
      </div>
      {notFound ? (
        <p className="text-darkGreyBrown/70">Event not found.</p>
      ) : !initial ? (
        <p className="text-darkGreyBrown/70">Loading…</p>
      ) : (
        <EventForm initial={initial} />
      )}
    </div>
  );
}
