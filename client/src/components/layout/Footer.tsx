import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-heading text-xl font-bold">Kashtex</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Full-stack website development solutions for modern businesses. 
              Frontend, backend, and everything in between.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Web Development</li>
              <li>Frontend Design</li>
              <li>Backend Systems</li>
              <li>Maintenance</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about"><a className="hover:text-primary transition-colors">About Us</a></Link></li>
              <li><Link href="/portfolio"><a className="hover:text-primary transition-colors">Portfolio</a></Link></li>
              <li><Link href="/contact"><a className="hover:text-primary transition-colors">Contact</a></Link></li>
              <li><Link href="/admin/login"><a className="hover:text-primary transition-colors">Admin Login</a></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Kashtex1@gmail.com</li>
              <li>+91 8200369078</li>
              <li>Online-only Agency</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Kashtex. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy"><a className="hover:text-primary">Privacy Policy</a></Link>
            <Link href="/terms"><a className="hover:text-primary">Terms of Service</a></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
