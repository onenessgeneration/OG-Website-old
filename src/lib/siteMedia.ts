import { supabase } from "@/integrations/supabase/app-client";

const BUCKET = "site-media";
const BASE = `https://dpqmjmifmndicuruviaz.supabase.co/storage/v1/object/public/${BUCKET}`;

/**
 * The Supabase free tier caps a single upload at 50 MB. We surface this in the
 * CMS UI AND enforce it client-side before hitting Storage — the API returns
 * a very generic error message otherwise.
 */
export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;
export const MAX_UPLOAD_LABEL = "50 MB";

export type SiteMediaKind = "image" | "video";

export type SiteMediaSlot = {
  /** Stable id used in admin UI and as the on-page "missing" label. */
  id: string;
  label: string;
  path: string; // path inside the bucket — must be unique across slots
  kind: SiteMediaKind;
  group: string;
  /** Where in the live site this slot is used, plain-english. */
  usage: string;
  aspect?: string; // for preview
  note?: string;
};

/**
 * Every image and video on every page runs through this list. When you add a
 * new image/video on the site, add a slot here and reference it via
 * <SiteImage path="..." /> or <SiteVideo path="..." /> so an admin can
 * replace it from /admin/site-media.
 *
 * Group by page — the CMS renders one section per group and each slot shows
 * a "used on…" hint so admins know where every slot appears.
 */
export const SITE_MEDIA_SLOTS: SiteMediaSlot[] = [
  // ── Brand ────────────────────────────────────────────────────────────────
  {
    id: "logo",
    label: "Site logo",
    path: "logo.png",
    kind: "image",
    group: "Brand",
    usage: "Header, browser tab and social preview across every page.",
    aspect: "1/1",
    note: "PNG with transparent background.",
  },

  // ── Home page ────────────────────────────────────────────────────────────
  {
    id: "home-banner-poster",
    label: "Home banner — poster image",
    path: "home/banner-poster.jpg",
    kind: "image",
    group: "Home page",
    usage: "Top hero banner on the home page (behind the Play button, shown until the visitor plays the video).",
    aspect: "16/9",
  },
  {
    id: "home-banner-video",
    label: "Home banner — intro video",
    path: "home/banner-video.mp4",
    kind: "video",
    group: "Home page",
    usage: "The 'What is Oneness Generation?' video that plays when a visitor clicks the Play button on the home hero.",
    aspect: "16/9",
  },
  {
    id: "home-vision-image",
    label: "Vision section image",
    path: "home/vision.jpg",
    kind: "image",
    group: "Home page",
    usage: "Photo next to the 'Vision' block on the home page.",
    aspect: "4/5",
  },
  {
    id: "home-upcoming-event-bg",
    label: "'What's new' banner image",
    path: "home/upcoming-event-bg.jpg",
    kind: "image",
    group: "Home page",
    usage: "Background photo of the 'What's new?' / SFZ training strip on the home page.",
    aspect: "16/9",
  },
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `home-collage-${i + 1}`,
    label: `Vision collage image ${i + 1}`,
    path: `home/collage/${i + 1}.jpg`,
    kind: "image" as const,
    group: "Home page",
    usage: `Image ${i + 1} in the 6-photo collage below the Vision block on the home page.`,
    aspect: "1/1",
  })),

  // ── About Us page ────────────────────────────────────────────────────────
  {
    id: "about-whoweare",
    label: "Who We Are photo",
    path: "about/whoweare.jpg",
    kind: "image",
    group: "About Us page",
    usage: "'Who We Are' section image on the About Us page.",
    aspect: "4/3",
  },
  {
    id: "about-magic-switch",
    label: "The Magic Switch photo",
    path: "about/magicswitch.jpg",
    kind: "image",
    group: "About Us page",
    usage: "'Vision — Empowering Young Minds' section image on the About Us page.",
    aspect: "4/3",
  },
  {
    id: "about-vision",
    label: "Beta to Alpha photo",
    path: "about/vision.jpg",
    kind: "image",
    group: "About Us page",
    usage: "'The Magic Switch: Beta to Alpha' section image on the About Us page.",
    aspect: "4/3",
  },
  {
    id: "about-oneness",
    label: "Oneness — Guided by Wisdom photo",
    path: "about/oneness.jpg",
    kind: "image",
    group: "About Us page",
    usage: "'Oneness — Guided by Wisdom' section image on the About Us page.",
    aspect: "4/3",
  },

  // ── Programs page ───────────────────────────────────────────────────────
  {
    id: "programs-sfz",
    label: "SFZ program card",
    path: "programs/sfz.jpg",
    kind: "image",
    group: "Programs page",
    usage: "Slide 1 (Get trained in SFZ) in the top slider on the Programs page.",
    aspect: "16/9",
  },
  {
    id: "programs-sky",
    label: "SKY program card",
    path: "programs/sky.jpg",
    kind: "image",
    group: "Programs page",
    usage: "Slide 2 (SKY monthly) in the top slider on the Programs page.",
    aspect: "16/9",
  },
  {
    id: "programs-breakthrough",
    label: "Breakthrough program card",
    path: "programs/breakthrough.jpg",
    kind: "image",
    group: "Programs page",
    usage: "Slide 3 (Breakthrough) in the top slider on the Programs page.",
    aspect: "16/9",
  },
  {
    id: "programs-youth",
    label: "Oneness Youth Festival card",
    path: "programs/youth.jpg",
    kind: "image",
    group: "Programs page",
    usage: "Slide 4 (Oneness Youth Festival) in the top slider on the Programs page.",
    aspect: "16/9",
  },

  // ── Serene Mind page ────────────────────────────────────────────────────
  {
    id: "serene-hero",
    label: "Serene Mind hero",
    path: "serene-mind/hero.jpg",
    kind: "image",
    group: "Serene Mind page",
    usage: "Full-bleed hero image AND parallax background on the Serene Mind page.",
    aspect: "3/4",
  },

  // ── Oneness Yoga page ───────────────────────────────────────────────────
  {
    id: "yoga-hero",
    label: "Oneness Yoga hero",
    path: "oneness-yoga/hero.jpg",
    kind: "image",
    group: "Oneness Yoga page",
    usage: "Hero image AND parallax background on the Oneness Yoga page.",
    aspect: "3/4",
  },
  ...(["corpse", "exercise", "meditation", "yoga-pose", "yoga-pose2", "yoga-position"] as const).map(
    (name, i) => ({
      id: `yoga-icon-${name}`,
      label: `Oneness Yoga icon ${i + 1}`,
      path: `oneness-yoga/icons/${name}.png`,
      kind: "image" as const,
      group: "Oneness Yoga page",
      usage: `Icon next to bullet point ${i + 1} in the 'Why Oneness Yoga?' list.`,
      aspect: "1/1",
      note: "PNG with transparent background works best.",
    }),
  ),

  // ── SFZ page ────────────────────────────────────────────────────────────
  {
    id: "sfz-hero",
    label: "SFZ hero image",
    path: "sfz/hero.jpg",
    kind: "image",
    group: "SFZ page",
    usage: "Hero image at the top of the SFZ page (framed by two dark bars).",
    aspect: "16/9",
  },
  {
    id: "sfz-video",
    label: "SFZ program video",
    path: "sfz/program.mp4",
    kind: "video",
    group: "SFZ page",
    usage: "Video shown alongside the SFZ program modules (right column desktop / above modules mobile).",
    aspect: "9/16",
    note: "Distinct from the Soul Sync video. Upload the SFZ Official Video here.",
  },

  // ── Soul Sync page ──────────────────────────────────────────────────────
  {
    id: "soul-sync-video",
    label: "Soul Sync hero video",
    path: "soul-sync/hero.mp4",
    kind: "video",
    group: "Soul Sync page",
    usage: "Full-screen video at the top of the Soul Sync page (that shrinks as you scroll).",
    aspect: "16/9",
  },
  {
    id: "soul-sync-intro",
    label: "Soul Sync intro image",
    path: "soul-sync/intro.jpg",
    kind: "image",
    group: "Soul Sync page",
    usage: "Still image shown right after the pillar cards, between 'From Beta to Alpha' and the closing sections.",
    aspect: "16/9",
    note: "This is a still image (not a video) — it's a different slot from the hero video above.",
  },
  {
    id: "soul-sync-parallax",
    label: "Soul Sync parallax image",
    path: "soul-sync/parallax.jpg",
    kind: "image",
    group: "Soul Sync page",
    usage: "Tall parallax background behind 'From Beta to Alpha: Experience the Beautiful State'.",
    aspect: "3/4",
  },
  ...(["mudra", "mantra", "asana", "pranayama", "dharana", "bhavana"] as const).map((name) => ({
    id: `soul-sync-pillar-${name}`,
    label: `Pillar — ${name[0].toUpperCase()}${name.slice(1)}`,
    path: `soul-sync/pillars/${name}.jpg`,
    kind: "image" as const,
    group: "Soul Sync page",
    usage: `Photo inside the '${name[0].toUpperCase()}${name.slice(1)}' pillar card on the Soul Sync page.`,
    aspect: "4/3",
  })),

  // ── Contact page ────────────────────────────────────────────────────────
  {
    id: "contact-image",
    label: "Contact photo",
    path: "contact/hero.jpg",
    kind: "image",
    group: "Contact page",
    usage: "Photo shown next to the 'Let's Connect' form on the Contact Us page.",
    aspect: "3/4",
  },

  // ── Get Involved page ───────────────────────────────────────────────────
  {
    id: "get-involved-image",
    label: "Get Involved photo",
    path: "get-involved/hero.jpg",
    kind: "image",
    group: "Get Involved page",
    usage: "Photo shown next to the newsletter signup form on the Get Involved page.",
    aspect: "4/3",
  },

  // ── Summer Camp page ────────────────────────────────────────────────────
  {
    id: "summer-camp-banner",
    label: "Summer Camp banner",
    path: "summer-camp/banner.jpg",
    kind: "image",
    group: "Summer Camp page",
    usage: "Full-width banner at the top of the Summer Camp Events page.",
    aspect: "16/9",
  },
];

// Runtime sanity check — duplicate paths would silently make two CMS slots
// overwrite each other, which is exactly what the admin was seeing before.
{
  const seen = new Set<string>();
  for (const s of SITE_MEDIA_SLOTS) {
    if (seen.has(s.path)) {
      throw new Error(`SITE_MEDIA_SLOTS has duplicate path "${s.path}" — every slot must be unique.`);
    }
    seen.add(s.path);
  }
}

export function siteMediaUrl(path: string): string {
  // Cache-bust via a version query so replaced files show up quickly.
  // Uses date-hour granularity so browsers still cache within the hour.
  const v = Math.floor(Date.now() / (1000 * 60 * 60));
  return `${BASE}/${path}?v=${v}`;
}

export function assertUploadSize(file: File) {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(
      `File is ${(file.size / (1024 * 1024)).toFixed(1)} MB. Maximum upload size is ${MAX_UPLOAD_LABEL}.`,
    );
  }
}

export async function uploadSiteMedia(slot: SiteMediaSlot, file: File): Promise<void> {
  assertUploadSize(file);
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(slot.path, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type,
    });
  if (error) throw error;
}

/**
 * Copy a gallery image (by public URL) into a site-media slot. The gallery
 * bucket is separate, so we download the bytes and re-upload at the slot's
 * fixed path — this keeps every consumer of the slot working unchanged.
 */
export async function copyUrlToSiteMedia(slot: SiteMediaSlot, url: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Could not fetch source image (${res.status})`);
  const blob = await res.blob();
  if (blob.size > MAX_UPLOAD_BYTES) {
    throw new Error(
      `Source is ${(blob.size / (1024 * 1024)).toFixed(1)} MB. Maximum is ${MAX_UPLOAD_LABEL}.`,
    );
  }
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(slot.path, blob, {
      cacheControl: "3600",
      upsert: true,
      contentType: blob.type || "image/jpeg",
    });
  if (error) throw error;
}

export async function deleteSiteMedia(slot: SiteMediaSlot): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).remove([slot.path]);
  if (error) throw error;
}

/**
 * Generic upload into the site-media bucket at an arbitrary path. Used by the
 * testimonials and trainers admin pages for per-row photos.
 */
export async function uploadToSiteMediaPath(path: string, file: File): Promise<string> {
  assertUploadSize(file);
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: "31536000",
      upsert: true,
      contentType: file.type,
    });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  if (!data?.publicUrl) throw new Error("Could not resolve public URL");
  return data.publicUrl;
}

// ── Staging area inside site-media bucket ───────────────────────────────
// Bulk-uploaded images that haven't been assigned to a slot yet. Kept in the
// same bucket so nothing crosses buckets when picking one for a slot.
const STAGING_PREFIX = "staging";

export type StagingItem = {
  name: string; // filename inside staging/
  path: string; // full bucket path (staging/<name>)
  url: string;  // public URL
  createdAt?: string;
};

export async function uploadStagingImage(file: File): Promise<StagingItem> {
  assertUploadSize(file);
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const safeBase = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9-_]+/g, "-").slice(0, 60) || "image";
  const name = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${safeBase}.${ext}`;
  const path = `${STAGING_PREFIX}/${name}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { name, path, url: data.publicUrl };
}

export async function listStagingImages(): Promise<StagingItem[]> {
  const { data, error } = await supabase.storage.from(BUCKET).list(STAGING_PREFIX, {
    limit: 1000,
    sortBy: { column: "created_at", order: "desc" },
  });
  if (error) throw error;
  return (data ?? [])
    .filter((f) => f.name && !f.name.endsWith("/"))
    .map((f) => {
      const path = `${STAGING_PREFIX}/${f.name}`;
      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
      return { name: f.name, path, url: pub.publicUrl, createdAt: f.created_at ?? undefined };
    });
}

export async function deleteStagingImage(path: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw error;
}

/**
 * Copy a staging file (already in this bucket) to a slot path. Uses download+
 * upload because Supabase Storage has no server-side copy in the JS client
 * and slot paths often differ in extension.
 */
export async function copyStagingToSlot(slot: SiteMediaSlot, stagingPath: string): Promise<void> {
  return copyStorageObjectToSlot(slot, BUCKET, stagingPath);
}

// ── Full storage browser (any bucket, any folder) ───────────────────────

export type StorageBucketInfo = { id: string; name: string; public: boolean };

export type StorageEntry = {
  name: string;
  path: string; // full path inside its bucket
  bucket: string;
  isFolder: boolean;
  url?: string; // for files, a public URL (may 404 on private buckets)
  size?: number;
  createdAt?: string;
};

export async function listStorageBuckets(): Promise<StorageBucketInfo[]> {
  const { data, error } = await supabase.storage.listBuckets();
  if (error) throw error;
  return (data ?? []).map((b) => ({ id: b.id, name: b.name, public: !!b.public }));
}

/**
 * List everything at `prefix` inside `bucket`. Folders come first (alpha),
 * then files (newest first). `prefix` should be "" for bucket root or
 * "some/folder" (no leading/trailing slash).
 */
export async function listStorageEntries(bucket: string, prefix: string): Promise<StorageEntry[]> {
  const { data, error } = await supabase.storage.from(bucket).list(prefix || undefined, {
    limit: 1000,
    sortBy: { column: "name", order: "asc" },
  });
  if (error) throw error;
  const entries: StorageEntry[] = [];
  for (const item of data ?? []) {
    if (!item.name) continue;
    const fullPath = prefix ? `${prefix}/${item.name}` : item.name;
    // Supabase returns folders as rows with id === null / no metadata
    const isFolder = item.id === null || (!item.metadata && !("mimetype" in (item as object)));
    if (isFolder) {
      entries.push({ name: item.name, path: fullPath, bucket, isFolder: true });
    } else {
      const { data: pub } = supabase.storage.from(bucket).getPublicUrl(fullPath);
      entries.push({
        name: item.name,
        path: fullPath,
        bucket,
        isFolder: false,
        url: pub.publicUrl,
        size: (item.metadata as { size?: number } | null)?.size,
        createdAt: item.created_at ?? undefined,
      });
    }
  }
  entries.sort((a, b) => {
    if (a.isFolder !== b.isFolder) return a.isFolder ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  return entries;
}

/** Copy any storage object (any bucket) into a site-media slot. */
export async function copyStorageObjectToSlot(
  slot: SiteMediaSlot,
  sourceBucket: string,
  sourcePath: string,
): Promise<void> {
  const { data, error } = await supabase.storage.from(sourceBucket).download(sourcePath);
  if (error) throw error;
  if (data.size > MAX_UPLOAD_BYTES) {
    throw new Error(`Source is ${(data.size / (1024 * 1024)).toFixed(1)} MB. Maximum is ${MAX_UPLOAD_LABEL}.`);
  }
  const { error: upErr } = await supabase.storage.from(BUCKET).upload(slot.path, data, {
    cacheControl: "3600",
    upsert: true,
    contentType: data.type || "image/jpeg",
  });
  if (upErr) throw upErr;
}
