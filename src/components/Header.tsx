import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Link2, LogOut, User, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthDialog } from "@/components/AuthDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Header = () => {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      const formSection = document.getElementById("url-shortener-form");
      if (formSection) {
        formSection.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      setAuthDialogOpen(true);
    }
  };

  const handleLogin = () => {
    setAuthDialogOpen(true);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const getUserInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <>
      <header className="w-full border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-soft group-hover:shadow-card transition-shadow duration-200">
                <Link2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">LinkForge</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {user && (
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dashboard
                </Link>
              )}
              <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Docs
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getUserInitials(user.email || "")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="hidden lg:inline">{user.email}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard" className="flex items-center">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem disabled>
                        <User className="mr-2 h-4 w-4" />
                        <span>{user.email}</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="default" size="sm" onClick={handleGetStarted}>
                    Get Started
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={handleLogin}>
                    Log in
                  </Button>
                  <Button variant="default" size="sm" onClick={handleGetStarted}>
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  );
};

export default Header;
