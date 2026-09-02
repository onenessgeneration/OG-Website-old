# Bring the new Supabase schema in line with the app

## Short answer

No — running `supabase/full-schema.sql` alone is **not enough**. That file is the oldest revision of the schema: it predates the blog moderation flow, the separate `testimonials` / `trainers` tables, and the `site-media` / `blog-media` / `gallery` storage setup. And simply running the migration files now would also not fully fix it (see "Why not just run the migrations").

## What is missing or wrong after running full-schema.sql


| Area                   | Problem on the new Supabase                                                                                                                                                                                                                                    | Visible symptom                                                                                                   |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `blog_posts`           | No `author_id` / `status` columns, no author insert/select policies                                                                                                                                                                                            | Submitting a blog post at `/blog/submit` fails (insert rejected by RLS / missing columns); admins cannot moderate |
| `testimonials`         | Table does not exist                                                                                                                                                                                                                                           | Homepage testimonials section and `/admin/testimonials` break                                                     |
| `trainers`             | Table does not exist                                                                                                                                                                                                                                           | SFZ "Our Team" section and `/admin/trainers` break                                                                |
| `sfz_session_requests` | Table was created with the **old** column set (`full_name`, `email`, `phone`, …), but the app inserts `group_name`, `contact_name`, `contact_phone`, `contact_email`, `group_size`, `date_requested`, `attendance_type`, `location`, `preferred_time`, `notes` | The "Request an SFZ session" form fails to submit                                                                 |
| Storage buckets        | `site-media`, `blog-media`, `gallery` buckets are not created (only `event-media` is)                                                                                                                                                                          | CMS uploads to those buckets fail; gallery/banner images cannot be stored                                         |
| Storage policies       | No RLS policies for `site-media`, `blog-media`, `gallery` objects                                                                                                                                                                                              | Uploads/writes through the CMS are blocked                                                                        |
| Bucket listing         | No "Admins can list buckets" policy on `storage.buckets`                                                                                                                                                                                                       | "Select from database" in `/admin/site-media` loads forever (known issue)                                         |
| `profiles`             | Missing `updated_at` column + trigger (minor parity gap)                                                                                                                                                                                                       | `account` updates won't stamp `updated_at`                                                                        |


## What we will do (after approval)

1. **Update `supabase/full-schema.sql**` so it is genuinely complete and idempotent, in this order:
  - `blog_posts`: add `author_id` + `status` columns, default `published` to `false`, add status check constraint, add owner-read and user-submit policies (keeps existing public-read + admin CRUD).
  - New `testimonials` and `trainers` tables with grants, RLS, visibility + admin policies, `updated_at` triggers, and sort indexes (mirrors migration `20260705213228`).
  - `profiles`: add `updated_at` column + trigger.
  - `sfz_session_requests`: align columns to what the app inserts — add the missing columns, drop the obsolete ones (ALTER-based, so it is safe even if a row exists; on the fresh DB there is no data).
  - Storage: create `site-media`, `blog-media`, `gallery` buckets (public, like `event-media`); add admin-write + public-read storage policies for all three; add the "Admins can list buckets" policy on `storage.buckets`.
2. **Update README.md**: state that `supabase/migrations/` is a historical record and `supabase/full-schema.sql` is the single source of truth to run on any new Supabase; keep the existing table/bucket documentation consistent.
3. **You run the updated `full-schema.sql**` in your Supabase SQL editor (standing rule: I never change your Supabase — I only hand you the SQL). Because the file is idempotent, re-running it over the current state is safe and just fills the gaps.
4. **Spot-check after running**: `/admin/site-media` ("select from database" should load buckets), `/admin/blog`, `/admin/testimonials`, `/admin/trainers`, submit a blog draft at `/blog/submit`, and submit the form at `/request-sfz`.

No application code changes are needed: `src/integrations/supabase/types.ts` already matches the target schema.

## Why not just run the migration scripts

- The files under `supabase/migrations/` are a **historical record**; several supersede each other, and the newest consolidated file itself contains the *old* `sfz_session_requests` columns.
- Tables already created by `full-schema.sql` make the migrations' `CREATE TABLE IF NOT EXISTS` statements no-ops — the wrong `sfz_session_requests` columns would stay in place.
- No migration file creates the buckets (`site-media`, `blog-media`, `gallery`) or the bucket-listing policy; those were previously created by hand on the old Supabase.

## Technical notes

- All added SQL follows the file's existing idempotence conventions: `IF NOT EXISTS`, `DROP ... IF EXISTS` + `CREATE`, `ON CONFLICT DO UPDATE` for buckets.
- The `sfz_session_requests` fix uses `ALTER TABLE` (add missing columns, drop obsolete ones) instead of drop-and-recreate, preserving any rows and keeping the file safe to re-run.
- Verification is limited to careful SQL review and your re-run: the sandbox has no access to your external Supabase, and per the standing rule I do not apply migrations to it.