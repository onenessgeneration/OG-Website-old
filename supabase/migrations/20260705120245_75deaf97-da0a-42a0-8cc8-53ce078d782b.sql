
DROP POLICY IF EXISTS "blog-media public read" ON storage.objects;
CREATE POLICY "blog-media public read"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'blog-media');

DROP POLICY IF EXISTS "blog-media author insert" ON storage.objects;
CREATE POLICY "blog-media author insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'blog-media'
    AND (storage.foldername(name))[1] = 'submissions'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );

DROP POLICY IF EXISTS "blog-media author update" ON storage.objects;
CREATE POLICY "blog-media author update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'blog-media'
    AND (storage.foldername(name))[1] = 'submissions'
    AND (storage.foldername(name))[2] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'blog-media'
    AND (storage.foldername(name))[1] = 'submissions'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );

DROP POLICY IF EXISTS "blog-media author delete" ON storage.objects;
CREATE POLICY "blog-media author delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'blog-media'
    AND (storage.foldername(name))[1] = 'submissions'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );

DROP POLICY IF EXISTS "blog-media admin insert" ON storage.objects;
CREATE POLICY "blog-media admin insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'blog-media' AND has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "blog-media admin update" ON storage.objects;
CREATE POLICY "blog-media admin update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'blog-media' AND has_role(auth.uid(),'admin'))
  WITH CHECK (bucket_id = 'blog-media' AND has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "blog-media admin delete" ON storage.objects;
CREATE POLICY "blog-media admin delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'blog-media' AND has_role(auth.uid(),'admin'));
