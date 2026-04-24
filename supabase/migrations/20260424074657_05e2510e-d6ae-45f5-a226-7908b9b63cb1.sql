
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
