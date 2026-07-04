
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author TEXT,
  cover_url TEXT,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "blog_posts public read" ON public.blog_posts FOR SELECT USING (published = true);

CREATE TABLE public.gallery_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  image_url TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gallery public read" ON public.gallery_items FOR SELECT USING (true);

CREATE TABLE public.wallpapers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  image_url TEXT NOT NULL,
  orientation TEXT DEFAULT 'portrait',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.wallpapers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wallpapers public read" ON public.wallpapers FOR SELECT USING (true);

CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can submit contact" ON public.contact_messages FOR INSERT WITH CHECK (true);

CREATE TABLE public.newsletter_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  country TEXT,
  agreed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.newsletter_signups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can sign up" ON public.newsletter_signups FOR INSERT WITH CHECK (true);
CREATE TABLE public.sfz_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name text NOT NULL,
  event_short_description text,
  cover_url text,
  location text,
  location_type text,
  start_at timestamptz NOT NULL,
  end_at timestamptz,
  event_type text NOT NULL DEFAULT 'upcoming',
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.sfz_events TO anon, authenticated;
GRANT ALL ON public.sfz_events TO service_role;
ALTER TABLE public.sfz_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sfz_events public read" ON public.sfz_events
  FOR SELECT USING (published = true);

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
  FOR INSERT WITH CHECK (true);INSERT INTO public.sfz_events (event_name, event_short_description, cover_url, location, location_type, start_at, end_at, event_type, published)
VALUES (
  'SFZ at Community Wellness Center',
  'A mock past event to preview the SFZ Past Events section. Around 60 participants joined this introductory Stress-Free Zone session.',
  NULL,
  'Bangalore, India',
  'in_person',
  now() - interval '30 days' + interval '10 hours',
  now() - interval '30 days' + interval '12 hours',
  'past',
  true
);-- ============================================================
-- 1. profiles table (name only, linked to auth.users)
-- ============================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles self select" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "profiles self update" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ============================================================
-- 2. app_role enum + user_roles table + has_role() function
-- ============================================================
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  );
$$;

-- user_roles policies use has_role to avoid recursion
CREATE POLICY "user_roles self select" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "user_roles admin select" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "user_roles admin insert" ON public.user_roles
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "user_roles admin delete" ON public.user_roles
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- 3. Signup trigger: create profile + seed admin for owner
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant admin role once the owner's email is verified (protects against
-- someone signing up with the address and grabbing admin without owning the mailbox)
CREATE OR REPLACE FUNCTION public.grant_owner_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email_confirmed_at IS NOT NULL
     AND lower(NEW.email) = 'christophuhl07@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_confirmed_grant_owner_admin
AFTER INSERT OR UPDATE OF email_confirmed_at ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_owner_admin();

-- ============================================================
-- 4. updated_at trigger for profiles
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 5. Admin write policies on existing content tables
--    (public SELECT policies already exist; add admin CRUD)
-- ============================================================
CREATE POLICY "blog_posts admin insert" ON public.blog_posts
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "blog_posts admin update" ON public.blog_posts
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "blog_posts admin delete" ON public.blog_posts
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "blog_posts admin select all" ON public.blog_posts
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "sfz_events admin insert" ON public.sfz_events
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "sfz_events admin update" ON public.sfz_events
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "sfz_events admin delete" ON public.sfz_events
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "sfz_events admin select all" ON public.sfz_events
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "gallery_items admin insert" ON public.gallery_items
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "gallery_items admin update" ON public.gallery_items
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "gallery_items admin delete" ON public.gallery_items
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "wallpapers admin insert" ON public.wallpapers
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "wallpapers admin update" ON public.wallpapers
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "wallpapers admin delete" ON public.wallpapers
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Admin-only inboxes (contact / SFZ requests / newsletter)
CREATE POLICY "contact_messages admin select" ON public.contact_messages
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "contact_messages admin delete" ON public.contact_messages
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "sfz_session_requests admin select" ON public.sfz_session_requests
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "sfz_session_requests admin delete" ON public.sfz_session_requests
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "newsletter_signups admin select" ON public.newsletter_signups
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "newsletter_signups admin delete" ON public.newsletter_signups
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Grant authenticated the ability to read/write admin-managed tables
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sfz_events TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wallpapers TO authenticated;
GRANT SELECT, DELETE ON public.contact_messages TO authenticated;
GRANT SELECT, DELETE ON public.sfz_session_requests TO authenticated;
GRANT SELECT, DELETE ON public.newsletter_signups TO authenticated;
