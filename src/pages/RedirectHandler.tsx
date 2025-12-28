import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLinkByShortCode, incrementClickCount, normalizeShortCode } from "@/lib/links";
import { Loader2 } from "lucide-react";

const RedirectHandler = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleRedirect = async () => {
      if (!shortCode) {
        setError("Invalid short code");
        setLoading(false);
        return;
      }

      // Normalize the short code
      const normalizedCode = normalizeShortCode(shortCode);
      
      if (!normalizedCode || normalizedCode.length < 3) {
        setError("Invalid short code format");
        setLoading(false);
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
        return;
      }

      try {
        // Fetch link (non-blocking analytics)
        const { data: link, error: linkError } = await getLinkByShortCode(normalizedCode);

        if (linkError || !link) {
          setError("Link not found");
          setLoading(false);
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
          return;
        }

        // Increment analytics asynchronously (don't wait)
        incrementClickCount(normalizedCode).catch((err) => {
          console.error("Analytics update failed:", err);
          // Don't block redirect for analytics
        });

        // Immediate redirect (use replace to avoid back button issues)
        window.location.replace(link.original_url);
      } catch (err) {
        console.error("Error redirecting:", err);
        setError("An error occurred while redirecting");
        setLoading(false);
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      }
    };

    // Start redirect immediately
    handleRedirect();
  }, [shortCode]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Oops!</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <p className="text-sm text-muted-foreground">Redirecting to homepage...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
};

export default RedirectHandler;

