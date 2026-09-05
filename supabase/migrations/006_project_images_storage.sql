-- 006_project_images_storage.sql
--
-- A storage bucket for project screenshots and thumbnails.
--
-- These lived in public/, which put 43MB of binaries in the git history and meant
-- adding a screenshot to a case study required a commit and a deploy — while the case
-- study text beside it was editable in the CMS. The bucket closes that gap.
--
-- Public read, because next/image fetches these server-side and the browser then loads
-- the optimised derivative; a signed URL would expire and break the cache. Nothing
-- here is private — every one of these images is already published on the site.
--
-- Writes are restricted to authenticated sessions. The CMS uploads with the anon key
-- plus a logged-in session, so an anonymous visitor cannot add, replace or delete
-- objects even though anyone may read them.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-images',
  'project-images',
  true,
  10485760, -- 10MB. The largest existing screenshot is 2.7MB; this leaves headroom
            -- without letting an accidental video upload through.
  array['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Policies are dropped first so this migration can be re-run safely.
drop policy if exists "project images are publicly readable" on storage.objects;
drop policy if exists "authenticated users can upload project images" on storage.objects;
drop policy if exists "authenticated users can replace project images" on storage.objects;
drop policy if exists "authenticated users can delete project images" on storage.objects;

create policy "project images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'project-images');

create policy "authenticated users can upload project images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'project-images');

create policy "authenticated users can replace project images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'project-images')
  with check (bucket_id = 'project-images');

create policy "authenticated users can delete project images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'project-images');
