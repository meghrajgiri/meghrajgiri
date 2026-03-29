-- Site configuration table (CMS)
CREATE TABLE IF NOT EXISTS site_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'site_config' AND policyname = 'Allow authenticated read') THEN
    CREATE POLICY "Allow authenticated read" ON site_config FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'site_config' AND policyname = 'Allow authenticated insert') THEN
    CREATE POLICY "Allow authenticated insert" ON site_config FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'site_config' AND policyname = 'Allow authenticated update') THEN
    CREATE POLICY "Allow authenticated update" ON site_config FOR UPDATE USING (auth.role() = 'authenticated');
  END IF;
END $$;
