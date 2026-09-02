
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending';

ALTER TABLE public.blog_posts
  ALTER COLUMN published SET DEFAULT false;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'blog_posts_status_check') THEN
    ALTER TABLE public.blog_posts
      ADD CONSTRAINT blog_posts_status_check
      CHECK (status IN ('pending','approved','rejected'));
  END IF;
END $$;

UPDATE public.blog_posts SET status = 'approved' WHERE published = true AND status = 'pending';

DROP POLICY IF EXISTS "blog_posts author insert" ON public.blog_posts;
CREATE POLICY "blog_posts author insert"
  ON public.blog_posts FOR INSERT TO authenticated
  WITH CHECK (
    author_id = auth.uid()
    AND published = false
    AND status = 'pending'
  );

DROP POLICY IF EXISTS "blog_posts author select" ON public.blog_posts;
CREATE POLICY "blog_posts author select"
  ON public.blog_posts FOR SELECT TO authenticated
  USING (author_id = auth.uid());
