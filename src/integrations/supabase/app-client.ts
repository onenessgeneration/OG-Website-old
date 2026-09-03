// Hand-written Supabase client pinned to the project's own Supabase instance.
// This bypasses the Lovable-managed VITE_SUPABASE_* env vars so the preview,
// local dev, and Vercel all connect to the same backend.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = "https://dpqmjmifmndicuruviaz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_X9kYjwMwzUjZ4mxy4LhhHg_dl1msccz";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: typeof window !== "undefined" ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const APP_SUPABASE_URL = SUPABASE_URL;
export const APP_SUPABASE_PUBLISHABLE_KEY = SUPABASE_PUBLISHABLE_KEY;
