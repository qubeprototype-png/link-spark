import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Mail, Lock, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AuthDialog = ({ open, onOpenChange }: AuthDialogProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Account created! Please check your email to verify your account.");
          onOpenChange(false);
          setEmail("");
          setPassword("");
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Logged in successfully!");
          onOpenChange(false);
          setEmail("");
          setPassword("");
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setEmail("");
    setPassword("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="relative">
          {/* Header Section */}
          <div className="px-8 pt-8 pb-6">
            <DialogHeader className="text-center space-y-3">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-elevated mb-2">
                <Sparkles className="h-8 w-8 text-primary-foreground" />
              </div>
              <DialogTitle className="text-2xl font-bold">
                {isSignUp ? "Create your account" : "Welcome back"}
              </DialogTitle>
              <DialogDescription className="text-base">
                {isSignUp
                  ? "Join thousands of brands using LinkForge to shorten, track, and own their links."
                  : "Sign in to access your dashboard and manage your links."}
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
            <div className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                    className="pl-12 h-12 rounded-xl border-2 focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                    minLength={6}
                    className="pl-12 h-12 rounded-xl border-2 focus:border-primary transition-colors"
                  />
                </div>
                {isSignUp && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Must be at least 6 characters
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full h-12 rounded-xl text-base font-semibold shadow-elevated hover:shadow-glow transition-all"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {isSignUp ? "Creating your account..." : "Signing you in..."}
                </>
              ) : (
                <>
                  {isSignUp ? "Create account" : "Sign in"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>

            {/* Divider */}
            <div className="relative">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-background px-4 text-sm text-muted-foreground">or</span>
              </div>
            </div>

            {/* Toggle Mode Button */}
            <Button
              type="button"
              variant="outline"
              onClick={toggleMode}
              disabled={loading}
              className="w-full h-12 rounded-xl border-2 hover:bg-accent transition-colors"
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign up"}
            </Button>

            {/* Benefits for Sign Up */}
            {isSignUp && (
              <div className="pt-4 space-y-3">
                <p className="text-sm font-medium text-center text-muted-foreground">
                  What you'll get:
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col items-center p-3 rounded-xl bg-secondary/50 border border-border/50">
                    <CheckCircle2 className="h-5 w-5 text-primary mb-1.5" />
                    <span className="text-xs font-medium text-center">Track clicks</span>
                  </div>
                  <div className="flex flex-col items-center p-3 rounded-xl bg-secondary/50 border border-border/50">
                    <CheckCircle2 className="h-5 w-5 text-primary mb-1.5" />
                    <span className="text-xs font-medium text-center">Custom links</span>
                  </div>
                  <div className="flex flex-col items-center p-3 rounded-xl bg-secondary/50 border border-border/50">
                    <CheckCircle2 className="h-5 w-5 text-primary mb-1.5" />
                    <span className="text-xs font-medium text-center">Analytics</span>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

