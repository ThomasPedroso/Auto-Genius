import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Map, Settings2, Shield, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden w-full pt-12 md:pt-24 lg:pt-32 xl:pt-48 pb-12 md:pb-24 lg:pb-32 bg-background">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/10 to-background"></div>
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary opacity-20 blur-[100px]"></div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
          <Badge className="mb-6 px-4 py-1 text-sm rounded-full backdrop-blur-md bg-secondary/30 border-primary/20 text-primary uppercase font-bold tracking-wider">
            Descubra o futuro da mobilidade
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 max-w-4xl text-foreground">
            Sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-foreground">Experiência Automotiva</span> Definitiva
          </h1>
          <p className="max-w-[700px] text-lg md:text-xl text-muted-foreground mb-12 font-medium leading-relaxed">
            Compre veículos premium, adquira peças autênticas, agende serviços qualificados e ganhe recompensas exclusivas enquanto usa a plataforma.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link href="/marketplace">
              <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 group font-semibold shadow-lg shadow-primary/20">
                Explorar Marketplace
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/parts">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 border-2 font-semibold">
                Loja de Peças
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Value Proposition Grid */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Por que escolher a Auto-Genius?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Nós simplificamos tudo relacionado ao seu carro, combinando mercado de veículos, peças e oficina em uma plataforma unificada.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Search className="w-10 h-10 text-primary" />}
              title="Marketplace Inteligente"
              description="Navegue por veículos de alto padrão com filtros avançados e recomendações por IA ajustadas ao seu estilo."
            />
            <FeatureCard 
              icon={<Settings2 className="w-10 h-10 text-primary" />}
              title="Loja Automotiva Completa"
              description="Encontre componentes de alta performance do nosso enorme catálogo de peças originais e exclusivas."
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-10 h-10 text-primary" />}
              title="Serviço de Confiança e Recompensas"
              description="Agende manutenções sem esforço e ganhe XP a cada transação para desbloquear benefícios Platina."
            />
          </div>
        </div>
      </section>

      {/* Gamification Teaser Section */}
      <section className="py-32 relative overflow-hidden bg-background">
         <div className="absolute right-0 top-0 -z-10 m-auto h-[400px] w-[400px] rounded-full bg-primary/10 blur-[120px]"></div>
         <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-16">
            <div className="md:w-1/2 space-y-6">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Suba de Nível com seu Carro</h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Junte-se ao nosso programa de fidelidade exclusivo. A cada compra ou serviço você ganha XP. Desbloqueie níveis de Bronze a Platina por vantagens incríveis.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3"><Shield className="text-primary w-6 h-6" /><span className="text-lg font-medium">Lavagem de Carro Grátis</span></li>
                <li className="flex items-center gap-3"><Map className="text-primary w-6 h-6" /><span className="text-lg font-medium">Prioridade no Agendamento da Oficina</span></li>
                <li className="flex items-center gap-3"><Settings2 className="text-primary w-6 h-6" /><span className="text-lg font-medium">Até 20% de desconto em Peças</span></li>
              </ul>
              <Button size="lg" className="mt-8 shadow-xl shadow-primary/20">Cadastrar e Começar a Ganhar</Button>
            </div>
            
            {/* Gamification Mockup Card */}
            <div className="md:w-1/2 w-full">
               <Card className="p-8 border-2 shadow-2xl bg-card border-border/50 relative transform md:rotate-2 hover:rotate-0 transition-all duration-300">
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-tr from-primary to-accent-foreground rounded-full blur-xl opacity-50 blur-[30px]" />
                  <CardContent className="p-0 space-y-8">
                     <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">Nível Atual</p>
                          <h3 className="text-3xl font-black bg-gradient-to-r from-yellow-500 to-amber-600 text-transparent bg-clip-text">Membro Ouro</h3>
                        </div>
                        <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center border-4 border-yellow-500">
                           <div className="font-bold text-xl uppercase">U</div>
                        </div>
                     </div>
                     
                     <div className="space-y-2">
                        <div className="flex justify-between text-sm font-semibold">
                           <span>3,450 XP</span>
                           <span className="text-muted-foreground">Faltam 1,550 XP para Platina</span>
                        </div>
                        <div className="w-full bg-secondary h-3 rounded-full overflow-hidden">
                           <div className="bg-primary h-full w-[69%] rounded-full shadow-[0_0_10px_rgba(var(--primary),0.8)]"></div>
                        </div>
                     </div>

                     <div className="pt-4 border-t border-border">
                        <p className="text-sm font-bold mb-3 uppercase tracking-wider text-muted-foreground">Benefícios Ativos</p>
                        <div className="flex gap-2 flex-wrap">
                           <Badge variant="secondary">15% Off Peças</Badge>
                           <Badge variant="secondary">Oficina Expressa</Badge>
                           <Badge variant="secondary">Café Cortesia</Badge>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </div>
         </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-card group">
      <CardContent className="p-8 text-center flex flex-col items-center">
        <div className="w-20 h-20 rounded-2xl bg-secondary mb-6 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-inner">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
