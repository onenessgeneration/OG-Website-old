
# Self-Hosting Migration Plan

Move both the backend (to your own Supabase project) and the frontend (off *.lovable.app to a host of your choice). No data preservation needed — schema and admin account only. Email/password auth only, no Google.

## Phase 1 — Prepare your Supabase project

You'll do this in your Supabase dashboard; I'll give you the exact steps and files.

1. **Grab three values** from your empty Supabase project (Project Settings → API):
   - Project URL (`https://<ref>.supabase.co`)
   - `anon` / publishable key
   - `service_role` key (keep private)
2. **Enable Email auth**, disable "Confirm email" only if you want instant sign-in — I recommend leaving email confirmation ON so the admin-seeding trigger works as designed (it fires on `email_confirmed_at`).
3. **Set the Site URL and Redirect URLs** to wherever the frontend will live (e.g. `http://localhost:8080`, your production domain, preview domains). This is what password reset & confirmation links point at.

## Phase 2 — Run the schema against your Supabase

Everything the app depends on is already in `supabase/migrations/*.sql` in the repo. To apply it to your project you have two options:

- **Option A (recommended): Supabase CLI.** From a local clone:
  ```
  supabase link --project-ref <your-ref>
  supabase db push
  ```
  This runs every migration file in order, giving you an identical schema: `profiles`, `user_roles`, `app_role` enum, `has_role()`, `handle_new_user` trigger, `grant_owner_admin` trigger (seeds `christophuhl07@gmail.com` as admin on email confirmation), plus `blog_posts`, `sfz_events`, `sfz_session_requests`, `gallery_items`, `wallpapers`, `contact_messages`, `newsletter_signups` with RLS + GRANTs.
- **Option B: paste the SQL manually.** I'll produce one consolidated SQL file combining every migration and you run it in your Supabase SQL editor.

After migrations, sign up with `christophuhl07@gmail.com` and confirm the email — the trigger auto-grants you admin.

## Phase 3 — Point the frontend at your Supabase

The Supabase client reads env vars. I'll change the env source so the app can be built against either backend without code changes.

- Update `.env.example` (and your local `.env`) with placeholders for your values:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`
  - `VITE_SUPABASE_PROJECT_ID`
  - Server-side: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Add a short `MIGRATION.md` documenting exactly which env vars to set on your chosen host.
- Note: while you're still building in Lovable, the current `.env` is auto-managed by Lovable Cloud. Overriding those variables only takes effect once you deploy outside Lovable — the in-editor preview will keep talking to the Cloud backend.

## Phase 4 — Frontend hosting

TanStack Start deploys to any Node or edge host. Best options:

- **Cloudflare Pages/Workers** — matches the current runtime (already Cloudflare Workers under the hood). Cheapest and closest to today's behavior.
- **Vercel** — simplest DX for TanStack Start.
- **Netlify** — also supported.

Recommended path: **Cloudflare Pages**, because the existing `wrangler.jsonc` already targets Workers.

Steps I'll write into `MIGRATION.md`:
1. Connect the GitHub repo to Cloudflare Pages.
2. Build command: `bun run build`; output as configured by the Vite/TanStack plugin.
3. Set the six env vars from Phase 3 in the Pages project.
4. Add your production domain in Cloudflare and set that same URL as Site URL in Supabase.

## Phase 5 — Auth email templates

Lovable Cloud was handling auth emails. On your own Supabase you have two choices:

- **Use Supabase's default SMTP** — fine for low volume, gets flagged as spam more often. Zero setup.
- **Bring your own SMTP** (Resend, SendGrid, Postmark, etc.) — configure in Supabase → Authentication → Emails → SMTP Settings, then customize the email templates.

Recommendation: start with default SMTP, switch to Resend later if deliverability matters.

## Phase 6 — Post-migration cleanup (optional)

Once the self-hosted version is confirmed working:

- Leave the Lovable Cloud backend as-is (it can't be disabled on this project).
- Stop editing in Lovable, or keep using Lovable purely as an IDE that syncs to GitHub — your published site won't touch it.
- Later, if you want to update via Lovable again, you'd need to re-add cloud env vars temporarily so the in-editor preview keeps working.

---

## Technical details

- **What I will change in code** (Phase 3): only `.env.example` and a new `MIGRATION.md`. No changes to `src/integrations/supabase/*` — those files are auto-generated and already read from env vars correctly.
- **What you will do manually**:
  - Create Supabase project settings (Site URL, redirects, email auth)
  - Run `supabase db push` OR paste consolidated SQL
  - Sign up as admin and confirm email
  - Create Cloudflare Pages (or Vercel) project, set env vars, connect repo
  - Point your DNS at the new host
- **Admin promotion after seed**: the current schema only auto-seeds *your* email. Promoting other users to admin is a separate feature (an admin CMS page) — we haven't built it yet. Do you want that in this migration, or as a follow-up once the self-host is live?

## Deliverables from me in build mode

1. Updated `.env.example` with the full list of required variables and comments explaining each.
2. New `MIGRATION.md` at repo root with copy-pasteable step-by-step instructions for Supabase setup, DB push, Cloudflare Pages deploy, and DNS.
3. Optional: a single consolidated `migrations/full-schema.sql` for users who prefer the SQL-editor path over the CLI.

Nothing in the runtime code needs to change for the migration itself.
