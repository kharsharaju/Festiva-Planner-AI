import { Sparkles } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="py-24 bg-background text-foreground relative z-10 px-6 border-t border-border/50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-16">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 mb-8">
              <Sparkles className="text-primary w-8 h-8" />
              <span className="font-serif font-bold text-3xl tracking-widest">FESTIVA</span>
            </div>
            <p className="text-foreground/60 font-serif italic text-xl max-w-sm">
              Elevating the art of gathering through artificial intelligence and impeccable taste.
            </p>
          </div>
          <div className="md:col-span-3">
            <h4 className="text-sm font-bold tracking-widest uppercase mb-6 text-foreground/40">Navigation</h4>
            <ul className="space-y-4 font-serif text-lg">
              <li><Link href="/setup" className="hover:text-primary transition-colors">Start Planning</Link></li>
              <li><Link href="/" className="hover:text-primary transition-colors">Experience</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Archives</Link></li>
              <li><Link href="/vendors" className="hover:text-primary transition-colors">Vendors</Link></li>
            </ul>
          </div>
          <div className="md:col-span-4">
            <h4 className="text-sm font-bold tracking-widest uppercase mb-6 text-foreground/40">The Newsletter</h4>
            <div className="flex gap-0">
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-transparent border-b border-foreground/10 px-0 py-2 focus:outline-none focus:border-primary w-full font-serif text-lg placeholder:text-foreground/30" 
              />
              <button className="border-b border-foreground/10 px-4 py-2 hover:text-primary transition-colors text-sm uppercase tracking-widest font-bold">Join</button>
            </div>
          </div>
        </div>
        
        <div className="editorial-rule border-white/20 border-t-white/20 mb-8 opacity-20"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-foreground/40 text-sm font-bold tracking-widest uppercase">
          <p>© {new Date().getFullYear()} Festiva Planner</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-foreground transition-colors">Instagram</a>
            <a href="#" className="hover:text-foreground transition-colors">Pinterest</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
