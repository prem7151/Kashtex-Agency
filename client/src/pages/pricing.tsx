import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Chatbot from "@/components/ui/chatbot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

const tiers = [
  {
    name: "Starter",
    price: "$1,499",
    description: "Perfect for small businesses and personal portfolios.",
    features: [
      "Responsive 5-Page Website",
      "Contact Form Integration",
      "Basic SEO Setup",
      "Mobile Friendly",
      "1 Month Support",
    ],
    cta: "Select Starter",
    popular: false
  },
  {
    name: "Business",
    price: "$3,499",
    description: "Complete solution for growing businesses.",
    features: [
      "Up to 10 Pages",
      "CMS Integration (Manage content)",
      "Blog / News Section",
      "Social Media Integration",
      "Advanced SEO Optimization",
      "Speed Optimization",
      "3 Months Support"
    ],
    cta: "Select Business",
    popular: true
  },
  {
    name: "E-Commerce / Custom",
    price: "From $5,999",
    description: "For online stores and complex web applications.",
    features: [
      "Full E-Commerce Functionality",
      "Custom Backend Development",
      "User Accounts & Auth",
      "Payment Gateway Setup",
      "Database Integration",
      "Admin Dashboard",
      "Priority Support"
    ],
    cta: "Contact for Quote",
    popular: false
  }
];

export default function Pricing() {
  const { toast } = useToast();

  const handlePurchase = (tierName: string) => {
    if (tierName === "E-Commerce / Custom") {
        window.location.href = "/contact";
        return;
    }
    
    // Simulate payment flow
    toast({
      title: "Payment System Ready",
      description: "Payment integration (Stripe/Razorpay) will be enabled once API keys are configured in the admin panel.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-20 bg-muted/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-[0.04]" />
        <div className="container px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-heading font-bold mb-4">Transparent Pricing</h1>
            <p className="text-muted-foreground text-lg">
              Choose the package that fits your needs. No hidden fees, just quality code.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {tiers.map((tier) => (
              <Card 
                key={tier.name} 
                className={`flex flex-col relative ${
                  tier.popular 
                    ? "border-primary shadow-lg scale-105 z-10" 
                    : "border-border shadow-sm hover:shadow-md transition-shadow"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <div className="mt-2 mb-1">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    {tier.price !== "Custom" && <span className="text-muted-foreground text-sm font-normal">/project</span>}
                  </div>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start text-sm">
                        <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant={tier.popular ? "default" : "outline"}
                    onClick={() => handlePurchase(tier.name)}
                  >
                    {tier.cta}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center bg-card border p-8 rounded-xl max-w-3xl mx-auto shadow-sm">
            <h3 className="text-xl font-bold mb-2">Need a custom maintenance plan?</h3>
            <p className="text-muted-foreground mb-6">
              We offer ongoing support packages starting at $149/month for updates, backups, and security checks.
            </p>
            <Link href="/contact">
              <Button variant="secondary">Contact Us</Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
      <Chatbot />
    </div>
  );
}
