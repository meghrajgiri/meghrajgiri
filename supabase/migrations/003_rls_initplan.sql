-- Wrap auth.role() in a scalar subquery so Postgres evaluates it once per statement
-- rather than once per row. Flagged by the Supabase linter as `auth_rls_initplan`.
--
-- Policy semantics are unchanged — same tables, same commands, same condition. Applied
-- to the live project on 2026-08-30; this file records it for a rebuild from scratch.

DROP POLICY IF EXISTS "Allow authenticated read" ON contact_submissions;
CREATE POLICY "Allow authenticated read" ON contact_submissions
  FOR SELECT USING ((SELECT auth.role()) = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated read" ON site_config;
CREATE POLICY "Allow authenticated read" ON site_config
  FOR SELECT USING ((SELECT auth.role()) = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated insert" ON site_config;
CREATE POLICY "Allow authenticated insert" ON site_config
  FOR INSERT WITH CHECK ((SELECT auth.role()) = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated update" ON site_config;
CREATE POLICY "Allow authenticated update" ON site_config
  FOR UPDATE USING ((SELECT auth.role()) = 'authenticated');
