-- =====================================================================
-- Full schema for the Oneness site — fully idempotent.
-- Safe to re-run any number of times. Only creates what's missing.
-- =====================================================================

-- Enum: app_role
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author TEXT,
  cover_url TEXT,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  image_url TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.wallpapers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  image_url TEXT NOT NULL,
  orientation TEXT DEFAULT 'portrait',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.newsletter_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT,
  source TEXT,
  consent BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.sfz_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  event_short_description TEXT,
  event_long_description TEXT,
  cover_url TEXT,
  location TEXT,
  location_type TEXT,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.sfz_session_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  preferred_date DATE,
  preferred_time TEXT,
  session_type TEXT,
  location_type TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Grants (Data API access)
-- ---------------------------------------------------------------------
GRANT SELECT ON public.blog_posts    TO anon;
GRANT SELECT ON public.gallery_items TO anon;
GRANT SELECT ON public.wallpapers    TO anon;
GRANT SELECT ON public.sfz_events    TO anon;
GRANT INSERT ON public.contact_messages    TO anon;
GRANT INSERT ON public.newsletter_signups  TO anon;
GRANT INSERT ON public.sfz_session_requests TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts           TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_items        TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wallpapers           TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sfz_events           TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles             TO authenticated;
GRANT SELECT, DELETE                 ON public.contact_messages     TO authenticated;
GRANT SELECT, DELETE                 ON public.newsletter_signups   TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sfz_session_requests TO authenticated;
GRANT SELECT                         ON public.user_roles           TO authenticated;

GRANT ALL ON public.blog_posts, public.gallery_items, public.wallpapers,
             public.sfz_events, public.profiles, public.contact_messages,
             public.newsletter_signups, public.sfz_session_requests,
             public.user_roles
      TO service_role;

-- ---------------------------------------------------------------------
-- Enable RLS
-- ---------------------------------------------------------------------
ALTER TABLE public.profiles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallpapers           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_signups   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sfz_events           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sfz_session_requests ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------
-- Functions
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;

CREATE OR REPLACE FUNCTION public.grant_owner_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.email_confirmed_at IS NOT NULL
     AND lower(NEW.email) = 'christophuhl07@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ---------------------------------------------------------------------
-- Triggers (drop-then-create for idempotence)
-- ---------------------------------------------------------------------
DROP TRIGGER IF EXISTS on_auth_user_created         ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS on_auth_user_confirmed_admin ON auth.users;
CREATE TRIGGER on_auth_user_confirmed_admin
  AFTER INSERT OR UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.grant_owner_admin();

DROP TRIGGER IF EXISTS sfz_events_set_updated_at ON public.sfz_events;
CREATE TRIGGER sfz_events_set_updated_at
  BEFORE UPDATE ON public.sfz_events
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS sfz_session_requests_set_updated_at ON public.sfz_session_requests;
CREATE TRIGGER sfz_session_requests_set_updated_at
  BEFORE UPDATE ON public.sfz_session_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------
-- Policies (drop-then-create for idempotence)
-- ---------------------------------------------------------------------
-- profiles
DROP POLICY IF EXISTS "profiles self read"   ON public.profiles;
CREATE POLICY "profiles self read"   ON public.profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "profiles self update" ON public.profiles;
CREATE POLICY "profiles self update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- user_roles
DROP POLICY IF EXISTS "user_roles self read"       ON public.user_roles;
CREATE POLICY "user_roles self read"       ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "user_roles admin read all"  ON public.user_roles;
CREATE POLICY "user_roles admin read all"  ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "user_roles admin insert"    ON public.user_roles;
CREATE POLICY "user_roles admin insert"    ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "user_roles admin delete"    ON public.user_roles;
CREATE POLICY "user_roles admin delete"    ON public.user_roles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- blog_posts
DROP POLICY IF EXISTS "blog_posts public read"  ON public.blog_posts;
CREATE POLICY "blog_posts public read"  ON public.blog_posts FOR SELECT USING (published = true);
DROP POLICY IF EXISTS "blog_posts admin read"   ON public.blog_posts;
CREATE POLICY "blog_posts admin read"   ON public.blog_posts FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "blog_posts admin insert" ON public.blog_posts;
CREATE POLICY "blog_posts admin insert" ON public.blog_posts FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "blog_posts admin update" ON public.blog_posts;
CREATE POLICY "blog_posts admin update" ON public.blog_posts FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "blog_posts admin delete" ON public.blog_posts;
CREATE POLICY "blog_posts admin delete" ON public.blog_posts FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- gallery_items
DROP POLICY IF EXISTS "gallery public read"  ON public.gallery_items;
CREATE POLICY "gallery public read"  ON public.gallery_items FOR SELECT USING (true);
DROP POLICY IF EXISTS "gallery admin insert" ON public.gallery_items;
CREATE POLICY "gallery admin insert" ON public.gallery_items FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "gallery admin update" ON public.gallery_items;
CREATE POLICY "gallery admin update" ON public.gallery_items FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "gallery admin delete" ON public.gallery_items;
CREATE POLICY "gallery admin delete" ON public.gallery_items FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- wallpapers
DROP POLICY IF EXISTS "wallpapers public read"  ON public.wallpapers;
CREATE POLICY "wallpapers public read"  ON public.wallpapers FOR SELECT USING (true);
DROP POLICY IF EXISTS "wallpapers admin insert" ON public.wallpapers;
CREATE POLICY "wallpapers admin insert" ON public.wallpapers FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "wallpapers admin update" ON public.wallpapers;
CREATE POLICY "wallpapers admin update" ON public.wallpapers FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "wallpapers admin delete" ON public.wallpapers;
CREATE POLICY "wallpapers admin delete" ON public.wallpapers FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- contact_messages
DROP POLICY IF EXISTS "contact anon insert"  ON public.contact_messages;
CREATE POLICY "contact anon insert"  ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "contact admin select" ON public.contact_messages;
CREATE POLICY "contact admin select" ON public.contact_messages FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "contact admin delete" ON public.contact_messages;
CREATE POLICY "contact admin delete" ON public.contact_messages FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- newsletter_signups
DROP POLICY IF EXISTS "newsletter anon insert"  ON public.newsletter_signups;
CREATE POLICY "newsletter anon insert"  ON public.newsletter_signups FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "newsletter admin select" ON public.newsletter_signups;
CREATE POLICY "newsletter admin select" ON public.newsletter_signups FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "newsletter admin delete" ON public.newsletter_signups;
CREATE POLICY "newsletter admin delete" ON public.newsletter_signups FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- sfz_events
DROP POLICY IF EXISTS "sfz_events public read"  ON public.sfz_events;
CREATE POLICY "sfz_events public read"  ON public.sfz_events FOR SELECT USING (published = true);
DROP POLICY IF EXISTS "sfz_events admin read"   ON public.sfz_events;
CREATE POLICY "sfz_events admin read"   ON public.sfz_events FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "sfz_events admin insert" ON public.sfz_events;
CREATE POLICY "sfz_events admin insert" ON public.sfz_events FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "sfz_events admin update" ON public.sfz_events;
CREATE POLICY "sfz_events admin update" ON public.sfz_events FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "sfz_events admin delete" ON public.sfz_events;
CREATE POLICY "sfz_events admin delete" ON public.sfz_events FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- sfz_session_requests
DROP POLICY IF EXISTS "sfz_session_requests anon insert" ON public.sfz_session_requests;
CREATE POLICY "sfz_session_requests anon insert" ON public.sfz_session_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "sfz_session_requests admin select" ON public.sfz_session_requests;
CREATE POLICY "sfz_session_requests admin select" ON public.sfz_session_requests FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "sfz_session_requests admin delete" ON public.sfz_session_requests;
CREATE POLICY "sfz_session_requests admin delete" ON public.sfz_session_requests FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ---------------------------------------------------------------------
-- Storage: event-media bucket (public read, admin-only writes)
-- ---------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-media', 'event-media', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

DROP POLICY IF EXISTS "event-media public read"   ON storage.objects;
CREATE POLICY "event-media public read"   ON storage.objects
  FOR SELECT USING (bucket_id = 'event-media');

DROP POLICY IF EXISTS "event-media admin insert" ON storage.objects;
CREATE POLICY "event-media admin insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'event-media' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "event-media admin update" ON storage.objects;
CREATE POLICY "event-media admin update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'event-media' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "event-media admin delete" ON storage.objects;
CREATE POLICY "event-media admin delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'event-media' AND public.has_role(auth.uid(), 'admin'));

-- =====================================================================
-- PART 2 — additions to bring an older database up to the current app
-- (all statements are idempotent and safe to re-run)
-- =====================================================================

-- ---------------------------------------------------------------------
-- profiles: updated_at + trigger
-- ---------------------------------------------------------------------
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------
-- blog_posts: moderation flow (author submits, admin approves)
-- ---------------------------------------------------------------------
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE public.blog_posts ALTER COLUMN published SET DEFAULT false;

DROP POLICY IF EXISTS "blog_posts author select" ON public.blog_posts;
CREATE POLICY "blog_posts author select" ON public.blog_posts
  FOR SELECT TO authenticated USING (author_id = auth.uid());
DROP POLICY IF EXISTS "blog_posts author insert" ON public.blog_posts;
CREATE POLICY "blog_posts author insert" ON public.blog_posts
  FOR INSERT TO authenticated
  WITH CHECK (author_id = auth.uid() AND published = false AND status = 'pending');

-- ---------------------------------------------------------------------
-- newsletter_signups: columns the form actually submits
-- ---------------------------------------------------------------------
ALTER TABLE public.newsletter_signups ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE public.newsletter_signups ADD COLUMN IF NOT EXISTS agreed BOOLEAN NOT NULL DEFAULT false;

-- ---------------------------------------------------------------------
-- sfz_session_requests: align columns with the request form
-- ---------------------------------------------------------------------
ALTER TABLE public.sfz_session_requests ADD COLUMN IF NOT EXISTS group_name TEXT;
ALTER TABLE public.sfz_session_requests ADD COLUMN IF NOT EXISTS contact_name TEXT;
ALTER TABLE public.sfz_session_requests ADD COLUMN IF NOT EXISTS contact_phone TEXT;
ALTER TABLE public.sfz_session_requests ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE public.sfz_session_requests ADD COLUMN IF NOT EXISTS group_size INTEGER;
ALTER TABLE public.sfz_session_requests ADD COLUMN IF NOT EXISTS date_requested DATE;
ALTER TABLE public.sfz_session_requests ADD COLUMN IF NOT EXISTS attendance_type TEXT;
ALTER TABLE public.sfz_session_requests ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.sfz_session_requests ADD COLUMN IF NOT EXISTS notes TEXT;

-- obsolete columns must not block inserts
ALTER TABLE public.sfz_session_requests ALTER COLUMN full_name DROP NOT NULL;
ALTER TABLE public.sfz_session_requests ALTER COLUMN email     DROP NOT NULL;
ALTER TABLE public.sfz_session_requests DROP COLUMN IF EXISTS full_name;
ALTER TABLE public.sfz_session_requests DROP COLUMN IF EXISTS email;
ALTER TABLE public.sfz_session_requests DROP COLUMN IF EXISTS phone;
ALTER TABLE public.sfz_session_requests DROP COLUMN IF EXISTS preferred_date;
ALTER TABLE public.sfz_session_requests DROP COLUMN IF EXISTS session_type;
ALTER TABLE public.sfz_session_requests DROP COLUMN IF EXISTS message;

-- ---------------------------------------------------------------------
-- testimonials
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant TEXT NOT NULL,
  location TEXT,
  tag TEXT DEFAULT 'Testimonial',
  actual_testimonial TEXT NOT NULL,
  quote TEXT,
  image_url TEXT,
  visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS testimonials_sort_idx ON public.testimonials (sort_order, created_at);

DROP TRIGGER IF EXISTS testimonials_set_updated_at ON public.testimonials;
CREATE TRIGGER testimonials_set_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP POLICY IF EXISTS "Public can view visible testimonials" ON public.testimonials;
CREATE POLICY "Public can view visible testimonials" ON public.testimonials FOR SELECT USING (visible = true);
DROP POLICY IF EXISTS "Admins can view all testimonials" ON public.testimonials;
CREATE POLICY "Admins can view all testimonials" ON public.testimonials FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can insert testimonials" ON public.testimonials;
CREATE POLICY "Admins can insert testimonials" ON public.testimonials FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can update testimonials" ON public.testimonials;
CREATE POLICY "Admins can update testimonials" ON public.testimonials FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can delete testimonials" ON public.testimonials;
CREATE POLICY "Admins can delete testimonials" ON public.testimonials FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ---------------------------------------------------------------------
-- trainers
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.trainers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT,
  image_url TEXT,
  bio TEXT,
  visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.trainers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trainers TO authenticated;
GRANT ALL ON public.trainers TO service_role;
ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS trainers_sort_idx ON public.trainers (sort_order, created_at);

DROP TRIGGER IF EXISTS trainers_set_updated_at ON public.trainers;
CREATE TRIGGER trainers_set_updated_at
  BEFORE UPDATE ON public.trainers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP POLICY IF EXISTS "Public can view visible trainers" ON public.trainers;
CREATE POLICY "Public can view visible trainers" ON public.trainers FOR SELECT USING (visible = true);
DROP POLICY IF EXISTS "Admins can view all trainers" ON public.trainers;
CREATE POLICY "Admins can view all trainers" ON public.trainers FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can insert trainers" ON public.trainers;
CREATE POLICY "Admins can insert trainers" ON public.trainers FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can update trainers" ON public.trainers;
CREATE POLICY "Admins can update trainers" ON public.trainers FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins can delete trainers" ON public.trainers;
CREATE POLICY "Admins can delete trainers" ON public.trainers FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ---------------------------------------------------------------------
-- Storage: site-media, blog-media, gallery buckets
-- ---------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public) VALUES
  ('site-media', 'site-media', true),
  ('blog-media', 'blog-media', true),
  ('gallery',    'gallery',    true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

DO $$
DECLARE b TEXT;
BEGIN
  FOREACH b IN ARRAY ARRAY['site-media','blog-media','gallery'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', b || ' public read');
    EXECUTE format(
      'CREATE POLICY %I ON storage.objects FOR SELECT USING (bucket_id = %L)',
      b || ' public read', b);

    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', b || ' admin insert');
    EXECUTE format(
      'CREATE POLICY %I ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = %L AND public.has_role(auth.uid(), ''admin''))',
      b || ' admin insert', b);

    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', b || ' admin update');
    EXECUTE format(
      'CREATE POLICY %I ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = %L AND public.has_role(auth.uid(), ''admin''))',
      b || ' admin update', b);

    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', b || ' admin delete');
    EXECUTE format(
      'CREATE POLICY %I ON storage.objects FOR DELETE TO authenticated USING (bucket_id = %L AND public.has_role(auth.uid(), ''admin''))',
      b || ' admin delete', b);
  END LOOP;
END $$;

-- Let admins list buckets (needed by "select from database" in /admin/site-media)
DROP POLICY IF EXISTS "Admins can list buckets" ON storage.buckets;
CREATE POLICY "Admins can list buckets" ON storage.buckets
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
