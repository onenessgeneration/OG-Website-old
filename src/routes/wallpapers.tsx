import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/PageHero";
import { ImagePlaceholder } from "@/components/Placeholder";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/wallpapers")({
  head: () => ({
    meta: [
      { title: "Wallpapers — Oneness Generation" },
      { name: "description", content: "Free downloadable wallpapers to inspire calm and connection." },
    ],
  }),
  component: WallpapersPage,
});

interface W { id: string; title: string | null; image_url: string; }

function WallpapersPage() {
  const [items, setItems] = useState<W[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("wallpapers").select("id,title,image_url").order("created_at", { ascending: false }).then(({ data }) => {
      setItems(data ?? []);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <PageHero title="Oneness Generation Wallpapers" subtitle="Bring a touch of calm to your devices." />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {loading ? (
          <p className="text-center text-muted-foreground">Loading…</p>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((it) => (
              <ImagePlaceholder key={it.id} label={it.title ?? "Wallpaper"} aspect="9/16" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ImagePlaceholder key={i} label={`Wallpaper ${i + 1}`} aspect="9/16" />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
