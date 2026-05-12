import { useListPlans } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, MapPin, Search, Filter } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";

export default function VendorExplorer() {
  const { data: plans, isLoading } = useListPlans();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [vendors, setVendors] = useState<any[]>([]);
  const [isLoadingVendors, setIsLoadingVendors] = useState(true);

  useEffect(() => {
    fetch("/api/vendors")
      .then(res => res.json())
      .then(data => {
        setVendors(data);
        setIsLoadingVendors(false);
      })
      .catch(err => {
        console.error("Failed to fetch vendors:", err);
        setIsLoadingVendors(false);
      });
  }, []);

  const categories = Array.from(new Set(vendors.map(v => v.category)));

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.tagline.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || v.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-12 px-6 max-w-7xl mx-auto space-y-16">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="display-headline text-5xl mb-4">The Cast</h1>
        <p className="text-foreground/60 font-serif italic text-xl">Browse our curated directory of premier vendors discovered by the AI.</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-black/5">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <Input 
            placeholder="Search vendors..." 
            className="pl-12 bg-transparent border-none focus-visible:ring-0 text-lg font-serif" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <button 
            className={`pill-button px-6 py-2 text-sm whitespace-nowrap ${!selectedCategory ? 'pill-primary' : 'pill-outline'}`}
            onClick={() => setSelectedCategory(null)}
          >
            All Categories
          </button>
          {categories.map(cat => (
            <button 
              key={cat}
              className={`pill-button px-6 py-2 text-sm whitespace-nowrap ${selectedCategory === cat ? 'pill-primary' : 'pill-outline'}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Vendor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredVendors.map((vendor, i) => (
          <Card key={i} className="bg-background border border-black/5 shadow-[8px_8px_0px_rgba(0,0,0,0.05)] rounded-[2rem] p-8 hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_rgba(0,0,0,0.1)] transition-all group overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary via-secondary/50 to-transparent"></div>
            <div className="flex items-start justify-between gap-3 mb-6">
              <div>
                <h3 className="font-serif text-3xl font-bold group-hover:text-primary transition-colors">{vendor.name}</h3>
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

      {filteredVendors.length === 0 && (
        <div className="py-32 text-center">
          <Filter className="w-12 h-12 text-foreground/10 mx-auto mb-6" />
          <p className="text-2xl font-serif italic text-foreground/40">No vendors matching your search.</p>
        </div>
      )}
    </div>
  );
}
