import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, CheckCircle, Clock, Shield } from "lucide-react";

const mockTransactions = [
  {
    id: "0.0.12345678",
    type: "NFT Mint",
    description: "Medal of Honor Badge Issued",
    timestamp: "2024-01-15 14:30:22",
    status: "Verified",
    explorer: "https://hashscan.io/testnet/transaction/0.0.12345678"
  },
  {
    id: "0.0.12345679",
    type: "Token Transfer",
    description: "Received 100 MIL Tokens",
    timestamp: "2024-01-14 09:15:33",
    status: "Verified",
    explorer: "https://hashscan.io/testnet/transaction/0.0.12345679"
  },
  {
    id: "0.0.12345680",
    type: "Service Record",
    description: "Operation Desert Storm Verified",
    timestamp: "2024-01-13 16:45:11",
    status: "Verified",
    explorer: "https://hashscan.io/testnet/transaction/0.0.12345680"
  },
  {
    id: "0.0.12345681",
    type: "Smart Contract",
    description: "Promotion to Captain Executed",
    timestamp: "2024-01-10 11:20:44",
    status: "Verified",
    explorer: "https://hashscan.io/testnet/transaction/0.0.12345681"
  },
  {
    id: "0.0.12345682",
    type: "NFT Mint",
    description: "Service Excellence Badge Issued",
    timestamp: "2024-01-08 13:55:19",
    status: "Verified",
    explorer: "https://hashscan.io/testnet/transaction/0.0.12345682"
  },
];

export default function History() {
  return (
    <div className="min-h-screen bg-gradient-tactical">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Transaction History</h1>
          <p className="text-muted-foreground">Verified on-chain records via Hedera Mirror Node</p>
        </div>

        {/* Network Info */}
        <Card className="p-6 mb-8 bg-card border-border">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Hedera Network Status</h3>
              <p className="text-sm text-muted-foreground">All transactions are verified and immutable on Hedera Hashgraph</p>
            </div>
            <Badge className="bg-primary text-primary-foreground">
              <CheckCircle className="h-3 w-3 mr-1" />
              Connected
            </Badge>
          </div>
        </Card>

        {/* Transaction List */}
        <div className="space-y-4">
          {mockTransactions.map((tx) => (
            <Card key={tx.id} className="p-6 bg-card border-border hover:border-primary/50 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      {tx.id}
                    </Badge>
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      {tx.type}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{tx.description}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{tx.timestamp}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <Badge className="bg-primary text-primary-foreground">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {tx.status}
                  </Badge>
                  <a
                    href={tx.explorer}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    View on HashScan
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Mirror Node Info */}
        <Card className="p-6 mt-8 bg-muted/50 border-border">
          <h3 className="font-semibold mb-2">About Mirror Node Verification</h3>
          <p className="text-sm text-muted-foreground">
            All service records, NFT badges, and token transactions are permanently recorded on the Hedera network 
            and can be independently verified through the Hedera Mirror Node API. Each transaction ID can be 
            traced back to its origin, ensuring complete transparency and immutability of military service records.
          </p>
        </Card>
      </main>
    </div>
  );
}
