## SFZ Events polish + full-list pages

### 1. Video: autoplay muted, click to unmute
In `src/routes/sfz.tsx`, replace both `<video>` tags with a small `SfzVideo` component:
- `autoPlay muted loop playsInline` attributes so it plays silently on load (required for browser autoplay policy).
- Local `muted` state; clicking the video toggles `muted` (unmute on first click, re-mute on second). Keep native `controls` off to match the original look, but expose a small speaker icon (Volume2 / VolumeX from lucide) in the corner as the affordance. Cursor set to pointer.

### 2. Events sections restyled to match screenshot
Rework `EventsSection` in `src/routes/sfz.tsx`:
- Header row: left-aligned title (`SFZ Upcoming Events` / `SFZ Past Events`) and a right-aligned **Explore All** pill button (brown bg, `ArrowUpRight` icon) linking to `/allUpcoming-sfz-events` or `/allPast-sfz-events`.
- Empty state: centered brown text "Currently No Upcoming Events" / "Currently No Past Events" (matches screenshot).
- Event cards restyled:
  - Cover image on top with a floating month/day badge in the top-right (white pill, `Mon` above `DD`).
  - Title below (bold, line-clamp-2).
  - Short description (line-clamp-3).
  - Footer row with `MapPin` + location and `Clock` + `HH:MM - HH:MM`.
  - Centered brown **View** pill with `ArrowUpRight` at the bottom.

### 3. Seed one mock past event
Migration inserts a single row into `sfz_events` with `start_at` ~30 days ago, `published = true`, a placeholder cover URL (use one of the existing gallery asset URLs), location "Bangalore, India", and descriptive short text so the Past Events grid isn't empty.

### 4. New full-list routes
Create `src/routes/allUpcoming-sfz-events.tsx` and `src/routes/allPast-sfz-events.tsx`. Each:
- `PageHero` with title.
- Search input (filters by `event_name` / `location`, client-side over the fetched list).
- Optional location-type filter dropdown (All / In-person / Online).
- Same card grid as the SFZ page (reuse the extracted `EventCard`).
- Fetches via a new `getAllSfzEvents({ type })` server fn that returns up to 100 rows (no limit(12) cap).

Extract `EventCard` into `src/components/sfz/EventCard.tsx` so both the SFZ page and the two list pages share it.

### 5. Head metadata
Each new route gets its own `head()` with unique title/description/OG tags.

### Files touched
- edit `src/routes/sfz.tsx` (video component, restyled section, "Explore All" links)
- create `src/components/sfz/EventCard.tsx`
- create `src/components/sfz/SfzVideo.tsx`
- edit `src/lib/sfz.functions.ts` (add `getAllSfzEvents`)
- create `src/routes/allUpcoming-sfz-events.tsx`
- create `src/routes/allPast-sfz-events.tsx`
- new migration: insert 1 mock past event

### Out of scope
- Individual event detail pages (`/view-sfz-event/:id`) — the View button will link to `#` for now, or I can wire it to a detail route if you want.
- Admin UI to manage events.
- Server-side full-text search (client-side filter over ≤100 rows is fine for now).

### Question
The runtime error "Element type is invalid… got: object" on `/sfz` is likely from the `react-slick` default-export shape under SSR. I'll fix it in the same pass (dynamic import or `.default` fallback) — flagging so you know it'll change alongside the requested work.
