import { supabase } from "@/integrations/supabase/app-client";
import { uploadToSiteMediaPath } from "@/lib/siteMedia";

export type Testimonial = {
  id: string;
  participant: string;
  location: string | null;
  tag: string | null;
  actual_testimonial: string;
  quote: string | null;
  image_url: string | null;
  visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Trainer = {
  id: string;
  name: string;
  location: string | null;
  image_url: string | null;
  bio: string | null;
  visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export async function uploadTestimonialImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  return uploadToSiteMediaPath(`people/testimonials/${crypto.randomUUID()}.${ext}`, file);
}

export async function uploadTrainerImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  return uploadToSiteMediaPath(`people/trainers/${crypto.randomUUID()}.${ext}`, file);
}

/**
 * Public fetchers — respect RLS "visible = true" policy.
 */
export async function fetchVisibleTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("visible", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Testimonial[];
}

export async function fetchVisibleTrainers(): Promise<Trainer[]> {
  const { data, error } = await supabase
    .from("trainers")
    .select("*")
    .eq("visible", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Trainer[];
}
