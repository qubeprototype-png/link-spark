import { supabase } from "./supabase";
import type { Link, DashboardStats, DashboardData } from "@/types/database";

/**
 * Fetches dashboard data for the authenticated user
 * Returns stats and recent links in a single optimized query
 */
export async function getDashboardData(userId: string): Promise<DashboardData> {
  // Get all user links with optimized query
  const { data: links, error: linksError } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (linksError) {
    throw new Error(`Failed to fetch links: ${linksError.message}`);
  }

  const userLinks = (links || []) as Link[];

  // Calculate stats from the fetched links
  const totalLinks = userLinks.length;
  const totalClicks = userLinks.reduce((sum, link) => sum + link.click_count, 0);
  
  // Calculate links created in last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const linksLast7Days = userLinks.filter(
    (link) => new Date(link.created_at) >= sevenDaysAgo
  ).length;

  const stats: DashboardStats = {
    totalLinks,
    totalClicks,
    linksLast7Days,
  };

  return {
    stats,
    links: userLinks,
  };
}
