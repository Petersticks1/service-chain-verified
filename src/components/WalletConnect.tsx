import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Wallet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const walletSchema = z.object({
  walletId: z.string().min(3, "Wallet ID must be at least 3 characters").regex(/^0\.0\.\d+$/, "Wallet ID must be in format 0.0.xxxxx"),
});

export function WalletConnect() {
  const [walletId, setWalletId] = useState("");
  const [existingWallet, setExistingWallet] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadWallet();
    }
  }, [user]);

  const loadWallet = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from("wallet_connections")
      .select("wallet_id")
      .eq("user_id", user.id)
      .maybeSingle();
    
    if (data) {
      setExistingWallet(data.wallet_id);
      setWalletId(data.wallet_id);
    }
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      walletSchema.parse({ walletId });
      setIsLoading(true);

      if (existingWallet) {
        const { error } = await supabase
          .from("wallet_connections")
          .update({ wallet_id: walletId })
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("wallet_connections")
          .insert({ user_id: user.id, wallet_id: walletId });

        if (error) throw error;
      }

      setExistingWallet(walletId);
      toast({
        title: "Success!",
        description: "Wallet connected successfully",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Invalid Format",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to connect wallet",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center gap-3 mb-4">
        <Wallet className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-bold">
          {existingWallet ? "Connected Wallet" : "Connect Hedera Wallet"}
        </h3>
      </div>
      <form onSubmit={handleConnect} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="wallet-id">Hedera Wallet ID</Label>
          <Input
            id="wallet-id"
            placeholder="0.0.123456"
            value={walletId}
            onChange={(e) => setWalletId(e.target.value)}
            className="bg-background border-border"
          />
          <p className="text-xs text-muted-foreground">
            Enter your Hedera wallet ID in format: 0.0.xxxxx
          </p>
        </div>
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90"
          disabled={isLoading}
        >
          {isLoading ? "Connecting..." : existingWallet ? "Update Wallet" : "Connect Wallet"}
        </Button>
      </form>
    </Card>
  );
}
