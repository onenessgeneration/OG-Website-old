import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/app-client";
import { uploadEventCover } from "@/lib/eventMedia";

export type EventFormValues = {
  id?: string;
  event_name: string;
  event_short_description: string;
  cover_url: string;
  location: string;
  location_type: string;
  start_at: string; // datetime-local
  end_at: string; // datetime-local
  published: boolean;
};

export const emptyEvent: EventFormValues = {
  event_name: "",
  event_short_description: "",
  cover_url: "",
  location: "",
  location_type: "",
  start_at: "",
  end_at: "",
  published: true,
};

function toLocalInput(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function rowToForm(r: Record<string, unknown>): EventFormValues {
  return {
    id: r.id as string,
    event_name: (r.event_name as string) ?? "",
    event_short_description: (r.event_short_description as string) ?? "",
    cover_url: (r.cover_url as string) ?? "",
    location: (r.location as string) ?? "",
    location_type: (r.location_type as string) ?? "",
    start_at: toLocalInput(r.start_at as string),
    end_at: toLocalInput(r.end_at as string | null),
    published: (r.published as boolean) ?? true,
  };
}

// remove marker

export function EventForm({ initial }: { initial: EventFormValues }) {
  const [v, setV] = useState<EventFormValues>(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  function set<K extends keyof EventFormValues>(k: K, val: EventFormValues[K]) {
    setV((prev) => ({ ...prev, [k]: val }));
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadEventCover(file);
      set("cover_url", url);
      toast.success("Cover uploaded");
    } catch (err) {
      toast.error((err as Error).message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!v.event_name.trim() || !v.start_at) {
      toast.error("Name and start date are required");
      return;
    }
    setSaving(true);
    const startIso = new Date(v.start_at).toISOString();
    const payload = {
      event_name: v.event_name.trim(),
      event_short_description: v.event_short_description.trim() || null,
      cover_url: v.cover_url.trim() || null,
      location: v.location.trim() || null,
      location_type: v.location_type.trim() || null,
      start_at: startIso,
      end_at: v.end_at ? new Date(v.end_at).toISOString() : null,
      published: v.published,
    };
    const q = v.id
      ? supabase.from("sfz_events").update(payload).eq("id", v.id)
      : supabase.from("sfz_events").insert(payload);
    const { error } = await q;
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(v.id ? "Event updated" : "Event created");
    navigate({ to: "/admin/events" });
  }

  const label = "block text-sm font-medium text-darkGreyBrown mb-1";
  const input =
    "w-full rounded-lg border border-darkGreyBrown/20 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brown/40";

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-2xl bg-white border border-darkGreyBrown/15 p-6">
      <div>
        <label className={label}>Event name *</label>
        <input className={input} value={v.event_name} onChange={(e) => set("event_name", e.target.value)} required maxLength={200} />
      </div>

      <div>
        <label className={label}>Short description</label>
        <textarea
          className={input}
          rows={3}
          value={v.event_short_description}
          onChange={(e) => set("event_short_description", e.target.value)}
          maxLength={500}
        />
      </div>

      <div>
        <label className={label}>Cover image</label>
        <div className="flex items-start gap-4 flex-wrap">
          {v.cover_url ? (
            <img src={v.cover_url} alt="Cover" className="w-40 h-28 object-cover rounded-lg border border-darkGreyBrown/10" />
          ) : (
            <div className="w-40 h-28 rounded-lg border-2 border-dashed border-darkGreyBrown/25 bg-tan/40 flex items-center justify-center text-xs text-darkGreyBrown/60 text-center px-2">
              No cover yet
            </div>
          )}
          <div className="space-y-2">
            <label
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brown text-brown hover:bg-brown hover:text-white transition cursor-pointer text-sm font-medium ${
                uploading ? "opacity-60 pointer-events-none" : ""
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span>{uploading ? "Uploading…" : v.cover_url ? "Replace image" : "Upload image"}</span>
              <input type="file" accept="image/*" onChange={onFile} disabled={uploading} className="sr-only" />
            </label>
            <p className="text-xs text-darkGreyBrown/60">PNG, JPG or WEBP. Recommended 1600×900.</p>
            {v.cover_url && (
              <button
                type="button"
                onClick={() => set("cover_url", "")}
                className="block text-sm text-red-700 hover:underline"
              >
                Remove cover
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>Start *</label>
          <input type="datetime-local" className={input} value={v.start_at} onChange={(e) => set("start_at", e.target.value)} required />
        </div>
        <div>
          <label className={label}>End</label>
          <input type="datetime-local" className={input} value={v.end_at} onChange={(e) => set("end_at", e.target.value)} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>Location</label>
          <input className={input} value={v.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Mumbai, IN" />
        </div>
        <div>
          <label className={label}>Location type</label>
          <input className={input} value={v.location_type} onChange={(e) => set("location_type", e.target.value)} placeholder="e.g. In person / Online" />
        </div>
      </div>

      <div>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={v.published}
            onChange={(e) => set("published", e.target.checked)}
          />
          <span className="text-sm">Published (visible on site)</span>
        </label>
        <p className="text-xs text-darkGreyBrown/60 mt-2">
          Upcoming vs. past is determined automatically based on the start date.
        </p>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving || uploading}
          className="px-6 py-2 rounded-full bg-brown text-white hover:bg-darkGreyBrown transition disabled:opacity-60"
        >
          {saving ? "Saving…" : v.id ? "Save changes" : "Create event"}
        </button>
      </div>
    </form>
  );
}
