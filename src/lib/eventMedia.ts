import { supabase } from "@/integrations/supabase/app-client";

const BUCKET = "event-media";

export async function uploadEventCover(file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `covers/${crypto.randomUUID()}.${ext}`;

  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: "31536000", upsert: false, contentType: file.type });
  if (upErr) throw upErr;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  if (!data?.publicUrl) throw new Error("Could not resolve public URL");
  return data.publicUrl;
}
