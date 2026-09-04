# Oneness Generation — Website

Public website for **Oneness Generation**, a community of young people moving towards
stress-free living through meditation, yoga, and self-development programs.

---

# Part A — For humans (non-technical)

This section is for people who want to understand, run, or update the website without
digging into code. If you are a developer or an AI working on the code, read **Part B**
below instead.

## What this website is

A public marketing/content site with these main areas:

- **Program pages** — SFZ, Soul Sync, Serene Mind, Oneness Yoga, Summer Camp, and more.
- **Blog** — public articles; logged-in users can submit posts that an admin approves.
- **Gallery & Wallpapers** — photo and wallpaper media pages.
- **Event listings** — SFZ events, split automatically into upcoming vs. past by date.
- **Contact, Get Involved, Request a Session** — public forms that land in an inbox.
- **Account** — a simple dashboard for logged-in users.

## Where the site lives

- **Production website:** Vercel
- **Backend / database / storage / sign-in:** Supabase (project "OG Website")
- **Development:** [Lovable](https://lovable.dev) — code is edited in Lovable, synced to
  GitHub, and deployed to Vercel.

**None of this is hosted on Lovable's servers.** The website, its database, and its files
all run on your own Vercel and Supabase accounts.

## What is an "admin"?

Admins are people who manage the site content through the website itself — no code needed.

- Sign in with the admin email address, then visit **/admin**.
- From there you can manage events, approve blog posts, change images/videos, add
  testimonials and trainers, and manage the gallery.
- Everything an admin edits updates the live site immediately.

## Where the pictures and videos live

All site images and videos are stored in the project's own storage (the `site-media`
bucket) and managed through the **Site Media** admin page (**/admin/site-media**). There
you can:

- Upload new images/videos (including bulk-uploading several at once).
- **Select from database** — pick any file that is already stored and assign it to a spot.
- See, grouped by page, exactly which spot on the website each file belongs to.

**How you know what goes where:** whenever a spot has no image yet, the live page shows a
placeholder with that spot's **ID written on it** (e.g. `home-banner-poster`). Find the
same ID on the Site Media page, upload a file to it, and the real picture appears.

**One limit to know:** on the free Supabase plan each individual file upload is limited to
**50 MB**. The upload form will warn you if a file is too big.

## The most common tasks

| I want to… | What I do |
|---|---|
| Change a banner image/video or logo | Go to **/admin/site-media** |
| Reuse an image that's already uploaded | **/admin/site-media** → "select from database" |
| Add photos to the gallery | **/admin/gallery** (can upload several at once) |
| Add or edit an event | **/admin/events/new** |
| Approve a submitted blog post | **/admin/blog** |
| Add a trainer or testimonial | **/admin/trainers**, **/admin/testimonials** |
| Update the text or styling | Ask someone using Lovable to change it (see Part B) |

---

# Part B — For developers & AIs (technical)

This section is for people (or AI agents) making code changes. Read it fully before
editing — there are important rules that will save you from breaking things.

## 1. Tech stack

| Layer | Technology |
|---|---|
| Framework | TanStack Start v1 (React 19, SSR, file-based routing) |
| Build tool | Vite 7 |
| Styling | Tailwind CSS v4 (tokens in `src/styles.css`, no `tailwind.config.js`) |
| UI primitives | shadcn/ui (`src/components/ui/`), lucide-react icons |
| Data fetching | TanStack Query + route loaders |
| Backend | Supabase: Postgres (tables + RLS), Auth, Storage |
| Fonts | Poppins (headings), Montserrat (body) — loaded via `<link>` in `src/routes/__root.tsx` |

**Do not** add `react-router-dom`, `src/pages/`, or an `App.tsx` switcher — routing is
TanStack file-based only. Never edit `src/routeTree.gen.ts` (it is generated).

## 2. Architecture at a glance

```
src/
├─ routes/                  File-based routes (one file per page)
│  ├─ __root.tsx            Shell: header, footer, fonts, favicon, global head() meta
│  ├─ index.tsx             Homepage
│  ├─ sfz.tsx, soul-sync.tsx, serene-mind.tsx, ...   Program/content pages
│  ├─ blog.tsx, blog.$id.tsx, blog.submit.tsx        Public blog + post detail + user submission
│  ├─ gallery.tsx, wallpapers.tsx                    Media pages
│  ├─ admin.tsx / admin.*.tsx                        Admin CMS (see §6)
│  └─ login/register/forgot-password/reset-password/account.tsx   Auth pages
├─ components/              Shared components (SiteHeader, SiteFooter, home/*, sfz/*, admin/*)
├─ integrations/supabase/   Generated Supabase client + auth middleware (do NOT edit the generated files)
├─ lib/                     App helpers (media buckets, event helpers, server functions)
└─ styles.css               Tailwind v4 entry — theme tokens (brand colors) live here
```

**Brand colors** are Tailwind utilities from `@theme` tokens in `src/styles.css`:
`bg-tan` (#f9f4ea), `text-brown` (#b78036), `bg-tanAccent` (#cdad85),
`text-darkGreyBrown` (#605f4b), `bg-brightYellow` (#fff300), `bg-brightIndigo` (#6f00fe),
`bg-darkGrey` (#1b1d1e). Use these instead of hardcoded hex utilities.

## 3. Supabase connection (important!)

The app is wired to the project's **own** Supabase instance, **not** Lovable Cloud.

- The client is created in `src/integrations/supabase/app-client.ts` with the
  **hardcoded** project URL and publishable (anon) key:

  ```
  URL: https://dpqmjmifmndicuruviaz.supabase.co
  Key: sb_publishable_...  (publishable/anon key — safe for the browser)
  ```

- All browser code imports from `@/integrations/supabase/app-client`.
- Server functions (`createServerFn`) use the same hardcoded URL/key server-side.
- The Lovable-managed `VITE_SUPABASE_*` env vars are **not** used by the app at runtime.

**Never hardcode, log, or return the service-role key.** It is not available in Lovable
and must never be committed.

### Rules for changing the backend

**Lovable must never change the Supabase setup.** If a schema or storage change is needed,
the AI should hand you the SQL to run yourself in your own Supabase SQL editor — it must
not apply migrations to any Lovable-managed project. This applies to the user's own
Supabase as well: explain the change and let the maintainer run it.

The canonical schema lives in **`supabase/full-schema.sql`** — fully idempotent
(`IF NOT EXISTS` / `CREATE OR REPLACE` / `DROP ... IF EXISTS` + `CREATE`), safe to re-run
any number of times when iterating.

### Tables

| Table | Purpose | Access |
|---|---|---|
| `blog_posts` | Blog articles | public read if `published`; users submit drafts (`status = pending`); admins moderate |
| `sfz_events` | SFZ events (upcoming vs. past derived from `start_at`) | public read if `published`; admin CRUD |
| `sfz_session_requests` | "Request an SFZ session" form inbox | anyone inserts; admin reads |
| `gallery_items` | Gallery photos (`visible`, `sort_order`) | public read visible; admin CRUD |
| `wallpapers` | Wallpapers page | public read; admin CRUD |
| `testimonials` | Homepage testimonials slider (`visible`, `sort_order`) | public read visible; admin CRUD |
| `trainers` | SFZ "Our Team" trainers (`visible`, `sort_order`) | public read visible; admin CRUD |
| `contact_messages` | Contact form inbox | anyone inserts; admin reads |
| `newsletter_signups` | Newsletter signups | anyone inserts; admin reads |
| `profiles`, `user_roles` | User profiles + roles (`admin` / `user`) | self read; admin managed |

Admin checks go through the `has_role(auth.uid(), 'admin')` security-definer function —
roles always live in `user_roles`, never on the profile.

### Storage buckets

| Bucket | Used for |
|---|---|
| `site-media` | All static site imagery/video managed via the CMS (logo, heroes, pillar images, …). Uploads under `staging/` first, then assigned to slots. |
| `event-media` | SFZ event cover images (uploaded in the event form) |
| `blog-media` | Blog cover images |
| `gallery` | Gallery photos |

Images are served via `getPublicUrl`; write access is admin-only via RLS policies on
`storage.objects`. Supabase Free tier has a **50 MB per-file upload limit** — the CMS
surfaces and enforces this.

## 4. Authentication & roles

- Email/password auth (login/register/forgot/reset pages) via Supabase Auth.
- A trigger creates a `profiles` row on signup; a second trigger grants the `admin`
  role to the owner email once the address is confirmed (see `full-schema.sql`).
- Logged-in users can view `/account` and submit blog drafts at `/blog/submit`.
- Everything under `/admin/*` requires the `admin` role.

## 5. Site-media slot convention

Every replaceable image/video on the public pages renders through a slot component. When
a slot has no file yet, the page shows a placeholder with the **slot ID overlaid**, so an
admin can find exactly where it belongs in the CMS. Re-uploading to a slot overwrites the
same fixed path — consumers never change. Slots are grouped by page in `src/lib/siteMedia.ts`,
each with a description of where on the site it is used. Duplicate paths across slots are
rejected.

## 6. Admin CMS (on the website itself)

Entry point: **`/admin`** (visible after signing in as an admin).

| Page | What it does |
|---|---|
| `/admin/events` | List SFZ events (upcoming/past derived from `start_at`), publish/unpublish, delete |
| `/admin/events/new`, `/admin/events/$id` | Create/edit an event with cover-image upload into `event-media` |
| `/admin/site-media` | Manage **every static image/video on the site**. Slots are grouped by page, each shows its slot ID, current preview, 50 MB limit, upload, and **"select from database"** — a browser over all storage buckets/folders to reuse any existing file. "Bulk upload images" stages many files at once. |
| `/admin/blog` | Blog moderation queue: Pending / Approved / Rejected / All — approve & publish, reject, unpublish, delete |
| `/admin/testimonials` | Create, hide/unhide, reorder, delete homepage testimonials |
| `/admin/trainers` | Create, hide/unhide, reorder, delete SFZ trainers |
| `/admin/gallery` | Upload (single or bulk), hide/unhide, reorder, delete gallery photos |

## 7. Working on the site with Lovable

1. Open the project in Lovable and prompt changes in chat. Lovable edits the code and
   syncs to the connected GitHub repo automatically.
2. Vercel deploys from GitHub — merging/pushing to the production branch ships the change.
3. **Guidelines to give the AI (and follow yourself):**
   - Never modify the Supabase backend from Lovable tools. Ask for the SQL and run it
     manually in your own Supabase SQL editor. The reference script is
     `supabase/full-schema.sql` (idempotent).
   - Never edit generated files: `src/routeTree.gen.ts`,
     `src/integrations/supabase/client.ts`, `auth-attacher.ts`, `auth-middleware.ts`,
     `client.server.ts`, `types.ts`, `previewAuthStorage.ts`.
   - Every route needs its own `head()` with a unique title/description (SEO).
   - New static images/videos belong in the `site-media` bucket via the CMS — not
     committed to the repo and not hotlinked to Lovable's CDN (`/__l5e/` URLs only work
     inside Lovable's preview).
   - Use the brand color utilities from `src/styles.css`; fonts are Poppins/Montserrat.
4. **Favicon & header logo** are served from `public/logo.png` so they work on any host.

### Local development (optional)

```bash
bun install        # or npm install
bun run dev        # http://localhost:8080
```

The Supabase credentials are hardcoded in `app-client.ts`, so no `.env` is required
(`.env.example` documents the legacy env-var layout only).

## 8. Common tasks cheat sheet

| I want to… | Where |
|---|---|
| Add/edit an event | `/admin/events/new` |
| Change the homepage banner image/video, logos, program page heroes | `/admin/site-media` |
| Reuse an already-uploaded file for a slot | `/admin/site-media` → "select from database" |
| Add gallery photos | `/admin/gallery` (bulk upload supported) |
| Approve a submitted blog post | `/admin/blog` |
| Add a team trainer or testimonial | `/admin/trainers`, `/admin/testimonials` |
| Change brand colors or fonts | `src/styles.css` tokens / `__root.tsx` font links |
| Add a new page | New file in `src/routes/` (+ link from `SiteHeader`/`SiteFooter`) |
| Add a new database table | Write SQL by hand, run it in your Supabase SQL editor, keep `supabase/full-schema.sql` in sync |
