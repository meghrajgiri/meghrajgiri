-- Archiving, in place of deleting.
--
-- The CMS had a Delete button that removed a project and its images for good. Nothing in
-- this system is urgent enough to be one click from unrecoverable, and the usual reason
-- to remove a project — it is not work you want shown any more — is satisfied by taking
-- it off the site rather than destroying it.
--
-- `archived_at` rather than a boolean: knowing a project was archived is less useful than
-- knowing when, and NULL reads unambiguously as "not archived".

ALTER TABLE projects ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

-- The site's read is "everything not archived, in order", which is the only query that
-- runs on every page.
CREATE INDEX IF NOT EXISTS projects_active_idx
  ON projects (position)
  WHERE archived_at IS NULL;

COMMENT ON COLUMN projects.archived_at IS
  'When the project was archived. NULL means active. Archived projects are kept in full — row, case study and images — but are excluded from the site, the sitemap and the committed snapshot.';
