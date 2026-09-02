import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/app-client";

export const Route = createFileRoute("/admin/events/")({
  head: () => ({
    meta: [
      { title: "Manage Events — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: EventsAdminPage,
});

type Row = {
  id: string;
  event_name: string;
  start_at: string;
  end_at: string | null;
  event_type?: string;
  published: boolean;
  location: string | null;
  cover_url: string | null;
};

function EventsAdminPage() {
  const [rows, setRows] = useState<Row[] | null>(null);

  async function load() {
    const { data, error } = await supabase
      .from("sfz_events")
      .select("id,event_name,start_at,end_at,published,location,cover_url")
      .order("start_at", { ascending: false });
    if (error) {
      toast.error(error.message);
      return;
    }
    setRows(data ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function del(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("sfz_events").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Event deleted");
    void load();
  }

  async function togglePublished(row: Row) {
    const { error } = await supabase
      .from("sfz_events")
      .update({ published: !row.published })
      .eq("id", row.id);
    if (error) return toast.error(error.message);
    void load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-2xl font-semibold text-darkGreyBrown">Events</h2>
        <Link
          to="/admin/events/new"
          className="px-4 py-2 rounded-full bg-brown text-white text-sm hover:bg-darkGreyBrown transition"
        >
          + New event
        </Link>
      </div>

      {!rows ? (
        <p className="text-darkGreyBrown/70">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-darkGreyBrown/70">No events yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-darkGreyBrown/15 bg-white">
          <table className="w-full text-sm">
            <thead className="text-left text-darkGreyBrown/70 border-b border-darkGreyBrown/10">
              <tr>
                <th className="px-4 py-3">Cover</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Published</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-darkGreyBrown/5 last:border-0">
                  <td className="px-4 py-3">
                    {r.cover_url ? (
                      <img src={r.cover_url} alt="" className="w-16 h-10 object-cover rounded" />
                    ) : (
                      <div className="w-16 h-10 bg-tan rounded" />
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-darkGreyBrown">{r.event_name}</td>
                  <td className="px-4 py-3 text-darkGreyBrown/80">
                    {new Date(r.start_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 capitalize">
                    {new Date(r.start_at).getTime() < Date.now() ? "past" : "upcoming"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => void togglePublished(r)}
                      className={`px-2 py-1 rounded text-xs ${
                        r.published ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {r.published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                    <Link
                      to="/admin/events/$id"
                      params={{ id: r.id }}
                      className="text-brown hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => void del(r.id, r.event_name)}
                      className="text-red-700 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
