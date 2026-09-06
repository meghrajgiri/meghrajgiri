-- Remove the projects array from `site_config`, now that the rows are the source.
--
-- NOT PART OF THE 007 DEPLOY. The database migrates before the code does, so between
-- 007 and the deploy the running site is still reading `site_config['projects'].value
-- .projects`. Dropping it in the same step would empty the projects section of the live
-- site for the length of the deploy.
--
-- Run this once the new code is live and /projects renders from the table. Until then
-- the array is a harmless duplicate: `getAllConfig` overwrites it with the rows, and
-- `yarn config:snapshot` composes the snapshot from the rows too.
--
-- Refuses to run unless the table holds exactly what the array holds, so a mistimed run
-- cannot destroy content that was never copied across.

DO $$
DECLARE
  from_rows JSONB;
  from_array JSONB;
BEGIN
  SELECT jsonb_agg(data ORDER BY position) INTO from_rows FROM projects;
  SELECT value->'projects' INTO from_array FROM site_config WHERE key = 'projects';

  IF from_array IS NULL THEN
    RAISE NOTICE 'site_config no longer holds a projects array; nothing to do.';
    RETURN;
  END IF;

  IF from_rows IS DISTINCT FROM from_array THEN
    RAISE EXCEPTION
      'projects table and site_config array differ — refusing to drop the array. Re-check the backfill in 007 before running this.';
  END IF;

  UPDATE site_config
  SET value = value - 'projects',
      updated_at = NOW()
  WHERE key = 'projects';
END $$;
