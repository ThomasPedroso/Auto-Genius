"use client";

import { useState } from "react";
import { Wrench, Settings, Droplet, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useUserStore } from "@/store/useUserStore";

const SERVICES = [
  { id: "s1", name: "Premium Detailing & Wash", icon: <Droplet className="w-8 h-8" />, price: 149, xp: 50 },
  { id: "s2", name: "Scheduled Maintenance 10k", icon: <Settings className="w-8 h-8" />, price: 299, xp: 150 },
  { id: "s3", name: "Comprehensive Diagnostics", icon: <ShieldCheck className="w-8 h-8" />, price: 199, xp: 100 },
  { id: "s4", name: "Performance Tuning", icon: <Wrench className="w-8 h-8" />, price: 599, xp: 300 }
];

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [date, setDate] = useState<string>("");
  const { addXP } = useUserStore();

  const handleBookService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !date) {
      toast.error("Please select a service and date.");
      return;
    }
    
    // Find the service xp
    const service = SERVICES.find(s => s.id === selectedService);
    
    toast.success(`Service booked successfully for ${date}! Earned ${service?.xp} XP.`);
    if (service?.xp) {
      addXP(service.xp);
    }
    
    setSelectedService(null);
    setDate("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Book Service</h1>
        <p className="text-muted-foreground text-lg mb-8">
          Keep your vehicle running at peak performance. Schedule expert maintenance, diagnostics, and detailing services today.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Service Selection */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">1. Select Service package</h2>
            <div className="space-y-4">
              {SERVICES.map(service => (
                <Card 
                  key={service.id} 
                  className={`cursor-pointer transition-all duration-300 border-2 ${selectedService === service.id ? 'border-primary bg-primary/5 shadow-md' : 'hover:border-primary/50 border-border/50 bg-card'}`}
                  onClick={() => setSelectedService(service.id)}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${selectedService === service.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary'}`}>
                        {service.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{service.name}</h3>
                        <div className="text-sm text-green-500 font-semibold block sm:hidden">+{service.xp} XP</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black">${service.price}</p>
                      <p className="text-xs text-green-500 font-bold hidden sm:block bg-green-500/10 px-2 py-1 rounded">+{service.xp} XP</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Appointment Details */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-6">2. Appointment & Review</h2>
            <Card className="shadow-xl shadow-primary/5 border-border/50">
              <form onSubmit={handleBookService}>
                <CardHeader>
                  <CardTitle>Schedule Appointment</CardTitle>
                  <CardDescription>We will confirm this time via email shortly.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Preferred Date & Time</Label>
                    <Input 
                      type="datetime-local" 
                      id="date" 
                      value={date} 
                      onChange={(e) => setDate(e.target.value)} 
                      required
                      className="bg-secondary/40 border-primary/20 h-12 text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicle">Vehicle Information</Label>
                    <Input type="text" id="vehicle" placeholder="e.g. 2023 Tesla Model S" className="bg-secondary/40 h-12" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Input type="text" id="notes" placeholder="Any specific issues?" className="bg-secondary/40 h-12" />
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-4">
                  <div className="w-full bg-secondary p-4 rounded-lg flex items-center justify-between border border-border">
                    <span className="font-medium">Total Price:</span>
                    <span className="text-2xl font-black text-primary">
                      ${selectedService ? SERVICES.find(s => s.id === selectedService)?.price : "0"}
                    </span>
                  </div>
                  <Button type="submit" size="lg" className="w-full h-14 text-lg font-bold group" disabled={!selectedService}>
                    {selectedService ? (
                      <span className="flex items-center gap-2 text-primary-foreground group-hover:scale-105 transition-transform"><CheckCircle2 className="w-5 h-5"/> Confirm Booking</span>
                    ) : "Select a Service First"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
