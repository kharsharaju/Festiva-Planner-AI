import { useParams, useLocation } from "wouter";
import { useGetPlan, useSavePlan } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, IndianRupee, Users, MapPin, Clock, CheckCircle2, Circle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function Result() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { data: planData, isLoading } = useGetPlan(Number(id));
  const saveMutation = useSavePlan();
  
  // Interactive Timeline State
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (index: number) => {
    const newSteps = new Set(completedSteps);
    if (newSteps.has(index)) newSteps.delete(index);
    else newSteps.add(index);
    setCompletedSteps(newSteps);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Sparkles className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!planData?.plan) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-6">
        <p className="text-2xl font-serif italic text-foreground/40">Dossier not found.</p>
        <button className="pill-button pill-primary px-6 py-2" onClick={() => setLocation("/")}>Go Home</button>
      </div>
    );
  }

  const currentPlan = planData.plan;

  return (
    <div className="py-20 px-6 max-w-6xl mx-auto space-y-24">
      
      {/* Luxury Dossier Header */}
      <div className="relative p-8 md:p-20 overflow-hidden rounded-2xl bg-white/40 backdrop-blur-xl border border-white/20 shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0"></div>
        
        <div className="text-center max-w-4xl mx-auto relative z-10">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-bold tracking-[0.4em] text-primary uppercase block mb-8"
          >
            Master Plan Dossier
          </motion.span>
          
          <h2 className="display-headline text-6xl md:text-8xl mb-10 leading-tight text-foreground">
            {currentPlan.eventTitle}
          </h2>
          
          <div className="w-12 h-px bg-foreground/20 mx-auto mb-10"></div>
          
          <p className="text-xl md:text-2xl font-serif italic text-foreground/70 mb-14 px-4 leading-relaxed max-w-3xl mx-auto">
            {currentPlan.summary}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button className="pill-button pill-outline px-8 py-4 bg-background" onClick={() => setLocation("/setup")}>
              Plan New Event
            </button>
            <button className="pill-button pill-primary px-8 py-4 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              Export as PDF <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>

      {/* Details Grid */}
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

      {/* AI Advice */}
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

      {/* Tabs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left Col: Budget */}
        <div className="lg:col-span-5 space-y-12">
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

        {/* Right Col: Tabs */}
        <div className="lg:col-span-7">
          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="w-full bg-transparent border-b-2 border-black rounded-none p-0 h-auto justify-start gap-12 mb-12">
              <TabsTrigger value="timeline" className="rounded-none border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary text-3xl font-serif pb-4 px-0 bg-transparent">The Itinerary</TabsTrigger>
              <TabsTrigger value="vendors" className="rounded-none border-b-4 border-transparent data-[state=active]:border-secondary data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-secondary text-3xl font-serif pb-4 px-0 bg-transparent">The Cast</TabsTrigger>
            </TabsList>
            
            <TabsContent value="timeline" className="mt-0">
              <div className="space-y-12 border-l-2 border-black/20 pl-8 ml-4">
                {currentPlan.timeline.map((item, i) => (
                  <div 
                    key={i} 
                    className="relative group cursor-pointer"
                    onClick={() => toggleStep(i)}
                  >
                    <div className={`absolute -left-[41px] top-1 w-6 h-6 rounded-full border-4 border-background transition-colors duration-300 ${completedSteps.has(i) ? 'bg-primary' : 'bg-secondary'}`}>
                      {completedSteps.has(i) && <CheckCircle2 className="w-full h-full text-white p-0.5" />}
                    </div>
                    <div className="mb-2 flex justify-between items-center">
                      <span className="handwriting text-2xl text-secondary">{item.when}</span>
                      {completedSteps.has(i) && <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Completed</span>}
                    </div>
                    <h4 className={`display-headline text-3xl mb-3 transition-opacity ${completedSteps.has(i) ? 'opacity-40 line-through' : 'opacity-100'}`}>{item.title}</h4>
                    <p className={`text-lg font-serif italic transition-opacity ${completedSteps.has(i) ? 'opacity-30' : 'opacity-80'}`}>{item.description}</p>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {vendors.map((vendor, i) => (
                        <Card key={i} className="bg-background border border-black/5 shadow-[8px_8px_0px_rgba(0,0,0,0.05)] rounded-[2rem] p-8 hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_rgba(0,0,0,0.1)] transition-all group overflow-hidden relative">
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary via-secondary/50 to-transparent"></div>
                          <div className="flex items-start justify-between gap-3 mb-6">
                            <div>
                              <h5 className="font-serif text-3xl font-bold group-hover:text-primary transition-colors">{vendor.name}</h5>
                              <div className="flex gap-1 text-accent mt-2">
                                {[...Array(5)].map((_, star) => (
                                  <Sparkles key={star} className={`w-3.5 h-3.5 ${star < Math.floor(vendor.rating) ? 'fill-accent' : 'opacity-20'}`} />
                                ))}
                                <span className="text-[10px] font-bold text-foreground/40 ml-1">{vendor.rating}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">{vendor.category}</span>
                              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary mt-1">
                                <MapPin className="w-3 h-3" /> {vendor.city}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-lg font-serif italic text-foreground/80 mb-8 leading-relaxed">"{vendor.tagline}"</p>
                          
                          <div className="editorial-rule w-full mb-6 opacity-10"></div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/30 mb-1">Contact Details</span>
                              <span className="text-sm font-bold text-foreground/60">{vendor.contact}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/30 mb-1 block">Est. Price</span>
                              <span className="text-2xl font-serif font-light text-primary">₹{vendor.price.toLocaleString()}</span>
                            </div>
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
  );
}
