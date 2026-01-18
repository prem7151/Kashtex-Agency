import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Chatbot from "@/components/ui/chatbot";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check, Globe, Smartphone, Database, Server, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const services = [
  {
    icon: Globe,
    title: "Business Website Development",
    description: "Professional, multi-page websites designed to showcase your brand and services. Built for speed, SEO, and conversion.",
    features: ["Custom Design", "SEO Optimization", "Content Management", "Analytics Integration"]
  },
  {
    icon: Smartphone,
    title: "Responsive Design",
    description: "Websites that look and function perfectly on every device—desktop, tablet, and mobile phones.",
    features: ["Mobile-First Approach", "Touch-Friendly UI", "Cross-Browser Testing", "Adaptive Layouts"]
  },
  {
    icon: Database,
    title: "Custom Backend Solutions",
    description: "Robust server-side architecture to handle your data, users, and business logic securely.",
    features: ["API Development", "Database Design", "User Authentication", "Cloud Deployment"]
  },
  {
    icon: Server,
    title: "Full-Stack Applications",
    description: "Complete end-to-end web applications with complex functionality, from dashboards to SaaS platforms.",
    features: ["React/Next.js Frontends", "Node.js Backends", "Real-time Features", "Scalable Architecture"]
  },
  {
    icon: PenTool,
    title: "UI/UX Design",
    description: "User-centric design that focuses on usability, accessibility, and creating a delightful experience for your customers.",
    features: ["Wireframing", "Prototyping", "Design Systems", "Brand Integration"]
  },
  {
    icon: Check,
    title: "Maintenance & Support",
    description: "Ongoing support to keep your website secure, updated, and running smoothly after launch.",
    features: ["Security Updates", "Performance Monitoring", "Content Updates", "Technical Support"]
  }
];

export default function Services() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="relative bg-[hsl(var(--contrast-bg))] py-24 overflow-hidden">
          <div className="absolute inset-0 bg-modern-dots opacity-10 pointer-events-none" />
          <div className="container px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-white">Our Services</h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              We provide comprehensive web solutions tailored to your specific business needs. 
              Transparent pricing, professional delivery, and lasting quality.
            </p>
          </div>
        </div>

        <div className="container px-4 py-24 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-12 bg-emerald-500/20" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="h-full flex flex-col hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-border/50 bg-white/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-6">
                    <service.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription className="text-base mt-2 leading-relaxed">{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto pt-6 border-t border-border/50">
                  <ul className="space-y-3">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm text-muted-foreground font-medium">
                        <Check className="h-4 w-4 text-emerald-500 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <section className="bg-primary text-primary-foreground py-20">
          <div className="container px-4 text-center">
            <h2 className="text-3xl font-heading font-bold mb-6">Need something specific?</h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              We understand every business is unique. Contact us to discuss your custom requirements.
            </p>
            <Link href="/contact">
              <Button variant="secondary" size="lg">Get a Custom Quote</Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
      <Chatbot />
    </div>
  );
}
