-- Projects move out of the `site_config` JSON blob and into rows of their own.
--
-- Every project lived inside `site_config['projects'].value.projects`, a single JSONB
-- array. The CMS loaded that array into React state and wrote the whole thing back on
-- save, so two edits made from different tabs — or one edit made against a page opened
-- before another save — silently discarded the other. That is not hypothetical: a
-- rewritten case study was reverted from 522 words back to 74 by an unrelated image
-- upload saving a stale copy of the array.
--
-- One row per project makes edit, add and delete three separate operations that cannot
-- touch each other.

CREATE TABLE IF NOT EXISTS projects (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  -- Display order. The array index used to carry this implicitly; now it is a column,
  -- so reordering is an UPDATE rather than a rewrite of everything.
  position INTEGER NOT NULL,

  -- The project itself, in exactly the shape the site already reads. Keeping it whole
  -- means `getAllConfig` can compose the same array it always returned and no renderer,
  -- type or snapshot consumer has to change.
  data JSONB NOT NULL,

  -- Derived, not duplicated. A second copy of the slug would be free to disagree with
  -- the one inside `data`; generating it means the unique index below constrains the
  -- real value.
  slug TEXT GENERATED ALWAYS AS (data->>'slug') STORED,

  -- Absent means published — the renderers test `published !== false`, and this has to
  -- agree with them or a draft would leak.
  published BOOLEAN GENERATED ALWAYS AS (
    COALESCE((data->>'published')::BOOLEAN, TRUE)
  ) STORED,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- A slug is a URL: /projects/<slug>. Two rows sharing one would make the page
-- non-deterministic, so the database refuses rather than the application remembering to.
CREATE UNIQUE INDEX IF NOT EXISTS projects_slug_key ON projects (slug);
CREATE INDEX IF NOT EXISTS projects_position_idx ON projects (position);

-- `updated_at` feeds the sitemap's lastmod, so it has to be maintained by the database.
-- Left to the application it would be right until the first writer forgot.
CREATE OR REPLACE FUNCTION projects_touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS projects_set_updated_at ON projects;
CREATE TRIGGER projects_set_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION projects_touch_updated_at();

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Mirrors `site_config`: the public site reads through the service role, which bypasses
-- RLS, so these policies exist for the authenticated CMS session only.
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'Allow authenticated read') THEN
    CREATE POLICY "Allow authenticated read" ON projects FOR SELECT USING ((SELECT auth.role()) = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'Allow authenticated insert') THEN
    CREATE POLICY "Allow authenticated insert" ON projects FOR INSERT WITH CHECK ((SELECT auth.role()) = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'Allow authenticated update') THEN
    CREATE POLICY "Allow authenticated update" ON projects FOR UPDATE USING ((SELECT auth.role()) = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'Allow authenticated delete') THEN
    CREATE POLICY "Allow authenticated delete" ON projects FOR DELETE USING ((SELECT auth.role()) = 'authenticated');
  END IF;
END $$;

-- Backfill from the array, preserving its order. Guarded on the table being empty so a
-- re-run cannot duplicate rows or resurrect a project that has since been deleted.
INSERT INTO projects (position, data)
SELECT t.ord - 1, t.p
FROM site_config sc,
     LATERAL jsonb_array_elements(sc.value->'projects') WITH ORDINALITY AS t(p, ord)
WHERE sc.key = 'projects'
  AND NOT EXISTS (SELECT 1 FROM projects);

-- The array itself is deliberately left in `site_config` by this migration. Production
-- is still running code that reads it, and the database migrates before the deploy does.
-- `008_drop_projects_from_site_config.sql` removes it, and is meant to run only once the
-- new code is live.
