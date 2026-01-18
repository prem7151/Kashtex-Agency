import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Chatbot from "@/components/ui/chatbot";
import { CheckCircle2 } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <section className="py-20 bg-background">
          <div className="container px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-8 text-center">About Kashtex</h1>
            
            <div className="prose prose-zinc dark:prose-invert max-w-none text-lg leading-relaxed text-muted-foreground">
              <p className="mb-6">
                Kashtex is a forward-thinking digital agency dedicated to empowering businesses with 
                robust, high-performance web solutions. We operate as a modern, online-first organization, 
                allowing us to serve clients efficiently without the overhead of traditional brick-and-mortar agencies.
              </p>
              
              <p className="mb-6">
                Our mission is simple: to bridge the gap between complex technology and business goals. 
                We believe that a website shouldn't just exist—it should work for you. Whether it's 
                automating customer interactions, processing sales, or presenting your brand to the world, 
                we build systems that deliver results.
              </p>

              <h2 className="text-2xl font-heading font-bold text-foreground mt-12 mb-6">Our Philosophy</h2>
              <div className="grid md:grid-cols-2 gap-6 not-prose">
                <div className="flex gap-4 items-start">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-foreground">Transparent Communication</h3>
                    <p className="text-base">No jargon, no hidden fees. We explain everything in plain English.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-foreground">Quality First</h3>
                    <p className="text-base">We don't cut corners. Every line of code is written with performance and security in mind.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-foreground">Long-term Partnership</h3>
                    <p className="text-base">We're not just here for the launch. We support your growth as your business evolves.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-foreground">Agile Development</h3>
                    <p className="text-base">Fast iterations and regular updates so you're always in the loop.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/30 border-t">
          <div className="container px-4 text-center">
            <h2 className="text-3xl font-heading font-bold mb-4">Ready to work with us?</h2>
            <p className="text-muted-foreground mb-8">Let's discuss how we can help your business grow.</p>
            <a href="/contact" className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
              Contact Us Today
            </a>
          </div>
        </section>
      </main>

      <Footer />
      <Chatbot />
    </div>
  );
}
