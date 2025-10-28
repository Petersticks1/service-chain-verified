import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Award, Lock, Wallet, CheckCircle, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-military.jpg";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-tactical">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Shield className="h-16 w-16 text-primary animate-pulse" />
              <h1 className="text-6xl font-bold">MilitaryChain</h1>
            </div>
            <p className="text-2xl text-foreground/90 mb-4">
              Decentralized Military Service & Reward Management
            </p>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Powered by Hedera Hashgraph. Secure, transparent, and verifiable digital identity 
              for military personnel with NFT badges and tokenized rewards.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/dashboard">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-tactical">
                  <Wallet className="mr-2 h-5 w-5" />
                  Connect HashPack
                </Button>
              </Link>
              <Link to="/rewards">
                <Button size="lg" variant="outline" className="border-primary text-foreground hover:bg-primary/10">
                  Explore Rewards
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Platform Features</h2>
          <p className="text-muted-foreground text-lg">Built on Hedera's enterprise-grade blockchain</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="p-8 bg-card border-border hover:shadow-tactical transition-all duration-300 hover:scale-105">
            <div className="p-4 rounded-full bg-primary/10 w-fit mb-4">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-3">NFT Service Badges</h3>
            <p className="text-muted-foreground">
              Mint verifiable NFT badges using Hedera Token Service (HTS) for ranks, medals, and missions.
            </p>
          </Card>

          <Card className="p-8 bg-card border-border hover:shadow-tactical transition-all duration-300 hover:scale-105">
            <div className="p-4 rounded-full bg-accent/10 w-fit mb-4">
              <Lock className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Smart Contracts</h3>
            <p className="text-muted-foreground">
              Automated verification and reward distribution through Hedera Smart Contracts.
            </p>
          </Card>

          <Card className="p-8 bg-card border-border hover:shadow-tactical transition-all duration-300 hover:scale-105">
            <div className="p-4 rounded-full bg-primary/10 w-fit mb-4">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-3">MIL Token Rewards</h3>
            <p className="text-muted-foreground">
              Earn HTS fungible tokens for service achievements and redeem for exclusive benefits.
            </p>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">How MilitaryChain Works</h2>
            <p className="text-muted-foreground text-lg">Transparent and secure from start to finish</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="font-bold text-xl mb-2">Connect Wallet</h3>
              <p className="text-sm text-muted-foreground">
                Link your HashPack wallet securely to the platform
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="font-bold text-xl mb-2">Verify Service</h3>
              <p className="text-sm text-muted-foreground">
                Admin issues verified service records on-chain
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="font-bold text-xl mb-2">Earn Rewards</h3>
              <p className="text-sm text-muted-foreground">
                Receive NFT badges and MIL tokens automatically
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">
                4
              </div>
              <h3 className="font-bold text-xl mb-2">Redeem Benefits</h3>
              <p className="text-sm text-muted-foreground">
                Use tokens for exclusive veteran services
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hedera Integration */}
      <section className="py-20 container mx-auto px-4">
        <Card className="p-12 bg-gradient-military border-primary shadow-tactical max-w-4xl mx-auto">
          <div className="text-center">
            <Shield className="h-16 w-16 text-foreground mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4 text-foreground">Powered by Hedera Hashgraph</h2>
            <p className="text-lg text-foreground/90 mb-8">
              Enterprise-grade distributed ledger technology ensuring security, speed, and sustainability 
              for military service records.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Fast & Fair</h4>
                  <p className="text-sm text-foreground/80">Consensus in seconds with aBFT security</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Low Cost</h4>
                  <p className="text-sm text-foreground/80">Predictable fees under $0.01 per transaction</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Transparent</h4>
                  <p className="text-sm text-foreground/80">Public Mirror Node for complete auditability</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="py-20 container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to Join MilitaryChain?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Start your journey towards secure, verifiable military service management on the blockchain.
        </p>
        <Link to="/dashboard">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow">
            <Wallet className="mr-2 h-5 w-5" />
            Get Started Now
          </Button>
        </Link>
      </section>
    </div>
  );
}
