import { motion } from "framer-motion";
import { Sparkles, ArrowRight, MapPin, IndianRupee, Users, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlanEventBody as PlanEventBodySchema } from "@workspace/api-zod";
import type { PlanEventBody } from "@workspace/api-client-react";
import { usePlanEvent } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

// Assets
import arrowDoodle from "@/assets/images/doodle-arrow.png";
import stampDoodle from "@/assets/images/doodle-stamp.png";

export default function Setup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const planMutation = usePlanEvent();
  
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
    planMutation.mutate({ data }, {
      onSuccess: (response) => {
        // Assume response contains an ID or we can navigate to a result view
        // For now, let's just navigate to a placeholder or back to home with the plan state
        // Actually, the Result page should probably take an ID from the saved plans
        // But since /plan-event returns the plan directly, we can use state or a temporary ID
        toast({ title: "Plan generated!", description: "Redirecting to your master plan..." });
        // In a real app, we'd save it first and get an ID. 
        // For this demo, let's simulate a redirection to the dashboard or a result view.
        setTimeout(() => setLocation("/dashboard"), 2000);
      },
      onError: (err) => {
        toast({ title: "Error generating plan", description: String(err), variant: "destructive" });
      }
    });
  };

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

  return (
    <div className="py-20 px-6 bg-secondary/5 min-h-screen flex items-center">
      <div className="max-w-4xl mx-auto w-full relative">
        <img src={arrowDoodle} alt="" className="absolute top-12 -left-16 w-20 h-20 opacity-80 hidden lg:block" />
        
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
                      className="w-full h-24 text-2xl font-serif italic bg-primary text-primary-foreground border-none rounded-2xl shadow-xl hover:brightness-110 hover:translate-y-[-4px] transition-all flex items-center justify-center gap-4 group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Orchestrate the Vision <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </motion.button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
