import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ClientOnly } from "@/components/ClientOnly";
import { useAuthUser } from "@/hooks/useAuthUser";
import { supabase } from "@/integrations/supabase/app-client";
import { uploadBlogCover } from "@/lib/blogMedia";

export const Route = createFileRoute("/blog/submit")({
  head: () => ({
    meta: [
      { title: "Submit a Blog Post — Oneness Generation" },
      { name: "description", content: "Share your story with the Oneness community. Submissions are reviewed by our team before being published." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SubmitBlogPage,
});

function SubmitBlogPage() {
  return (
    <div className="bg-tan/40 min-h-screen">
      <div className="max-w-3xl mx-auto px-5 py-12">
        <div className="mb-8 space-y-2">
          <p className="bg-tanAccent text-white px-4 py-1 rounded-full w-fit text-sm">Share Your Story</p>
          <h1 className="text-4xl font-semibold text-brown font-display">Submit a blog post</h1>
          <p className="text-darkGreyBrown/80">
            Fill in your story below. Our team will review your submission and publish it if approved.
          </p>
        </div>
        <ClientOnly fallback={<p className="text-darkGreyBrown/70">Loading…</p>}>
          <SubmitBody />
          <MySubmissions />
        </ClientOnly>
      </div>
    </div>
  );
}

function SubmitBody() {
  const { user, loading } = useAuthUser();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <p className="text-darkGreyBrown/70">Loading…</p>;

  if (!user) {
    return (
      <div className="rounded-2xl border border-darkGreyBrown/20 bg-white p-8 space-y-4">
        <p>You need to be signed in to submit a blog post.</p>
        <div className="flex gap-3">
          <Link
            to="/login"
            className="px-6 py-2 uppercase text-sm bg-brown text-white rounded-full hover:bg-darkGreyBrown transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-2 uppercase text-sm border border-brown text-brown rounded-full hover:bg-brown hover:text-white transition"
          >
            Register
          </Link>
        </div>
      </div>
    );
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image must be smaller than 8 MB");
      return;
    }
    setUploading(true);
    try {
      const url = await uploadBlogCover(file, user.id);
      setCoverUrl(url);
      toast.success("Cover uploaded");
    } catch (err) {
      toast.error((err as Error).message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    const t = title.trim();
    const c = content.trim();
    if (!t || !c) {
      toast.error("Title and content are required");
      return;
    }
    if (t.length > 200) {
      toast.error("Title must be under 200 characters");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("blog_posts").insert({
      title: t,
      excerpt: excerpt.trim() || null,
      content: c,
      author: author.trim() || null,
      cover_url: coverUrl || null,
      author_id: user.id,
      published: false,
      status: "pending",
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Submitted for review — thank you!");
    navigate({ to: "/blog" });
  }

  const label = "block text-sm font-medium text-darkGreyBrown mb-1";
  const input =
    "w-full rounded-lg border border-darkGreyBrown/20 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brown/40";

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-2xl bg-white border border-darkGreyBrown/15 p-6">
      <div>
        <label className={label}>Title *</label>
        <input
          className={input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={200}
        />
      </div>

      <div>
        <label className={label}>Author name</label>
        <input
          className={input}
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Your name (optional)"
          maxLength={100}
        />
      </div>

      <div>
        <label className={label}>Short excerpt</label>
        <textarea
          className={input}
          rows={2}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="One or two sentences that summarize your post."
          maxLength={300}
        />
      </div>

      <div>
        <label className={label}>Content *</label>
        <textarea
          className={input}
          rows={12}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          maxLength={20000}
        />
      </div>

      <div>
        <label className={label}>Cover image</label>
        <div className="flex items-start gap-4 flex-wrap">
          {coverUrl ? (
            <img src={coverUrl} alt="Cover" className="w-40 h-28 object-cover rounded-lg border border-darkGreyBrown/10" />
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
              <span>{uploading ? "Uploading…" : coverUrl ? "Replace image" : "Upload image"}</span>
              <input type="file" accept="image/*" onChange={onFile} disabled={uploading} className="sr-only" />
            </label>
            <p className="text-xs text-darkGreyBrown/60">PNG, JPG or WEBP. Optional but recommended.</p>
            {coverUrl && (
              <button
                type="button"
                onClick={() => setCoverUrl("")}
                className="block text-sm text-red-700 hover:underline"
              >
                Remove cover
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-tan/40 border border-darkGreyBrown/10 p-3 text-sm text-darkGreyBrown/80">
        Your submission will be reviewed by our team before it appears on the blog.
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting || uploading}
          className="px-6 py-2 rounded-full bg-brown text-white hover:bg-darkGreyBrown transition disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Submit for review"}
        </button>
        <Link
          to="/blog"
          className="px-6 py-2 rounded-full border border-darkGreyBrown/30 text-darkGreyBrown hover:bg-darkGreyBrown hover:text-white transition"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

type MyRow = {
  id: string;
  title: string;
  status: string;
  published: boolean;
  created_at: string;
};

function MySubmissions() {
  const { user, loading } = useAuthUser();
  const [rows, setRows] = useState<MyRow[] | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("blog_posts")
      .select("id,title,status,published,created_at")
      .eq("author_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setRows((data ?? []) as MyRow[]));
  }, [user]);

  if (loading || !user || !rows || rows.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold text-brown font-display mb-3">Your submissions</h2>
      <div className="rounded-2xl border border-darkGreyBrown/15 bg-white divide-y divide-darkGreyBrown/10">
        {rows.map((r) => {
          const badge =
            r.status === "approved"
              ? "bg-green-100 text-green-800"
              : r.status === "rejected"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800";
          const label =
            r.status === "approved" && r.published
              ? "published"
              : r.status === "approved"
                ? "approved"
                : r.status;
          return (
            <div key={r.id} className="p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-darkGreyBrown truncate">{r.title}</p>
                <p className="text-xs text-darkGreyBrown/60">
                  {new Date(r.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full ${badge}`}>{label}</span>
                {r.published && (
                  <Link
                    to="/blog/$id"
                    params={{ id: r.id }}
                    className="text-sm text-brown hover:underline"
                  >
                    View
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
