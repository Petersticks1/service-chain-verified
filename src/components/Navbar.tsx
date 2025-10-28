import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Navbar = () => {
  const { user, signOut, isAdmin } = useAuth();
  const [profile, setProfile] = useState<{ full_name: string | null; rank: string | null } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from("profiles")
      .select("full_name, rank")
      .eq("id", user.id)
      .maybeSingle();
    
    if (data) {
      setProfile(data);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 transition-all hover:opacity-80">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">MilitaryChain</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            {user && (
              <>
                <Link to="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
                  Dashboard
                </Link>
                <Link to="/rewards" className="text-sm font-medium transition-colors hover:text-primary">
                  Rewards
                </Link>
                <Link to="/history" className="text-sm font-medium transition-colors hover:text-primary">
                  History
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="text-sm font-medium transition-colors hover:text-primary">
                    Admin
                  </Link>
                )}
                <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-primary/10">
                  <User className="h-4 w-4 text-primary" />
                  <span className="text-sm">
                    {profile?.full_name} {profile?.rank && `(${profile.rank})`}
                  </span>
                </div>
              </>
            )}
          </div>

          {user ? (
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          ) : (
            <Button size="sm" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};
