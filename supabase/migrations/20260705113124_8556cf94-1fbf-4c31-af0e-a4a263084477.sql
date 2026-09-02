-- Public read access + admin write access for site-media bucket
CREATE POLICY "site-media public read"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'site-media');

CREATE POLICY "site-media admin insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'site-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "site-media admin update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'site-media' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'site-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "site-media admin delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'site-media' AND public.has_role(auth.uid(), 'admin'));