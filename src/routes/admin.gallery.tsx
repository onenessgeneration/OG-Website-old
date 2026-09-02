import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase as typedSupabase } from "@/integrations/supabase/app-client";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase = typedSupabase as any;
import {
  fetchAllGallery,
  uploadGalleryImage,
  deleteGalleryStorage,
  type GalleryItem,
} from "@/lib/gallery";
import { MAX_UPLOAD_LABEL } from "@/lib/siteMedia";

export const Route = createFileRoute("/admin/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: GalleryAdminPage,
});

type FormState = {
  id?: string;
  title: string;
  category: string;
  image_url: string;
  storage_path: string | null;
  visible: boolean;
  sort_order: number;
};

const emptyForm: FormState = {
  title: "",
  category: "",
  image_url: "",
  storage_path: null,
  visible: true,
  sort_order: 0,
};

function GalleryAdminPage() {
  const [rows, setRows] = useState<GalleryItem[] | null>(null);
  const [editing, setEditing] = useState<FormState | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      setRows(await fetchAllGallery());
    } catch (e) {
      toast.error((e as Error).message);
    }
  }
  useEffect(() => {
    void load();
  }, []);

  async function toggleVisible(row: GalleryItem) {
    const { error } = await supabase
      .from("gallery_items")
      .update({ visible: !row.visible })
      .eq("id", row.id);
    if (error) return toast.error(error.message);
    void load();
  }

  async function del(row: GalleryItem) {
    if (!confirm(`Delete "${row.title ?? "photo"}"? This also removes the file from storage.`)) return;
    const { error } = await supabase.from("gallery_items").delete().eq("id", row.id);
    if (error) return toast.error(error.message);
    await deleteGalleryStorage(row.storage_path);
    toast.success("Deleted");
    void load();
  }

  async function save() {
    if (!editing) return;
    if (!editing.image_url) return toast.error("Please upload an image first");
    setBusy(true);
    const payload = {
      title: editing.title.trim() || null,
      category: editing.category.trim() || null,
      image_url: editing.image_url,
      storage_path: editing.storage_path,
      visible: editing.visible,
      sort_order: Number(editing.sort_order) || 0,
    };
    const q = editing.id
      ? supabase.from("gallery_items").update(payload).eq("id", editing.id)
      : supabase.from("gallery_items").insert(payload);
    const { error } = await q;
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(editing.id ? "Updated" : "Uploaded");
    setEditing(null);
    void load();
  }

  async function pickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setBusy(true);
    try {
      // If replacing, remove the previous file
      if (editing.storage_path) await deleteGalleryStorage(editing.storage_path);
      const { url, path } = await uploadGalleryImage(file);
      setEditing({ ...editing, image_url: url, storage_path: path });
      toast.success("Image uploaded");
    } catch (err) {
      toast.error((err as Error).message || "Upload failed");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  async function bulkUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    setBusy(true);
    let ok = 0;
    let fail = 0;
    // Start new items after any existing sort_order values.
    const baseSort =
      (rows && rows.length > 0 ? Math.max(...rows.map((r) => r.sort_order ?? 0)) : 0) + 1;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const { url, path } = await uploadGalleryImage(file);
        const title = file.name.replace(/\.[^.]+$/, "");
        const { error } = await supabase.from("gallery_items").insert({
          title,
          category: null,
          image_url: url,
          storage_path: path,
          visible: true,
          sort_order: baseSort + i,
        });
        if (error) throw error;
        ok++;
      } catch (err) {
        fail++;
        toast.error(`${file.name}: ${(err as Error).message || "Upload failed"}`);
      }
    }
    setBusy(false);
    if (ok > 0) toast.success(`Uploaded ${ok} photo${ok === 1 ? "" : "s"}${fail ? ` (${fail} failed)` : ""}`);
    void load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-semibold text-darkGreyBrown">Gallery</h2>
          <p className="text-sm text-darkGreyBrown/70">
            Photos shown on the public Gallery page. Max {MAX_UPLOAD_LABEL} per file.
          </p>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <Link to="/admin" className="text-sm text-brown hover:underline self-center">← Back</Link>
          <label
            className={`px-4 py-2 rounded-full border border-brown text-brown text-sm hover:bg-brown hover:text-white transition cursor-pointer ${busy ? "opacity-60 pointer-events-none" : ""}`}
          >
            {busy ? "Uploading…" : "+ Bulk upload"}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={bulkUpload}
              className="sr-only"
              disabled={busy}
            />
          </label>
          <button
            type="button"
            onClick={() => setEditing({ ...emptyForm })}
            className="px-4 py-2 rounded-full bg-brown text-white text-sm hover:bg-darkGreyBrown transition"
          >
            + Upload photo
          </button>
        </div>
      </div>

      {editing && (
        <div className="rounded-2xl border border-darkGreyBrown/15 bg-white p-5 space-y-3">
          <h3 className="font-semibold text-darkGreyBrown">
            {editing.id ? "Edit photo" : "New photo"}
          </h3>

          <div className="flex items-start gap-4 flex-wrap">
            <div className="w-40 h-40 rounded-lg overflow-hidden bg-tan flex items-center justify-center border border-darkGreyBrown/20">
              {editing.image_url ? (
                <img src={editing.image_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-darkGreyBrown/50 text-center px-2">No image yet</span>
              )}
            </div>
            <div className="space-y-2">
              <label className="inline-block px-3 py-1.5 rounded-full border border-brown text-brown hover:bg-brown hover:text-white transition cursor-pointer text-xs">
                {editing.image_url ? "Replace image" : "Upload image"}
                <input type="file" accept="image/*" onChange={pickImage} className="sr-only" />
              </label>
              <p className="text-[11px] text-darkGreyBrown/50">Max {MAX_UPLOAD_LABEL}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs text-darkGreyBrown/70">Title (optional)</span>
              <input
                className="mt-1 w-full border border-darkGreyBrown/20 rounded px-3 py-2 text-sm"
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="text-xs text-darkGreyBrown/70">Category (optional)</span>
              <input
                className="mt-1 w-full border border-darkGreyBrown/20 rounded px-3 py-2 text-sm"
                value={editing.category}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
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
            <label className="flex items-center gap-2 text-sm self-end">
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
        <p className="text-darkGreyBrown/70">No photos yet.</p>
      ) : (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {rows.map((r) => (
            <div key={r.id} className="rounded-xl border border-darkGreyBrown/15 bg-white overflow-hidden">
              <div className="aspect-square bg-tan">
                <img src={r.image_url} alt={r.title ?? ""} className="w-full h-full object-cover" />
              </div>
              <div className="p-3 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium text-darkGreyBrown truncate">
                    {r.title || "Untitled"}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${r.visible ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"}`}>
                    {r.visible ? "visible" : "hidden"}
                  </span>
                </div>
                {r.category && <p className="text-[11px] text-darkGreyBrown/60">{r.category}</p>}
                <div className="flex gap-1 pt-1 text-[11px] flex-wrap">
                  <button
                    type="button"
                    onClick={() =>
                      setEditing({
                        id: r.id,
                        title: r.title ?? "",
                        category: r.category ?? "",
                        image_url: r.image_url,
                        storage_path: r.storage_path,
                        visible: r.visible,
                        sort_order: r.sort_order,
                      })
                    }
                    className="px-2 py-0.5 rounded-full border border-darkGreyBrown/25 text-darkGreyBrown hover:bg-tan"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => void toggleVisible(r)}
                    className="px-2 py-0.5 rounded-full border border-darkGreyBrown/25 text-darkGreyBrown hover:bg-tan"
                  >
                    {r.visible ? "Hide" : "Unhide"}
                  </button>
                  <button
                    type="button"
                    onClick={() => void del(r)}
                    className="px-2 py-0.5 rounded-full text-red-700 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
