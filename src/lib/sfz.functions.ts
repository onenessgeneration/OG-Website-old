import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

function serverSupabase() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    },
  );
}

async function queryEvents(type: "upcoming" | "past", limit: number) {
  const supabase = serverSupabase();
  const nowIso = new Date().toISOString();
  let query = supabase
    .from("sfz_events")
    .select("id, event_name, event_short_description, cover_url, location, location_type, start_at, end_at")
    .eq("published", true);
  if (type === "upcoming") {
    query = query.gte("start_at", nowIso).order("start_at", { ascending: true });
  } else {
    query = query.lt("start_at", nowIso).order("start_at", { ascending: false });
  }
  const { data: rows, error } = await query.limit(limit);
  if (error) return [];
  return rows ?? [];
}

export const getSfzEvents = createServerFn({ method: "GET" })
  .inputValidator((input) => z.object({ type: z.enum(["upcoming", "past"]) }).parse(input))
  .handler(async ({ data }) => queryEvents(data.type, 3));

export const getAllSfzEvents = createServerFn({ method: "GET" })
  .inputValidator((input) => z.object({ type: z.enum(["upcoming", "past"]) }).parse(input))
  .handler(async ({ data }) => queryEvents(data.type, 100));

const requestSchema = z.object({
  group_name: z.string().trim().min(1).max(200),
  contact_name: z.string().trim().min(1).max(200),
  contact_phone: z.string().trim().regex(/^\d{7,15}$/, "Enter a valid phone number"),
  contact_email: z.string().trim().email().max(255),
  group_size: z.coerce.number().int().min(1).max(10000),
  date_requested: z.string().min(1),
  attendance_type: z.enum(["in_person", "online"]),
  location: z.string().trim().max(300).optional().nullable(),
  preferred_time: z.string().trim().max(100).optional().nullable(),
  notes: z.string().trim().max(2000).optional().nullable(),
});

export const submitSfzRequest = createServerFn({ method: "POST" })
  .inputValidator((input) => requestSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
    );
    const { error } = await supabase.from("sfz_session_requests").insert({
      group_name: data.group_name,
      contact_name: data.contact_name,
      contact_phone: data.contact_phone,
      contact_email: data.contact_email,
      group_size: data.group_size,
      date_requested: data.date_requested,
      attendance_type: data.attendance_type,
      location: data.location ?? null,
      preferred_time: data.preferred_time ?? null,
      notes: data.notes ?? null,
    });
    if (error) throw new Error("Could not submit request. Please try again.");
    return { ok: true };
  });
