import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Code, Layout, Shield, CheckCircle } from "lucide-react";
import heroImage from "@assets/stock_images/modern_web_developme_383ffb88.jpg";
import portfolio1 from "@assets/stock_images/professional_busines_e2f8f105.jpg";
import portfolio2 from "@assets/stock_images/modern_corporate_fin_85b7c211.jpg";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Chatbot from "@/components/ui/chatbot";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background py-20 lg:py-32">
        <div className="absolute inset-0 bg-modern-dots pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full bg-noise pointer-events-none" />
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6 animate-in slide-in-from-left-5 duration-700">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 w-fit text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                Professional Web Development
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight text-foreground">
                Building Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">Digital Future</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-[600px] leading-relaxed">
                Kashtex delivers full-stack web solutions that drive business growth. 
                From custom frontends to secure backend systems, we build it all.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact">
                  <Button size="lg" className="h-12 px-8 text-base">
                    Start a Project <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/portfolio">
                  <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                    View Our Work
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative aspect-square lg:aspect-auto lg:h-[600px] animate-in slide-in-from-right-5 duration-700 delay-200">
              <img 
                src={heroImage} 
                alt="Digital Technology Abstract" 
                className="w-full h-full object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/10 dark:ring-white/10" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-[hsl(var(--contrast-bg))] text-[hsl(var(--contrast-foreground))] relative overflow-hidden">
        <div className="absolute inset-0 bg-modern-dots opacity-10 pointer-events-none" />
        <div className="container px-4 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4 text-white">Why Choose Kashtex?</h2>
            <p className="text-white/60">We don't just write code; we engineer solutions that are scalable, secure, and user-friendly.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
              <Layout className="h-10 w-10 mb-6 text-emerald-400" />
              <h3 className="text-xl font-bold mb-3 text-white">Modern Design</h3>
              <p className="text-white/60 leading-relaxed">Responsive, aesthetic interfaces that look great on mobile, tablet, and desktop devices.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
              <Code className="h-10 w-10 mb-6 text-emerald-400" />
              <h3 className="text-xl font-bold mb-3 text-white">Full-Stack Power</h3>
              <p className="text-white/60 leading-relaxed">Custom backend development, API integration, and database management tailored to your needs.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
              <Shield className="h-10 w-10 mb-6 text-emerald-400" />
              <h3 className="text-xl font-bold mb-3 text-white">Secure & Reliable</h3>
              <p className="text-white/60 leading-relaxed">Built with security best practices, data validation, and optimized performance in mind.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Work Preview */}
      <section className="py-20">
        <div className="container px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-4">Featured Projects</h2>
              <p className="text-muted-foreground">A glimpse of what we can build for you.</p>
            </div>
            <Link href="/portfolio">
              <Button variant="ghost" className="hidden sm:flex">View All Projects <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="group overflow-hidden rounded-xl border bg-card">
              <div className="aspect-video overflow-hidden">
                <img src={portfolio1} alt="E-commerce Project" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">LuxeCommerce Platform</h3>
                <p className="text-muted-foreground mb-4">Full-stack e-commerce solution with inventory management.</p>
                <div className="flex gap-2">
                  <span className="text-xs bg-secondary px-2 py-1 rounded">React</span>
                  <span className="text-xs bg-secondary px-2 py-1 rounded">Node.js</span>
                </div>
              </div>
            </div>
            <div className="group overflow-hidden rounded-xl border bg-card">
              <div className="aspect-video overflow-hidden">
                <img src={portfolio2} alt="Corporate Project" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">FinTech Dashboard</h3>
                <p className="text-muted-foreground mb-4">Secure client portal for a financial services firm.</p>
                <div className="flex gap-2">
                  <span className="text-xs bg-secondary px-2 py-1 rounded">TypeScript</span>
                  <span className="text-xs bg-secondary px-2 py-1 rounded">PostgreSQL</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link href="/portfolio">
              <Button variant="ghost">View All Projects <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-6">Ready to start your project?</h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8 text-lg">
            Let's turn your vision into a reality. Contact us today for a free consultation and quote.
          </p>
          <Link href="/contact">
            <Button size="lg" variant="secondary" className="h-14 px-8 text-lg">
              Get in Touch
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </div>
  );
}
