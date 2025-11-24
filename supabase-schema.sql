-- TabDrop Supabase Schema
-- Run this in your Supabase SQL Editor to set up the database

-- Create the collections table
CREATE TABLE collections (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  links JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on slug for faster lookups
CREATE INDEX idx_collections_slug ON collections(slug);

-- Create an index on updated_at for potential future features
CREATE INDEX idx_collections_updated_at ON collections(updated_at);

-- Enable Row Level Security (RLS)
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read collections
CREATE POLICY "Allow public read access to collections"
ON collections
FOR SELECT
USING (true);

-- Create a policy that allows anyone to insert collections
CREATE POLICY "Allow public insert access to collections"
ON collections
FOR INSERT
WITH CHECK (true);

-- Create a policy that allows anyone to update collections
CREATE POLICY "Allow public update access to collections"
ON collections
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Create a policy that allows anyone to delete collections (optional - you can remove if you don't want this)
CREATE POLICY "Allow public delete access to collections"
ON collections
FOR DELETE
USING (true);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function before updates
CREATE TRIGGER update_collections_updated_at
BEFORE UPDATE ON collections
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Optional: Add some sample data for testing
-- Uncomment the following lines if you want to add test data:
-- INSERT INTO collections (slug, links) VALUES (
--   'example',
--   '[{"url": "https://github.com", "addedAt": "2024-01-01T12:00:00.000Z"}, {"url": "https://google.com", "addedAt": "2024-01-01T12:01:00.000Z"}]'::jsonb
-- );