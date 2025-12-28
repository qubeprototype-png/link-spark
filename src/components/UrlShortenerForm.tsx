import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link2, ArrowRight, Copy, Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const UrlShortenerForm = () => {
  const [url, setUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    // Basic URL validation
    try {
      new URL(url.startsWith("http") ? url : `https://${url}`);
    } catch {
      toast.error("Please enter a valid URL");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call - will be replaced with actual Supabase call
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const shortCode = Math.random().toString(36).substring(2, 8);
    const shortened = `linkforge.app/${shortCode}`;
    setShortenedUrl(shortened);
    setIsLoading(false);
    toast.success("URL shortened successfully!");
  };

  const handleCopy = async () => {
    if (!shortenedUrl) return;
    
    await navigator.clipboard.writeText(`https://${shortenedUrl}`);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setUrl("");
    setShortenedUrl(null);
    setCopied(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent blur-xl" />
        
        <div className="relative bg-card rounded-3xl shadow-elevated border border-border/50 p-6 sm:p-8">
          {!shortenedUrl ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Paste your long URL here..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="pl-12 h-14 text-base rounded-2xl"
                    aria-label="URL to shorten"
                  />
                </div>
                <Button
                  type="submit"
                  variant="hero"
                  size="xl"
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Shortening...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Shorten URL
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 animate-scale-in">
              <div className="flex items-center justify-between gap-4 p-4 bg-secondary/50 rounded-2xl">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success shrink-0">
                    <Check className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground">Your shortened URL</p>
                    <p className="text-base font-medium text-foreground truncate">
                      {shortenedUrl}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopy}
                    aria-label="Copy URL"
                    className="h-10 w-10"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    asChild
                    className="h-10 w-10"
                  >
                    <a
                      href={`https://${shortenedUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open shortened URL"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="secondary"
                  onClick={handleReset}
                  className="flex-1"
                >
                  Shorten another URL
                </Button>
                <Button variant="default" className="flex-1">
                  Sign up to track clicks
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UrlShortenerForm;
