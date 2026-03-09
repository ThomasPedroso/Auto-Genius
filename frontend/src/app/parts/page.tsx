"use client";

import { useState } from "react";
import { Search, ShoppingCart, Info, Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";

const PARTS = [
  { id: "p1", name: "High-Performance Brake Kit", price: 850, category: "Brakes", rating: 4.8, reviews: 124, imageUrl: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=600" },
  { id: "p2", name: "Forged Carbon Fiber Spoiler", price: 1200, category: "Exterior", rating: 4.9, reviews: 56, imageUrl: "https://images.unsplash.com/photo-1599388147690-366ee9fec87e?auto=format&fit=crop&q=80&w=600" },
  { id: "p3", name: "Premium Synthetic Motor Oil", price: 45, category: "Maintenance", rating: 4.7, reviews: 890, imageUrl: "https://images.unsplash.com/photo-1635832049187-57351fc37fbd?auto=format&fit=crop&q=80&w=600" },
  { id: "p4", name: "Cold Air Intake System", price: 340, category: "Performance", rating: 4.6, reviews: 210, imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=600" },
  { id: "p5", name: "LED Matrix Headlights (Pair)", price: 1500, category: "Lighting", rating: 5.0, reviews: 34, imageUrl: "https://images.unsplash.com/photo-1549420087-9bcfe4953c8f?auto=format&fit=crop&q=80&w=600" },
  { id: "p6", name: "Adjustable Coilover Suspension", price: 1800, category: "Suspension", rating: 4.9, reviews: 112, imageUrl: "https://images.unsplash.com/photo-1605374826135-2637a8de97c7?auto=format&fit=crop&q=80&w=600" }
];

export default function PartsStore() {
  const addItem = useCartStore(state => state.addItem);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Performance", "Exterior", "Interior", "Lighting", "Brakes", "Suspension", "Maintenance"];

  const handleAddToCart = (part: any) => {
    addItem({
      id: part.id,
      name: part.name,
      price: part.price,
      imageUrl: part.imageUrl,
      category: part.category
    });
    toast.success(`${part.name} added to cart!`);
  };

  const filteredParts = activeCategory === "All" 
    ? PARTS 
    : PARTS.filter(p => p.category === activeCategory);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="bg-secondary/40 rounded-3xl p-8 mb-12 shadow-sm border border-border/50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-secondary to-background">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-center">Parts & Accessories Store</h1>
        <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto text-lg">
          Upgrade your vehicle with our selection of premium OEM and high-performance aftermarket parts. Earn XP with every purchase.
        </p>
        
        <div className="max-w-2xl mx-auto relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search parts by name, OEM number, or vehicle..." 
              className="pl-12 h-14 text-lg rounded-full shadow-lg border-primary/20 bg-background/90 focus-visible:ring-primary backdrop-blur-sm"
            />
            <Button className="absolute right-1.5 rounded-full h-11 px-6 shadow-md shadow-primary/20 hover:scale-105 transition-transform">
              Find Parts
            </Button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto pb-4 mb-8 gap-3 scrollbar-hide">
        {categories.map(cat => (
          <Button 
            key={cat} 
            variant={cat === activeCategory ? "default" : "outline"}
            className={`rounded-full whitespace-nowrap font-medium ${cat === activeCategory ? 'shadow-md shadow-primary/20' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Parts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredParts.map(part => (
          <Card key={part.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-border/40 hover:border-primary/40 bg-card flex flex-col h-full">
            <div className="relative h-48 w-full bg-secondary/20 p-4 flex items-center justify-center overflow-hidden">
               <Badge className="absolute top-3 right-3 z-10 bg-background/80 text-foreground backdrop-blur-md shadow-sm border-border">
                 {part.category}
               </Badge>
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img 
                 src={part.imageUrl} 
                 alt={part.name}
                 className="object-cover w-full h-full rounded-md mix-blend-multiply dark:mix-blend-normal transform group-hover:scale-110 transition-transform duration-500"
               />
            </div>
            
            <CardContent className="p-5 flex-1 flex flex-col pt-6">
               <div className="flex gap-1 mb-2">
                 <Star className="w-4 h-4 fill-primary text-primary" />
                 <span className="text-xs font-bold">{part.rating}</span>
                 <span className="text-xs text-muted-foreground">({part.reviews})</span>
               </div>
               <h3 className="text-lg font-bold leading-tight mb-2 line-clamp-2">{part.name}</h3>
               <div className="mt-auto pt-4 flex items-end justify-between">
                 <div>
                   <span className="text-xs text-muted-foreground block mb-0.5">Price</span>
                   <span className="text-2xl font-black text-primary">${part.price.toLocaleString()}</span>
                 </div>
                 <div className="text-xs font-semibold text-green-500 bg-green-500/10 px-2 py-1 rounded">
                   +{(part.price * 0.1).toFixed(0)} XP
                 </div>
               </div>
            </CardContent>
            
            <CardFooter className="p-5 pt-0 border-t border-border/20 mt-2 gap-2">
               <Button onClick={() => handleAddToCart(part)} className="w-full font-bold shadow-sm flex gap-2 group-hover:bg-primary/90 transition-colors">
                 <ShoppingCart className="w-4 h-4" /> Add to Cart
               </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
