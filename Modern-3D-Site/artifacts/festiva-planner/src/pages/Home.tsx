import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Calendar, Users, MapPin, IndianRupee, Lightbulb, ArrowRight, Star, Heart, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlanEventBody as PlanEventBodySchema } from "@workspace/api-zod";
import type { PlanEventBody } from "@workspace/api-client-react";
import { usePlanEvent, useSavePlan, useListPlans, useGetStats, getListPlansQueryKey, getGetStatsQueryKey, getGetPlanQueryKey, useGetPlan } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";

// Assets
import heroImg from "@/assets/images/hero-landing.png";
import starDoodle from "@/assets/images/doodle-star.png";
import arrowDoodle from "@/assets/images/doodle-arrow.png";
import stampDoodle from "@/assets/images/doodle-stamp.png";
import sparkleDoodle from "@/assets/images/doodle-sparkle.png";

export default function Home() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [activePlanId, setActivePlanId] = useState<number | null>(null);
  
  const planMutation = usePlanEvent();
  const saveMutation = useSavePlan();
  
  const { data: stats } = useGetStats();
  const { data: recentPlans } = useListPlans();
  const { data: activePlanData } = useGetPlan(activePlanId!, {
    query: {
      enabled: !!activePlanId,
      queryKey: getGetPlanQueryKey(activePlanId ?? 0),
    },
  });

  const form = useForm<PlanEventBody>({
    resolver: zodResolver(PlanEventBodySchema),
    defaultValues: {
      user_text: "",
      budget: 10000,
      guests: 50,
      duration: 1,
      city: ""
    }
  });

  const onSubmit = (data: PlanEventBody) => {
    setActivePlanId(null);
    planMutation.mutate({ data }, {
      onSuccess: () => {
        setTimeout(() => {
          document.getElementById('result-view')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      },
      onError: (err) => {
        toast({ title: "Error generating plan", description: String(err), variant: "destructive" });
      }
    });
  };

  const handleSavePlan = () => {
    const planToSave = planMutation.data || activePlanData?.plan;
    if (!planToSave) return;
    
    saveMutation.mutate({ data: { plan: planToSave } }, {
      onSuccess: () => {
        toast({ title: "Plan saved successfully!", description: "You can find it in your recent plans." });
        queryClient.invalidateQueries({ queryKey: getListPlansQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
      }
    });
  };

  const currentPlan = activePlanData?.plan || planMutation.data;

  // Loading Steps
  const loadingSteps = ["Analyzing your event…", "Predicting budget allocation…", "Curating vendors…", "Building timeline…", "Generating advice…"];
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  
  useEffect(() => {
    if (planMutation.isPending) {
      const interval = setInterval(() => {
        setLoadingStepIndex(prev => (prev + 1) % loadingSteps.length);
      }, 1200);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [planMutation.isPending]);

  // Parallax
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <div className="min-h-[100dvh] w-full text-foreground relative overflow-x-hidden selection:bg-primary/30" ref={containerRef}>
      <div className="bg-noise pointer-events-none" />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-black/5 py-4 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="text-primary w-6 h-6" />
          <span className="font-serif font-bold text-xl tracking-wider text-foreground">FESTIVA</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground/80">
          <a href="#plan" className="hover:text-foreground transition-colors">Plan</a>
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#recent" className="hover:text-foreground transition-colors">Saved</a>
        </div>
        <button className="pill-button pill-primary px-6 py-2" onClick={() => document.getElementById('plan')?.scrollIntoView({ behavior: 'smooth' })}>
          Start Planning <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[100svh] min-h-[720px] w-full flex items-center justify-center pt-24 pb-16 overflow-hidden px-4">
        {/* Parallax Hero Image */}
        <motion.div
          className="absolute inset-0 z-0 flex items-center justify-center opacity-90 mix-blend-multiply md:scale-110 pointer-events-none"
          style={{ y: yParallax }}
        >
          <img src={heroImg} alt="Celebration illustration" className="w-full h-full object-cover opacity-50" />
        </motion.div>
        {/* Soft vignette behind headline for readability */}
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,rgba(250,246,238,0.9)_0%,rgba(250,246,238,0.6)_30%,rgba(250,246,238,0.15)_60%,rgba(250,246,238,0)_75%)]" />

        <div className="relative z-10 text-center max-w-6xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            {/* AI Powered Badge - Refined for premium SaaS feel */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -top-16 left-0 md:-top-20 md:-left-12 flex items-center gap-2 px-4 py-2 bg-white/40 backdrop-blur-md border border-white/20 rounded-full shadow-sm z-20"
            >
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-foreground/60 uppercase">AI Orchestrated</span>
            </motion.div>

            <div className="text-sm font-bold tracking-widest text-foreground/50 mb-6 uppercase">
              YOUR PERSONAL EVENT CONCIERGE
            </div>
            
            <h1 className="display-headline text-7xl md:text-8xl lg:text-[10rem] leading-[0.95] mb-8 text-foreground">
              Plan your <br className="hidden md:block"/> <span className="italic font-light">perfect</span> event
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <p className="text-xl md:text-2xl text-foreground/80 mb-12 max-w-3xl mx-auto font-medium font-serif">
              Experience the future of event planning. Enter a few details, and our AI will instantly design your entire celebration.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 relative"
          >
            {/* Handwriting annotation */}
            <div className="hidden md:block absolute -left-32 top-1/2 -translate-y-1/2 -rotate-6">
              <span className="handwriting text-accent text-3xl">← start here</span>
            </div>

            <button className="pill-button pill-primary px-10 py-5 text-xl hover:translate-y-[-2px] active:translate-y-[0px] transition-all" onClick={() => document.getElementById('plan')?.scrollIntoView({ behavior: 'smooth' })}>
              Start Planning <ArrowRight className="w-5 h-5 ml-3" />
            </button>
            <button className="pill-button pill-outline px-10 py-5 text-xl bg-white/50 backdrop-blur-sm" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
              Explore Experience
            </button>
          </motion.div>
        </div>
      </section>

      {/* Featured In / Social Proof Strip */}
      <section className="border-y border-black/10 bg-background/50 py-8 relative z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
          <span className="text-xs font-bold tracking-widest text-foreground/50 uppercase">FEATURED IN</span>
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-xl md:text-2xl font-serif italic text-foreground/60">
            <span>Vogue</span>
            <span className="text-primary">•</span>
            <span>Brides</span>
            <span className="text-primary">•</span>
            <span>The Knot</span>
            <span className="text-primary">•</span>
            <span>Forbes</span>
            <span className="text-primary">•</span>
            <span>Condé Nast</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 relative z-10 px-6 bg-background">
        <div className="max-w-6xl mx-auto relative">
          <img src={starDoodle} alt="" className="absolute -top-16 -left-8 w-16 h-16 opacity-60 animate-pulse" />
          <img src={sparkleDoodle} alt="" className="absolute -bottom-16 -right-8 w-24 h-24 opacity-60 rotate-12" />

          <div className="text-center mb-24 relative">
            <span className="text-sm font-bold tracking-widest text-foreground/50 mb-4 uppercase block">THE EXPERIENCE</span>
            <h2 className="display-headline text-5xl md:text-7xl mb-6">Intelligent Planning</h2>
            <div className="editorial-rule w-24 mx-auto my-8"></div>
            <p className="text-foreground/70 max-w-2xl mx-auto text-xl font-serif">Everything you need to orchestrate an unforgettable experience, generated in seconds with meticulous detail.</p>
          </div>
          
          {/* Asymmetric layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="md:col-span-12">
              <Card className="glass-card rounded-[2rem] p-10 md:p-16 h-full hover:shadow-xl transition-shadow duration-500 relative overflow-hidden group">
                <div className="absolute top-8 right-8 text-6xl font-serif font-light text-foreground/10 group-hover:text-primary/20 transition-colors">01</div>
                <div className="flex flex-col md:flex-row gap-12 items-center">
                  <div className="flex-1 space-y-6">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                      <IndianRupee className="text-primary w-8 h-8" />
                    </div>
                    <h3 className="display-headline text-4xl">Smart Budgeting</h3>
                    <p className="text-foreground/70 text-lg leading-relaxed">AI-optimized budget allocations based on your priorities and industry standards. We break down every dollar so you can celebrate without the stress.</p>
                  </div>
                  <div className="flex-1 bg-secondary/10 p-8 rounded-3xl border border-secondary/20">
                    <div className="space-y-4">
                      {[1,2,3].map(i => (
                        <div key={i} className="h-8 bg-background rounded-md border border-black/5 flex items-center px-4">
                          <div className="h-2 w-1/3 bg-primary/30 rounded-full"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="md:col-span-6">
              <Card className="glass-card rounded-[2rem] p-10 h-full hover:shadow-xl transition-shadow duration-500 relative group">
                <div className="absolute top-8 right-8 text-5xl font-serif font-light text-foreground/10 group-hover:text-secondary/20 transition-colors">02</div>
                <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mb-8 border border-secondary/30">
                  <Calendar className="text-secondary w-8 h-8" />
                </div>
                <h3 className="display-headline text-3xl mb-4">Instant Timelines</h3>
                <p className="text-foreground/70 leading-relaxed text-lg">Minute-by-minute schedules ensuring your event flows flawlessly from start to finish. Say goodbye to spreadsheet anxiety.</p>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="md:col-span-6">
              <Card className="glass-card rounded-[2rem] p-10 h-full hover:shadow-xl transition-shadow duration-500 relative group">
                <div className="absolute top-8 right-8 text-5xl font-serif font-light text-foreground/10 group-hover:text-accent/20 transition-colors">03</div>
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-8 border border-accent/30">
                  <Users className="text-accent w-8 h-8" />
                </div>
                <h3 className="display-headline text-3xl mb-4">Curated Vendors</h3>
                <p className="text-foreground/70 leading-relaxed text-lg">Personalized vendor recommendations tailored to your style, budget, and location. Hand-picked options that match your vibe.</p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Plan Generator Section */}
      <section id="plan" className="py-32 relative z-10 px-6 bg-secondary/5">
        <div className="max-w-4xl mx-auto relative">
          <img src={arrowDoodle} alt="" className="absolute top-12 -left-16 w-20 h-20 opacity-80" />
          
          <Card className="glass-card rounded-[3rem] border-black/10 overflow-hidden relative shadow-2xl bg-background">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-accent"></div>
            
            <div className="absolute top-12 right-12 hidden md:block">
              <div className="relative">
                <img src={stampDoodle} alt="" className="w-24 h-24 opacity-30" />
                <div className="absolute inset-0 flex items-center justify-center handwriting text-xl text-secondary rotate-[-12deg]">Free</div>
              </div>
            </div>

            <CardContent className="p-8 md:p-16">
              <div className="text-center mb-16">
                <span className="text-sm font-bold tracking-widest text-foreground/50 mb-4 uppercase block">THE STUDIO</span>
                <h2 className="display-headline text-5xl md:text-6xl mb-4">Design Your Event</h2>
                <p className="text-foreground/70 text-xl font-serif italic">Tell us what you're celebrating.</p>
              </div>

              {planMutation.isPending ? (
                <div className="py-24 flex flex-col items-center justify-center text-center">
                  <div className="relative w-32 h-32 mb-12">
                    <div className="absolute inset-0 rounded-full border-t-4 border-primary border-r-4 border-r-transparent animate-spin" />
                    <div className="absolute inset-4 rounded-full border-b-4 border-secondary border-l-4 border-l-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                    </div>
                  </div>
                  <motion.p 
                    key={loadingStepIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-3xl font-serif font-medium text-foreground italic"
                  >
                    {loadingSteps[loadingStepIndex]}
                  </motion.p>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
                    <FormField
                      control={form.control}
                      name="user_text"
                      render={({ field }) => (
                        <FormItem className="relative">
                          <div className="absolute -left-32 top-1/2 hidden lg:block">
                            <span className="handwriting text-2xl text-accent rotate-[-5deg] block">← describe your dream</span>
                          </div>
                          <Label className="text-foreground font-bold text-lg flex items-center gap-1">
                            Event Vision <span className="text-accent">*</span>
                          </Label>
                          <FormControl>
                            <Textarea 
                              placeholder="A romantic garden wedding in autumn with a string quartet, 50 guests, focus on great food..." 
                              className="bg-transparent border-b-2 border-x-0 border-t-0 border-black/20 rounded-none focus-visible:ring-0 focus-visible:border-primary min-h-[120px] resize-none text-foreground text-2xl font-serif px-0 py-4 shadow-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <Label className="text-foreground font-bold text-sm uppercase tracking-wider flex items-center gap-2 mb-2">
                              <MapPin className="w-4 h-4 text-primary" /> Location <span className="text-accent">*</span>
                            </Label>
                            <FormControl>
                              <Input placeholder="City, State" className="bg-transparent border-b-2 border-x-0 border-t-0 border-black/20 rounded-none focus-visible:ring-0 focus-visible:border-primary text-foreground text-xl px-0 py-2 shadow-none" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <Label className="text-foreground font-bold text-sm uppercase tracking-wider flex items-center gap-2 mb-2">
                              <IndianRupee className="w-4 h-4 text-secondary" /> Total Budget (₹) <span className="text-accent">*</span>
                            </Label>
                            <FormControl>
                              <Input type="number" min={0} className="bg-transparent border-b-2 border-x-0 border-t-0 border-black/20 rounded-none focus-visible:ring-0 focus-visible:border-secondary text-foreground text-xl px-0 py-2 shadow-none" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="guests"
                        render={({ field }) => (
                          <FormItem>
                            <Label className="text-foreground font-bold text-sm uppercase tracking-wider flex items-center gap-2 mb-2">
                              <Users className="w-4 h-4 text-primary" /> Guest Count <span className="text-accent">*</span>
                            </Label>
                            <FormControl>
                              <Input type="number" min={1} className="bg-transparent border-b-2 border-x-0 border-t-0 border-black/20 rounded-none focus-visible:ring-0 focus-visible:border-primary text-foreground text-xl px-0 py-2 shadow-none" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <Label className="text-foreground font-bold text-sm uppercase tracking-wider flex items-center gap-2 mb-2">
                              <Clock className="w-4 h-4 text-secondary" /> Duration (Days) <span className="text-accent">*</span>
                            </Label>
                            <FormControl>
                              <Input type="number" min={1} className="bg-transparent border-b-2 border-x-0 border-t-0 border-black/20 rounded-none focus-visible:ring-0 focus-visible:border-secondary text-foreground text-xl px-0 py-2 shadow-none" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="pt-8">
                      <motion.button 
                        type="submit" 
                        className="w-full h-20 text-2xl font-serif italic bg-primary text-primary-foreground border-none rounded-lg shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-4"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        Generate the Master Plan <ArrowRight className="w-6 h-6" />
                      </motion.button>
                    </div>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Result View */}
      {currentPlan && (
        <section id="result-view" className="py-32 relative z-10 px-6 bg-background border-t-4 border-double border-black/20">
          <div className="max-w-6xl mx-auto space-y-24">
            
            {/* Luxury Dossier Header */}
            <div className="relative p-8 md:p-20 overflow-hidden rounded-2xl bg-white/40 backdrop-blur-xl border border-white/20 shadow-2xl">
              {/* Subtle Gold Accents */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0"></div>
              
              <div className="text-center max-w-4xl mx-auto relative z-10">
                <motion.span 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="text-xs font-bold tracking-[0.4em] text-primary uppercase block mb-8"
                >
                  Master Plan Finalized
                </motion.span>
                
                <h2 className="display-headline text-6xl md:text-8xl mb-10 leading-tight text-foreground">
                  {currentPlan.eventTitle}
                </h2>
                
                <div className="w-12 h-px bg-foreground/20 mx-auto mb-10"></div>
                
                <p className="text-xl md:text-2xl font-serif italic text-foreground/70 mb-14 px-4 leading-relaxed max-w-3xl mx-auto">
                  {currentPlan.summary}
                </p>


                <div className="flex flex-wrap justify-center gap-4">
                  <button className="pill-button pill-outline px-8 py-4 bg-background" onClick={() => {
                    setActivePlanId(null);
                    document.getElementById('plan')?.scrollIntoView({ behavior: 'smooth' });
                  }}>
                    Start Anew
                  </button>
                  <button className="pill-button pill-primary px-8 py-4 shadow-[4px_4px_0px_rgba(0,0,0,1)]" onClick={handleSavePlan} disabled={saveMutation.isPending}>
                    {saveMutation.isPending ? "Archiving..." : "Save to Archive"} <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>

            {/* Key Details Strip - Journal Style */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-6 border-y border-black/10 py-12 relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-black/10 hidden md:block"></div>
              <div className="flex flex-col items-center text-center px-4">
                <span className="text-foreground/50 text-xs font-bold tracking-widest uppercase mb-4">Budget</span>
                <span className="text-4xl font-serif font-light text-primary">₹{currentPlan.budget.toLocaleString()}</span>
              </div>
              <div className="flex flex-col items-center text-center px-4 relative">
                <div className="absolute right-0 top-1/4 bottom-1/4 w-px bg-black/10 hidden md:block"></div>
                <span className="text-foreground/50 text-xs font-bold tracking-widest uppercase mb-4">Guests</span>
                <span className="text-4xl font-serif font-light text-foreground">{currentPlan.guests}</span>
              </div>
              <div className="flex flex-col items-center text-center px-4 relative">
                <div className="absolute right-0 top-1/4 bottom-1/4 w-px bg-black/10 hidden md:block"></div>
                <span className="text-foreground/50 text-xs font-bold tracking-widest uppercase mb-4">Location</span>
                <span className="text-4xl font-serif font-light text-foreground">{currentPlan.city}</span>
              </div>
              <div className="flex flex-col items-center text-center px-4">
                <span className="text-foreground/50 text-xs font-bold tracking-widest uppercase mb-4">Duration</span>
                <span className="text-4xl font-serif font-light text-foreground">{currentPlan.duration} Day{currentPlan.duration > 1 ? 's' : ''}</span>
              </div>
            </div>

            {/* AI Advice - Editorial Blockquote */}
            <div className="bg-secondary/10 border-l-4 border-secondary p-8 md:p-12">
              <div className="flex items-center gap-4 mb-8">
                <Sparkles className="w-8 h-8 text-secondary" />
                <h3 className="text-2xl font-bold uppercase tracking-widest text-foreground">The Director's Notes</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
                {currentPlan.aiAdvice.map((advice, i) => (
                  <div key={i} className="relative">
                    <span className="absolute -left-6 top-0 text-3xl font-serif text-secondary/40 italic">"</span>
                    <p className="text-xl font-serif italic text-foreground/80 leading-relaxed">{advice}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              {/* Budget Allocation */}
              <div className="lg:col-span-5 space-y-12 relative">
                <div className="absolute -right-8 top-1/4 hidden lg:block">
                  <span className="handwriting text-2xl text-primary rotate-[10deg] block">← perfectly balanced</span>
                </div>
                
                <h3 className="display-headline text-5xl border-b-2 border-black pb-4">The Ledger</h3>
                
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={currentPlan.budgetAllocation} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={3} dataKey="amount" stroke="none">
                        {currentPlan.budgetAllocation.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={[`hsl(var(--primary))`, `hsl(var(--secondary))`, `hsl(var(--accent))`, `#2b2b2b`, `#8ba898`][index % 5]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => `₹${value.toLocaleString()}`}
                        contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '2px solid black', borderRadius: '0px', color: 'black', fontFamily: 'var(--font-serif)' }}
                        itemStyle={{ color: 'black', fontWeight: 'bold' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-4">
                  {currentPlan.budgetAllocation.map((cat, i) => (
                    <div key={i} className="flex justify-between items-end border-b border-black/10 pb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: [`hsl(var(--primary))`, `hsl(var(--secondary))`, `hsl(var(--accent))`, `#2b2b2b`, `#8ba898`][i % 5] }} />
                        <span className="font-bold text-lg uppercase tracking-wider">{cat.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-serif text-2xl">₹{cat.amount.toLocaleString()}</div>
                        <div className="text-sm text-foreground/50 font-bold handwriting">{cat.percent}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline & Vendors */}
              <div className="lg:col-span-7 space-y-16">
                
                <Tabs defaultValue="timeline" className="w-full">
                  <TabsList className="w-full bg-transparent border-b-2 border-black rounded-none p-0 h-auto justify-start gap-12 mb-12">
                    <TabsTrigger value="timeline" className="rounded-none border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary text-3xl font-serif pb-4 px-0 bg-transparent">The Itinerary</TabsTrigger>
                    <TabsTrigger value="vendors" className="rounded-none border-b-4 border-transparent data-[state=active]:border-secondary data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-secondary text-3xl font-serif pb-4 px-0 bg-transparent">The Cast</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="timeline" className="mt-0">
                    <div className="space-y-12 border-l-2 border-black/20 pl-8 ml-4">
                      {currentPlan.timeline.map((item, i) => (
                        <div key={i} className="relative group">
                          <div className="absolute -left-[41px] top-1 w-6 h-6 rounded-full bg-secondary border-4 border-background"></div>
                          <div className="mb-2">
                            <span className="handwriting text-2xl text-secondary">{item.when}</span>
                          </div>
                          <h4 className="display-headline text-3xl mb-3">{item.title}</h4>
                          <p className="text-lg text-foreground/80 font-serif italic">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="vendors" className="mt-0">
                    <div className="space-y-12">
                      {Object.entries(
                        currentPlan.vendors.reduce((acc, vendor) => {
                          if (!acc[vendor.category]) acc[vendor.category] = [];
                          acc[vendor.category].push(vendor);
                          return acc;
                        }, {} as Record<string, typeof currentPlan.vendors>)
                      ).map(([category, vendors]) => (
                        <div key={category} className="space-y-6">
                          <h4 className="font-bold text-sm tracking-[0.2em] uppercase text-foreground/50 border-b border-black/20 pb-2">{category}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {vendors.map((vendor, i) => (
                              <Card key={i} className="bg-background border border-black shadow-[4px_4px_0px_rgba(0,0,0,0.1)] rounded-none p-6">
                                <div className="flex items-start justify-between gap-3 mb-4">
                                  <h5 className="font-serif text-2xl font-bold">{vendor.name}</h5>
                                </div>
                                <p className="text-sm font-serif italic text-foreground/80 mb-6">{vendor.tagline}</p>
                                <div className="editorial-rule w-full mb-4"></div>
                                <div className="flex justify-between items-center text-sm font-bold">
                                  <span className="text-foreground/60 uppercase tracking-widest">{vendor.contact}</span>
                                  <span className="text-lg">~₹{vendor.price.toLocaleString()}</span>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-32 bg-secondary/10 border-y border-black/10 relative z-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-bold tracking-widest text-foreground/50 uppercase">Word of Mouth</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { q: "Festiva didn't just plan our wedding, it architected a masterpiece. The vendor recommendations were spot on.", author: "Eleanor & James", event: "Lake Como Ceremony" },
              { q: "We saved thousands on our corporate retreat while upgrading the experience. The AI timeline was flawless.", author: "Marcus T.", event: "Tech Summit '24" },
              { q: "I thought I needed a year to plan our gala. Festiva gave me the blueprint in 30 seconds. Brilliant.", author: "Sarah Jenkins", event: "Charity Gala" }
            ].map((t, i) => (
              <div key={i} className="text-center space-y-6">
                <Heart className="w-6 h-6 mx-auto text-accent opacity-50" />
                <p className="text-2xl font-serif italic leading-relaxed">"{t.q}"</p>
                <div>
                  <div className="font-bold uppercase tracking-widest text-sm">{t.author}</div>
                  <div className="text-foreground/50 text-sm handwriting mt-1">{t.event}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Plans */}
      {Array.isArray(recentPlans) && recentPlans.length > 0 && (
        <section id="recent" className="py-32 relative z-10 px-6 bg-background">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="display-headline text-5xl mb-6">The Archives</h2>
              <div className="editorial-rule w-24 mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentPlans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className="bg-background border border-black/10 rounded-none overflow-hidden cursor-pointer hover:border-black transition-all duration-500 group relative"
                  onClick={() => {
                    setActivePlanId(plan.id);
                    document.getElementById('result-view')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <div className="h-40 bg-secondary/5 border-b border-black/5 p-6 flex flex-col justify-end relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 opacity-10 font-serif text-8xl font-bold group-hover:scale-110 transition-transform">{plan.eventType.charAt(0)}</div>
                    <span className="text-xs font-bold uppercase tracking-widest text-foreground/60 mb-2">
                      {plan.eventType}
                    </span>
                    <h3 className="font-serif text-2xl leading-tight group-hover:text-primary transition-colors">{plan.eventTitle}</h3>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-3 text-sm font-medium uppercase tracking-wider text-foreground/70">
                      <div className="flex items-center justify-between border-b border-black/5 pb-2">
                        <span>Location</span> <span className="text-foreground">{plan.city}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-black/5 pb-2">
                        <span>Guests</span> <span className="text-foreground">{plan.guests}</span>
                      </div>
                      <div className="flex items-center justify-between pb-1">
                        <span>Budget</span> <span className="text-foreground">₹{plan.budget.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-24 bg-background text-foreground relative z-10 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-16">
            <div className="md:col-span-5">
              <div className="flex items-center gap-2 mb-8">
                <Sparkles className="text-primary w-8 h-8" />
                <span className="font-serif font-bold text-3xl tracking-widest">FESTIVA</span>
              </div>
              <p className="text-white/60 font-serif italic text-xl max-w-sm">
                Elevating the art of gathering through artificial intelligence and impeccable taste.
              </p>
            </div>
            <div className="md:col-span-3">
              <h4 className="text-sm font-bold tracking-widest uppercase mb-6 text-white/40">Navigation</h4>
              <ul className="space-y-4 font-serif text-lg">
                <li><a href="#plan" className="hover:text-primary transition-colors">Start Planning</a></li>
                <li><a href="#features" className="hover:text-primary transition-colors">Experience</a></li>
                <li><a href="#recent" className="hover:text-primary transition-colors">Archives</a></li>
              </ul>
            </div>
            <div className="md:col-span-4">
              <h4 className="text-sm font-bold tracking-widest uppercase mb-6 text-white/40">The Newsletter</h4>
              <div className="flex gap-0">
                <input type="email" placeholder="Your email" className="bg-transparent border-b border-white/20 px-0 py-2 focus:outline-none focus:border-primary w-full font-serif text-lg placeholder:text-white/30" />
                <button className="border-b border-white/20 px-4 py-2 hover:text-primary transition-colors text-sm uppercase tracking-widest font-bold">Join</button>
              </div>
            </div>
          </div>
          
          <div className="editorial-rule border-white/20 border-t-white/20 mb-8 opacity-20"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 text-sm font-bold tracking-widest uppercase">
            <p>© {new Date().getFullYear()} Festiva Planner</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
              <a href="#" className="hover:text-white transition-colors">Pinterest</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
