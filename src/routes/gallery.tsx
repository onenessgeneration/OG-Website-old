import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import g1 from "@/assets/gallery/1.jpg.asset.json";
import g2 from "@/assets/gallery/2.jpg.asset.json";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Oneness Generation" },
      { name: "description", content: "Moments from the Oneness Generation community." },
      { property: "og:title", content: "Oneness Generation Gallery" },
      { property: "og:description", content: "Glimpses of joy, peace, and togetherness." },
      { property: "og:image", content: g1.url },
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

  const fallback = [g1.url, g2.url, g1.url, g2.url, g1.url, g2.url, g1.url, g2.url, g1.url, g2.url];
  const images = items.length > 0 ? items.map((i) => ({ url: i.image_url, alt: i.title ?? "Photo" })) : fallback.map((u, i) => ({ url: u, alt: `Photo ${i + 1}` }));

  return (
    <div className="py-6 px-6 bg-tan min-h-screen">
      <h2 className="text-2xl md:text-4xl font-bold text-center mb-6 text-brown font-display">
        Oneness Generation Gallery
      </h2>
      {loading ? (
        <p className="text-center text-darkGreyBrown">Loading…</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-10 md:px-4">
          {images.map((img, index) => (
            <div key={index} className="relative overflow-hidden rounded shadow-md aspect-square bg-white">
              <img src={img.url} alt={img.alt} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
