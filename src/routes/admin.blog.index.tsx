import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/app-client";

export const Route = createFileRoute("/admin/blog/")({
  head: () => ({
    meta: [
      { title: "Blog submissions — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: BlogAdminPage,
});

type Row = {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  author: string | null;
  cover_url: string | null;
  status: string;
  published: boolean;
  created_at: string;
  author_id: string | null;
};

type Tab = "pending" | "approved" | "rejected" | "all";

function BlogAdminPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [tab, setTab] = useState<Tab>("pending");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  async function load() {
    let q = supabase
      .from("blog_posts")
      .select("id,title,excerpt,content,author,cover_url,status,published,created_at,author_id")
      .order("created_at", { ascending: false });
    if (tab !== "all") q = q.eq("status", tab);
    const { data, error } = await q;
    if (error) {
      toast.error(error.message);
      return;
    }
    setRows((data ?? []) as Row[]);
  }

  useEffect(() => {
    setRows(null);
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  async function approve(row: Row) {
    setBusyId(row.id);
    const { error } = await supabase
      .from("blog_posts")
      .update({ status: "approved", published: true })
      .eq("id", row.id);
    setBusyId(null);
    if (error) return toast.error(error.message);
    toast.success("Approved and published");
    void load();
  }

  async function reject(row: Row) {
    if (!confirm(`Reject "${row.title}"? The author will no longer see it as pending.`)) return;
    setBusyId(row.id);
    const { error } = await supabase
      .from("blog_posts")
      .update({ status: "rejected", published: false })
      .eq("id", row.id);
    setBusyId(null);
    if (error) return toast.error(error.message);
    toast.success("Rejected");
    void load();
  }

  async function unpublish(row: Row) {
    setBusyId(row.id);
    const { error } = await supabase
      .from("blog_posts")
      .update({ published: false })
      .eq("id", row.id);
    setBusyId(null);
    if (error) return toast.error(error.message);
    void load();
  }

  async function republish(row: Row) {
    setBusyId(row.id);
    const { error } = await supabase
      .from("blog_posts")
      .update({ published: true, status: "approved" })
      .eq("id", row.id);
    setBusyId(null);
    if (error) return toast.error(error.message);
    void load();
  }

  async function del(row: Row) {
    if (!confirm(`Delete "${row.title}"? This cannot be undone.`)) return;
    setBusyId(row.id);
    const { error } = await supabase.from("blog_posts").delete().eq("id", row.id);
    setBusyId(null);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    void load();
  }

  const tabClass = (t: Tab) =>
    `px-3 py-1.5 rounded-full text-sm transition ${
      tab === t
        ? "bg-brown text-white"
        : "bg-white border border-darkGreyBrown/20 text-darkGreyBrown hover:bg-tan"
    }`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-2xl font-semibold text-darkGreyBrown">Blog submissions</h2>
        <div className="flex gap-2 flex-wrap">
          <button type="button" onClick={() => setTab("pending")} className={tabClass("pending")}>Pending</button>
          <button type="button" onClick={() => setTab("approved")} className={tabClass("approved")}>Approved</button>
          <button type="button" onClick={() => setTab("rejected")} className={tabClass("rejected")}>Rejected</button>
          <button type="button" onClick={() => setTab("all")} className={tabClass("all")}>All</button>
        </div>
      </div>

      {!rows ? (
        <p className="text-darkGreyBrown/70">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-darkGreyBrown/70">No posts in this category.</p>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => {
            const isOpen = openId === r.id;
            return (
              <div key={r.id} className="rounded-2xl border border-darkGreyBrown/15 bg-white p-4">
                <div className="flex gap-4 items-start">
                  {r.cover_url ? (
                    <img src={r.cover_url} alt="" className="w-24 h-16 object-cover rounded shrink-0" />
                  ) : (
                    <div className="w-24 h-16 bg-tan rounded shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-darkGreyBrown truncate">{r.title}</h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          r.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : r.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {r.status}
                      </span>
                      {r.published && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          published
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-darkGreyBrown/60 mt-1">
                      {r.author ? `${r.author} · ` : ""}
                      {new Date(r.created_at).toLocaleString()}
                    </p>
                    {r.excerpt && (
                      <p className="text-sm text-darkGreyBrown/80 mt-2 line-clamp-2">{r.excerpt}</p>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2 text-sm">
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : r.id)}
                    className="px-3 py-1.5 rounded-full border border-darkGreyBrown/25 text-darkGreyBrown hover:bg-tan transition"
                  >
                    {isOpen ? "Hide content" : "Read content"}
                  </button>
                  {r.status !== "approved" && (
                    <button
                      type="button"
                      disabled={busyId === r.id}
                      onClick={() => void approve(r)}
                      className="px-3 py-1.5 rounded-full bg-green-700 text-white hover:bg-green-800 transition disabled:opacity-60"
                    >
                      Approve & publish
                    </button>
                  )}
                  {r.status === "pending" && (
                    <button
                      type="button"
                      disabled={busyId === r.id}
                      onClick={() => void reject(r)}
                      className="px-3 py-1.5 rounded-full bg-red-700 text-white hover:bg-red-800 transition disabled:opacity-60"
                    >
                      Reject
                    </button>
                  )}
                  {r.published && (
                    <button
                      type="button"
                      disabled={busyId === r.id}
                      onClick={() => void unpublish(r)}
                      className="px-3 py-1.5 rounded-full border border-darkGreyBrown/25 text-darkGreyBrown hover:bg-tan transition disabled:opacity-60"
                    >
                      Unpublish
                    </button>
                  )}
                  {!r.published && r.status === "approved" && (
                    <button
                      type="button"
                      disabled={busyId === r.id}
                      onClick={() => void republish(r)}
                      className="px-3 py-1.5 rounded-full bg-brown text-white hover:bg-darkGreyBrown transition disabled:opacity-60"
                    >
                      Publish
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={busyId === r.id}
                    onClick={() => void del(r)}
                    className="ml-auto px-3 py-1.5 rounded-full text-red-700 hover:underline"
                  >
                    Delete
                  </button>
                </div>

                {isOpen && (
                  <div className="mt-4 pt-4 border-t border-darkGreyBrown/10 whitespace-pre-wrap text-darkGreyBrown/90 text-sm">
                    {r.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
