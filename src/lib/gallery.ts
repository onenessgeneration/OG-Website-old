import { supabase as typedSupabase } from "@/integrations/supabase/app-client";
import { assertUploadSize } from "@/lib/siteMedia";

// The generated Supabase types don't yet know about the extra gallery columns
// (visible, sort_order, storage_path) — cast to `any` for these queries.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase = typedSupabase as any;

const BUCKET = "gallery";

export type GalleryItem = {
  id: string;
  title: string | null;
  image_url: string;
  storage_path: string | null;
  category: string | null;
  visible: boolean;
  sort_order: number;
  created_at: string;
};

export async function uploadGalleryImage(file: File): Promise<{ url: string; path: string }> {
  assertUploadSize(file);
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `items/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  if (!data?.publicUrl) throw new Error("Could not resolve public URL");
  return { url: data.publicUrl, path };
}

export async function deleteGalleryStorage(path: string | null): Promise<void> {
  if (!path) return;
  await supabase.storage.from(BUCKET).remove([path]);
}

export async function fetchVisibleGallery(): Promise<GalleryItem[]> {
  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .eq("visible", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as GalleryItem[];
}

export async function fetchAllGallery(): Promise<GalleryItem[]> {
  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as GalleryItem[];
}
