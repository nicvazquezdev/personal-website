-- Create guestbook table
CREATE TABLE IF NOT EXISTS guestbook (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(30) NOT NULL,
  message VARCHAR(30) NOT NULL,
  session_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_guestbook_created_at ON guestbook(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_guestbook_session_id ON guestbook(session_id);

-- Enable Row Level Security
ALTER TABLE guestbook ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read guestbook entries
CREATE POLICY "Anyone can read guestbook entries" ON guestbook
  FOR SELECT USING (true);

-- Create policy to allow anyone to insert guestbook entries
CREATE POLICY "Anyone can insert guestbook entries" ON guestbook
  FOR INSERT WITH CHECK (true);

-- Create policy to allow users to update their own entries (based on session_id)
CREATE POLICY "Users can update their own entries" ON guestbook
  FOR UPDATE USING (session_id = current_setting('request.jwt.claims', true)::json->>'session_id' OR session_id = current_setting('app.session_id', true));

-- Create policy to allow users to delete their own entries (based on session_id)
CREATE POLICY "Users can delete their own entries" ON guestbook
  FOR DELETE USING (session_id = current_setting('request.jwt.claims', true)::json->>'session_id' OR session_id = current_setting('app.session_id', true));
