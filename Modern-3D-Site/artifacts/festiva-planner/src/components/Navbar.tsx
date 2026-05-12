import { Link, useLocation } from "wouter";
import { Sparkles, ArrowRight, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('festiva_auth') === 'true';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('festiva_auth');
    // Force a re-render/reload since we are using a simple localStorage check
    window.dispatchEvent(new Event('storage'));
    setLocation('/');
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/vendors", label: "Vendors" },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-12 flex items-center justify-between transition-all duration-500",
        scrolled
          ? "nav-glass py-3 shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
          : "bg-transparent"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2.5 group">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Sparkles className="text-primary w-6 h-6" />
          </motion.div>
          <span className="font-serif font-bold text-xl tracking-[0.15em] text-foreground">FESTIVA</span>
          <span className="hidden md:inline-flex items-center ml-1 px-2 py-0.5 text-[9px] font-bold tracking-[0.2em] uppercase bg-primary/8 text-primary rounded-full border border-primary/10">AI</span>
        </Link>
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-10 text-[13px] font-medium tracking-wide text-foreground/60">
        {navLinks.map((link) => (
          <Link 
            key={link.href} 
            href={link.href}
            className={cn(
              "nav-link uppercase tracking-[0.12em]",
              location === link.href && "active"
            )}
          >
            {link.label}
            <span className="nav-dot" />
          </Link>
        ))}
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-5">
        {isAuthenticated ? (
          <motion.button 
            onClick={handleSignOut}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/40 hover:text-accent transition-colors hidden md:block"
          >
            Sign Out
          </motion.button>
        ) : (
          <Link href="/auth">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/50 hover:text-primary transition-colors hidden md:block"
            >
              Sign In
            </motion.button>
          </Link>
        )}
        <Link href="/auth">
          <motion.button 
            className="pill-button pill-primary px-6 py-2.5 hidden md:flex text-sm gap-2"
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            Start Planning <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </Link>
        
        {/* Mobile Toggle */}
        <motion.button 
          className="md:hidden p-2 text-foreground" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          whileTap={{ scale: 0.9 }}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, y: 0, backdropFilter: "blur(24px)" }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full left-0 right-0 bg-background/90 backdrop-blur-2xl border-b border-black/5 p-8 flex flex-col gap-5 md:hidden shadow-xl"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link 
                  href={link.href}
                  className={cn(
                    "text-lg font-medium tracking-wide",
                    location === link.href ? "text-primary" : "text-foreground/70"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            {isAuthenticated ? (
              <button 
                onClick={() => {
                  handleSignOut();
                  setIsMobileMenuOpen(false);
                }}
                className="text-lg font-medium text-foreground/70 text-left"
              >
                Sign Out
              </button>
            ) : (
              <Link 
                href="/auth"
                className="text-lg font-medium text-foreground/70"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
            <Link href="/auth" onClick={() => setIsMobileMenuOpen(false)}>
              <button className="pill-button pill-primary w-full py-3 mt-4">
                Start Planning <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
