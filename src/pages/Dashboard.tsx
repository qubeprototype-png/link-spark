import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardData } from "@/lib/dashboard";
import type { Link, DashboardStats } from "@/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { Copy, Check, ExternalLink, Link2, MousePointerClick, TrendingUp } from "lucide-react";
import { format } from "date-fns";

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalLinks: 0,
    totalClicks: 0,
    linksLast7Days: 0,
  });
  const [links, setLinks] = useState<Link[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const data = await getDashboardData(user.id);
      setStats(data.stats);
      setLinks(data.links);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyShortUrl = async (link: Link) => {
    const shortUrl = `${window.location.origin}/${link.short_code}`;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedId(link.id);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast.error("Failed to copy URL");
    }
  };

  const handleRowClick = (link: Link) => {
    handleCopyShortUrl(link);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  const statsCards = [
    {
      title: "Total Links Created",
      value: stats.totalLinks,
      icon: Link2,
    },
    {
      title: "Total Clicks",
      value: stats.totalClicks,
      icon: MousePointerClick,
    },
    {
      title: "Links Created in Last 7 Days",
      value: stats.linksLast7Days,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your URL shortening activity and track your links
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Loading dashboard data...</div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <section className="mb-12" aria-label="Overview">
              <h2 className="text-xl font-semibold text-foreground mb-4">Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {statsCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <Card
                      key={card.title}
                      className="rounded-2xl shadow-sm border-border/50"
                      role="region"
                      aria-label={card.title}
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-medium text-muted-foreground">
                          {card.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="text-3xl font-bold text-foreground">{card.value}</div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>

            {/* Recent Links Table */}
            <section aria-label="Recent Links">
              <h2 className="text-xl font-semibold text-foreground mb-4">Recent Links</h2>
              <Card className="rounded-2xl shadow-sm border-border/50">
                <CardContent className="p-0">
                  {links.length === 0 ? (
                    <div className="p-12 text-center">
                      <p className="text-muted-foreground">No links created yet</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Start shortening URLs to see them here
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Desktop Table */}
                      <div className="hidden md:block overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Short URL</TableHead>
                              <TableHead>Original URL</TableHead>
                              <TableHead className="text-right">Clicks</TableHead>
                              <TableHead className="text-right">Created</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {links.map((link) => {
                              const shortUrl = `${window.location.origin}/${link.short_code}`;
                              const isCopied = copiedId === link.id;
                              return (
                                <TableRow
                                  key={link.id}
                                  className="cursor-pointer focus-within:bg-muted/50"
                                  onClick={() => handleRowClick(link)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                      e.preventDefault();
                                      handleRowClick(link);
                                    }
                                  }}
                                  tabIndex={0}
                                  role="button"
                                  aria-label={`Copy short URL for ${link.original_url}`}
                                >
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono text-sm">{shortUrl}</span>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleCopyShortUrl(link);
                                        }}
                                        className="p-1 rounded hover:bg-muted transition-colors"
                                        aria-label="Copy short URL"
                                      >
                                        {isCopied ? (
                                          <Check className="h-4 w-4 text-success" />
                                        ) : (
                                          <Copy className="h-4 w-4 text-muted-foreground" />
                                        )}
                                      </button>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2 max-w-md">
                                      <span className="truncate text-muted-foreground">
                                        {link.original_url}
                                      </span>
                                      <a
                                        href={link.original_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="shrink-0 p-1 rounded hover:bg-muted transition-colors"
                                        aria-label="Open original URL"
                                      >
                                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                      </a>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Badge variant="secondary">{link.click_count}</Badge>
                                  </TableCell>
                                  <TableCell className="text-right text-muted-foreground">
                                    {formatDate(link.created_at)}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Mobile Stacked Layout */}
                      <div className="md:hidden">
                        <div className="divide-y divide-border">
                          {links.map((link) => {
                            const shortUrl = `${window.location.origin}/${link.short_code}`;
                            const isCopied = copiedId === link.id;
                            return (
                              <div
                                key={link.id}
                                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors focus-within:bg-muted/50"
                                onClick={() => handleRowClick(link)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    handleRowClick(link);
                                  }
                                }}
                                tabIndex={0}
                                role="button"
                                aria-label={`Copy short URL for ${link.original_url}`}
                              >
                                <div className="space-y-3">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                      <p className="font-mono text-sm font-medium text-foreground mb-1">
                                        {shortUrl}
                                      </p>
                                      <p className="text-sm text-muted-foreground truncate">
                                        {link.original_url}
                                      </p>
                                    </div>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCopyShortUrl(link);
                                      }}
                                      className="p-2 rounded hover:bg-muted/50 transition-colors shrink-0"
                                      aria-label="Copy short URL"
                                    >
                                      {isCopied ? (
                                        <Check className="h-4 w-4 text-success" />
                                      ) : (
                                        <Copy className="h-4 w-4 text-muted-foreground" />
                                      )}
                                    </button>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <Badge variant="secondary">{link.click_count} clicks</Badge>
                                    <span className="text-sm text-muted-foreground">
                                      {formatDate(link.created_at)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
