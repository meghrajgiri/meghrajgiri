-- Contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contact_submissions' AND policyname = 'Allow public insert') THEN
    CREATE POLICY "Allow public insert" ON contact_submissions FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contact_submissions' AND policyname = 'Allow authenticated read') THEN
    CREATE POLICY "Allow authenticated read" ON contact_submissions FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
