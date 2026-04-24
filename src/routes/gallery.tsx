import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/PageHero";
import { ImagePlaceholder } from "@/components/Placeholder";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Oneness Generation" },
      { name: "description", content: "Moments from the Oneness Generation community." },
    ],
  }),
  component: GalleryPage,
});

interface Item { id: string; title: string | null; image_url: string; }

function GalleryPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("gallery_items").select("id,title,image_url").order("created_at", { ascending: false }).then(({ data }) => {
      setItems(data ?? []);
      setLoading(false);
    });
  }, []);

  const placeholders = Array.from({ length: 12 });

  return (
    <>
      <PageHero title="Oneness Generation Gallery" subtitle="Glimpses of joy, peace, and togetherness from our community." />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {loading ? (
          <p className="text-center text-muted-foreground">Loading…</p>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((it) => (
              <ImagePlaceholder key={it.id} label={it.title ?? "Photo"} aspect="1/1" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {placeholders.map((_, i) => (
              <ImagePlaceholder key={i} label={`Photo ${i + 1}`} aspect="1/1" />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
