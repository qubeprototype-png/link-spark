# Redirect Edge Function

This Supabase Edge Function handles instant HTTP 301 redirects for shortened URLs.

## Deployment

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref bfloybonqrnvxtoytqny

# Deploy the function
supabase functions deploy redirect
```

## Configuration

The function uses environment variables that are automatically available:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Usage

Once deployed, the function will be available at:
- `https://<project-ref>.supabase.co/functions/v1/redirect/{shortcode}`

## Routing Setup

For the function to handle all `/{shortcode}` requests directly, you need to configure your hosting platform:

### Option 1: Supabase Hosting (Recommended)
Configure your hosting to proxy `/{shortcode}` requests to the edge function.

### Option 2: Hosting Platform Rewrites
See hosting configuration files in the root directory for platform-specific setup.

## Performance

- **Response Time**: < 50ms (edge-level)
- **Redirect Type**: HTTP 301 (Permanent Redirect)
- **Analytics**: Non-blocking async updates
- **Caching**: 1 hour cache headers

