import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Zap, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { AuthDialog } from "@/components/AuthDialog";

interface Plan {
  name: string;
  cost: string;
  billing_cycle: string;
  features: string[];
  limitations: string[];
  popular?: boolean;
}

const Pricing = () => {
  const { user } = useAuth();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  const plans: Plan[] = [
    {
      name: "Free",
      cost: "0",
      billing_cycle: "Monthly",
      features: [
        "Short links per month: 5",
        "Custom back-halves per month: 3",
        "QR Codes per month: 2",
        "Custom landing pages: 2",
        "Unlimited clicks & QR scans",
        "Basic link & QR code customizations"
      ],
      limitations: [
        "No branded/custom domain",
        "Limited link and QR creation quota",
        "No advanced analytics"
      ]
    },
    {
      name: "Core",
      cost: "10",
      billing_cycle: "Monthly (Annual Only)",
      features: [
        "Everything in Free",
        "Short links per month: 100",
        "QR Codes per month: 5",
        "Custom landing pages: 5",
        "30 days of click & scan data",
        "UTM builder",
        "Advanced QR Code customizations",
        "Redirects management"
      ],
      limitations: [
        "No custom domain included"
      ]
    },
    {
      name: "Growth",
      cost: "29",
      billing_cycle: "Monthly",
      features: [
        "Everything in Core",
        "Short links per month: 500",
        "QR Codes per month: 10",
        "Custom landing pages: 10",
        "Complimentary custom domain",
        "Branded links",
        "4 months of click & scan data",
        "Bulk link & QR code creation"
      ],
      limitations: [
        "Data retention still limited compared to premium"
      ],
      popular: true
    },
    {
      name: "Premium",
      cost: "199",
      billing_cycle: "Monthly",
      features: [
        "Everything in Growth",
        "Short links per month: 3000",
        "QR Codes per month: 200",
        "Custom landing pages: 20",
        "1 year of click & scan data",
        "Custom campaign-level tracking",
        "City-level and device-level analytics",
        "Mobile deep linking"
      ],
      limitations: []
    },
    {
      name: "Enterprise",
      cost: "Custom (Contact Sales)",
      billing_cycle: "Custom",
      features: [
        "Unlimited & scalable link/QR creation",
        "Multiple users & permissions",
        "Advanced performance tracking",
        "Custom onboarding & priority support",
        "High-volume API/webhook access",
        "99.9% SLA uptime",
        "SSO + Advanced security"
      ],
      limitations: []
    }
  ];

  const commonFeatures = [
    "URL Shortener",
    "QR Code generation",
    "Landing pages",
    "Link analytics",
    "Redirects",
    "API Access (varies by plan)"
  ];

  const handleGetStarted = () => {
    if (user) {
      window.location.href = "/dashboard";
    } else {
      setAuthDialogOpen(true);
    }
  };

  const handleContactSales = () => {
    // In a real app, this would open a contact form or redirect to a sales page
    window.location.href = "mailto:sales@linkforge.com?subject=Enterprise Plan Inquiry";
  };

  return (
    <>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 gradient-hero" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
            
            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
              <div className="text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                  <Sparkles className="h-4 w-4" />
                  Simple, transparent pricing
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                  Choose the perfect plan
                  <span className="text-primary"> for your needs</span>
                </h1>
                
                <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                  Start free and scale as you grow. All plans include our core features with no hidden fees.
                </p>
              </div>
            </div>
          </section>

          {/* Pricing Cards */}
          <section className="py-12 sm:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 lg:gap-4">
                {plans.map((plan, index) => (
                  <Card
                    key={plan.name}
                    className={`relative flex flex-col ${
                      plan.popular
                        ? "border-primary shadow-elevated lg:scale-105 lg:-mt-4 lg:mb-4"
                        : "border-border"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <Badge className="bg-primary text-primary-foreground">
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="pb-4">
                      <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                      <div className="flex items-baseline gap-1">
                        {plan.cost === "Custom (Contact Sales)" ? (
                          <span className="text-3xl font-bold">Custom</span>
                        ) : (
                          <>
                            <span className="text-3xl font-bold">${plan.cost}</span>
                            <span className="text-muted-foreground text-sm">/{plan.billing_cycle === "Monthly" ? "mo" : plan.billing_cycle === "Monthly (Annual Only)" ? "mo" : ""}</span>
                          </>
                        )}
                      </div>
                      {plan.billing_cycle !== "Monthly" && plan.billing_cycle !== "Custom" && (
                        <CardDescription className="text-xs mt-1">
                          {plan.billing_cycle}
                        </CardDescription>
                      )}
                    </CardHeader>
                    
                    <CardContent className="flex-1 space-y-4">
                      <div className="space-y-3">
                        <div className="text-sm font-semibold text-foreground mb-2">Features:</div>
                        <ul className="space-y-2">
                          {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {plan.limitations.length > 0 && (
                        <div className="space-y-3 pt-4 border-t">
                          <div className="text-sm font-semibold text-foreground mb-2">Limitations:</div>
                          <ul className="space-y-2">
                            {plan.limitations.map((limitation, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <X className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <span className="text-muted-foreground">{limitation}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                    
                    <CardFooter>
                      {plan.name === "Enterprise" ? (
                        <Button
                          variant={plan.popular ? "default" : "outline"}
                          className="w-full"
                          onClick={handleContactSales}
                        >
                          Contact Sales
                        </Button>
                      ) : (
                        <Button
                          variant={plan.popular ? "default" : "outline"}
                          className="w-full"
                          onClick={handleGetStarted}
                        >
                          {plan.cost === "0" ? "Get Started Free" : "Get Started"}
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Common Features Section */}
          <section className="py-12 sm:py-20 bg-secondary/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  All plans include
                </h2>
                <p className="text-lg text-muted-foreground">
                  Core features available across every tier
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {commonFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 rounded-lg bg-background border border-border"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <Zap className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ/Notes Section */}
          <section className="py-12 sm:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-8 text-center">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-6">
                  <div className="p-6 rounded-lg bg-secondary/20 border border-border">
                    <h3 className="font-semibold text-foreground mb-2">
                      What's included in the free plan?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      The free plan includes limited monthly quotas and basic features, perfect for personal use or trying out the platform.
                    </p>
                  </div>
                  <div className="p-6 rounded-lg bg-secondary/20 border border-border">
                    <h3 className="font-semibold text-foreground mb-2">
                      How do paid plans differ?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Paid plans incrementally increase quotas, add analytics retention, branded domains, and bulk creation tools. Higher tiers offer more data retention and advanced features.
                    </p>
                  </div>
                  <div className="p-6 rounded-lg bg-secondary/20 border border-border">
                    <h3 className="font-semibold text-foreground mb-2">
                      What about Enterprise?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      The Enterprise plan is fully customizable for large teams and businesses, with unlimited scalability, advanced security, and dedicated support.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-12 sm:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative overflow-hidden rounded-3xl bg-primary p-8 sm:p-12 lg:p-16 text-center shadow-elevated">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
                
                <div className="relative z-10">
                  <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
                    Ready to get started?
                  </h2>
                  <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                    Join thousands of brands using LinkForge to shorten, track, and own their links.
                  </p>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={handleGetStarted}
                    className="bg-background text-foreground hover:bg-background/90"
                  >
                    Start Free Today
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  );
};

export default Pricing;

