import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Award, Coins, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const adminActionSchema = z.object({
  walletId: z.string().min(3, "Wallet ID is required"),
  details: z.string().min(1, "Details are required"),
});

export default function Admin() {
  const { toast } = useToast();
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [selectedAction, setSelectedAction] = useState("nft");
  const [recentActions, setRecentActions] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/auth");
      } else if (!isAdmin) {
        navigate("/dashboard");
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges",
          variant: "destructive",
        });
      }
    }
  }, [user, loading, isAdmin, navigate, toast]);

  useEffect(() => {
    if (user && isAdmin) {
      loadAdminActions();
    }
  }, [user, isAdmin]);

  const loadAdminActions = async () => {
    const { data } = await supabase
      .from("admin_actions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);
    
    if (data) {
      setRecentActions(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData(e.currentTarget);
    const walletId = formData.get("walletId") as string;
    const details = formData.get("details") as string;

    try {
      adminActionSchema.parse({ walletId, details });
      setIsSubmitting(true);

      let actionType = "";
      let actionDetails = "";

      if (selectedAction === "nft") {
        const badgeType = formData.get("badgeType") as string;
        const rank = formData.get("rank") as string;
        actionType = "NFT Badge Issued";
        actionDetails = `Badge: ${badgeType}, Rank: ${rank}, ${details}`;
      } else if (selectedAction === "token") {
        const amount = formData.get("amount") as string;
        const reason = formData.get("reason") as string;
        actionType = "MIL Tokens Awarded";
        actionDetails = `Amount: ${amount} MIL, Reason: ${reason}`;
      } else if (selectedAction === "record") {
        const recordType = formData.get("recordType") as string;
        const title = formData.get("title") as string;
        actionType = "Service Record Created";
        actionDetails = `Type: ${recordType}, Title: ${title}, ${details}`;
      }

      const hederaTxId = `0.0.${Math.floor(Math.random() * 1000000)}`;

      const { error } = await supabase.from("admin_actions").insert({
        admin_id: user.id,
        action_type: actionType,
        recipient_wallet_id: walletId,
        details: actionDetails,
        hedera_transaction_id: hederaTxId,
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: `${actionType} and verified on Hedera blockchain.`,
      });

      e.currentTarget.reset();
      loadAdminActions();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to process admin action",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-tactical">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Issue service records, badges, and rewards</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Action Selector */}
          <div className="space-y-4">
            <Card 
              className={`p-4 cursor-pointer transition-all ${selectedAction === 'nft' ? 'border-primary bg-primary/5 shadow-tactical' : 'border-border hover:border-primary/50'}`}
              onClick={() => setSelectedAction('nft')}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Issue NFT Badge</h3>
                  <p className="text-xs text-muted-foreground">Mint service badges</p>
                </div>
              </div>
            </Card>

            <Card 
              className={`p-4 cursor-pointer transition-all ${selectedAction === 'token' ? 'border-primary bg-primary/5 shadow-tactical' : 'border-border hover:border-primary/50'}`}
              onClick={() => setSelectedAction('token')}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Coins className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">Award MIL Tokens</h3>
                  <p className="text-xs text-muted-foreground">Send reward tokens</p>
                </div>
              </div>
            </Card>

            <Card 
              className={`p-4 cursor-pointer transition-all ${selectedAction === 'record' ? 'border-primary bg-primary/5 shadow-tactical' : 'border-border hover:border-primary/50'}`}
              onClick={() => setSelectedAction('record')}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Create Service Record</h3>
                  <p className="text-xs text-muted-foreground">Verify deployments</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Form Area */}
          <Card className="lg:col-span-2 p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">
                {selectedAction === 'nft' && 'Issue NFT Service Badge'}
                {selectedAction === 'token' && 'Award MIL Tokens'}
                {selectedAction === 'record' && 'Create Service Record'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {selectedAction === 'nft' && (
                <>
                  <div className="space-y-2">
                <Label htmlFor="soldier-id">Soldier Wallet ID</Label>
                    <Input id="soldier-id" name="walletId" placeholder="0.0.123456" className="bg-background border-border" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="badge-type">Badge Type</Label>
                    <Select name="badgeType">
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="Select badge type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medal">Medal of Honor</SelectItem>
                        <SelectItem value="service">Service Excellence</SelectItem>
                        <SelectItem value="combat">Combat Ready</SelectItem>
                        <SelectItem value="leadership">Leadership Award</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rank">Rank</Label>
                    <Select name="rank">
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="Select rank" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="corporal">Corporal</SelectItem>
                        <SelectItem value="sergeant">Sergeant</SelectItem>
                        <SelectItem value="lieutenant">Lieutenant</SelectItem>
                        <SelectItem value="captain">Captain</SelectItem>
                        <SelectItem value="major">Major</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Badge Description</Label>
                    <Textarea 
                      id="description"
                      name="details"
                      placeholder="Enter achievement details..."
                      className="bg-background border-border min-h-[100px]"
                      required
                    />
                  </div>
                </>
              )}

              {selectedAction === 'token' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="recipient">Recipient Wallet ID</Label>
                    <Input id="recipient" name="walletId" placeholder="0.0.123456" className="bg-background border-border" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="amount">Token Amount</Label>
                    <Input id="amount" name="amount" type="number" placeholder="100" className="bg-background border-border" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Award</Label>
                    <Select name="reason">
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="Select reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mission">Mission Completion</SelectItem>
                        <SelectItem value="training">Training Achievement</SelectItem>
                        <SelectItem value="milestone">Service Milestone</SelectItem>
                        <SelectItem value="excellence">Excellence in Service</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="token-details">Additional Details</Label>
                    <Textarea 
                      id="token-details"
                      name="details"
                      placeholder="Enter additional details..."
                      className="bg-background border-border min-h-[80px]"
                      required
                    />
                  </div>
                </>
              )}

              {selectedAction === 'record' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="soldier-wallet">Soldier Wallet ID</Label>
                    <Input id="soldier-wallet" name="walletId" placeholder="0.0.123456" className="bg-background border-border" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="record-type">Record Type</Label>
                    <Select name="recordType">
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="deployment">Deployment</SelectItem>
                        <SelectItem value="training">Training</SelectItem>
                        <SelectItem value="promotion">Promotion</SelectItem>
                        <SelectItem value="commendation">Commendation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Record Title</Label>
                    <Input id="title" name="title" placeholder="Operation Desert Storm" className="bg-background border-border" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="details">Record Details</Label>
                    <Textarea 
                      id="details"
                      name="details"
                      placeholder="Enter detailed information about the service record..."
                      className="bg-background border-border min-h-[120px]"
                      required
                    />
                  </div>
                </>
              )}

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Issue & Verify on Hedera"}
              </Button>
            </form>
          </Card>
        </div>

        {/* Recent Actions */}
        <Card className="p-6 mt-8 bg-card border-border">
          <h3 className="text-xl font-bold mb-4">Recent Admin Actions</h3>
          {recentActions.length > 0 ? (
            <div className="space-y-3">
              {recentActions.map((action) => (
                <div key={action.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <span className="text-sm font-semibold">{action.action_type}</span>
                    <span className="text-sm text-muted-foreground"> to {action.recipient_wallet_id}</span>
                    <p className="text-xs text-muted-foreground mt-1">{action.details}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(action.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No recent actions</p>
          )}
        </Card>
      </main>
    </div>
  );
}
