# Database Setup Instructions

This directory contains SQL scripts to set up the database schema for the LinkForge URL shortener dashboard.

## Quick Setup

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/bfloybonqrnvxtoytqny
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `setup.sql`
5. Click **Run** (or press Cmd/Ctrl + Enter)
6. Verify the table was created by checking **Table Editor** > `links`

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Link your local project to Supabase
supabase link --project-ref bfloybonqrnvxtoytqny

# Run the migration
supabase db push

# Or run the setup script directly
supabase db execute --file supabase/setup.sql
```

## What Gets Created

### Table: `links`

- `id` (UUID) - Primary key
- `user_id` (UUID) - Foreign key to auth.users
- `short_code` (TEXT) - Unique identifier for shortened URLs
- `original_url` (TEXT) - The original URL being shortened
- `click_count` (INTEGER) - Number of clicks (default: 0)
- `created_at` (TIMESTAMPTZ) - Creation timestamp

### Indexes

- Index on `user_id` for fast user-specific queries
- Index on `short_code` for fast URL lookups
- Index on `created_at` for sorting recent links

### Security (Row Level Security)

- Users can only view their own links
- Users can only insert their own links
- Users can only update their own links
- Users can only delete their own links

## Verification

After running the script, verify everything is set up correctly:

1. Check that the `links` table exists in **Table Editor**
2. Check that RLS is enabled in **Authentication** > **Policies**
3. Test by creating a link through the dashboard and verifying it appears

## Troubleshooting

### Error: "relation already exists"
The table already exists. You can either:
- Drop the existing table and re-run the script (⚠️ will delete all data)
- Use the migration file instead, which uses `CREATE TABLE IF NOT EXISTS`

### Error: "permission denied"
Make sure you're running the script as a database administrator or through the Supabase dashboard SQL Editor (which has admin privileges).

### RLS Policies Not Working
1. Ensure RLS is enabled: `ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;`
2. Verify policies exist in **Authentication** > **Policies** > `links`
3. Check that users are authenticated when testing
