// Netlify Serverless Function for URL redirects

import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

export const handler: Handler = async (event, context) => {
  const shortCode = event.pathParameters?.shortCode;

  if (!shortCode) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid short code' }),
    };
  }

  // Normalize short code
  const normalizedCode = shortCode
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 20);

  if (!normalizedCode || normalizedCode.length < 3) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid short code format' }),
    };
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
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Link not found' }),
      };
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
    return {
      statusCode: 301,
      headers: {
        Location: link.original_url,
        'Cache-Control': 'public, max-age=3600',
      },
      body: '',
    };
  } catch (error) {
    console.error('Redirect error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

