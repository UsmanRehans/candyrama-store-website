INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('product-media', 'product-media', true, 10000000, ARRAY['image/png','image/jpeg','image/webp'])
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public, file_size_limit = EXCLUDED.file_size_limit, allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Images are deliberately public storefront assets. Upload and deletion remain
-- server-only through the service role; anonymous clients receive read access.
CREATE POLICY "Public product media reads" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'product-media');
