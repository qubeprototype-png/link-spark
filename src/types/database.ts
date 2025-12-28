export interface Link {
  id: string;
  user_id: string;
  short_code: string;
  original_url: string;
  click_count: number;
  created_at: string;
}

export interface DashboardStats {
  totalLinks: number;
  totalClicks: number;
  linksLast7Days: number;
}

export interface DashboardData {
  stats: DashboardStats;
  links: Link[];
}
