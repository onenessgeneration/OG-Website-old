import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/app-client";
import { uploadTestimonialImage, type Testimonial } from "@/lib/people";
import { MAX_UPLOAD_LABEL } from "@/lib/siteMedia";

export const Route = createFileRoute("/admin/testimonials")({
  head: () => ({
    meta: [
      { title: "Testimonials — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: TestimonialsAdminPage,
});

type FormState = {
  id?: string;
  participant: string;
  location: string;
  tag: string;
  actual_testimonial: string;
  quote: string;
  image_url: string;
  visible: boolean;
  sort_order: number;
};

const emptyForm: FormState = {
  participant: "",
  location: "",
  tag: "Testimonial",
  actual_testimonial: "",
  quote: "",
  image_url: "",
  visible: true,
  sort_order: 0,
};

function TestimonialsAdminPage() {
  const [rows, setRows] = useState<Testimonial[] | null>(null);
  const [editing, setEditing] = useState<FormState | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) return toast.error(error.message);
    setRows((data ?? []) as Testimonial[]);
  }
  useEffect(() => {
    void load();
  }, []);

  async function toggleVisible(row: Testimonial) {
    const { error } = await supabase
      .from("testimonials")
      .update({ visible: !row.visible })
      .eq("id", row.id);
    if (error) return toast.error(error.message);
    void load();
  }

  async function del(row: Testimonial) {
    if (!confirm(`Delete testimonial from "${row.participant}"?`)) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", row.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    void load();
  }

  async function save() {
    if (!editing) return;
    if (!editing.participant.trim() || !editing.actual_testimonial.trim()) {
      return toast.error("Name and testimonial are required");
    }
    setBusy(true);
    const payload = {
      participant: editing.participant.trim(),
      location: editing.location.trim() || null,
      tag: editing.tag.trim() || "Testimonial",
      actual_testimonial: editing.actual_testimonial.trim(),
      quote: editing.quote.trim() || null,
      image_url: editing.image_url.trim() || null,
      visible: editing.visible,
      sort_order: Number(editing.sort_order) || 0,
    };
    const q = editing.id
      ? supabase.from("testimonials").update(payload).eq("id", editing.id)
      : supabase.from("testimonials").insert(payload);
    const { error } = await q;
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(editing.id ? "Updated" : "Created");
    setEditing(null);
    void load();
  }

  async function pickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setBusy(true);
    try {
      const url = await uploadTestimonialImage(file);
      setEditing({ ...editing, image_url: url });
      toast.success("Image uploaded");
    } catch (err) {
      toast.error((err as Error).message || "Upload failed");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-semibold text-darkGreyBrown">Testimonials</h2>
          <p className="text-sm text-darkGreyBrown/70">
            Shown in the "What Our Awesome Participants Say" slider on the home page.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin" className="text-sm text-brown hover:underline self-center">← Back</Link>
          <button
            type="button"
            onClick={() => setEditing({ ...emptyForm })}
            className="px-4 py-2 rounded-full bg-brown text-white text-sm hover:bg-darkGreyBrown transition"
          >
            + New testimonial
          </button>
        </div>
      </div>

      {editing && (
        <div className="rounded-2xl border border-darkGreyBrown/15 bg-white p-5 space-y-3">
          <h3 className="font-semibold text-darkGreyBrown">
            {editing.id ? "Edit testimonial" : "New testimonial"}
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs text-darkGreyBrown/70">Participant name *</span>
              <input
                className="mt-1 w-full border border-darkGreyBrown/20 rounded px-3 py-2 text-sm"
                value={editing.participant}
                onChange={(e) => setEditing({ ...editing, participant: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="text-xs text-darkGreyBrown/70">Location</span>
              <input
                className="mt-1 w-full border border-darkGreyBrown/20 rounded px-3 py-2 text-sm"
                value={editing.location}
                onChange={(e) => setEditing({ ...editing, location: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="text-xs text-darkGreyBrown/70">Tag</span>
              <input
                className="mt-1 w-full border border-darkGreyBrown/20 rounded px-3 py-2 text-sm"
                value={editing.tag}
                onChange={(e) => setEditing({ ...editing, tag: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="text-xs text-darkGreyBrown/70">Sort order (lower shows first)</span>
              <input
                type="number"
                className="mt-1 w-full border border-darkGreyBrown/20 rounded px-3 py-2 text-sm"
                value={editing.sort_order}
                onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })}
              />
            </label>
          </div>
          <label className="block">
            <span className="text-xs text-darkGreyBrown/70">Testimonial *</span>
            <textarea
              rows={5}
              className="mt-1 w-full border border-darkGreyBrown/20 rounded px-3 py-2 text-sm"
              value={editing.actual_testimonial}
              onChange={(e) => setEditing({ ...editing, actual_testimonial: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="text-xs text-darkGreyBrown/70">Short quote</span>
            <textarea
              rows={2}
              className="mt-1 w-full border border-darkGreyBrown/20 rounded px-3 py-2 text-sm"
              value={editing.quote}
              onChange={(e) => setEditing({ ...editing, quote: e.target.value })}
            />
          </label>

          <div className="flex items-start gap-4 flex-wrap">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-tan flex items-center justify-center border border-darkGreyBrown/20">
              {editing.image_url ? (
                <img src={editing.image_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[10px] text-darkGreyBrown/50 text-center px-1">No photo</span>
              )}
            </div>
            <div className="space-y-2">
              <label className="inline-block px-3 py-1.5 rounded-full border border-brown text-brown hover:bg-brown hover:text-white transition cursor-pointer text-xs">
                {editing.image_url ? "Replace photo" : "Upload photo"}
                <input type="file" accept="image/*" onChange={pickImage} className="sr-only" />
              </label>
              <p className="text-[11px] text-darkGreyBrown/50">Max {MAX_UPLOAD_LABEL}</p>
              {editing.image_url && (
                <button
                  type="button"
                  onClick={() => setEditing({ ...editing, image_url: "" })}
                  className="block text-xs text-red-700 hover:underline"
                >
                  Remove photo
                </button>
              )}
            </div>
            <label className="flex items-center gap-2 text-sm ml-auto self-center">
              <input
                type="checkbox"
                checked={editing.visible}
                onChange={(e) => setEditing({ ...editing, visible: e.target.checked })}
              />
              Visible on site
            </label>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => void save()}
              className="px-4 py-2 rounded-full bg-brown text-white text-sm hover:bg-darkGreyBrown transition disabled:opacity-60"
            >
              {busy ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="px-4 py-2 rounded-full border border-darkGreyBrown/25 text-darkGreyBrown text-sm hover:bg-tan transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {!rows ? (
        <p className="text-darkGreyBrown/70">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-darkGreyBrown/70">No testimonials yet.</p>
      ) : (
        <div className="grid gap-3">
          {rows.map((r) => (
            <div key={r.id} className="rounded-2xl border border-darkGreyBrown/15 bg-white p-4 flex gap-4 items-start">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-tan shrink-0">
                {r.image_url ? (
                  <img src={r.image_url} alt="" className="w-full h-full object-cover" />
                ) : null}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-darkGreyBrown">{r.participant}</h3>
                  {r.location && <span className="text-xs text-darkGreyBrown/60">({r.location})</span>}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${r.visible ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"}`}>
                    {r.visible ? "visible" : "hidden"}
                  </span>
                </div>
                <p className="text-sm text-darkGreyBrown/80 mt-1 line-clamp-2">{r.actual_testimonial}</p>
              </div>
              <div className="flex flex-col gap-1 text-sm shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    setEditing({
                      id: r.id,
                      participant: r.participant,
                      location: r.location ?? "",
                      tag: r.tag ?? "Testimonial",
                      actual_testimonial: r.actual_testimonial,
                      quote: r.quote ?? "",
                      image_url: r.image_url ?? "",
                      visible: r.visible,
                      sort_order: r.sort_order,
                    })
                  }
                  className="px-3 py-1 rounded-full border border-darkGreyBrown/25 text-darkGreyBrown hover:bg-tan transition text-xs"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => void toggleVisible(r)}
                  className="px-3 py-1 rounded-full border border-darkGreyBrown/25 text-darkGreyBrown hover:bg-tan transition text-xs"
                >
                  {r.visible ? "Hide" : "Unhide"}
                </button>
                <button
                  type="button"
                  onClick={() => void del(r)}
                  className="px-3 py-1 rounded-full text-red-700 hover:underline text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
