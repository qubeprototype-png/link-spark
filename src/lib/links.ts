import { supabase } from "./supabase";
import type { Link } from "@/types/database";

/**
 * Normalizes a short code by converting to lowercase and removing invalid characters
 * @param shortCode - The short code to normalize
 * @returns A normalized short code
 */
export function normalizeShortCode(shortCode: string): string {
  return shortCode
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') // Remove any non-alphanumeric characters
    .substring(0, 20); // Limit length
}

/**
 * Generates a random short code using base36 encoding
 * @param length - Length of the short code (default: 6)
 * @returns A random short code string (normalized)
 */
function generateShortCode(length: number = 6): string {
  const code = Math.random().toString(36).substring(2, 2 + length);
  return normalizeShortCode(code);
}

/**
 * Checks if a short code already exists in the database
 * @param shortCode - The short code to check
 * @returns true if the code exists, false otherwise
 */
async function shortCodeExists(shortCode: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("links")
    .select("short_code")
    .eq("short_code", shortCode)
    .single();

  // If error and it's not a "not found" error, log it
  if (error && error.code !== "PGRST116") {
    console.error("Error checking short code:", error);
  }

  return data !== null;
}

/**
 * Generates a unique short code by checking for collisions
 * @param maxAttempts - Maximum number of attempts to generate a unique code (default: 10)
 * @returns A unique short code (normalized, 6-10 characters)
 */
async function generateUniqueShortCode(maxAttempts: number = 10): Promise<string> {
  // Ensure code length is between 6-10 characters
  const baseLength = 6;
  
  for (let i = 0; i < maxAttempts; i++) {
    const shortCode = generateShortCode(baseLength);
    if (shortCode.length < 6) continue; // Ensure minimum length
    
    const exists = await shortCodeExists(shortCode);
    
    if (!exists) {
      return shortCode;
    }
  }
  
  // If we couldn't generate a unique code after maxAttempts, try with longer code
  const longerCode = generateShortCode(8);
  const exists = await shortCodeExists(longerCode);
  
  if (!exists && longerCode.length >= 6) {
    return longerCode;
  }
  
  // Last resort: use timestamp-based code (normalized)
  const timestampCode = `${Date.now().toString(36)}${Math.random().toString(36).substring(2, 4)}`;
  return normalizeShortCode(timestampCode);
}

/**
 * Normalizes a URL by ensuring it has a protocol
 * @param url - The URL to normalize
 * @returns A normalized URL with protocol
 */
export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  
  // If URL already has protocol, return as is
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  
  // Otherwise, add https://
  return `https://${trimmed}`;
}

/**
 * Creates a shortened URL link in the database
 * @param originalUrl - The original URL to shorten
 * @param userId - The user ID creating the link
 * @returns The created link or an error
 */
export async function createShortLink(
  originalUrl: string,
  userId: string
): Promise<{ data: Link | null; error: Error | null }> {
  try {
    // Normalize the URL
    const normalizedUrl = normalizeUrl(originalUrl);
    
    // Validate URL
    try {
      new URL(normalizedUrl);
    } catch {
      return {
        data: null,
        error: new Error("Invalid URL format"),
      };
    }

    // Generate unique short code
    const shortCode = await generateUniqueShortCode();

    // Insert into database
    const { data, error } = await supabase
      .from("links")
      .insert({
        user_id: userId,
        short_code: shortCode,
        original_url: normalizedUrl,
        click_count: 0,
      })
      .select()
      .single();

    if (error) {
      return {
        data: null,
        error: new Error(`Failed to create link: ${error.message}`),
      };
    }

    return {
      data: data as Link,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error("Unknown error occurred"),
    };
  }
}

/**
 * Retrieves a link by its short code (without incrementing click count)
 * Use this for server-side redirects where analytics are handled separately
 * @param shortCode - The short code to look up (will be normalized)
 * @returns The link data or null if not found
 */
export async function getLinkByShortCode(shortCode: string): Promise<{
  data: Link | null;
  error: Error | null;
}> {
  try {
    // Normalize the short code
    const normalizedCode = normalizeShortCode(shortCode);
    
    if (!normalizedCode || normalizedCode.length < 3) {
      return {
        data: null,
        error: new Error("Invalid short code format"),
      };
    }

    // Get the link
    const { data: link, error: fetchError } = await supabase
      .from("links")
      .select("*")
      .eq("short_code", normalizedCode)
      .single();

    if (fetchError || !link) {
      return {
        data: null,
        error: new Error("Link not found"),
      };
    }

    return {
      data: link as Link,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error("Unknown error occurred"),
    };
  }
}

/**
 * Increments the click count for a link asynchronously (non-blocking)
 * This should be called after redirect to avoid blocking the redirect
 * @param shortCode - The short code to increment (will be normalized)
 * @returns Success status
 */
export async function incrementClickCount(shortCode: string): Promise<{
  success: boolean;
  error: Error | null;
}> {
  try {
    const normalizedCode = normalizeShortCode(shortCode);
    
    if (!normalizedCode) {
      return { success: false, error: new Error("Invalid short code") };
    }

    // Use RPC call if available, otherwise fallback to update
    let updateError = null;
    
    try {
      const { error: rpcError } = await supabase.rpc('increment_click_count', {
        code: normalizedCode
      });
      
      if (rpcError) {
        throw rpcError;
      }
    } catch (rpcError) {
      // Fallback to update if RPC doesn't exist
      try {
        const { data: link, error: fetchError } = await supabase
          .from("links")
          .select("click_count")
          .eq("short_code", normalizedCode)
          .single();
        
        if (fetchError || !link) {
          updateError = new Error("Link not found");
        } else {
          const { error: updateErr } = await supabase
            .from("links")
            .update({ click_count: (link.click_count || 0) + 1 })
            .eq("short_code", normalizedCode);
          
          updateError = updateErr;
        }
      } catch (err) {
        updateError = err instanceof Error ? err : new Error("Update failed");
      }
    }

    if (updateError) {
      console.error("Failed to increment click count:", updateError);
      return { success: false, error: updateError as Error };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Error incrementing click count:", error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error("Unknown error occurred"),
    };
  }
}

