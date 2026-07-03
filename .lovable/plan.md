## SFZ page — remaining sections

### 1. Icons (Lucide)

Replace placeholder circles in `WhyChooseSFZ` and `Tools`:

- Why Choose SFZ:
  - Long-term solution for unwanted emotions → `Waves`
  - Self-love → `Heart`
  - Uncover the secrets of focus → `Target`
- Tools row:
  - Tools Used → `Wrench`
  - What Are The Outcomes? → `TrendingUp`
  - Your Teacher → `GraduationCap`

Keep the amber-50 circle chip from the original.

### 2. New sections added to `src/routes/sfz.tsx` (in this order after `Tools`)

**A. Our Team** — sideways carousel using slick (`react-slick`, already imported via slick css). Fetches up to 7 trainers from a new `sfz_trainers` fallback... actually, no backend trainers exist yet, so render 6 placeholder trainer cards with the same odd/even vertical stagger (`mt-12` / `mb-12`), circular avatar placeholders, name, location w/ `MapPin` icon. "See All" button (`bg-brown`) links to `/trainer` (route not yet created — button-only for now, no navigation error since it's an `<a href>`).

**B. Request an SFZ Session CTA** — center-aligned block: `"Now you can request an SFZ Session"` heading + `bg-brown` pill button linking to new route `/request-sfz` with `ArrowUpRight` icon. Matches original spacing (`mt-24 space-y-5`).

**C. Partnership** — restyled from current: left column keeps text + heading. Right column becomes a 2-up logo panel — two labeled placeholder tiles side-by-side (`VoiceUp` and `Oneness Generation`) in bordered white cards on a tan background band, so the logo swap is trivial later. Mobile stacks logos above text as before.

**D. SFZ Upcoming Events** — heading `bg-tan` band, grid of event cards from Supabase table `sfz_events` filtered `event_type='upcoming'` (or start_date >= today). Card: cover image, title (2-line clamp), short description (3-line clamp), location w/ `MapPin`, time range w/ `Clock`, "View" pill button. Renders empty-state text when no rows.

**E. SFZ Past Events** — same card layout, filtered to past events. Empty state when none.

### 3. New route `src/routes/request-sfz.tsx`

Port the original `RequestSFZSession` form:

- Fields (2-col grid on md+): group/organization, contact name, phone (10 digits), email, group size, date requested, attendance type (radio: in-person / online), location (if in-person), preferred time, additional notes.
- Validation: zod schema, react-hook-form.
- Submit: `createServerFn` inserts into new `sfz_session_requests` Supabase table (public INSERT policy, no SELECT for anon).
- Success: toast + `navigate({ to: "/sfz" })`. Back arrow (`ArrowLeft`) in top-left.
- Styling: `max-w-5xl mx-auto bg-white rounded-xl shadow p-6 my-8`, `text-tanAccent` header — matches original.

### 4. Database migrations (single migration)

```sql
-- sfz_events: publicly readable, admin-managed
CREATE TABLE public.sfz_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name text NOT NULL,
  event_short_description text,
  cover_url text,
  location text,
  location_type text,           -- 'in_person' | 'online' | 'hybrid'
  start_at timestamptz NOT NULL,
  end_at timestamptz,
  event_type text NOT NULL DEFAULT 'upcoming', -- 'upcoming' | 'past'
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.sfz_events TO anon, authenticated;
GRANT ALL ON public.sfz_events TO service_role;
ALTER TABLE public.sfz_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sfz_events public read" ON public.sfz_events
  FOR SELECT USING (published = true);

-- sfz_session_requests: anyone can submit, only service_role reads
CREATE TABLE public.sfz_session_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_name text NOT NULL,
  contact_name text NOT NULL,
  contact_phone text NOT NULL,
  contact_email text NOT NULL,
  group_size int NOT NULL,
  date_requested date NOT NULL,
  attendance_type text NOT NULL,
  location text,
  preferred_time text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.sfz_session_requests TO anon, authenticated;
GRANT ALL ON public.sfz_session_requests TO service_role;
ALTER TABLE public.sfz_session_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can submit sfz request" ON public.sfz_session_requests
  FOR INSERT WITH CHECK (true);
```

Both event lists start empty; the empty-state text keeps the page presentable until rows are added.

### 5. Files touched

- edit `src/routes/sfz.tsx` (Lucide icons in WhyChooseSFZ + Tools; new OurTeam, RequestCTA, restyled Partnership, SfzUpcomingEvents, SfzPastEvents sections; Supabase reads via `createServerFn` + TanStack Query per project pattern)
- create `src/lib/sfz.functions.ts` (`getSfzEvents({ type })`, `submitSfzRequest(payload)`)
- create `src/routes/request-sfz.tsx` (form page)
- migration: create `sfz_events` + `sfz_session_requests` tables with GRANTs and RLS as above

### Out of scope

- Real trainer data (placeholders only; no `sfz_trainers` table yet)
- Real VoiceUp / OG logos (labeled placeholders, swap later)
- `/trainer` and `/view-sfz-event/:id` detail routes
- Admin UI to manage events / view requests
