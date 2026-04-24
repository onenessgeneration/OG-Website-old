import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/PageHero";
import { ImagePlaceholder } from "@/components/Placeholder";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Oneness Generation" },
      { name: "description", content: "Resources, insights, and stories from our team." },
    ],
  }),
  component: BlogPage,
});

interface Post {
  id: string;
  title: string;
  excerpt: string | null;
  author: string | null;
  cover_url: string | null;
  created_at: string;
}

function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("blog_posts").select("id,title,excerpt,author,cover_url,created_at").eq("published", true).order("created_at", { ascending: false }).then(({ data }) => {
      setPosts(data ?? []);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <section className="bg-soft-gradient border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="text-sm uppercase tracking-widest text-accent font-semibold mb-3">Share Your Story</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            We believe every person has a story to tell
          </h1>
          <p className="text-muted-foreground mb-6">…and we're always looking for new voices to feature on our blog.</p>
          <Link to="/login" className="inline-block px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary-glow transition shadow-soft">
            Share Now
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <div className="text-sm uppercase tracking-widest text-accent font-semibold mb-2">Our Blog</div>
          <h2 className="text-3xl md:text-4xl font-bold text-gradient">Resources and Insights</h2>
          <p className="text-muted-foreground mt-2">Read blogs posted by our team</p>
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground">Loading…</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">No Blogs Found</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p) => (
              <article key={p.id} className="bg-card rounded-2xl overflow-hidden shadow-card border border-border">
                <ImagePlaceholder label={p.title} aspect="16/9" rounded="rounded-none" />
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2">{p.title}</h3>
                  {p.excerpt && <p className="text-sm text-muted-foreground mb-3">{p.excerpt}</p>}
                  <div className="text-xs text-muted-foreground">{p.author ?? "OG Team"} · {new Date(p.created_at).toLocaleDateString()}</div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
