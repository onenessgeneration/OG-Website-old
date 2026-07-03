import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import g1 from "@/assets/gallery/1.jpg.asset.json";
import g2 from "@/assets/gallery/2.jpg.asset.json";

export const Route = createFileRoute("/wallpapers")({
  head: () => ({
    meta: [
      { title: "Wallpapers — Oneness Generation" },
      { name: "description", content: "Free downloadable wallpapers to inspire calm and connection." },
      { property: "og:title", content: "Oneness Generation Wallpapers" },
      { property: "og:description", content: "Bring a touch of calm to your devices." },
    ],
  }),
  component: WallpapersPage,
});

interface W { id: string; title: string | null; image_url: string; }

function WallpapersPage() {
  const [items, setItems] = useState<W[]>([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    supabase.from("wallpapers").select("id,title,image_url").order("created_at", { ascending: false }).then(({ data }) => {
      setItems(data ?? []);
      setLoading(false);
    });
  }, []);

  const fallback = Array.from({ length: 12 }).map((_, i) => (i % 2 === 0 ? g1.url : g2.url));
  const images = items.length > 0 ? items.map((i) => i.image_url) : fallback;

  useEffect(() => {
    if (openIndex !== null) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = original; };
    }
  }, [openIndex]);

  useEffect(() => {
    if (openIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowRight") setOpenIndex((i) => (i === null ? null : (i + 1) % images.length));
      if (e.key === "ArrowLeft") setOpenIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [openIndex, images.length]);

  return (
    <div className="py-6 bg-tan min-h-screen">
      <h2 className="text-2xl md:text-4xl font-bold text-center mb-6 text-brown font-display">
        Oneness Generation Wallpapers
      </h2>
      {loading ? (
        <p className="text-center text-darkGreyBrown">Loading…</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 p-1">
          {images.map((url, index) => (
            <button
              key={index}
              onClick={() => setOpenIndex(index)}
              className="relative group aspect-[9/16] overflow-hidden rounded-md shadow-md bg-white"
            >
              <img src={url} alt={`Wallpaper ${index + 1}`} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </button>
          ))}
        </div>
      )}

      {openIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <button
            onClick={() => setOpenIndex(null)}
            className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white/10"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
          <button
            onClick={() => setOpenIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length))}
            className="absolute left-4 text-white p-2 rounded-full hover:bg-white/10"
            aria-label="Previous"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <img src={images[openIndex]} alt="Wallpaper" className="max-h-[90vh] max-w-[90vw] object-contain" />
          <button
            onClick={() => setOpenIndex((i) => (i === null ? null : (i + 1) % images.length))}
            className="absolute right-4 text-white p-2 rounded-full hover:bg-white/10"
            aria-label="Next"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}
    </div>
  );
}
