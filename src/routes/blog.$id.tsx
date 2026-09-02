import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/app-client";

export const Route = createFileRoute("/blog/$id")({
  head: ({ loaderData }) => {
    const post = loaderData as Post | undefined;
    if (!post) {
      return { meta: [{ title: "Blog post — Oneness Generation" }] };
    }
    const desc = post.excerpt ?? post.content.slice(0, 155);
    return {
      meta: [
        { title: `${post.title} — Oneness Generation` },
        { name: "description", content: desc },
        { property: "og:title", content: post.title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        ...(post.cover_url ? [{ property: "og:image", content: post.cover_url }] : []),
      ],
    };
  },
  loader: async ({ params }) => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id,title,excerpt,content,author,cover_url,created_at,published")
      .eq("id", params.id)
      .eq("published", true)
      .maybeSingle();
    if (error) throw error;
    return data as Post | null;
  },
  errorComponent: BlogPostError,
  notFoundComponent: BlogPostNotFound,
  component: BlogPostPage,
});

interface Post {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  author: string | null;
  cover_url: string | null;
  created_at: string;
  published: boolean;
}

function BlogPostPage() {
  const post = Route.useLoaderData() as Post | null;
  if (!post) return <BlogPostNotFound />;

  return (
    <article className="bg-white">
      {post.cover_url && (
        <div className="w-full h-[42vh] md:h-[60vh] bg-tan overflow-hidden">
          <img src={post.cover_url} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="max-w-3xl mx-auto px-5 py-10 md:py-16">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-brown hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to blog
        </Link>
        <p className="text-sm text-brown uppercase tracking-wide">Article</p>
        <h1 className="mt-2 text-3xl md:text-5xl font-semibold font-display text-darkGreyBrown">
          {post.title}
        </h1>
        <div className="mt-3 flex items-center gap-3 text-sm text-darkGreyBrown/70">
          <span className="font-medium">{post.author ?? "OG Team"}</span>
          <span>·</span>
          <span>
            {new Date(post.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        {post.excerpt && (
          <p className="mt-6 text-lg text-darkGreyBrown/80 italic">{post.excerpt}</p>
        )}
        <div className="mt-8 whitespace-pre-wrap text-darkGreyBrown/90 leading-relaxed text-[17px]">
          {post.content}
        </div>
      </div>
    </article>
  );
}

function BlogPostNotFound() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-20 text-center">
      <h1 className="text-3xl font-semibold font-display text-brown">Post not found</h1>
      <p className="mt-3 text-darkGreyBrown/70">
        This post may have been unpublished or removed.
      </p>
      <Link
        to="/blog"
        className="mt-6 inline-block px-6 py-2 rounded-full bg-brown text-white hover:bg-darkGreyBrown transition"
      >
        Back to blog
      </Link>
    </div>
  );
}

function BlogPostError({ reset }: { reset: () => void }) {
  const router = useRouter();
  return (
    <div className="max-w-2xl mx-auto px-5 py-20 text-center">
      <h1 className="text-3xl font-semibold font-display text-brown">Something went wrong</h1>
      <p className="mt-3 text-darkGreyBrown/70">We couldn't load this post.</p>
      <button
        type="button"
        onClick={() => {
          reset();
          void router.invalidate();
        }}
        className="mt-6 px-6 py-2 rounded-full bg-brown text-white hover:bg-darkGreyBrown transition"
      >
        Try again
      </button>
    </div>
  );
}
