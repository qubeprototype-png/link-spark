# Deployment Guide - URL Shortener Redirect Fix

This guide explains how to deploy the fixed URL shortener with instant, reliable redirects.

## Critical Issues Fixed

1. ✅ **Client-side routing replaced** - Now uses server-side/edge redirects
2. ✅ **Short code normalization** - Codes are normalized (lowercase, trimmed, validated)
3. ✅ **Non-blocking analytics** - Click tracking doesn't delay redirects
4. ✅ **HTTP 301 redirects** - Proper permanent redirects for SEO and performance

## Prerequisites

1. **Database Setup**: Run the migration files in Supabase SQL Editor:
   - `supabase/migrations/001_create_links_table.sql` (creates links table)
   - `supabase/migrations/002_create_increment_function.sql` (creates click increment function)

2. **Environment Variables**: Ensure `.env` has:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## Deployment Options

### Option 1: Supabase Edge Functions (Recommended - Fastest)

**Best for**: Maximum performance, edge-level redirects (< 50ms)

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login and link project:
   ```bash
   supabase login
   supabase link --project-ref bfloybonqrnvxtoytqny
   ```

3. Deploy edge function:
   ```bash
   supabase functions deploy redirect
   ```

4. Configure your hosting to proxy `/{shortcode}` to:
   ```
   https://bfloybonqrnvxtoytqny.supabase.co/functions/v1/redirect/{shortcode}
   ```

**Performance**: < 50ms response time, true HTTP 301 redirects

### Option 2: Vercel Serverless Functions

**Best for**: Vercel deployments

1. Deploy to Vercel:
   ```bash
   vercel deploy
   ```

2. The `vercel.json` configuration automatically routes `/{shortCode}` to the serverless function.

3. Ensure environment variables are set in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

**Performance**: ~100-200ms response time, HTTP 301 redirects

### Option 3: Netlify Functions

**Best for**: Netlify deployments

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy:
   ```bash
   netlify deploy --prod
   ```

3. The `netlify.toml` configuration automatically routes `/{shortCode}` to the function.

4. Set environment variables in Netlify dashboard.

**Performance**: ~100-200ms response time, HTTP 301 redirects

### Option 4: Client-Side Fallback (Not Recommended)

If serverless functions aren't available, the client-side handler in `RedirectHandler.tsx` will work but is slower:
- Requires JavaScript to load
- Goes through React Router
- ~500-1000ms response time

## Testing

After deployment, test the redirect flow:

1. **Create a short link**:
   - Log in to the app
   - Create a shortened URL
   - Copy the short URL

2. **Test redirect**:
   ```bash
   curl -I https://your-domain.com/abc123
   ```
   Should return: `HTTP/1.1 301 Moved Permanently` with `Location: <original_url>`

3. **Test analytics**:
   - Access the short link
   - Check dashboard - click count should increment

4. **Test edge cases**:
   - Invalid short code → 404
   - Uppercase short code → normalized and redirected
   - Special characters → stripped and normalized

## Performance Benchmarks

| Solution | Response Time | Redirect Type | Analytics |
|----------|--------------|---------------|-----------|
| Supabase Edge Function | < 50ms | HTTP 301 | Async |
| Vercel Function | ~100-200ms | HTTP 301 | Async |
| Netlify Function | ~100-200ms | HTTP 301 | Async |
| Client-side (fallback) | ~500-1000ms | JS redirect | Async |

## Troubleshooting

### Redirects return 404
- Check database table exists: Run `001_create_links_table.sql`
- Verify RLS policies allow public reads
- Check short code normalization

### Analytics not updating
- Run `002_create_increment_function.sql` migration
- Check RLS policies allow updates
- Verify function has proper permissions

### Slow redirects
- Ensure using serverless/edge functions (not client-side)
- Check database indexes exist on `short_code`
- Verify edge function is deployed correctly

### CORS errors
- Edge functions include CORS headers automatically
- Check function deployment configuration

## Next Steps

1. Deploy using one of the options above
2. Test redirect functionality
3. Monitor analytics updates
4. Consider adding:
   - Custom short codes
   - Link expiration
   - Password protection
   - Advanced analytics

