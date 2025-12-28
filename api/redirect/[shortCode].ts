// Vercel Serverless Function for URL redirects
// This provides server-side redirects when Supabase Edge Functions aren't available

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const { shortCode } = req.query;

  if (!shortCode || typeof shortCode !== 'string') {
    return res.status(400).json({ error: 'Invalid short code' });
  }

  // Normalize short code
  const normalizedCode = shortCode
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 20);

  if (!normalizedCode || normalizedCode.length < 3) {
    return res.status(400).json({ error: 'Invalid short code format' });
  }

  try {
    // Get Supabase credentials from environment
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the link
    const { data: link, error } = await supabase
      .from('links')
      .select('original_url')
      .eq('short_code', normalizedCode)
      .single();

    if (error || !link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    // Increment click count asynchronously (don't wait)
    // Use RPC function if available, otherwise use update with increment
    supabase
      .rpc('increment_click_count', { code: normalizedCode })
      .then(() => {
        // Analytics updated
      })
      .catch(async () => {
        // Fallback to update query if RPC doesn't exist
        const { data: link } = await supabase
          .from('links')
          .select('click_count')
          .eq('short_code', normalizedCode)
          .single();
        
        if (link) {
          await supabase
            .from('links')
            .update({ click_count: (link.click_count || 0) + 1 })
            .eq('short_code', normalizedCode);
        }
      })
      .catch((err) => {
        console.error('Failed to increment click count:', err);
      });

    // Return 301 Permanent Redirect
    res.setHeader('Location', link.original_url);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.status(301).end();
  } catch (error) {
    console.error('Redirect error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

