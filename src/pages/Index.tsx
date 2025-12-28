import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UrlShortenerForm from "@/components/UrlShortenerForm";
import FeatureCard from "@/components/FeatureCard";
import { Zap, BarChart3, Shield, Globe, Sparkles, Clock } from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Instant redirects with sub-100ms latency. Your users won't wait."
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Track every click with detailed analytics. Know what's working."
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Enterprise-grade security with zero third-party tracking."
    },
    {
      icon: Globe,
      title: "Custom Domains",
      description: "Use your own domain for complete brand ownership."
    },
    {
      icon: Sparkles,
      title: "White-labeled",
      description: "No visible branding. Your links, your brand, always."
    },
    {
      icon: Clock,
      title: "Link Management",
      description: "Edit, expire, or password-protect your links anytime."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 gradient-hero" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
          
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div 
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in"
                style={{ animationDelay: "0.1s" }}
              >
                <Sparkles className="h-4 w-4" />
                Trusted by 10,000+ brands
              </div>
              
              <h1 
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-slide-up"
                style={{ animationDelay: "0.2s" }}
              >
                Shorten, share, and track
                <span className="text-primary"> every click</span>
              </h1>
              
              <p 
                className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up"
                style={{ animationDelay: "0.3s" }}
              >
                The fast, white-labeled URL shortener built for brands. 
                Get clean links, powerful analytics, and complete control over your brand.
              </p>
            </div>

            <div 
              id="url-shortener-form"
              className="animate-slide-up"
              style={{ animationDelay: "0.4s" }}
            >
              <UrlShortenerForm />
            </div>

            <p 
              className="text-center text-sm text-muted-foreground mt-6 animate-fade-in"
              style={{ animationDelay: "0.5s" }}
            >
              No credit card required · Free forever for basic use
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 sm:py-28 bg-secondary/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Everything you need
              </h2>
              <p className="text-lg text-muted-foreground">
                Powerful features to help you grow faster and own your brand presence.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="animate-slide-up"
                  style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                >
                  <FeatureCard {...feature} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 sm:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-primary p-8 sm:p-12 lg:p-16 text-center shadow-elevated">
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
              
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
                  Ready to take control of your links?
                </h2>
                <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                  Join thousands of brands using LinkForge to shorten, track, and own their links.
                </p>
                <button 
                  onClick={() => {
                    const formSection = document.getElementById("url-shortener-form");
                    if (formSection) {
                      formSection.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                  className="inline-flex items-center justify-center h-12 px-8 rounded-2xl bg-background text-foreground font-semibold shadow-card hover:shadow-elevated transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Get Started for Free
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
