// Supabase Edge Function for instant URL redirects
// This handles /{shortcode} requests at the edge level for instant 301 redirects

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase environment variables");
    }

    // Extract short code from URL path
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/").filter(Boolean);
    
    // Get the short code (first path segment after function name)
    // If function is deployed at /redirect/{code}, code is pathParts[1]
    // If function is deployed at /{code}, code is pathParts[0]
    const shortCode = pathParts[pathParts.length - 1]?.toLowerCase().trim();

    if (!shortCode || shortCode.length < 3) {
      return new Response(
        JSON.stringify({ error: "Invalid short code" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Normalize short code (remove invalid characters)
    const normalizedCode = shortCode.replace(/[^a-z0-9]/g, "").substring(0, 20);

    if (!normalizedCode || normalizedCode.length < 3) {
      return new Response(
        JSON.stringify({ error: "Invalid short code format" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Fetch the link from database
    const { data: link, error: fetchError } = await supabase
      .from("links")
      .select("original_url, id")
      .eq("short_code", normalizedCode)
      .single();

    if (fetchError || !link) {
      return new Response(
        JSON.stringify({ error: "Link not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Increment click count asynchronously (don't wait for it)
    // Use RPC function if available, otherwise use update with increment
    supabase
      .rpc("increment_click_count", { code: normalizedCode })
      .then(() => {
        // Analytics updated successfully
      })
      .catch(async () => {
        // Fallback to update query if RPC doesn't exist
        const { data: link } = await supabase
          .from("links")
          .select("click_count")
          .eq("short_code", normalizedCode)
          .single();
        
        if (link) {
          await supabase
            .from("links")
            .update({ click_count: (link.click_count || 0) + 1 })
            .eq("short_code", normalizedCode);
        }
      })
      .catch((err) => {
        console.error("Failed to increment click count:", err);
        // Don't fail the redirect if analytics fail
      });

    // Return 301 Permanent Redirect
    return new Response(null, {
      status: 301,
      headers: {
        Location: link.original_url,
        "Cache-Control": "public, max-age=3600",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Redirect error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

