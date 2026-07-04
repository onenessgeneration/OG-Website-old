# Self-Hosting Migration Guide

This guide moves the site off Lovable's managed backend + hosting onto
**your own Supabase project** and **your own frontend host**
(Cloudflare Pages recommended).

No data migration is required — this restores the schema only. You will
re-create your admin account by signing up with the seeded email.

---

## Prerequisites

- Node 20+ and [Bun](https://bun.sh/) installed locally
- A Supabase account with an empty project created
- The [Supabase CLI](https://supabase.com/docs/guides/cli) installed
  (`brew install supabase/tap/supabase` or see docs)
- A GitHub account with this repo pushed to it
- A Cloudflare account (for frontend hosting)

---

## Phase 1 — Configure your Supabase project

In the Supabase dashboard for your new project:

1. **Project Settings → API** — copy these three values, you will
   need them in Phase 3:
   - Project URL (`https://<ref>.supabase.co`)
   - `anon` / publishable key
   - `service_role` key *(keep private, never commit)*

2. **Authentication → Providers → Email** — make sure Email is
   **enabled**. Leave "Confirm email" **ON** — the admin-seeding
   trigger fires on email confirmation.

3. **Authentication → URL Configuration** — set:
   - **Site URL**: your production domain (e.g. `https://your-domain.com`)
     — or `http://localhost:8080` while you're only running locally
   - **Redirect URLs**: add every URL the app can be served from, e.g.
     - `http://localhost:8080/**`
     - `https://your-domain.com/**`
     - `https://*.pages.dev/**` *(if using Cloudflare Pages previews)*

---

## Phase 2 — Apply the database schema

The complete schema lives in `supabase/migrations/`. Pick ONE option:

### Option A — Supabase CLI (recommended)

From a local clone of this repo:

```bash
supabase login
supabase link --project-ref YOUR-PROJECT-REF
supabase db push
```

This runs every migration in `supabase/migrations/` in order.

### Option B — SQL editor

Open your Supabase project → **SQL Editor** → New query.
Paste the contents of `supabase/full-schema.sql` and run it.

### What gets created

- Enum `app_role` (`admin`, `user`)
- Tables: `profiles`, `user_roles`, `blog_posts`, `sfz_events`,
  `sfz_session_requests`, `gallery_items`, `wallpapers`,
  `contact_messages`, `newsletter_signups`
- Functions: `has_role()`, `handle_new_user()`, `grant_owner_admin()`, `set_updated_at()`
- Triggers on `auth.users` for auto-profile creation and admin seeding
- Row-Level Security policies + grants for `anon`, `authenticated`, `service_role`

### Create your admin account

1. Deploy the frontend (Phase 3 & 4) or run locally: `bun install && bun run dev`
2. Go to `/register` and sign up with **`christophuhl07@gmail.com`**
3. Click the confirmation link in the email
4. The `grant_owner_admin` trigger fires on confirmation and inserts
   an `admin` row into `user_roles` for you.

To change the seeded admin email, edit
`supabase/migrations/20260704103457_*.sql` before running Phase 2,
or manually insert a `user_roles` row after signup.

---

## Phase 3 — Configure environment variables

1. Copy `.env.example` to `.env` locally.
2. Fill in the values from Phase 1 (all six variables).
3. Test locally:

```bash
bun install
bun run dev
```

Visit `http://localhost:8080` — you should now be talking to
**your** Supabase, not Lovable Cloud.

> **Note.** If you keep editing in the Lovable web IDE, the in-editor
> preview will keep using Lovable Cloud's env vars regardless of your
> `.env` — Lovable manages that at the platform level. Your own
> deployment (below) is what actually talks to your Supabase.

---

## Phase 4 — Deploy the frontend

Recommended: **Cloudflare Pages** (matches the current Workers runtime).

### Cloudflare Pages

1. Cloudflare dashboard → **Workers & Pages** → Create → Pages → Connect to Git
2. Select this repo, choose the production branch
3. **Build settings**:
   - Framework preset: **None**
   - Build command: `bun run build`
   - Build output directory: `.output/public`
   - Root directory: `/`
4. **Environment variables** — add all six from `.env.example`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`
   - `SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Save and deploy. First build takes ~2 min.

### Custom domain

1. Cloudflare Pages → your project → Custom domains → Set up custom domain
2. Point your DNS at the assigned target
3. Once live, go back to Supabase → Auth → URL Configuration and add
   the domain to Site URL + Redirect URLs

### Alternatives

- **Vercel**: import repo, framework auto-detected as TanStack Start,
  add the same six env vars, deploy.
- **Netlify**: same flow.

---

## Phase 5 — Email deliverability (optional)

Supabase's default SMTP works for low volume but often lands in spam.
For production:

1. Sign up for [Resend](https://resend.com/) (free tier: 3k/mo)
2. Verify your sending domain
3. Supabase → Authentication → Emails → SMTP Settings → paste Resend creds
4. Customize the email templates in Authentication → Emails → Templates

---

## Phase 6 — After the switch

- The old Lovable Cloud backend keeps existing (it can't be disabled
  on this project) but nothing points at it anymore.
- You can keep using Lovable purely as an IDE that syncs to GitHub;
  Cloudflare Pages redeploys on every push to your production branch.
- To promote additional users to admin, run this in the SQL editor:

  ```sql
  INSERT INTO public.user_roles (user_id, role)
  SELECT id, 'admin' FROM auth.users WHERE email = 'someone@example.com';
  ```

  A proper admin CMS UI for this is a follow-up feature — ask when you're
  ready to build it.

---

## Troubleshooting

- **"Missing Supabase environment variables"** — env vars weren't set
  on the host. Re-check Cloudflare Pages → Settings → Environment variables
  and redeploy.
- **Sign-up succeeds but admin role isn't granted** — you signed up with
  a different email than the one seeded in the migration. Either use
  `christophuhl07@gmail.com`, edit the migration and re-run, or insert
  a `user_roles` row manually.
- **Confirmation email never arrives** — check Supabase Auth logs,
  verify Site URL is correct, and check your spam folder.
- **CORS errors from the browser** — the Site URL / Redirect URLs in
  Supabase must include the exact origin you're loading the app from.
