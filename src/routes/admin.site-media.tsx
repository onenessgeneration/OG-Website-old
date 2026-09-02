import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  SITE_MEDIA_SLOTS,
  siteMediaUrl,
  uploadSiteMedia,
  deleteSiteMedia,
  uploadStagingImage,
  copyStorageObjectToSlot,
  listStorageBuckets,
  listStorageEntries,
  MAX_UPLOAD_BYTES,
  MAX_UPLOAD_LABEL,
  type SiteMediaSlot,
  type StorageBucketInfo,
  type StorageEntry,
} from "@/lib/siteMedia";

export const Route = createFileRoute("/admin/site-media")({
  head: () => ({
    meta: [
      { title: "Site media — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SiteMediaPage,
});

function SiteMediaPage() {
  const groups = Array.from(new Set(SITE_MEDIA_SLOTS.map((s) => s.group)));
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-darkGreyBrown">Site media</h2>
        <Link to="/admin" className="text-sm text-brown hover:underline">
          ← Back
        </Link>
      </div>
      <div className="rounded-xl bg-white border border-darkGreyBrown/15 p-4 text-sm text-darkGreyBrown/80 space-y-1.5">
        <p>
          Every image and video on the public site is listed below, grouped by page.
          Each slot has a fixed identifier — uploading replaces whatever was there.
        </p>
        <p>
          <strong>Maximum file size:</strong> {MAX_UPLOAD_LABEL} per file
          (Supabase free-tier limit). Larger files are rejected before upload.
        </p>
        <p>
          Anywhere a slot hasn't been filled in, the live site shows a small dashed
          placeholder tagged with the slot ID so you can find it here quickly.
        </p>
      </div>

      <BulkStagingUploader />

      {groups.map((group) => (
        <section key={group} className="space-y-3">
          <h3 className="text-lg font-semibold text-darkGreyBrown">{group}</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SITE_MEDIA_SLOTS.filter((s) => s.group === group).map((slot) => (
              <SlotCard key={slot.id} slot={slot} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function BulkStagingUploader() {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{ ok: number; fail: number; total: number } | null>(null);

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    setBusy(true);
    setProgress({ ok: 0, fail: 0, total: files.length });
    let ok = 0, fail = 0;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        await uploadStagingImage(file);
        ok++;
      } catch (err) {
        fail++;
        toast.error(`${file.name}: ${(err as Error).message || "Upload failed"}`);
      }
      setProgress({ ok, fail, total: files.length });
    }
    setBusy(false);
    if (ok > 0) toast.success(`Staged ${ok} image${ok === 1 ? "" : "s"}. Click "select from database" on any image slot to pick one.`);
  }

  return (
    <div className="rounded-xl bg-tan/60 border border-brown/30 p-4 flex items-start gap-4 flex-wrap">
      <div className="flex-1 min-w-[220px]">
        <div className="font-semibold text-darkGreyBrown text-sm">Bulk upload to staging</div>
        <p className="text-xs text-darkGreyBrown/70 mt-1 leading-snug">
          Upload many images at once into the <strong>site-media</strong> bucket's staging area.
          Then use the <strong>"select from database"</strong> button on any image slot below to
          pick any file from any storage bucket. Max {MAX_UPLOAD_LABEL} per file.
        </p>
        {progress && busy && (
          <p className="text-[11px] text-darkGreyBrown/60 mt-1">
            Uploading… {progress.ok + progress.fail}/{progress.total}
          </p>
        )}
      </div>
      <label
        className={`px-4 py-2 rounded-full bg-brown text-white text-sm hover:bg-darkGreyBrown transition cursor-pointer ${busy ? "opacity-60 pointer-events-none" : ""}`}
      >
        {busy ? "Uploading…" : "+ Bulk upload images"}
        <input type="file" accept="image/*" multiple onChange={onFiles} disabled={busy} className="sr-only" />
      </label>
    </div>
  );
}

function SlotCard({ slot }: { slot: SiteMediaSlot }) {
  const [busy, setBusy] = useState<null | "upload" | "delete" | "gallery">(null);
  const [bust, setBust] = useState(0);
  const [missing, setMissing] = useState(false);
  const [retry, setRetry] = useState(0);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const remoteUrl = `${siteMediaUrl(slot.path)}&r=${bust}&t=${retry}`;
  const url = localPreview ?? remoteUrl;

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error(`File is ${(file.size / (1024 * 1024)).toFixed(1)} MB. Maximum is ${MAX_UPLOAD_LABEL}.`);
      e.target.value = "";
      return;
    }
    setBusy("upload");
    try {
      const objUrl = URL.createObjectURL(file);
      setLocalPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return objUrl;
      });
      await uploadSiteMedia(slot, file);
      setMissing(false);
      setBust((n) => n + 1);
      setRetry(0);
      toast.success(`${slot.label} uploaded`);
    } catch (err) {
      toast.error((err as Error).message || "Upload failed");
    } finally {
      setBusy(null);
      e.target.value = "";
    }
  }

  async function onDelete() {
    if (!confirm(`Remove "${slot.label}"?`)) return;
    setBusy("delete");
    try {
      await deleteSiteMedia(slot);
      if (localPreview) {
        URL.revokeObjectURL(localPreview);
        setLocalPreview(null);
      }
      setMissing(true);
      setBust((n) => n + 1);
      toast.success("Removed");
    } catch (err) {
      toast.error((err as Error).message || "Delete failed");
    } finally {
      setBusy(null);
    }
  }

  async function pickFromStorage(entry: StorageEntry) {
    setPickerOpen(false);
    setBusy("gallery");
    try {
      await copyStorageObjectToSlot(slot, entry.bucket, entry.path);
      if (localPreview) {
        URL.revokeObjectURL(localPreview);
        setLocalPreview(null);
      }
      setMissing(false);
      setBust((n) => n + 1);
      setRetry(0);
      toast.success(`${slot.label} set from ${entry.bucket}/${entry.path}`);
    } catch (err) {
      toast.error((err as Error).message || "Copy failed");
    } finally {
      setBusy(null);
    }
  }

  function handleError() {
    if (localPreview) return;
    if (retry < 4) {
      const delay = 400 * (retry + 1);
      setTimeout(() => setRetry((n) => n + 1), delay);
    } else {
      setMissing(true);
    }
  }

  const accept = slot.kind === "video" ? "video/*" : "image/*";

  return (
    <div className="rounded-2xl border border-darkGreyBrown/15 bg-white p-4 space-y-3">
      <div>
        <div className="flex items-center gap-2">
          <div className="font-semibold text-darkGreyBrown text-sm">{slot.label}</div>
          <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-tan text-brown">
            {slot.kind}
          </span>
        </div>
        <div className="text-[11px] text-darkGreyBrown/50 font-mono truncate">{slot.id}</div>
      </div>

      <div
        className="w-full rounded-lg overflow-hidden bg-tan/40 border border-darkGreyBrown/10 flex items-center justify-center"
        style={{ aspectRatio: slot.aspect ?? "16/9" }}
      >
        {missing ? (
          <span className="text-xs text-darkGreyBrown/50">No file yet</span>
        ) : slot.kind === "video" ? (
          <video
            key={url}
            src={url}
            muted
            loop
            playsInline
            preload="metadata"
            onError={handleError}
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            key={url}
            src={url}
            alt={slot.label}
            onError={handleError}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <p className="text-xs text-darkGreyBrown/70 leading-snug">
        <span className="font-semibold text-darkGreyBrown/90">Used on the site: </span>
        {slot.usage}
      </p>

      {slot.note && <p className="text-[11px] text-darkGreyBrown/60 italic">{slot.note}</p>}

      <div className="flex items-center gap-2 flex-wrap">
        <label
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brown text-brown hover:bg-brown hover:text-white transition cursor-pointer text-xs font-medium ${
            busy ? "opacity-60 pointer-events-none" : ""
          }`}
        >
          {busy === "upload" ? "Uploading…" : missing ? "Upload" : "Replace"}
          <input type="file" accept={accept} onChange={onFile} disabled={!!busy} className="sr-only" />
        </label>
        {slot.kind === "image" && (
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            disabled={!!busy}
            className="px-3 py-1.5 rounded-full border border-darkGreyBrown/25 text-darkGreyBrown text-xs hover:bg-tan transition disabled:opacity-60"
          >
            {busy === "gallery" ? "Copying…" : "select from database"}
          </button>
        )}
        {!missing && (
          <button
            type="button"
            onClick={() => void onDelete()}
            disabled={!!busy}
            className="text-xs text-red-700 hover:underline disabled:opacity-60"
          >
            {busy === "delete" ? "Removing…" : "Remove"}
          </button>
        )}
        <span className="ml-auto text-[10px] text-darkGreyBrown/50">Max {MAX_UPLOAD_LABEL}</span>
      </div>
      {pickerOpen && (
        <StorageBrowser
          onPick={(entry) => void pickFromStorage(entry)}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}

function StorageBrowser({
  onPick,
  onClose,
}: {
  onPick: (entry: StorageEntry) => void;
  onClose: () => void;
}) {
  const [buckets, setBuckets] = useState<StorageBucketInfo[] | null>(null);
  const [bucket, setBucket] = useState<string | null>(null);
  const [prefix, setPrefix] = useState<string>("");
  const [entries, setEntries] = useState<StorageEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listStorageBuckets()
      .then((bs) => {
        setBuckets(bs);
        if (bs.length === 0) {
          setError(
            'No buckets returned. Your database is missing a SELECT policy on storage.buckets for admins. Add this policy in the Supabase SQL editor:\n\ncreate policy "Admins can list buckets" on storage.buckets for select to authenticated using (public.has_role(auth.uid(), \'admin\'));',
          );
          return;
        }
        if (!bucket) setBucket(bs[0].name);
      })
      .catch((e) => setError((e as Error).message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    if (!bucket) return;
    setEntries(null);
    setError(null);
    listStorageEntries(bucket, prefix)
      .then(setEntries)
      .catch((e) => setError((e as Error).message));
  }, [bucket, prefix]);

  const crumbs = prefix ? prefix.split("/") : [];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-5xl w-full max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-darkGreyBrown/15">
          <h3 className="font-semibold text-darkGreyBrown">Select from database</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-darkGreyBrown/60 hover:text-darkGreyBrown text-sm"
          >
            ✕
          </button>
        </div>

        <div className="px-4 pt-3 pb-2 border-b border-darkGreyBrown/10 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-darkGreyBrown/60">Bucket:</span>
          {buckets === null ? (
            <span className="text-darkGreyBrown/60">Loading…</span>
          ) : (
            buckets.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => { setBucket(b.name); setPrefix(""); }}
                className={`px-2 py-1 rounded-full border transition ${
                  bucket === b.name
                    ? "bg-brown text-white border-brown"
                    : "border-darkGreyBrown/25 text-darkGreyBrown hover:bg-tan"
                }`}
              >
                {b.name}
              </button>
            ))
          )}
        </div>

        {bucket && (
          <div className="px-4 py-2 border-b border-darkGreyBrown/10 text-xs text-darkGreyBrown/80 flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => setPrefix("")}
              className="hover:underline font-semibold"
            >
              {bucket}
            </button>
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1">
                <span className="text-darkGreyBrown/40">/</span>
                <button
                  type="button"
                  onClick={() => setPrefix(crumbs.slice(0, i + 1).join("/"))}
                  className="hover:underline"
                >
                  {c}
                </button>
              </span>
            ))}
          </div>
        )}

        {error && (
          <div className="px-4 py-3 border-b border-red-200 bg-red-50 text-xs text-red-800 whitespace-pre-wrap">
            {error}
          </div>
        )}

        <div className="p-4 overflow-y-auto">
          {error && !bucket ? null : !entries ? (

            <p className="text-sm text-darkGreyBrown/70">Loading…</p>
          ) : entries.length === 0 ? (
            <p className="text-sm text-darkGreyBrown/70">This folder is empty.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {entries.map((e) => {
                const key = `${e.bucket}/${e.path}`;
                if (e.isFolder) {
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setPrefix(e.path)}
                      className="rounded-lg border border-darkGreyBrown/15 hover:border-brown transition p-3 flex flex-col items-center justify-center gap-1 aspect-square bg-tan/40"
                    >
                      <span className="text-3xl">📁</span>
                      <span className="text-xs text-darkGreyBrown truncate w-full text-center">{e.name}</span>
                    </button>
                  );
                }
                const isImage = /\.(jpe?g|png|gif|webp|svg|avif)$/i.test(e.name);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onPick(e)}
                    className="group rounded-lg overflow-hidden border border-darkGreyBrown/15 hover:border-brown transition text-left"
                  >
                    <div className="aspect-square bg-tan flex items-center justify-center">
                      {isImage && e.url ? (
                        <img
                          src={e.url}
                          alt={e.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <span className="text-3xl">📄</span>
                      )}
                    </div>
                    <div className="text-[11px] text-darkGreyBrown truncate px-2 py-1">
                      {e.name}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
