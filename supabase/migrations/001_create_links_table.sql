-- Create links table
CREATE TABLE IF NOT EXISTS public.links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  short_code TEXT NOT NULL,
  original_url TEXT NOT NULL,
  click_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Ensure short_code is unique
  UNIQUE(short_code)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_links_user_id ON public.links(user_id);
CREATE INDEX IF NOT EXISTS idx_links_short_code ON public.links(short_code);
CREATE INDEX IF NOT EXISTS idx_links_created_at ON public.links(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

-- Policy: Public can read links by short_code (for redirects)
-- This allows anyone to look up a link for redirect purposes
CREATE POLICY "Public can read links by short code"
  ON public.links
  FOR SELECT
  USING (true);

-- Policy: Users can only view their own links (for dashboard)
-- This works alongside the public policy - users can see their own links in dashboard
CREATE POLICY "Users can view own links"
  ON public.links
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can only insert their own links
CREATE POLICY "Users can insert own links"
  ON public.links
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own links
CREATE POLICY "Users can update own links"
  ON public.links
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Allow updating click_count for redirects (public access)
-- This allows click tracking when someone accesses a shortened URL
CREATE POLICY "Public can update click count"
  ON public.links
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policy: Users can only delete their own links
CREATE POLICY "Users can delete own links"
  ON public.links
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add comment to table
COMMENT ON TABLE public.links IS 'Stores shortened URLs created by users';
COMMENT ON COLUMN public.links.short_code IS 'Unique identifier for the shortened URL';
COMMENT ON COLUMN public.links.original_url IS 'The original URL being shortened';
COMMENT ON COLUMN public.links.click_count IS 'Number of times the shortened URL has been accessed';
