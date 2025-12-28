# Quick Setup - Create Links Table

## Method 1: Supabase Dashboard (Easiest - Recommended)

1. **Open Supabase SQL Editor**:
   - Go to: https://supabase.com/dashboard/project/bfloybonqrnvxtoytqny/sql/new
   - Or: Dashboard → SQL Editor → New Query

2. **Copy and paste this SQL**:

```sql
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
CREATE POLICY "Public can read links by short code"
  ON public.links
  FOR SELECT
  USING (true);

-- Policy: Users can only view their own links (for dashboard)
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

-- Add comments
COMMENT ON TABLE public.links IS 'Stores shortened URLs created by users';
COMMENT ON COLUMN public.links.short_code IS 'Unique identifier for the shortened URL';
COMMENT ON COLUMN public.links.original_url IS 'The original URL being shortened';
COMMENT ON COLUMN public.links.click_count IS 'Number of times the shortened URL has been accessed';
```

3. **Click "Run"** (or press Cmd/Ctrl + Enter)

4. **Verify the table was created**:
   - Go to: Table Editor → `links` table
   - You should see the table with columns: id, user_id, short_code, original_url, click_count, created_at

5. **Also create the increment function** (run this SQL too):

```sql
-- Create database function for incrementing click count
CREATE OR REPLACE FUNCTION increment_click_count(code TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.links
  SET click_count = click_count + 1
  WHERE short_code = code;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION increment_click_count(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION increment_click_count(TEXT) TO authenticated;

COMMENT ON FUNCTION increment_click_count IS 'Increments the click count for a link by short code';
```

## Method 2: Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref bfloybonqrnvxtoytqny

# Push migrations
supabase db push
```

## Method 3: Using the Helper Script

```bash
# View the SQL that needs to be run
node scripts/create-links-table.js

# Then copy and paste into Supabase Dashboard SQL Editor
```

## Verification

After running the SQL, verify the table exists:

1. **Check in Table Editor**:
   - Dashboard → Table Editor → `links` table should appear

2. **Test with a query**:
   ```sql
   SELECT * FROM public.links LIMIT 1;
   ```
   (Should return empty result set, not an error)

3. **Check RLS policies**:
   - Dashboard → Authentication → Policies → `links` table
   - Should show 6 policies

## Troubleshooting

### Error: "relation already exists"
- The table already exists. You can either:
  - Skip this step (table is already created)
  - Drop and recreate: `DROP TABLE IF EXISTS public.links CASCADE;` (⚠️ deletes all data)

### Error: "permission denied"
- Make sure you're running in Supabase Dashboard SQL Editor (has admin privileges)
- Or use Supabase CLI with proper authentication

### Error: "function already exists"
- The increment function already exists. This is fine, it will be replaced.

## Next Steps

After creating the table:
1. ✅ Test creating a short link in the app
2. ✅ Verify it appears in the dashboard
3. ✅ Test redirect functionality
4. ✅ Check analytics increment

