"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Filter, SlidersHorizontal, ChevronDown, MapPin, Gauge, CalendarDays, BatteryCharging } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

// Mock data for initial UI
const CARS = [
  { id: 1, make: "Tesla", model: "Model S Plaid", year: 2023, price: 89990, mileage: 12000, type: "Electric", imageUrl: "https://images.unsplash.com/photo-1617704548623-340376564e68?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 2, make: "Porsche", model: "911 GT3", year: 2022, price: 185000, mileage: 5000, type: "Gasoline", imageUrl: "https://images.unsplash.com/photo-1503376713286-90f7fcb16ed5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 3, make: "Audi", model: "RS e-tron GT", year: 2024, price: 147100, mileage: 1500, type: "Electric", imageUrl: "https://images.unsplash.com/photo-1620891549027-942fdc95d3f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 4, make: "BMW", model: "M4 Competition", year: 2023, price: 82200, mileage: 8000, type: "Gasoline", imageUrl: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 5, make: "Mercedes-Benz", model: "G63 AMG", year: 2022, price: 215000, mileage: 18000, type: "Gasoline", imageUrl: "https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 6, make: "Rivian", model: "R1T", year: 2023, price: 79000, mileage: 6000, type: "Electric", imageUrl: "https://images.unsplash.com/photo-1662999142646-7c006859e9ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }
];

export default function Marketplace() {
  const [priceRange, setPriceRange] = useState([50000, 250000]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Veículos Premium</h1>
          <p className="text-muted-foreground mt-2">Encontre sua próxima máquina de dirigir definitiva.</p>
        </div>
        <div className="w-full md:w-auto flex gap-2">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar marca, modelo ou palavras-chave..." className="pl-10 h-12 rounded-full border-primary/20 bg-secondary/50 focus-visible:ring-primary" />
          </div>
          <Button size="icon" variant="outline" className="h-12 w-12 rounded-full md:hidden">
            <Filter className="h-5 w-5 text-primary" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="hidden md:block w-full lg:w-1/4 space-y-8">
          <Card className="border-border/50 sticky top-24 shadow-lg shadow-background/50">
            <CardContent className="p-6 space-y-8">
              <div className="flex items-center gap-2 border-b border-border pb-4">
                <SlidersHorizontal className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold">Filtros Avançados</h2>
              </div>
              
              <div className="space-y-4">
                <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Faixa de Preço</Label>
                <Slider 
                  defaultValue={[50000, 250000]} 
                  max={300000} 
                  step={1000} 
                  onValueChange={(val) => setPriceRange(val as number[])}
                  className="py-4"
                />
                <div className="flex justify-between text-sm font-medium">
                  <span>${priceRange[0].toLocaleString()}</span>
                  <span>${priceRange[1].toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-4">
                 <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Marca</Label>
                 <div className="space-y-2">
                   {["Tesla", "Porsche", "Audi", "BMW", "Mercedes-Benz", "Rivian"].map(make => (
                     <div key={make} className="flex items-center gap-2">
                        <input type="checkbox" id={make} className="rounded border-primary/50 text-primary focus:ring-primary accent-primary w-4 h-4 cursor-pointer" />
                        <label htmlFor={make} className="text-sm font-medium leading-none cursor-pointer">{make}</label>
                     </div>
                   ))}
                 </div>
              </div>

              <div className="space-y-4">
                 <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Tipo de Veículo</Label>
                 <div className="flex flex-wrap gap-2">
                   <Badge variant="default" className="cursor-pointer">Todos</Badge>
                   <Badge variant="outline" className="cursor-pointer hover:bg-secondary">Combustão</Badge>
                   <Badge variant="outline" className="cursor-pointer hover:bg-secondary flex gap-1 items-center">
                     <BatteryCharging className="w-3 h-3" /> Elétrico
                   </Badge>
                   <Badge variant="outline" className="cursor-pointer hover:bg-secondary">Híbrido</Badge>
                 </div>
              </div>

              <Button className="w-full h-12 font-bold shadow-md shadow-primary/20">Aplicar Filtros</Button>
            </CardContent>
          </Card>
        </div>

        {/* Listings Grid */}
        <div className="w-full lg:w-3/4">
          <div className="flex justify-between items-center mb-6">
             <span className="text-sm text-muted-foreground font-medium">Exibindo {CARS.length} veículos</span>
             <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-1 font-semibold">
               Ordenar por: Destaque <ChevronDown className="h-4 w-4" />
             </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {CARS.map((car) => (
              <Card key={car.id} className="overflow-hidden group hover:shadow-2xl transition-all duration-300 border-border/40 hover:border-primary/50 bg-card flex flex-col h-full">
                <div className="relative h-56 md:h-64 overflow-hidden w-full">
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent z-10" />
                  <div className="absolute top-4 left-4 z-20">
                    <Badge className={car.type === "Electric" ? "bg-green-500/20 text-green-500 hover:bg-green-500/30 font-bold border-green-500/50" : "font-bold bg-background/80 text-foreground backdrop-blur-md"}>
                      {car.type === "Electric" ? "Elétrico" : "Combustão"}
                    </Badge>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={car.imageUrl} 
                    alt={`${car.make} ${car.model}`}
                    className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  />
                  <div className="absolute bottom-4 left-4 z-20">
                    <h3 className="text-xl font-black text-white drop-shadow-md">{car.make} {car.model}</h3>
                  </div>
                </div>
                <CardContent className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-black text-primary">${car.price.toLocaleString()}</span>
                    <Badge variant="secondary" className="font-semibold">{car.year}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-muted-foreground mt-auto">
                    <div className="flex items-center gap-1.5 font-medium"><Gauge className="w-4 h-4 text-primary" /> {car.mileage.toLocaleString()} mi</div>
                    <div className="flex items-center gap-1.5 font-medium"><CalendarDays className="w-4 h-4 text-primary" /> {car.year}</div>
                  </div>
                </CardContent>
                <CardFooter className="p-5 pt-0 border-t border-border/30 mt-4">
                  <Button className="w-full font-bold group-hover:shadow-[0_0_15px_rgba(var(--primary),0.5)] transition-all">
                    Ver Detalhes
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 flex justify-center">
            <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 border-2 font-semibold">
              Carregar Mais Veículos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
