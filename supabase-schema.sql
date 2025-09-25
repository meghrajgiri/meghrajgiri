-- Contact submissions table
CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows inserting new submissions (public access for form)
CREATE POLICY "Allow public insert" ON contact_submissions
  FOR INSERT WITH CHECK (true);

-- Create a policy for reading submissions (you can restrict this to authenticated users)
CREATE POLICY "Allow authenticated read" ON contact_submissions
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create an index for faster queries
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);