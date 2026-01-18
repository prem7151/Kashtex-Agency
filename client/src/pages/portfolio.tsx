import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Chatbot from "@/components/ui/chatbot";
import { Badge } from "@/components/ui/badge";
import portfolio1 from "@assets/generated_images/e-commerce_website_mockup.png";
import portfolio2 from "@assets/generated_images/corporate_website_mockup.png";
import portfolio3 from "@assets/generated_images/creative_portfolio_mockup.png";

const projects = [
  {
    title: "LuxeCommerce",
    category: "E-commerce",
    image: portfolio1,
    description: "A high-end e-commerce platform built for a luxury fashion brand. Features include real-time inventory management, secure payment gateway integration, and a custom CMS for product updates.",
    tech: ["React", "Node.js", "Stripe", "PostgreSQL"]
  },
  {
    title: "Apex Financial",
    category: "Corporate",
    image: portfolio2,
    description: "Secure client portal and corporate website for a financial advisory firm. Includes data visualization dashboards, secure document sharing, and appointment scheduling.",
    tech: ["TypeScript", "Next.js", "Chart.js", "AWS"]
  },
  {
    title: "Studio Vivid",
    category: "Creative",
    image: portfolio3,
    description: "Immersive portfolio website for a digital design agency. Features WebGL animations, smooth scroll effects, and a custom content management system.",
    tech: ["React", "Three.js", "GSAP", "Sanity CMS"]
  }
];

export default function Portfolio() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="bg-muted/30 py-20">
          <div className="container px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">Our Work</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A selection of our recent projects. We take pride in delivering high-quality, 
              functional, and beautiful digital experiences.
            </p>
          </div>
        </div>

        <div className="container px-4 py-20">
          <div className="grid gap-16">
            {projects.map((project, index) => (
              <div key={index} className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-12 items-center`}>
                <div className="w-full md:w-1/2 group">
                  <div className="relative overflow-hidden rounded-xl border shadow-lg aspect-[4/3]">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                  </div>
                </div>
                
                <div className="w-full md:w-1/2 space-y-6">
                  <div>
                    <Badge variant="secondary" className="mb-3">{project.category}</Badge>
                    <h2 className="text-3xl font-heading font-bold mb-3">{project.title}</h2>
                    <p className="text-muted-foreground leading-relaxed text-lg">{project.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm mb-3 text-foreground/80">Technologies Used:</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((t) => (
                        <span key={t} className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-md border">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <Chatbot />
    </div>
  );
}
