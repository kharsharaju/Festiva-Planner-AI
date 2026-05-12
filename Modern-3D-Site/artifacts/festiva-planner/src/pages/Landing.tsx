import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, ArrowRight, IndianRupee, Calendar, Users, Heart, Zap } from "lucide-react";
import { useRef } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";

// Assets
import heroImg from "@/assets/images/hero-landing-highres.png";
import aiAbstract from "@/assets/images/ai-abstract.png";
import corporateGala from "@/assets/images/corporate-gala.png";
import luxuryHero from "@/assets/images/luxury-event.png";
import starDoodle from "@/assets/images/doodle-star.png";

const fadeUp = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.9, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }
  })
};

export default function Landing() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, 250]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.25]);

  return (
    <div ref={containerRef}>
      {/* ═══ HERO ═══ */}
      <section className="relative h-[100svh] min-h-[720px] w-full flex items-start justify-center pt-12 lg:pt-16 pb-16 overflow-hidden px-4">
        {/* Background Illustration — high contrast */}
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ y: yParallax }}
        >
          <img src={heroImg} alt="" className="w-full h-full object-cover" />
        </motion.div>

        {/* Floating AI Particles */}
        <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-primary/20"
              style={{ left: `${15 + i * 18}%`, top: `${20 + (i % 3) * 25}%` }}
              animate={{ y: [0, -20, 0], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center">
          {/* AI Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/50 backdrop-blur-xl border border-white/30 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.04)] depth-1">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-primary animate-ping" />
              </div>
              <span className="text-[10px] md:text-xs font-bold tracking-[0.25em] text-foreground/60 uppercase">AI Orchestrated</span>
              <Zap className="w-3 h-3 text-primary" />
            </div>
          </motion.div>

          {/* Subheading */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
            <div className="text-sm font-bold tracking-[0.35em] text-foreground/40 mb-6 uppercase">
              YOUR PERSONAL EVENT CONCIERGE
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2} className="relative">
            <h1 className="display-headline text-5xl md:text-6xl lg:text-7xl leading-[1.1] mb-6 text-foreground">
              Plan your <br className="hidden md:block" /> <span className="italic font-light bg-gradient-to-r from-foreground via-foreground/80 to-foreground bg-clip-text">perfect</span> event
            </h1>
          </motion.div>

          {/* Description */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
            <p className="text-lg md:text-xl text-foreground/80 mb-10 max-w-2xl mx-auto font-medium font-serif leading-relaxed">
              Experience the future of event planning. Enter a few details, and our AI will instantly design your entire celebration.
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4} className="flex flex-col sm:flex-row gap-4 relative justify-center">
            {/* Handwritten annotation */}
            <div className="hidden md:block absolute -left-32 top-1/2 -translate-y-1/2 -rotate-6">
              <motion.span
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                className="handwriting text-accent text-2xl"
              >← start here</motion.span>
            </div>

            <Link href="/auth">
              <motion.button
                className="cta-magnetic rounded-full px-8 py-4 text-lg text-primary-foreground font-serif italic flex items-center gap-3 group"
                whileHover={{ scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="cta-shimmer" />
                Start Planning <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
              </motion.button>
            </Link>
            <motion.button
              className="pill-button pill-outline px-8 py-4 text-lg bg-white/60 backdrop-blur-md border border-black/8 depth-2"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Experience
            </motion.button>
          </motion.div>
        </div>

        {/* AI Orb — Signature Element (bottom-right corner) */}
        <motion.div
          className="absolute bottom-24 right-12 z-[5] hidden lg:block"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 1, type: "spring" }}
        >
          <div className="ai-orb opacity-60" />
        </motion.div>
      </section>

      {/* ═══ SOCIAL PROOF ═══ */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="border-y border-black/6 py-8 relative z-10 section-depth bg-gradient-to-r from-transparent via-background/80 to-transparent"
      >
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
          <span className="text-[10px] font-bold tracking-[0.3em] text-foreground/35 uppercase">FEATURED IN</span>
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-xl md:text-2xl font-serif italic text-foreground/50">
            {["Vogue", "Brides", "The Knot", "Forbes", "Condé Nast"].map((name, i) => (
              <motion.span
                key={name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="hover:text-foreground/80 transition-colors cursor-default"
              >
                {i > 0 && <span className="text-primary/30 mr-6 md:mr-12">•</span>}
                {name}
              </motion.span>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" className="py-40 relative z-10 px-6 bg-gradient-to-b from-background via-background to-[hsl(35_35%_94%)]">
        <div className="max-w-7xl mx-auto relative">
          <motion.img
            src={starDoodle}
            alt=""
            className="absolute -top-24 -left-12 w-24 h-24 opacity-30"
            animate={{ rotate: [0, 10, -5, 0], scale: [1, 1.05, 0.97, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
          />

          {/* Architecture Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <span className="text-sm font-bold tracking-[0.3em] text-primary mb-6 block uppercase">THE ARCHITECTURE</span>
              <h2 className="display-headline text-6xl md:text-8xl mb-8 leading-[0.9]">Intelligent <br />Gathering</h2>
              <p className="text-foreground/60 text-2xl font-serif leading-relaxed max-w-xl italic">
                "We don't just plan events; we architect experiences that linger in memory, powered by the precision of AI."
              </p>
              <div className="editorial-rule w-32 my-12"></div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-square rounded-[3rem] overflow-hidden depth-4 group"
            >
              <img src={aiAbstract} alt="AI Orchestration" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-primary/10 to-transparent mix-blend-overlay" />
              <div className="absolute bottom-12 left-12 right-12 p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl depth-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-white/60 text-xs font-bold tracking-widest uppercase">Live</span>
                </div>
                <p className="text-white font-serif text-lg">AI Orchestration Engine v4.6 running...</p>
              </div>
            </motion.div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Smart Budgeting — Full Width */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="md:col-span-12">
              <Card className="glass-card rounded-[3rem] p-10 md:p-16 h-full relative overflow-hidden group border-primary/15 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent"></div>
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700"></div>
                <div className="absolute top-8 right-12 text-8xl font-serif font-bold text-primary/5 group-hover:text-primary/10 transition-colors duration-500">01</div>
                <div className="flex flex-col md:flex-row gap-12 items-center relative z-10">
                  <div className="flex-1 space-y-6">
                    <motion.div
                      className="w-20 h-20 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 rotate-[-3deg]"
                      whileHover={{ rotate: 0, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <IndianRupee className="w-10 h-10" />
                    </motion.div>
                    <h3 className="display-headline text-5xl">Smart Budgeting</h3>
                    <p className="text-foreground/60 text-xl leading-relaxed font-serif italic">AI-optimized budget allocations based on your priorities and industry standards. We break down every dollar so you can celebrate without the stress.</p>
                  </div>
                  <div className="flex-1 bg-white/50 backdrop-blur-md p-10 rounded-[2rem] border border-black/5 depth-2">
                    <div className="space-y-6">
                      {[
                        { label: "Catering", val: "w-[85%]", pct: "85", color: "bg-primary" },
                        { label: "Venue", val: "w-[65%]", pct: "65", color: "bg-secondary-foreground" },
                        { label: "Decor", val: "w-[45%]", pct: "45", color: "bg-accent" }
                      ].map((item, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between text-xs font-bold tracking-widest uppercase text-foreground/40">
                            <span>{item.label}</span>
                            <span>{item.pct}%</span>
                          </div>
                          <div className="h-2 bg-black/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: item.pct + "%" }}
                              transition={{ duration: 1, delay: i * 0.2 }}
                              className={`h-full ${item.color} rounded-full`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Instant Timelines */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }} className="md:col-span-6">
              <Card className="glass-card rounded-[3rem] p-10 h-full relative group border-secondary/20 bg-gradient-to-br from-secondary/10 via-transparent to-transparent overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary via-secondary/50 to-transparent"></div>
                <div className="absolute top-8 right-12 text-7xl font-serif font-bold text-secondary/10 group-hover:text-secondary/20 transition-colors duration-500">02</div>
                <div className="relative z-10">
                  <motion.div
                    className="w-16 h-16 rounded-2xl bg-secondary text-secondary-foreground flex items-center justify-center mb-8 shadow-lg shadow-secondary/20 rotate-[3deg]"
                    whileHover={{ rotate: 0, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Calendar className="w-8 h-8" />
                  </motion.div>
                  <h3 className="display-headline text-4xl mb-4">Instant Timelines</h3>
                  <p className="text-foreground/60 leading-relaxed text-lg font-serif italic">Minute-by-minute schedules ensuring your event flows flawlessly from start to finish. Say goodbye to spreadsheet anxiety.</p>
                </div>
              </Card>
            </motion.div>

            {/* Curated Vendors */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} className="md:col-span-6">
              <Card className="glass-card rounded-[3rem] p-10 h-full relative group border-accent/15 bg-gradient-to-br from-accent/5 via-transparent to-transparent overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-accent/50 to-transparent"></div>
                <div className="absolute top-8 right-12 text-7xl font-serif font-bold text-accent/5 group-hover:text-accent/10 transition-colors duration-500">03</div>
                <div className="relative z-10">
                  <motion.div
                    className="w-16 h-16 rounded-2xl bg-accent text-accent-foreground flex items-center justify-center mb-8 shadow-lg shadow-accent/20 rotate-[-3deg]"
                    whileHover={{ rotate: 0, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Users className="w-8 h-8" />
                  </motion.div>
                  <h3 className="display-headline text-4xl mb-4">Curated Vendors</h3>
                  <p className="text-foreground/60 leading-relaxed text-lg font-serif italic">Personalized vendor recommendations tailored to your style, budget, and location. Hand-picked options that match your vibe.</p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ GALLERY ═══ */}
      <section className="py-32 bg-background text-foreground overflow-hidden relative border-t border-border/50">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="max-w-2xl">
              <span className="text-xs font-bold tracking-[0.5em] text-foreground/30 mb-6 block uppercase">THE CURATION</span>
              <h2 className="display-headline text-5xl md:text-7xl">Bespoke Visuals</h2>
            </motion.div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="font-serif italic text-xl text-foreground/50 max-w-sm mb-2">
              Every detail curated to perfection, from the grand architecture to the finest table setting.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="group cursor-pointer"
            >
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden mb-6 depth-3">
                <img src={corporateGala} alt="Corporate Gala" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <h4 className="text-2xl font-serif">The Executive Suite</h4>
              <p className="text-foreground/30 uppercase tracking-[0.2em] text-[10px] font-bold mt-2">Corporate Summits</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="mt-24 md:mt-48 group cursor-pointer"
            >
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden mb-6 depth-3">
                <img src={luxuryHero} alt="Luxury Dinner" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <h4 className="text-2xl font-serif">A Feast for the Senses</h4>
              <p className="text-white/30 uppercase tracking-[0.2em] text-[10px] font-bold mt-2">Private Galas</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="py-32 bg-gradient-to-b from-secondary/10 to-background border-y border-black/6 relative z-10 px-6 section-depth">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-sm font-bold tracking-[0.3em] text-foreground/40 uppercase">Word of Mouth</span>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { q: "Festiva didn't just plan our wedding, it architected a masterpiece. The vendor recommendations were spot on.", author: "Eleanor & James", event: "Lake Como Ceremony" },
              { q: "We saved thousands on our corporate retreat while upgrading the experience. The AI timeline was flawless.", author: "Marcus T.", event: "Tech Summit '24" },
              { q: "I thought I needed a year to plan our gala. Festiva gave me the blueprint in 30 seconds. Brilliant.", author: "Sarah Jenkins", event: "Charity Gala" }
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.7 }}
                className="text-center space-y-6"
              >
                <Heart className="w-6 h-6 mx-auto text-accent opacity-40" />
                <p className="text-2xl font-serif italic leading-relaxed text-foreground/80">"{t.q}"</p>
                <div>
                  <div className="font-bold uppercase tracking-[0.15em] text-sm">{t.author}</div>
                  <div className="text-foreground/40 text-sm handwriting mt-1">{t.event}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
