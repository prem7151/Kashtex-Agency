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
        <div className="bg-muted/30 py-20">
          <div className="container px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">Our Services</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We provide comprehensive web solutions tailored to your specific business needs. 
              Transparent pricing, professional delivery, and lasting quality.
            </p>
          </div>
        </div>

        <div className="container px-4 py-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <service.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription className="text-base mt-2">{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
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
