"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trophy, Gift, Calendar, History, Shield, Car, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/useUserStore";

export default function ProfilePage() {
  const { user, isLoading } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <div className="min-h-[60vh] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  const xpProgress = Math.min((user.xp / 1000) * 100, 100);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
       {/* Gamification Header Bar */}
       <Card className="mb-10 overflow-hidden border-2 border-primary/20 bg-card shadow-2xl shadow-primary/5 min-h-[160px] relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2" />
          <CardContent className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 justify-between z-10">
             <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center border-4 border-primary shadow-lg overflow-hidden">
                   {user.photoURL ? (
                     <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                   ) : (
                     <span className="text-4xl font-extrabold">{user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}</span>
                   )}
                </div>
                <div>
                   <h1 className="text-3xl md:text-4xl font-black mb-1">{user.displayName || "Usuário"}</h1>
                   <p className="text-muted-foreground">{user.email}</p>
                </div>
             </div>
             
             <div className="flex-1 w-full max-w-md bg-secondary/30 p-6 rounded-2xl border border-border/50">
               <div className="flex justify-between items-end mb-3">
                 <div>
                    <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-1 block">Nível Atual</span>
                    <Badge variant="default" className="text-lg py-1 px-4 shadow-md bg-primary border-none text-primary-foreground">
                       <Trophy className="w-4 h-4 mr-2" /> {user.level === 'Bronze' ? 'Bronze' : user.level === 'Silver' ? 'Prata' : user.level === 'Gold' ? 'Ouro' : 'Platina'}
                    </Badge>
                 </div>
                 <div className="text-right">
                    <span className="text-2xl font-black text-primary">{user.xp}</span>
                    <span className="text-sm font-bold text-muted-foreground ml-1">XP</span>
                 </div>
               </div>
               
               <div className="relative w-full h-3 bg-secondary rounded-full overflow-hidden mb-2">
                 <div 
                   className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary/80 to-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.8)]" 
                   style={{ width: `${xpProgress}%` }}
                 />
               </div>
               <p className="text-xs text-right text-muted-foreground font-medium">
                 {1000 - user.xp > 0 ? `Faltam ${1000 - user.xp} XP para Próximo Nível` : 'Nível Máximo Atingido!'}
               </p>
             </div>
          </CardContent>
       </Card>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Rewards/Perks */}
          <div className="space-y-6 lg:col-span-1">
             <h2 className="text-2xl font-bold tracking-tight">Benefícios Ativos</h2>
             <Card className="border-border/50 shadow-md">
                <CardHeader>
                   <CardTitle className="flex items-center gap-2"><Gift className="text-primary w-5 h-5"/> Suas Vantagens</CardTitle>
                   <CardDescription>Aplicadas automaticamente no carrinho.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="flex items-start gap-4 p-3 bg-secondary/50 rounded-lg">
                     <Shield className="w-8 h-8 text-primary shrink-0" />
                     <div>
                       <h4 className="font-bold">15% Off em Peças</h4>
                       <p className="text-sm text-muted-foreground">Desconto exclusivo para membros Ouro.</p>
                     </div>
                   </div>
                   <div className="flex items-start gap-4 p-3 bg-secondary/50 rounded-lg">
                     <Car className="w-8 h-8 text-primary shrink-0" />
                     <div>
                       <h4 className="font-bold">2 Lavagens Grátis</h4>
                       <p className="text-sm text-muted-foreground">Disponível para resgate a qualquer momento.</p>
                     </div>
                   </div>
                   <div className="flex items-start gap-4 p-3 bg-secondary/50 rounded-lg">
                     <Star className="w-8 h-8 text-primary shrink-0" />
                     <div>
                       <h4 className="font-bold">Agendamento Prioritário</h4>
                       <p className="text-sm text-muted-foreground">Pule a fila ao agendar manutenções.</p>
                     </div>
                   </div>
                </CardContent>
             </Card>
          </div>

          {/* History & Vehicles */}
          <div className="space-y-8 lg:col-span-2">
             <div>
                 <h2 className="text-2xl font-bold tracking-tight mb-6">Histórico de Serviços</h2>
                <Card className="border-border/50 shadow-md">
                  <CardContent className="p-0">
                    <div className="divide-y divide-border">
                       {[1, 2].map((_, i) => (
                         <div key={i} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                           <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                               <Calendar className="w-5 h-5 text-primary" />
                             </div>
                             <div>
                               <h4 className="font-bold">Lavagem Detalhada Premium</h4>
                               <p className="text-sm text-muted-foreground">Out 12, 2025 • 2023 Tesla Model S</p>
                             </div>
                           </div>
                           <div className="flex items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                             <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 px-3 py-1 font-bold">+50 XP</Badge>
                             <Button variant="ghost" size="sm">Ver Fatura</Button>
                           </div>
                         </div>
                       ))}
                    </div>
                  </CardContent>
                </Card>
             </div>
             
             <div>
                  <h2 className="text-2xl font-bold tracking-tight mb-6 flex items-center gap-2"><History className="w-6 h-6"/> Veículos Salvos</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card className="bg-muted/50 border-dashed border-2 flex items-center justify-center h-48 cursor-pointer hover:bg-muted/80 transition-colors group">
                       <div className="text-center group-hover:scale-105 transition-transform">
                          <Car className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                          <p className="font-bold text-muted-foreground">Buscar no Marketplace</p>
                       </div>
                    </Card>
                 </div>
             </div>
          </div>
       </div>
    </div>
  );
}
