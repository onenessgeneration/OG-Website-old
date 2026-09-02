import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fetchVisibleGallery, type GalleryItem } from "@/lib/gallery";
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

function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  useEffect(() => {
    fetchVisibleGallery()
      .then((rows) => setItems(rows))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const fallback = [g1.url, g2.url, g1.url, g2.url, g1.url, g2.url, g1.url, g2.url, g1.url, g2.url];
  const images =
    items.length > 0
      ? items.map((i) => ({ url: i.image_url, alt: i.title ?? "Photo" }))
      : fallback.map((u, i) => ({ url: u, alt: `Photo ${i + 1}` }));

  useEffect(() => {
    if (openIdx === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenIdx(null);
      if (e.key === "ArrowRight") setOpenIdx((i) => (i === null ? i : (i + 1) % images.length));
      if (e.key === "ArrowLeft") setOpenIdx((i) => (i === null ? i : (i - 1 + images.length) % images.length));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIdx, images.length]);

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
            <button
              key={index}
              type="button"
              onClick={() => setOpenIdx(index)}
              className="relative overflow-hidden rounded shadow-md aspect-square bg-white cursor-zoom-in group"
              aria-label={`Open ${img.alt}`}
            >
              <img
                src={img.url}
                alt={img.alt}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </button>
          ))}
        </div>
      )}

      {openIdx !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setOpenIdx(null)}
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setOpenIdx(null); }}
            aria-label="Close"
            className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl leading-none"
          >
            ✕
          </button>
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setOpenIdx((i) => (i === null ? i : (i - 1 + images.length) % images.length)); }}
                aria-label="Previous"
                className="absolute left-4 md:left-8 text-white/80 hover:text-white text-4xl md:text-5xl"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setOpenIdx((i) => (i === null ? i : (i + 1) % images.length)); }}
                aria-label="Next"
                className="absolute right-4 md:right-8 text-white/80 hover:text-white text-4xl md:text-5xl"
              >
                ›
              </button>
            </>
          )}
          <img
            src={images[openIdx].url}
            alt={images[openIdx].alt}
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-[90vh] object-contain"
          />
        </div>
      )}
    </div>
  );
}
