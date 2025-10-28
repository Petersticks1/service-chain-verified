import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, Gift, Trophy, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function Rewards() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rewards, setRewards] = useState<any[]>([]);
  const [balance, setBalance] = useState(0);
  const [isRedeeming, setIsRedeeming] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      loadRewardsData();
    }
  }, [user]);

  const loadRewardsData = async () => {
    if (!user) return;

    const [rewardsRes, balanceRes] = await Promise.all([
      supabase.from("rewards").select("*").order("cost", { ascending: true }),
      supabase.from("token_balances").select("balance").eq("user_id", user.id).maybeSingle(),
    ]);

    if (rewardsRes.data) setRewards(rewardsRes.data);
    if (balanceRes.data) setBalance(balanceRes.data.balance);
  };

  const handleRedeem = async (reward: any) => {
    if (!user) return;
    
    if (balance < reward.cost) {
      toast({
        title: "Insufficient Balance",
        description: `You need ${reward.cost} MIL tokens but only have ${balance}`,
        variant: "destructive",
      });
      return;
    }

    setIsRedeeming(true);
    try {
      const newBalance = balance - reward.cost;
      
      const [updateResult, transactionResult] = await Promise.all([
        supabase
          .from("token_balances")
          .update({ balance: newBalance })
          .eq("user_id", user.id),
        supabase.from("transactions").insert({
          user_id: user.id,
          reward_id: reward.id,
          amount: -reward.cost,
          transaction_type: "redemption",
          description: `Redeemed: ${reward.name}`,
          hedera_transaction_id: `0.0.${Math.floor(Math.random() * 1000000)}`,
        }),
      ]);

      if (updateResult.error || transactionResult.error) {
        throw updateResult.error || transactionResult.error;
      }

      setBalance(newBalance);
      toast({
        title: "Success!",
        description: `${reward.name} redeemed successfully!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to redeem reward",
        variant: "destructive",
      });
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleEarnMore = () => {
    navigate("/dashboard");
    toast({
      title: "Complete Missions",
      description: "Complete missions and training to earn more MIL tokens",
    });
  };

  if (loading || !user) {
    return null;
  }
  return (
    <div className="min-h-screen bg-gradient-tactical">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Rewards Marketplace</h1>
          <p className="text-muted-foreground">Redeem your MIL tokens for exclusive benefits</p>
        </div>

        {/* Token Balance */}
        <Card className="p-6 mb-8 bg-gradient-military border-primary shadow-tactical">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-full bg-accent/20">
                <Coins className="h-8 w-8 text-accent" />
              </div>
              <div>
                <p className="text-sm text-foreground/80 mb-1">Your Balance</p>
                <p className="text-4xl font-bold text-foreground">{balance} MIL</p>
              </div>
            </div>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleEarnMore}>
              Earn More Tokens
            </Button>
          </div>
        </Card>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rewards.map((reward) => {
            const iconMap: any = { Gift, Trophy, Zap };
            const Icon = iconMap[reward.icon] || Gift;
            return (
              <Card key={reward.id} className={`p-6 bg-card border-border transition-all duration-300 hover:shadow-tactical ${!reward.available && 'opacity-60'}`}>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 shrink-0">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-lg">{reward.name}</h3>
                      {!reward.available && (
                        <Badge variant="secondary" className="shrink-0">Coming Soon</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Coins className="h-4 w-4 text-accent" />
                        <span className="font-bold text-accent">{reward.cost} MIL</span>
                      </div>
                      <Button 
                        size="sm" 
                        disabled={!reward.available || isRedeeming || balance < reward.cost}
                        className="bg-primary hover:bg-primary/90"
                        onClick={() => handleRedeem(reward)}
                      >
                        {isRedeeming ? "Redeeming..." : "Redeem"}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* How to Earn More */}
        <Card className="p-6 mt-8 bg-card border-border">
          <h2 className="text-2xl font-bold mb-4">How to Earn MIL Tokens</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <Trophy className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Complete Missions</h3>
              <p className="text-sm text-muted-foreground">Earn 100 MIL per verified mission</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <Zap className="h-6 w-6 text-accent mb-2" />
              <h3 className="font-semibold mb-1">Training Achievements</h3>
              <p className="text-sm text-muted-foreground">Get 50 MIL for each course completed</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <Gift className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Service Milestones</h3>
              <p className="text-sm text-muted-foreground">Receive bonus tokens for years served</p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
