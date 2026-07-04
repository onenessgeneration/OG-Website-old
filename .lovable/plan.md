## Hosting & Backend Plan

### Where the site runs

The app is a **TanStack Start** project deployed on **Lovable's hosting** (Cloudflare Workers under the hood). No separate hosting service or DevOps is required — clicking **Publish** in Lovable ships the site.

Two URLs are provisioned automatically:
- **Preview URL** (auto-updates as we edit): `https://id-preview--...lovable.app`
- **Published URL** (updates only when you click Publish): `https://oneness-next-gen.lovable.app` (renameable)

A custom domain (e.g. `onenessgeneration.org`) can be attached later from Project Settings → Domains — no code changes needed. For now we keep the Lovable URL.

### Where the backend runs

Backend is **Lovable Cloud** (managed Postgres + Auth + Storage + Edge Functions, no separate account, no keys to manage). Already enabled and already holds the tables the site reads: `blog_posts`, `gallery_items`, `wallpapers`, `sfz_events`, `sfz_session_requests`, `contact_messages`, `newsletter_signups`.

Server code lives inside the same TanStack Start app (`createServerFn` for internal calls, server routes under `src/routes/api/public/` for webhooks). There is no separate backend server to deploy — the same **Publish** button ships both frontend and backend.

### What we still need to build

**1. Fix `/sfz` crash (prerequisite)**
`react-slick`'s default export is an object under SSR, breaking `<Slider>`. Load `react-slick` client-side only (via `ClientOnly` wrapper or dynamic client-only import) on `/sfz` and `/programs`. Same fix pattern for `NewTestimonials` on home if it ever hits SSR issues.

**2. Auth (email + password + Google)**
- Enable email/password + Google provider on Lovable Cloud.
- The existing `/login`, `/register`, `/forgot-password`, `/reset-password` pages already call the right APIs — no UI rewrite.
- Add a Google button on login/register that calls the Lovable OAuth broker.

**3. `profiles` table + roles**
- `profiles` table: `id` (FK → auth.users), `full_name`, `created_at`. Auto-populated by a `handle_new_user` trigger that reads `full_name` from signup metadata (already sent by `/register`).
- Separate `user_roles` table with an `app_role` enum (`admin`, `user`) and a `has_role(user_id, role)` security-definer function — the required pattern to avoid RLS recursion.
- Migration seeds `christophuhl07@gmail.com` as `admin` via a trigger that fires when that user confirms email (so no privilege-escalation risk).
- Admin UI can grant/revoke `admin` role to any user (RLS: only admins can insert into `user_roles`).

**4. Admin CMS (`/admin/*`, gated)**
New protected subtree `src/routes/_authenticated/admin/*` with a role gate (`has_role(uid, 'admin')`). Screens:
- **Dashboard** — counts, recent contact messages, recent signups.
- **SFZ Events** — list / create / edit / delete / publish toggle. Fields match `sfz_events` (name, description, cover, location, location_type, start_at, end_at, published).
- **Blog Posts** — list / create / edit / delete / publish toggle (title, excerpt, content, author, cover, published).
- **Gallery** — upload image → Cloud Storage, save row in `gallery_items` (title, category, image_url).
- **Wallpapers** — same as Gallery but for `wallpapers` bucket.
- **Session Requests** — read-only inbox of `sfz_session_requests` submissions.
- **Contact Messages** — read-only inbox of `contact_messages`.
- **Newsletter Signups** — read-only list of `newsletter_signups` with CSV export.
- **Users** — list users, grant/revoke `admin`.

Writes on `sfz_events`, `blog_posts`, `gallery_items`, `wallpapers` gated by `has_role(auth.uid(), 'admin')` in RLS. Reads on `contact_messages`, `sfz_session_requests`, `newsletter_signups`, `user_roles` are admin-only too.

**5. Storage buckets**
- `gallery` (public read) — for uploaded gallery photos.
- `wallpapers` (public read) — for uploaded wallpapers.
- `blog-covers` (public read) — for blog post covers.
- `event-covers` (public read) — for SFZ event covers.
Admin UI uploads via `supabase.storage.from(...).upload(...)`; public URL is stored in the corresponding table's `image_url`/`cover_url`.

**6. Video assets on the home page + `/sfz`**
The SFZ video already lives on the Lovable asset CDN. For a **home page banner video**, we'll upload the mp4 you provide via the same asset flow and wire it into `<Banner videoSrc={...} />` (the prop is already accepted).

**7. Publishing checklist**
Once the above lands: click **Publish** once to make the live site current. Frontend changes require re-publishing; backend (migrations, functions, RLS) deploys immediately.

### What I need from you next

1. Upload the home-page **banner video** file (drag it into chat).
2. Any **event / blog / gallery / wallpaper** starter content, or is it fine for you to add via the admin CMS after it's live?
3. Confirm the **admin CMS** should live at `/admin` (versus a hidden URL).

### Out of scope for this pass

- Custom domain hookup (do later from Project Settings).
- Rich-text editor for blog posts — first pass uses a plain textarea for Markdown/HTML; upgrade later if needed.
- Email notifications when someone submits contact / SFZ / newsletter forms — can add via Lovable Email as a follow-up.
- Migrating the ~193 MB of images in `src/assets/` to the CDN (unrelated to backend, but worth a separate skill run to shrink the repo).
