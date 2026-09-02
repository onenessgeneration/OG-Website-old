import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/app-client";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Oneness Generation" },
      { name: "description", content: "Resources, insights, and stories from our team." },
      { property: "og:title", content: "Blog — Oneness Generation" },
      { property: "og:description", content: "Resources, insights, and stories from our team." },
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
  category?: string | null;
}

function truncate(text: string, wordLimit: number) {
  if (!text) return "";
  const words = text.split(" ");
  return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + " ..." : text;
}

function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("id,title,excerpt,author,cover_url,created_at")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setPosts(data ?? []);
        setLoading(false);
      });
  }, []);

  const filtered = posts.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="bg-tan lg:px-12 md:px-8 px-4 lg:py-16 md:py-8 py-4">
        <div className="md:flex items-center bg-darkGreyBrown rounded-lg md:py-8 py-4 md:px-12 px-6 mx-auto container max-w-6xl">
          <div className="grid place-content-center place-items-center text-center md:space-y-5 space-y-2 md:w-2/3">
            <p className="bg-[#c0be968f] w-fit px-6 py-1 rounded-full text-white">Share Your Story</p>
            <h2 className="text-white text-xl font-semibold font-display">
              We believe every person has a story to tell, and we're always looking for new voices to feature on our blog.
            </h2>
          </div>
          <div className="md:w-1/3 flex justify-center md:mt-0 mt-5">
            <Link to="/blog/submit" className="bg-brown px-4 py-2 rounded-lg font-semibold text-white hover:opacity-90">
              Share Now
            </Link>
          </div>
        </div>

        <div className="grid place-content-center place-items-center space-y-5 md:mt-10 mt-5">
          <p className="bg-tanAccent text-white px-6 py-1 rounded-full">Our Blog</p>
          <h2 className="text-brown md:text-5xl text-3xl font-semibold font-display">Resources and insights</h2>
          <h3 className="md:text-xl">Read Blogs posted by Our Team</h3>
          <div className="relative grid justify-end my-5">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ..."
              className="px-4 py-2 border rounded-lg md:w-[500px] w-[250px] bg-white"
            />
            <Search className="absolute right-3 top-2.5 w-5 h-5 text-darkGreyBrown" />
          </div>
        </div>
      </div>

      <div className="lg:px-32 md:px-16 px-4 md:py-16 py-4 bg-white">
        {loading ? (
          <p className="text-center text-darkGreyBrown">Loading…</p>
        ) : filtered.length === 0 ? (
          <div className="flex justify-center">
            <p className="md:text-3xl text-xl font-semibold text-brown">No Blogs Found</p>
          </div>
        ) : (
          <div className="grid 2xl:grid-cols-3 md:grid-cols-2 grid-cols-1 md:gap-14 gap-5">
            {filtered.map((value) => (
              <Link
                key={value.id}
                to="/blog/$id"
                params={{ id: value.id }}
                className="bg-white shadow-lg rounded-2xl md:px-6 px-4 md:py-4 py-2 flex flex-col h-full hover:shadow-xl transition group"
              >
                <div className="md:h-60 h-40 w-full rounded-lg bg-tan overflow-hidden">
                  {value.cover_url ? (
                    <img src={value.cover_url} alt={value.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brown/60 text-sm">No image</div>
                  )}
                </div>
                <div className="mt-4 space-y-2 flex-grow">
                  <p className="text-sm text-brown">Article</p>
                  <h2 className="flex justify-between text-xl font-semibold text-gray-800 font-display">
                    <span>{truncate(value.title, 8)}</span>
                    <ArrowUpRight className="w-5 h-5 shrink-0 group-hover:text-brown transition" />
                  </h2>
                  {value.excerpt && (
                    <p className="text-gray-600 text-sm">{truncate(value.excerpt, 20)}</p>
                  )}
                </div>
                <div className="flex justify-between items-center mt-auto pt-4 pb-2 border-t">
                  <p className="text-sm font-semibold text-gray-800">{value.author ?? "OG Team"}</p>
                  <p className="text-xs text-brown">{new Date(value.created_at).toLocaleDateString()}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
